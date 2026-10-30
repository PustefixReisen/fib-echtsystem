// RIS-only server scheduler. No user JWT is accepted here; all calls must pass
// the opt-in flag and purpose-scoped secret checked inside handleRis.
// A single invocation may need multiple two-view RIS batches.
import {handleRis} from '../fib-u4-ris-pilot/index.ts';

const MAX_BATCHES = 8;
// Leave headroom below Supabase Free Edge's 150-second response timeout.
const MAX_ELAPSED_MS = 90000;
export default {async fetch(req:Request){
 if(req.method!=='POST')return handleRis(req,'scheduler');
 let input:{cadence?:'daily'|'weekly';commit?:boolean;pdfBackfill?:boolean};
 try{input=await req.clone().json()}catch{return Response.json({error:'invalid_request'},{status:400})}
 if(input.commit!==true||input.pdfBackfill===true||!['daily','weekly'].includes(input.cadence??''))
  return Response.json({error:'invalid_scheduler_payload'},{status:400});
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
}};
