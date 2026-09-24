-- Apply in staging first. The public quote form keeps its existing INSERT path.
-- Only trusted server code can read or mutate operational records.
ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('normal', 'high', 'urgent')),
  ADD COLUMN IF NOT EXISTS next_action text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS follow_up_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_contacted_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS quotes_follow_up_idx
  ON public.quotes (follow_up_at) WHERE follow_up_at IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.quote_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  actor_id uuid,
  kind text NOT NULL CHECK (kind IN ('status','priority','follow_up','note','contact')),
  detail text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS quote_activity_quote_idx ON public.quote_activity (quote_id, created_at DESC);
ALTER TABLE public.quote_activity ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.quote_notification_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL UNIQUE REFERENCES public.quotes(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','sent','failed','dead')),
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  locked_until timestamptz,
  provider_id text,
  last_error text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS quote_notification_due_idx
  ON public.quote_notification_outbox (next_attempt_at, created_at)
  WHERE status IN ('pending','failed','processing');
ALTER TABLE public.quote_notification_outbox ENABLE ROW LEVEL SECURITY;

-- Anonymous submissions cannot set internal fields or spoof notifications.
DROP POLICY IF EXISTS "Anyone can submit a quote with required fields" ON public.quotes;
CREATE POLICY "Anyone can submit a quote with required fields" ON public.quotes
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    btrim(name) <> '' AND btrim(email) <> '' AND btrim(service) <> ''
    AND status = 'new' AND admin_notes = ''
    AND priority = 'normal' AND next_action = ''
    AND follow_up_at IS NULL AND last_contacted_at IS NULL
    AND created_at BETWEEN now() - interval '5 minutes' AND now() + interval '5 minutes'
    AND updated_at BETWEEN now() - interval '5 minutes' AND now() + interval '5 minutes'
  );
REVOKE UPDATE, DELETE ON public.quotes FROM anon, authenticated;
REVOKE ALL ON public.quote_activity, public.quote_notification_outbox FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quote_activity, public.quote_notification_outbox TO service_role;

CREATE OR REPLACE FUNCTION public.enqueue_robb_quote_notification()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog AS $$
BEGIN
  INSERT INTO public.quote_notification_outbox (quote_id) VALUES (NEW.id)
  ON CONFLICT (quote_id) DO NOTHING;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS quote_notification_created ON public.quotes;
CREATE TRIGGER quote_notification_created AFTER INSERT ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.enqueue_robb_quote_notification();

-- Claim due work atomically. Expired leases recover after a worker crash.
CREATE OR REPLACE FUNCTION public.claim_robb_quote_notifications(batch_size integer DEFAULT 10)
RETURNS SETOF public.quote_notification_outbox
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog AS $$
BEGIN
  RETURN QUERY
    WITH due AS (
      SELECT q.id FROM public.quote_notification_outbox q
      WHERE ((q.status IN ('pending','failed') AND q.next_attempt_at <= now())
          OR (q.status = 'processing' AND q.locked_until < now()))
        AND q.attempts < 5
      ORDER BY q.created_at
      FOR UPDATE SKIP LOCKED
      LIMIT LEAST(GREATEST(batch_size, 1), 20)
    )
    UPDATE public.quote_notification_outbox q
    SET status = 'processing', attempts = q.attempts + 1,
        locked_until = now() + interval '3 minutes'
    FROM due WHERE q.id = due.id RETURNING q.*;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_robb_quote_notifications(integer)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_robb_quote_notifications(integer) TO service_role;
