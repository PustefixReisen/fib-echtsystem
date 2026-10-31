import type { RisSql } from './ris-structure.ts';
// Protected master data (sources/topics/processes/users/Auth) never enter this allowlist.
export const DATASET_KEYS: Record<string,string[]> = {
 ris_minutes_approvals:['id'],ris_votes:['id'],ris_decision_versions:['id'],ris_decision_points:['id'],
 ris_proposal_texts:['id'],ris_suggestions:['id'],ris_agenda_events:['agenda_id','event_id'],
 ris_relation_suggestions:['id'],ris_review_log:['id'],ris_document_links:['id'],
 event_finding_change_log:['id'],event_finding_metadata_log:['id'],event_finding_justification_log:['id'],
 event_findings:['event_id','finding_id'],event_processes:['event_id','process_id'],event_topics:['event_id','topic_id'],
 lead_responsibilities:['object_type','object_id'],object_last_edits:['object_type','object_id'],
 finding_versions:['id'],events:['id'],findings:['id'],ris_proposals:['id'],ris_agenda_items:['id'],
 ris_session_versions:['id'],ris_document_versions:['id'],ris_documents:['id'],ris_sessions:['id'],ris_committees:['id'],
 source_observations:['scope_id','external_id'],source_scopes:['id'],
};
export const keyExpression=(table:string,alias='t')=>{
 const keys=DATASET_KEYS[table];if(!keys)throw Error('protected_dataset_table');
 return `jsonb_build_object(${keys.map(k=>`'${k}',${alias}."${k}"`).join(',')})`;
};
export const keyString=(key:Record<string,unknown>)=>JSON.stringify(Object.fromEntries(Object.entries(key).sort(([a],[b])=>a.localeCompare(b))));
export async function datasetKeys(tx:RisSql){
 const result:Record<string,Set<string>>={};
 for(const table of Object.keys(DATASET_KEYS)){
  const rows=await tx.unsafe(`select ${keyExpression(table)} k from fib."${table}" t limit 10001`);
  if(rows.length>10000)throw Error('dataset_snapshot_limit');
  result[table]=new Set(rows.map(r=>keyString(r.k)));
 }
 return result;
}
export async function registerCreatedRows(tx:RisSql,batchId:string,before:Record<string,Set<string>>){
 for(const table of Object.keys(DATASET_KEYS)){
  if(['source_scopes','ris_committees'].includes(table))continue;
  // xmin excludes rows concurrently inserted by another transaction. Before-keys exclude updates.
  const rows=await tx.unsafe(`select ${keyExpression(table)} k, to_jsonb(t)::text body from fib."${table}" t where xmin=((pg_current_xact_id()::text::numeric % 4294967296)::text::xid)`);
  for(const r of rows){
   if(before[table].has(keyString(r.k)))continue;
   const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(r.body));
   const hash=[...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('');
   await tx.unsafe(`insert into fib.development_objects(batch_id,table_name,row_key,ownership,initial_fingerprint) values($1,$2,$3::text::jsonb,'owned',$4) on conflict do nothing`,[batchId,table,JSON.stringify(r.k),hash]);
  }
 }
}
const contextTables:Record<string,string>={sessionId:'ris_sessions',agendaId:'ris_agenda_items',linkId:'ris_document_links',versionId:'ris_document_versions',findingId:'findings',eventId:'events',scopeId:'source_scopes'};
export async function withDevelopmentDataset<T>(tx:RisSql,input:Record<string,any>,work:()=>Promise<T>):Promise<T>{
 const exists=await tx.unsafe("select to_regclass('fib.development_objects') r");
 if(!exists[0]?.r)return work(); // Historical isolated component installations remain supported.
 const contexts:{table:string;key:Record<string,unknown>}[]=[];
 for(const [field,table] of Object.entries(contextTables))if(typeof input[field]==='string')contexts.push({table,key:{id:input[field]}});
 if(input.suggestionId)contexts.push({table:input.action?.includes('relation')?'ris_relation_suggestions':'ris_suggestions',key:{id:input.suggestionId}});
 if(input.scopeId&&input.externalId)contexts.push({table:'source_observations',key:{scope_id:input.scopeId,external_id:input.externalId}});
 // Ignore unused/injected fields: only context actually consumed by the given action.
 const fields:Record<string,string[]>={source_scan:['source_scopes'],
  ris_review_document:['ris_document_links','ris_document_versions'],ris_accept_finding:['ris_document_versions'],
  source_accept:['source_observations'],source_create_event:['findings'],
  ris_link_event:['ris_agenda_items','events'],ris_suggest:['ris_agenda_items','ris_document_versions'],
  ris_review_suggestion:['ris_suggestions'],source_propose_relation:['events','findings'],
  source_review_relation:['ris_relation_suggestions'],ris_propose_relation:['events'],ris_review_relation:['ris_relation_suggestions'],
  ris_review_agenda_status:['ris_agenda_items'],ris_confirm_minutes_approval:['ris_sessions'],link_finding:['events','findings']
 };
 const allowed=fields[input.action]??[];const batches=new Set<string>();
 for(const c of contexts.filter(c=>allowed.includes(c.table))){
  const rows=await tx.unsafe(`select distinct d.batch_id from fib.development_objects d join fib.development_batches b on b.id=d.batch_id where b.status='active' and d.table_name=$1 and d.row_key=$2::text::jsonb`,[c.table,JSON.stringify(c.key)]);
  rows.forEach(r=>batches.add(r.batch_id));
 }
 if(batches.size>1)throw Error('ambiguous_development_dataset');
 if(!batches.size)return work();
 const before=await datasetKeys(tx),result=await work();
 await registerCreatedRows(tx,[...batches][0],before);
 return result;
}
