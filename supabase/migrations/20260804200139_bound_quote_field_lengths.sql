/*
  # Bound the length of every publicly submittable quote field

  Finding F9: every column on `quotes` is unconstrained `text`, and neither the
  website form nor the database enforced a maximum. A caller could post
  multi-megabyte values through the REST endpoint repeatedly, inflating the
  database and making the admin console (which selects every row) unusable.

  1. Adds generous but finite length CHECK constraints on the nine submittable
     columns and on admin_notes.
  2. Adds a permissive email-shape check so the address is usable as a reply-to.

  Limits are far above real submissions (the largest existing value is 66
  characters), so no existing row is affected and legitimate submissions pass.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.quotes'::regclass AND conname = 'quotes_field_lengths'
  ) THEN
    ALTER TABLE public.quotes
      ADD CONSTRAINT quotes_field_lengths CHECK (
        length(name)        <= 200
        AND length(company) <= 200
        AND length(email)   <= 320
        AND length(phone)   <= 40
        AND length(service) <= 120
        AND length(location)<= 200
        AND length(budget)  <= 120
        AND length(timeline)<= 120
        AND length(message) <= 5000
        AND length(admin_notes) <= 10000
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.quotes'::regclass AND conname = 'quotes_email_shape'
  ) THEN
    ALTER TABLE public.quotes
      ADD CONSTRAINT quotes_email_shape CHECK (
        email ~ '^[^[:space:]@<>"'']+@[A-Za-z0-9.-]+\.[A-Za-z]{2,24}$'
      );
  END IF;
END $$;
