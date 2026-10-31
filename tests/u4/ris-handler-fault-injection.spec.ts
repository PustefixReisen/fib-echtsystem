import {edgeDatasetSupport} from "./edge-dataset-support.ts";
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {webcrypto} from 'node:crypto';

// Executes the actual RIS Edge handler with an isolated transactional Postgres
// fake, fake auth, mocked RIS pages and PDF bytes. No production credentials.
const origin='https://buergerinfo-feldkirchen.digitalfabrix.de';
const entry=origin+'/do0040.asp?smcmode=32832';
const page2=origin+'/do0040.asp?smcadat=1234567';
const pdf=origin+'/getfile.asp?id=100';
const pdfBytes=new TextEncoder().encode('%PDF-1.4\nmock content');
const jwt=['e30',Buffer.from(JSON.stringify({sub:'user-1',aal:'aal2'})).toString('base64url'),'sig'].join('.');
const auth='Bearer '+jwt;
type State={cursor:Record<string,any>|null;observations:Map<string,string>;runs:any[];scopeError:string|null};
let db:State={cursor:null,observations:new Map(),runs:[],scopeError:null};
let broken=false,brokenPdf=false,conflict=false;
function clone(s:State):State{return {cursor:s.cursor?structuredClone(s.cursor):null,observations:new Map(s.observations),runs:structuredClone(s.runs),scopeError:s.scopeError};}
function connection(state:State){
 const query=async(q:string,params:any[]=[])=>{
  if(q.includes('to_regclass'))return [{r:null}];
  if(q.includes('from fib.app_users'))return [{id:'user-1'}];
  if(q.includes('from fib.source_scopes')&&q.includes('scope_key'))return [{id:'scope-1'}];
  if(q.startsWith('select cursor_state'))return state.cursor?[{cursor_state:structuredClone(state.cursor)}]:[];
  if(q.includes('for update'))return [{id:'scope-1'}];
  if(q.startsWith('select canonical_url,content_fingerprint'))return [...state.observations].filter(([url])=>params[1].includes(url)).map(([canonical_url,content_fingerprint])=>({canonical_url,content_fingerprint}));
  if(q.startsWith('insert into fib.source_observations')){
    const url=params[2]; const hash=params[3];
    if(!state.observations.has(url)||!hash.startsWith('ris:'))state.observations.set(url,hash);
    return [];
  }
  if(q.startsWith('insert into fib.ris_scan_cursors')){state.cursor=structuredClone(params[1]);return [];}
  if(q.startsWith('insert into fib.source_runs')){state.runs.push({status:params[2],cadence:params[7]});return [];}
  if(q.startsWith('update fib.source_scopes')){state.scopeError=params[3];return [];}
  throw new Error('Unexpected SQL: '+q.slice(0,120));
 };
 const sql:any={unsafe:query,json:(v:any)=>v,end:async()=>{},begin:async(fn:(tx:any)=>Promise<void>)=>{
   const transaction=clone(state);
   const tx=connection(transaction);
   await fn(tx);
   if(conflict){conflict=false;throw new Error('simulated concurrent cursor mutation');}
   db=transaction;
 }};
 return sql;
}
const fakePostgres=()=>connection(db);
const fakeFetch=async(url:string)=>{
 if(url.endsWith('/auth/v1/user'))return Response.json({id:'user-1'});
 if(url===entry||url===page2){
   if(broken&&url===entry)throw new Error('simulated RIS outage');
   const html=url===entry
     ? '<html><body>Dokumente mit Freigabe seit 02.07.2026 <a href="'+pdf+'">PDF</a><a href="'+page2+'">Next</a></body></html>'
     : '<html><body>Dokumente mit Freigabe seit 02.07.2026 <a href="'+pdf+'">PDF</a></body></html>';
   return new Response(html,{status:200,headers:{'content-type':'text/html'}});
 }
 if(url===pdf){
   if(brokenPdf)throw new Error('simulated PDF outage');
   return new Response(pdfBytes,{status:200,headers:{'content-type':'application/pdf'}});
 }
 throw new Error('Unexpected fetch '+url);
};
const source=edgeDatasetSupport+(readFileSync('supabase/functions/_shared/ris-structure.ts','utf8').replace(/\bexport /g,'')+'\n'+readFileSync('supabase/functions/fib-u4-ris-pilot/index.ts','utf8'))
 .replace(/^import .*development-datasets.*;\s*/m,'')
 .replace(/^import postgres from .*;\s*/m,'const postgres = globalThis.__postgres;\n')
 .replace(/^import .*from ['"](?:npm:unpdf|\.\.\/_shared\/ris-structure)[^\n]+$/gm,'')
 .replace("export async function verifyRisScheduler(","async function verifyRisScheduler(")
 .replace("export async function handleRis(req:Request,mode:'interactive'|'scheduler'='interactive'){", "globalThis.__handler = {async fetch(req:Request,mode:'interactive'|'scheduler'='interactive'){")
 .replace("export default {fetch(req:Request){return handleRis(req,'interactive')}};", "};");
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
const settings:Record<string,string>={SUPABASE_URL:'https://auth.test',SUPABASE_ANON_KEY:'test',FIB_DATABASE_URL:'test'};
const context:any=vm.createContext({
 __postgres:fakePostgres,fetch:fakeFetch,Request,Response,URL,URLSearchParams,
 TextDecoder,TextEncoder,Uint8Array,Date,Set,Map,AbortSignal,crypto:webcrypto,atob,
 Deno:{env:{get:(key:string)=>settings[key]}},
});
vm.runInContext(js,context);
async function run(cadence:'daily'|'weekly'){
 const req=new Request('https://function.test',{method:'POST',headers:{authorization:auth,'content-type':'application/json'},body:JSON.stringify({commit:true,cadence})});
 const resp=await context.__handler.fetch(req);
 return {status:resp.status,body:await resp.json()};
}
async function main(){
 // Scheduler cannot run without explicit opt-in and secret, even with no JWT.
 const schedulerReq=(token:string)=>new Request('https://function.test',{method:'POST',headers:{'x-fib-ris-scheduler':token,'content-type':'application/json'},body:JSON.stringify({commit:true,cadence:'daily'})});
 let response=await context.__handler.fetch(schedulerReq('x'.repeat(36)),'scheduler');
 assert.equal(response.status,503);
 settings.FIB_RIS_AUTOMATION_ENABLED='true';
 settings.FIB_RIS_SCHEDULER_TOKEN='correct-purpose-limited-secret-0123456789';
 response=await context.__handler.fetch(schedulerReq('wrong-purpose-limited-secret-012345678'),'scheduler');
 assert.equal(response.status,403);
 assert.equal(db.runs.length,0);
 response=await context.__handler.fetch(schedulerReq(settings.FIB_RIS_SCHEDULER_TOKEN),'scheduler');
 assert.equal(response.status,200);
 const scheduled=await response.json();
 assert.equal(scheduled.complete,true);
 response=await context.__handler.fetch(schedulerReq(settings.FIB_RIS_SCHEDULER_TOKEN),'scheduler');
 assert.equal(response.status,200);
 assert.equal((await response.json()).skipped,'not_due');
 settings.FIB_RIS_AUTOMATION_ENABLED='false';
 const weekly=await run('weekly');
 assert.equal(weekly.status,200);assert.equal(weekly.body.complete,true);
 assert.equal(db.cursor?.cadenceStates.weekly.pending.length,0);
 const weeklyComplete=db.cursor!.cadenceStates.weekly.lastCompleteAt;
 broken=true;
 const failed=await run('daily');
 assert.equal(failed.status,200);assert.equal(failed.body.complete,false);
 assert.equal(failed.body.failures,1);
 assert.equal(db.cursor!.cadenceStates.daily.pending[0],entry);
 assert.equal(db.cursor!.cadenceStates.weekly.lastCompleteAt,weeklyComplete);
 assert.equal(db.cursor!.cadenceStates.daily.lastStatus,'failed');
 assert.match(db.scopeError??'',/daily/);
 broken=false;
 const recovered=await run('daily');
 assert.equal(recovered.status,200);assert.equal(recovered.body.complete,true);
 assert.equal(recovered.body.failures,0);
 assert.equal(db.cursor!.cadenceStates.daily.pending.length,0);
 assert.equal(db.cursor!.cadenceStates.daily.lastStatus,'succeeded');
 assert.equal(db.cursor!.cadenceStates.weekly.lastCompleteAt,weeklyComplete);
 assert.equal(db.scopeError,null);
 assert.equal(db.observations.has(pdf),true);
 // PDF failure must not advance checkpoint or produce a run.
 const before=JSON.stringify(db.cursor), count=db.runs.length;
 brokenPdf=true;
 const badPdf=await run('daily');
 assert.equal(badPdf.status,422);
 assert.equal(JSON.stringify(db.cursor),before);
 assert.equal(db.runs.length,count);
 brokenPdf=false;
 // Transaction error must not write cursor or run.
 conflict=true;
 const concurrency=await run('daily');
 assert.equal(concurrency.status,502);
 assert.equal(JSON.stringify(db.cursor),before);
 assert.equal(db.runs.length,count);
 assert.deepEqual(db.runs.map(x=>x.status),['succeeded','succeeded','failed','succeeded']);
 console.log('RIS Edge HTTP/SQL fault-injection and recovery: OK');
}
void main().catch(e=>{console.error(e);process.exitCode=1});
