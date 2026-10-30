import assert from 'node:assert/strict';
import {fingerprintRisPdf} from '../../packages/fachservices/src/u4-ris-pdf-fingerprint.js';
import {createHash} from 'node:crypto';
const url='https://buergerinfo-feldkirchen.digitalfabrix.de/getfile.asp?id=123&type=do';
function response(contents:string){return {ok:true,status:200,headers:{get:(_name:string)=>'application/pdf'},arrayBuffer:async()=>new TextEncoder().encode(contents).buffer};}
async function main(){
 const a=await fingerprintRisPdf(url,async()=>response('%PDF-a'));
 const b=await fingerprintRisPdf(url,async()=>response('%PDF-b'));
 assert.notEqual(a,b,'Changes at the same URL must be detected');
 assert.equal(a,createHash('sha256').update('%PDF-a').digest('hex'));
 await assert.rejects(()=>fingerprintRisPdf(url,async()=>response('<html>error</html>')),/not a PDF/);
 await assert.rejects(()=>fingerprintRisPdf('https://example.org/getfile.asp?id=123',async()=>response('%PDF-a')),/Unexpected RIS/);
 console.log('RIS PDF byte fingerprints and same URL changes passed');
}
void main().catch(e=>{console.error(e);process.exitCode=1});
