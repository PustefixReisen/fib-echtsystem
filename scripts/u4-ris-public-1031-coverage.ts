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
  if(missing.length||unexpected.length||observed.size!==expected.length){
    failure="ris_real_agenda_coverage_mismatch";
  }
}catch(e){
  failure="ris_real_agenda_probe_failed";
  console.error(JSON.stringify({scope:"public_1031_html_read_only",error:String(e).slice(0,220)}));
}finally{clearTimeout(timeout)}
if(failure) {console.error(failure); process.exitCode=1;}
