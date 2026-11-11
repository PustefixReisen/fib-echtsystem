import assert from 'node:assert/strict';
import {analysisPreflight} from '../../supabase/functions/_shared/ris-analysis-preflight.ts';
import {checkAnalysisRuntime} from '../../scripts/ris-analysis/preflight.mjs';

const endpoint='https://apaubomxffcwtzjimori.supabase.co/functions/v1/fib-ris-analysis/preflight';
const contract='ris-analysis-runtime-v1';
const fixture='test-fixture-only-'.repeat(3);
const env=new Map([['FIB_RIS_SCHEDULER_TOKEN',fixture],['FIB_DATABASE_URL','postgres://private-fixture'],
  ['FIB_RIS_ANALYSIS_ENABLED','false']]);
const getEnv=(name:string)=>env.get(name);
const probe=(url=endpoint,method='GET')=>analysisPreflight(new Request(url,{method}),getEnv)!;
let response=probe();
assert.equal(response.status,200);
assert.equal(response.headers.get('cache-control'),'no-store');
assert.deepEqual(await response.json(),{check:contract,ready:true});
for(const token of [undefined,'',fixture.slice(0,31)]) {
  if(token===undefined)env.delete('FIB_RIS_SCHEDULER_TOKEN');else env.set('FIB_RIS_SCHEDULER_TOKEN',token);
  assert.equal(probe().status,503);
}
env.set('FIB_RIS_SCHEDULER_TOKEN',fixture.slice(0,32));assert.equal(probe().status,200);
env.delete('FIB_DATABASE_URL');assert.equal(probe().status,503);
env.set('FIB_DATABASE_URL','postgres://private-fixture');
for(const method of ['POST','PUT','DELETE','HEAD'])assert.equal(probe(endpoint,method).status,405);
assert.equal(probe(endpoint+'?enable=true').status,405);
assert.equal(analysisPreflight(new Request(endpoint.replace('/preflight','')),getEnv),null);
assert.equal(probe('https://example.invalid/fib-ris-analysis/preflight').status,200);
assert.equal(env.get('FIB_RIS_ANALYSIS_ENABLED'),'false','Probe never activates the worker');
assert.equal((await probe().text()).includes(fixture),false);
assert.equal((await probe().text()).includes('postgres'),false);

let calls=0;
const noPause=async()=>{};
await checkAnalysisRuntime(async(url:string,options:RequestInit)=>{
  calls++;assert.equal(url,endpoint);assert.equal(options.method,'GET');assert.equal(options.redirect,'error');
  assert.equal(options.headers,undefined,'No management or scheduler credential leaves the runner');
  return probe();
},noPause);
assert.equal(calls,1);
for(const fake of [
  ()=>new Response('gateway says OK',{status:200}),
  ()=>Response.json({ready:true},{status:200}),
  ()=>Response.json({check:'old-contract',ready:true},{status:200}),
  ()=>Response.json({check:contract,ready:true,secret:fixture},{status:200}),
  ()=>Response.json({check:contract,ready:false},{status:200}),
  ()=>new Response(null,{status:302,headers:{location:'https://evil.invalid'}}),
  ()=>new Response('permission denied',{status:403}),
  ()=>new Response(fixture.repeat(100),{status:200}),
  ()=>{throw Error(fixture);},
])await assert.rejects(()=>checkAnalysisRuntime(async()=>fake(),noPause),error=>!String(error).includes(fixture));
calls=0;
await assert.rejects(()=>checkAnalysisRuntime(async()=>{calls++;return Response.json({check:contract,ready:false},{status:503});},noPause),/runtime_not_ready/);
assert.equal(calls,1,'Missing runtime credential is a hard stop, never retried or replaced');
calls=0;
await checkAnalysisRuntime(async()=>{calls++;return calls===1?new Response('starting',{status:404}):probe();},noPause);
assert.equal(calls,2);
calls=0;
await assert.rejects(()=>checkAnalysisRuntime(async()=>{calls++;return new Response('unavailable',{status:503});},noPause));
assert.equal(calls,3,'Transient retries are bounded');
console.log('PASS preflight: actual readiness handler, missing/short token, disabled worker, safe output, exact contract, fixed target, bounded retries and fail-closed workflow client');
