 'use client';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CONSENT_EVENT, clearMeasurementCookies, readCookiePreferences, type CookiePreferences } from '@/lib/consent';
const GA = 'G-RHLENS2SJT';
const ADS = '';
const GTM = 'GTM-N577RRB3';
type Tags = { dataLayer?: unknown[]; gtag?: (...args: unknown[])=>void; [key:string]:unknown };
export default function ConsentTracking() {
 const path=usePathname();
 const [choice,setChoice]=useState<CookiePreferences|null>(null);
 useEffect(()=>{
  const update=(p:CookiePreferences|null)=>{setChoice(p);const w=window as unknown as Tags;
   w[`ga-disable-${GA}`]=!p?.analytics;
   w.dataLayer=w.dataLayer||[];
   // The wrapper never queues enquiry events before consent, or while in admin.
   w.gtag=function(...args:unknown[]){
    if(args[0]==='event'){
     if(window.location.pathname.startsWith('/admin')) return;
     const details=args[2] as {send_to?:string}|undefined;
     if(String(details?.send_to??'').startsWith('AW-') ? !p?.advertising : !p?.analytics) return;
    }
    w.dataLayer?.push(arguments);
   };
   w.gtag('js',new Date());
   w.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
   w.gtag('consent','update',{analytics_storage:p?.analytics?'granted':'denied',ad_storage:p?.advertising?'granted':'denied',ad_user_data:p?.advertising?'granted':'denied',ad_personalization:'denied'});
   if(!p?.analytics||!p?.advertising) clearMeasurementCookies(!p?.analytics,!p?.advertising);
  };
  const read=()=>update(readCookiePreferences());
  const onChoice=(e:Event)=>update((e as CustomEvent<CookiePreferences>).detail);
  read();window.addEventListener(CONSENT_EVENT,onChoice);window.addEventListener('storage',read);
  return()=>{window.removeEventListener(CONSENT_EVENT,onChoice);window.removeEventListener('storage',read);};
 },[]);
 useEffect(()=>{
  const w=window as unknown as Tags;
  if(path.startsWith('/admin')) {
   w[`ga-disable-${GA}`]=true;
   w.gtag?.('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
   return;
  }
  w[`ga-disable-${GA}`]=!choice?.analytics;
  const location=window.location.origin+path;
  if(choice?.analytics) w.gtag?.('config',GA,{page_location:location,page_path:path,page_referrer:document.referrer.split('?')[0],allow_google_signals:false,allow_ad_personalization_signals:false});
  if(ADS&&choice?.advertising) w.gtag?.('config',ADS,{page_location:location,allow_ad_personalization_signals:false});
 },[choice,path]);
 const analytics=!!choice?.analytics&&!path.startsWith('/admin');
 const advertising=!!ADS&&!!choice?.advertising&&!path.startsWith('/admin');
 const loadGtm=analytics&&(!ADS||advertising);
 return <>
  {(analytics||advertising)&&<Script id="consented-google-runtime" src={`https://www.googletagmanager.com/gtag/js?id=${analytics?GA:ADS}`} strategy="afterInteractive" />}
  {loadGtm&&<Script id="consented-gtm" strategy="afterInteractive" dangerouslySetInnerHTML={{__html:`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}} />}
  {analytics&&<Analytics beforeSend={event=>({...event,url:event.url.split('?')[0].split('#')[0]})} />}
 </>;
}
