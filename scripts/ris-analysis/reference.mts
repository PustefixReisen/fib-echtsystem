import {extractText} from 'unpdf';
import {parseRisStructure,risHash} from '../../supabase/functions/_shared/ris-structure.ts';
import {fetchRisOriginal} from '../../supabase/functions/_shared/ris-originals.ts';
import {parseRisTopVotes} from '../../supabase/functions/_shared/ris-top-votes.ts';
import {analyzeRis,type AnalysisInput,type AnalysisDocument} from '../../supabase/functions/_shared/ris-analysis.ts';
// Explicitly selected public originals are read transiently for this reference exercise.
// No originals, document passages, provider calls or database writes are performed.
if(!process.argv.includes('--public-source-reference'))throw Error('Use --public-source-reference for the selected live read-only reference exercise');
const origin='https://buergerinfo-feldkirchen.digitalfabrix.de';
const cache=new Map<string,Promise<{hash:string;pages:string[]}>>();
async function readPdf(url:string) {
 if(!cache.has(url))cache.set(url,(async()=>{
  const {bytes,hash}=await fetchRisOriginal(url);
  try {return {hash,pages:(await extractText(bytes.slice(),{mergePages:false})).text};}
  finally {bytes.fill(0);}
 })());
 return cache.get(url)!;
}
const results=[];
for(const session of [{id:'1031',tops:[2,6]},{id:'1032',tops:[2,3]}]) {
 const url=origin+'/si0057.asp?__ksinr='+session.id;
 const r=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(20000)});
 if(!r.ok)throw Error('Reference session unavailable');
 const html=await r.text();
 const snapshot=await parseRisStructure(html,url,new Date().toISOString());
 const minutes=snapshot.documents.find(d=>d.kind==='minutes');
 const parsedVotes=minutes?parseRisTopVotes((await readPdf(minutes.url)).pages.join('\n'),snapshot.agenda.map(a=>Number(a.number))):[];
 for(const number of session.tops) {
  const top=snapshot.agenda.find(a=>Number(a.number)===number);
  if(!top)throw Error('Reference TOP missing');
  const sources=[...top.documents,...(minutes?[minutes]:[])];
  const documents:Array<{document:AnalysisDocument;pages:string[]}>=[];
  for(const hint of sources) {
   const pdf=await readPdf(hint.url);
   documents.push({document:{id:hint.url,version_id:'observed-sha256:'+pdf.hash,content_hash:pdf.hash,
    source_url:hint.url,finding_id:null,kind:hint.kind,content_author:null,rights_evidence:null},pages:pdf.pages});
  }
  const input:AnalysisInput={refreshKey:null,documentPolicy:['proposal','minutes'],agenda:{id:top.key,session_id:session.id,number:String(number),title:top.title,
   source_url:url,treatment_status:'unknown',observed_treatment:top.observedTreatment??null,event_id:'reference-only',session_date:snapshot.date??''},
   documents:documents.map(d=>d.document),numbers:snapshot.agenda.map(a=>Number(a.number)),
   votes:(parsedVotes.find(v=>v.topNumber===number)?.votes??[]).map((vote,index)=>({vote_index:index+1,result:vote.result,
    yes_count:vote.yes,no_count:vote.no,abstention_count:vote.abstention,source_document_url:minutes!.url,
    source_sha256:documents.find(d=>d.document.kind==='minutes')!.document.content_hash!})),
   targets:[{id:'probe-dog',kind:'process',title:'Hundewiese'},{id:'probe-childcare',kind:'topic',title:'Kita-Finanzierung'},
    {id:'probe-center',kind:'process',title:'Rechenzentrum und Bauleitplanung'}]};
  const analysis=analyzeRis(input,documents,[]);
  results.push({session:snapshot.reference,top:number,scope:'live public source reference with illustrative target catalogue',
   subjects:analysis.insights.filter(i=>i.kind==='subject').map(i=>i.value),
   references:analysis.insights.filter(i=>['reference_object','place','organization'].includes(i.kind)).map(i=>({kind:i.kind,value:i.value})),
   votes:input.votes.map(v=>({index:v.vote_index,result:v.result,yes:v.yes_count,no:v.no_count})),
   relations:analysis.relations.map(v=>v.targetId),coverage:analysis.coverage,
   documents:analysis.sources.map(d=>({url:d.source_url,sha256:d.content_hash}))});
 }
}
console.log(JSON.stringify({generatedAt:new Date().toISOString(),method:'rules',paidCalls:0,results},null,2));
cache.clear();
