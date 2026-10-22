BEGIN;
CREATE TABLE IF NOT EXISTS public.notification_outbox (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
 kind text NOT NULL CHECK (kind IN ('internal','customer','automation')),
 payload jsonb NOT NULL,
 message jsonb,
 idempotency_key text NOT NULL UNIQUE,
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','sent','dead')),
 attempt_count integer NOT NULL DEFAULT 0,
 next_retry_at timestamptz NOT NULL DEFAULT now(),
 last_attempt_at timestamptz,
 lease_token uuid,
 lease_until timestamptz,
 provider_message_id text,
 failure_class text,
 dead_lettered_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 sent_at timestamptz
);
ALTER TABLE public.notification_outbox ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.notification_outbox FROM anon, authenticated;
GRANT ALL ON public.notification_outbox TO service_role;
CREATE INDEX IF NOT EXISTS notification_outbox_due ON public.notification_outbox(next_retry_at) WHERE status = 'pending';
CREATE OR REPLACE FUNCTION public.enqueue_quote_notification() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
 INSERT INTO public.notification_outbox(quote_id,kind,payload,idempotency_key)
 VALUES (NEW.id,'internal',to_jsonb(NEW), NEW.id::text || ':internal:v1') ON CONFLICT DO NOTHING;
 IF NEW.email IS NOT NULL AND NEW.email <> '' AND NEW.email <> 'quickquote@emtdemolition.co.nz' THEN
  INSERT INTO public.notification_outbox(quote_id,kind,payload,idempotency_key)
  VALUES (NEW.id,'customer',to_jsonb(NEW), NEW.id::text || ':customer:v1') ON CONFLICT DO NOTHING;
 END IF;
 
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.enqueue_quote_notification() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS quote_notification_outbox ON public.quotes;
CREATE TRIGGER quote_notification_outbox AFTER INSERT ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.enqueue_quote_notification();

-- Claim under a row lock, increment attempts once, recover crashed workers after a five minute lease.
CREATE OR REPLACE FUNCTION public.claim_quote_notifications(batch_size integer DEFAULT 20)
RETURNS SETOF public.notification_outbox LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
 -- Resend retains idempotency keys for 24 hours. Stop before that window closes;
 -- an operator must reconcile provider logs before manually requeueing old jobs.
 UPDATE public.notification_outbox SET status='dead', dead_lettered_at=now(), failure_class='idempotency_window_expired', lease_token=NULL, lease_until=NULL
 WHERE status IN ('pending','processing') AND last_attempt_at IS NOT NULL AND created_at < now()-interval '23 hours';
 UPDATE public.notification_outbox SET status='dead', dead_lettered_at=now(), failure_class='attempts_exhausted', lease_token=NULL, lease_until=NULL
 WHERE status IN ('pending','processing') AND attempt_count >= 8 AND (lease_until IS NULL OR lease_until < now());
 RETURN QUERY
 WITH due AS (
  SELECT id FROM public.notification_outbox
  WHERE (status='pending' AND next_retry_at<=now()) OR (status='processing' AND lease_until<now())
  ORDER BY next_retry_at FOR UPDATE SKIP LOCKED LIMIT LEAST(GREATEST(batch_size,1),50)
 )
 UPDATE public.notification_outbox n SET status='processing', lease_token=gen_random_uuid(), lease_until=now()+interval '5 minutes', last_attempt_at=now(), attempt_count=n.attempt_count+1
 FROM due WHERE n.id=due.id RETURNING n.*;
END $$;
REVOKE ALL ON FUNCTION public.claim_quote_notifications(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_quote_notifications(integer) TO service_role;
COMMIT;
