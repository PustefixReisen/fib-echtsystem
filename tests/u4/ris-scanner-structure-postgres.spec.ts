import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import pg from 'pg';
import {webcrypto} from 'node:crypto';
const connection=process.env.U4_TEST_DATABASE_URL;if(!connection)throw Error('U4_TEST_DATABASE_URL required');
const target=new URL(connection);if(!['localhost','127.0.0.1'].includes(target.hostname)||target.pathname!=='/fib_u4_test')throw Error('isolated_test_database_required');
const pool=new pg.Pool({connectionString:connection});
const origin='https://buergerinfo-feldkirchen.digitalfabrix.de',entry=origin+'/do0040.asp?smcmode=32832';
const uid='22222222-2222-4222-8222-222222222222';
const jwt=['e30',Buffer.from(JSON.stringify({sub:uid,aal:'aal2'})).toString('base64url'),'signature'].join('.');
const baseHtml=readFileSync('tests/u4/fixtures/ris-1032-top-2-3.html','utf8');
let html=baseHtml,failPage=false,failPdf=false,abort=false,pdfRevision=1,enabled=true;
const sqlClient=(client:pg.Pool|pg.PoolClient):any=>({json:JSON.stringify,unsafe:async(q:string,p:any[]=[]) => (await client.query(q,p)).rows,end:async()=>{},begin:async(fn:any)=>{const c=await pool.connect();try{await c.query('begin');await c.query('set local role fib_runtime');const r=await fn(sqlClient(c));if(abort)throw Error('injected_abort');await c.query('commit');return r;}catch(e){await c.query('rollback');throw e;}finally{c.release();}}});
const fetchMock=async(url:string)=>{
 if(url.endsWith('/auth/v1/user'))return Response.json({id:uid});
 if(url===entry)return new Response('<html>Dokumente mit Freigabe seit 01.01.2026 <a href="si0057.asp?__ksinr=1032">Sitzung</a><a href="getfile.asp?id=75714">Vorlage</a></html>');
 if(url===origin+'/si0057.asp?__ksinr=1032'){if(failPage)throw Error('session_outage');return new Response(html);}
 if(url.startsWith(origin+'/getfile.asp?id=')){if(failPdf)throw Error('pdf_outage');return new Response('%PDF-1.4\nsynthetic '+url+' revision '+pdfRevision);}
 throw Error('unexpected fetch '+url);
};
const source=(readFileSync('supabase/functions/_shared/ris-structure.ts','utf8').replace(/\bexport /g,'')+'\n'+readFileSync('supabase/functions/fib-u4-ris-pilot/index.ts','utf8'))
 .replace(/^import postgres from .*;\s*/m,'const postgres=globalThis.__postgres;\n')
 .replace(/^import .*from ['"](?:npm:unpdf|\.\.\/_shared\/ris-structure)[^\n]+$/gm,'')
 .replace(/export default[\s\S]*$/,'').replace(/export async function /g,'async function ')+ '\nglobalThis.handler=handleRis;';
const context:any={__postgres:()=>sqlClient(pool),extractText:async()=>({text:'synthetic PDF text for fault-injection only'}),Deno:{env:{get:(k:string)=>k==='FIB_RIS_STRUCTURE_ENABLED'?(enabled?'true':'false'):({SUPABASE_URL:'https://auth.invalid',SUPABASE_ANON_KEY:'test',FIB_DATABASE_URL:'isolated'} as any)[k]}},fetch:fetchMock,crypto:webcrypto,Response,Request,URL,AbortSignal,TextEncoder,TextDecoder,Uint8Array,Date,console,atob};
vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText,context);
async function invoke(){const response=await context.handler(new Request('https://test.invalid',{method:'POST',headers:{authorization:'Bearer '+jwt,'content-type':'application/json'},body:JSON.stringify({commit:true})}));return {status:response.status,body:await response.json()};}
const first=async(q:string,p:any[]=[]) => (await pool.query(q,p)).rows[0];
async function main(){
 // Previous test established the actual core schema, runtime grants, migration and fixtures.
 for(const f of ['20261030132000_u4_ris_scan_cursors.sql','20261030134000_u4_ris_cursor_runtime_rls.sql','20261030163000_fib_ris_source_run_cadence.sql'])await pool.query(readFileSync('supabase/migrations/'+f,'utf8'));
 await pool.query("update fib.app_users set role='admin' where user_id=$1",[uid]);
 const sourceId=(await first('select id from fib.sources limit 1')).id;
 const scope=(await first("insert into fib.source_scopes(source_id,scope_key,scope_label,entry_url,access_method) values($1,'ris-dokumentliste','RIS',$2,'ris') returning id",[sourceId,entry])).id;
 const cursor=async()=>JSON.stringify((await first('select cursor_state from fib.ris_scan_cursors where scope_id=$1',[scope]))?.cursor_state??null);
 const revisions=async()=>Number((await first('select count(*) from fib.ris_session_versions')).count);
 const initial=await revisions();
 failPage=true;assert.equal((await invoke()).status,502);assert.equal(await cursor(),'null');assert.equal(await revisions(),initial);failPage=false;
 abort=true;assert.equal((await invoke()).status,502);assert.equal(await cursor(),'null');assert.equal(await revisions(),initial);abort=false;
 const ok=await invoke();assert.equal(ok.status,200,JSON.stringify(ok));assert.equal(ok.body.structureSessions,1);assert.equal(ok.body.complete,true);
 assert.equal(await revisions(),initial+1);
 const session=(await first('select id from fib.ris_sessions where source_url=$1',[origin+'/si0057.asp?__ksinr=1032'])).id;
 assert.equal((await first('select count(*) from fib.ris_agenda_items where session_id=$1',[session])).count,'2');
 const before=await cursor();failPdf=true;assert.equal((await invoke()).status,422);assert.equal(await cursor(),before);failPdf=false;
 await invoke();assert.equal(await revisions(),initial+1);
 // Same known session is revisited even when release listing itself stays unchanged.
 html=baseHtml.replace('</body>','<a href="getfile.asp?id=99999">Niederschrift öffentlich</a></body>');
 pdfRevision=2;const changed=await invoke();assert.equal(changed.status,200,JSON.stringify(changed));assert.ok(changed.body.pdfChanged>0);
 assert.equal(await revisions(),initial+2);
 const late=await first("select l.status,l.kind,d.latest_version_id from fib.ris_document_links l join fib.ris_documents d on d.id=l.document_id where l.session_id=$1 and d.source_url=$2",[session,origin+'/getfile.asp?id=99999']);
 assert.equal(late.status,'candidate');assert.equal(late.kind,'minutes');assert.ok(late.latest_version_id);
 // No inferred decision/event/message from late minutes publication.
 assert.equal((await first('select count(*) from fib.ris_decision_points p join fib.ris_agenda_items a on a.id=p.agenda_id where a.session_id=$1',[session])).count,'0');
 assert.equal((await first('select count(*) from fib.messages')).count,'0');
 // Feature off retains the old scanner behavior without touching structure.
 enabled=false;const count=await revisions();await invoke();assert.equal(await revisions(),count);
 console.log('Actual RIS handler + actual migration: active feature, atomic snapshots/checkpoints, PDF failure, rollback, repeat, late publication, runtime role and disabled feature passed');
}
main().finally(()=>pool.end()).catch(e=>{console.error(e);process.exitCode=1;});
