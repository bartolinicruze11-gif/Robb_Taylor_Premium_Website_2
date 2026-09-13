'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const springX = useSpring(rawX, { stiffness: 500, damping: 40, mass: 0.3 });
  const springY = useSpring(rawY, { stiffness: 500, damping: 40, mass: 0.3 });

  const trailX = useSpring(rawX, { stiffness: 120, damping: 20, mass: 0.6 });
  const trailY = useSpring(rawY, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (isTouchDevice) return;

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const onHoverIn = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.matches('a, button, [role="button"], input, select, textarea, label') ||
        target.closest('a, button, [role="button"]')
      ) {
        setHovering(true);
      }
    };

    const onHoverOut = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.matches('a, button, [role="button"], input, select, textarea, label') ||
        target.closest('a, button, [role="button"]')
      ) {
        setHovering(false);
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onHoverIn);
    document.addEventListener('mouseout', onHoverOut);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onHoverIn);
      document.removeEventListener('mouseout', onHoverOut);
    };
  }, [rawX, rawY, visible]);

  return (
    <>
      {/* Dot — instant */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.6 : hovering ? 2.5 : 1,
        }}
        transition={{ opacity: { duration: 0.15 }, scale: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
      >
        <div
          className="w-2 h-2 bg-white rounded-full"
        />
      </motion.div>

      {/* Ring — lagged */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.7 : hovering ? 2.2 : 1,
        }}
        transition={{ opacity: { duration: 0.2 }, scale: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
      >
        <div
          className="w-8 h-8 rounded-full border border-blue-400/60"
          style={{ boxShadow: '0 0 12px rgba(34,129,245,0.3)' }}
        />
      </motion.div>
    </>
  );
}
