import { NextResponse } from 'next/server';
import { dispatchQuoteNotifications } from '@/lib/quote-notifications';

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    return NextResponse.json(await dispatchQuoteNotifications(), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Notification worker unavailable' }, { status: 503 });
  }
}
