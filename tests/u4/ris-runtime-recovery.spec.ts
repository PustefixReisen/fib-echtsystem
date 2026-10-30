import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';

// Exercise the *actual* pure policy functions embedded in the deployed Edge source.
// This cannot replace a fault-injection integration test of database transactions.
const edge=readFileSync('supabase/functions/fib-u4-ris-pilot/index.ts','utf8');
const start=edge.indexOf('function coverage(');
const end=edge.indexOf('export default {async fetch(',start);
assert.ok(start>=0&&end>start,'RIS runtime policy source found');
const js=ts.transpileModule(edge.slice(start,end),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
const context=vm.createContext({Date,Set,Object,Math});
vm.runInContext(js,context);
const coverage=context.coverage as (v:unknown[],visited:string[],pending:string[],failures:unknown[],cadence:string)=>{coverageStatus:string};
const dueStatus=context.dueStatus as (states:Record<string,unknown>,now:Date)=>Array<{cadence:string;due:boolean;reason:string}>;

const views=[{url:'https://example.invalid/view',releaseSince:'2020-01-02',checkedAt:'2026-10-30T16:49:00Z'}];
const visited=[views[0].url];
assert.equal(coverage(views,visited,[],[],'weekly').coverageStatus,'candidate');
assert.equal(coverage(views,visited,[],[],'daily').coverageStatus,'candidate');
assert.equal(coverage(views,visited,['retry'],[],'daily').coverageStatus,'in_progress');
assert.equal(coverage(views,visited,['retry'],[{url:'retry',error:'timeout'}],'daily').coverageStatus,'failed');
assert.equal(coverage([{...views[0],releaseSince:null}],visited,[],[],'weekly').coverageStatus,'unverified');
assert.equal(coverage([{...views[0],releaseSince:'2099-10-25'}],visited,[],[],'weekly').coverageStatus,'insufficient');
const base={
 daily:{lastCompleteAt:'2026-10-30T16:49:07Z',pending:[],failures:[]},
 weekly:{lastCompleteAt:'2026-10-30T16:49:21Z',pending:[],failures:[]}
};
function due(states:Record<string,unknown>,day:string){return dueStatus(states,new Date(day+'T12:00:00Z'));}
assert.equal(due(base,'2026-10-30')[0].due,false);
assert.equal(due(base,'2026-10-31')[0].reason,'due');
assert.equal(due(base,'2026-11-06')[1].reason,'due');
const interruption={...base,daily:{...base.daily,pending:['https://example.invalid/retry'],failures:[{error:'timeout'}]}};
assert.equal(due(interruption,'2026-10-30')[0].reason,'recovery_needed');
assert.equal(due(interruption,'2026-10-30')[1].reason,'not_due');
const recovered={...base,daily:{...base.daily,pending:[],failures:[]}};
assert.equal(due(recovered,'2026-10-30')[0].reason,'not_due');
assert.equal(due(recovered,'2026-10-30')[1].reason,'not_due');

// Source-level transaction guardrails: these assertions deliberately do not
// pretend that a simulated database commit was exercised.
assert.match(edge,/pending\.push\(u\);break;/);
assert.match(edge,/if\(\(latest\.length\?JSON\.stringify\(latest\[0\]\.cursor_state\):null\)!==previousSerialized\)throw new Error\('cursor_changed_retry'\)/);
assert.match(edge,/await sql\.begin\(async tx=>/);
assert.match(edge,/if\(payload\.commit!==true\)return reply\(\{mode:'dry_run'/);
assert.match(edge,/catch\(e\)\{return reply\(\{error:'ris_pdf_check_failed'/);
console.log('RIS runtime recovery/due/coverage policy regression checks passed; live fault-injection remains pending');
