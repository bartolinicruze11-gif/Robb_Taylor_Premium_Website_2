import { createClient } from "npm:@supabase/supabase-js@2.105.3";
/** Verify with Auth first; never trust user_metadata or an unverified JWT. */
export async function isAdminRequest(req: Request): Promise<boolean> {
  const token = req.headers.get("authorization")?.replace(/^Bearer /i, "") ?? "";
  if (token.split(".").length !== 3) return false;
  const client = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!,
    { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error } = await client.auth.getUser(token);
  if (error || user?.app_metadata?.role !== "admin") return false;
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)).aal === "aal2";
  } catch { return false; }
}
