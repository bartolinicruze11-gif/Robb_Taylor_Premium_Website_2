'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Quote, QuoteStatus } from '@/lib/supabase';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import {
  Lock, LogOut, RefreshCw, Phone, Mail, MapPin, Calendar, DollarSign,
  Briefcase, StickyNote, X, CircleCheck as CheckCircle, Clock, Eye, Archive,
  Search, Trash2, TrendingUp, FileText, ChevronRight, CircleAlert as AlertCircle,
  Building2, ChartBar as BarChart3, ShieldCheck, Activity, ArrowLeft, Sparkles,
  Command, Zap, Layers, Filter, MoveHorizontal as MoreHorizontal, Copy, ExternalLink
} from 'lucide-react';

const ADMIN_QUOTES_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-quotes`;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function callAdminApi(password: string, body: Record<string, unknown>) {
  const res = await fetch(ADMIN_QUOTES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({ password, ...body }),
  });
  return res.json();
}

const STATUS_CONFIG: Record<QuoteStatus, { label: string; text: string; bg: string; ring: string; dot: string; icon: typeof Clock }> = {
  new:      { label: 'New Lead',   text: 'text-sky-200',      bg: 'bg-sky-400/[0.12]',      ring: 'ring-sky-400/40',      dot: 'bg-sky-300',      icon: Sparkles },
  reviewed: { label: 'Reviewed',   text: 'text-amber-200',    bg: 'bg-amber-400/[0.12]',    ring: 'ring-amber-400/40',    dot: 'bg-amber-300',    icon: Eye },
  quoted:   { label: 'Quoted',     text: 'text-emerald-200',  bg: 'bg-emerald-400/[0.12]',  ring: 'ring-emerald-400/40',  dot: 'bg-emerald-300',  icon: CheckCircle },
  closed:   { label: 'Closed',     text: 'text-slate-300',    bg: 'bg-slate-400/[0.10]',    ring: 'ring-slate-400/30',    dot: 'bg-slate-400',    icon: Archive },
};

function StatusPill({ status, size = 'sm' }: { status: QuoteStatus; size?: 'sm' | 'md' }) {
  const cfg = STATUS_CONFIG[status];
  const px = size === 'md' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-0.5 text-[10px]';
  return (
    <span className={`inline-flex items-center gap-1.5 ${px} font-bold uppercase tracking-widest rounded-full ring-1 ${cfg.ring} ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shadow-[0_0_10px_currentColor]`} />
      {cfg.label}
    </span>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { damping: 30, stiffness: 120 });
  const [display, setDisplay] = useState(0);
  useEffect(() => { mv.set(value); }, [value, mv]);
  useEffect(() => spring.on('change', v => setDisplay(Math.round(v))), [spring]);
  return <span className="tabular-nums">{display}</span>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' });
}

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className="text-sky-300/40 hover:text-sky-200 transition-colors flex-shrink-0"
      aria-label="Copy"
    >
      {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function QuoteWorkspace({
  quote, password, onUpdate, onBack, onDelete,
}: {
  quote: Quote; password: string; onUpdate: () => void; onBack: () => void; onDelete: (id: string) => void;
}) {
  const [notes, setNotes] = useState(quote.admin_notes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState<QuoteStatus>(quote.status as QuoteStatus);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { setNotes(quote.admin_notes); setStatus(quote.status as QuoteStatus); }, [quote.id, quote.admin_notes, quote.status]);

  async function saveNotes() {
    setSaving(true); setSaved(false);
    await callAdminApi(password, { action: 'update_notes', id: quote.id, admin_notes: notes });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function updateStatus(s: QuoteStatus) {
    setStatus(s);
    await callAdminApi(password, { action: 'update_status', id: quote.id, status: s });
    onUpdate();
  }

  async function handleDelete() {
    setDeleting(true);
    await callAdminApi(password, { action: 'delete', id: quote.id });
    onDelete(quote.id);
  }

  return (
    <motion.div
      key={quote.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <button
        onClick={onBack}
        className="lg:hidden inline-flex items-center gap-1.5 text-sky-300/60 hover:text-sky-100 text-xs font-semibold uppercase tracking-wider transition-colors mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to enquiries
      </button>

      <div className="relative overflow-hidden rounded-2xl border border-sky-400/15 bg-gradient-to-br from-[#0a2138] via-[#081930] to-[#061527] shadow-[0_20px_60px_rgba(2,10,20,0.35)]">
        <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.18)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(ellipse_at_right,rgba(34,211,238,0.10)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative p-6 sm:p-8 border-b border-sky-400/10 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <div className="relative w-14 h-14 flex-shrink-0">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 opacity-30 blur-md" />
              <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-sky-400/25 to-cyan-500/10 border border-sky-400/40 flex items-center justify-center backdrop-blur-sm">
                <span className="text-sky-100 font-black text-lg">{quote.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <StatusPill status={status} size="md" />
                <span className="text-sky-300/40 text-[10px] uppercase tracking-widest">&middot;</span>
                <span className="text-sky-300/50 text-[10px] uppercase tracking-widest">Received {relTime(quote.created_at)}</span>
              </div>
              <h2 className="text-white font-black text-2xl sm:text-3xl tracking-tight leading-tight">{quote.name}</h2>
              {quote.company && (
                <p className="text-sky-300/70 text-sm mt-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />{quote.company}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {quote.email && (
              <a href={`mailto:${quote.email}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-400/15 hover:bg-sky-400/25 border border-sky-400/30 text-sky-100 text-xs font-bold uppercase tracking-wider rounded-lg transition-all hover:shadow-[0_8px_20px_rgba(56,189,248,0.15)]">
                <Mail className="w-3.5 h-3.5" />Reply
              </a>
            )}
            {quote.phone && (
              <a href={`tel:${quote.phone}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-sky-100 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors">
                <Phone className="w-3.5 h-3.5" />Call
              </a>
            )}
          </div>
        </div>

        <div className="relative p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <p className="text-sky-300/40 text-[10px] uppercase tracking-[0.25em] font-bold mb-3 flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> Pipeline Stage
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {(Object.keys(STATUS_CONFIG) as QuoteStatus[]).map(s => {
                const cfg = STATUS_CONFIG[s];
                const Icon = cfg.icon;
                const active = status === s;
                return (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    className={`group relative flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all border ${
                      active
                        ? `${cfg.bg} ${cfg.text} border-transparent ring-1 ${cfg.ring} shadow-[0_8px_20px_rgba(0,0,0,0.2)]`
                        : 'border-white/10 text-sky-300/50 hover:border-sky-400/30 hover:text-sky-100 hover:bg-white/[0.03]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />{cfg.label}
                    {active && (
                      <motion.span layoutId="stageDot" className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${cfg.dot} shadow-[0_0_10px_currentColor]`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 rounded-xl bg-black/20 border border-sky-400/10 backdrop-blur-sm">
                <p className="text-sky-300/40 text-[10px] uppercase tracking-[0.25em] font-bold mb-4">Contact</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: Mail,      label: 'Email',    value: quote.email,    href: `mailto:${quote.email}`, copy: true },
                    { icon: Phone,     label: 'Phone',    value: quote.phone,    href: quote.phone ? `tel:${quote.phone}` : undefined, copy: true },
                    { icon: MapPin,    label: 'Location', value: quote.location, href: undefined, copy: false },
                    { icon: Building2, label: 'Company',  value: quote.company,  href: undefined, copy: false },
                  ].filter(f => f.value).map(({ icon: Icon, label, value, href, copy }) => (
                    <div key={label} className="flex items-center gap-3 px-3 py-2.5 bg-white/[0.02] border border-white/5 rounded-lg group hover:border-sky-400/25 transition-colors">
                      <Icon className="w-3.5 h-3.5 text-sky-300/60 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sky-300/40 text-[9px] uppercase tracking-widest">{label}</p>
                        {href ? (
                          <a href={href} className="text-sky-50 hover:text-white text-sm font-medium truncate block transition-colors">{value}</a>
                        ) : (
                          <p className="text-sky-50 text-sm font-medium truncate">{value}</p>
                        )}
                      </div>
                      {copy && <CopyButton text={value} />}
                    </div>
                  ))}
                </div>
              </div>

              {quote.message && (
                <div className="p-5 rounded-xl bg-black/20 border border-sky-400/10 backdrop-blur-sm">
                  <p className="text-sky-300/40 text-[10px] uppercase tracking-[0.25em] font-bold mb-3">Project Brief</p>
                  <p className="text-sky-50/90 text-sm leading-[1.7] whitespace-pre-wrap">{quote.message}</p>
                </div>
              )}

              <div className="p-5 rounded-xl bg-black/20 border border-sky-400/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sky-300/40 text-[10px] uppercase tracking-[0.25em] font-bold flex items-center gap-1.5">
                    <StickyNote className="w-3 h-3" />Internal Notes
                  </p>
                  <AnimatePresence>
                    {saved && (
                      <motion.span
                        initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        className="text-emerald-300 text-[10px] uppercase tracking-wider flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" /> Saved
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={5}
                  placeholder="Log calls, follow-ups, pricing discussions, site visit notes..."
                  className="w-full bg-black/30 border border-white/5 focus:border-sky-400/50 text-sky-50 text-sm px-3.5 py-3 outline-none resize-none rounded-lg transition-colors placeholder-sky-300/25 leading-relaxed"
                />
                <button
                  onClick={saveNotes}
                  disabled={saving}
                  className="mt-3 px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all disabled:opacity-50 shadow-[0_6px_16px_rgba(14,165,233,0.25)]"
                >
                  {saving ? 'Saving…' : 'Save Notes'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-black/20 border border-sky-400/10 backdrop-blur-sm">
                <p className="text-sky-300/40 text-[10px] uppercase tracking-[0.25em] font-bold mb-4">Project Details</p>
                <dl className="flex flex-col gap-3">
                  {[
                    { icon: Briefcase,  label: 'Service',   value: quote.service },
                    { icon: DollarSign, label: 'Budget',    value: quote.budget },
                    { icon: Calendar,   label: 'Timeline',  value: quote.timeline },
                    { icon: Calendar,   label: 'Submitted', value: formatDate(quote.created_at) },
                  ].filter(f => f.value).map(({ icon: Icon, label, value }) => (
                    <div key={label} className="pb-3 last:pb-0 border-b border-white/5 last:border-0">
                      <dt className="text-sky-300/40 text-[9px] uppercase tracking-widest flex items-center gap-1.5 mb-1">
                        <Icon className="w-3 h-3" />{label}
                      </dt>
                      <dd className="text-sky-50 text-sm font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="p-5 rounded-xl bg-red-500/[0.04] border border-red-500/15">
                <p className="text-red-300/60 text-[10px] uppercase tracking-[0.25em] font-bold mb-3">Danger Zone</p>
                {!confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-500/20 hover:border-red-500/40 text-red-300 hover:text-red-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />Delete Enquiry
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-red-300 text-xs leading-relaxed">This permanently removes the enquiry and cannot be undone.</p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 py-2 bg-red-500/25 border border-red-500/40 text-red-100 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-red-500/35 transition-colors disabled:opacity-50"
                      >
                        {deleting ? 'Deleting…' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="flex-1 py-2 border border-white/10 text-sky-300/70 hover:text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                      >Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function QuoteRow({
  quote, selected, onClick, index,
}: { quote: Quote; selected: boolean; onClick: () => void; index: number }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.25), duration: 0.3 }}
      onClick={onClick}
      className={`w-full text-left group relative flex items-start gap-3 px-4 py-3.5 border-l-2 transition-all ${
        selected
          ? 'bg-sky-400/[0.10] border-l-sky-400 shadow-[inset_0_0_50px_rgba(56,189,248,0.06)]'
          : 'border-l-transparent hover:bg-white/[0.03] hover:border-l-sky-400/40'
      }`}
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border transition-all ${
        selected
          ? 'bg-gradient-to-br from-sky-400/30 to-cyan-500/15 border-sky-400/50'
          : 'bg-white/[0.03] border-white/10 group-hover:border-sky-400/30'
      }`}>
        <span className={`font-black text-xs ${selected ? 'text-sky-100' : 'text-sky-200/80'}`}>
          {quote.name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className={`text-sm font-semibold truncate leading-tight ${selected ? 'text-white' : 'text-sky-50'}`}>{quote.name}</p>
          <span className="text-sky-300/40 text-[10px] font-medium flex-shrink-0 tabular-nums">{relTime(quote.created_at)}</span>
        </div>
        <p className="text-sky-300/55 text-[11px] truncate mb-1.5">{quote.service || quote.email}</p>
        <StatusPill status={quote.status as QuoteStatus} />
      </div>
      <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-3 transition-all ${
        selected ? 'text-sky-200 translate-x-0.5' : 'text-sky-300/25 group-hover:text-sky-300/60 group-hover:translate-x-0.5'
      }`} />
    </motion.button>
  );
}

export default function AdminClient() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<QuoteStatus | 'all'>('all');
  const [selected, setSelected] = useState<Quote | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const fetchQuotes = useCallback(async (pass: string) => {
    setLoading(true);
    const result = await callAdminApi(pass, { action: 'list' });
    const list: Quote[] = result.data ?? [];
    setQuotes(list);
    setSelected(prev => prev ? list.find(q => q.id === prev.id) ?? null : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchQuotes(enteredPassword);
  }, [authed, enteredPassword, fetchQuotes]);

  useEffect(() => {
    if (!authed) return;
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === 'Escape') {
        setPaletteOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [authed]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await callAdminApi(password, { action: 'list' });
    setLoading(false);
    if (!result || result.error || !Array.isArray(result.data)) {
      setAuthError(
        result?.error && result.error !== 'Unauthorized'
          ? result.error
          : 'Incorrect password. Please try again.'
      );
      return;
    }
    setEnteredPassword(password);
    setQuotes(result.data);
    setAuthed(true);
    setAuthError(null);
  }

  const filtered = useMemo(() => quotes.filter(q => {
    const matchStatus = filterStatus === 'all' || q.status === filterStatus;
    const s = search.toLowerCase();
    const matchSearch = !s ||
      q.name.toLowerCase().includes(s) ||
      q.email.toLowerCase().includes(s) ||
      q.company.toLowerCase().includes(s) ||
      q.service.toLowerCase().includes(s) ||
      q.location.toLowerCase().includes(s);
    return matchStatus && matchSearch;
  }), [quotes, filterStatus, search]);

  const counts = {
    all:      quotes.length,
    new:      quotes.filter(q => q.status === 'new').length,
    reviewed: quotes.filter(q => q.status === 'reviewed').length,
    quoted:   quotes.filter(q => q.status === 'quoted').length,
    closed:   quotes.filter(q => q.status === 'closed').length,
  };

  const stats = [
    { label: 'Total Enquiries', value: counts.all, icon: Layers, tint: 'from-sky-500/[0.15] via-sky-500/[0.05] to-transparent', ring: 'ring-sky-400/25', accent: 'text-sky-300' },
    { label: 'New Leads',       value: counts.new, icon: Sparkles, tint: 'from-cyan-500/[0.18] via-cyan-500/[0.05] to-transparent', ring: 'ring-cyan-400/30', accent: 'text-cyan-300' },
    { label: 'Active Pipeline', value: counts.reviewed + counts.quoted, icon: Activity, tint: 'from-amber-500/[0.12] via-amber-500/[0.03] to-transparent', ring: 'ring-amber-400/25', accent: 'text-amber-300' },
    { label: 'Closed Deals',    value: counts.closed, icon: CheckCircle, tint: 'from-emerald-500/[0.12] via-emerald-500/[0.03] to-transparent', ring: 'ring-emerald-400/25', accent: 'text-emerald-300' },
  ];

  if (!authed) {
    return (
      <div className="min-h-screen relative bg-[#02101f] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_15%,rgba(56,189,248,0.18)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_85%,rgba(34,211,238,0.12)_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:56px_56px]" />

        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-sky-500/10 blur-[120px] pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[440px]"
        >
          <div className="relative border border-sky-400/20 bg-[#0a1f38]/70 backdrop-blur-2xl overflow-hidden rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-sky-300 to-transparent" />
            <div className="absolute inset-x-0 top-[2px] h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

            <div className="p-10">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 opacity-40 blur-md" />
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400/30 to-cyan-500/15 border border-sky-400/50 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-sky-100" />
                  </div>
                </div>
                <div>
                  <p className="text-white font-black text-sm tracking-wide">ROBB &amp; TAYLOR</p>
                  <p className="text-sky-300/60 text-[10px] uppercase tracking-[0.3em]">Operations Console</p>
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-white font-black text-2xl mb-2 tracking-tight">Secure Access</h1>
                <p className="text-sky-300/60 text-sm">Authenticate to enter the command center.</p>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-3">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/50 group-focus-within:text-sky-300 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setAuthError(null); }}
                    placeholder="Enter password"
                    autoFocus
                    className="w-full bg-black/40 border border-white/10 focus:border-sky-400/60 text-white placeholder-sky-300/30 text-sm pl-11 pr-4 py-3.5 outline-none transition-all rounded-lg focus:shadow-[0_0_0_4px_rgba(56,189,248,0.12)]"
                  />
                </div>
                <AnimatePresence>
                  {authError && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-400 text-xs flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />{authError}
                    </motion.p>
                  )}
                </AnimatePresence>
                <button
                  type="submit"
                  disabled={loading || !password}
                  className="relative overflow-hidden w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 uppercase tracking-[0.2em] transition-all mt-1 rounded-lg shadow-[0_10px_30px_rgba(14,165,233,0.35)] group"
                >
                  <span className="relative z-10">{loading ? 'Verifying…' : 'Sign In'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-sky-300/40 text-[10px] uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                Encrypted &middot; Audited &middot; Restricted
              </div>
            </div>
          </div>
          <p className="text-sky-300/25 text-[10px] text-center mt-5 uppercase tracking-widest">
            Robb &amp; Taylor Contracting Ltd
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02101f] text-white relative">
      <div className="fixed inset-x-0 top-0 h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.10)_0%,transparent_65%)] pointer-events-none" />
      <div className="fixed inset-0 opacity-[0.02] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:56px_56px] pointer-events-none" />

      <header className="sticky top-0 z-40 bg-[#02101f]/85 backdrop-blur-xl border-b border-sky-400/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-9 h-9 flex-shrink-0">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-sky-400 to-cyan-500 opacity-30 blur-md" />
              <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400/30 to-cyan-500/10 border border-sky-400/40 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-sky-100" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-white font-black text-sm tracking-wide leading-none">ROBB &amp; TAYLOR</p>
              <p className="text-sky-300/50 text-[9px] uppercase tracking-[0.3em] leading-none mt-1">Operations Console</p>
            </div>
          </div>

          <button
            onClick={() => setPaletteOpen(true)}
            className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-4 px-4 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-sky-400/30 rounded-lg transition-all group"
          >
            <Search className="w-4 h-4 text-sky-300/50 group-hover:text-sky-300 transition-colors" />
            <span className="text-sky-300/50 text-sm flex-1 text-left">Search enquiries...</span>
            <kbd className="hidden lg:flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-sky-300/60 bg-white/[0.05] border border-white/10 rounded">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-emerald-500/[0.10] border border-emerald-400/25 rounded-full">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-300 animate-ping opacity-75" />
                <span className="relative rounded-full w-1.5 h-1.5 bg-emerald-300" />
              </span>
              <span className="text-emerald-200 text-[10px] font-bold uppercase tracking-widest">Live</span>
            </div>
            <button
              onClick={() => fetchQuotes(enteredPassword)}
              disabled={loading}
              className="flex items-center gap-1.5 text-sky-300/70 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-40 px-2 py-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:block">Sync</span>
            </button>
            <div className="h-5 w-px bg-white/10" />
            <button
              onClick={() => { setAuthed(false); setPassword(''); setEnteredPassword(''); setSelected(null); }}
              className="flex items-center gap-1.5 text-sky-300/70 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors px-2 py-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 relative">
        {!selected && (
          <>
            <div className="mb-6 flex items-end justify-between flex-wrap gap-4">
              <div>
                <p className="text-sky-300/50 text-[10px] uppercase tracking-[0.3em] font-bold mb-1.5">Dashboard</p>
                <h1 className="text-white font-black text-3xl sm:text-4xl tracking-tight">
                  Quote Enquiries
                </h1>
                <p className="text-sky-300/60 text-sm mt-1.5">
                  {counts.new > 0 ? (
                    <><span className="text-sky-200 font-semibold">{counts.new} new</span> lead{counts.new !== 1 ? 's' : ''} awaiting review.</>
                  ) : 'All caught up. No new leads at this moment.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {stats.map(({ label, value, icon: Icon, tint, ring, accent }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`relative rounded-xl border border-white/10 ring-1 ${ring} overflow-hidden group hover:border-white/20 transition-all`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${tint} pointer-events-none`} />
                  <div className="relative p-5">
                    <div className="flex items-center justify-between mb-4">
                      <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${accent}`}>{label}</p>
                      <Icon className={`w-4 h-4 ${accent} opacity-60`} />
                    </div>
                    <p className="text-4xl font-black text-white leading-none">
                      <AnimatedNumber value={value} />
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        <div className={`grid gap-5 ${selected ? 'lg:grid-cols-[380px_1fr]' : 'grid-cols-1'}`}>
          <aside className={`${selected ? 'hidden lg:block' : ''}`}>
            <div className="sticky top-[80px] rounded-2xl border border-sky-400/10 bg-[#061a30]/50 backdrop-blur-sm overflow-hidden">
              <div className="p-3 border-b border-sky-400/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/40" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search name, service, location..."
                    className="w-full bg-black/30 border border-white/5 focus:border-sky-400/40 text-white placeholder-sky-300/30 text-sm pl-9 pr-8 py-2.5 outline-none rounded-lg transition-colors"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-300/40 hover:text-white transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="px-3 pt-3 flex items-center gap-1 overflow-x-auto scrollbar-none">
                {(['all', 'new', 'reviewed', 'quoted', 'closed'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all whitespace-nowrap flex items-center gap-1 ${
                      filterStatus === s
                        ? 'bg-sky-400/20 text-sky-100 ring-1 ring-sky-400/40'
                        : 'text-sky-300/45 hover:text-sky-100 hover:bg-white/[0.04]'
                    }`}
                  >
                    {s}
                    <span className={`text-[9px] ${filterStatus === s ? 'text-sky-200' : 'text-sky-300/30'}`}>
                      {counts[s]}
                    </span>
                  </button>
                ))}
              </div>

              <div className={`mt-3 ${selected ? 'max-h-[calc(100vh-260px)]' : 'max-h-[calc(100vh-380px)] min-h-[400px]'} overflow-y-auto overscroll-contain divide-y divide-white/[0.04]`}>
                {loading && quotes.length === 0 ? (
                  <div className="flex items-center justify-center py-16 text-sky-300/50 text-sm">
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />Loading…
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                    <FileText className="w-7 h-7 text-sky-300/30 mb-2" />
                    <p className="text-sky-200/70 font-semibold text-sm">
                      {quotes.length === 0 ? 'No enquiries yet' : 'No matches'}
                    </p>
                    <p className="text-sky-300/40 text-xs mt-1">
                      {quotes.length === 0 ? 'New submissions will appear here.' : 'Try a different search.'}
                    </p>
                  </div>
                ) : (
                  filtered.map((quote, i) => (
                    <QuoteRow
                      key={quote.id}
                      quote={quote}
                      selected={selected?.id === quote.id}
                      onClick={() => setSelected(selected?.id === quote.id ? null : quote)}
                      index={i}
                    />
                  ))
                )}
              </div>

              <div className="px-4 py-2.5 border-t border-sky-400/10 flex items-center justify-between text-[10px] uppercase tracking-widest">
                <span className="text-sky-300/40">{filtered.length} of {quotes.length}</span>
                {counts.new > 0 && (
                  <span className="flex items-center gap-1 text-sky-300">
                    <span className="w-1 h-1 rounded-full bg-sky-300 shadow-[0_0_8px_currentColor]" />
                    {counts.new} new
                  </span>
                )}
              </div>
            </div>
          </aside>

          <main className="min-w-0">
            {selected ? (
              <>
                <button
                  onClick={() => setSelected(null)}
                  className="hidden lg:inline-flex items-center gap-1.5 text-sky-300/60 hover:text-sky-100 text-xs font-semibold uppercase tracking-wider transition-colors mb-4"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
                </button>
                <QuoteWorkspace
                  quote={selected}
                  password={enteredPassword}
                  onUpdate={() => fetchQuotes(enteredPassword)}
                  onBack={() => setSelected(null)}
                  onDelete={(id) => { setQuotes(prev => prev.filter(q => q.id !== id)); setSelected(null); }}
                />
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-sky-400/15 bg-[#061a30]/30 min-h-[400px] flex flex-col items-center justify-center text-center px-8 py-16">
                <div className="relative w-14 h-14 mb-4">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 opacity-25 blur-lg animate-pulse" />
                  <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-sky-400/20 to-cyan-500/10 border border-sky-400/30 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-sky-200" />
                  </div>
                </div>
                <h3 className="text-white font-black text-lg tracking-tight mb-1">Select an enquiry</h3>
                <p className="text-sky-300/60 text-sm max-w-sm">
                  Choose a quote from the left to open its full workspace with contact details, project brief, and internal notes.
                </p>
                <kbd className="mt-6 hidden md:flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono text-sky-300/60 bg-white/[0.05] border border-white/10 rounded">
                  Press <Command className="w-2.5 h-2.5" />K to search
                </kbd>
              </div>
            )}
          </main>
        </div>

        <p className="text-sky-300/20 text-[10px] text-center mt-8 uppercase tracking-widest">
          Robb &amp; Taylor Contracting Ltd &middot; Operations Console
        </p>
      </div>

      <AnimatePresence>
        {paletteOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
              onClick={() => setPaletteOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 -translate-x-1/2 top-[15vh] w-[92vw] max-w-xl z-50 bg-[#0a1f38]/95 backdrop-blur-xl border border-sky-400/20 rounded-2xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.7)]"
            >
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
                <Search className="w-4 h-4 text-sky-300/60" />
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search enquiries..."
                  className="flex-1 bg-transparent outline-none text-white placeholder-sky-300/40 text-sm"
                />
                <kbd className="text-[10px] font-mono text-sky-300/50 bg-white/[0.05] px-2 py-0.5 rounded">Esc</kbd>
              </div>
              <div className="max-h-[50vh] overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-sky-300/50 text-sm text-center py-10">No results found</p>
                ) : (
                  filtered.slice(0, 12).map(q => (
                    <button
                      key={q.id}
                      onClick={() => { setSelected(q); setPaletteOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors border-l-2 border-transparent hover:border-l-sky-400 text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sky-200 font-black text-xs">{q.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{q.name}</p>
                        <p className="text-sky-300/50 text-xs truncate">{q.service || q.email}</p>
                      </div>
                      <StatusPill status={q.status as QuoteStatus} />
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
