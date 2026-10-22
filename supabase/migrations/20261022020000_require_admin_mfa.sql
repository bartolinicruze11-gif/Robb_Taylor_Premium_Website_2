BEGIN;
DO $block$
DECLARE t record;
BEGIN
 FOR t IN SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind='r' AND c.relrowsecurity LOOP
  EXECUTE format('DROP POLICY IF EXISTS require_admin_mfa ON public.%I', t.relname);
  EXECUTE format($policy$CREATE POLICY require_admin_mfa ON public.%I AS RESTRICTIVE FOR ALL TO authenticated USING ((auth.jwt()->'app_metadata'->>'role')='admin' AND (auth.jwt()->>'aal')='aal2') WITH CHECK ((auth.jwt()->'app_metadata'->>'role')='admin' AND (auth.jwt()->>'aal')='aal2')$policy$,t.relname);
 END LOOP;
END $block$;
COMMIT;
