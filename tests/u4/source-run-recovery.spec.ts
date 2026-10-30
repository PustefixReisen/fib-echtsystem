import assert from 'node:assert/strict';
import {runSourceMonitor,type U4SourceMonitorStorage} from '../../packages/fachservices/src/u4-source-monitor-run.js';
import type {SourceCheckpoint,SourceObservation} from '../../packages/domain-contracts/src/source-monitor.js';
const scopeId='scope-demo';
const target={key:'feldkirchen-news' as const,url:'https://www.feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen',origin:'https://www.feldkirchen.de'};
const pageUrl=target.url+'/sample';
let html='<html><body><p>one</p></body></html>';
let broken=false;
const http=async(url:string)=>{
  if(broken&&url===pageUrl)throw new Error('simulated HTTP outage');
  return {ok:true,status:200,text:async()=>url===target.url?'<html><a href="'+pageUrl+'">one</a></html>':html};
};
const observations=new Map<string,SourceObservation>();
let cp:SourceCheckpoint={scopeId};
const history:string[]=[];
const store:U4SourceMonitorStorage={
  async getCheckpoint(){return {...cp}},
  async getObservation(_scope,id){return observations.get(id)},
  async commitSuccess({observations:next,checkpoint,result}){
    next.forEach(o=>observations.set(o.externalId,o));
    cp=checkpoint;history.push('success:'+result.newCount+':'+result.changedCount);
  },
  async commitFailure({checkpoint}){cp=checkpoint;history.push('failed')}
};
async function main(){
  const first=await runSourceMonitor(target,scopeId,http,store,'2026-10-30T11:00:00Z');
  assert.equal(first.newCount,1);
  const second=await runSourceMonitor(target,scopeId,http,store,'2026-10-30T11:05:00Z');
  assert.equal(second.newCount,0);assert.equal(second.changedCount,0);
  broken=true;
  const failed=await runSourceMonitor(target,scopeId,http,store,'2026-10-30T11:10:00Z');
  assert.equal(failed.success,false);assert.equal(cp.lastSuccessAt,'2026-10-30T11:05:00Z');
  assert.equal(cp.gapSince,'2026-10-30T11:05:00Z');
  broken=false;html='<html><body><p>changed</p></body></html>';
  const recovered=await runSourceMonitor(target,scopeId,http,store,'2026-10-30T11:15:00Z');
  assert.equal(recovered.changedCount,1);assert.equal(cp.gapSince,undefined);
  assert.equal([...observations.values()][0].revision,2);
  assert.deepEqual(history,['success:1:0','success:0:0','failed','success:0:1']);
  console.log('U4 repeated / failure / recovery runs passed');
}
void main().catch(err=>{console.error(err);process.exitCode=1});
