import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';

const file=readFileSync('supabase/functions/fib-u4-ris-scheduled/index.ts','utf8');
const source=file.replace(/^import \{handleRis\} from .*;\s*/m,'')
 .replace('export default {async fetch(', 'globalThis.__scheduler = {async fetch(');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.None,target:ts.ScriptTarget.ES2022}}).outputText;
let hits=0;
let elapsed=0;
const FakeDate={now:()=>elapsed};
let steps:Array<{complete?:boolean;failures?:number;skipped?:string}>=[];
const ctx:any=vm.createContext({Response,Request,Number,Date:FakeDate,
 handleRis:async()=>{hits++;return Response.json(steps.shift()??{complete:false,failures:0})}});
vm.runInContext(js,ctx);
const req=(cadence='daily',commit=true,pdfBackfill=false)=>new Request('https://function.test',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({cadence,commit,pdfBackfill})});
async function main(){
 let response=await ctx.__scheduler.fetch(req('daily',false));
 assert.equal(response.status,400);assert.equal(hits,0);
 response=await ctx.__scheduler.fetch(req('daily',true,true));
 assert.equal(response.status,400);assert.equal(hits,0);
 steps=[{complete:false},{complete:false},{complete:true}];
 response=await ctx.__scheduler.fetch(req());
 assert.equal(response.status,200);assert.equal((await response.json()).batches,3);
 assert.equal(hits,3);
 hits=0;steps=[{complete:false,failures:1}];
 response=await ctx.__scheduler.fetch(req());
 assert.equal(response.status,503);assert.equal((await response.json()).error,'ris_retry_needed');
 assert.equal(hits,1);
 hits=0;steps=[{skipped:'not_due'}];
 response=await ctx.__scheduler.fetch(req('weekly'));
 assert.equal(response.status,200);assert.equal((await response.json()).batches,1);
 assert.equal(hits,1);
 hits=0;steps=[];
 response=await ctx.__scheduler.fetch(req());
 assert.equal(response.status,503);assert.equal((await response.json()).error,'ris_continuation_needed');
 assert.equal(hits,8);
 hits=0;elapsed=0;steps=[{complete:false},{complete:false}];
 // Simulate a slow first batch: the next batch must not start past budget.
 ctx.__schedulerBudgetTest=1;
 const prior=ctx.handleRis;
 ctx.handleRis=async()=>{elapsed=91000;return prior()};
 response=await ctx.__scheduler.fetch(req());
 assert.equal(response.status,503);
 const budget=await response.json();
 assert.equal(budget.error,'ris_continuation_needed');
 assert.equal(budget.reason,'runtime_budget');
 assert.equal(budget.batches,1);
 assert.equal(hits,1);
 ctx.handleRis=prior;
 console.log('RIS scheduler bounded batch continuation and retry tests passed');
}
void main().catch(e=>{console.error(e);process.exitCode=1});
