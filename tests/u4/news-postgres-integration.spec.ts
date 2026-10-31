import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import pg from 'pg';
import {webcrypto} from 'node:crypto';
// Destructive fixture setup is allowed only against the named loopback CI database.
const connection=process.env.U4_TEST_DATABASE_URL;
if(!connection)throw Error('U4_TEST_DATABASE_URL required');
const target=new URL(connection);
if(!['localhost','127.0.0.1'].includes(target.hostname)||target.pathname!=='/fib_u4_test')throw Error('isolated_test_database_required');
const pool=new pg.Pool({connectionString:connection});
const root='https://www.feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen';
const archive=root+'/nachrichten-archiv',article=root+'/test',older=archive+'/older';
const uid='22222222-2222-4222-8222-222222222222',scope='33333333-3333-4333-8333-333333333333';
let outage=false,changed=false,rollback=false,admin=true,dbCalls=0;
function client(db:pg.Pool|pg.PoolClient):any{return {
 unsafe:async(q:string,p:any[]=[])=>{dbCalls++;if(q.includes('from fib.app_users')&&!admin)return [];return (await db.query(q,p)).rows;},
 end:async()=>{},
 begin:async(fn:any)=>{const c=await pool.connect();try{await c.query('begin');const r=await fn(client(c));if(rollback)throw Error('injected_commit_failure');await c.query('commit');return r;}catch(e){await c.query('rollback');throw e;}finally{c.release();}},
};}
const shared=readFileSync('supabase/functions/_shared/u4-news.ts','utf8').replace(/\bexport /g,'');
const handler=readFileSync('supabase/functions/fib-u4-pilot/index.ts','utf8')
 .replace(/^import .*;$/gm,'').replace('export default {','globalThis.handler = {');
const context:any=vm.createContext({URL,URLSearchParams,Request,Response,AbortSignal,TextEncoder,crypto:webcrypto,atob,
 postgres:()=>client(pool),Deno:{env:{get:(k:string)=>({SUPABASE_URL:'https://auth.test',SUPABASE_ANON_KEY:'test',FIB_DATABASE_URL:'isolated'}[k])}},
 fetch:async(u:string)=>{
  if(u==='https://auth.test/auth/v1/user')return Response.json({id:uid});
  if(outage&&u===older)throw Error('HTTP 503');
  let body='';
  if(u===root)body=`<a href="${article}">Test</a>`;
  else if(u===archive)body=`<a href="${article}">Duplicate</a><a href="${older}">Older</a>`;
  else if(u===article||u===older)body=`<main><h1>News</h1><p>Article body ${changed&&u===article?'updated':'original'} content</p></main>`;
  else throw Error('unexpected HTTP '+u);
  return new Response('<html>'+body+'</html>',{headers:{'content-type':'text/html'}});
 }});
vm.runInContext(ts.transpileModule(shared+'\n'+handler,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText,context);
async function call(commit=true,aal='aal2',authenticated=true){
 const jwt='e30.'+Buffer.from(JSON.stringify({sub:uid,aal})).toString('base64url')+'.sig';
 const r=await context.handler.fetch(new Request('https://function.test',{method:'POST',headers:authenticated?{authorization:'Bearer '+jwt}: {},body:JSON.stringify({commit})}));
 return {status:r.status,body:await r.json()};
}
async function count(table:string){return Number((await pool.query('select count(*) from fib.'+table)).rows[0].count);}
async function main(){
 await pool.query('drop schema if exists fib cascade; create schema fib');
 await pool.query('create table fib.app_users(user_id uuid,role text,active boolean,setup_status text)');
 await pool.query("insert into fib.app_users values ($1,'admin',true,'active')",[uid]);
 await pool.query('create table fib.source_scopes(id uuid primary key,scope_key text,status text,last_attempt_at timestamptz,last_success_at timestamptz,gap_since timestamptz,last_error text,updated_at timestamptz)');
 await pool.query("insert into fib.source_scopes(id,scope_key,status) values ($1,'gemeinde-nachrichten','candidate')",[scope]);
 await pool.query('create table fib.source_observations(scope_id uuid references fib.source_scopes(id),external_id text,canonical_url text,content_fingerprint text,first_seen_at timestamptz,last_seen_at timestamptz,revision integer check(revision>0),primary key(scope_id,external_id))');
 await pool.query('create table fib.source_runs(scope_id uuid references fib.source_scopes(id),started_at timestamptz,completed_at timestamptz,status text,items_seen integer,items_new integer,items_changed integer)');
 assert.equal((await call(true,'aal2',false)).status,401);assert.equal(dbCalls,0);
 assert.equal((await call(true,'aal1')).status,403);assert.equal(dbCalls,0);
 admin=false;assert.equal((await call()).status,403);admin=true;
 assert.equal((await call(false)).status,200);assert.equal(await count('source_observations'),0);
 let r=await call();assert.equal(r.status,200,JSON.stringify(r.body));assert.equal(r.body.newCount,2);assert.equal(await count('source_observations'),2);
 r=await call();assert.equal(r.body.newCount,0);assert.equal(r.body.changedCount,0);
 changed=true;r=await call();assert.equal(r.body.changedCount,1);
 assert.equal((await pool.query('select revision from fib.source_observations where canonical_url=$1',[article])).rows[0].revision,2);
 const before=await count('source_runs');outage=true;assert.equal((await call()).status,502);assert.equal(await count('source_runs'),before);
 outage=false;changed=false;rollback=true;assert.equal((await call()).status,502);assert.equal(await count('source_runs'),before);
 assert.equal((await pool.query('select revision from fib.source_observations where canonical_url=$1',[article])).rows[0].revision,2);
 rollback=false;assert.equal((await call()).body.changedCount,1);
 // No implicit editorial object writes: the handler succeeds without any editorial table.
 console.log('Actual Gemeinde Edge handler + PostgreSQL: authorization, dry run, archive, dedupe, revision, outage, rollback and recovery passed');
}
main().finally(()=>pool.end()).catch(e=>{console.error(e);process.exitCode=1});
