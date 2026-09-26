import { NextResponse } from 'next/server';
import { authenticateAdmin, isId, privateHeaders } from '@/lib/admin-server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const access = await authenticateAdmin(request);
    if (!access) return NextResponse.json({ error: 'Sign in and verify your authenticator' }, { status: 401, headers: privateHeaders });
    const { db } = access;
    const id = new URL(request.url).searchParams.get('activity');
    if (id) {
      if (!isId(id)) return NextResponse.json({ error: 'Invalid enquiry' }, { status: 400 });
      const { data, error } = await db.from('quote_activity').select('*').eq('quote_id', id).order('created_at', { ascending: false }).limit(100);
      return error ? NextResponse.json({ error: 'History unavailable' }, { status: 500 }) : NextResponse.json({ data }, { headers: privateHeaders });
    }
    const { data, error } = await db.from('quotes').select('*').order('created_at', { ascending: false }).limit(500);
    return error ? NextResponse.json({ error: 'Enquiries unavailable' }, { status: 500 }) : NextResponse.json({ data }, { headers: privateHeaders });
  } catch {
    return NextResponse.json({ error: 'Admin service unavailable' }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  try {
    const access = await authenticateAdmin(request);
    if (!access) return NextResponse.json({ error: 'Sign in and verify your authenticator' }, { status: 401 });
    const body = await request.json().catch(() => null);
    if (!body || !isId(body.id) || typeof body.expected_updated_at !== 'string') return NextResponse.json({ error: 'Invalid enquiry version' }, { status: 400 });
    const { db, actor } = access;
    const { data: before, error: readError } = await db.from('quotes').select('*').eq('id', body.id).maybeSingle();
    if (readError || !before) return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    if (before.updated_at !== body.expected_updated_at) return NextResponse.json({ error: 'This enquiry changed elsewhere. Refresh before saving.' }, { status: 409 });
    const changes: Record<string, unknown> = {};
    const activity: { quote_id: string; actor_id: string; kind: string; detail: string }[] = [];
    const record = (kind: string, detail: string) => activity.push({ quote_id: body.id, actor_id: actor.id, kind, detail });

    if (body.status !== undefined) {
      if (!['new','reviewed','quoted','closed'].includes(body.status)) return NextResponse.json({ error: 'Invalid stage' }, { status: 400 });
      if (body.status !== before.status) { changes.status = body.status; record('status', `Stage changed to ${body.status}`); }
    }
    if (body.priority !== undefined) {
      if (!['normal','high','urgent'].includes(body.priority)) return NextResponse.json({ error: 'Invalid priority' }, { status: 400 });
      if (body.priority !== before.priority) { changes.priority = body.priority; record('priority', `Priority changed to ${body.priority}`); }
    }
    if (body.admin_notes !== undefined) {
      if (typeof body.admin_notes !== 'string' || body.admin_notes.length > 8000) return NextResponse.json({ error: 'Notes are too long' }, { status: 400 });
      if (body.admin_notes !== before.admin_notes) { changes.admin_notes = body.admin_notes; record('note', 'Internal notes updated'); }
    }
    if (body.next_action !== undefined || body.follow_up_at !== undefined) {
      const nextAction = body.next_action ?? before.next_action;
      const followUpAt = body.follow_up_at === undefined ? before.follow_up_at : body.follow_up_at;
      if (typeof nextAction !== 'string' || nextAction.length > 500 || (followUpAt !== null && (typeof followUpAt !== 'string' || !Number.isFinite(Date.parse(followUpAt))))) {
        return NextResponse.json({ error: 'Invalid follow-up details' }, { status: 400 });
      }
      if (nextAction !== before.next_action || followUpAt !== before.follow_up_at) {
        changes.next_action = nextAction; changes.follow_up_at = followUpAt;
        record('follow_up', followUpAt ? `Follow-up set for ${new Date(followUpAt).toISOString().slice(0, 10)}` : 'Follow-up cleared');
      }
    }
    if (body.mark_contacted === true) { changes.last_contacted_at = new Date().toISOString(); record('contact', 'Contact recorded'); }
    if (!Object.keys(changes).length) return NextResponse.json({ error: 'No changes to save' }, { status: 400 });
    changes.updated_at = new Date().toISOString();
    const { data, error } = await db.from('quotes').update(changes).eq('id', body.id).eq('updated_at', before.updated_at).select().maybeSingle();
    if (error || !data) return NextResponse.json({ error: 'Enquiry changed elsewhere. Refresh and try again.' }, { status: 409 });
    const log = await db.from('quote_activity').insert(activity);
    if (log.error) console.error('Quote activity write failed', log.error.message);
    return NextResponse.json({ data, activity_recorded: !log.error }, { headers: privateHeaders });
  } catch {
    return NextResponse.json({ error: 'Could not save enquiry' }, { status: 503 });
  }
}
