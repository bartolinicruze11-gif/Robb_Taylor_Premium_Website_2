'use client';
import {useCallback,useEffect,useState} from 'react';
export default function EmailAlerts({password}:{password:string}){
 const [status,setStatus]=useState<{ready:boolean;recipients:string[]}|null>(null),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 const load=useCallback(async()=>{try{const r=await fetch('/api/admin/email-alerts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'status',password}),cache:'no-store'});if(r.ok)setStatus(await r.json());else setMessage('Unable to check email alerts.');}catch{setMessage('Unable to check email alerts.');}},[password]);
 useEffect(()=>{void load();},[load]);
 async function test(){if(busy)return;setBusy(true);setMessage('');try{const r=await fetch('/api/admin/email-alerts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'test',password})});const result=await r.json();setMessage(r.ok?result.message:result.error);}catch{setMessage('Test unavailable. Please try again.');}finally{setBusy(false);}}
 return <section aria-label="Admin email alerts" className="mb-6 rounded-xl border border-sky-400/20 bg-sky-400/[0.04] p-5">
  <h2 className="font-bold text-white">Email alerts</h2><p className="mt-2 text-sm text-sky-100/75">{status?status.ready?'New website enquiries send an automatic alert.':'Alerts are not active yet. The website administrator needs to connect the email provider.':'Checking alert setup…'}</p>
  {status&&<p className="mt-2 break-all text-sm text-sky-200">To: {status.recipients.join(', ')}</p>}
  <button type="button" disabled={!status?.ready||busy} onClick={test} className="mt-4 rounded-lg border border-sky-400/30 px-4 py-2 text-sm text-white disabled:opacity-40">{busy?'Sending…':'Send test email'}</button>
  <p role="status" className="mt-3 text-sm text-sky-100/80">{message}</p>
 </section>;
}
