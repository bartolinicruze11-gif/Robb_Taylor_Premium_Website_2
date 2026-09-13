'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, MapPin, ArrowRight, Mail, ShieldCheck, CircleAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const serviceOptions = [
  'Civil Construction', 'Water Infrastructure', 'Drainage',
  'Earthworks', 'Trenching', 'Pipe Installation', 'Site Preparation', 'Other / Multiple Services',
];

const locationOptions = [
  'Wellington City', 'Lower Hutt', 'Upper Hutt', 'Porirua',
  'Kapiti Coast', 'Wairarapa', 'Other / Not listed',
];

const timelineOptions = [
  'ASAP — urgent', 'Within 1 month', '1–3 months', '3–6 months', 'Flexible / not sure',
];

const budgetOptions = [
  'Under $50K', '$50K – $250K', '$250K – $1M', '$1M – $5M', '$5M+', 'Not sure yet',
];

const fieldCls = 'w-full bg-white/[0.03] border border-white/[0.07] focus:border-blue-500/40 focus:bg-white/[0.05] text-white placeholder-[#2d4455] text-sm px-5 py-3.5 outline-none transition-all duration-150';

export default function ContactCTA() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      company: (form.elements.namedItem('company') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      service: (form.elements.namedItem('service') as HTMLSelectElement).value,
      location: (form.elements.namedItem('location') as HTMLSelectElement).value,
      timeline: (form.elements.namedItem('timeline') as HTMLSelectElement).value,
      budget: (form.elements.namedItem('budget') as HTMLSelectElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    const { error: dbError } = await supabase.from('quotes').insert(data);

    if (dbError) {
      setError('Something went wrong. Please try again or call us directly.');
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-quote-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(data),
    }).catch(() => {});

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'generate_lead', { event_category: 'engagement' });
    }

    router.push('/contact/thank-you');
  }

  return (
    <section className="bg-[#020c18]">
      <div className="section-line" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-start">

          {/* Left: content */}
          <div className="lg:sticky lg:top-24">
            <span className="text-blue-500 text-[11px] font-bold tracking-[0.25em] uppercase block mb-5">Start Your Project</span>

            <h2
              className="font-black text-white tracking-[-0.03em] leading-[0.88] mb-7"
              style={{ fontSize: 'clamp(2.2rem, 3.8vw, 4rem)', fontFamily: 'var(--font-jakarta), sans-serif' }}
            >
              Request a Quote<br />
              <span style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #2281f5 60%, #1a7de0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Today.</span>
            </h2>

            <p className="text-[#6a8598] text-base leading-[1.85] mb-12 max-w-md">
              We respond within 24 hours. Accurate estimates and technical advice across the Lower North Island.
            </p>

            {/* Contact items */}
            <div className="flex flex-col gap-6 mb-12">
              <a href="tel:+64210274447" className="flex items-center gap-4 group">
                <div className="w-10 h-10 border border-white/[0.07] flex items-center justify-center group-hover:border-blue-500/40 group-hover:bg-blue-500/8 transition-all flex-shrink-0">
                  <Phone className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[#3d5668] text-[10px] font-semibold uppercase tracking-[0.15em] mb-0.5">Phone</p>
                  <p className="text-white font-semibold group-hover:text-blue-400 transition-colors">+64 21 027 4447</p>
                </div>
              </a>
              <a href="mailto:Rene@RobbTaylor.co.nz" className="flex items-center gap-4 group">
                <div className="w-10 h-10 border border-white/[0.07] flex items-center justify-center group-hover:border-blue-500/40 group-hover:bg-blue-500/8 transition-all flex-shrink-0">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[#3d5668] text-[10px] font-semibold uppercase tracking-[0.15em] mb-0.5">Email</p>
                  <p className="text-white font-semibold group-hover:text-blue-400 transition-colors">Rene@RobbTaylor.co.nz</p>
                </div>
              </a>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-white/[0.07] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[#3d5668] text-[10px] font-semibold uppercase tracking-[0.15em] mb-0.5">Region</p>
                  <p className="text-white font-semibold">Lower North Island, NZ</p>
                </div>
              </div>
            </div>

            {/* Accreditation strip */}
            <div className="border border-white/[0.06] p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <p className="text-white text-sm font-semibold">Accreditations &amp; Certifications</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Env. Focused', 'ConstructSafe', 'Site Safe Gold', '$10M Liability', 'Council Approved'].map(tag => (
                  <span key={tag} className="text-[10px] font-semibold text-[#5a7a8e] border border-white/[0.07] px-3 py-1.5 uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <motion.div
            className="relative border border-white/[0.07] bg-[#040f1e] overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="h-[2px] bg-gradient-to-r from-blue-600 via-blue-400/50 to-transparent" />

            <div className="p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h3 className="text-white font-bold text-lg mb-1">Tell us about your project</h3>

                {error && (
                  <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 px-4 py-3">
                    <CircleAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[#3d5668] text-[10px] font-semibold uppercase tracking-[0.15em]">Full Name *</label>
                    <input name="name" type="text" required placeholder="John Smith" className={fieldCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[#3d5668] text-[10px] font-semibold uppercase tracking-[0.15em]">Company</label>
                    <input name="company" type="text" placeholder="Company Ltd." className={fieldCls} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[#3d5668] text-[10px] font-semibold uppercase tracking-[0.15em]">Email *</label>
                    <input name="email" type="email" required placeholder="you@company.com" className={fieldCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[#3d5668] text-[10px] font-semibold uppercase tracking-[0.15em]">Phone</label>
                    <input name="phone" type="tel" placeholder="+64 00 000 0000" className={fieldCls} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[#3d5668] text-[10px] font-semibold uppercase tracking-[0.15em]">Service *</label>
                    <select name="service" required className={`${fieldCls} appearance-none`}>
                      <option value="">Select a service</option>
                      {serviceOptions.map(s => (
                        <option key={s} value={s} className="bg-[#040f1e]">{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[#3d5668] text-[10px] font-semibold uppercase tracking-[0.15em]">Location *</label>
                    <select name="location" required className={`${fieldCls} appearance-none`}>
                      <option value="">Select location</option>
                      {locationOptions.map(l => (
                        <option key={l} value={l} className="bg-[#040f1e]">{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[#3d5668] text-[10px] font-semibold uppercase tracking-[0.15em]">Timeline *</label>
                    <select name="timeline" required className={`${fieldCls} appearance-none`}>
                      <option value="">Select timeline</option>
                      {timelineOptions.map(t => (
                        <option key={t} value={t} className="bg-[#040f1e]">{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[#3d5668] text-[10px] font-semibold uppercase tracking-[0.15em]">Budget *</label>
                    <select name="budget" required className={`${fieldCls} appearance-none`}>
                      <option value="">Select budget</option>
                      {budgetOptions.map(b => (
                        <option key={b} value={b} className="bg-[#040f1e]">{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#3d5668] text-[10px] font-semibold uppercase tracking-[0.15em]">Project Brief</label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Describe the scope, location, and timeline..."
                    className={`${fieldCls} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex items-center justify-center gap-2.5 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 text-[11px] tracking-[0.18em] uppercase transition-colors duration-150 mt-1"
                >
                  {loading ? 'Sending…' : 'Send Enquiry'}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <p className="text-center text-[#2d4455] text-[10px] font-medium tracking-wider">
                  Secure &amp; private · Response within 24 hours
                </p>
              </form>
            </div>
          </motion.div>

        </div>
      </div>

      <div className="section-line" />
    </section>
  );
}
