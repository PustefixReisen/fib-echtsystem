import {pathToFileURL} from 'node:url';

const endpoint='https://apaubomxffcwtzjimori.supabase.co/functions/v1/fib-ris-analysis/preflight';
const contract='ris-analysis-runtime-v2';

/** No management API, credential argument, response logging or fail-open path. */
export async function checkAnalysisRuntime(request=fetch,pause=ms=>new Promise(r=>setTimeout(r,ms))) {
  for(let attempt=0;attempt<3;attempt++) {
    let response;
    try {
      response=await request(endpoint,{method:'GET',redirect:'error',cache:'no-store',signal:AbortSignal.timeout(15000)});
    } catch {
      if(attempt<2){await pause(1000);continue;}
      throw Error('ris_analysis_preflight_unreachable');
    }
    // Bound the body, and never include it in logs (including errors).
    const reader=response.body?.getReader();
    let raw='',size=0;
    try {
      if(reader)while(true) {
        const {done,value}=await reader.read();if(done)break;
        size+=value.length;
        if(size>1024)throw Error('oversized');
        raw+=new TextDecoder().decode(value);
      }
    } catch {await reader?.cancel().catch(()=>{});throw Error('ris_analysis_preflight_invalid_response');}
    let body;
    try {body=JSON.parse(raw);}catch {/* Cold starts can return non-JSON gateway errors. */}
    const checks=body?.checks;
    const exact=body && Object.keys(body).sort().join(',')==='check,checks,ready' && body.check===contract &&
      checks && Object.keys(checks).sort().join(',')==='databaseUrl,schedulerToken' &&
      ['missing','too_short','ready'].includes(checks.schedulerToken) && ['missing','ready'].includes(checks.databaseUrl) &&
      body.ready===(checks.schedulerToken==='ready' && checks.databaseUrl==='ready');
    if(response.status===200 && exact && body.ready===true)return checks;
    if(response.status===503 && exact && body.ready===false) {
      // Only allowlisted states enter this fixed diagnostic, never response text.
      throw Error('ris_analysis_runtime_not_ready: FIB_RIS_SCHEDULER_TOKEN='+checks.schedulerToken+'; FIB_DATABASE_URL='+checks.databaseUrl);
    }
    if([404,502,503,504].includes(response.status) && attempt<2){await pause(1000);continue;}
    throw Error('ris_analysis_preflight_invalid_response');
  }
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  try {await checkAnalysisRuntime();console.log('RIS analysis runtime prerequisites verified; no credentials read by runner.');}
  catch(error){console.error(error.message);process.exitCode=1;}
}
