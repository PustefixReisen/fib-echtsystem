import assert from 'node:assert/strict';
import pg from 'pg';
import {SqlU4SourceMonitorStorage} from '../../packages/fachservices/src/u4-source-monitor-sql.js';
import {runSourceMonitor} from '../../packages/fachservices/src/u4-source-monitor-run.js';
const pool=new pg.Pool({connectionString:process.env.U4_TEST_DATABASE_URL});
async function main(){
  await pool.query('create schema if not exists fib');
  await pool.query('create table fib.source_scopes(id uuid primary key,last_success_at timestamptz,last_attempt_at timestamptz,gap_since timestamptz,last_error text,updated_at timestamptz)');
  await pool.query('create table fib.source_observations(scope_id uuid,external_id text,canonical_url text,content_fingerprint text,first_seen_at timestamptz,last_seen_at timestamptz,revision integer,primary key(scope_id,external_id))');
  await pool.query('create table fib.source_runs(id uuid default gen_random_uuid(),scope_id uuid,started_at timestamptz,completed_at timestamptz,status text,items_seen integer,items_new integer,items_changed integer,error_detail text)');
  const scopeId='33333333-3333-4333-8333-333333333333';
  await pool.query('insert into fib.source_scopes(id) values ($1)',[scopeId]);
  const db={
    async queryOne<T>(sql:string,params:readonly unknown[]):Promise<T|null>{const r=await pool.query(sql,[...params]);return (r.rows[0] as T|undefined)??null},
    async transaction<T>(work:(tx:{queryOne<R>(sql:string,params:readonly unknown[]):Promise<R|null>})=>Promise<T>):Promise<T>{
      const client=await pool.connect();
      try{await client.query('begin');const tx={queryOne:async<R>(sql:string,params:readonly unknown[])=>{const r=await client.query(sql,[...params]);return (r.rows[0] as R|undefined)??null}};
        const x=await work(tx);await client.query('commit');return x}
      catch(e){await client.query('rollback');throw e}finally{client.release()}
    }
  };
  const store=new SqlU4SourceMonitorStorage(db);
  const target={key:'feldkirchen-news' as const,url:'https://www.feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen',origin:'https://www.feldkirchen.de'};
  const url=target.url+'/demo';
  let body='<html><body>first</body></html>',outage=false;
  const http=async(u:string)=>{
    if(outage&&u===url)throw Error('simulated outage');
    return {ok:true,status:200,text:async()=>u===target.url?'<html><a href="'+url+'">demo</a></html>':body};
  };
  const a=await runSourceMonitor(target,scopeId,http,store,'2026-10-30T09:00:00Z');
  assert.equal(a.newCount,1);
  const b=await runSourceMonitor(target,scopeId,http,store,'2026-10-30T09:05:00Z');
  assert.equal(b.newCount,0);assert.equal(b.changedCount,0);
  outage=true;
  const c=await runSourceMonitor(target,scopeId,http,store,'2026-10-30T09:10:00Z');
  assert.equal(c.success,false);
  const prior=await pool.query('select last_success_at,gap_since from fib.source_scopes where id=$1',[scopeId]);
  assert.ok(prior.rows[0].gap_since);assert.equal(prior.rows[0].last_success_at.toISOString(),'2026-10-30T09:05:00.000Z');
  outage=false;body='<html><body>changed</body></html>';
  const d=await runSourceMonitor(target,scopeId,http,store,'2026-10-30T09:15:00Z');
  assert.equal(d.changedCount,1);
  const result=await pool.query('select revision from fib.source_observations where scope_id=$1',[scopeId]);
  assert.equal(result.rows.length,1);assert.equal(result.rows[0].revision,2);
  const logs=await pool.query('select status from fib.source_runs order by started_at');
  assert.equal(logs.rows.length,4);
  const after=await pool.query('select gap_since from fib.source_scopes where id=$1',[scopeId]);
  assert.equal(after.rows[0].gap_since,null);
  console.log('U4 PostgreSQL repeat/failure/recovery integration passed');
}
void main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>pool.end());
