import {acceptObservation} from '../../../supabase/functions/_shared/reviewed-observation.js';
import type {FibActorContext} from '@fib/domain-contracts';
import type {FibSqlExecutor} from './app-user-repository.js';
import {authorize} from './authorization.js';

export interface SourceIntakeDatabase {
 /** Must rollback on any rejection/error; executor must use this same transaction. */
 transaction<T>(work:(db:FibSqlExecutor)=>Promise<T>):Promise<T>;
}
export type ReviewedObservation={
 scopeId:string;externalId:string;revision:number;fingerprint:string;sourceId:string;
 title:string;approval:true;
};
/** Explicit review handoff. Never creates events/messages/processes/topics or promotes RIS links. */
export async function acceptReviewedObservation(actor:FibActorContext,input:ReviewedObservation,database:SourceIntakeDatabase){
 if(actor.actorKind!=='human'||!actor.userId||!authorize(actor,{actionLevel:'S2',requiresMfaStepUp:true}).allowed)
  throw Error('forbidden');
 if(input.approval!==true||!input.title.trim()||!Number.isInteger(input.revision)||input.revision<1)throw Error('invalid_review');
 return acceptObservation(actor.userId,input,database);
}
