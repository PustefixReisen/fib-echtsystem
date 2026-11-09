/**
 * Read-only publicly accessible official RIS agenda comparison.
 * CI must never import a public index into FIB or confuse it with an
 * authenticated Supabase Edge health check.
 */
import {readFileSync} from "node:fs";
import {parseRisStructure} from "../supabase/functions/_shared/ris-structure.ts";
const reference = JSON.parse(readFileSync(
  "tests/u4/fixtures/ris-1031-public-agenda-indexed-20261109.json","utf8",
));
const url="https://buergerinfo-feldkirchen.digitalfabrix.de/si0057.asp?__ksinr=1031&smcmode=32832";
async function main(){
const controller=new AbortController();
const timeout=setTimeout(()=>controller.abort(),15000);
let failure="";
try{
  const response=await fetch(url,{signal:controller.signal,headers:{
    Accept:"text/html,application/xhtml+xml",
    "User-Agent":"FIB-U4-RIS-Pilot/0.1 (read-only public agenda verification)",
  }});
  const html=await response.text();
  if(!response.ok||!response.headers.get("content-type")?.toLowerCase().includes("html")||
     html.length>1_500_000)throw Error("RIS invalid HTTP status/content type/length");
  const parsed=await parseRisStructure(html,url,new Date().toISOString());
  const observed=new Set(parsed.agenda.map(a=>String(a.number)));
  const expected=reference.agenda.map((a:{number:string})=>a.number);
  const missing=expected.filter((n:string)=>!observed.has(n));
  const unexpected=[...observed].filter(n=>!expected.includes(n));
  console.log(JSON.stringify({scope:"public_1031_html_read_only",status:response.status,
    indexedExpected:expected.length,parserObserved:parsed.agenda.length,
    uniqueObserved:observed.size,missingNumbers:missing,unexpectedNumbers:unexpected,
    coverState:"unverified_by_live_edge",noDatabaseWrites:true}));
  console.log(JSON.stringify({
    scope:"public_1031_minutes_document_metadata",
    sessionDocumentKinds:parsed.documents.map(d=>d.kind),
    sessionDocumentCount:parsed.documents.length,
    directMinutesDocuments:parsed.documents.filter(d=>d.kind==="minutes")
      .map(d=>({url:d.url,title:d.title??null})),
    topDocumentCount:parsed.agenda.reduce((sum,top)=>sum+top.documents.length,0),
    hasDirectMinutes:parsed.documents.some(d=>d.kind==="minutes"),
    noPdfDownload:true,noDatabaseWrites:true,
  }));
  if(missing.length||unexpected.length||observed.size!==expected.length){
    failure="ris_real_agenda_coverage_mismatch";
  }
}catch(e){
  failure="ris_real_agenda_probe_failed";
  console.error(JSON.stringify({scope:"public_1031_html_read_only",error:String(e).slice(0,220)}));
}finally{clearTimeout(timeout)}
// Compare with the canonical URL used by the production scanner. This is
// diagnostic: the browser-mode page is the established real-source baseline.
try{
  const plainUrl=url.replace("&smcmode=32832","");
  const controller2=new AbortController();
  const timer2=setTimeout(()=>controller2.abort(),15000);
  try{
    const response2=await fetch(plainUrl,{signal:controller2.signal,headers:{
      Accept:"text/html,application/xhtml+xml",
      "User-Agent":"FIB-U4-RIS-Pilot/0.1 (read-only public agenda verification)",
    }});
    const text2=await response2.text();
    let plainObserved:number|null=null;
    let parseError:string|null=null;
    if(response2.ok && text2.length<=1_500_000){
      try{plainObserved=(await parseRisStructure(text2,plainUrl,new Date().toISOString())).agenda.length;}
      catch(e){parseError=String(e).slice(0,120);}
    }
    console.log(JSON.stringify({scope:"public_1031_canonical_url_comparison",
      status:response2.status,parserObserved:plainObserved,parseError,
      differsFromBrowserMode:plainObserved!==19,noDatabaseWrites:true}));
  }finally{clearTimeout(timer2)}
}catch(e){
  console.log(JSON.stringify({scope:"public_1031_canonical_url_comparison",
    error:String(e).slice(0,160),noDatabaseWrites:true}));
}
if(failure) {console.error(failure); process.exitCode=1;}

}
void main().catch(err=>{console.error(err);process.exitCode=1;});
