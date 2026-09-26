import { createClient } from '@supabase/supabase-js';

export function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Admin service configuration is incomplete');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function authenticateAdmin(request: Request) {
  const token = /^Bearer (.+)$/i.exec(request.headers.get('authorization') ?? '')?.[1];
  if (!token) return null;
  const db = serviceClient();
  const { data: { user }, error } = await db.auth.getUser(token);
  if (error || !user || user.app_metadata?.role !== 'robb_admin') return null;
  // getUser verifies the token first. The signed AAL claim proves MFA completion.
  let aal: string | undefined;
  try {
    aal = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8')).aal;
  } catch { return null; }
  if (aal !== 'aal2') return null;
  return { db, actor: user };
}

export const privateHeaders = { 'Cache-Control': 'no-store' };
export const isId = (value: unknown): value is string =>
  typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
