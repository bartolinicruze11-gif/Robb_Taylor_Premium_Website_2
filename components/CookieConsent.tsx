 'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { readCookiePreferences, saveCookiePreferences } from '@/lib/consent';
export default function CookieConsent() {
 const [visible,setVisible]=useState(false);
 const [analytics,setAnalytics]=useState(false);
 const [advertising,setAdvertising]=useState(false);
 useEffect(()=>{const p=readCookiePreferences();setAnalytics(p?.analytics??false);setAdvertising(p?.advertising??false);setVisible(!p);},[]);
 function open(){const p=readCookiePreferences();setAnalytics(p?.analytics??false);setAdvertising(p?.advertising??false);setVisible(true);}
 function save(a:boolean,d:boolean){saveCookiePreferences(a,d);setVisible(false);}
 return <>
  {!visible && <button type="button" onClick={open} className="fixed bottom-3 left-3 z-[190] rounded-lg border border-white/25 bg-[#07111c] px-3 py-2 text-xs text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">Cookie settings</button>}
  {visible && <div role="dialog" aria-label="Cookie settings" aria-describedby="cookie-description" className="fixed bottom-4 left-4 right-4 z-[200] max-h-[85vh] overflow-y-auto rounded-xl border border-white/20 bg-[#07111c] p-5 text-white shadow-2xl sm:left-auto sm:right-5 sm:w-[420px]">
   <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-base font-bold">Your cookie choices</h2><button type="button" onClick={()=>save(false,false)} className="rounded px-3 py-2 text-sm text-white/80 underline" aria-label="Close and use essential only">Close</button></div>
   <p id="cookie-description" className="text-sm leading-relaxed text-white/80">Essential services keep the site and enquiry forms working. Optional measurement stays off until you choose it. You can change your choice at any time.</p>
   <Link href="/cookies" className="mt-3 inline-block text-sm text-white underline underline-offset-4">Read the Cookie Policy</Link>
   <div className="my-4 space-y-3 text-sm">
    <p className="text-white/70">Essential services: always on</p>
    <label className="flex cursor-pointer items-start gap-3"><input type="checkbox" checked={analytics} onChange={e=>setAnalytics(e.target.checked)} className="mt-1 h-4 w-4 shrink-0" /><span>Analytics <span className="block text-xs leading-relaxed text-white/65">Understand visits and enquiry interactions.</span></span></label>

   </div>
   <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
    <button type="button" onClick={()=>save(false,false)} className="min-h-[44px] rounded border border-white/30 px-3 py-2 hover:bg-white/10">Essential only</button>
    <button type="button" onClick={()=>save(true,false)} className="min-h-[44px] rounded border border-white/30 px-3 py-2 hover:bg-white/10">Allow all optional</button>
    <button type="button" onClick={()=>save(analytics,advertising)} className="col-span-2 min-h-[44px] rounded bg-white px-3 py-2 text-[#07111c] hover:bg-white/90">Save choices</button>
   </div>
  </div>}
 </>;
}
