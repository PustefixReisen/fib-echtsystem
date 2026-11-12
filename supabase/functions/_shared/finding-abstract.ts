/**
 * Shared FIB finding abstract contract; independent of RIS, providers and storage.
 * Validates untrusted model outputs before they can become internal derived data.
 * Does NOT invoke a model, read source texts, persist or approve publication.
 */
import { risHash } from './ris-structure.ts';

export const ABSTRACT_CONTRACT_VERSION='finding-abstract-v1';
export type FindingKind='ris'|'press'|'municipality'|'other';
export type EvidenceAnchor={url:string;versionId:string;page?:number;top?:number};
export type AbstractClaim={kind:'fact'|'inference';statement:string;certainty:'supported'|'uncertain';
  evidence:EvidenceAnchor[]};
export type AbstractRelation={targetKind:'event'|'process'|'topic'|'finding';
  targetId:string;status:'candidate';reason:string;evidence:EvidenceAnchor[]};
export type AbstractContext={findingId:string;findingVersionId:string;fingerprint:string;
  sourceUrl:string;sourceKind:FindingKind;model:string;modelVersion:string;schemaVersion:string;
  permitted:boolean;scopeTop?:number};
export type ValidatedFindingAbstract={
  contractVersion:typeof ABSTRACT_CONTRACT_VERSION;findingId:string;findingVersionId:string;
  fingerprint:string;sourceKind:FindingKind;method:'rules'|'model';model:string;modelVersion:string;
  schemaVersion:string;summary:string;claims:AbstractClaim[];relations:AbstractRelation[];
  limitations:string[];status:'derived_unreviewed';
};
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const sha=/^[a-f0-9]{64}$/;
const object=(x:unknown):x is Record<string,unknown>=>x!==null && typeof x==='object' && !Array.isArray(x);
function str(x:unknown,min=1,max=1200):string{
  if(typeof x!=='string'||x.trim().length<min||x.length>max)throw Error('invalid_abstract');
  return x.trim();
}
function arr(x:unknown,max:number):unknown[]{
  if(!Array.isArray(x)||x.length>max)throw Error('invalid_abstract');
  return x;
}
function id(x:unknown):string{const s=str(x,1,36);if(!uuid.test(s))throw Error('invalid_abstract');return s;}
function anchor(x:unknown,context:AbstractContext):EvidenceAnchor{
  if(!object(x))throw Error('invalid_abstract');
  // No invented sources or cross-TOP references in a source-local abstract.
  if(x.url!==context.sourceUrl||x.versionId!==context.findingVersionId)
    throw Error('unverified_abstract_evidence');
  const a:EvidenceAnchor={url:context.sourceUrl,versionId:context.findingVersionId};
  if(x.page!==undefined){
    if(!Number.isSafeInteger(x.page)||Number(x.page)<1||Number(x.page)>400)
      throw Error('invalid_abstract');a.page=Number(x.page);
  }
  if(x.top!==undefined){
    if(!Number.isSafeInteger(x.top)||Number(x.top)<1||Number(x.top)>500)
      throw Error('invalid_abstract');
    if(context.scopeTop===undefined||x.top!==context.scopeTop)
      throw Error('unverified_abstract_evidence');
    a.top=Number(x.top);
  }
  if(context.scopeTop!==undefined&&a.top!==context.scopeTop)throw Error('unverified_abstract_evidence');
  return a;
}
function evidence(x:unknown,context:AbstractContext):EvidenceAnchor[]{
  const a=arr(x,8);if(!a.length)throw Error('unverified_abstract_evidence');
  return a.map(y=>anchor(y,context));
}
export function validateFindingAbstract(context:AbstractContext,raw:unknown):ValidatedFindingAbstract{
  if(!context.permitted)throw Error('abstract_processing_not_authorized');
  id(context.findingId);id(context.findingVersionId);
  if(!sha.test(context.fingerprint))throw Error('invalid_abstract_context');
  str(context.model,1,80);str(context.modelVersion,1,80);str(context.schemaVersion,1,80);
  try{if(!['https:','http:'].includes(new URL(context.sourceUrl).protocol))throw Error('invalid');}
  catch{throw Error('invalid_abstract_context');}
  if(!object(raw))throw Error('invalid_abstract');
  // Reject raw source material, hidden payload fields, and model-supplied status.
  const expected=['summary','claims','relations','limitations'];
  if(Object.keys(raw).some(k=>!expected.includes(k)) || expected.some(k=>!(k in raw)))
    throw Error('invalid_abstract');
  const summary=str(raw.summary,1,1200);
  const claims=arr(raw.claims,24).map(x=>{
    if(!object(x)||!['fact','inference'].includes(String(x.kind))||
       !['supported','uncertain'].includes(String(x.certainty))||
       Object.keys(x).some(k=>!['kind','statement','certainty','evidence'].includes(k)))
       throw Error('invalid_abstract');
    return {kind:x.kind as AbstractClaim['kind'],statement:str(x.statement),
      certainty:x.certainty as AbstractClaim['certainty'],evidence:evidence(x.evidence,context)};
  });
  const relations=arr(raw.relations,20).map(x=>{
    if(!object(x)||!['event','process','topic','finding'].includes(String(x.targetKind))||
      Object.keys(x).some(k=>!['targetKind','targetId','status','reason','evidence'].includes(k))||
      x.status!=='candidate')throw Error('invalid_abstract');
    return {targetKind:x.targetKind as AbstractRelation['targetKind'],targetId:id(x.targetId),
      status:'candidate' as const,reason:str(x.reason,1,500),evidence:evidence(x.evidence,context)};
  });
  const limitations=arr(raw.limitations,12).map(x=>str(x,1,300));
  return {contractVersion:ABSTRACT_CONTRACT_VERSION,findingId:context.findingId,
    findingVersionId:context.findingVersionId,fingerprint:context.fingerprint,
    sourceKind:context.sourceKind,method:context.model==='rules'?'rules':'model',
    model:context.model,modelVersion:context.modelVersion,schemaVersion:context.schemaVersion,
    summary,claims,relations,limitations,status:'derived_unreviewed'};
}
/** Canonical repeat-key: changes to source, model or schema yield a different key. */
export async function findingAbstractKey(context:AbstractContext):Promise<string>{
  return risHash(new TextEncoder().encode(JSON.stringify({
    contract:ABSTRACT_CONTRACT_VERSION,findingVersionId:context.findingVersionId,
    fingerprint:context.fingerprint,sourceKind:context.sourceKind,scopeTop:context.scopeTop??null,
    model:context.model,modelVersion:context.modelVersion,schemaVersion:context.schemaVersion
  })));
}
