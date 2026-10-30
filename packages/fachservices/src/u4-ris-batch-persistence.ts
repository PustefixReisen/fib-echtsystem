import {createHash} from 'node:crypto';
import type {U4Sql} from './u4-source-monitor-sql.js';
import {SqlRisScanCursorStorage} from './u4-ris-cursor-sql.js';
import {scanRisReleaseBatch,type RisWindowFetch} from './u4-ris-window-scan.js';

/** A bounded RIS batch with atomic cursor, document observations and run log.
 * Historical completeness is never inferred from a finite batch.
 */
export async function persistRisReleaseBatch(input:{
 db:U4Sql;scopeId:string;entryUrl:string;fetchPage:RisWindowFetch;maxWindows:number;
}):Promise<{complete:boolean;processed:number;documentCount:number;newCount:number}>{
 const {db,scopeId,entryUrl,fetchPage,maxWindows}=input;
 const store=new SqlRisScanCursorStorage(db);
 const previous=await store.read(scopeId);
 const result=await scanRisReleaseBatch(entryUrl,fetchPage,maxWindows,previous);
 const prior=new Set(previous?.documents??[]);
 const fresh=result.cursor.documents.filter(u=>!prior.has(u));
 const now=new Date().toISOString();
 await db.transaction(async tx=>{
  // Serialise scope commits so a cursor and its observations cannot diverge.
  const scope=await tx.queryOne<{id:string}>('select id from fib.source_scopes where id=$1 and status=$2 for update',[scopeId,'candidate']);
  if(!scope)throw new Error('RIS scope unavailable for pilot');
  for(const url of fresh){
   const id='ris:'+url;
   const fingerprint=createHash('sha256').update(url).digest('hex');
   await tx.queryOne('insert into fib.source_observations (scope_id,external_id,canonical_url,content_fingerprint,first_seen_at,last_seen_at,revision) values ($1,$2,$3,$4,$5,$5,1) on conflict (scope_id,external_id) do update set last_seen_at=excluded.last_seen_at returning external_id',[scopeId,id,url,fingerprint,now]);
  }
  await store.save(scopeId,result.cursor,tx);
  const status=result.complete?'succeeded':'failed';
  const reason=result.complete?null:result.cursor.failures.length?'RIS window fetch error':'RIS backfill pending';
  await tx.queryOne('insert into fib.source_runs(scope_id,started_at,completed_at,status,items_seen,items_new,items_changed,error_detail) values($1,now(),now(),$2,$3,$4,0,$5) returning id',[scopeId,status,result.cursor.documents.length,fresh.length,reason]);
  await tx.queryOne('update fib.source_scopes set last_attempt_at=$2,last_success_at=case when $3 then $2 else last_success_at end,gap_since=case when $3 then null else coalesce(gap_since,$2) end,last_error=$4,updated_at=now() where id=$1 returning id',[scopeId,now,result.complete,reason]);
 });
 return {complete:result.complete,processed:result.processed,documentCount:result.cursor.documents.length,newCount:fresh.length};
}
