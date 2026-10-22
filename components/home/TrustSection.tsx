'use client';
import Image from 'next/image';
import TotikaAccreditation from '@/components/TotikaAccreditation';

import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Award, MapPin } from 'lucide-react';

const differentiators = [
  { icon: ShieldCheck, title: 'Safety Accredited', accent: '#2281f5' },
  { icon: Clock, title: 'Programme Focused', accent: '#1a9fd4' },
  { icon: Award, title: 'Environmentally Focused', accent: '#1ab8c8' },
  { icon: MapPin, title: 'Local Expertise', accent: '#2281f5' },
];

const industryAccreditations = [
  { name: 'SiteWise Gold 2025/26', src: '/images/sitewise-gold-2025-26.png', width: 716, height: 232 },
  { name: 'Civil Contractors New Zealand', src: '/images/civil-contractors-nz.png', width: 1881, height: 820 },
  { name: 'NZDAA Member', src: '/images/nzdaa-member.png', width: 198, height: 199 },
];

export default function TrustSection() {
  return (
    <section className="bg-[#040f1e] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-blue-600/[0.025] blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
      </div>

      <div className="section-line" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 lg:pt-28 pb-14">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <motion.span
              className="kicker block mb-5"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Why Choose Us
            </motion.span>
            <motion.h2
              className="font-black text-white tracking-[-0.03em] leading-[0.9]"
              style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.8rem)', fontFamily: 'var(--font-jakarta), sans-serif' }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Delivery Without<br />
              <span style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #2281f5 60%, #1a7de0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Compromise.
              </span>
            </motion.h2>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-20 lg:pb-28">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.04]">
          {differentiators.map((d, i) => {
            const Icon = d.icon;
            return (
              <motion.div
                key={d.title}
                className="bg-[#040f1e] p-7 group relative overflow-hidden cursor-default flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: `linear-gradient(90deg, ${d.accent}, transparent)` }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${d.accent}08 0%, transparent 60%)` }}
                />

                <div
                  className="w-16 h-16 flex items-center justify-center mb-5 relative"
                  style={{ background: `${d.accent}0d`, border: `1px solid ${d.accent}22` }}
                >
                  <Icon className="w-7 h-7 relative z-10" style={{ color: d.accent }} />
                </div>

                <h4 className="text-white font-bold text-[0.9rem] tracking-tight">{d.title}</h4>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <h3 className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Safety Accredited &amp; Industry Members</h3>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Safety accreditations and industry memberships">
          {industryAccreditations.map((accreditation) => (
            <li key={accreditation.name} className="rounded-xl border border-white/10 bg-white/[0.025] p-4 text-center">
              <div className="flex h-36 items-center justify-center rounded-lg bg-white p-4">
                <Image
                  src={accreditation.src}
                  alt={accreditation.name}
                  width={accreditation.width}
                  height={accreditation.height}
                  sizes="(max-width: 640px) calc(100vw - 112px), (max-width: 1280px) 30vw, 340px"
                  className="max-h-28 w-auto max-w-full object-contain"
                />
              </div>
              <p className="mt-4 text-sm font-semibold text-white/80">{accreditation.name}</p>
            </li>
          ))}
        </ul>
        <TotikaAccreditation businessName="Robb & Taylor Contracting" />
      </div>

      <div className="section-line" />
    </section>
  );
}
