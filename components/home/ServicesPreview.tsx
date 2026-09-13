'use client';

import Image from 'next/image';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { projectImages } from '@/lib/project-images';

const services = [
  {
    number: '01',
    title: 'Civil Construction',
    href: '/services/civil-construction',
    description: 'Full-scope civil construction from initial groundworks through to final reinstatement. Roading, kerb & channel, retaining structures, utilities.',
    accent: '#2281f5',
    image: projectImages.robbTaylorExcavator,
    imageAlt: 'Civil construction Wellington — Robb & Taylor Contracting',
    tag: 'Foundation Work',
  },
  {
    number: '02',
    title: 'Retaining & Piling Works',
    href: '/services/retaining-piling',
    description: 'Retaining walls and piling works for residential, commercial and infrastructure projects across the Lower North Island.',
    accent: '#c87820',
    image: projectImages.retainingWallComplete,
    imageAlt: 'Retaining and piling works — Robb & Taylor civil contractors',
    tag: 'Structural',
  },
  {
    number: '03',
    title: 'Earthworks & Pavements',
    href: '/services/earthworks',
    description: 'Earthworks for subdivision and infrastructure. Cut and fill, compaction, subgrade and pavement preparation at scale.',
    accent: '#c8841a',
    image: projectImages.indoorExcavation,
    imageAlt: 'Earthworks contractors Wellington — civil site bulk excavation',
    tag: 'Bulk & Precision',
  },

  {
    number: '04',
    title: 'Trenching',
    href: '/services/trenching',
    description: 'Precision trenching for utility and pipeline installation. Tracked and wheeled machines suited to any site and ground condition.',
    accent: '#b83820',
    image: projectImages.trenchingSite,
    imageAlt: 'Trenching contractors Wellington — internal concrete trenching works',
    tag: 'Utility & Pipeline',
  },
];

export default function ServicesPreview() {
  return (
    <section className="bg-[#020c18] overflow-hidden">
      {/* Section header */}
      <div className="border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <motion.span
                className="kicker block mb-5"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                What We Do
              </motion.span>
              <motion.h2
                className="font-black text-white tracking-[-0.03em] leading-[0.9]"
                style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.8rem)', fontFamily: 'var(--font-jakarta), sans-serif' }}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                Full-Scope Civil<br />
                <span className="text-[#4a6478] font-normal">Construction Services</span>
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors"
              >
                View all services
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Service grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            className="group relative w-full border-b border-r border-white/[0.04]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, delay: i * 0.07 }}
          >
            <div style={{ position: 'relative', width: '100%', paddingTop: '66.67%', overflow: 'hidden' }}>
              <Image fill sizes="(max-width: 768px) 100vw, 50vw"
                src={s.image}
                alt={s.imageAlt}
                className="group-hover:scale-[1.04] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', filter: 'brightness(0.80) saturate(0.92)' }}
              />
              {/* Gradients */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(160deg, ${s.accent}1a 0%, transparent 55%)` }} />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(2,12,24,0.98) 0%, rgba(2,12,24,0.68) 45%, rgba(2,12,24,0.12) 100%)' }} />
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, ${s.accent}, transparent)` }} />
              </div>
              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-7 pointer-events-none">
                <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]">
                  <h3 className="text-white font-bold text-xl mb-3 leading-tight" style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}>{s.title}</h3>
                  <p className="text-[#6a8ca8] text-sm leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">{s.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" style={{ color: s.accent }}>
                    Learn more <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
              {/* Tag badge */}
              <div className="absolute top-5 left-5 z-20 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-sm border border-white/[0.1] px-2.5 py-1 text-[9px] font-bold tracking-[0.2em] uppercase text-white/50">{s.tag}</span>
              </div>
              {/* Corner arrow */}
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 pointer-events-none">
                <div className="w-7 h-7 flex items-center justify-center" style={{ border: `1px solid ${s.accent}40`, background: `${s.accent}10` }}>
                  <ArrowUpRight className="w-3.5 h-3.5" style={{ color: s.accent }} />
                </div>
              </div>
              {/* Full-card link */}
              <Link href={s.href} className="absolute inset-0 z-30" aria-label={`${s.title} — civil contractors Wellington`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA strip */}
      <div className="border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[#3a5060] text-sm">
            All services delivered with an environmentally focused approach and to Wellington Water specification.
          </p>
          <Link
            href="/contact"
            className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold tracking-[0.2em] uppercase px-7 py-3 transition-colors duration-200 flex-shrink-0"
          >
            Get a Free Quote
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
