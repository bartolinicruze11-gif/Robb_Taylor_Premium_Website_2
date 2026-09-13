'use client';

import { useEffect } from 'react';
import { trackEvent, trackedLinkEvent } from '@/lib/analytics';

export default function ConversionTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a[href]');
      if (!link) return;
      const name = trackedLinkEvent(link.getAttribute('href') || '');
      if (name) trackEvent(name, name === 'partner_click' ? { partner_name: 'EMT Demolition' } : {});
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  return null;
}
