import { createClient } from '@supabase/supabase-js';
export const DEFAULT_ALERT_RECIPIENT = 'bartolinicruze11@gmail.com';
const EMAIL = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/;
export type Enquiry = { id: string; name: string; email: string; phone: string; company: string; service: string; location: string; budget: string; timeline: string; message: string };
export function notificationConfiguration() {
 const recipients = (process.env.ADMIN_NOTIFICATION_TO || DEFAULT_ALERT_RECIPIENT).split(',').map(v=>v.trim()).filter(Boolean);
 const from = process.env.ADMIN_NOTIFICATION_FROM || '';
 return { recipients, from, ready: !!process.env.RESEND_API_KEY && !!from && recipients.length>0 && recipients.every(v=>EMAIL.test(v)) };
}
export async function sendAdminAlert(quote: Enquiry, test = false) {
 const config = notificationConfiguration();
 if (!config.ready) return {sent:false,reason:'not_configured' as const};
 const text = test
  ? 'This is a test of Robb & Taylor admin email alerts. New website enquiries will send an alert to this inbox. No customer record has been created.'
  : `New website enquiry\n\nName: ${quote.name}\nCompany: ${quote.company || 'Not supplied'}\nEmail: ${quote.email}\nPhone: ${quote.phone || 'Not supplied'}\nService: ${quote.service}\nLocation: ${quote.location}\nBudget: ${quote.budget || 'Not supplied'}\nTimeline: ${quote.timeline || 'Not supplied'}\n\n${quote.message}\n\nReference: ${quote.id}\nReview: https://www.robbtaylor.co.nz/admin`;
 // A stable key prevents duplicate provider sends when an administrator retries a saved record.
 const idempotencyKey = `rt-${test?'test':'enquiry'}-${quote.id}`;
 try {
  const response = await fetch('https://api.resend.com/emails',{method:'POST',signal:AbortSignal.timeout(12000),headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':idempotencyKey},body:JSON.stringify({from:config.from,to:config.recipients,reply_to:'rene@robbtaylor.co.nz',subject:test?'Test alert — Robb & Taylor':'New website enquiry — Robb & Taylor',text})});
  if (!response.ok) return {sent:false,reason:'provider_error' as const};
  const data=await response.json();
  if(typeof data.id!=='string') return {sent:false,reason:'provider_error' as const};
  return {sent:true,providerId:data.id};
 } catch { return {sent:false,reason:'provider_unavailable' as const}; }
}
export async function verifyExistingAdmin(password: unknown) {
 if(typeof password!=='string'||!password||password.length>500) return false;
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key) return false;
 try {
  const response=await fetch(`${url}/functions/v1/admin-quotes`,{method:'POST',signal:AbortSignal.timeout(10000),headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({action:'list',password}),cache:'no-store'});
  if(!response.ok) return false;
  const data=await response.json();return !data.error&&Array.isArray(data.data);
 } catch {return false;}
}
export function enquiryDatabase(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key) return null;
 return createClient(url,key,{auth:{persistSession:false}});
}
