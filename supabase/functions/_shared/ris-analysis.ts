import { risHash } from './ris-structure.ts';
import { splitRisMinutesByAgenda } from './ris-minutes-candidates.ts';

export const RIS_ANALYZER_VERSION = 'rules-1';
export type Evidence = {
  kind: 'agenda' | 'document' | 'vote';
  url: string;
  documentId?: string;
  versionId?: string;
  sha256?: string;
  page?: number;
  topNumber?: number;
  start?: number;
  end?: number;
};
export type Insight = {
  kind: 'subject' | 'place' | 'reference_object' | 'organization' | 'matter' | 'treatment' | 'vote';
  value: string;
  certainty: 'source' | 'derived';
  rule: string;
  evidence: Evidence[];
};
export type AnalysisDocument = {
  id: string; version_id: string | null; content_hash: string | null;
  source_url: string; finding_id: string | null; kind: string;
  content_author: string | null; rights_evidence: string | null;
};
export type Target = { id: string; kind: 'process' | 'topic'; title: string };
export type AnalysisInput = {
  documentPolicy: string[];
  refreshKey: string | null;
  agenda: {id:string; session_id:string; number:string; title:string; source_url:string;
    treatment_status:string; observed_treatment:string|null; event_id:string; session_date:string};
  numbers: number[];
  documents: AnalysisDocument[];
  votes: Array<{vote_index:number;result:string;yes_count:number|null;no_count:number|null;
    abstention_count:number|null;source_document_url:string;source_sha256:string}>;
  targets: Target[];
};
export type DocumentCoverage = {documentId:string;versionId:string|null;sha256:string|null;
  status:'analyzed'|'metadata_only'|'rights_unverified'|'segmentation_unavailable'|'resource_limit'};
export type AnalysisResult = {
  generated: true; method:'rules'; label:string; insights:Insight[];
  relations:Array<{targetId:string;targetKind:Target['kind'];status:'candidate';subjects:string[];evidence:Evidence[]}>;
  quality:{documentCount:number;analyzedDocuments:number;importedFacts:number;derivedInsights:number};
  sources:Array<Pick<AnalysisDocument,'id'|'version_id'|'content_hash'|'source_url'|'finding_id'|'kind'>>; coverage:DocumentCoverage[]; limitations:string[];
};
/** Operator-approved temporary processing classes. This grants no storage rights. */
export function analysisDocumentPolicy(enabled:boolean, approvedClasses=''):string[] {
  if(!enabled)return [];
  const classes=approvedClasses.split(',').map(value=>value.trim()).filter(Boolean);
  if(classes.some(value=>!['proposal','minutes'].includes(value)))throw Error('invalid_document_class');
  return ['verified-rights',...new Set(classes)].sort();
}
const subjects = [
  {code:'dog_area', terms:['hundewiese','hundeauslauf'], matter:'proposed_dog_area'},
  {code:'data_center', terms:['rechenzentrum','rechenzentrums'], matter:'data_center_planning'},
  {code:'childcare', terms:['kindertageseinrichtung','kita','elternbeitragszuschuss','baykibig'], matter:'childcare_financing'},
  {code:'mobility', terms:['verkehr','radweg','parkraum','b471','a94','a99'], matter:'transport_planning'},
  {code:'land_use', terms:['bebauungsplan','flächennutzung','bauleitplanung'], matter:'land_use_planning'},
] as const;
const normalized = (text:string) => text.normalize('NFKC').toLocaleLowerCase('de-DE');
function termMatch(text:string, term:string) {
  // Compound German words match at the beginning, short names must be whole tokens.
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  return new RegExp('(?:^|[^\\p{L}\\p{N}])'+escaped+(term.length<=5?'(?=$|[^\\p{L}\\p{N}])':''),'iu').test(text);
}
export async function analysisFingerprint(input:AnalysisInput) {
  return risHash(new TextEncoder().encode(JSON.stringify({version:RIS_ANALYZER_VERSION,input})));
}
/** Bounded, source-located vocabulary extraction. Source passages never leave this call. */
export function analyzeRis(input:AnalysisInput,
  documents: Array<{document:AnalysisDocument;pages:string[]}>,
  coverage:DocumentCoverage[],
):AnalysisResult {
  const insights: Insight[] = [];
  const add = (kind:Insight['kind'],value:string,rule:string,evidence:Evidence,certainty:Insight['certainty']='derived') => {
    const existing = insights.find(i=>i.kind===kind && i.value===value && i.rule===rule);
    if(existing) { if(!existing.evidence.some(e=>JSON.stringify(e)===JSON.stringify(evidence)))existing.evidence.push(evidence); }
    else insights.push({kind,value,rule,certainty,evidence:[evidence]});
  };
  const classify = (text:string, evidence:Evidence) => {
    const lower = normalized(text);
    for(const subject of subjects) if(subject.terms.some(term=>termMatch(lower,term))) {
      add('subject',subject.code,'subject-v1',evidence);
      add('matter',subject.matter,'matter-v1',evidence);
    }
    for(const place of ['Feldkirchen','Friedhof','Hohenlindner Straße','Aschheimer Straße'])
      if(termMatch(lower,normalized(place))) add('place',place,'place-v1',evidence);
    for(const object of ['B471','A94','A99','BayKiBiG'])
      if(termMatch(lower,normalized(object)))add('reference_object',object,'reference-v1',evidence);
    for(const match of text.matchAll(/(?:Fl\.?\s*(?:Nr\.?|st\.?)[-.\s]*(?:Nr\.?[-.\s]*)?|Flurstück\s+)(\d+(?:\/\d+)?(?:\s*(?:,|und)\s*\d+(?:\/\d+)?){0,8})/giu))
      for(const parcel of match[1].match(/\d+(?:\/\d+)?/g)??[])
        add('reference_object','parcel:'+parcel,'parcel-v1',evidence);
    for(const org of ['Gemeinde Feldkirchen','Gemeinderat','AFK','CSU','BÜNDNIS 90/DIE GRÜNEN'])
      if(termMatch(lower,normalized(org)))add('organization',org,'organization-v1',evidence);
  };
  const agendaEvidence:Evidence = {kind:'agenda',url:input.agenda.source_url,topNumber:Number(input.agenda.number)};
  classify(input.agenda.title,agendaEvidence);
  add('treatment',input.agenda.observed_treatment ?? input.agenda.treatment_status,
    'imported-treatment-v1',agendaEvidence,'source');
  const currentVotes=input.votes.filter(vote=>!input.documents.some(d=>d.source_url===vote.source_document_url &&
    d.content_hash && d.content_hash!==vote.source_sha256));
  for(const vote of currentVotes) add('vote',JSON.stringify({index:vote.vote_index,result:vote.result,
    yes:vote.yes_count,no:vote.no_count,abstention:vote.abstention_count}),
    'imported-vote-v1',{kind:'vote',url:vote.source_document_url,sha256:vote.source_sha256},'source');
  const limitations = ['Automatically generated. Subject, matter, entity and relationship matches are derived, not official confirmation.',
    'Fixed vocabulary. Unrecognized places, organizations and semantic relations may be missing.'];
  if(currentVotes.length!==input.votes.length)limitations.push('Imported votes refer to a superseded document fingerprint and are not asserted as current.');
  for(const {document,pages} of documents) {
    if(document.kind==='minutes') {
      // Never assign another TOP's discussions to the current TOP.
      const text = pages.join('\n');
      const split = splitRisMinutesByAgenda(text,input.numbers);
      const section = split.ok ? split.sections.find(s=>s.topNumber===Number(input.agenda.number)) : undefined;
      if(!section) {
        coverage.push({documentId:document.id,versionId:document.version_id,sha256:document.content_hash,status:'segmentation_unavailable'});
        continue;
      }
      const offset = text.indexOf(section.transientText);
      classify(section.transientText,{kind:'document',url:document.source_url,documentId:document.id,
        ...(document.version_id?{versionId:document.version_id}:{}),sha256:document.content_hash!,topNumber:Number(input.agenda.number),
        ...(offset>=0?{start:offset,end:offset+section.transientText.length}:{})});
    } else {
      pages.forEach((text,index)=>classify(text,{kind:'document',url:document.source_url,
        documentId:document.id,...(document.version_id?{versionId:document.version_id}:{}),sha256:document.content_hash!,page:index+1}));
    }
    coverage.push({documentId:document.id,versionId:document.version_id,sha256:document.content_hash,status:'analyzed'});
  }
  const foundSubjects = insights.filter(i=>i.kind==='subject');
  const relations:AnalysisResult['relations'] = [];
  for(const target of input.targets) {
    const targetSubjects = subjects.filter(subject=>subject.terms.some(term=>termMatch(normalized(target.title),term)));
    // A named project must match its specific subject, not just generic planning.
    const specific = targetSubjects.filter(s=>!['mobility','land_use'].includes(s.code));
    const codes = (specific.length?specific:targetSubjects).map(s=>s.code)
      .filter(code=>foundSubjects.some(i=>i.value===code));
    if(codes.length) relations.push({targetId:target.id,targetKind:target.kind,status:'candidate',subjects:codes,
      evidence:foundSubjects.filter(i=>codes.includes(i.value as typeof codes[number])).flatMap(i=>i.evidence)});
  }
  return {generated:true,method:'rules',label:'Automatisch erzeugte RIS-Erkenntnisse',insights,relations,
    quality:{documentCount:input.documents.length,analyzedDocuments:coverage.filter(d=>d.status==='analyzed').length,
      importedFacts:insights.filter(i=>i.certainty==='source').length,derivedInsights:insights.filter(i=>i.certainty==='derived').length},
    sources:input.documents.map(d=>documents.find(item=>item.document.id===d.id)?.document??d)
      .map(({id,version_id,content_hash,source_url,finding_id,kind})=>
      ({id,version_id,content_hash,source_url,finding_id,kind})),coverage,limitations};
}

/** Optional extension contract. No provider is installed or called in this release. */
export type RisAnalysisEnricher = (input:{insights:Insight[];transientText:string})=>Promise<Insight[]>;
export const risAnalysisAiPolicy = Object.freeze({provider:'Mistral',enabled:false,budgetEur:5,
  prerequisites:['explicit operator approval','DPA and processing rights','atomic budget reservation',
    'validated structured response','idempotent billing/retry policy']});
