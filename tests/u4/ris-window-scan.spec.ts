import assert from 'node:assert/strict';
import {scanRisReleaseWindows,scanRisReleaseBatch} from '../../packages/fachservices/src/u4-ris-window-scan.js';
const origin='https://buergerinfo-feldkirchen.digitalfabrix.de/do0040.asp';
const a=origin+'?smcmode=32832',b=origin+'?smcadat=2461314&smcmode=32832';
const pages=new Map([[a,'<html><a href="do0040.asp?smcadat=2461314&amp;smcmode=32832">older</a><a href="getfile.asp?id=1">one</a></html>'],
[b,'<html><a href="getfile.asp?id=1">one</a><a href="getfile.asp?id=2">two</a></html>']]);
const get=async(url:string)=>({ok:pages.has(url),status:pages.has(url)?200:404,text:async()=>pages.get(url)??''});
async function main(){
 const full=await scanRisReleaseWindows(a,get,2);
 assert.equal(full.complete,true);assert.equal(full.documents.length,2);assert.equal(full.fetchedUrls.length,2);
 const budget=await scanRisReleaseWindows(a,get,1);
 assert.equal(budget.complete,false);assert.equal(budget.limited,true);
 const failed=await scanRisReleaseWindows(a,async url=>url===b?{ok:false,status:503,text:async()=>''}:get(url),2);
 assert.equal(failed.complete,false);assert.equal(failed.failures.length,1);
 const first=await scanRisReleaseBatch(a,get,1);
 assert.equal(first.complete,false); assert.equal(first.cursor.pending.length,1);
 const second=await scanRisReleaseBatch(a,get,1,first.cursor);
 assert.equal(second.complete,true); assert.equal(second.cursor.documents.length,2);
 let rejected=false;
 try{await scanRisReleaseBatch(a,get,1,{pending:['https://evil.invalid/do0040.asp'],visited:[],documents:[],failures:[]})}catch{rejected=true}
 assert.equal(rejected,true);
 const outage=await scanRisReleaseBatch(a,async url=>url===b?{ok:false,status:503,text:async()=>''}:get(url),2);
 assert.equal(outage.complete,false); assert.equal(outage.cursor.pending.includes(b),true);
 const recovered=await scanRisReleaseBatch(a,get,2,outage.cursor);
 assert.equal(recovered.complete,true);assert.equal(recovered.cursor.failures.length,0);
 console.log('U4 RIS bounded release coverage tests passed');
}
void main().catch(e=>{console.error(e);process.exitCode=1});
