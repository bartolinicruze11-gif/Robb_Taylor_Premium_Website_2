'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const AdminToken = createContext('');
export function useAdminToken() { return useContext(AdminToken); }
export function AdminAccess({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState('');
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [factorId, setFactorId] = useState('');
  const [secret, setSecret] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    // Remove credentials saved by the former shared-password login.
    sessionStorage.removeItem('emt_admin_token');
    async function refresh() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!active) return;
        setSignedIn(!!session);
        setFactorId('');
        if (!session) { setToken(''); return; }
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || user?.app_metadata?.role !== 'admin') {
          setToken('');
          setError('This account does not have admin access.');
          await supabase.auth.signOut();
          return;
        }
        const { data: assurance, error: assuranceError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (assuranceError) throw assuranceError;
        if (assurance?.currentLevel === 'aal2') {
          if (active) { setToken(session.access_token); setSecret(''); }
          return;
        }
        const { data: factors, error: factorError } = await supabase.auth.mfa.listFactors();
        if (factorError) throw factorError;
        if (active) setFactorId(factors?.totp.find(f => f.status === 'verified')?.id ?? '');
      } catch { if (active) setError('Unable to verify your session. Please sign in again.'); }
      finally { if (active) setChecking(false); }
    }
    void refresh();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      // Defer SDK calls until the auth callback releases its lock.
      setTimeout(() => { if (active) void refresh(); }, 0);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      setPassword('');
    } catch { setError('Sign-in failed. Check your email and password.'); }
    finally { setBusy(false); }
  }
  async function enroll() {
    setBusy(true); setError('');
    try {
      // Remove abandoned, unverified enrollments before beginning a new one.
      const { data: factors } = await supabase.auth.mfa.listFactors();
      for (const f of factors?.all ?? []) {
        if (f.status === 'unverified') await supabase.auth.mfa.unenroll({ factorId: f.id });
      }
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Admin authenticator' });
      if (error || !data) throw error;
      setFactorId(data.id); setSecret(data.totp.secret);
    } catch { setError('Unable to set up the authenticator. Please try again.'); }
    finally { setBusy(false); }
  }
  async function verify(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
      if (error) throw error;
      setCode(''); setSecret('');
    } catch { setError('That code could not be verified. Enter a fresh code.'); }
    finally { setBusy(false); }
  }
  if (checking) return <p role="status" className="p-8 text-white">Checking admin access…</p>;
  if (token) return <AdminToken.Provider value={token}><div className="bg-black text-white text-right px-4 py-2"><button onClick={() => { setToken(''); void supabase.auth.signOut(); }}>Sign out</button></div>{children}</AdminToken.Provider>;
  return <main className="min-h-screen bg-[#080808] text-white flex items-center justify-center p-6">
    <div className="w-full max-w-sm space-y-5">
      <h1 className="text-2xl font-bold">Admin access</h1>
      {!signedIn ? <form onSubmit={login} className="space-y-4">
        <label className="block">Email<input required type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} className="block w-full p-3 bg-neutral-900 border border-neutral-600 rounded" /></label>
        <label className="block">Password<input required type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="block w-full p-3 bg-neutral-900 border border-neutral-600 rounded" /></label>
        <button disabled={busy} className="p-3 border rounded w-full">{busy ? 'Signing in…' : 'Sign in'}</button>
      </form> : <>
        <p>Confirm access with your authenticator app.</p>
        {!factorId ? <button disabled={busy} onClick={enroll} className="p-3 border rounded">Set up authenticator</button> : <>
          {secret && <div><p>Add this setup key to your authenticator, then enter its code:</p><code className="block break-all p-3 bg-neutral-900 select-all">{secret}</code></div>}
          <form onSubmit={verify} className="space-y-4"><label className="block">Six-digit code<input required pattern="[0-9]{6}" maxLength={6} inputMode="numeric" autoComplete="one-time-code" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} className="block w-full p-3 bg-neutral-900 border border-neutral-600 rounded" /></label><button disabled={busy} className="p-3 border rounded w-full">Verify code</button></form>
        </>}
        <button onClick={() => void supabase.auth.signOut()}>Use another account</button>
      </>}
      {error && <p role="alert" className="text-red-300">{error}</p>}
    </div>
  </main>;
}
