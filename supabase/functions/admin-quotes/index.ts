// Deploy after the new admin UI, API routes, named accounts and MFA have been
// verified. This retires the legacy shared-password service-role endpoint.
Deno.serve((request: Request) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://www.robbtaylor.co.nz',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Apikey',
    'Cache-Control': 'no-store',
  };
  if (request.method === 'OPTIONS') return new Response(null, { headers });
  return new Response(JSON.stringify({ error: 'Legacy admin API retired' }), { status: 410, headers });
});
