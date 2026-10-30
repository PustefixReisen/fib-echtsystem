import pg from 'pg';
import {SqlU4SourceMonitorStorage} from '../packages/fachservices/src/u4-source-monitor-sql.js';
import {runSourceMonitor} from '../packages/fachservices/src/u4-source-monitor-run.js';
import {U4_PILOT_TARGETS} from '../packages/fachservices/src/u4-source-discovery.js';

// Run only server-side with private DB credentials. Never ship this to the browser.
const scopeId=process.argv[2], targetKey=process.argv[3];
if(!scopeId || !targetKey || !process.env.U4_DATABASE_URL) throw new Error('Usage: U4_DATABASE_URL=... npx tsx scripts/u4-run-scope.ts <scope-uuid> <target-key>');
const target=U4_PILOT_TARGETS.find(item=>item.key===targetKey);
if(!target) throw new Error('Unknown fixed pilot target');
const pool=new pg.Pool({connectionString:process.env.U4_DATABASE_URL,max:2,ssl:{rejectUnauthorized:true}});
const db={
  async queryOne<T>(sql:string,params:readonly unknown[]):Promise<T|null>{
    const result=await pool.query(sql,[...params]);return (result.rows[0] as T|undefined)??null;
  },
  async transaction<T>(work:(tx:{queryOne<R>(sql:string,params:readonly unknown[]):Promise<R|null>})=>Promise<T>):Promise<T>{
    const client=await pool.connect();
    try{
      await client.query('BEGIN');
      const tx={queryOne:async<R>(sql:string,params:readonly unknown[]):Promise<R|null>=>{
        const result=await client.query(sql,[...params]);return (result.rows[0] as R|undefined)??null;
      }};
      const result=await work(tx);
      await client.query('COMMIT');return result;
    }catch(error){await client.query('ROLLBACK');throw error}
    finally{client.release()}
  }
};
async function main(){
  const store=new SqlU4SourceMonitorStorage(db);
  const result=await runSourceMonitor(target!,scopeId,async url=>{
    const response=await fetch(url,{signal:AbortSignal.timeout(15000),headers:{Accept:'text/html,application/pdf,*/*','User-Agent':'FIB-SourceMonitor/0.1'}});
    return {ok:response.ok,status:response.status,headers:response.headers,text:()=>response.text(),arrayBuffer:()=>response.arrayBuffer()};
  },store,new Date().toISOString());
  console.log(JSON.stringify(result));
  if(!result.success)process.exitCode=1;
}
void main().catch(err=>{console.error(String(err));process.exitCode=1}).finally(()=>pool.end());
