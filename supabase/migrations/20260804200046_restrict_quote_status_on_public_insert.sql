/*
  # Restrict the status column on public quote submissions

  Finding F6: the public INSERT policy on `quotes` checked only that name, email
  and service were non-empty, while every column remained insertable. A caller
  hitting the REST endpoint directly could therefore choose the pipeline status
  (for example `closed`) so their submission never surfaced as a new lead, or
  fabricate `quoted` rows to poison the dashboard counters.

  1. Adds a CHECK constraint limiting `status` to the four valid values.
  2. Recreates the public INSERT policy so its WITH CHECK also requires
     `status = 'new'`. Existing rows and the admin edge function (service role,
     which bypasses RLS) are unaffected; the website's own form never sends
     `status`, so the column default of 'new' satisfies the new predicate.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.quotes'::regclass AND conname = 'quotes_status_valid'
  ) THEN
    ALTER TABLE public.quotes
      ADD CONSTRAINT quotes_status_valid
      CHECK (status IN ('new', 'reviewed', 'quoted', 'closed'));
  END IF;
END $$;

DROP POLICY IF EXISTS "Anyone can submit a quote with required fields" ON public.quotes;

CREATE POLICY "Anyone can submit a quote with required fields"
  ON public.quotes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name <> ''
    AND email <> ''
    AND service <> ''
    AND status = 'new'
  );
