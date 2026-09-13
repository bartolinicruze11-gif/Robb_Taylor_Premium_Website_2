'use client';

import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ArrowRight, CircleCheck as CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { serviceImages } from '@/lib/project-images';
import { services } from '@/lib/services';



export default function ServicesPage() {
  return (
    <div className="bg-[#020d1a] min-h-screen">

      {/* Page header */}
      <section className="relative pt-36 pb-20 lg:pt-48 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.022]" style={{
          backgroundImage: `linear-gradient(rgba(34,129,245,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(34,129,245,0.7) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Services' }]} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-blue-500" />
              <span className="text-blue-400 text-[11px] font-semibold tracking-[0.2em] uppercase">What We Deliver</span>
            </div>
            <h1
              className="font-black text-white tracking-[-0.03em] leading-[0.9] mb-7"
              style={{ fontSize: 'clamp(2.6rem, 5vw, 5.2rem)' }}
            >
              Civil Construction<br />
              <span className="text-blue-400">Services</span>
            </h1>
            <p className="text-[#8ba5c0] text-base lg:text-lg max-w-2xl leading-relaxed">
              Full-scope civil contracting across the Lower North Island. Earthworks & pavements, retaining & piling, trenching — we have the plant, people, and experience to deliver.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services list */}
      <section className="relative bg-[#040f1e] py-16 lg:py-20">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col gap-0">
            {services.map((service, index) => {
              const isEven = index % 2 === 0;
              const img = serviceImages[service.slug as keyof typeof serviceImages];
              return (
                <motion.div
                  key={service.title}
                  className="grid lg:grid-cols-2 gap-0 border-b border-white/[0.06] last:border-b-0"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Image panel */}
                  <div className={`group ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div style={{ position: 'relative', width: '100%', paddingTop: '75%', overflow: 'hidden' }}>
                      <img src={img} alt={`${service.title} — Robb & Taylor Wellington`} className="group-hover:scale-[1.04] transition-transform duration-700" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%', filter: 'brightness(0.95) saturate(0.95)' }} />
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, ${service.accent}, transparent)` }} />
                        <div className="absolute bottom-5 left-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="inline-flex items-center gap-1.5 text-white text-[11px] font-bold uppercase tracking-widest bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-sm">
                            View Service <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                      <Link href={`/services/${service.slug}`} className="absolute inset-0" aria-label={`View ${service.title}`} />
                    </div>
                  </div>

                  {/* Content panel */}
                  <div className={`flex flex-col justify-center p-10 lg:p-14 bg-[#06111f] ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-[#1e2f3c] font-black text-3xl tabular-nums leading-none select-none">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="h-px flex-1 bg-white/[0.05]" />
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-black text-white tracking-[-0.02em] mb-4 leading-tight">
                      {service.title}
                    </h2>
                    <p className="text-[#7a95ae] text-base leading-[1.8] mb-7">
                      {service.description}
                    </p>

                    <ul className="grid grid-cols-1 gap-2 mb-8">
                      {service.capabilities.slice(0, 4).map(cap => (
                        <li key={cap} className="flex items-center gap-2.5 text-[#5a7a8e] text-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: service.accent }} />
                          {cap}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-2.5 border border-white/[0.12] hover:border-blue-500/50 hover:bg-blue-500/8 text-white font-bold px-6 py-3 text-[11px] tracking-[0.15em] uppercase transition-all duration-200"
                      >
                        Learn More <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 text-[11px] tracking-[0.15em] uppercase transition-colors duration-200"
                      >
                        Get a Quote
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-[#020d1a] py-20 lg:py-28 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[260px] bg-blue-500/4 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-6 h-px bg-blue-500" />
              <span className="text-blue-400 text-[11px] font-semibold tracking-[0.2em] uppercase">Start Your Project</span>
              <div className="w-6 h-px bg-blue-500" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-[-0.02em] mb-5">Have a Project in Mind?</h2>
            <p className="text-[#7a95ae] text-base mb-10 max-w-lg mx-auto leading-relaxed">
              Get in touch to discuss your requirements and receive a competitive quote. We serve the Lower North Island.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 text-[11px] tracking-[0.15em] uppercase transition-colors duration-200"
              >
                Request a Quote <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2.5 border border-white/15 hover:border-white/25 text-white/75 hover:text-white font-semibold px-8 py-4 text-[11px] tracking-[0.15em] uppercase transition-all duration-200"
              >
                About Our Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
