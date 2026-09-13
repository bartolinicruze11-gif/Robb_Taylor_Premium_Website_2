'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RobbTaylorLogo from './RobbTaylorLogo';

export default function LoadingScreen() {
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
    const hasLoaded = sessionStorage.getItem('rt-loaded');
    if (hasLoaded) { setDone(true); return; }

    const duration = 1200;
    const interval = 16;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const t = step / steps;
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const p = Math.min(eased * 100, 100);
      setProgress(p);
      if (p >= 100) {
        clearInterval(timer);
        setTimeout(() => { sessionStorage.setItem('rt-loaded', '1'); setDone(true); }, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-[#020c18] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Corner accents */}
          <div className="absolute top-8 left-8 w-14 h-14 border-t border-l border-white/[0.07]" />
          <div className="absolute top-8 right-8 w-14 h-14 border-t border-r border-white/[0.07]" />
          <div className="absolute bottom-8 left-8 w-14 h-14 border-b border-l border-white/[0.07]" />
          <div className="absolute bottom-8 right-8 w-14 h-14 border-b border-r border-white/[0.07]" />

          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: `linear-gradient(rgba(34,129,245,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,129,245,1) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }} />

          <div className="relative flex flex-col items-center gap-12">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <RobbTaylorLogo variant="loading" />
            </motion.div>

            {/* Progress number */}
            <motion.div
              className="flex flex-col items-center gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-baseline gap-1">
                <span className="font-black text-white tabular-nums leading-none" style={{ fontSize: '4rem' }}>
                  {Math.round(progress)}
                </span>
                <span className="text-blue-500 font-black text-xl">%</span>
              </div>

              {/* Progress bar */}
              <div className="w-48 h-px bg-white/[0.06] relative overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-[#3d5668] text-[10px] font-semibold tracking-[0.3em] uppercase mt-1">
                Loading
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
