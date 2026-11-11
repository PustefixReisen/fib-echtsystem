import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {analyzeRis,analysisFingerprint,risAnalysisAiPolicy,type AnalysisInput} from '../../supabase/functions/_shared/ris-analysis.ts';
import {notifyRisAnalysis} from '../../supabase/functions/_shared/ris-analysis-notify.ts';
const indexed=JSON.parse(readFileSync('tests/u4/fixtures/ris-1031-public-agenda-indexed-20261109.json','utf8'));
const url=indexed.source_url;
export function inputFor(number:number):AnalysisInput {
  return {refreshKey:null,documentPolicy:[],agenda:{id:'a',session_id:'s',number:String(number),
    title:indexed.agenda.find((a:any)=>a.number===String(number)).title,source_url:url,
    treatment_status:number===2?'withdrawn':'treated',observed_treatment:null,event_id:'e',session_date:indexed.date},
    numbers:[1,2,3,4,5,6],documents:[],votes:[],targets:[
      {id:'p1',kind:'process',title:'Hundewiese in Feldkirchen'},
      {id:'t1',kind:'topic',title:'Kita-Finanzierung'},
      {id:'t2',kind:'topic',title:'Rechenzentrum und Bauleitplanung'},
    ]};
}
const dog=analyzeRis(inputFor(2),[],[]);
assert.ok(dog.insights.some(i=>i.value==='dog_area'));
assert.ok(dog.insights.some(i=>i.value==='parcel:630'));
assert.ok(dog.insights.some(i=>i.value==='Friedhof'));
assert.deepEqual(dog.relations.map(r=>r.targetId),['p1']);
assert.ok(dog.relations.every(r=>r.status==='candidate'));
const centerInput=inputFor(6);
centerInput.votes=[{vote_index:1,result:'accepted',yes_count:17,no_count:2,abstention_count:null,source_document_url:url,source_sha256:'a'.repeat(64)},
 {vote_index:2,result:'accepted',yes_count:19,no_count:0,abstention_count:null,source_document_url:url,source_sha256:'a'.repeat(64)}];
const center=analyzeRis(centerInput,[],[]);
assert.equal(center.insights.filter(i=>i.kind==='vote').length,2);
assert.ok(center.insights.some(i=>i.value==='data_center'));
assert.ok(center.insights.some(i=>i.value==='parcel:597/5'));
assert.ok(center.insights.some(i=>i.value==='parcel:598/2'));
const staleVoteInput=structuredClone(centerInput);
staleVoteInput.documents=[{id:'changed',version_id:'changed',content_hash:'c'.repeat(64),source_url:url,
  finding_id:null,kind:'minutes',content_author:null,rights_evidence:null}];
assert.equal(analyzeRis(staleVoteInput,[],[]).insights.some(i=>i.kind==='vote'),false);
const excerpts=readFileSync('tests/u4/fixtures/ris-1031-minutes-excerpts.txt','utf8').split(/\[… Ausschnitt …\]/);
const doc={id:'d',version_id:'v',content_hash:'b'.repeat(64),source_url:url,finding_id:'f',kind:'minutes',content_author:'municipality',rights_evidence:'synthetic'};
const combined=[1,2,3,4,5,6].map(n=>'TOP '+n+'\n'+(n===2?excerpts[0]:n===3?excerpts[1]:n===6?excerpts[2]:'No evidence here')).join('\n');
const dogText=analyzeRis(inputFor(2),[{document:doc,pages:[combined]}],[]);
assert.equal(dogText.insights.some(i=>i.value==='data_center'),false,'Shared minutes must not leak another TOP');
const genericPlanning=inputFor(2);genericPlanning.agenda.title+=' Bebauungsplan';
assert.deepEqual(analyzeRis(genericPlanning,[],[]).relations.map(r=>r.targetId),['p1']);
const ambiguous=analyzeRis(inputFor(2),[{document:doc,pages:['TOP 2\nRechenzentrum']}],[]);
assert.equal(ambiguous.insights.some(i=>i.value==='data_center'),false);
assert.equal(ambiguous.coverage[0].status,'segmentation_unavailable');
const childcare=inputFor(2);childcare.agenda.title='Wegfall des Elternbeitragszuschusses in Höhe von 100 Euro';
const childcare2=inputFor(3);childcare2.agenda.title='Beitragsanpassung der Kindertageseinrichtungen zum 01.01.2027';
for(const input of [childcare,childcare2]) {
 const product=analyzeRis(input,[],[]);
 assert.ok(product.insights.some(i=>i.value==='childcare'));
 assert.deepEqual(product.relations.map(r=>r.targetId),['t1']);
}
assert.notEqual(await analysisFingerprint(childcare),await analysisFingerprint(childcare2));
assert.equal(risAnalysisAiPolicy.enabled,false);
assert.equal(risAnalysisAiPolicy.budgetEur,5);
let calls=0;
await notifyRisAnalysis('https://example.invalid','x'.repeat(32),async()=>{calls++;throw Error('No analysis service');});
assert.equal(calls,1,'Analysis outage must not reject the import notification');
await notifyRisAnalysis('https://example.invalid',undefined,async()=>{throw Error('Must not call');});
console.log('PASS reference metadata: Hundewiese TOP2, Rechenzentrum TOP6 two votes, both Kita TOPs, candidate links and strict minutes scope; no AI calls');
