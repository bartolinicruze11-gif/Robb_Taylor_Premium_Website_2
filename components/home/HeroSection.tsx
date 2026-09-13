'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePageVisible } from '@/hooks/use-page-visible';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Phone, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';

type MediaItem =
  | { type: 'video'; src: string }
  | { type: 'image'; src: string; position: string; duration: number };

const heroMedia: MediaItem[] = [
  { type: 'image', src: '/images/Screenshot_2026-05-26_095401.png',             position: 'center 50%', duration: 6000 },
  { type: 'video', src: '/videos/hero-optimized.mp4' },
  { type: 'image', src: '/images/WhatsApp_Image_2026-05-21_at_6.50.00_AM.jpeg', position: 'center 45%', duration: 6000 },
  { type: 'image', src: '/images/Screenshot_2026-05-27_091422.png',             position: 'center 45%', duration: 6000 },
  { type: 'image', src: '/images/Screenshot_2026-05-27_091929.png',             position: 'center 50%', duration: 6000 },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [readyImages, setReadyImages] = useState<number[]>([]);
  const [playBlocked, setPlayBlocked] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(sectionRef);
  const visible = usePageVisible();
  const reducedMotion = useReducedMotion();
  const running = inView && visible && !reducedMotion;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const bgScale   = useTransform(scrollYProgress, [0, 1], [1.0, 1.10]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.45]);
  const contentY  = useTransform(scrollYProgress, [0, 1], [0, 90]);

  useEffect(() => {
    if (!headRef.current || reducedMotion) return;
    const context = gsap.context(() => {
      gsap.fromTo('.hl', { yPercent: 115, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, ease: 'power4.out', stagger: 0.1 });
    }, headRef);
    return () => context.revert();
  }, [reducedMotion]);

  const advance = useCallback(() => {
    setIndex(i => {
      const next = (i + 1) % heroMedia.length;
      return videoFailed && heroMedia[next].type === 'video' ? (next + 1) % heroMedia.length : next;
    });
  }, [videoFailed]);

  const showSlide = useCallback((next: number) => {
    if (next !== displayed) {
      setPrevious(displayed);
      setDisplayed(next);
    }
  }, [displayed]);

  // Keep the previous frame visible until the next photograph has decoded.
  useEffect(() => {
    if (heroMedia[index].type === 'image' && readyImages.includes(index)) showSlide(index);
  }, [index, readyImages, showSlide]);

  useEffect(() => {
    const current = heroMedia[index];
    // Video advances exclusively on ended, so buffering and pauses never cut it short.
    if (!running || displayed !== index || current.type !== 'image' || !readyImages.includes(index)) return;
    const timer = setTimeout(advance, current.duration);
    return () => clearTimeout(timer);
  }, [index, displayed, readyImages, running, advance]);

  // Reset only when selecting the video again, never when returning to the tab.
  useEffect(() => {
    if (heroMedia[index].type === 'video' && videoRef.current) videoRef.current.currentTime = 0;
    setPlayBlocked(false);
  }, [index]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;
    if (running && heroMedia[index].type === 'video') {
      void video.play().catch(() => { if (!cancelled) setPlayBlocked(true); });
    } else video.pause();
    return () => { cancelled = true; };
  }, [index, running]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col overflow-hidden bg-[#020c18]">

      {/* ── Background: unified video + image sequence ── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: reducedMotion ? 1 : bgScale, opacity: reducedMotion ? 1 : bgOpacity }}
      >
        {heroMedia.map((media, mediaIndex) => (
          <div key={media.src} className="absolute inset-0"
            data-hero-media={media.type}
            style={{
              opacity: (reducedMotion ? mediaIndex === 0 : displayed === mediaIndex || previous === mediaIndex) ? 1 : 0,
              zIndex: displayed === mediaIndex ? 2 : previous === mediaIndex ? 1 : 0,
              transition: reducedMotion ? 'none' : 'opacity 1200ms ease-in-out',
            }}>
            {media.type === 'image' ? (
              <Image src={media.src} alt="" fill priority={mediaIndex === 0}
                sizes="100vw" className="object-cover"
                style={{ objectPosition: media.position, filter: 'brightness(0.82) saturate(0.95)' }}
                onLoad={() => setReadyImages(ready => ready.includes(mediaIndex) ? ready : [...ready, mediaIndex])} />
            ) : (
              <video ref={videoRef} src={media.src} muted playsInline preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(0.82) saturate(0.95)' }}
                onPlaying={() => { showSlide(mediaIndex); setPlayBlocked(false); }}
                onEnded={advance}
                onError={() => { setVideoFailed(true); setIndex((mediaIndex + 1) % heroMedia.length); }} />
            )}
          </div>
        ))}
      </motion.div>

      {/* ── Multi-layer cinematic atmosphere ── */}
      {/* Deep left vignette */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(105deg, rgba(2,12,24,0.92) 0%, rgba(2,12,24,0.68) 35%, rgba(2,12,24,0.08) 75%, rgba(2,12,24,0.03) 100%)' }} />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-64 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #020c18 0%, rgba(2,12,24,0.75) 45%, transparent 100%)' }} />
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(2,12,24,0.65), transparent)' }} />
      {/* Blue ambient glow */}
      <div className="absolute bottom-0 left-0 w-[700px] h-[400px] z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 0% 100%, rgba(34,129,245,0.07) 0%, transparent 65%)' }} />
      <div className="absolute top-1/4 right-0 w-[400px] h-[600px] z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 100% 50%, rgba(34,129,245,0.04) 0%, transparent 60%)' }} />

      {/* Decorative vertical rule */}
      <div className="absolute left-6 lg:left-10 top-32 bottom-32 z-20 pointer-events-none hidden lg:block">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-white/[0.07] to-transparent" />
      </div>

      {/* ── Main content ── */}
      <motion.div
        className="relative z-20 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 lg:px-10 pt-36 pb-28 lg:pt-52 lg:pb-36"
        style={{ y: reducedMotion ? 0 : contentY }}
      >
        {/* Kicker */}
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex gap-1 items-center">
            <span className="inline-block w-6 h-px bg-blue-500/70" />
            <span className="inline-block w-2 h-px bg-blue-500/30" />
          </div>
          <span className="text-blue-400 text-[11px] font-bold tracking-[0.3em] uppercase">
            Lower North Island, New Zealand
          </span>
        </motion.div>

        {/* Headline */}
        <div ref={headRef} className="mb-9 max-w-4xl">
          <div className="overflow-hidden mb-1">
            <h1 className="hl block font-black text-white leading-[0.85] tracking-[-0.035em]"
              style={{ fontSize: 'clamp(3.2rem, 6.5vw, 7.2rem)', fontFamily: 'var(--font-jakarta), var(--font-inter), sans-serif' }}>
              Civil
            </h1>
          </div>
          <div className="overflow-hidden mb-1">
            <h1 className="hl block font-black leading-[0.85] tracking-[-0.035em]"
              style={{
                fontSize: 'clamp(3.2rem, 6.5vw, 7.2rem)',
                fontFamily: 'var(--font-jakarta), var(--font-inter), sans-serif',
                background: 'linear-gradient(135deg, #60a5fa 0%, #2281f5 55%, #1a7de0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
              Contractors
            </h1>
          </div>
          <div className="overflow-hidden mt-4">
            <p className="hl block font-semibold text-[#7a95ae] tracking-[0.12em] uppercase"
              style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)', letterSpacing: '0.22em' }}>
              Lower North Island, New Zealand
            </p>
          </div>
        </div>

        {/* Body copy */}
        <motion.p
          className="text-[#6a8598] text-[0.95rem] leading-[1.9] mb-10 max-w-[480px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          Three waters, earthworks & pavements, retaining & piling, and civil construction — delivered on programme and to specification by a team built on precision, reliability, and real-world results.
        </motion.p>

        {/* CTA row */}
        <motion.div
          className="flex flex-wrap items-center gap-3 mb-14"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/contact"
            className="group relative flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-9 py-4 text-[11px] tracking-[0.2em] uppercase transition-all duration-200 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2.5">
              Request a Quote
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </Link>

          <Link
            href="/services"
            className="group flex items-center gap-2 border border-white/[0.14] hover:border-white/[0.28] bg-white/[0.03] hover:bg-white/[0.06] text-[#94b0c8] hover:text-white font-semibold px-9 py-4 text-[11px] tracking-[0.2em] uppercase transition-all duration-200"
          >
            Our Services
          </Link>

          <a
            href="tel:+64210274447"
            className="flex items-center gap-2.5 text-[#56718a] hover:text-[#94b0c8] text-[11px] font-semibold tracking-wider px-4 py-4 transition-colors duration-200"
          >
            <Phone className="w-3.5 h-3.5" />
            +64 21 027 4447
          </a>
        </motion.div>
      </motion.div>

      {playBlocked && heroMedia[index].type === 'video' && (
        <button type="button" className="absolute right-6 bottom-8 z-30 border border-white/30 bg-black/40 px-5 py-3 text-sm text-white"
          onClick={() => { void videoRef.current?.play().catch(() => setPlayBlocked(true)); }}>
          Play video
        </button>
      )}

      {/* Scroll indicator */}
      <motion.div
        className="absolute right-8 bottom-24 z-30 hidden lg:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.6 }}
      >
        <span className="text-[#2a3d4e] text-[9px] font-bold tracking-[0.3em] uppercase rotate-90 origin-center mb-3">Scroll</span>
        <motion.div
          animate={{ y: running ? [0, 7, 0] : 0 }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-[#2a3d4e]" />
        </motion.div>
      </motion.div>

    </section>
  );
}
