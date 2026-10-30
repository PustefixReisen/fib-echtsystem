import assert from 'node:assert/strict';
import {SqlU4SourceMonitorStorage} from '../../packages/fachservices/src/u4-source-monitor-sql.js';

const calls:{sql:string;params:readonly unknown[]}[]=[];
const fake={
  async queryOne<T>(sql:string,params:readonly unknown[]):Promise<T|null>{
    calls.push({sql,params});
    if(sql.includes('from fib.source_scopes')) return {id:'scope',last_success_at:null,last_attempt_at:null,gap_since:null,last_error:null} as T;
    if(sql.includes('from fib.source_observations')) return null;
    if(sql.includes('returning external_id')) return {external_id:params[1]} as T;
    if(sql.includes('returning id')) return {id:'ok'} as T;
    return null;
  },
};
const store=new SqlU4SourceMonitorStorage(fake);
assert.equal((await store.getCheckpoint('scope')).lastSuccessAt,undefined);
assert.equal(await store.getObservation('scope','entry'),undefined);
await store.saveObservation({scopeId:'scope',externalId:'entry',url:'https://example.org/a',fingerprint:'abc',firstSeenAt:'2026-10-30T08:00:00Z',lastSeenAt:'2026-10-30T08:00:00Z',revision:1});
await store.saveCheckpoint({scopeId:'scope',lastAttemptAt:'2026-10-30T08:01:00Z',gapSince:'2026-10-29T22:00:00Z',lastError:'timeout'});
await store.logRun({scopeId:'scope',status:'failed',seen:1,newCount:1,changedCount:0,error:'timeout'});
assert.equal(calls.length,5);
assert.ok(calls.every(c=>c.sql.includes('$1')));
assert.ok(calls.some(c=>c.sql.includes('on conflict(scope_id,external_id)')));
console.log('U4 SQL adapter contract checks passed');
