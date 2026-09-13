'use client';

import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import ContactFormWizard from './ContactFormWizard';

const contactCards = [
  { icon: Phone, label: 'Phone', value: '+64 21 027 4447', href: 'tel:+64210274447' },
  { icon: Mail, label: 'Email', value: 'Rene@RobbTaylor.co.nz', href: 'mailto:Rene@RobbTaylor.co.nz' },
  { icon: MapPin, label: 'Service Area', value: 'Lower North Island, New Zealand', href: null },
  { icon: Clock, label: 'Response Time', value: 'Same day — usually within hours', href: null },
];

const nextSteps = [
  { step: '01', title: 'Submit your request', desc: 'Fill in the quick form — takes under a minute.' },
  { step: '02', title: 'We review your project', desc: 'A team member will look over your enquiry and scope the works.' },
  { step: '03', title: 'Receive your quote', desc: 'A detailed, competitive quote sent directly to your inbox.' },
  { step: '04', title: 'We get to work', desc: 'Mobilise quickly with a dedicated site team from day one.' },
];

export default function ContactPageContent() {
  return (
    <div className="bg-[#020c18] min-h-screen">

      {/* Page header */}
      <section className="relative pt-36 pb-10 lg:pt-48 lg:pb-12 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.018]" style={{
          backgroundImage: `linear-gradient(rgba(34,129,245,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(34,129,245,0.7) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[240px] bg-blue-500/[0.04] blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-blue-500" />
              <span className="text-blue-400 text-[11px] font-bold tracking-[0.25em] uppercase">Free Quote — No Obligation</span>
            </div>
            <h1 className="font-black text-white tracking-[-0.03em] leading-[0.88] mb-5"
              style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4.4rem)' }}>
              Get Your Free<br />
              <span style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #2281f5 55%, #1a7de0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Civil Quote
              </span>
            </h1>
            <p className="text-[#7a95ae] text-base lg:text-lg max-w-xl leading-relaxed">
              Wellington civil contractors specialising in earthworks, retaining & piling, and civil construction across the Lower North Island.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main 2-column layout */}
      <section className="relative bg-[#040f1e] py-12 lg:py-16">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-5 gap-10 xl:gap-16">

            {/* LEFT — Contact info + What happens next */}
            <aside className="lg:col-span-2 flex flex-col gap-8">

              {/* Contact cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="text-white font-bold text-sm tracking-[0.05em] mb-5">Contact Us Directly</h2>
                <div className="grid grid-cols-1 gap-3">
                  {contactCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.label}
                        className="flex items-start gap-4 border border-white/[0.06] bg-[#06111f] p-4 group hover:border-blue-500/25 transition-colors duration-200"
                      >
                        <div className="w-9 h-9 border border-blue-500/20 bg-blue-500/[0.07] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-[#3d5668] text-[10px] font-bold uppercase tracking-[0.18em] mb-0.5">{card.label}</p>
                          {card.href ? (
                            <a href={card.href} className="text-[#b0c8e0] text-sm font-medium hover:text-blue-400 transition-colors">
                              {card.value}
                            </a>
                          ) : (
                            <p className="text-[#b0c8e0] text-sm font-medium">{card.value}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* What happens next */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="text-white font-bold text-sm tracking-[0.05em] mb-5">What Happens Next?</h2>
                <div className="flex flex-col gap-0">
                  {nextSteps.map((item, i) => (
                    <div key={item.step} className="flex gap-4 group">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-8 h-8 border border-blue-500/30 bg-blue-500/[0.08] flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-400 text-[10px] font-black tabular-nums">{item.step}</span>
                        </div>
                        {i < nextSteps.length - 1 && (
                          <div className="w-px flex-1 bg-gradient-to-b from-blue-500/20 to-transparent min-h-[24px] mt-1" />
                        )}
                      </div>
                      <div className={`pb-5 ${i < nextSteps.length - 1 ? '' : ''}`}>
                        <p className="text-white font-semibold text-sm leading-tight mb-1">{item.title}</p>
                        <p className="text-[#5a7a8e] text-[13px] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </aside>

            {/* RIGHT — Quote form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative border border-white/[0.07] bg-[#06111f] p-7 lg:p-9 overflow-hidden sticky top-24">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600/70 via-blue-400/40 to-transparent" />
                <div className="mb-7">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-white font-bold text-lg tracking-tight">Get Your Free Quote</h2>
                    <span className="text-[#3d5668] text-[11px] font-semibold border border-white/[0.06] px-2.5 py-1">3 Steps</span>
                  </div>
                  <p className="text-[#5a7a8e] text-sm">No obligation. Takes under 60 seconds.</p>
                </div>
                <ContactFormWizard />
                <p className="text-[#2a3d4e] text-[10px] text-center mt-5">Your information is kept strictly private and never shared.</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
}
