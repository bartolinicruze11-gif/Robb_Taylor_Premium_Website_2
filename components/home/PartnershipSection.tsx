'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Wrench, HardHat, CircleCheck as CheckCircle } from 'lucide-react';

const sharedCapabilities = [
  'Full civil + demolition packages',
  'Greenfield and brownfield sites',
  'Council infrastructure projects',
  'Commercial and industrial development',
];

export default function PartnershipSection() {
  return (
    <section className="bg-[#020c18] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/[0.04] blur-3xl rounded-full" />
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-blue-400/[0.03] blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <span className="text-blue-500 text-[11px] font-bold tracking-[0.25em] uppercase block mb-4">
            Industry Partnership
          </span>
          <h2
            className="font-black text-white tracking-[-0.025em] leading-[0.92] mb-4"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3.4rem)' }}
          >
            Complete Project Delivery<br />
            <span className="text-blue-400">From Demolition to Infrastructure</span>
          </h2>
          <p className="text-[#5a7a8e] text-base max-w-xl mx-auto leading-relaxed">
            Robb &amp; Taylor Contracting partners with EMT Demolition to provide clients with a fully integrated solution — demolition, earthworks, and civil infrastructure under one trusted network.
          </p>
        </motion.div>

        {/* Partner cards */}
        <div className="grid lg:grid-cols-2 gap-px bg-white/[0.05] mb-10">

          {/* Robb & Taylor card */}
          <motion.div
            className="bg-[#020c18] p-10 lg:p-12 relative group"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 to-transparent" />

            <div className="flex items-start gap-5 mb-7">
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-blue-600/10 border border-blue-500/20">
                <HardHat className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-400 text-[11px] font-bold tracking-[0.2em] uppercase mb-1">Civil Infrastructure</p>
                <h3 className="text-white font-black text-xl leading-tight">Robb &amp; Taylor<br />Contracting</h3>
              </div>
            </div>

            <p className="text-[#5a7a8e] text-sm leading-relaxed mb-7">
              Specialist civil contractors delivering water infrastructure, drainage, earthworks & pavements, trenching and pipe installation across the Lower North Island. Trusted by councils and developers for reliable, environmentally focused delivery.
            </p>

            <ul className="flex flex-col gap-2.5 mb-8">
              {['Water mains & reticulation', 'Stormwater drainage systems', 'Bulk earthworks & grading', 'Pipeline installation'].map(item => (
                <li key={item} className="flex items-center gap-2.5 text-[#8ba5bc] text-sm">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 text-[#3d5668] text-[11px] font-bold tracking-[0.18em] uppercase">
              <span className="w-1 h-1 bg-blue-500" />
              robbtaylor.co.nz
            </div>
          </motion.div>

          {/* EMT Demolition card */}
          <motion.a
            href="https://www.emtdemolition.co.nz"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#020c18] p-10 lg:p-12 relative group block hover:bg-[#040f1e] transition-colors duration-300 cursor-pointer"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-blue-600/80 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start justify-between mb-7">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-blue-600/10 border border-blue-500/20 group-hover:bg-blue-600/20 group-hover:border-blue-500/40 transition-all">
                  <Wrench className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-blue-400 text-[11px] font-bold tracking-[0.2em] uppercase mb-1">Demolition Specialist</p>
                  <h3 className="text-white font-black text-xl leading-tight">EMT Demolition</h3>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#3d5668] group-hover:text-blue-400 transition-colors flex-shrink-0 mt-1" />
            </div>

            <p className="text-[#5a7a8e] text-sm leading-relaxed mb-7">
              EMT Demolition are trusted demolition and deconstruction specialists. Together with Robb &amp; Taylor, we deliver seamless site clearance through to civil construction — one network, full accountability.
            </p>

            <ul className="flex flex-col gap-2.5 mb-8">
              {['Structural demolition', 'Industrial deconstruction', 'Hazardous material removal', 'Site clearance & preparation'].map(item => (
                <li key={item} className="flex items-center gap-2.5 text-[#8ba5bc] text-sm">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 text-[11px] font-bold tracking-[0.18em] uppercase transition-colors">
              <span>Visit emtdemolition.co.nz</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.a>

        </div>

        {/* Combined capabilities strip */}
        <motion.div
          className="border border-white/[0.06] bg-[#040f1e] px-8 py-6"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-shrink-0">
              <p className="text-[#3d5668] text-[10px] font-bold tracking-[0.22em] uppercase mb-1">Combined Capability</p>
              <p className="text-white font-bold text-sm">Full project lifecycle</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/[0.06]" />
            <div className="flex flex-wrap gap-3 flex-1">
              {sharedCapabilities.map(cap => (
                <span key={cap} className="flex items-center gap-2 text-[#7a95ae] text-xs border border-white/[0.07] px-3 py-2">
                  <span className="w-1 h-1 bg-blue-500 flex-shrink-0" />
                  {cap}
                </span>
              ))}
            </div>
            <a
              href="https://www.emtdemolition.co.nz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-2 text-blue-400 hover:text-blue-300 text-[11px] font-bold tracking-[0.15em] uppercase transition-colors group"
            >
              EMT Demolition
              <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </motion.div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
    </section>
  );
}
