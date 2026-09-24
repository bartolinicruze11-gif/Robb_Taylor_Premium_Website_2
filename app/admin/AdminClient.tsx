'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import type { Session } from '@supabase/supabase-js';
import { supabase, type Quote, type QuoteStatus } from '@/lib/supabase';
import { attentionScore, exportQuotes, workspaceMetrics } from '@/lib/admin-intelligence';
import { Activity, AlertCircle, BarChart3, Bell, CalendarClock, Check, Download, Inbox, LogOut, Mail, Phone, RefreshCw, Search, ShieldCheck } from 'lucide-react';

type View = 'inbox' | 'followups' | 'insights' | 'notifications';
type Event = { id: string; detail: string; created_at: string };
type Notification = { id: string; status: string; attempts: number; last_error: string | null; sent_at: string | null; created_at: string; quote: { name: string; service: string } | null };
const stages: QuoteStatus[] = ['new', 'reviewed', 'quoted', 'closed'];
const input = 'w-full rounded-xl border border-white/10 bg-[#061728] px-3 py-2.5 text-sm text-white outline-none focus:border-sky-400/60';
const card = 'rounded-2xl border border-sky-300/10 bg-[#0b2135]/85';
const button = 'rounded-xl border border-sky-300/20 bg-sky-400/10 px-4 py-2.5 text-sm font-semibold text-sky-100 transition hover:bg-sky-400/20 disabled:opacity-40';
const label = 'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-sky-200/55';
const date = (value: string | null) => value ? new Date(value).toLocaleString('en-NZ', { dateStyle: 'medium', timeStyle: 'short' }) : 'Not set';
const dateInput = (value: string | null) => {
  if (!value) return '';
  const instant = new Date(value);
  return new Date(instant.getTime() - instant.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

async function api<T>(token: string, path: string, method = 'GET', payload?: object): Promise<T> {
  const response = await fetch(path, { method, cache: 'no-store',
    headers: { Authorization: 'Bearer ' + token, ...(payload ? { 'Content-Type': 'application/json' } : {}) },
    body: payload ? JSON.stringify(payload) : undefined });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Request failed');
  return result as T;
}

function Access({ session, aal, refresh }: { session: Session | null; aal: string | null; refresh: () => Promise<void> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [factor, setFactor] = useState('');
  const [qr, setQr] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!session || aal === 'aal2') return;
    void supabase.auth.mfa.listFactors().then(({ data }) => setFactor(data?.totp.find(item => item.status === 'verified')?.id ?? ''));
  }, [session, aal]);
  async function signIn(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    const { error: problem } = await supabase.auth.signInWithPassword({ email, password });
    setPassword('');
    if (problem) setError('Sign in failed. Check your credentials.'); else await refresh();
    setBusy(false);
  }
  async function enroll() {
    setBusy(true); setError('');
    const { data, error: problem } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Robb & Taylor Operations' });
    if (problem || !data?.totp) setError('Authenticator setup failed.'); else { setFactor(data.id); setQr(data.totp.qr_code); }
    setBusy(false);
  }
  async function verify(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    const { data: challenge, error: problem } = await supabase.auth.mfa.challenge({ factorId: factor });
    if (problem || !challenge) setError('Verification could not start.');
    else {
      const { error: failure } = await supabase.auth.mfa.verify({ factorId: factor, challengeId: challenge.id, code });
      if (failure) setError('That code did not verify.'); else { setCode(''); setQr(''); await refresh(); }
    }
    setBusy(false);
  }
  return <div className="flex min-h-screen items-center justify-center bg-[#04111e] px-5 text-white"><div className={card + ' w-full max-w-md p-8 shadow-2xl'}>
    <div className="mb-8 flex items-center gap-3"><ShieldCheck className="text-sky-200" size={28} /><div><h1 className="text-xl font-black">Robb &amp; Taylor</h1><p className="text-xs uppercase tracking-[0.2em] text-sky-200/50">Operations workspace</p></div></div>
    {error && <p role="alert" className="mb-4 rounded-xl bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
    {!session ? <form onSubmit={signIn} className="space-y-4"><h2 className="text-2xl font-bold">Named access</h2><p className="text-sm text-sky-100/55">Sign in and verify your authenticator.</p><label className={label}>Email<input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} className={input + ' mt-2'} /></label><label className={label}>Password<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className={input + ' mt-2'} /></label><button disabled={busy} className="w-full rounded-xl bg-sky-500 p-3 font-bold disabled:opacity-50">{busy ? 'Signing in…' : 'Sign in'}</button></form>
      : session.user.app_metadata?.role !== 'robb_admin' ? <div className="space-y-4"><p className="text-sm text-sky-100/60">This account does not have a Robb &amp; Taylor admin role.</p><button onClick={() => void supabase.auth.signOut()} className={button}>Sign out</button></div>
      : <div className="space-y-4"><h2 className="text-2xl font-bold">Verify account</h2><p className="text-sm text-sky-100/55">Use a six-digit authenticator code.</p>{!factor && <button onClick={() => void enroll()} disabled={busy} className={button}>Set up authenticator</button>}{qr && <div className="rounded-xl bg-white p-4 text-center text-xs text-slate-800"><Image unoptimized width={176} height={176} src={qr} alt="Authenticator setup QR code" className="mx-auto h-44 w-44" />Scan in an authenticator app.</div>}{factor && <form onSubmit={verify} className="space-y-3"><label className={label}>Verification code<input inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" required value={code} onChange={e => setCode(e.target.value)} className={input + ' mt-2 text-center font-mono text-xl tracking-widest'} /></label><button disabled={busy} className="w-full rounded-xl bg-sky-500 p-3 font-bold disabled:opacity-50">{busy ? 'Verifying…' : 'Open workspace'}</button></form>}<button onClick={() => void supabase.auth.signOut()} className="text-xs text-sky-200/50">Sign out</button></div>}
  </div></div>;
}

function Enquiry({ quote, token, onSaved }: { quote: Quote; token: string; onSaved: (q: Quote) => void }) {
  const [draft, setDraft] = useState(quote);
  const [events, setEvents] = useState<Event[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  useEffect(() => {
    setDraft(quote); setError(''); setSaved('');
    void api<{ data: Event[] }>(token, '/api/admin/quotes?activity=' + quote.id).then(result => setEvents(result.data)).catch(() => setEvents([]));
  }, [quote, token]);
  async function save(contact = false) {
    setBusy(true); setError(''); setSaved('');
    try {
      const payload = { id: quote.id, status: draft.status, priority: draft.priority, next_action: draft.next_action, follow_up_at: draft.follow_up_at, admin_notes: draft.admin_notes, ...(contact ? { mark_contacted: true } : {}) };
      const result = await api<{ data: Quote; activity_recorded: boolean }>(token, '/api/admin/quotes', 'PATCH', payload);
      onSaved(result.data); setSaved(result.activity_recorded ? 'Saved and logged' : 'Saved; activity history needs attention');
      try {
        const log = await api<{ data: Event[] }>(token, '/api/admin/quotes?activity=' + quote.id);
        setEvents(log.data);
      } catch { setSaved('Saved; activity history could not be refreshed'); }
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Save failed'); }
    finally { setBusy(false); }
  }
  return <div className={card + ' overflow-hidden'}><div className="border-b border-white/10 bg-gradient-to-br from-sky-400/10 to-transparent p-6"><div className="mb-2 flex items-center gap-3 text-xs text-sky-100/50"><span className="rounded-full bg-sky-400/15 px-2 py-1 font-bold uppercase text-sky-200">{quote.status}</span>Received {date(quote.created_at)}</div><h2 className="text-2xl font-black">{quote.name}</h2><p className="mt-1 text-sm text-sky-100/55">{quote.company || quote.service} · {quote.location || 'Location not provided'}</p><div className="mt-5 flex flex-wrap gap-2"><a href={'mailto:' + quote.email} className={button + ' inline-flex items-center gap-2'}><Mail size={15} /> Email</a>{quote.phone && <a href={'tel:' + quote.phone} className={button + ' inline-flex items-center gap-2'}><Phone size={15} /> Call</a>}<button onClick={() => void save(true)} disabled={busy} className={button + ' inline-flex items-center gap-2'}><Check size={15} /> Record contact</button></div></div>
    <div className="grid gap-7 p-6 xl:grid-cols-[1fr_235px]"><div className="space-y-5"><div><h3 className={label}>Project brief</h3><p className="whitespace-pre-wrap rounded-xl bg-black/15 p-4 text-sm leading-6 text-sky-50/85">{quote.message || 'No brief supplied.'}</p><p className="mt-3 text-xs text-sky-100/55">Service: {quote.service} · Budget: {quote.budget || 'Unspecified'} · Timeline: {quote.timeline || 'Unspecified'}</p><p className="mt-1 text-xs text-sky-100/55">{quote.email} · {quote.phone}</p></div>
      <div className="grid gap-4 sm:grid-cols-2"><label><span className={label}>Pipeline stage</span><select value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value as QuoteStatus })} className={input}>{stages.map(s => <option key={s} value={s}>{s}</option>)}</select></label><label><span className={label}>Priority</span><select value={draft.priority} onChange={e => setDraft({ ...draft, priority: e.target.value as Quote['priority'] })} className={input}><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></label><label className="sm:col-span-2"><span className={label}>Next action</span><input maxLength={500} value={draft.next_action} onChange={e => setDraft({ ...draft, next_action: e.target.value })} placeholder="Call, site visit, estimate, or follow up" className={input} /></label><label className="sm:col-span-2"><span className={label}>Follow-up date and time</span><input type="datetime-local" value={dateInput(draft.follow_up_at)} onChange={e => setDraft({ ...draft, follow_up_at: e.target.value ? new Date(e.target.value).toISOString() : null })} className={input} /></label><label className="sm:col-span-2"><span className={label}>Internal notes</span><textarea rows={5} maxLength={8000} value={draft.admin_notes} onChange={e => setDraft({ ...draft, admin_notes: e.target.value })} className={input} /></label></div>
      {error && <p role="alert" className="flex gap-2 text-sm text-red-300"><AlertCircle size={15} />{error}</p>}{saved && <p role="status" className="flex gap-2 text-sm text-emerald-300"><Check size={15} />{saved}</p>}<button disabled={busy} onClick={() => void save()} className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold disabled:opacity-40">{busy ? 'Saving…' : 'Save enquiry'}</button></div>
      <aside className="space-y-6"><div className="rounded-xl bg-sky-400/5 p-4"><h3 className={label}>Attention signal</h3><p className="text-3xl font-black">{Math.max(0, attentionScore(quote))}</p><p className="mt-2 text-xs leading-5 text-sky-100/50">Rules use stage, due date, age, and priority. Review the enquiry yourself.</p></div><div><h3 className={label}>Timing</h3><p className="text-xs text-sky-100/65">Follow-up: {date(quote.follow_up_at)}</p><p className="mt-2 text-xs text-sky-100/65">Contact recorded: {date(quote.last_contacted_at)}</p></div><div><h3 className={label}>Activity</h3><div className="space-y-3 border-l border-sky-300/20 pl-3">{events.length ? events.map(item => <div key={item.id}><p className="text-xs font-semibold">{item.detail}</p><p className="text-[11px] text-sky-100/40">{date(item.created_at)}</p></div>) : <p className="text-xs text-sky-100/40">Changes will appear here.</p>}</div></div></aside></div>
  </div>;
}

export default function AdminClient() {
  const [session, setSession] = useState<Session | null>(null);
  const [aal, setAal] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [view, setView] = useState<View>('inbox');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState<QuoteStatus | 'all'>('all');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const token = session?.access_token ?? '';
  const authed = ready && !!token && aal === 'aal2' && session?.user.app_metadata?.role === 'robb_admin';
  const refreshSession = useCallback(async () => {
    const { data: { session: next } } = await supabase.auth.getSession();
    setSession(next);
    if (next) { const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel(); setAal(data?.currentLevel ?? 'aal1'); }
    else setAal(null);
    setReady(true);
  }, []);
  useEffect(() => {
    void refreshSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => setTimeout(() => { void refreshSession(); }, 0));
    return () => subscription.unsubscribe();
  }, [refreshSession]);
  const refresh = useCallback(async () => {
    if (!token) return;
    setBusy(true); setError('');
    try {
      const [leads, queue] = await Promise.all([api<{ data: Quote[] }>(token, '/api/admin/quotes'), api<{ data: Notification[] }>(token, '/api/admin/notifications')]);
      setQuotes(leads.data); setNotifications(queue.data);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Workspace unavailable'); }
    finally { setBusy(false); }
  }, [token]);
  useEffect(() => { if (authed) void refresh(); else { setQuotes([]); setNotifications([]); } }, [authed, refresh]);
  const metrics = useMemo(() => workspaceMetrics(quotes), [quotes]);
  const selected = quotes.find(q => q.id === selectedId) ?? null;
  const filtered = useMemo(() => quotes.filter(q => {
    if (stage !== 'all' && q.status !== stage) return false;
    if (view === 'followups' && (!q.follow_up_at || q.status === 'closed')) return false;
    const term = search.trim().toLowerCase();
    return !term || [q.name,q.company,q.email,q.service,q.location,q.next_action].some(value => value?.toLowerCase().includes(term));
  }).sort((a, b) => view === 'followups'
    ? Date.parse(a.follow_up_at || '9999-12-31') - Date.parse(b.follow_up_at || '9999-12-31')
    : attentionScore(b) - attentionScore(a) || Date.parse(b.created_at) - Date.parse(a.created_at)), [quotes, stage, search, view]);
  async function queueAction(action: 'send_pending' | 'retry', id?: string) {
    setBusy(true); setError(''); setMessage('');
    try {
      const result = await api<{ sent?: number; failed?: number }>(token, '/api/admin/notifications', 'POST', { action, id });
      setMessage(action === 'retry' ? 'Notification queued for retry.' : 'Sent ' + (result.sent ?? 0) + ' alerts; ' + (result.failed ?? 0) + ' need attention.');
      await refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Queue unavailable'); }
    finally { setBusy(false); }
  }
  function downloadCsv() {
    const url = URL.createObjectURL(new Blob([exportQuotes(filtered)], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'robb-taylor-enquiries.csv'; a.click();
    URL.revokeObjectURL(url);
  }
  if (!ready) return <div className="flex min-h-screen items-center justify-center bg-[#04111e] text-sky-200"><RefreshCw className="animate-spin" aria-label="Loading" /></div>;
  if (!authed) return <Access session={session} aal={aal} refresh={refreshSession} />;
  return <div className="min-h-screen bg-[#04111e] text-white"><header className="sticky top-0 z-20 border-b border-sky-300/10 bg-[#061625]/95 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4"><div className="flex items-center gap-3"><Activity className="text-sky-200" size={24} /><div><p className="text-sm font-black">ROBB &amp; TAYLOR</p><p className="text-[10px] uppercase tracking-[0.2em] text-sky-200/50">Operations intelligence</p></div></div><div className="flex items-center gap-2"><span className="hidden text-xs text-sky-100/50 md:block">{session?.user.email}</span><button onClick={() => void refresh()} disabled={busy} className={button} aria-label="Refresh"><RefreshCw size={15} className={busy ? 'animate-spin' : ''} /></button><button onClick={() => void supabase.auth.signOut()} className={button + ' inline-flex items-center gap-2'}><LogOut size={15} /><span className="hidden sm:inline">Sign out</span></button></div></div></header>
    <main className="mx-auto max-w-7xl space-y-6 px-5 py-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.24em] text-sky-300/60">Command centre / live enquiries</p><h1 className="text-3xl font-black sm:text-4xl">Know what needs attention.</h1><p className="mt-2 text-sm text-sky-100/50">Counts come from saved enquiries. No assumed revenue.</p></div><button onClick={downloadCsv} className={button + ' inline-flex items-center gap-2'}><Download size={15} /> Export view</button></div>
      {error && <p role="alert" className="rounded-xl bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}{message && <p role="status" className="rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-200">{message}</p>}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{([
        ['New enquiries', metrics.newLeads, 'Awaiting stage review', Inbox],
        ['Follow-ups due', metrics.due, 'Open and past due', CalendarClock],
        ['Open pipeline', metrics.open, 'Enquiries, not revenue', Activity],
        ['Last 30 days', metrics.recent, 'Received enquiries', BarChart3],
      ] as const).map(([title, value, note, Icon]) => <div key={title} className={card + ' p-5'}><div className="mb-4 flex items-center justify-between text-sky-200/55"><p className="text-[10px] font-bold uppercase tracking-widest">{title}</p><Icon size={17} /></div><p className="text-4xl font-black tabular-nums">{value}</p><p className="mt-2 text-xs text-sky-100/45">{note}</p></div>)}</div>
      <nav aria-label="Workspace" className="flex gap-1 overflow-x-auto border-b border-white/10">{([
        ['inbox','Enquiries',Inbox], ['followups','Follow-ups',CalendarClock], ['insights','Insights',BarChart3], ['notifications','Email delivery',Bell],
      ] as const).map(([key, title, Icon]) => <button key={key} onClick={() => { setView(key); setSelectedId(null); }} className={'flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition ' + (view === key ? 'border-sky-400 text-white' : 'border-transparent text-sky-100/45 hover:text-white')}><Icon size={15} />{title}</button>)}</nav>
      {(view === 'inbox' || view === 'followups') && <div className="grid gap-5 lg:grid-cols-[335px_1fr]"><aside className={card + ' h-fit overflow-hidden'}><div className="space-y-3 border-b border-white/10 p-4"><label className="relative block"><Search size={16} className="absolute left-3 top-3 text-sky-100/40" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search enquiries" className={input + ' pl-9'} /></label><div className="flex flex-wrap gap-1">{(['all', ...stages] as const).map(s => <button key={s} onClick={() => setStage(s)} className={'rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ' + (stage === s ? 'bg-sky-400/20 text-white' : 'text-sky-100/40')}>{s}</button>)}</div></div><div className="max-h-[68vh] divide-y divide-white/5 overflow-y-auto">{filtered.length ? filtered.map(q => <button key={q.id} onClick={() => setSelectedId(q.id)} className={'w-full p-4 text-left transition hover:bg-sky-400/10 ' + (selectedId === q.id ? 'bg-sky-400/10' : '')}><div className="flex justify-between gap-2"><p className="truncate text-sm font-bold">{q.name}</p><span className="text-xs font-bold text-sky-200">{Math.max(0, attentionScore(q))}</span></div><p className="mt-1 truncate text-xs text-sky-100/50">{q.service} · {q.location || 'No location'}</p><div className="mt-3 flex items-center gap-2"><span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase text-sky-100/60">{q.status}</span>{q.priority !== 'normal' && <span className="text-[10px] font-bold uppercase text-amber-300">{q.priority}</span>}{q.follow_up_at && <span className="ml-auto text-[10px] text-sky-200/60">{new Date(q.follow_up_at).toLocaleDateString('en-NZ')}</span>}</div></button>) : <p className="p-8 text-center text-sm text-sky-100/45">No enquiries match this view.</p>}</div><p className="border-t border-white/10 p-3 text-xs text-sky-100/40">{filtered.length} shown of {quotes.length} loaded (latest 500)</p></aside><section>{selected ? <Enquiry key={selected.id} quote={selected} token={token} onSaved={updated => setQuotes(list => list.map(q => q.id === updated.id ? updated : q))} /> : <div className={card + ' flex min-h-[430px] flex-col items-center justify-center p-8 text-center'}><Inbox size={30} className="mb-4 text-sky-200" /><h2 className="text-xl font-bold">Select an enquiry</h2><p className="mt-2 max-w-sm text-sm text-sky-100/50">Review the brief, assign a next step, schedule a follow-up and keep its activity together.</p></div>}</section></div>}
      {view === 'insights' && <div className="grid gap-5 lg:grid-cols-2"><section className={card + ' p-6'}><h2 className="text-xl font-bold">Pipeline stages</h2><p className="mb-6 mt-1 text-xs text-sky-100/45">Closed is an admin stage, not proven won revenue.</p>{stages.map(s => { const count = quotes.filter(q => q.status === s).length; return <div key={s} className="mb-4"><div className="mb-1 flex justify-between text-sm capitalize"><span>{s}</span><b>{count}</b></div><div className="h-2 rounded-full bg-white/5"><div className="h-2 rounded-full bg-sky-400" style={{ width: String(quotes.length ? count / quotes.length * 100 : 0) + '%' }} /></div></div>; })}</section><section className={card + ' p-6'}><h2 className="text-xl font-bold">Service demand</h2><p className="mb-6 mt-1 text-xs text-sky-100/45">Enquiries received in the last 30 days.</p>{metrics.serviceCounts.length ? metrics.serviceCounts.map(([service, count]) => <div key={service} className="mb-3 flex justify-between border-b border-white/5 pb-3 text-sm"><span className="text-sky-100/65">{service}</span><b>{count}</b></div>) : <p className="text-sm text-sky-100/45">No recent enquiries.</p>}</section><section className={card + ' p-6 lg:col-span-2'}><h2 className="text-xl font-bold">Process gaps</h2><div className="mt-5 grid gap-3 sm:grid-cols-3">{[['Overdue follow-ups', metrics.due], ['Open without next action', metrics.awaitingAction], ['Marked quoted', metrics.quoted]].map(([name, count]) => <div key={name as string} className="rounded-xl bg-sky-400/5 p-4"><p className="text-3xl font-black text-sky-200">{count}</p><p className="mt-1 text-xs text-sky-100/50">{name}</p></div>)}</div></section></div>}
      {view === 'notifications' && <section className={card + ' overflow-hidden'}><div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-6"><div><h2 className="text-xl font-bold">Email delivery</h2><p className="mt-1 text-xs text-sky-100/50">One admin alert per new enquiry, with retry status.</p></div><button disabled={busy} onClick={() => void queueAction('send_pending')} className={button}>Send pending now</button></div><div className="divide-y divide-white/5">{notifications.length ? notifications.map(n => <div key={n.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"><div><p className="text-sm font-bold">{n.quote?.name || 'Enquiry'} · {n.quote?.service || 'Service'}</p><p className="mt-1 text-xs text-sky-100/45">Created {date(n.created_at)} · {n.attempts} attempts{n.sent_at ? ' · Sent ' + date(n.sent_at) : ''}</p>{n.last_error && <p className="mt-1 text-xs text-red-300">{n.last_error}</p>}</div><div className="flex items-center gap-3"><span className="rounded-full bg-sky-400/10 px-2.5 py-1 text-[10px] font-bold uppercase text-sky-200">{n.status}</span>{['failed','dead'].includes(n.status) && <button disabled={busy} onClick={() => void queueAction('retry', n.id)} className={button}>Retry</button>}</div></div>) : <p className="p-8 text-center text-sm text-sky-100/45">No notifications yet. New submissions appear after the database migration.</p>}</div></section>}
      <footer className="pb-8 text-center text-xs text-sky-100/30">Robb &amp; Taylor Contracting · Protected operations workspace</footer></main></div>;
}
