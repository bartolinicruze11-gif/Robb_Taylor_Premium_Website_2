/*
  # Prevent public submissions from writing the internal admin notes

  Finding F7: `admin_notes` is an operator-only field that the admin console
  presents as the team's own internal notes, but the public INSERT policy did not
  constrain it and every column was insertable. A caller could post
  `admin_notes` text that the operator would then read as a colleague's note.

  Extends the public INSERT policy's WITH CHECK to require `admin_notes = ''`.
  The column already defaults to '', so the website's form is unaffected, and
  the admin edge function writes notes with the service role, which bypasses RLS.
*/

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
    AND admin_notes = ''
  );
