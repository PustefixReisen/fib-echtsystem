import {pathToFileURL} from 'node:url';

const endpoint='https://apaubomxffcwtzjimori.supabase.co/functions/v1/fib-ris-analysis/activation';
const contract='ris-analysis-activation-v1';

/** Public, read-only, exact-contract check; does not send or reveal credentials. */
export async function checkAnalysisActivation(request=fetch,pause=ms=>new Promise(r=>setTimeout(r,ms))) {
  for(let attempt=0;attempt<3;attempt++){
    let response;
    try {
      response=await request(endpoint,{method:'GET',redirect:'error',cache:'no-store',signal:AbortSignal.timeout(15000)});
    } catch {
      if(attempt<2){await pause(1000);continue;}
      throw Error('ris_analysis_activation_unreachable');
    }
    let raw='',size=0;
    try{
      const reader=response.body?.getReader();
      if(reader)while(true){
        const {done,value}=await reader.read();if(done)break;
        size+=value.length;if(size>1024)throw Error('oversized');
        raw+=new TextDecoder().decode(value);
      }
    }catch{throw Error('ris_analysis_activation_invalid_response');}
    let body;
    try{body=JSON.parse(raw);}catch{}
    const exact=body && Object.keys(body).sort().join(',')==='check,ready' && body.check===contract;
    if(response.status===200 && exact && body.ready===true)return true;
    if(response.status===503 && exact && body.ready===false)throw Error('ris_analysis_activation_not_ready: set FIB_RIS_ANALYSIS_ENABLED=true and FIB_RIS_ANALYSIS_DOCUMENTS_ENABLED=false in Supabase Edge Functions Secrets');
    if([404,502,503,504].includes(response.status) && attempt<2){await pause(1000);continue;}
    throw Error('ris_analysis_activation_invalid_response');
  }
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
  try{await checkAnalysisActivation();console.log('RIS rule analysis active, document processing disabled; no secret management permission required.');}
  catch(error){console.error(error.message);process.exitCode=1;}
}
