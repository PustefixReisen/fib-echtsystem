import type { SourceCheckpoint, SourceObservation } from '../../domain-contracts/src/source-monitor.js';
import {reconcileSourceObservation, updateSourceCheckpoint} from '../../domain-contracts/src/source-monitor.js';
import {discoverSource,fingerprintDetail,type HttpGet,type MonitorTarget} from './u4-source-discovery.js';

export type SourceRunResult={scopeId:string;success:boolean;seen:number;newCount:number;changedCount:number;error?:string};
export interface U4SourceMonitorStorage {
  getCheckpoint(scopeId:string):Promise<SourceCheckpoint>;
  getObservation(scopeId:string,externalId:string):Promise<SourceObservation|undefined>;
  /** One DB transaction: observations, checkpoint and success log must commit together. */
  commitSuccess(input:{observations:SourceObservation[];checkpoint:SourceCheckpoint;result:SourceRunResult}):Promise<void>;
  /** Separate failure transaction; must not alter last successful checkpoint. */
  commitFailure(input:{checkpoint:SourceCheckpoint;result:SourceRunResult}):Promise<void>;
}

export async function runSourceMonitor(
  target:MonitorTarget,scopeId:string,http:HttpGet,store:U4SourceMonitorStorage,now:string,
):Promise<SourceRunResult>{
  const checkpoint=await store.getCheckpoint(scopeId);
  let seen=0,newCount=0,changedCount=0;
  const observations:SourceObservation[]=[];
  try {
    const discovered=await discoverSource(target,http);
    for(const item of discovered) {
      const fingerprint=await fingerprintDetail(item.url,http);
      const previous=await store.getObservation(scopeId,item.externalId);
      const decision=reconcileSourceObservation(scopeId,item.externalId,item.url,fingerprint,now,previous);
      observations.push(decision.observation);
      seen++;
      if(decision.status==='new')newCount++;
      if(decision.status==='changed')changedCount++;
    }
    const result:SourceRunResult={scopeId,success:true,seen,newCount,changedCount};
    await store.commitSuccess({observations,checkpoint:updateSourceCheckpoint(checkpoint,now,true),result});
    return result;
  } catch (err) {
    const error=err instanceof Error?err.message:String(err);
    const result:SourceRunResult={scopeId,success:false,seen,newCount,changedCount,error};
    await store.commitFailure({checkpoint:updateSourceCheckpoint(checkpoint,now,false,error),result});
    return result;
  }
}
