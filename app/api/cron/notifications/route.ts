import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
 const secret=process.env.CRON_SECRET;
 if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) return NextResponse.json({error:'Unauthorized'},{status:401});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if (!url || !key) return NextResponse.json({error:'Server configuration error'},{status:503});
 try {
  const response=await fetch(`${url}/functions/v1/notification-worker`,{method:'POST',signal:AbortSignal.timeout(55000),headers:{Authorization:`Bearer ${key}`,'x-cron-secret':secret}});
  if (!response.ok) return NextResponse.json({error:'Queue processing failed'},{status:502});
  return NextResponse.json(await response.json());
 } catch { return NextResponse.json({error:'Queue processing unavailable'},{status:502}); }
}
