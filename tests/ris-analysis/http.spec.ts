import handler from '../../supabase/functions/fib-ris-analysis/index.ts';
function equal(actual:unknown,expected:unknown) {if(actual!==expected)throw Error(`Expected ${expected}, got ${actual}`);}
const saved=new Map<string,string|undefined>();
for(const name of ['FIB_RIS_ANALYSIS_ENABLED','FIB_RIS_AUTOMATION_ENABLED','FIB_RIS_SCHEDULER_TOKEN','FIB_DATABASE_URL'])
 saved.set(name,Deno.env.get(name));
try {
 Deno.env.set('FIB_RIS_ANALYSIS_ENABLED','false');
 equal((await handler.fetch(new Request('https://example.invalid',{method:'POST',body:'{}'}))).status,503);
 Deno.env.set('FIB_RIS_ANALYSIS_ENABLED','true');
 Deno.env.set('FIB_RIS_AUTOMATION_ENABLED','false');
 Deno.env.set('FIB_RIS_SCHEDULER_TOKEN','test-only-'.repeat(5));
 const call=(token?:string,body='{}')=>handler.fetch(new Request('https://example.invalid',{
  method:'POST',headers:{'content-type':'application/json',...(token?{'x-fib-ris-scheduler':token}:{})},body}));
 equal((await handler.fetch(new Request('https://example.invalid'))).status,405);
 equal((await call()).status,403);
 equal((await call('wrong')).status,403);
 Deno.env.delete('FIB_DATABASE_URL');
 const unconfigured=await call('test-only-'.repeat(5));
 equal(unconfigured.status,503);
 equal((await unconfigured.json()).error,'runtime_not_configured');
 Deno.env.set('FIB_DATABASE_URL','postgres://nobody@127.0.0.1:1/never-connect');
 // Real handler routing: readiness works while disabled and without network or DB permissions.
 Deno.env.set('FIB_RIS_ANALYSIS_ENABLED','false');
 const probe=()=>handler.fetch(new Request('https://example.invalid/functions/v1/fib-ris-analysis/preflight'));
 const ready=await probe();equal(ready.status,200);
 equal(await ready.text(),JSON.stringify({check:'ris-analysis-runtime-v2',ready:true,checks:{schedulerToken:'ready',databaseUrl:'ready'}}));
 Deno.env.delete('FIB_RIS_SCHEDULER_TOKEN');equal((await probe()).status,503);
 equal((await (await probe()).json()).checks.schedulerToken,'missing');
 equal((await (await probe()).json()).checks.databaseUrl,'ready');
 Deno.env.set('FIB_RIS_SCHEDULER_TOKEN','short');equal((await probe()).status,503);
 equal((await (await probe()).json()).checks.schedulerToken,'too_short');
 Deno.env.set('FIB_RIS_SCHEDULER_TOKEN','test-only-'.repeat(5));
 equal((await call()).status,503); // Probe did not activate analysis.
 Deno.env.set('FIB_RIS_ANALYSIS_ENABLED','true');
 equal((await call()).status,403);equal((await call('wrong')).status,403);
 for(const body of ['null','[]','1','{"enabled":true}','{"url":"https://evil.invalid"}'])
  equal((await call('test-only-'.repeat(5),body)).status,400);
 console.log('PASS real analysis HTTP handler: disabled gate, method, scoped secret and payload restrictions. No database/network connection attempted.');
} finally {
 for(const [name,value] of saved)if(value===undefined)Deno.env.delete(name);else Deno.env.set(name,value);
}
