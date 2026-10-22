import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { enquiryDatabase, sendAdminAlert } from '@/lib/admin-notifications';
export async function POST(req: NextRequest) {
 try {
  const origin=req.headers.get('origin');if(origin&&origin!==req.nextUrl.origin) return NextResponse.json({error:'Invalid origin'},{status:403});
  if(Number(req.headers.get('content-length')||0)>20000) return NextResponse.json({error:'Request too large'},{status:413});
  const body:unknown=await req.json();if(!body||typeof body!=='object'||Array.isArray(body)) return NextResponse.json({error:'Invalid request'},{status:400});
  const input=body as Record<string,unknown>;if(input.website) return NextResponse.json({error:'Invalid request'},{status:400});
  const limits={name:200,email:254,phone:50,company:200,service:200,location:200,budget:200,timeline:200,message:5000};
  const data:Record<string,string>={};for(const [key,limit] of Object.entries(limits)){const v=input[key]??'';if(typeof v!=='string'||v.trim().length>limit) return NextResponse.json({error:'Invalid field'},{status:400});data[key]=v.trim();}
  if(!data.name||!data.location||!['Civil Construction','Earthworks & Pavements','Retaining & Piling','Trenching'].includes(data.service)||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return NextResponse.json({error:'Enter your name, email, service and location'},{status:400});
  data.email=data.email.toLowerCase();const id=randomUUID(),db=enquiryDatabase();if(!db) return NextResponse.json({error:'Please call us directly.'},{status:503});
  const {error}=await db.from('quotes').insert({...data,id});if(error) return NextResponse.json({error:'Unable to save your enquiry. Please call us.'},{status:503});
  const alert=await sendAdminAlert({id,...data} as Parameters<typeof sendAdminAlert>[0]);
  if(!alert.sent) console.error('Admin alert not delivered',id,alert.reason);
  // Keep the existing customer/business email integration. It cannot discard a saved lead on failure.
  try {const response=await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-quote-email`,{method:'POST',signal:AbortSignal.timeout(12000),headers:{'Content-Type':'application/json',Authorization:`Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`},body:JSON.stringify(data)});if(!response.ok) console.error('Legacy notification failed',id,response.status);}catch{console.error('Legacy notification unavailable',id);}
  return NextResponse.json({success:true,quote_request_id:id});
 } catch {return NextResponse.json({error:'Invalid request'},{status:400});}
}
