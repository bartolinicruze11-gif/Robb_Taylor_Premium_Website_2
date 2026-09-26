import { serviceClient } from '@/lib/admin-server';

const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, character =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character);

export async function dispatchQuoteNotifications() {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.ROBB_NOTIFICATION_TO;
  const sender = process.env.ROBB_NOTIFICATION_FROM;
  if (!apiKey || !recipient || !sender) throw new Error('Email delivery is not configured');
  const db = serviceClient();
  const { data: work, error: claimError } = await db.rpc('claim_robb_quote_notifications', { batch_size: 10 });
  if (claimError) throw new Error('Notification queue unavailable');
  let sent = 0;
  let failed = 0;
  for (const item of work ?? []) {
    const { data: quote } = await db.from('quotes').select('id,name,company,email,phone,service,location,message,created_at').eq('id', item.quote_id).maybeSingle();
    if (!quote) {
      await db.from('quote_notification_outbox').update({ status: 'dead', last_error: 'Source enquiry unavailable', locked_until: null }).eq('id', item.id);
      failed++;
      continue;
    }
    const name = String(quote.name).slice(0, 160);
    const service = String(quote.service).replace(/[\r\n]+/g, ' ').slice(0, 160);
    const subject = `New Robb & Taylor enquiry: ${service}`;
    const lines = [
      `A new enquiry was submitted on ${new Date(quote.created_at).toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' })}.`,
      `Name: ${name}`, `Company: ${quote.company || '—'}`,
      `Email: ${quote.email}`, `Phone: ${quote.phone || '—'}`,
      `Service: ${service}`, `Location: ${quote.location || '—'}`,
      `Project brief: ${String(quote.message || '—').slice(0, 2000)}`,
      'Review the enquiry in the Robb & Taylor admin workspace.',
    ];
    const html = `<div style="font:15px/1.6 system-ui;color:#132235;max-width:600px;margin:auto"><div style="background:#0a2035;padding:22px;color:white;border-radius:12px 12px 0 0"><strong>ROBB &amp; TAYLOR</strong><br><span style="color:#9ad7fa">New website enquiry</span></div><div style="padding:24px;border:1px solid #dce7ef;border-radius:0 0 12px 12px"><h1 style="font-size:21px">New ${escapeHtml(service)} enquiry</h1><p><b>Name:</b> ${escapeHtml(name)}<br><b>Company:</b> ${escapeHtml(quote.company || '—')}<br><b>Email:</b> ${escapeHtml(quote.email)}<br><b>Phone:</b> ${escapeHtml(quote.phone || '—')}<br><b>Location:</b> ${escapeHtml(quote.location || '—')}</p><p style="white-space:pre-wrap">${escapeHtml(String(quote.message || 'No project brief supplied').slice(0, 2000))}</p><a href="https://www.robbtaylor.co.nz/admin" style="color:#0077aa">Open admin workspace</a></div></div>`;
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST', signal: AbortSignal.timeout(20000),
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `robb-lead-${item.quote_id}` },
        body: JSON.stringify({ from: sender, to: [recipient], subject, html, text: lines.join('\n\n'),
          ...(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(quote.email)) ? { reply_to: quote.email } : {}) }),
      });
      if (!response.ok) throw new Error(`Provider returned ${response.status}`);
      const result = await response.json();
      const update = await db.from('quote_notification_outbox').update({ status: 'sent', provider_id: result.id ?? null, sent_at: new Date().toISOString(), locked_until: null, last_error: null }).eq('id', item.id);
      if (update.error) throw new Error('Delivery recorded by provider, queue update failed');
      sent++;
    } catch (error) {
      const message = error instanceof Error ? error.message.slice(0, 200) : 'Delivery failed';
      const final = item.attempts >= 5;
      await db.from('quote_notification_outbox').update({
        status: final ? 'dead' : 'failed', locked_until: null, last_error: message,
        next_attempt_at: new Date(Date.now() + Math.min(24, 2 ** item.attempts) * 60 * 60 * 1000).toISOString(),
      }).eq('id', item.id);
      failed++;
    }
  }
  return { claimed: (work ?? []).length, sent, failed };
}
