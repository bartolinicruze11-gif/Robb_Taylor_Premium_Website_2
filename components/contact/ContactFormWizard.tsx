'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, CircleCheck, CircleAlert as AlertCircle,
  Droplets, Shovel, Waves, Truck, Building2, Layers,
  ChevronRight, ChevronLeft, MapPin, User, Mail, Phone,
} from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { supabase } from '@/lib/supabase';

const serviceOptions = [
  { value: 'Civil Construction', label: 'Civil Construction', sub: 'Roading, kerb & channel, structures', icon: Building2, accent: '#2281f5' },
  { value: 'Earthworks & Pavements', label: 'Earthworks & Pavements', sub: 'Cut & fill, grading, pavements', icon: Shovel, accent: '#c8841a' },
  { value: 'Retaining & Piling', label: 'Retaining & Piling', sub: 'Retaining walls, piling, foundations', icon: Layers, accent: '#c87820' },
  { value: 'Trenching', label: 'Trenching', sub: 'Utility & pipeline trenching', icon: Truck, accent: '#b83820' },
];

const locationOptions = [
  'Wellington City', 'Lower Hutt', 'Upper Hutt', 'Porirua',
  'Kapiti Coast', 'Wairarapa', 'Other / Not listed',
];

const STEPS = ['Service', 'Location', 'Your Details'];

const inputClass =
  'w-full bg-[#020b18] border border-white/[0.08] focus:border-blue-500/60 focus:bg-[#071629] text-white placeholder-[#3d5668] text-sm px-4 py-3.5 outline-none transition-all duration-200 rounded-sm';
const labelClass = 'block text-[#8ba5bc] text-[11px] font-semibold uppercase tracking-[0.15em] mb-2';

function OptionCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative text-left p-4 border transition-all duration-200 rounded-sm ${
        selected
          ? 'border-blue-500/60 bg-blue-500/[0.08]'
          : 'border-white/[0.07] bg-[#020b18] hover:border-white/[0.18] hover:bg-white/[0.03]'
      }`}
    >
      {selected && (
        <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-blue-500 flex items-center justify-center rounded-full">
          <CircleCheck className="w-2.5 h-2.5 text-white" />
        </span>
      )}
      {children}
    </button>
  );
}

export default function ContactFormWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const submitting = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState(1);
  const [sel, setSel] = useState({ service: '', location: '', name: '', company: '', email: '', phone: '', message: '' });

  function set(key: string, value: string) { setSel(p => ({ ...p, [key]: value })); }
  function next() { setDirection(1); setStep(s => Math.min(s + 1, STEPS.length - 1)); }
  function back() { setDirection(-1); setStep(s => Math.max(s - 1, 0)); }

  const canNext = [!!sel.service, !!sel.location, !!(sel.name && sel.email)][step];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting.current) return;
    if (step !== 2 || !canNext) return;
    if (!sel.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sel.email.trim())) {
      setError('Please enter your name and a valid email address.');
      return;
    }
    submitting.current = true;
    setLoading(true);
    setError(null);
    try {
      const data = { name: sel.name.trim(), company: sel.company || '', email: sel.email.trim().toLowerCase(), phone: sel.phone || '', service: sel.service, location: sel.location, budget: '', timeline: '', message: sel.message || '' };
      const { error: dbError } = await supabase.from('quotes').insert(data);
      if (dbError) {
        setError('Something went wrong saving your request. Please try again or call us directly.');
        submitting.current = false;
        setLoading(false);
        return;
      }
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-quote-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
        body: JSON.stringify(data),
      }).catch(() => {});
      trackEvent('generate_lead', { form_id: 'contact_quote' });
      router.push('/contact/thank-you');
    } catch {
      submitting.current = false;
      setError('An unexpected error occurred. Please try again or call us directly.');
      setLoading(false);
    }
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <form id="contact_quote" name="contact_quote" onSubmit={handleSubmit} noValidate>
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`h-1 rounded-full transition-all duration-500 ${i < step ? 'bg-blue-500 w-8' : i === step ? 'bg-blue-400 w-8' : 'bg-white/[0.08] w-4'}`} />
          </div>
        ))}
        <span className="text-[#3d5668] text-[11px] font-semibold ml-1">Step {step + 1} of {STEPS.length}</span>
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 px-4 py-3 mb-5 rounded-sm">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div className="overflow-hidden min-h-[280px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={step} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>

            {step === 0 && (
              <div>
                <p className="text-white font-bold text-base mb-1">What do you need done?</p>
                <p className="text-[#5a7a8e] text-sm mb-5">Select the service that best describes your project.</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {serviceOptions.map(opt => {
                    const Icon = opt.icon;
                    return (
                      <OptionCard key={opt.value} selected={sel.service === opt.value} onClick={() => set('service', opt.value)}>
                        <div className="w-8 h-8 mb-2.5 flex items-center justify-center" style={{ background: `${opt.accent}15`, border: `1px solid ${opt.accent}30` }}>
                          <Icon className="w-4 h-4" style={{ color: opt.accent }} />
                        </div>
                        <p className="text-white text-[13px] font-semibold leading-tight mb-0.5">{opt.label}</p>
                        <p className="text-[#4a6478] text-[11px] leading-snug">{opt.sub}</p>
                      </OptionCard>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <p className="text-white font-bold text-base mb-1">Where is the property?</p>
                <p className="text-[#5a7a8e] text-sm mb-5">We cover the entire Lower North Island.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {locationOptions.map(loc => (
                    <OptionCard key={loc} selected={sel.location === loc} onClick={() => set('location', loc)}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <p className="text-white text-sm font-medium">{loc}</p>
                      </div>
                    </OptionCard>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="text-white font-bold text-base mb-1">Your contact details</p>
                <p className="text-[#5a7a8e] text-sm mb-5">We&apos;ll send your quote directly to you.</p>
                <div className="flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}><span className="flex items-center gap-1.5"><User className="w-3 h-3" /> Full Name <span className="text-blue-500">*</span></span></label>
                      <input name="name" type="text" autoComplete="name" required value={sel.name} onChange={e => set('name', e.target.value)} placeholder="John Smith" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Company / Organisation</label>
                      <input name="company" type="text" value={sel.company} onChange={e => set('company', e.target.value)} placeholder="Optional" className={inputClass} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}><span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email <span className="text-blue-500">*</span></span></label>
                      <input name="email" type="email" autoComplete="email" inputMode="email" required value={sel.email} onChange={e => set('email', e.target.value)} placeholder="john@example.com" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}><span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> Phone</span></label>
                      <input name="phone" type="tel" autoComplete="tel" value={sel.phone} onChange={e => set('phone', e.target.value)} placeholder="+64 21 000 0000" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Project details (optional)</label>
                    <textarea name="message" rows={3} value={sel.message} onChange={e => set('message', e.target.value)} placeholder="Site access, ground conditions, scope details..." className={`${inputClass} resize-none`} />
                  </div>
                  <div className="border border-white/[0.06] bg-[#020b18] px-4 py-3 flex flex-wrap gap-2.5">
                    {([sel.service, sel.location] as string[]).filter(Boolean).map(val => (
                      <span key={val} className="text-[#7a95ae] text-[11px] border border-white/[0.07] px-2.5 py-1 rounded-sm">{val}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-7 pt-6 border-t border-white/[0.06]">
        {step > 0 ? (
          <button type="button" onClick={back} className="flex items-center gap-1.5 text-[#5a7a8e] hover:text-white text-sm font-semibold transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        ) : <div />}

        {step < STEPS.length - 1 ? (
          <motion.button type="button" onClick={next} disabled={!canNext}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-7 py-3.5 text-[11px] tracking-[0.18em] uppercase transition-colors"
            whileHover={canNext ? { scale: 1.02 } : {}} whileTap={canNext ? { scale: 0.97 } : {}}>
            {canNext ? 'Continue' : 'Select an option'} <ChevronRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button type="submit" disabled={loading || !canNext}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-3.5 text-[11px] tracking-[0.18em] uppercase transition-colors"
            whileHover={canNext ? { scale: 1.02, boxShadow: '0 0 28px rgba(34,129,245,0.45)' } : {}} whileTap={canNext ? { scale: 0.97 } : {}}>
            <Send className="w-3.5 h-3.5" />
            {loading ? 'Sending...' : 'Get My Free Quote'}
          </motion.button>
        )}
      </div>
    </form>
  );
}
