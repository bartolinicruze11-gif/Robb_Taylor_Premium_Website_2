'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const MEASUREMENT_ID = 'G-LNRQ7T148Z';

export default function GoogleAnalytics() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const update = (choice: string | null) => {
      const enabled = choice === 'accepted';
      // Stop collection if consent changes after the scripts have loaded.
      (window as unknown as Record<string, unknown>)[`ga-disable-${MEASUREMENT_ID}`] = !enabled;
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
    <>
      <Script id="google-analytics-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${MEASUREMENT_ID}');
      `}</Script>
      <Script id="google-analytics" strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`} />
    </>
  );
}
