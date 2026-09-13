/*
  # Revoke UPDATE and DELETE on quotes from the public roles

  Finding F12: `anon` and `authenticated` held UPDATE and DELETE on
  `public.quotes` with all columns updatable. No policy uses either command, so
  RLS denies them today, but the grants are surface with no purpose and become
  immediately exploitable if a permissive policy is ever added.

  The website only inserts (verified: the only client calls are
  `supabase.from('quotes').insert(...)` in the contact wizard and the home page
  CTA). All admin reads, updates and deletes go through the admin-quotes edge
  function using the service role, which is unaffected by these grants.

  SELECT is intentionally left in place: it is already denied by RLS (the table
  has no SELECT policy) and revoking it would break any read the app later adds.
*/

REVOKE UPDATE, DELETE ON public.quotes FROM anon;
REVOKE UPDATE, DELETE ON public.quotes FROM authenticated;
