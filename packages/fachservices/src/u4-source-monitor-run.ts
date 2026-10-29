import type { SourceCheckpoint, SourceObservation } from '../../domain-contracts/src/source-monitor.js';
import {reconcileSourceObservation,updateSourceCheckpoint} from '../../domain-contracts/src/source-monitor.js';
import {discoverSource,fingerprintDetail,type HttpGet,type MonitorTarget} from './u4-source-discovery.js';

export interface U4SourceMonitorStorage {
  getCheckpoint(scopeId:string):Promise<SourceCheckpoint>;
  getObservation(scopeId:string,externalId:string):Promise<SourceObservation|undefined>;
  saveObservation(observation:SourceObservation):Promise<void>;
  saveCheckpoint(checkpoint:SourceCheckpoint):Promise<void>;
  logRun(result:{scopeId:string;status:'succeeded'|'failed';seen:number;newCount:number;changedCount:number;error?:string}):Promise<void>;
}
export type SourceRunResult={scopeId:string;success:boolean;seen:number;newCount:number;changedCount:number;error?:string};

/** Durable writes are injected; last successful checkpoint advances only after all details have been processed. */
export async function runSourceMonitor(
  target:MonitorTarget,scopeId:string,http:HttpGet,store:U4SourceMonitorStorage,now:string,
):Promise<SourceRunResult>{
  const checkpoint=await store.getCheckpoint(scopeId);
  let seen=0,newCount=0,changedCount=0;
  try{
    const discovered=await discoverSource(target,http);
    for(const item of discovered){
      // Monitoring existing content requires detail fingerprints, not just listing titles.
      const fingerprint=await fingerprintDetail(item.url,http);
      const previous=await store.getObservation(scopeId,item.externalId);
      const decision=reconcileSourceObservation(scopeId,item.externalId,item.url,fingerprint,now,previous);
      await store.saveObservation(decision.observation);
      seen++;
      if(decision.status==='new')newCount++;
      if(decision.status==='changed')changedCount++;
    }
    await store.saveCheckpoint(updateSourceCheckpoint(checkpoint,now,true));
    const result={scopeId,success:true,seen,newCount,changedCount};
    await store.logRun({...result,status:'succeeded'});
    return result;
  }catch(err){
    const error=err instanceof Error?err.message:String(err);
    await store.saveCheckpoint(updateSourceCheckpoint(checkpoint,now,false,error));
    await store.logRun({scopeId,status:'failed',seen,newCount,changedCount,error});
    return {scopeId,success:false,seen,newCount,changedCount,error};
  }
}
