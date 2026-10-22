import { createClient } from "npm:@supabase/supabase-js@2.105.3";
import { retryDecision } from "../_shared/retry-policy.ts";

const json = (data: unknown, status=200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
const escape = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
Deno.serve(async (req: Request) => {
 if (req.method !== 'POST') return json({ error: 'Method not allowed' },405);
 const secret = Deno.env.get('CRON_SECRET');
 if (!secret || req.headers.get('x-cron-secret') !== secret) return json({ error: 'Unauthorized' },401);
 const db = createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
 const { data: jobs, error } = await db.rpc('claim_quote_notifications',{batch_size:20});
 if (error) return json({error:'Unable to claim queue'},500);
 let sent=0, failed=0;
 let outcomeError = false;
 await Promise.all((jobs ?? []).map(async (job: any) => {
  let status: number | null = null;
  let providerId: string | null = null;
  let ok=false;
  try {
   if (job.kind === 'automation') {
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/email-engine`, {
     method:'POST', signal:AbortSignal.timeout(15000), headers:{'Content-Type':'application/json',Authorization:`Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,'x-cron-secret':secret},
     body:JSON.stringify({action:'trigger',lead_id:job.quote_id})
    });
    status=response.status; ok=response.ok;
   } else {
    let message=job.message;
    if (!message) {
     const p=job.payload;
     const from=Deno.env.get('NOTIFICATION_FROM');
     const reply=Deno.env.get('NOTIFICATION_REPLY_TO');
     const internal=(Deno.env.get('NOTIFICATION_TO') ?? '').split(',').map(v=>v.trim()).filter(Boolean);
     const to=job.kind==='internal' ? internal : [p.email];
     if (!from || !reply || !to.length || to.some((v:string)=>!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))) throw new Error('notification_configuration');
     const text=job.kind==='internal'
      ? `New Robb & Taylor enquiry\n\nName: ${p.name}\nEmail: ${p.email || 'Not provided — phone callback'}\nPhone: ${p.phone || 'Not provided'}\nService: ${p.service || ''}\nLocation: ${p.location || ''}\n\n${p.project_details || p.message || ''}\n\nEnquiry reference: ${job.quote_id}`
      : `Hi ${p.name},\n\nThank you for contacting Robb & Taylor. Your enquiry has been received and our team will be in touch.\n\nEnquiry reference: ${job.quote_id}`;
     message={from,to,reply_to:job.kind==='internal' ? (p.email || reply) : reply,subject:job.kind==='internal' ? 'New enquiry — Robb & Taylor' : 'Enquiry received — Robb & Taylor',text,html:`<div style="font-family:Arial,sans-serif;max-width:640px;line-height:1.6"><p>${escape(text).replace(/\n/g,'<br>')}</p></div>`};
     // Snapshot exact parameters before first send: retries must use the same provider idempotency key and body.
     const {data: saved,error:saveError}=await db.from('notification_outbox').update({message}).eq('id',job.id).eq('lease_token',job.lease_token).select('id').maybeSingle();
     if(saveError || !saved) throw new Error('snapshot_failed');
    }
    const apiKey=Deno.env.get('RESEND_API_KEY');
    if(!apiKey) throw new Error('notification_configuration');
    const response=await fetch('https://api.resend.com/emails',{method:'POST',signal:AbortSignal.timeout(15000),headers:{'Content-Type':'application/json',Authorization:`Bearer ${apiKey}`,'Idempotency-Key':job.idempotency_key},body:JSON.stringify(message)});
    status=response.status;ok=response.ok;
    if(ok){const data=await response.json();providerId=data.id;}
   }
  } catch { /* No contact details or provider credentials in error logs. */ }
  const decision=retryDecision(status,job.attempt_count);
  const now=new Date().toISOString();
  const update=ok ? {status:'sent',sent_at:now,provider_message_id:providerId,failure_class:null,lease_until:null,lease_token:null}
   : {status:decision.retry?'pending':'dead',next_retry_at:new Date(Date.now()+decision.delayMs).toISOString(),dead_lettered_at:decision.retry?null:now,failure_class:decision.failureClass,lease_until:null,lease_token:null};
  const { error: updateError }=await db.from('notification_outbox').update(update).eq('id',job.id).eq('lease_token',job.lease_token);
  if(updateError) outcomeError = true;
  if(ok) sent++; else failed++;
 }));
 if (outcomeError) return json({error:'Unable to record delivery outcome'},500);
 return json({processed:jobs?.length??0,sent,failed});
});
