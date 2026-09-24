export const GA_MEASUREMENT_ID = 'G-RHLENS2SJT';

export type TrackedEvent = 'generate_lead' | 'phone_click' | 'email_click';
type EventDetails = { form_id?: 'homepage_quote' | 'contact_quote' };

export function trackEvent(name: TrackedEvent, details: EventDetails = {}) {
  if (typeof window === 'undefined' || window.location.pathname.startsWith('/admin')) return;
  try {
    if (localStorage.getItem('rt_cookie_consent') !== 'accepted') return;
    const tags = window as unknown as { gtag?: (...args: unknown[]) => void };
    // Only fixed event labels are sent. Never include enquiry fields or link queries.
    tags.gtag?.('event', name, {
      send_to: GA_MEASUREMENT_ID,
      page_path: window.location.pathname,
      ...(details.form_id ? { form_id: details.form_id } : {}),
    });
  } catch {
    // Analytics must never interrupt a submission or navigation.
  }
}

export function trackedLinkEvent(href: string): TrackedEvent | null {
  if (href.toLowerCase().startsWith('tel:')) {
    return href.slice(4).replace(/[^\d+]/g, '') === '+64210274447' ? 'phone_click' : null;
  }
  if (href.toLowerCase().startsWith('mailto:')) {
    return href.slice(7).split('?')[0].toLowerCase() === 'rene@robbtaylor.co.nz' ? 'email_click' : null;
  }
  return null;
}
