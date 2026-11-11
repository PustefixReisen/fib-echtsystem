import {analysisDocumentPolicy} from '../_shared/ris-analysis.ts';
import {analysisPreflight} from '../_shared/ris-analysis-preflight.ts';
import postgres from 'npm:postgres@3.4.7';
import {extractText} from 'npm:unpdf@2.1.0';
import {verifyRisScheduler} from '../fib-u4-ris-pilot/index.ts';
import {runRisAnalysis, type AnalysisDatabase} from '../_shared/ris-analysis-worker.ts';

export default {async fetch(req:Request) {
  const preflight=analysisPreflight(req,name=>Deno.env.get(name));
  if(preflight)return preflight;
  const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'cache-control':'no-store'}});
  if(req.method!=='POST')return reply({error:'method_not_allowed'},405);
  if(Deno.env.get('FIB_RIS_ANALYSIS_ENABLED')!=='true')return reply({error:'analysis_disabled'},503);
  const denied=await verifyRisScheduler(req,'FIB_RIS_ANALYSIS_ENABLED');
  if(denied)return denied;
  const url=Deno.env.get('FIB_DATABASE_URL');
  if(!url)return reply({error:'runtime_not_configured'},503);
  // No user-supplied IDs, URLs, prompts, SQL, flags or provider keys are accepted.
  if(Number(req.headers.get('content-length')??0)>1000)return reply({error:'invalid_request'},400);
  const body=await req.json().catch(()=>null);
  if(!body || typeof body!=='object' || Array.isArray(body) || Object.keys(body).length)return reply({error:'invalid_request'},400);
  const sql=postgres(url,{max:1,prepare:false,connect_timeout:5,idle_timeout:5});
  const db:AnalysisDatabase={
    unsafe:async(q,p)=>(await sql.unsafe(q,p as any)) as any,
    transaction:async work=>await sql.begin(tx=>work({unsafe:async(q,p)=>(await tx.unsafe(q,p as any)) as any})) as any,
  };
  try {
    const result=await runRisAnalysis(db,{
      documentPolicy:analysisDocumentPolicy(Deno.env.get('FIB_RIS_ANALYSIS_DOCUMENTS_ENABLED')==='true',
        Deno.env.get('FIB_RIS_ANALYSIS_APPROVED_DOCUMENT_CLASSES')),
      extractPages:async bytes=>{
        const {text}=await extractText(bytes.slice(),{mergePages:false});
        return text;
      },
    });
    return reply({ok:true,generated:true,method:'rules',...result});
  } catch {return reply({error:'analysis_unavailable'},503);}
  finally {await sql.end();}
}};
