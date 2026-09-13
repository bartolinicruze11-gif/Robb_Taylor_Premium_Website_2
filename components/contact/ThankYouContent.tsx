'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CircleCheck as CheckCircle, Phone, Mail, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import RobbTaylorLogo from '@/components/RobbTaylorLogo';

const nextSteps = [
  {
    icon: Clock,
    title: 'We review your request',
    body: 'Our team reviews your project details — usually within a few hours.',
  },
  {
    icon: Phone,
    title: 'We contact you',
    body: 'A team member will reach out by phone or email to discuss your scope and confirm details.',
  },
  {
    icon: CheckCircle,
    title: 'You receive your quote',
    body: 'A detailed, itemised quote is sent to your inbox — no obligation to proceed.',
  },
];

export default function ThankYouContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; alpha: number; size: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        alpha: Math.random() * 0.4 + 0.1,
        size: Math.random() * 2 + 1,
      });
    }

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 129, 245, ${p.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="bg-[#020c18] min-h-screen flex flex-col">

      {/* Background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(34,129,245,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(34,129,245,0.8) 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
      }} />

      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/[0.05] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-24 lg:py-32">

        {/* Logo */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <RobbTaylorLogo className="h-10 w-auto" />
        </motion.div>

        {/* Check icon */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/30 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-blue-500/5 animate-ping rounded-sm" style={{ animationDuration: '2.5s' }} />
            <CheckCircle className="w-9 h-9 text-blue-400" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          className="text-center mb-10 max-w-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1
            className="font-black text-white tracking-[-0.03em] leading-[0.92] mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)', fontFamily: 'var(--font-jakarta), sans-serif' }}
          >
            Quote Request{' '}
            <span style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #2281f5 60%, #1a7de0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Received.
            </span>
          </h1>
          <p className="text-[#7a95ae] text-base lg:text-lg leading-relaxed">
            Thank you for reaching out to Robb &amp; Taylor Contracting. We&apos;ll review your project and get back to you within{' '}
            <span className="text-white font-semibold">1 business day</span> — usually the same morning.
          </p>
        </motion.div>

        {/* Next steps */}
        <motion.div
          className="w-full max-w-2xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          <p className="text-[#3d5668] text-[10px] font-bold uppercase tracking-[0.2em] text-center mb-5">What happens next</p>
          <div className="grid sm:grid-cols-3 gap-px bg-white/[0.04]">
            {nextSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  className="bg-[#040f1e] p-6 relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 bg-blue-500/10 border border-blue-500/25 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <span className="text-[#3d5668] text-[10px] font-bold tracking-[0.15em]">0{i + 1}</span>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1.5 leading-snug">{step.title}</h3>
                  <p className="text-[#4a6478] text-[12px] leading-relaxed">{step.body}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Contact + CTA */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <a
            href="tel:+64210274447"
            className="flex items-center gap-2.5 border border-white/[0.1] bg-[#06111f] hover:border-blue-500/40 hover:bg-blue-500/[0.05] text-white text-sm font-semibold px-5 py-3 transition-all duration-200"
          >
            <Phone className="w-4 h-4 text-blue-400" />
            +64 21 027 4447
          </a>
          <a
            href="mailto:Rene@RobbTaylor.co.nz"
            className="flex items-center gap-2.5 border border-white/[0.1] bg-[#06111f] hover:border-blue-500/40 hover:bg-blue-500/[0.05] text-white text-sm font-semibold px-5 py-3 transition-all duration-200"
          >
            <Mail className="w-4 h-4 text-blue-400" />
            Rene@RobbTaylor.co.nz
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-[#5a7a8e] hover:text-white text-sm font-semibold transition-colors"
          >
            Back to homepage <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>

      {/* Footer line */}
      <div className="relative border-t border-white/[0.05] py-6 text-center">
        <p className="text-[#2a3d4e] text-[11px]">
          Robb &amp; Taylor Contracting Ltd &mdash; Wellington Region Civil Contractors
        </p>
      </div>

    </div>
  );
}
