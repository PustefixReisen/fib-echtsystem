import {createHash} from 'node:crypto';
import {DATASET_KEYS,keyExpression,keyString,datasetKeys,registerCreatedRows} from '../../supabase/functions/_shared/development-datasets.ts';
export {datasetKeys,registerCreatedRows};
export const fingerprint=(v:any):string=>createHash('sha256').update(JSON.stringify(sort(v))).digest('hex');
const sort=(v:any):any=>Array.isArray(v)?v.map(sort):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,sort(v[k])])):v;
const ident=(s:string)=>'"'+s.replaceAll('"','""')+'"';
export function adapter(client:any){return {unsafe:async(q:string,p:any[]=[])=> (await client.query(q,p)).rows};}
export async function reference(tx:any,batch:string,table:string,key:any){
 if(!DATASET_KEYS[table])throw Error('protected_dataset_table');
 const r=await tx.unsafe(`select to_jsonb(t) r from fib.${ident(table)} t where ${keyExpression(table)}=$1::text::jsonb`,[JSON.stringify(key)]);
 if(r.length!==1)throw Error('dataset_reference_missing');
 await tx.unsafe("insert into fib.development_objects(batch_id,table_name,row_key,ownership,initial_fingerprint) values($1,$2,$3::text::jsonb,'reference',$4) on conflict do nothing",[batch,table,JSON.stringify(key),fingerprint(r[0].r)]);
}
export async function cleanupPlan(tx:any,batch:string){
 const b=await tx.unsafe('select id,status from fib.development_batches where id=$1',[batch]);if(b.length!==1)throw Error('dataset_missing');
 const markers=await tx.unsafe("select table_name,row_key from fib.development_objects where batch_id=$1 and ownership='owned' order by table_name,row_key::text",[batch]);
 const rows:any[]=[],missing:any[]=[];
 for(const m of markers){
  if(!DATASET_KEYS[m.table_name]||['source_scopes','ris_committees'].includes(m.table_name))throw Error('protected_dataset_table');
  const r=await tx.unsafe(`select to_jsonb(t) r from fib.${ident(m.table_name)} t where ${keyExpression(m.table_name)}=$1::text::jsonb`,[JSON.stringify(m.row_key)]);
  if(!r.length){missing.push(m);continue;}
  rows.push({...m,hash:fingerprint(r[0].r)});
 }
 const blockers:any[]=[];
 // Check every incoming FK, including CASCADE and cross-schema references, before deleting anything.
 const fks=await tx.unsafe(`select c.conname,ns.nspname child_schema,ch.relname child_table,p.relname parent_table,
 array(select a.attname from unnest(c.conkey) with ordinality k(n,i) join pg_attribute a on a.attrelid=c.conrelid and a.attnum=k.n order by k.i) child_cols,
 array(select a.attname from unnest(c.confkey) with ordinality k(n,i) join pg_attribute a on a.attrelid=c.confrelid and a.attnum=k.n order by k.i) parent_cols
 from pg_constraint c join pg_class p on p.oid=c.confrelid join pg_namespace pn on pn.oid=p.relnamespace join pg_class ch on ch.oid=c.conrelid join pg_namespace ns on ns.oid=ch.relnamespace where c.contype='f' and pn.nspname='fib'`);
 const parents=new Set(rows.map(r=>r.table_name));
 for(const fk of fks){
  if(!parents.has(fk.parent_table))continue;
  const join=fk.child_cols.map((col:string,i:number)=>`ch.${ident(col)}=p.${ident(fk.parent_cols[i])}`).join(' and ');
  const ownedChild=fk.child_schema==='fib'&&DATASET_KEYS[fk.child_table]?`and not exists(select 1 from fib.development_objects z where z.batch_id=$1 and z.ownership='owned' and z.table_name=$3 and z.row_key=${keyExpression(fk.child_table,'ch')})`:'';
  const params=ownedChild?[batch,fk.parent_table,fk.child_table]:[batch,fk.parent_table];
  const n=await tx.unsafe(`select count(*)::int n from ${ident(fk.child_schema)}.${ident(fk.child_table)} ch join fib.${ident(fk.parent_table)} p on ${join} where exists(select 1 from fib.development_objects d where d.batch_id=$1 and d.ownership='owned' and d.table_name=$2 and d.row_key=${keyExpression(fk.parent_table,'p')}) ${ownedChild}`,params);
  if(n[0].n)blockers.push({constraint:fk.conname,table:fk.child_schema+'.'+fk.child_table,count:n[0].n});
 }
 const plan={batch,status:b[0].status,rows,missing,blockers};return {...plan,sha256:fingerprint(plan)};
}
export async function cleanup(tx:any,batch:string,expectedHash:string){
 // Caller must own one transaction; no destructive down-migration and no CASCADE.
 await tx.unsafe("set local lock_timeout='5s'");
 for(const table of Object.keys(DATASET_KEYS))await tx.unsafe(`lock table fib.${ident(table)} in access exclusive mode`);
 await tx.unsafe('lock table fib.development_batches,fib.development_objects in access exclusive mode');
 const plan=await cleanupPlan(tx,batch);
 if(plan.sha256!==expectedHash)throw Error('stale_cleanup_plan');
 if(plan.status!=='closed')throw Error('close_dataset_before_cleanup');
 if(plan.blockers.length)throw Error('unmarked_reference_blocks_cleanup');
 // Break only the owned document/version cycle; all original data rows remain unchanged.
 await tx.unsafe(`update fib.ris_documents t set latest_version_id=null where exists(select 1 from fib.development_objects d where d.batch_id=$1 and d.ownership='owned' and d.table_name='ris_documents' and d.row_key=${keyExpression('ris_documents')})`,[batch]);
 const order=Object.keys(DATASET_KEYS).filter(t=>t!=='events'&&t!=='findings');order.push('events','findings');
 for(const table of order){
  if(['source_scopes','ris_committees'].includes(table))continue;
  for(const r of plan.rows.filter((r:any)=>r.table_name===table))await tx.unsafe(`delete from fib.${ident(table)} t where ${keyExpression(table)}=$1::text::jsonb`,[JSON.stringify(r.row_key)]);
 }
 await tx.unsafe("update fib.development_batches set status='purged' where id=$1",[batch]);
 return {removed:plan.rows.length,retainedReferences:true};
}
