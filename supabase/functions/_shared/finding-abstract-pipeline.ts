/**
 * Provider-independent, fail-closed abstract pipeline.
 * No model, network client, scheduler, or document fetcher is embedded here.
 * The caller supplies an independently audited rights gate, transient text
 * reader, an abstract generator, and an authorized transactional persistence.
 */
import {validateFindingAbstract,type AbstractContext,type ValidatedFindingAbstract} from './finding-abstract.ts';
import {appendFindingAbstract,readCurrentFindingAbstract,
  type AbstractAuthorization,type AbstractRepositoryInput} from './finding-abstract-storage.ts';
import {type RisSql} from './ris-structure.ts';

export type TextSegment={text:string;page:number;top?:number};
export type TransientFindingText={fingerprint:string;segments:TextSegment[]};
export type PipelineRights=AbstractAuthorization;
export type AbstractGenerator=(input:{
  context:AbstractRepositoryInput;segments:ReadonlyArray<Readonly<TextSegment>>
})=>Promise<unknown>;
export type AbstractPipeline={rights:PipelineRights;
  load:(identity:AbstractRepositoryInput)=>Promise<TransientFindingText>;
  generate:AbstractGenerator;
  transaction:<T>(run:(tx:RisSql)=>Promise<T>)=>Promise<T>};
export type AbstractOutcome={kind:'cached'|'created';id?:string;result:ValidatedFindingAbstract};

/** No operator permission or rights approval can be sourced from model output. */
export async function processFindingAbstract(
 context:AbstractRepositoryInput,pipeline:AbstractPipeline
):Promise<AbstractOutcome>{
 // Before ANY retrieval/processing: independently check source-specific rights.
 const identity={findingId:context.findingId,
   findingVersionId:context.findingVersionId,sourceKind:context.sourceKind};
 if(!await pipeline.rights(identity))throw Error('abstract_processing_not_authorized');
 // Avoid repeated document retrieval or provider invocation on identical inputs.
 const cached=await pipeline.transaction(tx=>readCurrentFindingAbstract(tx,context,pipeline.rights));
 if(cached)return {kind:'cached',result:cached};
 const loaded=await pipeline.load(context);
 if(!loaded||loaded.fingerprint!==context.fingerprint)throw Error('abstract_source_changed');
 if(!Array.isArray(loaded.segments)||loaded.segments.length<1||loaded.segments.length>200)
   throw Error('abstract_invalid_segments');
 // Tight source bounds; refuse mixed TOP scope instead of guessing segmentation.
 let size=0;
 const segments=loaded.segments.map(segment=>{
   if(!Number.isInteger(segment.page)||segment.page<1||segment.page>400||
      typeof segment.text!=='string')throw Error('abstract_invalid_segments');
   if(context.scopeTop!==undefined && segment.top!==context.scopeTop)
     throw Error('abstract_top_scope_unverified');
   if(context.scopeTop===undefined && segment.top!==undefined)
     throw Error('abstract_top_scope_unverified');
   size+=segment.text.length;
   if(segment.text.length<1||segment.text.length>12000||size>160000)
     throw Error('abstract_resource_limit');
   return Object.freeze({text:segment.text,page:segment.page,
     ...(segment.top!==undefined?{top:segment.top}:{})});
 });
 // The generator may be an offline rule adapter or a separately approved model.
 // It cannot influence either rights evaluation or source identity.
 const candidate=await pipeline.generate({context,segments:Object.freeze(segments)});
 const validated=validateFindingAbstract({...context,permitted:true},candidate);
 // Schema-valid URLs alone do not prove that a cited page/TOP was loaded.
 // Reject hallucinated page numbers before writing any derived artifact.
 const cited=[...validated.claims.flatMap(c=>c.evidence),
   ...validated.relations.flatMap(r=>r.evidence)];
 for(const cite of cited){
   if(cite.page===undefined || !segments.some(segment=>
      segment.page===cite.page &&
      (context.scopeTop===undefined?cite.top===undefined:segment.top===cite.top)))
     throw Error('abstract_evidence_not_in_loaded_segments');
 }
 // Re-evaluate authorization at persistence; the repository verifies that
 // the original revision is still current before an immutable insert.
 const stored=await pipeline.transaction(tx=>appendFindingAbstract(
   tx,context,candidate,pipeline.rights));
 return {kind:stored.existing?'cached':'created',id:stored.id,result:stored.result};
}

/**
 * Minimal zero-network deterministic demonstration adapter: explicit evidence,
 * no inferred facts, no links, and no external AI provider. For synthetic
 * fixtures only: callers MUST NOT use this as an approved production model.
 */
export const syntheticExtractiveGenerator:AbstractGenerator=async({context,segments})=>{
 if(!context.sourceUrl.startsWith('https://example.invalid/'))
   throw Error('synthetic_source_required');
 const first=segments[0];
 const text=first.text.replace(/\s+/g,' ').trim();
 // Extractive preview, no invented relationship/decision; avoid full-text copy.
 const sentence=(text.match(/^.{1,260}?(?:[.!?](?=\s|$)|$)/u)?.[0]??text.slice(0,260)).trim();
 const anchor={url:context.sourceUrl,versionId:context.findingVersionId,
   page:first.page,...(first.top!==undefined?{top:first.top}:{})};
 return {summary:sentence,
   claims:[{kind:'fact',statement:sentence,certainty:'supported',evidence:[anchor]}],
   relations:[],limitations:['Synthetischer extraktiver Funktionstest; keine semantische KI-Analyse.']};
};
