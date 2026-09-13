'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

import { GA_MEASUREMENT_ID as MEASUREMENT_ID } from '@/lib/analytics';

export default function GoogleAnalytics() {
  const [accepted, setAccepted] = useState(false);
  const acceptedRef = useRef(false);
  const configuredRef = useRef(false);

  useEffect(() => {
    const update = (choice: string | null) => {
      const enabled = choice === 'accepted';
      acceptedRef.current = enabled;
      // Stop collection if consent changes after the scripts have loaded.
      (window as unknown as Record<string, unknown>)[`ga-disable-${MEASUREMENT_ID}`] = !enabled;
      const tags = window as unknown as { gtag?: (...args: unknown[]) => void };
      tags.gtag?.('consent', 'update', {
        analytics_storage: enabled ? 'granted' : 'denied',
        ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
      });
      setAccepted(enabled);
    };
    const read = () => {
      try { update(localStorage.getItem('rt_cookie_consent')); }
      catch { update(null); }
    };
    const onChoice = (event: Event) => update((event as CustomEvent<string>).detail);
    read();
    window.addEventListener('rt:cookie-consent', onChoice);
    window.addEventListener('storage', read);
    return () => {
      window.removeEventListener('rt:cookie-consent', onChoice);
      window.removeEventListener('storage', read);
    };
  }, []);

  if (!accepted) return null;

  return (
    <Script id="google-analytics" strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
      onReady={() => {
        if (!acceptedRef.current || configuredRef.current) return;
        configuredRef.current = true;
        const tags = window as unknown as { gtag?: (...args: unknown[]) => void };
        // Register the Analytics runtime before configuration, so GTM does not
        // load a second copy while processing the shared dataLayer queue.
        tags.gtag?.('js', new Date());
        tags.gtag?.('config', MEASUREMENT_ID);
      }} />
  );
}
