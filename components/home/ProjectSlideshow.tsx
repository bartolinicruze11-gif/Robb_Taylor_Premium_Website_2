'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { usePageVisible } from '@/hooks/use-page-visible';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn, Pause, Play } from 'lucide-react';
import { allProjectPhotos } from '@/lib/project-images';

export interface SlideshowPhoto {
  src: string;
  caption: string;
  category: string;
  type?: 'image' | 'video';
}

interface Props {
  photos?: SlideshowPhoto[];
  autoplayMs?: number;
  heading?: string;
  subheading?: string;
  kicker?: string;
  compact?: boolean;
}

const AUTOPLAY_MS = 4000;

const accentColors: Record<string, string> = {
  'Civil Construction':    '#2281f5',
  'Trenching':             '#c43820',
  'Water Infrastructure':  '#1a9fd4',
  'Drainage':              '#1ab8c8',
  'Earthworks':            '#e8882a',
  'Pipe Installation':     '#1ab8c8',
  'Site Preparation':      '#e8882a',
  'Retaining & Piling':    '#c87820',
};

export default function ProjectSlideshow({
  photos = allProjectPhotos,
  autoplayMs = AUTOPLAY_MS,
  heading,
  subheading,
  kicker = 'Site Gallery',
  compact = false,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);
  const pageVisible = usePageVisible();
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef  = useRef<HTMLVideoElement | null>(null);
  const total = photos.length;

  const current = photos[active] ?? photos[0];
  const running = inView && pageVisible && !paused && !lightbox && !reducedMotion && total > 1;
  const isVideo = current?.type === 'video';
  const accent = accentColors[current?.category] ?? '#2281f5';

  const go = useCallback((next: number, dir: number) => {
    setDirection(dir);
    if (total) setActive((next + total) % total);
  }, [total]);

  const prev = useCallback(() => go(active - 1, -1), [active, go]);
  const next = useCallback(() => go(active + 1, 1), [active, go]);

  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node && inView && pageVisible && !paused && !lightbox && !reducedMotion) {
      void node.play().catch(() => {});
    }
  }, [inView, pageVisible, paused, lightbox, reducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && (!inView || !pageVisible || paused || lightbox || reducedMotion)) video.pause();
  }, [inView, pageVisible, paused, lightbox, reducedMotion]);

  useEffect(() => { setActive(0); }, [photos]);

  // Auto-advance images only; video slides stay until manually navigated
  useEffect(() => {
    if (!running || isVideo) return;
    timerRef.current = setTimeout(() => go(active + 1, 1), autoplayMs);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, running, autoplayMs, go, isVideo]);

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 30 }),
    center: { opacity: 1, x: 0 },
    exit:  (d: number) => ({ opacity: 0, x: d * -30 }),
  };

  const transitionDuration = Math.min(autoplayMs * 0.22, 480) / 1000;

  if (!current) return null;

  return (
    <section ref={sectionRef} className="bg-[#020c18]">
      <div className="section-line" />

      <div className={`max-w-7xl mx-auto px-6 lg:px-10 ${compact ? 'py-14 lg:py-20' : 'py-20 lg:py-28'}`}>

        {(heading !== undefined || !compact) && (
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <div>
              <span className="text-blue-500 text-[11px] font-bold tracking-[0.25em] uppercase block mb-4">
                {kicker}
              </span>
              <h2
                className="font-black text-white tracking-[-0.03em] leading-[0.88]"
                style={{ fontSize: 'clamp(1.8rem, 3.2vw, 3.2rem)', fontFamily: 'var(--font-jakarta), sans-serif' }}
              >
                {heading ?? (
                  <>
                    Work on the<br />
                    <span style={{
                      background: 'linear-gradient(135deg, #60a5fa 0%, #2281f5 60%, #1a7de0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      Ground.
                    </span>
                  </>
                )}
              </h2>
            </div>
            {subheading && (
              <p className="text-[#5a7a8e] text-base leading-relaxed max-w-sm">{subheading}</p>
            )}
            {!subheading && !compact && (
              <p className="text-[#5a7a8e] text-base leading-relaxed max-w-sm">
                Real photography from our active project sites — civil construction, drainage, foundation works and more across New Zealand.
              </p>
            )}
          </div>
        )}

        {/* Main slideshow */}
        <div className="w-full bg-[#040f1e] border border-white/[0.06]">
          <div
            className="relative w-full overflow-hidden"
            style={{ minHeight: compact ? '320px' : '400px' }}
          >
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={active}
                className="relative w-full"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: transitionDuration, ease: [0.22, 1, 0.36, 1] }}
              >
                {isVideo ? (
                  <video
                    ref={setVideoRef}
                    src={current.src}
                    poster="/images/Screenshot_2026-05-26_095401.png"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="block w-full h-auto"
                    style={{ maxHeight: compact ? '55vh' : '70vh', objectFit: 'contain', filter: 'brightness(0.88) saturate(0.92) contrast(1.04)' }}
                    onError={() => go(active + 1, 1)}
                  />
                ) : (
                  <Image width={1600} height={1000} sizes="(max-width: 768px) 100vw, 1200px"
                    src={current.src}
                    alt={current.caption}
                    className="block w-full h-auto"
                    style={{ maxHeight: compact ? '55vh' : '70vh', objectFit: 'contain', filter: 'brightness(0.88) saturate(0.92) contrast(1.04)' }}
                    loading="lazy"
                    onError={() => setPaused(true)}
                  />
                )}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(2,12,24,0.65) 0%, rgba(2,12,24,0.12) 35%, rgba(2,12,24,0.0) 60%)' }} />
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to right, rgba(2,12,24,0.28) 0%, transparent 45%)' }} />

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10 z-10 pointer-events-none">
                  <span
                    className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1.5 block"
                    style={{ color: accent }}
                  >
                    {current.category}
                  </span>
                  <h3 className={`text-white font-black tracking-tight leading-tight ${compact ? 'text-base lg:text-xl' : 'text-xl lg:text-3xl'}`}>
                    {current.caption}
                  </h3>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Zoom */}
            <button
              onClick={() => setLightbox(true)}
              className="absolute top-4 right-4 z-20 w-9 h-9 bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
              aria-label="View full size"
            >
              <ZoomIn className="w-3.5 h-3.5 text-white/70" />
            </button>

            {/* Progress bar — animates for images; static for video slides */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.05] z-20">
              {running && !isVideo && (
                <motion.div
                  key={`bar-${active}`}
                  className="h-full"
                  style={{ background: accent, transformOrigin: 'left' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: autoplayMs / 1000, ease: 'linear' }}
                />
              )}
              {isVideo && <div className="h-full w-full" style={{ background: `${accent}50` }} />}
            </div>

            {/* Nav arrows */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Thumbnails + controls */}
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={() => setPaused(p => !p)}
            className="flex-shrink-0 w-8 h-8 border border-white/[0.08] flex items-center justify-center hover:border-white/20 transition-colors"
            aria-label={paused ? 'Play' : 'Pause'}
          >
            {paused
              ? <Play className="w-3 h-3 text-[#7a95ae]" />
              : <Pause className="w-3 h-3 text-[#7a95ae]" />
            }
          </button>

          <div className="flex gap-1.5 overflow-x-auto flex-1 scrollbar-hide pb-0.5">
            {photos.map((photo, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                className={`flex-shrink-0 relative overflow-hidden transition-all duration-200 ${
                  i === active ? 'ring-2 ring-blue-500 opacity-100' : 'opacity-35 hover:opacity-65'
                }`}
                style={{ width: 60, height: 40 }}
                aria-label={photo.caption}
              >
                {photo.type === 'video' ? (
                  <>
                    <video
                      src={photo.src}
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                      style={{ filter: 'brightness(0.82) saturate(0.88)' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-3 h-3 text-white/80" />
                    </div>
                  </>
                ) : (
                  <Image width={60} height={40} sizes="60px"
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    style={{ filter: 'brightness(0.82) saturate(0.88)' }}
                  />
                )}
              </button>
            ))}
          </div>

          <span className="flex-shrink-0 text-[#2e4458] text-[11px] font-mono tracking-wider">
            {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="section-line" />

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[200] bg-black/97 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <motion.div
              className="relative max-w-6xl w-full"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
            >
              {isVideo ? (
                <video
                  src={current.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="w-full h-auto max-h-[85vh] object-contain"
                />
              ) : (
                <Image width={1600} height={1000} sizes="90vw"
                  src={current.src}
                  alt={current.caption}
                  className="w-full h-auto max-h-[85vh] object-contain"
                  style={{ filter: 'brightness(0.95) saturate(0.95)' }}
                />
              )}
              <div className="mt-3 flex items-center gap-3">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: accent }}>
                  {current.category}
                </span>
                <span className="text-white/20 text-xs">—</span>
                <span className="text-[#7a95ae] text-sm">{current.caption}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
