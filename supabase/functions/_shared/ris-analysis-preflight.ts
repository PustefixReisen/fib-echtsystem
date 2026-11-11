// Deliberately public, read-only readiness signal. Never returns credential
// names, values, hashes or database details; never enables or runs analysis.
export const RIS_ANALYSIS_PREFLIGHT = 'ris-analysis-runtime-v1';
export function analysisPreflight(req:Request,getEnv:(name:string)=>string|undefined):Response|null {
  const url=new URL(req.url);
  if(!['/fib-ris-analysis/preflight','/functions/v1/fib-ris-analysis/preflight'].includes(url.pathname))return null;
  const headers={'cache-control':'no-store'};
  if(req.method!=='GET' || url.search)return Response.json({error:'invalid_preflight_request'},{status:405,headers});
  // This is the same minimum token length required by verifyRisScheduler.
  // Checking the actual runtime is stronger than finding a name in a secret list.
  const ready=(getEnv('FIB_RIS_SCHEDULER_TOKEN')?.length??0)>=32 && Boolean(getEnv('FIB_DATABASE_URL'));
  return Response.json({check:RIS_ANALYSIS_PREFLIGHT,ready},{status:ready?200:503,headers});
}
