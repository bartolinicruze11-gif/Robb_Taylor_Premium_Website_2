const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { PGlite } = require('@electric-sql/pglite');
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';
const repo = process.cwd();
const emt = fs.existsSync(path.join(repo,'components/home/QuickQuoteWidget.tsx'));
function load(file,mocks={}) {
 const exports={};
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 vm.runInNewContext(code,{exports,module:{exports},require:n=>mocks[n]??require(n),Request,Response,Buffer,atob,Deno:{env:{get:()=> 'test'}},process});
 return exports;
}
test('admin boundary rejects missing, invalid, non-admin and password-only sessions',async()=>{
 for(const [file,moduleName] of [['lib/admin-auth.ts','@supabase/supabase-js'],['supabase/functions/_shared/admin-auth.ts','npm:@supabase/supabase-js@2.105.3']]) {
  let user={app_metadata:{role:'admin'}},error=null;
  const {isAdminRequest}=load(file,{[moduleName]:{createClient:()=>({auth:{getUser:async()=>({data:{user},error})}})}});
  assert.equal(await isAdminRequest(new Request('https://test')),false);
  const req=aal=>new Request('https://test',{headers:{authorization:'Bearer x.'+Buffer.from(JSON.stringify({aal})).toString('base64url')+'.signature'}});
  assert.equal(await isAdminRequest(req('aal1')),false);
  assert.equal(await isAdminRequest(req('aal2')),true);
  user={app_metadata:{},user_metadata:{role:'admin'}};
  assert.equal(await isAdminRequest(req('aal2')),false);
  user={app_metadata:{role:'admin'}};error=new Error('Invalid signature');
  assert.equal(await isAdminRequest(req('aal2')),false);
 }
});
test('retry policy treats rate limits and outages differently from permanent failures',()=>{
 const {retryDecision}=load('supabase/functions/_shared/retry-policy.ts');
 for(const status of [null,408,429,500,503]) assert.equal(retryDecision(status,1).retry,true);
 for(const status of [400,401,403,409,422]) assert.equal(retryDecision(status,1).retry,false);
 assert.equal(retryDecision(503,8).retry,false);
 assert.ok(retryDecision(503,3).delayMs>retryDecision(503,1).delayMs);
 assert.ok(retryDecision(503,7).delayMs<=3600000);
});
test('transactional outbox, permissions, callback model, leases and dead letters',async()=>{
 const db=new PGlite();
 const table=emt?'quote_requests':'quotes';
 await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS; CREATE SCHEMA auth; CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$ SELECT coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$; GRANT USAGE ON SCHEMA auth TO authenticated; GRANT EXECUTE ON FUNCTION auth.jwt() TO authenticated; CREATE TABLE public.${table}(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),name text NOT NULL,email text NOT NULL,phone text NOT NULL,project_details text NOT NULL DEFAULT '',status text NOT NULL DEFAULT 'new',created_at timestamptz NOT NULL DEFAULT now()); ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY; GRANT INSERT,SELECT,UPDATE ON public.${table} TO anon,authenticated; CREATE POLICY old_insert ON public.${table} FOR INSERT TO anon,authenticated WITH CHECK(true); CREATE POLICY old_read ON public.${table} FOR SELECT TO authenticated USING(true); CREATE POLICY old_update ON public.${table} FOR UPDATE TO authenticated USING(true) WITH CHECK(true);`);
 for(const file of fs.readdirSync('supabase/migrations').filter(f=>f.startsWith('20261022')&&!f.includes('email_job_recovery')).sort()) await db.exec(fs.readFileSync('supabase/migrations/'+file,'utf8'));
 const insert=async(email,phone,pref='email')=>db.query(`INSERT INTO public.${table}(name,email,phone,project_details${emt?',contact_preference':''}) VALUES('Example',$1,$2,'Test project'${emt?', $3':''}) RETURNING id`,emt?[email,phone,pref]:[email,phone]);
 const result=await insert('a@example.test','0211234567');const id=result.rows[0].id;
 assert.equal((await db.query('SELECT count(*)::int n FROM notification_outbox WHERE quote_id=$1',[id])).rows[0].n,emt?3:2);
 await db.exec('BEGIN');await insert('rollback@example.test','0219999999');await db.exec('ROLLBACK');
 assert.equal((await db.query("SELECT count(*)::int n FROM notification_outbox WHERE payload->>'email'='rollback@example.test'")).rows[0].n,0);
 await db.exec(`SET ROLE anon`);
 await assert.rejects(db.query('SELECT * FROM notification_outbox'));
 await db.exec('RESET ROLE');
 // Restrictive policy still blocks access even when old permissive policies exist.
 await db.exec(`SET ROLE authenticated; SET request.jwt.claims='{"app_metadata":{"role":"admin"},"aal":"aal1"}'`);
 assert.equal((await db.query(`SELECT * FROM ${table}`)).rows.length,0);
 await db.exec(`SET request.jwt.claims='{"app_metadata":{"role":"admin"},"aal":"aal2"}'`);
 assert.equal((await db.query(`SELECT * FROM ${table}`)).rows.length,1);
 await db.exec(`SET request.jwt.claims='{"app_metadata":{},"user_metadata":{"role":"admin"},"aal":"aal2"}'`);
 assert.equal((await db.query(`SELECT * FROM ${table}`)).rows.length,0);
 await db.exec('RESET ROLE');
 if(emt){
  await db.exec('SET ROLE anon');
  // Public callback works without a service key and without creating customer mail.
  await db.query(`INSERT INTO ${table}(name,email,phone,project_details,contact_preference) VALUES('Callback',NULL,'0217654321','Please call','phone')`);
  await db.exec('RESET ROLE');
  assert.equal((await db.query("SELECT count(*)::int n FROM notification_outbox WHERE kind='customer' AND payload->>'phone'='0217654321'")).rows[0].n,0);
  await assert.rejects(insert(null,'','phone'));
  await assert.rejects(insert('invalid','0212222222'));
 }
 const first=await db.query('SELECT * FROM claim_quote_notifications(1)');assert.equal(first.rows.length,1);const job=first.rows[0];assert.equal(job.attempt_count,1);
 const second=await db.query('SELECT * FROM claim_quote_notifications(50)');assert.ok(second.rows.every(j=>j.id!==job.id));
 await db.query("UPDATE notification_outbox SET lease_until=now()-interval '1 second' WHERE id=$1",[job.id]);
 const recovered=await db.query('SELECT * FROM claim_quote_notifications(50)');const again=recovered.rows.find(j=>j.id===job.id);assert.equal(again.attempt_count,2);assert.notEqual(again.lease_token,job.lease_token);
 const stale=await db.query("UPDATE notification_outbox SET status='sent' WHERE id=$1 AND lease_token=$2 RETURNING id",[job.id,job.lease_token]);assert.equal(stale.rows.length,0);
 await db.query("UPDATE notification_outbox SET lease_until=now()-interval '1 second',attempt_count=8 WHERE id=$1",[job.id]);await db.query('SELECT * FROM claim_quote_notifications(50)');
 assert.equal((await db.query('SELECT status FROM notification_outbox WHERE id=$1',[job.id])).rows[0].status,'dead');
 await db.close();
});
