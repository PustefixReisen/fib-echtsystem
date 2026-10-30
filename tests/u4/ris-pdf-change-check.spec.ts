import assert from 'node:assert/strict';
import {checkRisPdfChanges} from '../../packages/fachservices/src/u4-ris-pdf-change-check.js';
const url='https://buergerinfo-feldkirchen.digitalfabrix.de/getfile.asp?id=1';
const fetcher=(body:string)=>async()=>({ok:true,status:200,headers:{get:()=> 'application/pdf'},arrayBuffer:async()=>new TextEncoder().encode(body).buffer});
async function main(){
 const first=await checkRisPdfChanges([url,url],new Map(),fetcher('%PDF-a'));
 assert.equal(first.length,1);assert.equal(first[0].kind,'new');
 const prior=new Map([[url,{url,fingerprint:first[0].fingerprint,revision:1}]]);
 const same=await checkRisPdfChanges([url],prior,fetcher('%PDF-a'));
 assert.equal(same[0].kind,'unchanged');assert.equal(same[0].revision,1);
 const changed=await checkRisPdfChanges([url],prior,fetcher('%PDF-b'));
 assert.equal(changed[0].kind,'changed');assert.equal(changed[0].revision,2);
 await assert.rejects(()=>checkRisPdfChanges([url],prior,fetcher('<html>failed</html>')));
 console.log('RIS PDF change classifier passed');
}
void main().catch(e=>{console.error(e);process.exitCode=1});
