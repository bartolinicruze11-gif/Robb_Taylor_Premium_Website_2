// Quote notifications are dispatched only through the transactional outbox.
Deno.serve((_req: Request) => new Response(JSON.stringify({ error: 'This endpoint has been retired' }), { status: 410, headers: { 'Content-Type': 'application/json' } }));
