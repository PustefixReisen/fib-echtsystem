// RIS-only server scheduler. No user JWT is accepted here; all calls must pass
// the opt-in flag and purpose-scoped secret checked inside handleRis.
// A single invocation may need multiple two-view RIS batches.
import postgres from 'npm:postgres@3.4.7';
import {handleRis,verifyRisScheduler} from '../fib-u4-ris-pilot/index.ts';

const MAX_BATCHES = 8;
// Leave headroom below Supabase Free Edge's 150-second response timeout.
const MAX_ELAPSED_MS = 90000;
export default {async fetch(req:Request){
 if(req.method!=='POST')return handleRis(req,'scheduler');
 let input:{cadence?:'daily'|'weekly';commit?:boolean;pdfBackfill?:boolean};
 try{input=await req.clone().json()}catch{return Response.json({error:'invalid_request'},{status:400})}
 if(input.commit!==true||input.pdfBackfill===true||!['daily','weekly'].includes(input.cadence??''))
  return Response.json({error:'invalid_scheduler_payload'},{status:400});
 const denied=await verifyRisScheduler(req);
 if(denied)return denied;
 const databaseUrl=Deno.env.get('FIB_DATABASE_URL');
 if(!databaseUrl)return Response.json({error:'runtime_not_configured'},{status:503});
 const lockSql=postgres(databaseUrl,{max:1,prepare:false,connect_timeout:5,idle_timeout:5});
 let locked=false;
 try{
  // A dedicated PostgreSQL session holds the lock throughout all batches.
  // The same lock serializes daily and weekly scans on the shared RIS cursor.
  const acquired=await lockSql.unsafe('select pg_try_advisory_lock(41004, 4001) as acquired');
  locked=acquired[0]?.acquired===true;
  if(!locked)return Response.json({error:'ris_scan_already_running'},{status:409});
 const started=Date.now();
 let latest:Record<string,unknown>={};
 for(let batch=1;batch<=MAX_BATCHES;batch++){
  if(batch>1 && Date.now()-started>=MAX_ELAPSED_MS)
   return Response.json({...latest,batches:batch-1,error:'ris_continuation_needed',reason:'runtime_budget'},{status:503});
  const result=await handleRis(req.clone(),'scheduler');
  if(!result.ok)return result;
  latest=await result.json() as Record<string,unknown>;
  if(latest.skipped==='not_due'||latest.complete===true)
   return Response.json({...latest,batches:batch},{status:200});
  if(Number(latest.failures??0)>0)
   return Response.json({...latest,batches:batch,error:'ris_retry_needed'},{status:503});
 }
 return Response.json({...latest,batches:MAX_BATCHES,error:'ris_continuation_needed'},{status:503});
 }catch(error){return Response.json({error:'ris_scheduler_lock_failed',detail:String(error).slice(0,160)},{status:503});}
 finally{
  if(locked){try{await lockSql.unsafe('select pg_advisory_unlock(41004, 4001)')}catch{/* connection closure also releases session locks */}}
  await lockSql.end();
 }
}};
