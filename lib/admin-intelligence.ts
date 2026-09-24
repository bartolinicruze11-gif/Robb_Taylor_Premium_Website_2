import type { Quote } from '@/lib/supabase';

export function attentionScore(quote: Quote, now = Date.now()) {
  let score = quote.priority === 'urgent' ? 60 : quote.priority === 'high' ? 30 : 0;
  if (quote.status === 'closed') return -1;
  if (quote.follow_up_at && Date.parse(quote.follow_up_at) < now) score += 70;
  if (quote.status === 'new') score += 35;
  if (!quote.next_action && quote.status !== 'quoted') score += 10;
  if (quote.status === 'new' && now - Date.parse(quote.created_at) > 24 * 3600000) score += 25;
  return score;
}

export function workspaceMetrics(quotes: Quote[], now = Date.now()) {
  const open = quotes.filter(q => q.status !== 'closed');
  const due = open.filter(q => q.follow_up_at && Date.parse(q.follow_up_at) < now);
  const newLeads = quotes.filter(q => q.status === 'new');
  const awaitingAction = open.filter(q => !q.next_action);
  const quoted = quotes.filter(q => q.status === 'quoted');
  const recent = quotes.filter(q => Date.parse(q.created_at) > now - 30 * 86400000);
  const serviceCounts = Object.entries(recent.reduce<Record<string, number>>((groups, q) => {
    const service = q.service || 'Unspecified';
    groups[service] = (groups[service] ?? 0) + 1;
    return groups;
  }, {})).sort((a, b) => b[1] - a[1]);
  return { total: quotes.length, open: open.length, due: due.length, newLeads: newLeads.length,
    awaitingAction: awaitingAction.length, quoted: quoted.length, recent: recent.length, serviceCounts };
}

export function exportQuotes(quotes: Quote[]) {
  const columns: (keyof Quote)[] = ['created_at','name','company','email','phone','service','location','status','priority','next_action','follow_up_at','last_contacted_at'];
  const cell = (value: unknown) => `"${String(value ?? '').replace(/^[=+@\-\t\r]/, "'$&").replace(/"/g, '""')}"`;
  return [columns.join(','), ...quotes.map(q => columns.map(column => cell(q[column])).join(','))].join('\r\n');
}
