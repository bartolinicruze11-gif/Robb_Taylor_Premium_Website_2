const {spawn}=require('child_process'),path=require('path'),assert=require('node:assert/strict');
(async()=>{
 const port=3291,base='http://localhost:'+port;let output='';
 const server=spawn(process.execPath,[require.resolve('next/dist/bin/next'),'start','-p',String(port)],{cwd:process.cwd(),env:{...process.env,NODE_OPTIONS:'--require='+path.resolve('scripts/email-alerts-fetch-mock.cjs'),RESEND_API_KEY:'verification-only',ADMIN_NOTIFICATION_FROM:'Robb & Taylor <test@example.invalid>',ADMIN_NOTIFICATION_TO:'bartolinicruze11@gmail.com'},stdio:['ignore','pipe','pipe']});
 try{
 await new Promise((resolve,reject)=>{server.stdout.on('data',d=>{output+=d;if(output.includes('Ready'))resolve();});server.stderr.on('data',d=>output+=d);server.on('exit',c=>reject(Error('Test server stopped '+c)));setTimeout(()=>reject(Error('Server timeout')),15000).unref();});
 const post=(url,body,origin=base)=>fetch(base+url,{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)});
 assert.equal((await post('/api/admin/email-alerts',{action:'test',password:'wrong'})).status,401);
 assert.ok(!output.includes('MOCK_SEND'));
 assert.equal((await post('/api/admin/email-alerts',{action:'test',password:'verification-password'},'https://other.invalid')).status,403);
 const status=await post('/api/admin/email-alerts',{action:'status',password:'verification-password'});assert.deepEqual(await status.json(),{ready:true,recipients:['bartolinicruze11@gmail.com']});
 const test=await post('/api/admin/email-alerts',{action:'test',password:'verification-password'});assert.equal(test.status,200);
 const quote={name:'Verification only',email:'example@example.invalid',phone:'0210000000',company:'',service:'Civil Construction',location:'Wellington City',budget:'',timeline:'',message:'No real enquiry'};
 const result=await post('/api/submit-quote',quote);assert.equal(result.status,200);const data=await result.json();assert.equal(data.success,true);
 await new Promise(r=>setTimeout(r,50));
 const events=output.split('\n');const recordIndex=events.findIndex(s=>s.startsWith('MOCK_RECORD '));const record=JSON.parse(events[recordIndex].slice(12));const sendIndex=events.findIndex((s,i)=>i>recordIndex&&s.startsWith('MOCK_SEND '));const sent=JSON.parse(events[sendIndex].slice(10));
 assert.ok(recordIndex>=0&&sendIndex>recordIndex);assert.deepEqual(sent.body.to,['bartolinicruze11@gmail.com']);assert.equal(record.id,data.quote_request_id);assert.equal(sent.key,'rt-enquiry-'+record.id);assert.ok(sent.body.text.includes(record.id));assert.ok(events.some(s=>s.startsWith('MOCK_LEGACY')));
 assert.equal((await post('/api/submit-quote',{...quote,email:'invalid'})).status,400);
 const failure=await post('/api/submit-quote',{...quote,message:'FAIL_PROVIDER'});assert.equal(failure.status,200);assert.equal((await failure.json()).success,true,'Email outage must preserve a saved enquiry');
 console.log('Passed: admin authorization, origin check, fixed Gmail recipient, database-before-email ordering, provider idempotency, legacy email preservation, validation and saved enquiry success during provider outage. All provider/database calls mocked.');
 }finally{server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
