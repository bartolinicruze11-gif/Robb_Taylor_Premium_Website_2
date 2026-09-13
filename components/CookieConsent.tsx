'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const STORAGE_KEY = 'rt_cookie_consent';

type ConsentState = 'accepted' | 'declined' | null;

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ConsentState;
      if (!stored) {
        // Small delay so it doesn't flash immediately on load
        const t = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const accept = () => {
    try { localStorage.setItem(STORAGE_KEY, 'accepted'); } catch { /* noop */ }
    window.dispatchEvent(new CustomEvent('rt:cookie-consent', { detail: 'accepted' }));
    setConsent('accepted');
    setVisible(false);
  };

  const decline = () => {
    try { localStorage.setItem(STORAGE_KEY, 'declined'); } catch { /* noop */ }
    window.dispatchEvent(new CustomEvent('rt:cookie-consent', { detail: 'declined' }));
    setConsent('declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Cookie consent"
          aria-live="polite"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[200]"
        >
          <div className="bg-[#040f1e] border border-white/[0.09] shadow-2xl p-5 relative">
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500/60 via-blue-400/30 to-transparent" />

            <button
              onClick={decline}
              aria-label="Dismiss cookie notice"
              className="absolute top-3.5 right-3.5 text-[#4a6478] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 mb-4 pr-5">
              <div className="w-7 h-7 flex-shrink-0 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mt-0.5">
                <span className="text-blue-400 text-[11px] font-bold">C</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm mb-1">Cookie Notice</p>
                <p className="text-[#5a7a8e] text-xs leading-relaxed">
                  This site uses cookies and analytics to understand how visitors use our services. Under the New Zealand Privacy Act 2020, we are required to inform you.{' '}
                  <Link href="/privacy#cookies" className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2">
                    Learn more
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={accept}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold uppercase tracking-[0.14em] py-2.5 transition-colors duration-150"
              >
                Accept All
              </button>
              <button
                onClick={decline}
                className="flex-1 border border-white/[0.1] hover:border-white/[0.2] text-[#7a95ae] hover:text-white text-[11px] font-bold uppercase tracking-[0.14em] py-2.5 transition-all duration-150"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
