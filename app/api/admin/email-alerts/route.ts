import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { notificationConfiguration, sendAdminAlert, verifyExistingAdmin } from '@/lib/admin-notifications';
export const dynamic='force-dynamic';
export async function POST(req:NextRequest){
 const origin=req.headers.get('origin');if(origin&&origin!==req.nextUrl.origin) return NextResponse.json({error:'Forbidden'},{status:403});
 try{
  const b=await req.json();if(!await verifyExistingAdmin(b.password)) return NextResponse.json({error:'Unauthorized'},{status:401});
  const config=notificationConfiguration();
  if(b.action==='status') return NextResponse.json({ready:config.ready,recipients:config.recipients},{headers:{'Cache-Control':'no-store'}});
  if(b.action!=='test') return NextResponse.json({error:'Invalid action'},{status:400});
  const result=await sendAdminAlert({id:randomUUID(),name:'',email:'',phone:'',company:'',service:'',location:'',budget:'',timeline:'',message:''},true);
  return result.sent?NextResponse.json({success:true,message:'Email provider accepted the test. Check your inbox and spam folder.'},{headers:{'Cache-Control':'no-store'}}):NextResponse.json({error:result.reason==='not_configured'?'Email alerts need server configuration before they can send.':'Email provider did not accept the test. Try again or contact your website administrator.'},{status:503});
 }catch{return NextResponse.json({error:'Invalid request'},{status:400});}
}
