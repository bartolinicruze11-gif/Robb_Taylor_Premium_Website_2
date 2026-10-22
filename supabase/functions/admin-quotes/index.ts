import { createClient } from "npm:@supabase/supabase-js@2.105.3";
import { isAdminRequest } from "../_shared/admin-auth.ts";
const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, apikey, content-type','Content-Type':'application/json'};
const json=(value:unknown,status=200)=>new Response(JSON.stringify(value),{status,headers});
Deno.serve(async(req:Request)=>{
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return json({error:'Method not allowed'},405);
 if(!(await isAdminRequest(req)))return json({error:'Unauthorized'},401);
 try{
  const b=await req.json();
  const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
  if(b.action==='list'){
   const {data,error}=await db.from('quotes').select('*').order('created_at',{ascending:false});
   return error?json({error:'Unable to load enquiries'},500):json({data});
  }
  if(typeof b.id!=='string'||!/^[0-9a-f-]{36}$/i.test(b.id))return json({error:'Invalid id'},400);
  let error;
  if(b.action==='update_status'&&['new','reviewed','quoted','closed'].includes(b.status))({error}=await db.from('quotes').update({status:b.status}).eq('id',b.id));
  else if(b.action==='update_notes'&&typeof b.admin_notes==='string'&&b.admin_notes.length<=10000)({error}=await db.from('quotes').update({admin_notes:b.admin_notes}).eq('id',b.id));
  else if(b.action==='delete')({error}=await db.from('quotes').delete().eq('id',b.id));
  else return json({error:'Invalid action'},400);
  return error?json({error:'Update failed'},500):json({success:true});
 }catch{return json({error:'Invalid request'},400);}
});
