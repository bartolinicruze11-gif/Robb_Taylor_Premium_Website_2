'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, ArrowLeft, CircleCheck as CheckCircle2, Phone, Mail, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectSlideshow, { type SlideshowPhoto } from '@/components/home/ProjectSlideshow';

interface Props {
  number: string;
  title: string;
  accent: string;
  description: string;
  longDescription: string;
  image: string;
  capabilities: string[];
  keywords: string;
  slideshowPhotos?: SlideshowPhoto[];
}

const allServices = [
  { label: 'Civil Construction',   href: '/services/civil-construction' },
  { label: 'Earthworks & Pavements', href: '/services/earthworks' },
  { label: 'Retaining & Piling Works', href: '/services/retaining-piling' },
  { label: 'Trenching',            href: '/services/trenching' },
  { label: 'Pipe Installation',    href: '/services/pipe-installation' },
  { label: 'Site Preparation',     href: '/services/site-preparation' },
];

export default function ServiceDetailPage({ number, title, accent, description, longDescription, image, capabilities, slideshowPhotos }: Props) {
  const [lightbox, setLightbox] = useState(false);

  return (
    <div className="bg-[#020d1a] min-h-screen">

      {/* Page header */}
      <section className="relative pt-36 pb-0 lg:pt-48 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.018]" style={{
          backgroundImage: `linear-gradient(rgba(34,129,245,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(34,129,245,0.7) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-[#5a7a8e] hover:text-white text-[11px] font-semibold tracking-[0.18em] uppercase mb-7 transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              All Services
            </Link>

            <div className="flex items-start gap-5 mb-5">
              <span className="text-[#1e2f3c] font-black text-5xl tabular-nums leading-none select-none mt-1">{number}</span>
              <div>
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase block mb-2" style={{ color: accent }}>
                  Service
                </span>
                <h1
                  className="font-black text-white tracking-[-0.03em] leading-[0.9]"
                  style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4.8rem)' }}
                >
                  {title}
                </h1>
              </div>
            </div>
            <p className="text-[#8ba5c0] text-base lg:text-lg max-w-2xl leading-relaxed">{description}</p>
          </motion.div>
        </div>

        {/* Hero image — clickable to open lightbox */}
        <motion.div
          className="cursor-zoom-in group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          onClick={() => setLightbox(true)}
          role="button"
          aria-label={`View full image of ${title}`}
        >
          <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', overflow: 'hidden', background: '#040f1e' }}>
            <img src={image} alt={`Robb & Taylor — ${title} Wellington`} className="group-hover:scale-[1.02] transition-transform duration-700" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', filter: 'brightness(1.0) saturate(0.96)' }} />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-[#020d1a] via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${accent}60, transparent 60%)` }} />
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm border border-white/10 p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm">
                <ZoomIn className="w-4 h-4 text-white/70" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <section className="relative bg-[#040f1e] py-16 lg:py-24">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-3 gap-12 xl:gap-16">

            {/* Main content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-black text-white tracking-tight mb-5">About This Service</h2>
              <p className="text-[#7a95ae] text-base leading-[1.8] mb-10">{longDescription}</p>

              <h3 className="text-white font-bold text-lg mb-5">Capabilities</h3>
              <ul className="grid sm:grid-cols-2 gap-3 mb-10">
                {capabilities.map((cap, i) => (
                  <motion.li
                    key={cap}
                    className="flex items-center gap-2.5 text-[#8ba5c0] text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: accent }} />
                    {cap}
                  </motion.li>
                ))}
              </ul>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 text-[11px] tracking-[0.18em] uppercase transition-colors duration-150"
              >
                Request a Quote
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-6">

              {/* Contact card */}
              <div className="relative border border-white/[0.06] bg-[#06111f] p-6 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${accent}80, transparent)` }} />
                <h3 className="text-white font-bold text-sm mb-1">Talk to Rene</h3>
                <p className="text-[#5a7a8e] text-sm leading-relaxed mb-5">
                  Get a competitive quote for your project. Rene is available to discuss requirements directly.
                </p>
                <div className="flex flex-col gap-3">
                  <a href="tel:+64210274447" className="flex items-center gap-2.5 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                    +64 21 027 4447
                  </a>
                  <a href="mailto:Rene@RobbTaylor.co.nz" className="flex items-center gap-2.5 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                    Rene@RobbTaylor.co.nz
                  </a>
                </div>
                <Link
                  href="/contact"
                  className="mt-5 flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold uppercase tracking-widest py-3 transition-colors"
                >
                  Get a Quote <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Other services */}
              <div className="border border-white/[0.06] bg-[#06111f] p-6">
                <h3 className="text-white font-bold text-sm mb-4">Other Services</h3>
                <ul className="flex flex-col gap-2">
                  {allServices
                    .filter(s => !s.href.includes(title.toLowerCase().replace(/ /g, '-')))
                    .map(s => (
                      <li key={s.href}>
                        <Link href={s.href} className="flex items-center gap-1.5 text-[#5a7a8e] hover:text-white text-sm transition-colors group">
                          <ArrowRight className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                          {s.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Slideshow — only rendered when photos are provided */}
      {slideshowPhotos && slideshowPhotos.length > 0 && (
        <ProjectSlideshow
          photos={slideshowPhotos}
          autoplayMs={4000}
          kicker="Project Gallery"
          heading={`${title} in Action`}
          subheading="From our completed and active projects across New Zealand."
          compact
        />
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <motion.img
              src={image}
              alt={`Robb & Taylor — ${title}`}
              className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-2xl"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
