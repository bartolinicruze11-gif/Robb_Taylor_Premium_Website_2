/*
  # Fix quotes INSERT policy — remove always-true check

  ## Problem
  The existing `Anyone can submit a quote` policy used `WITH CHECK (true)`,
  which unconditionally bypasses RLS for INSERT on the quotes table.

  ## Fix
  Replace the policy with one that validates required fields are non-empty.
  This ensures only legitimate quote submissions (with name, email, and service)
  are accepted, while still allowing anonymous users to submit the public form.

  ## Changes
  - Drops the old unrestricted INSERT policy
  - Adds a new INSERT policy that requires name, email, and service to be non-empty strings
*/

DROP POLICY IF EXISTS "Anyone can submit a quote" ON quotes;

CREATE POLICY "Anyone can submit a quote with required fields"
  ON quotes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name <> '' AND
    email <> '' AND
    service <> ''
  );
