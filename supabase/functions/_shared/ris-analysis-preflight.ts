// Deliberately public, read-only readiness signal. Never returns credential
// values, hashes, lengths or database details; never enables or runs analysis.
export const RIS_ANALYSIS_PREFLIGHT = 'ris-analysis-runtime-v2';
export function analysisPreflight(req:Request,getEnv:(name:string)=>string|undefined):Response|null {
  const url=new URL(req.url);
  const preflightPaths=['/fib-ris-analysis/preflight','/functions/v1/fib-ris-analysis/preflight'];
  const activationPaths=['/fib-ris-analysis/activation','/functions/v1/fib-ris-analysis/activation'];
  const isPreflight=preflightPaths.includes(url.pathname);
  const isActivation=activationPaths.includes(url.pathname);
  if(!isPreflight && !isActivation)return null;
  const headers={'cache-control':'no-store'};
  if(req.method!=='GET' || url.search)return Response.json({error:'invalid_preflight_request'},{status:405,headers});
  // Read-only readiness check. This never changes flags or reveals secret values.
  if(isActivation) {
    const ready=getEnv('FIB_RIS_ANALYSIS_ENABLED')==='true'
      && getEnv('FIB_RIS_ANALYSIS_DOCUMENTS_ENABLED')==='false';
    return Response.json({check:'ris-analysis-activation-v1',ready},{status:ready?200:503,headers});
  }
  // This is the same minimum token length required by verifyRisScheduler.
  // Checking the actual runtime is stronger than finding a name in a secret list.
  const token=getEnv('FIB_RIS_SCHEDULER_TOKEN');
  const checks={
    schedulerToken:!token?'missing':token.length<32?'too_short':'ready',
    databaseUrl:getEnv('FIB_DATABASE_URL')?'ready':'missing',
  };
  const ready=checks.schedulerToken==='ready' && checks.databaseUrl==='ready';
  return Response.json({check:RIS_ANALYSIS_PREFLIGHT,ready,checks},{status:ready?200:503,headers});
}
