'use client';

import Image from 'next/image';

interface Props {
  className?: string;
  variant?: 'nav' | 'footer' | 'loading';
}

export default function RobbTaylorLogo({ className = '', variant = 'nav' }: Props) {
  if (variant === 'nav') {
    return (
      <Image
        width={1521}
        height={1032}
        sizes="384px"
        priority
        src="/images/Screenshot_2026-05-07_152715.png"
        alt="Robb & Taylor Contracting"
        className={className}
        style={{
          display: 'block',
          height: '100%',
          width: 'auto',
          maxHeight: '192px',
          mixBlendMode: 'screen',
          objectFit: 'contain',
          objectPosition: 'left center',
        }}
      />
    );
  }

  const heights: Record<string, number> = { footer: 90, loading: 110 };
  const h = heights[variant] ?? 90;

  return (
    <Image
      src="/images/Screenshot_2026-05-07_152715.png"
      alt="Robb & Taylor Contracting"
      sizes="192px"
      width={Math.round(h * (1521 / 1032))}
      height={h}
      className={className}
      style={{
        display: 'block',
        height: h,
        width: 'auto',
        mixBlendMode: 'screen',
      }}
    />
  );
}
