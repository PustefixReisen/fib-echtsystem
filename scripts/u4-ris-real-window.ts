import {scanRisReleaseWindows} from '../packages/fachservices/src/u4-ris-window-scan.js';
const url='https://buergerinfo-feldkirchen.digitalfabrix.de/do0040.asp?smcmode=32832';
async function main(){
const maxWindows=8;
const result=await scanRisReleaseWindows(url,async u=>{
 const response=await fetch(u,{signal:AbortSignal.timeout(15000),headers:{'User-Agent':'FIB-U4-Test/0.1'}});
 return {ok:response.ok,status:response.status,text:()=>response.text()};
},maxWindows);
console.log(JSON.stringify({fetched:result.fetchedUrls.length,documents:result.documents.length,failures:result.failures,limited:result.limited,complete:result.complete,visited:result.fetchedUrls}));
if(result.failures.length)process.exitCode=1;
if(result.limited)console.log('COVERAGE_INCOMPLETE: further RIS date windows remain; no successful historical completeness checkpoint');

}
void main().catch(e=>{console.error(e);process.exitCode=1});
