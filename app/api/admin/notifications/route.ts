import { NextResponse } from 'next/server';
import { authenticateAdmin, isId, privateHeaders } from '@/lib/admin-server';
import { dispatchQuoteNotifications } from '@/lib/quote-notifications';

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    const access = await authenticateAdmin(request);
    if (!access) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data, error } = await access.db.from('quote_notification_outbox')
      .select('id,quote_id,status,attempts,next_attempt_at,created_at,sent_at,last_error,quote:quotes(name,service)')
      .order('created_at', { ascending: false }).limit(100);
    return error ? NextResponse.json({ error: 'Queue unavailable' }, { status: 500 }) : NextResponse.json({ data }, { headers: privateHeaders });
  } catch { return NextResponse.json({ error: 'Admin service unavailable' }, { status: 503 }); }
}

export async function POST(request: Request) {
  try {
    const access = await authenticateAdmin(request);
    if (!access) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json().catch(() => null);
    if (body?.action === 'retry' && isId(body.id)) {
      const { error } = await access.db.from('quote_notification_outbox')
        .update({ status: 'pending', attempts: 0, next_attempt_at: new Date().toISOString(), last_error: null })
        .eq('id', body.id).in('status', ['failed','dead']);
      return error ? NextResponse.json({ error: 'Retry failed' }, { status: 500 }) : NextResponse.json({ ok: true });
    }
    if (body?.action === 'send_pending') {
      return NextResponse.json(await dispatchQuoteNotifications(), { headers: privateHeaders });
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch { return NextResponse.json({ error: 'Delivery service unavailable' }, { status: 503 }); }
}
