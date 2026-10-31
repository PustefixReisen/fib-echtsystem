import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import pg from 'pg';
import {webcrypto} from 'node:crypto';

// Actual RIS Edge request handler + real PostgreSQL transaction semantics.
// External HTTP endpoints are replaced with deterministic fixture responses.
const pool=new pg.Pool({connectionString:process.env.U4_TEST_DATABASE_URL});
const origin='https://buergerinfo-feldkirchen.digitalfabrix.de';
const entry=origin+'/do0040.asp?smcmode=32832';
const pdf=origin+'/getfile.asp?id=100';
const jwt=['e30',Buffer.from(JSON.stringify({sub:'22222222-2222-4222-8222-222222222222',aal:'aal2'})).toString('base64url'),'sig'].join('.');
let outage=false, invalidPdf=false, rejectCommit=false;
const scope='33333333-3333-4333-8333-333333333333';

async function setup(){
 // Dedicated ephemeral CI database: clear the earlier generic U4 fixture schema.
 await pool.query('drop schema if exists fib cascade');
 await pool.query('create schema fib');
 await pool.query("create table fib.app_users(user_id uuid,role text,active boolean,setup_status text)");
 await pool.query("insert into fib.app_users values ('22222222-2222-4222-8222-222222222222','admin',true,'active')");
 await pool.query('create table fib.source_scopes(id uuid primary key, scope_key text,status text,last_attempt_at timestamptz,last_success_at timestamptz,gap_since timestamptz,last_error text,updated_at timestamptz)');
 await pool.query("insert into fib.source_scopes(id,scope_key,status) values ($1,'ris-dokumentliste','candidate')",[scope]);
 await pool.query('create table fib.ris_scan_cursors(scope_id uuid primary key,cursor_state jsonb,updated_at timestamptz)');
 await pool.query('create table fib.source_observations(scope_id uuid,external_id text,canonical_url text,content_fingerprint text,first_seen_at timestamptz,last_seen_at timestamptz,revision integer,primary key(scope_id,external_id))');
 await pool.query('create table fib.source_runs(id uuid default gen_random_uuid(),scope_id uuid,started_at timestamptz,completed_at timestamptz,status text,items_seen integer,items_new integer,items_changed integer,error_detail text,cadence text)');
}
function sqlClient(client:pg.Pool|pg.PoolClient){
 const sql:any={json:(o:unknown)=>JSON.stringify(o),
   unsafe:async(query:string,values:any[]=[])=>{
     const result=await client.query(query,values);
     // Match postgres.js: JSONB is materialized as objects by pg automatically.
     return result.rows;
   },
   end:async()=>{},
   begin:async(fn:(tx:any)=>Promise<void>)=>{
     const connection=await pool.connect();
     try{
       await connection.query('begin');
       await fn(sqlClient(connection));
       if(rejectCommit){rejectCommit=false;throw Error('simulated transaction interruption');}
       await connection.query('commit');
     }catch(e){await connection.query('rollback');throw e;}
     finally{connection.release();}
   }};
 return sql;
}
const fetchMock=async(url:string)=>{
 if(url.endsWith('/auth/v1/user'))return Response.json({id:'22222222-2222-4222-8222-222222222222'});
 if(url===entry){
   if(outage)throw Error('RIS connection timed out');
   return new Response('<html><body>Dokumente mit Freigabe seit 02.07.2026 <a href="'+pdf+'">PDF</a></body></html>');
 }
 if(url===pdf){
   if(invalidPdf)return new Response('not-a-pdf');
   return new Response('%PDF-1.4\nfixture');
 }
 throw Error('unexpected URL '+url);
};
function makeHandler(){
 const source=(readFileSync('supabase/functions/_shared/ris-structure.ts','utf8').replace(/\bexport /g,'')+'\n'+readFileSync('supabase/functions/fib-u4-ris-pilot/index.ts','utf8'))
  .replace(/^import postgres from .*;\s*/m,'const postgres = globalThis.__postgres;\n')
  .replace(/^import .*from ['"](?:npm:unpdf|\.\.\/_shared\/ris-structure)[^\n]+$/gm,'')
 .replace("export async function verifyRisScheduler(","async function verifyRisScheduler(")
 .replace("export async function handleRis(req:Request,mode:'interactive'|'scheduler'='interactive'){", "globalThis.__handler = {async fetch(req:Request,mode:'interactive'|'scheduler'='interactive'){")
 .replace("export default {fetch(req:Request){return handleRis(req,'interactive')}};", "};");
 const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
 const sandbox:any=vm.createContext({
  __postgres:()=>sqlClient(pool), fetch:fetchMock,Request,Response,URL,URLSearchParams,
  TextDecoder,Uint8Array,Date,Set,Map,AbortSignal,crypto:webcrypto,atob,
  Deno:{env:{get:(key:string)=>({SUPABASE_URL:'https://auth.test',SUPABASE_ANON_KEY:'test',FIB_DATABASE_URL:'isolated'} as Record<string,string>)[key]}}
 });
 vm.runInContext(js,sandbox);
 return sandbox.__handler;
}
async function state(){
 const result=await pool.query('select cursor_state from fib.ris_scan_cursors where scope_id=$1',[scope]);
 return result.rows[0]?.cursor_state??null;
}
async function run(handler:any,cadence:'daily'|'weekly'){
 const req=new Request('https://function.test',{method:'POST',headers:{authorization:'Bearer '+jwt,'content-type':'application/json'},body:JSON.stringify({commit:true,cadence})});
 const resp=await handler.fetch(req);
 return {code:resp.status,body:await resp.json()};
}
async function main(){
 await setup();
 const handler=makeHandler();
 const first=await run(handler,'weekly');
 assert.equal(first.code,200);assert.equal(first.body.complete,true);
 const weeklyCompleted=(await state()).cadenceStates.weekly.lastCompleteAt;
 outage=true;
 const failure=await run(handler,'daily');
 assert.equal(failure.code,200);assert.equal(failure.body.failures,1);
 const broken=await state();
 assert.equal(broken.cadenceStates.daily.pending[0],entry);
 assert.equal(broken.cadenceStates.weekly.lastCompleteAt,weeklyCompleted);
 const gap=await pool.query('select last_error from fib.source_scopes where id=$1',[scope]);
 assert.match(gap.rows[0].last_error,/daily/);
 outage=false;
 const success=await run(handler,'daily');
 assert.equal(success.code,200);assert.equal(success.body.complete,true);
 assert.equal(success.body.failures,0);
 const recovered=await state();
 assert.equal(recovered.cadenceStates.weekly.lastCompleteAt,weeklyCompleted);
 assert.equal(recovered.cadenceStates.daily.pending.length,0);
 const count=await pool.query('select count(*)::int as total from fib.source_observations');
 assert.equal(count.rows[0].total,1);
 const before=JSON.stringify(recovered);
 const runsBefore=await pool.query('select count(*)::int as total from fib.source_runs');
 invalidPdf=true;
 const pdfFail=await run(handler,'daily');
 assert.equal(pdfFail.code,422);
 assert.equal(JSON.stringify(await state()),before);
 invalidPdf=false;
 rejectCommit=true;
 const rollback=await run(handler,'daily');
 assert.equal(rollback.code,502);
 assert.equal(JSON.stringify(await state()),before);
 const runsAfter=await pool.query('select count(*)::int as total from fib.source_runs');
 assert.equal(runsAfter.rows[0].total,runsBefore.rows[0].total);
 assert.equal(runsAfter.rows[0].total,3);
 console.log('RIS handler real PostgreSQL outage, retry, PDF-failure and transaction rollback: OK');
}
void main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>pool.end());
