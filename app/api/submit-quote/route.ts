import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const services=['Civil Construction','Earthworks & Pavements','Retaining & Piling','Trenching'];
export async function POST(req: NextRequest) {
 try {
  const b=await req.json();
  if (!b || typeof b!=='object' || b.website) return NextResponse.json({error:'Invalid request'},{status:400});
  const limits:Record<string,number>={name:200,company:200,email:254,phone:50,service:200,location:200,budget:200,timeline:200,message:5000};
  const data:Record<string,string>={};
  for(const [key,limit] of Object.entries(limits)) {
   const value=b[key]??'';
   if(typeof value!=='string' || value.trim().length>limit) return NextResponse.json({error:'Invalid field'},{status:400});
   data[key]=value.trim();
  }
  if(!data.name || !data.location || !services.includes(data.service) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return NextResponse.json({error:'Enter your name, email, service and location'},{status:400});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url || !key) return NextResponse.json({error:'Server configuration error'},{status:503});
  const id=randomUUID();
  const db=createClient(url,key,{auth:{persistSession:false}});
  const {error}=await db.from('quotes').insert({...data,id,email:data.email.toLowerCase()});
  if(error) return NextResponse.json({error:'Unable to save enquiry. Please call us directly.'},{status:503});
  return NextResponse.json({success:true,quote_request_id:id});
 } catch {return NextResponse.json({error:'Invalid request'},{status:400});}
}
