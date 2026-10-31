import assert from 'node:assert/strict';

// Pure configuration planner: deliberately does not connect to Supabase,
// produce SQL containing secrets, or install/enable scheduled jobs.
export type RisCadence='daily'|'weekly';
export type RisSchedule={name:string;cadence:RisCadence;cronUtc:string;body:{cadence:RisCadence;commit:true;pdfBackfill:false}};
export const plans:readonly RisSchedule[]=[
 {name:'fib-ris-daily',cadence:'daily',cronUtc:'20 4 * * *',body:{cadence:'daily',commit:true,pdfBackfill:false}},
 {name:'fib-ris-weekly',cadence:'weekly',cronUtc:'20 5 * * 0',body:{cadence:'weekly',commit:true,pdfBackfill:false}}
] as const;
export function validateRisCronPlan(input:readonly RisSchedule[]){
 assert.equal(input.length,2,'exactly two FIB RIS jobs');
 const names=new Set<string>();
 for(const p of input){
  assert.match(p.name,/^fib-ris-(daily|weekly)$/);
  assert.equal(names.has(p.name),false,'duplicate job name');
  names.add(p.name);
  assert.equal(p.name,'fib-ris-'+p.cadence);
  assert.equal(p.body.cadence,p.cadence);
  assert.equal(p.body.commit,true);
  assert.equal(p.body.pdfBackfill,false);
  assert.match(p.cronUtc,/^[0-9* /,-]+$/);
 }
 assert.notEqual(input[0].cronUtc,input[1].cronUtc);
 return true;
}
validateRisCronPlan(plans);
if(process.argv[1]?.endsWith('ris-cron-plan.ts'))
 console.log(JSON.stringify({activation:false,schedulerEndpoint:'fib-u4-ris-scheduled',timeZone:'UTC',plans,requires:['pg_cron','pg_net','vault','separate activation approval'],note:'This is a planning artifact only. No jobs, secrets or database changes.'},null,2));
