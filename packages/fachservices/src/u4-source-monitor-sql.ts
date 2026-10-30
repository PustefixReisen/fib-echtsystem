import type { SourceCheckpoint, SourceObservation } from '../../domain-contracts/src/source-monitor.js';
import type { U4SourceMonitorStorage } from './u4-source-monitor-run.js';

export interface U4Sql {
  queryOne<T>(sql:string, params:readonly unknown[]):Promise<T|null>;
  transaction<T>(work:(tx:Pick<U4Sql,'queryOne'>)=>Promise<T>):Promise<T>;
}
type ScopeRow={id:string;last_success_at:string|null;last_attempt_at:string|null;gap_since:string|null;last_error:string|null};
type ObservationRow={scope_id:string;external_id:string;canonical_url:string;content_fingerprint:string;first_seen_at:string;last_seen_at:string;revision:number};

/** Parameterized SQL repository for the isolated fib schema; caller supplies fib_runtime connection. */
export class SqlU4SourceMonitorStorage implements U4SourceMonitorStorage {
  constructor(private readonly db:U4Sql) {}
  async getCheckpoint(scopeId:string):Promise<SourceCheckpoint>{
    const row=await this.db.queryOne<ScopeRow>(
      'select id,last_success_at,last_attempt_at,gap_since,last_error from fib.source_scopes where id=$1',[scopeId]);
    if(!row) throw new Error('Unknown scope: '+scopeId);
    return {scopeId,lastSuccessAt:row.last_success_at??undefined,lastAttemptAt:row.last_attempt_at??undefined,
      gapSince:row.gap_since??undefined,lastError:row.last_error??undefined};
  }
  async getObservation(scopeId:string,externalId:string):Promise<SourceObservation|undefined>{
    const row=await this.db.queryOne<ObservationRow>(
      'select scope_id,external_id,canonical_url,content_fingerprint,first_seen_at,last_seen_at,revision from fib.source_observations where scope_id=$1 and external_id=$2',
      [scopeId,externalId]);
    return row?{scopeId:row.scope_id,externalId:row.external_id,url:row.canonical_url,fingerprint:row.content_fingerprint,
      firstSeenAt:row.first_seen_at,lastSeenAt:row.last_seen_at,revision:row.revision}:undefined;
  }
  private async saveObservation(o:SourceObservation,db:Pick<U4Sql,'queryOne'>):Promise<void>{
    const row=await db.queryOne<{external_id:string}>(`
      insert into fib.source_observations(scope_id,external_id,canonical_url,content_fingerprint,first_seen_at,last_seen_at,revision)
      values ($1,$2,$3,$4,$5,$6,$7)
      on conflict(scope_id,external_id) do update set
        canonical_url=excluded.canonical_url,content_fingerprint=excluded.content_fingerprint,
        last_seen_at=excluded.last_seen_at,revision=excluded.revision
      returning external_id`,
      [o.scopeId,o.externalId,o.url,o.fingerprint,o.firstSeenAt,o.lastSeenAt,o.revision]);
    if(!row)throw new Error('Failed to save observation');
  }
  private async saveCheckpoint(c:SourceCheckpoint,db:Pick<U4Sql,'queryOne'>):Promise<void>{
    const row=await db.queryOne<{id:string}>(`
      update fib.source_scopes set last_success_at=$2,last_attempt_at=$3,gap_since=$4,last_error=$5,updated_at=now()
      where id=$1 returning id`,
      [c.scopeId,c.lastSuccessAt??null,c.lastAttemptAt??null,c.gapSince??null,c.lastError??null]);
    if(!row)throw new Error('Failed to save checkpoint');
  }
  private async logRun(r:{scopeId:string;status:'succeeded'|'failed';seen:number;newCount:number;changedCount:number;error?:string},db:Pick<U4Sql,'queryOne'>):Promise<void>{
    const row=await db.queryOne<{id:string}>(`
      insert into fib.source_runs(scope_id,started_at,completed_at,status,items_seen,items_new,items_changed,error_detail)
      values ($1,now(),now(),$2,$3,$4,$5,$6) returning id`,
      [r.scopeId,r.status,r.seen,r.newCount,r.changedCount,r.error??null]);
    if(!row)throw new Error('Failed to log source run');
  }
  async commitSuccess(input:{observations:SourceObservation[];checkpoint:SourceCheckpoint;result:{scopeId:string;seen:number;newCount:number;changedCount:number}}):Promise<void>{
    await this.db.transaction(async tx=>{
      for(const observation of input.observations)await this.saveObservation(observation,tx);
      await this.logRun({...input.result,status:'succeeded'},tx);
      await this.saveCheckpoint(input.checkpoint,tx);
    });
  }
  async commitFailure(input:{checkpoint:SourceCheckpoint;result:{scopeId:string;seen:number;newCount:number;changedCount:number;error?:string}}):Promise<void>{
    await this.db.transaction(async tx=>{
      await this.logRun({...input.result,status:'failed'},tx);
      await this.saveCheckpoint(input.checkpoint,tx);
    });
  }
}
