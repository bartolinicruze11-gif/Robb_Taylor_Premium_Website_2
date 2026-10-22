// Test-only process preload. Never imported by the app.
const originalFetch=global.fetch;
global.fetch=async function(input,init={}){
 const url=String(input?.url||input),body=typeof init.body==='string'?JSON.parse(init.body):{};
 if(url.includes('/rest/v1/quotes')){console.log('MOCK_RECORD '+JSON.stringify(body));return new Response(null,{status:201});}
 if(url.includes('/functions/v1/admin-quotes'))return Response.json(body.password==='verification-password'?{data:[]}:{error:'Unauthorized'},{status:body.password==='verification-password'?200:401});
 if(url==='https://api.resend.com/emails'){console.log('MOCK_SEND '+JSON.stringify({body,key:init.headers['Idempotency-Key']}));return body.text.includes('FAIL_PROVIDER')?Response.json({error:'unavailable'},{status:503}):Response.json({id:'mock-provider-id'});}
 if(url.includes('/functions/v1/send-quote-email')){console.log('MOCK_LEGACY');return Response.json({success:true});}
 if(url.includes('.supabase.co')||url.includes('resend.com'))throw Error('Unexpected external request in test');
 return originalFetch(input,init);
};
