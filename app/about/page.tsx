'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { CircleCheck as CheckCircle2, ArrowRight, Users, Wrench, Shield, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { projectImages } from '@/lib/project-images';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CapabilitySection from '@/components/home/CapabilitySection';

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: Shield,
    title: 'Safety First',
    accent: '#2281f5',
    description: 'Every site operates under our rigorous H&S management system. ConstructSafe qualified operators, pre-task planning, and no compromise on safe work practices.',
  },
  {
    icon: Award,
    title: 'Quality Delivery',
    accent: '#1a9fd4',
    description: 'High standards on every project. On-spec, on-time delivery backed by a quality management system and experienced site supervision.',
  },
  {
    icon: Wrench,
    title: 'Right Plant, Right Job',
    accent: '#1ab8c8',
    description: 'A modern, well-maintained fleet of excavators, trucks, and specialist equipment — mobilise quickly and work efficiently on any site condition.',
  },
  {
    icon: Users,
    title: 'Experienced Team',
    accent: '#2281f5',
    description: 'Operators, supervisors, and project managers with deep civil infrastructure experience. Long-standing relationships with councils and developers.',
  },
];

const certifications = [
  'ConstructSafe Site Safe certification',
  'NZ Transport Agency approved',
  'Confined space entry certified',
  'First aid and emergency response',
  'ISO-aligned health & safety management',
];

export default function AboutPage() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-reveal', {
        y: 24, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#020c18] min-h-screen">

      {/* Page header */}
      <section className="relative pt-36 pb-20 lg:pt-48 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.022]" style={{
          backgroundImage: `linear-gradient(rgba(34,129,245,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(34,129,245,0.7) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-blue-500 text-[11px] font-bold tracking-[0.25em] uppercase block mb-5">Who We Are</span>
              <h1
                className="font-black text-white tracking-[-0.03em] leading-[0.9] mb-7"
                style={{ fontSize: 'clamp(2.6rem, 4.8vw, 4.8rem)' }}
              >
                About Robb &amp;<br />
                <span className="text-blue-400">Taylor Contracting</span>
              </h1>
              <p className="text-[#5a7a8e] text-base leading-relaxed mb-8">
                We started with a clear focus: deliver quality civil work on time and on spec, every time. That commitment has built us a strong reputation for reliable delivery on technically demanding infrastructure projects across the Wellington Region.
              </p>
              <div className="flex flex-col gap-2">
                <a href="tel:+64210274447" className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
                  +64 21 027 4447
                </a>
                <a href="mailto:Rene@RobbTaylor.co.nz" className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
                  Rene@RobbTaylor.co.nz
                </a>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            >
              <div className="border border-white/[0.07]">
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', overflow: 'hidden' }}>
                  <img src={projectImages.aboutHero} alt="Robb &amp; Taylor Contracting - civil infrastructure works" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', filter: 'brightness(1.0) saturate(0.96)' }} />
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-blue-500/40 z-10" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-blue-500/40 z-10" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-blue-500/40 z-10" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-blue-500/40 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020c18]/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-400" />
                      <span className="text-[#6a8598] text-[10px] tracking-widest uppercase font-semibold">Infrastructure Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rene — founder profile */}
      <section className="relative bg-[#040f1e] py-20 lg:py-28 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[320px_1fr] gap-12 xl:gap-20 items-start">

            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.75 }}
              className="flex flex-col items-center lg:items-start gap-5"
            >
              <div className="relative w-52 h-52 lg:w-64 lg:h-64 flex-shrink-0">
                <div className="absolute inset-0 rounded-full border border-blue-500/20" />
                <div className="absolute -inset-2 rounded-full border border-blue-500/8" />
                <img
                  src="/images/Screenshot_2026-04-22_122210.png"
                  alt="Rene Robb — Founder & Director, Robb & Taylor Contracting"
                  className="w-full h-full object-cover rounded-full"
                  style={{ objectPosition: '50% 30%', filter: 'brightness(1.02) saturate(0.97)' }}
                />
              </div>
              <div className="text-center lg:text-left">
                <p className="text-white font-bold text-base leading-tight">Rene Robb</p>
                <p className="text-blue-400 text-[11px] font-semibold tracking-[0.18em] uppercase mt-1">Founder &amp; Director</p>
                <div className="mt-3 flex flex-col gap-1.5">
                  <a href="tel:+64210274447" className="text-[#5a7a8e] hover:text-blue-400 text-xs font-medium transition-colors">+64 21 027 4447</a>
                  <a href="mailto:Rene@RobbTaylor.co.nz" className="text-[#5a7a8e] hover:text-blue-400 text-xs font-medium transition-colors">Rene@RobbTaylor.co.nz</a>
                </div>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.75, delay: 0.1 }}
            >
              <span className="text-blue-500 text-[11px] font-bold tracking-[0.25em] uppercase block mb-4">Meet the Director</span>
              <h2 className="font-black text-white tracking-[-0.025em] leading-[0.92] mb-6"
                style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.8rem)' }}>
                Precision in the Ground.<br />Accountability at the Top.
              </h2>

              <div className="space-y-4 text-[#7a95ae] text-base leading-relaxed">
                <p>
                  Rene Robb founded Robb &amp; Taylor Contracting on a deceptively simple premise — that the civil contracting industry deserved a firm built around genuine technical competence and an unconditional commitment to delivery. Holding a <span className="text-[#a0b8cc] font-semibold">Bachelor of Engineering</span>, he brings a level of analytical rigour to infrastructure work that most contractors simply cannot match.
                </p>
                <p>
                  Over more than 15 years operating across the Wellington Region, Rene has personally directed hundreds of projects — from complex urban water main replacements and pressurised pipeline networks to large-scale bulk earthworks and stormwater infrastructure. He remains hands-on at every stage: tender pricing, methodology planning, plant selection, and site-level quality assurance. Nothing leaves his oversight unchecked.
                </p>
                <p>
                  His operating philosophy is rooted in transparency and precision. Clients receive honest pricing, realistic programmes, and a team that holds to the agreed standard from first mobilisation through to final reinstatement. That consistency has built enduring working relationships with councils and a select group of the region&apos;s most respected developers and prime contractors.
                </p>
                <p className="text-[#5a7a8e]">
                  Rene&apos;s longer-term focus is deliberate growth — deepening the company&apos;s technical capabilities, cultivating the next generation of site leadership, and positioning Robb &amp; Taylor to take on the region&apos;s most technically demanding infrastructure programmes.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {['B.Eng (Civil)', '15+ Years Experience', 'Wellington Region', 'ConstructSafe Accredited', 'Wellington Water Approved'].map(tag => (
                  <span key={tag} className="text-xs text-[#6a8598] border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 font-medium">{tag}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={sectionRef} className="relative bg-[#040f1e] py-20 lg:py-28 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-4 about-reveal">
              <span className="text-blue-500 text-[11px] font-bold tracking-[0.25em] uppercase">How We Work</span>
            </div>
            <h2 className="about-reveal font-black text-white tracking-[-0.025em] leading-[0.92]"
              style={{ fontSize: 'clamp(2rem, 3.2vw, 3.2rem)' }}>
              Our Approach
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04]">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  className="relative bg-[#040f1e] p-8 group overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.55, delay: i * 0.08 }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, ${value.accent}, transparent)` }}
                  />
                  <div
                    className="w-10 h-10 flex items-center justify-center mb-5"
                    style={{ background: `${value.accent}10`, border: `1px solid ${value.accent}22` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: value.accent }} />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-2">{value.title}</h3>
                  <p className="text-[#5a7a8e] text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Project imagery strip */}
      <section className="relative bg-[#020c18] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
        <div className="grid grid-cols-2 lg:grid-cols-3">
          {[
            { src: '/images/Screenshot_2026-06-18_073355.png',           alt: 'Pipe laying and trenching site works',       label: 'Trenching' },
            { src: '/images/Screenshot_2026-05-26_104638.png',           alt: 'Concrete pipe installation works',           label: 'Pipe Installation' },
            { src: "/images/Screenshot_2026-05-27_091929 copy.png",      alt: 'Indoor piling with excavator',               label: 'Retaining & Piling' },
          ].map((img, i) => (
            <motion.div
              key={img.label}
              className="group"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div style={{ position: 'relative', width: '100%', paddingTop: '66.67%', overflow: 'hidden' }}>
                <img src={img.src} alt={img.alt} className="group-hover:scale-[1.04] transition-transform duration-700" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', filter: 'brightness(0.96) saturate(0.95)' }} />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020c18]/60 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="relative bg-[#040f1e] py-20 lg:py-28 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/12 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-start">

            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.75 }}
            >
              <span className="text-blue-500 text-[11px] font-bold tracking-[0.25em] uppercase block mb-5">Accreditations</span>
              <h2 className="font-black text-white tracking-[-0.025em] leading-[0.92] mb-5"
                style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.8rem)' }}>
                Certified &amp; Compliant
              </h2>
              <p className="text-[#6a8598] text-base leading-relaxed mb-8">
                We maintain all required industry certifications and operate under a formal health &amp; safety management system. Our operators are fully qualified across all civil construction disciplines.
              </p>
              <ul className="flex flex-col gap-3">
                {certifications.map((cert, i) => (
                  <motion.li
                    key={cert}
                    className="flex items-center gap-2.5 text-[#8ba5bc] text-sm"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    {cert}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.75, delay: 0.1 }}
            >
              <span className="text-blue-500 text-[11px] font-bold tracking-[0.25em] uppercase block mb-5">Service Region</span>
              <h2 className="font-black text-white tracking-[-0.025em] leading-[0.92] mb-5"
                style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.8rem)' }}>
                Wellington Region
              </h2>
              <p className="text-[#6a8598] text-base leading-relaxed mb-7">
                Permanently based in Wellington with deep knowledge of the region&apos;s infrastructure networks and strong working relationships with Wellington Water, Wellington City Council, and the wider region.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['Wellington City', 'Lower Hutt', 'Upper Hutt', 'Porirua', 'Kapiti Coast', 'Wairarapa'].map(area => (
                  <span key={area} className="text-sm text-[#7a95ae] border border-white/[0.08] px-3 py-1.5">{area}</span>
                ))}
              </div>
              <div className="border border-white/[0.06] bg-[#06111f] p-6">
                <p className="text-white font-semibold text-sm mb-1">Ready to discuss your project?</p>
                <p className="text-[#5a7a8e] text-sm mb-4 leading-relaxed">Get in touch with Rene directly.</p>
                <div className="flex flex-col gap-2">
                  <a href="tel:+64210274447" className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
                    +64 21 027 4447
                  </a>
                  <a href="mailto:Rene@RobbTaylor.co.nz" className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
                    Rene@RobbTaylor.co.nz
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Plant, People & Proven Delivery */}
      <CapabilitySection />

      {/* CTA */}
      <section className="relative bg-[#020c18] py-20 lg:py-28 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <span className="text-blue-500 text-[11px] font-bold tracking-[0.25em] uppercase block mb-5">Work With Us</span>
            <h2 className="font-black text-white tracking-[-0.025em] leading-[0.92] mb-5"
              style={{ fontSize: 'clamp(2rem, 3.2vw, 3.2rem)' }}>
              Ready to Discuss Your Project?
            </h2>
            <p className="text-[#5a7a8e] text-base mb-10 max-w-lg mx-auto leading-relaxed">
              Get in touch with our team to discuss your civil infrastructure requirements across the Wellington Region.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 text-[11px] tracking-[0.15em] uppercase transition-colors duration-150"
              >
                Request a Quote <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2.5 border border-white/[0.12] hover:border-white/[0.22] text-[#a0b8cc] hover:text-white font-semibold px-8 py-4 text-[11px] tracking-[0.15em] uppercase transition-all duration-150"
              >
                View Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
