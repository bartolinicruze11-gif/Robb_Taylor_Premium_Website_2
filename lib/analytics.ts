export const GA_MEASUREMENT_ID = 'G-LNRQ7T148Z';

export type TrackedEvent = 'generate_lead' | 'phone_click' | 'email_click' | 'partner_click';
type EventDetails = { form_id?: 'homepage_quote' | 'contact_quote'; partner_name?: 'EMT Demolition' };

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
      ...(details.partner_name ? { partner_name: details.partner_name } : {}),
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
  try {
    const url = new URL(href);
    if (url.protocol === 'https:' && ['emtdemolition.co.nz', 'www.emtdemolition.co.nz'].includes(url.hostname)) return 'partner_click';
  } catch { /* Internal links do not need custom click events. */ }
  return null;
}
