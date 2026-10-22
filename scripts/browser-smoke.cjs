const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const {spawn}=require('node:child_process'),path=require('node:path');
 const entries=[[fs.existsSync('components/home/QuickQuoteWidget.tsx')?'emt':'robb',3199]];
 const servers=[];
 for(const [repo,port] of entries) {
  const server=spawn(process.execPath,[require.resolve('next/dist/bin/next'),'start','-p',String(port)],{cwd:process.cwd(),stdio:['ignore','pipe','pipe']}); servers.push(server);
  await new Promise((resolve,reject)=>{let logs='';server.stdout.on('data',d=>{logs+=d.toString();if(logs.includes('Ready'))resolve();});server.stderr.on('data',d=>{logs+=d.toString();});server.on('exit',code=>reject(Error('Server exited '+code+' '+logs)));setTimeout(()=>reject(Error('Startup timeout '+logs)),10000).unref();});
 }
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE || undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report=[];
 for(const [repo,port] of entries){
  const base=`http://localhost:${port}`;
  const context=await browser.newContext({viewport:{width:1365,height:900}});
  await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const routes=repo==='emt'?['/','/contact','/services/building-demolition','/admin/leads']:['/','/contact','/services/civil-construction','/admin'];
  for(const route of routes){const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200,repo+route);await page.locator('h1').first().waitFor();}
  await page.getByLabel('Email',{exact:true}).waitFor();
  assert.equal(await page.locator('input[type=password]').count(),1);
  const api=repo==='emt'?'/api/admin/leads':'/api/admin/quotes';
  const unauthorized=await context.request.fetch(base+api,{method:repo==='emt'?'GET':'POST',data:repo==='emt'?undefined:{action:'list'}});assert.equal(unauthorized.status(),401);
  const cron=await context.request.get(base+'/api/cron/notifications');assert.equal(cron.status(),401);
  const redirect=JSON.parse(fs.readFileSync('asset-redirects.json'))[0];
  const old=await context.request.get(base+redirect.source,{maxRedirects:0});assert.equal(old.status(),308);assert.ok(old.headers().location.endsWith(redirect.destination));
  await page.route('**/api/submit-quote',async route=>{
   const payload=route.request().postDataJSON();
   if(repo==='emt'){assert.equal(payload.email,null);assert.equal(payload.contact_preference,'phone');}
   else {assert.equal(payload.service,'Civil Construction');assert.equal(payload.email,'example@example.test');}
   await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:true,quote_request_id:'00000000-0000-4000-a000-000000000001'})});
  });
  if(repo==='emt'){
   await page.goto(base);await page.locator('#emt_quick_quote').waitFor();
   await page.locator('#emt_quick_quote input').nth(0).fill('Example Callback');
   await page.locator('#emt_quick_quote input').nth(1).fill('0211234567');
   await page.locator('#emt_quick_quote input').nth(2).fill('Lower Hutt');
   await page.locator('#emt_quick_quote button[type=submit]').click();
   await page.getByText("Got it — we'll call you back!",{exact:true}).waitFor();
   // FAQ remains interactive after component extraction.
   await page.getByRole('button',{name:'How much does house demolition cost in Wellington?'}).click();
  }else{
   await page.goto(base+'/contact');
   await page.getByRole('button',{name:'Civil Construction Roading, kerb & channel, structures'}).click();
   await page.getByRole('button',{name:/Continue/}).click();
   await page.getByRole('button',{name:'Wellington City',exact:true}).click();
   await page.getByRole('button',{name:/Continue/}).click();
   await page.locator('input[name=name]').fill('Example Customer');
   await page.locator('input[name=email]').fill('example@example.test');
   await page.getByRole('button',{name:'Get My Free Quote'}).click();
   await page.waitForURL('**/contact/thank-you');
  }
  await page.setViewportSize({width:390,height:844});await page.goto(base);await page.locator('h1').first().waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),true,'mobile overflow '+repo);
  await page.screenshot({path:'/tmp/'+repo+'-mobile-smoke.png',fullPage:false});
  assert.deepEqual(errors,[],repo+' runtime errors');
  report.push({repo,routes:routes.length,adminUnauthorized:401,cronUnauthorized:401,assetRedirect:308,form:'intercepted success; no real submission',mobileOverflow:false,runtimeErrors:errors});
  await context.close();
 }
 await browser.close();for(const server of servers) server.kill();fs.writeFileSync('/tmp/website-browser-smoke-results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
