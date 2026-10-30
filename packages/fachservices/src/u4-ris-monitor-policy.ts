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
