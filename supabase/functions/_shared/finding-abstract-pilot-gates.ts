/**
 * Shared-Apps pilot gates: no external calls or implicit operator approval.
 * Database transactions serialize budget reservations across all workers.
 */
import type {RisSql} from './ris-structure.ts';
import type {AbstractAuthorization} from './finding-abstract-storage.ts';
import type {BudgetGate,BudgetReservation} from './finding-abstract-mistral.ts';

type Transaction=<T>(fn:(tx:RisSql)=>Promise<T>)=>Promise<T>;
export function databaseAbstractRights(
 transaction:Transaction,externalAi:boolean
):AbstractAuthorization{
 return async identity=>transaction(async tx=>{
   const [decision]=await tx.unsafe(`select p.permitted,p.external_ai_allowed
     from fib.finding_abstract_permissions p
     join fib.finding_versions v on v.id=p.finding_version_id
     where v.id=$1 and v.finding_id=$2 and p.source_kind=$3
       and p.expires_at>now()
       and v.revision=(select max(revision) from fib.finding_versions
                       where finding_id=v.finding_id)`,
       [identity.findingVersionId,identity.findingId,identity.sourceKind]);
   return Boolean(decision?.permitted && (!externalAi || decision.external_ai_allowed));
 });
}
export function databasePilotBudget(transaction:Transaction):BudgetGate{
 return {reserve:async(key:string,amount:number)=>{
   if(!/^[a-f0-9]{64}$/.test(key) || !Number.isSafeInteger(amount) || amount<1 || amount>500)
     throw Error('pilot_invalid_reservation');
   await transaction(async tx=>{
     const [balance]=await tx.unsafe('select * from fib.abstract_pilot_budget where id=1 for update');
     if(!balance)throw Error('pilot_budget_missing');
     const old=await tx.unsafe('select request_key from fib.abstract_pilot_reservations where request_key=$1',[key]);
     if(old.length)throw Error('pilot_duplicate_request');
     if(Number(balance.consumed_cents)+Number(balance.held_cents)+amount>Number(balance.max_cents))
       throw Error('pilot_budget_exhausted');
     await tx.unsafe('insert into fib.abstract_pilot_reservations(request_key,reserved_cents,status) values($1,$2,\'reserved\')',
       [key,amount]);
     await tx.unsafe('update fib.abstract_pilot_budget set held_cents=held_cents+$1 where id=1',[amount]);
   });
   const update=async(action:'settled'|'uncertain'|'released',cost?:number)=>transaction(async tx=>{
     // Always lock budget FIRST to prevent deadlocks and negative balances.
     const [balance]=await tx.unsafe('select * from fib.abstract_pilot_budget where id=1 for update');
     if(!balance)throw Error('pilot_budget_missing');
     const [reservation]=await tx.unsafe('select * from fib.abstract_pilot_reservations where request_key=$1 for update',[key]);
     if(!reservation)throw Error('pilot_reservation_missing');
     if(reservation.status!=='reserved') {
       if(reservation.status===action && (action!=='settled'||Number(reservation.billed_cents)===cost))
         return; // idempotent state transition, no money moved twice
       throw Error('pilot_reservation_final');
     }
     if(action==='uncertain'){
       await tx.unsafe(`update fib.abstract_pilot_reservations set status='uncertain',updated_at=now()
         where request_key=$1`,[key]);return;
     }
     if(action==='settled'&&(!Number.isSafeInteger(cost)||cost!<0||cost!>reservation.reserved_cents))
       throw Error('pilot_charge_outside_reservation');
     const charged=action==='settled'?cost!:0;
     await tx.unsafe(`update fib.abstract_pilot_reservations
       set status=$2,billed_cents=$3,updated_at=now() where request_key=$1`,
       [key,action,charged]);
     await tx.unsafe(`update fib.abstract_pilot_budget
       set held_cents=held_cents-$1,consumed_cents=consumed_cents+$2 where id=1`,
       [reservation.reserved_cents,charged]);
   });
   const reservation:BudgetReservation={
     settle:cost=>update('settled',cost),
     uncertain:()=>update('uncertain'),
     releaseUnsent:()=>update('released')
   };
   return reservation;
 }};
}
