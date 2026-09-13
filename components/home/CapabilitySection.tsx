'use client';

import Image from 'next/image';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { CircleCheck as CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { projectImages } from '@/lib/project-images';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  'Large-diameter pipeline installation',
  'Confined space entry and works',
  'Horizontal directional drilling',
  'Rock breaking and hydraulic hammering',
  'Hydro-vacuum excavation',
  'H&S ConstructSafe qualified',
];

export default function CapabilitySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cap-line', {
        yPercent: 110, opacity: 0, duration: 0.9, ease: 'power4.out', stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      });
      gsap.from('.cap-li', {
        x: -14, opacity: 0, duration: 0.4, ease: 'power2.out', stagger: 0.05,
        scrollTrigger: { trigger: '.cap-ul', start: 'top 84%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#020c18] overflow-hidden">
      <div className="section-line" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-0">

          {/* Left: content */}
          <div className="py-20 lg:py-28 lg:pr-16 xl:pr-24 border-r border-white/[0.05]">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-blue-500 text-[11px] font-bold tracking-[0.25em] uppercase">Enterprise Capability</span>
            </div>

            <div className="overflow-hidden mb-1">
              <h2 className="cap-line block font-black text-white tracking-[-0.03em] leading-[0.88]"
                style={{ fontSize: 'clamp(2rem, 3.2vw, 3.6rem)', fontFamily: 'var(--font-jakarta), sans-serif' }}>
                Plant, People &amp;
              </h2>
            </div>
            <div className="overflow-hidden mb-8">
              <h2 className="cap-line block font-black tracking-[-0.03em] leading-[0.88]"
                style={{
                  fontSize: 'clamp(2rem, 3.2vw, 3.6rem)',
                  fontFamily: 'var(--font-jakarta), sans-serif',
                  background: 'linear-gradient(135deg, #60a5fa 0%, #2281f5 60%, #1a7de0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                Proven Delivery.
              </h2>
            </div>

            <p className="text-[#7a95ae] text-base leading-[1.8] mb-4 max-w-lg">
              Robb &amp; Taylor Contracting operates a modern fleet of excavators, trucks, and specialist plant backed by experienced site operators. From multi-stage water main replacement to large-scale bulk earthworks — we have the equipment and expertise to deliver.
            </p>

            <p className="text-[#56718a] text-base leading-[1.8] mb-10 max-w-lg">
              Serving councils, developers, and prime contractors across the Lower North Island.
            </p>

            <ul className="cap-ul grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {capabilities.map(cap => (
                <li key={cap} className="cap-li flex items-center gap-2.5 text-[#8ba5bc] text-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  {cap}
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className="group inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 text-[11px] tracking-[0.18em] uppercase transition-colors duration-150"
            >
              About Our Team
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Right: real project photos stacked */}
          <div className="py-20 lg:py-28 lg:pl-16 xl:pl-24 flex flex-col gap-5">
            <motion.div
              className="border border-white/[0.06]"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ position: 'relative', width: '100%', paddingTop: '66.67%', overflow: 'hidden' }}>
                <Image fill sizes="(max-width: 768px) 100vw, 50vw" src={projectImages.retainingWallComplete} alt="Robb &amp; Taylor — retaining wall and piling works Wellington" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', filter: 'brightness(1.0) saturate(0.96)' }} />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="corner-tl z-10" /><div className="corner-tr z-10" /><div className="corner-bl z-10" /><div className="corner-br z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020c18]/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3.5 left-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400" />
                    <span className="text-[#6a8598] text-[10px] tracking-widest uppercase font-semibold">Retaining Wall & Piling Works</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="border border-white/[0.06]"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            >
              <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', overflow: 'hidden' }}>
                <Image fill sizes="(max-width: 768px) 100vw, 50vw" src={projectImages.pipes} alt="Robb &amp; Taylor — large-diameter concrete pipe installation Wellington" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', filter: 'brightness(1.0) saturate(0.96)' }} />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020c18]/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3.5 left-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400" />
                    <span className="text-[#6a8598] text-[10px] tracking-widest uppercase font-semibold">Large-Diameter Concrete Pipe Installation</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      <div className="section-line" />
    </section>
  );
}
