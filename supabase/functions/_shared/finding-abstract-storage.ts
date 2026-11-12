/**
 * Append-only derived abstract repository. Caller must independently verify
 * legal permission for this exact source/version. No provider or PDF access.
 */
import {validateFindingAbstract,findingAbstractKey,
 type AbstractContext,type ValidatedFindingAbstract} from './finding-abstract.ts';
import {type RisSql} from './ris-structure.ts';

export type AbstractAuthorization=(identity:{
  findingId:string;findingVersionId:string;sourceKind:AbstractContext['sourceKind']
})=>Promise<boolean>;
export type AbstractRepositoryInput=Omit<AbstractContext,'permitted'>;
export async function appendFindingAbstract(
 tx:RisSql, context:AbstractRepositoryInput, candidate:unknown,
 authorize:AbstractAuthorization
):Promise<{id:string;existing:boolean;result:ValidatedFindingAbstract}>{
 // The callback must implement the source-specific rights/data protection gate,
 // independently from any untrusted model output.
 const permitted=await authorize({
   findingId:context.findingId,findingVersionId:context.findingVersionId,
   sourceKind:context.sourceKind
 });
 if(!permitted)throw Error('abstract_processing_not_authorized');
 const [current]=await tx.unsafe(`select v.id,v.finding_id,v.fingerprint,v.original_url
   from fib.finding_versions v where v.id=$1 and v.finding_id=$2
     and v.revision=(select max(latest.revision) from fib.finding_versions latest
       where latest.finding_id=v.finding_id)
   for share`,[context.findingVersionId,context.findingId]);
 if(!current)throw Error('abstract_source_not_current');
 if(current.fingerprint!==context.fingerprint||current.original_url!==context.sourceUrl)
   throw Error('abstract_source_changed');
 const valid=validateFindingAbstract({...context,permitted:true},candidate);
 const key=await findingAbstractKey({...context,permitted:true});
 const [inserted]=await tx.unsafe(`insert into fib.finding_abstract_versions(
   finding_id,finding_version_id,input_hash,source_fingerprint,
   source_kind,scope_top,contract_version,model,model_version,schema_version,result)
   values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb)
   on conflict do nothing returning id`,
   [context.findingId,context.findingVersionId,key,context.fingerprint,
     context.sourceKind,context.scopeTop??null,valid.contractVersion,
     context.model,context.modelVersion,context.schemaVersion,JSON.stringify(valid)]);
 if(inserted)return {id:inserted.id,existing:false,result:valid};
 const [row]=await tx.unsafe(`select id,result from fib.finding_abstract_versions
    where finding_version_id=$1 and input_hash=$2
      and scope_top is not distinct from $3::integer`,
    [context.findingVersionId,key,context.scopeTop??null]);
 if(!row)throw Error('abstract_concurrent_retry');
 return {id:row.id,existing:true,result:row.result as ValidatedFindingAbstract};
}
export async function readCurrentFindingAbstract(tx:RisSql,context:AbstractRepositoryInput,
  authorize:AbstractAuthorization):Promise<ValidatedFindingAbstract|null>{
 if(!await authorize({findingId:context.findingId,findingVersionId:context.findingVersionId,
   sourceKind:context.sourceKind}))throw Error('abstract_processing_not_authorized');
 const key=await findingAbstractKey({...context,permitted:true});
 const [row]=await tx.unsafe(`select a.result from fib.finding_abstract_versions a
   join fib.finding_versions v on v.id=a.finding_version_id
   where a.finding_id=$1 and a.finding_version_id=$2
     and a.input_hash=$3 and a.scope_top is not distinct from $4::integer
     and v.fingerprint=$5 and v.original_url=$6
     and v.revision=(select max(latest.revision) from fib.finding_versions latest
       where latest.finding_id=v.finding_id)
   limit 1`,[context.findingId,context.findingVersionId,key,context.scopeTop??null,
       context.fingerprint,context.sourceUrl]);
 return row?.result??null;
}
