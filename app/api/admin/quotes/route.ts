import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminRequest } from '@/lib/admin-auth';
export async function POST(req: NextRequest) {
 if (!(await isAdminRequest(req))) return NextResponse.json({error:'Unauthorized'},{status:401});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url || !key) return NextResponse.json({error:'Server configuration error'},{status:503});
 try {
  const b=await req.json();
  const db=createClient(url,key,{auth:{persistSession:false}});
  if(b.action==='list') {
   const {data,error}=await db.from('quotes').select('*').order('created_at',{ascending:false});
   return error ? NextResponse.json({error:'Unable to load enquiries'},{status:500}) : NextResponse.json({data});
  }
  if(typeof b.id!=='string' || !/^[0-9a-f-]{36}$/i.test(b.id)) return NextResponse.json({error:'Invalid id'},{status:400});
  let error;
  if(b.action==='update_status' && ['new','reviewed','quoted','closed'].includes(b.status)) ({error}=await db.from('quotes').update({status:b.status}).eq('id',b.id));
  else if(b.action==='update_notes' && typeof b.admin_notes==='string' && b.admin_notes.length<=10000) ({error}=await db.from('quotes').update({admin_notes:b.admin_notes}).eq('id',b.id));
  else if(b.action==='delete') ({error}=await db.from('quotes').delete().eq('id',b.id));
  else return NextResponse.json({error:'Invalid action'},{status:400});
  return error ? NextResponse.json({error:'Update failed'},{status:500}) : NextResponse.json({success:true});
 } catch { return NextResponse.json({error:'Invalid request'},{status:400}); }
}
