'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ProjectSlideshow from './ProjectSlideshow';

export default function InfrastructureSection() {
  return (
    <section className="bg-[#040f1e]">
      <div className="section-line" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="text-blue-500 text-[11px] font-bold tracking-[0.25em] uppercase block mb-4">
              Our Work
            </span>
            <h2
              className="font-black text-white tracking-[-0.03em] leading-[0.88]"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.6rem)', fontFamily: 'var(--font-jakarta), sans-serif' }}
            >
              Projects &amp;<br />
              <span style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #2281f5 60%, #1a7de0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Site Work.</span>
            </h2>
          </div>
          <p className="text-[#5a7a8e] text-base leading-relaxed max-w-xs lg:text-right">
            Civil infrastructure delivered across the Lower North Island — on time, on spec.
          </p>
        </div>

        {/* Slideshow */}
        <ProjectSlideshow compact />

        {/* CTA strip */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/[0.07] px-7 py-5 bg-white/[0.015]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-px h-8 bg-blue-500/40 hidden sm:block" />
            <p className="text-[#5a7a8e] text-sm leading-snug">
              Every project delivered on time, on spec —<br className="hidden sm:block" />
              <span className="text-[#8bacc0]"> with a single accountable team from start to finish.</span>
            </p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold uppercase tracking-[0.16em] px-6 py-3 transition-colors flex-shrink-0"
          >
            Discuss your project
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <div className="section-line" />
    </section>
  );
}
