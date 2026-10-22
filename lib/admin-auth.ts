import { createClient } from '@supabase/supabase-js';

export async function isAdminRequest(request: Request): Promise<boolean> {
  const token = request.headers.get('authorization')?.replace(/^Bearer /i, '') ?? '';
  if (!token || token.split('.').length !== 3) return false;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  const auth = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error } = await auth.auth.getUser(token);
  if (error || user?.app_metadata?.role !== 'admin') return false;
  try {
    // Only inspect claims after Auth has verified this exact token.
    const claims = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
    return claims.aal === 'aal2';
  } catch { return false; }
}
