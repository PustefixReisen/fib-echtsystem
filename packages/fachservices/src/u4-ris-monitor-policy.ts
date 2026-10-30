/** FIB U4 RIS operational proposal. This module computes plans only; it never schedules or fetches. */
export type RisCadence='daily'|'weekly';
export type RisWindowPlan={cadence:RisCadence;lookbackDays:30|120;startDate:string;endDate:string;status:'proposed'};
function dateOnly(s:string):Date{
 if(!/^\d{4}-\d{2}-\d{2}$/.test(s))throw new Error('Invalid ISO date');
 const d=new Date(s+'T00:00:00Z');
 if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==s)throw new Error('Invalid ISO date');
 return d;
}
/** Both passes overlap inclusively; a weekly pass never replaces a daily pass. */
export function planRisChecks(today:string):RisWindowPlan[]{
 const at=dateOnly(today);
 return ([{cadence:'daily',lookbackDays:30},{cadence:'weekly',lookbackDays:120}] as const).map(x=>{
  const start=new Date(at);start.setUTCDate(start.getUTCDate()-x.lookbackDays);
  return {...x,startDate:start.toISOString().slice(0,10),endDate:today,status:'proposed' as const};
 });
}

export type RisDueState={lastCompleteAt?:string|null;failures?:readonly unknown[];pending?:readonly unknown[]};
export type RisDueResult={cadence:RisCadence;due:boolean;overdueDays:number|null;nextDueDate:string|null;reason:'never_completed'|'recovery_needed'|'due'|'not_due'};
/** UTC date-only arithmetic for reproducible planning; the scheduler must supply its Berlin-local calendar date. */
export function dueRisChecks(today:string,states:Partial<Record<RisCadence,RisDueState>>):RisDueResult[]{
 const asOf=dateOnly(today);
 return (['daily','weekly'] as const).map(cadence=>{
  const s=states[cadence];
  if(!s?.lastCompleteAt)return {cadence,due:true,overdueDays:null,nextDueDate:null,reason:'never_completed'};
  const day=s.lastCompleteAt.slice(0,10);
  const last=dateOnly(day);const cadenceDays=cadence==='daily'?1:7;
  const next=new Date(last);next.setUTCDate(next.getUTCDate()+cadenceDays);
  const nextDueDate=next.toISOString().slice(0,10);
  const overdueDays=Math.max(0,Math.floor((asOf.getTime()-next.getTime())/86_400_000));
  const recovery=Boolean(s.failures?.length||s.pending?.length);
  return {cadence,due:recovery||asOf>=next,overdueDays,nextDueDate,reason:recovery?'recovery_needed':asOf>=next?'due':'not_due'};
 });
}
