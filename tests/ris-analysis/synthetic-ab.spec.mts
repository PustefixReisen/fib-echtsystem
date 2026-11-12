/**
 * Isolated, deterministic comparison of existing metadata-only analysis (A)
 * with the SAME analyzer given fictional, locally supplied proposal text (B).
 * No real PDFs, database, network, secrets, or external model calls.
 */
import assert from 'node:assert/strict';
import {analyzeRis,type AnalysisInput,type AnalysisDocument} from '../../supabase/functions/_shared/ris-analysis.ts';

const ris='https://example.invalid/fictional-ris';
const cases=[
 {number:2,date:'2026-10-15',title:'Errichtung einer Hundewiese auf dem Grundstück Fl.Nr. 630, östlich des Friedhofs',
  text:'FIKTIVER TESTTEXT: Die AFK wird erwähnt. Ein Schallschutzgutachten wurde vorgelegt und ein alternativer Standort geprüft.',
  gold:['subject:dog_area','reference_object:parcel:630','place:Friedhof','organization:AFK',
    'matter:acoustic_study','matter:alternative_location']},
 {number:6,date:'2026-10-15',title:'Voranfrage Rechenzentrum auf Flst.-Nr. 597/5 und 598/2; Änderung Bebauungsplan Nr. 112',
  text:'FIKTIVER TESTTEXT: Der Gemeinderat diskutiert eine Kostenbeteiligung des Investors. Zwei getrennte Beschlüsse sind erforderlich.',
  gold:['subject:data_center','subject:land_use','reference_object:parcel:597/5',
    'reference_object:parcel:598/2','organization:Gemeinderat','matter:investor_cost_sharing']},
 {number:2,date:'2026-10-29',title:'Wegfall des Elternbeitragszuschusses in Höhe von 100 €',
  text:'FIKTIVER TESTTEXT: Das BayKiBiG wird als Rechtsrahmen genannt. Diese Modellgemeinde heißt Feldkirchen. Die Förderung entfällt für Eltern.',
  gold:['subject:childcare','reference_object:BayKiBiG','place:Feldkirchen','matter:subsidy_effect']},
 {number:3,date:'2026-10-29',title:'Beitragsanpassung der Kindertageseinrichtungen zum 01.01.2027',
  text:'FIKTIVER TESTTEXT: Die Gemeinde Feldkirchen prüft den Finanzierungsrahmen des BayKiBiG. Die monatlichen Beiträge steigen im Beispielszenario.',
  gold:['subject:childcare','organization:Gemeinde Feldkirchen','reference_object:BayKiBiG','matter:concrete_fee_increase']},
] as const;

const doc:AnalysisDocument={id:'synthetic',version_id:'synthetic-1',content_hash:'0'.repeat(64),
  source_url:ris+'/synthetic-proposal',finding_id:null,kind:'proposal',
  content_author:'licensed',rights_evidence:'fictional in-memory test material'};
let hitsA=0,hitsB=0,total=0;
for(const c of cases) {
 const input:AnalysisInput={
  refreshKey:null,documentPolicy:[],agenda:{id:c.date+'-'+c.number,session_id:c.date,
   number:String(c.number),title:c.title,source_url:ris,treatment_status:'unknown',
   observed_treatment:null,event_id:'fictional-event',session_date:c.date},
  numbers:[2,3,6],documents:[doc],votes:[],targets:[],peerAgendas:[],
 };
 const a=analyzeRis(input,[],[{documentId:doc.id,versionId:doc.version_id,sha256:doc.content_hash,status:'metadata_only'}]);
 const b=analyzeRis(input,[{document:doc,pages:[c.text]}],[]);
 const found=(product:typeof a)=>new Set(product.insights.map(i=>i.kind+':'+i.value));
 const fa=found(a),fb=found(b);
 const ha=c.gold.filter(x=>fa.has(x)).length,hb=c.gold.filter(x=>fb.has(x)).length;
 assert.ok(hb>=ha,'Document text cannot reduce coverage in this fixed fixture');
 assert.equal(a.quality.analyzedDocuments,0);
 assert.equal(b.quality.analyzedDocuments,1);
 assert.ok(b.sources.length===1 && b.sources[0].source_url===doc.source_url);
 assert.equal(JSON.stringify(b).includes('FIKTIVER TESTTEXT'),false,'No raw text is persisted in derived result');
 assert.ok(b.insights.every(i=>i.evidence.length>0),'Derived insights require source evidence');
 assert.equal(b.insights.some(i=>i.value.includes('investor_cost_sharing')),false,
  'Unknown semantics must not be fabricated as structured insight');
 console.log(JSON.stringify({case:c.date+' TOP '+c.number,gold:c.gold.length,A:ha,B:hb,
  gain:hb-ha,missingInB:c.gold.filter(x=>!fb.has(x))}));
 hitsA+=ha;hitsB+=hb;total+=c.gold.length;
}
assert.equal(total,20);
assert.equal(hitsA,9);
assert.equal(hitsB,15);
console.log(JSON.stringify({type:'synthetic_AB',cases:4,gold:total,
 metadataHits:hitsA,documentHits:hitsB,metadataRecall:hitsA/total,
 documentRecall:hitsB/total,documentDelta:hitsB-hitsA,
 warning:'Synthetic lexical coverage only; no real-world precision, legal clearance, or AI comparison'}));
