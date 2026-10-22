export type CookiePreferences = { version: 2; analytics: boolean; advertising: boolean; savedAt: number };
export const CONSENT_KEY = 'rt_cookie_preferences_v2';
export const CONSENT_EVENT = 'rt:cookie-preferences';
export function readCookiePreferences(): CookiePreferences | null {
 try {
  const p: unknown = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
  if (!p || typeof p !== 'object') return null;
  const v = p as CookiePreferences;
  if (v.version !== 2 || typeof v.analytics !== 'boolean' || typeof v.advertising !== 'boolean' || typeof v.savedAt !== 'number' || !Number.isFinite(v.savedAt) || v.savedAt > Date.now() || Date.now()-v.savedAt > 180*86400000) return null;
  return v;
 } catch { return null; }
}
export function clearMeasurementCookies(analytics: boolean, advertising: boolean) {
 const domains = window.location.hostname.split('.');
 for (const raw of document.cookie.split(';')) {
  const name = raw.trim().split('=')[0];
  if (!(analytics && /^(_ga|_gid|_gat)/.test(name)) && !(advertising && /^(_gcl_|_gac_)/.test(name))) continue;
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
  for (let i=0;i<domains.length-1;i++) document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domains.slice(i).join('.')}; SameSite=Lax`;
 }
}
export function saveCookiePreferences(analytics: boolean, advertising: boolean) {
 const previous = readCookiePreferences();
 const preferences: CookiePreferences = {version:2,analytics,advertising,savedAt:Date.now()};
 try { localStorage.setItem(CONSENT_KEY,JSON.stringify(preferences)); } catch { /* The choice still applies to this page. */ }
 clearMeasurementCookies(!analytics,!advertising);
 window.dispatchEvent(new CustomEvent(CONSENT_EVENT,{detail:preferences}));
 if ((previous?.analytics && !analytics) || (previous?.advertising && !advertising)) window.location.reload();
}
