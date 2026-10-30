import assert from 'node:assert/strict';
import {persistRisReleaseBatch} from '../../packages/fachservices/src/u4-ris-batch-persistence.js';
const entry='https://buergerinfo-feldkirchen.digitalfabrix.de/do0040.asp?smcmode=32832';
const older='https://buergerinfo-feldkirchen.digitalfabrix.de/do0040.asp?smcadat=2461314&smcmode=32832';
const pages=new Map([[entry,'<html><a href="do0040.asp?smcadat=2461314&amp;smcmode=32832">Older</a><a href="getfile.asp?id=1">PDF1</a></html>'],[older,'<html><a href="getfile.asp?id=1">PDF1</a><a href="getfile.asp?id=2">PDF2</a></html>']]);
let state:any=undefined;
let observationWrites=0;
const statuses:string[]=[];
const db={
 async queryOne<T>(sql:string):Promise<T|null>{
  if(sql.includes('from fib.ris_scan_cursors'))return state?{cursor_state:state} as T:null;
  throw new Error('outside transaction '+sql);
 },
 async transaction<T>(work:(tx:{queryOne<X>(sql:string,p:readonly unknown[]):Promise<X|null>})=>Promise<T>):Promise<T>{
  return work({async queryOne<X>(sql:string,p:readonly unknown[]):Promise<X|null>{
   if(sql.includes('source_scopes where'))return {id:'scope'} as X;
   if(sql.includes('source_observations'))observationWrites++;
   if(sql.includes('ris_scan_cursors'))state=JSON.parse(String(p[1]));
   if(sql.includes('source_runs'))statuses.push(String(p[1]));
   return {id:'ok',scope_id:'scope',external_id:'ok'} as X;
  }});
 }
};
async function main(){
 const fetchPage=async(url:string)=>({ok:pages.has(url),status:pages.has(url)?200:404,text:async()=>pages.get(url)??''});
 const first=await persistRisReleaseBatch({db,scopeId:'scope',entryUrl:entry,fetchPage,maxWindows:1});
 assert.equal(first.complete,false);assert.equal(first.newCount,1);assert.equal(state.pending.length,1);
 const second=await persistRisReleaseBatch({db,scopeId:'scope',entryUrl:entry,fetchPage,maxWindows:1});
 assert.equal(second.complete,true);assert.equal(second.newCount,1);assert.equal(observationWrites,2);
 assert.deepEqual(statuses,['failed','succeeded']);
 console.log('U4 RIS atomic batch persistence tests passed');
}
void main().catch(e=>{console.error(e);process.exitCode=1});
