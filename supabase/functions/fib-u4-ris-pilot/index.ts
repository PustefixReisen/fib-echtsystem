import postgres from 'npm:postgres@3.4.7';
import {extractText} from 'npm:unpdf@2.1.0';
import {risSessionLinks,risUrl,parseRisStructure,persistRisStructure,persistRisDocument} from '../_shared/ris-structure.ts';
const origin='https://buergerinfo-feldkirchen.digitalfabrix.de';
const entry=origin+'/do0040.asp?smcmode=32832';
const cors={'access-control-allow-origin':'https://fib.pustivo.de','access-control-allow-headers':'authorization,apikey,x-client-info,content-type','access-control-allow-methods':'POST, OPTIONS'};
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{...cors,'cache-control':'no-store'}});
function valid(href:string,base=entry):string|null{
 try{const u=new URL(href.replace(/&amp;/g,'&'),base);u.hash='';if(u.protocol!=='https:'||u.origin!==origin)return null;return u.href;}catch{return null;}
}
function releaseSince(html:string):string|null{
 const plain=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/\s+/g,' ');
 const m=plain.match(/Dokumente\s+mit\s+Freigabe\s+seit\s+([0-3]?\d)\.([01]?\d)\.(20\d\d)/i);
 if(!m)return null;
 const d=Number(m[1]),month=Number(m[2]),year=Number(m[3]);
 const date=new Date(Date.UTC(year,month-1,d));
 if(date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==d)return null;
 return date.toISOString().slice(0,10);
}
function extract(html:string,url:string){
 const docs=new Set<string>(),navigation=new Set<string>(),structureLinks=new Set<string>();
 for(const m of html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)){
  const u=valid(m[1]??'',url);if(!u)continue;
  const parsed=new URL(u);
  const canonical=risUrl(u);if(canonical&&(/\/(?:si|vo)\d+\.asp/.test(parsed.pathname)))structureLinks.add(canonical);
  if(parsed.pathname.toLowerCase()==='/getfile.asp'&&parsed.searchParams.has('id'))docs.add(u);
  if(parsed.pathname.toLowerCase()==='/do0040.asp'&&/^\d{7}$/.test(parsed.searchParams.get('smcadat')??''))navigation.add(u);
 }
 return {docs:[...docs],navigation:[...navigation],structureLinks:[...structureLinks],releaseSince:releaseSince(html)};
}
async function pdfHash(url:string,withText=false){
 const u=valid(url);if(!u||new URL(u).pathname.toLowerCase()!=='/getfile.asp')throw new Error('invalid_pdf_url');
 const resp=await fetch(u,{redirect:'error',signal:AbortSignal.timeout(20000),headers:{accept:'application/pdf','user-agent':'FIB-U4-RIS-Pilot/0.2'}});
 if(!resp.ok)throw new Error('PDF HTTP '+resp.status);
 const length=Number(resp.headers.get('content-length')??'0');if(length>25000000)throw new Error('pdf_too_large');
 const data=new Uint8Array(await resp.arrayBuffer());if(data.length>25000000)throw new Error('pdf_too_large');
 if(data.length<5||new TextDecoder().decode(data.subarray(0,5))!=='%PDF-')throw new Error('invalid_pdf_response');
 const hash=await crypto.subtle.digest('SHA-256',data);
 const fingerprint=[...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('');
 const text=withText?(await extractText(data,{mergePages:true})).text:null;
 return {hash:fingerprint,text};
}
async function page(url:string){
 const resp=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(15000),headers:{accept:'text/html','user-agent':'FIB-U4-RIS-Pilot/0.1'}});
 if(!resp.ok)throw new Error('RIS HTTP '+resp.status);
 const html=await resp.text();if(!/<(?:html|body|a)\b/i.test(html))throw new Error('RIS invalid HTML');
 return extract(html,url);
}
function coverage(views:{url:string;releaseSince:string|null;checkedAt:string}[],visited:string[],pending:string[],failures:{url:string;error:string}[],cadence:'daily'|'weekly'){
 const lookbackDays=cadence==='daily'?30:120;
 const now=new Date();const threshold=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()-lookbackDays)).toISOString().slice(0,10);
 const active=new Set(visited);
 const dates=views.filter(v=>active.has(v.url)&&v.releaseSince&&/^\d{4}-\d{2}-\d{2}$/.test(v.releaseSince)).map(v=>v.releaseSince as string).sort();
 const earliest=dates[0]??null;
 const status=failures.length?'failed':pending.length?'in_progress':!earliest?'unverified':earliest>threshold?'insufficient':'candidate';
 return {cadence,requiredSince:threshold,earliestObserved:earliest,coverageStatus:status,coverageWarning:'Freigabestart ist kein Nachweis lückenloser Erfassung'};
}
function dueStatus(states:Record<string,{lastCompleteAt?:string|null;pending?:string[];failures?:unknown[]}>,now=new Date()) {
 const today=Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate());
 return (['daily','weekly'] as const).map(cadence=>{
  const state=states[cadence];
  if(!state?.lastCompleteAt)return {cadence,due:true,reason:'never_completed',overdueDays:null};
  const last=new Date(state.lastCompleteAt);
  const next=Date.UTC(last.getUTCFullYear(),last.getUTCMonth(),last.getUTCDate()+(cadence==='daily'?1:7));
  const overdueDays=Math.max(0,Math.floor((today-next)/86400000));
  const recovery=Boolean(state.pending?.length||state.failures?.length);
  return {cadence,due:recovery||today>=next,reason:recovery?'recovery_needed':today>=next?'due':'not_due',overdueDays};
 });
}
export async function verifyRisScheduler(req:Request):Promise<Response|null>{
 if(Deno.env.get('FIB_RIS_AUTOMATION_ENABLED')!=='true')return reply({error:'scheduler_disabled'},503);
 const expected=Deno.env.get('FIB_RIS_SCHEDULER_TOKEN');
 const provided=req.headers.get('x-fib-ris-scheduler');
 if(!expected||expected.length<32||!provided)return reply({error:'scheduler_forbidden'},403);
 const enc=new TextEncoder();
 const hashes=await Promise.all([crypto.subtle.digest('SHA-256',enc.encode(expected)),crypto.subtle.digest('SHA-256',enc.encode(provided))]);
 const a=new Uint8Array(hashes[0]),b=new Uint8Array(hashes[1]);
 let delta=0;for(let i=0;i<a.length;i++)delta|=a[i]^b[i];
 return delta===0?null:reply({error:'scheduler_forbidden'},403);
}
export async function handleRis(req:Request,mode:'interactive'|'scheduler'='interactive'){
 if(mode==='scheduler'){
  const denied=await verifyRisScheduler(req);
  if(denied)return denied;
 }

 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(req.method!=='POST')return reply({error:'method_not_allowed'},405);
 const auth=req.headers.get('authorization');if(mode==='interactive'&&!auth?.startsWith('Bearer '))return reply({error:'authentication_required'},401);
 const base=Deno.env.get('SUPABASE_URL'),anon=Deno.env.get('SUPABASE_ANON_KEY'),dbUrl=Deno.env.get('FIB_DATABASE_URL');
 if(!base||!anon||!dbUrl)return reply({error:'runtime_not_configured'},503);
 let interactiveUserId:string|null=null;
 if(mode==='interactive'){
  const verification=await fetch(base+'/auth/v1/user',{headers:{apikey:anon!,authorization:auth!}});
  if(!verification.ok)return reply({error:'invalid_auth'},403);
  const user=await verification.json() as {id:string};
  let claims:{sub?:string;aal?:string};
  try{claims=JSON.parse(atob(auth!.slice(7).split('.')[1].replace(/-/g,'+').replace(/_/g,'/')))}catch{return reply({error:'invalid_claims'},403)}
  if(claims.sub!==user.id||claims.aal!=='aal2')return reply({error:'mfa_required'},403);
  interactiveUserId=user.id;
 }
 const sql=postgres(dbUrl,{max:1,prepare:false,connect_timeout:5,idle_timeout:5});
 let failureScope:string|null=null, failureCadence:'daily'|'weekly'='daily';
 async function recordStructureFailure(error:unknown){
  if(!failureScope)return;
  try{await sql.begin(async tx=>{
   const stamp=new Date().toISOString(),detail=String(error).slice(0,180);
   await tx.unsafe("insert into fib.source_runs(scope_id,started_at,completed_at,status,error_detail,cadence) values($1,$2,$2,'failed',$3,$4)",[failureScope,stamp,detail,failureCadence]);
   await tx.unsafe('update fib.source_scopes set last_attempt_at=$2,gap_since=coalesce(gap_since,$2),last_error=$3,updated_at=now() where id=$1',[failureScope,stamp,detail]);
  });}catch{/* Original failure remains visible in HTTP response; never advance checkpoint. */}
 }
 try{
  if(mode==='interactive'){
   const allowed=await sql.unsafe("select 1 from fib.app_users where user_id=$1::uuid and role='admin' and active=true and setup_status='active' limit 1",[interactiveUserId]);
   if(!allowed.length)return reply({error:'admin_required'},403);
  }
  const payload=await req.json().catch(()=>({})) as {commit?:boolean;pdfBackfill?:boolean;cadence?:'daily'|'weekly'};
  const structureEnabled=Deno.env.get('FIB_RIS_STRUCTURE_ENABLED')==='true';
  const backfill=payload.pdfBackfill===true && payload.commit===true;
  if(payload.cadence && payload.cadence!=='daily'&&payload.cadence!=='weekly')return reply({error:'invalid_cadence'},400);
  const cadence=payload.cadence??'daily';
  const scopes=await sql.unsafe("select id from fib.source_scopes where scope_key='ris-dokumentliste' and status='candidate'");
  if(scopes.length!==1)throw new Error('ris_scope_unavailable');
  const scopeId=scopes[0].id as string;
  if(structureEnabled&&payload.commit===true){failureScope=scopeId;failureCadence=cadence;}
  const rows=await sql.unsafe('select cursor_state from fib.ris_scan_cursors where scope_id=$1::uuid',[scopeId]);
  const previous=rows[0]?.cursor_state as {pending:string[];visited:string[];documents:string[];pdfOffset?:number;releaseViews?:{url:string;releaseSince:string|null;checkedAt:string}[];failures:{url:string;error:string}[]; cadenceStates?:Record<string,{pending:string[];visited:string[];failures:{url:string;error:string}[];releaseViews:{url:string;releaseSince:string|null;checkedAt:string}[];lastCompleteAt:string|null;lastFailedAt?:string|null;lastStatus?:'succeeded'|'partial'|'failed';lastError?:string|null}>} | undefined;
  const structureState=(previous as any)?.structureState as {queue:string[];visited:string[];sessions:string[]}|undefined;
  const previousSerialized=previous?JSON.stringify(previous):null;
  if(mode==='scheduler'){
   const checks=dueStatus(previous?.cadenceStates??{});
   if(!(structureEnabled&&structureState?.queue.length)&&!checks.find(x=>x.cadence===cadence)?.due)return reply({mode:'scheduler',skipped:'not_due',dueChecks:checks});
  }
  if(backfill && (!previous || previous.pending.length!==0 || previous.failures.length!==0))return reply({error:'backfill_requires_completed_ris_scan'},409);
  const priorState=previous?.cadenceStates?.[cadence];
  const activeState=priorState??(previous && !previous.cadenceStates?{pending:previous.pending,visited:previous.visited,failures:previous.failures,releaseViews:previous.releaseViews??[],lastCompleteAt:null}:undefined);
  const cycleRestart=Boolean(!backfill && activeState && activeState.pending.length===0 && activeState.failures.length===0 && !(structureEnabled&&structureState?.queue.length));
  const structureQueue=structureEnabled?[...(cycleRestart?(structureState?.sessions??[]):(structureState?.queue??[]))]:[];
  const structureVisited=new Set<string>(cycleRestart?[]:structureState?.visited??[]);
  const sessionUrls=new Set<string>(structureState?.sessions??[]);
  const snapshots:Awaited<ReturnType<typeof parseRisStructure>>[]=[];
  const visited=new Set(cycleRestart?[]:(activeState?.visited??[]));
  const canonicalDocument=(u:string)=>{if(!structureEnabled)return u;const canonical=risUrl(u);if(!canonical||new URL(canonical).pathname!=='/getfile.asp')throw Error('invalid_document_cursor');return canonical;};
  const previousDocuments=(previous?.documents??[]).map(canonicalDocument);
  const knownDocs=new Set(previousDocuments);
  const pending=[...(backfill?[]:cycleRestart?[entry]:(activeState?.pending?.length?activeState.pending:[entry]))];
  const known=new Set([...visited,...pending]);
  const failures=[...(activeState?.failures??[])];
  const releaseViews=new Map((activeState?.releaseViews??[]).map(x=>[x.url,x]));
  let processed=0;
  while(pending.length && processed<2){
   const u=valid(pending.shift()!);
   if(!u||new URL(u).pathname.toLowerCase()!=='/do0040.asp')throw new Error('invalid_cursor_url');
   processed++;
   try{
    const result=await page(u);
    if(!result.docs.length&&!result.navigation.length)throw new Error('empty_release_page');
    if(structureEnabled)for(const linked of result.structureLinks)if(!structureVisited.has(linked)&&!structureQueue.includes(linked))structureQueue.push(linked);
    result.docs.forEach(x=>knownDocs.add(canonicalDocument(x)));visited.add(u);
    releaseViews.set(u,{url:u,releaseSince:result.releaseSince,checkedAt:new Date().toISOString()});
    for(let i=failures.length-1;i>=0;i--)if(failures[i].url===u)failures.splice(i,1);
    for(const linked of result.navigation)if(!known.has(linked)){known.add(linked);pending.push(linked);}
   }catch(err){failures.push({url:u,error:String(err).slice(0,140)});pending.push(u);break;}
  }
  if(structureEnabled){
   for(let i=0;i<2&&structureQueue.length;i++){
    const url=structureQueue.shift()!;
    const safe=risUrl(url);if(!safe||!/^\/(?:si|vo)\d+\.asp$/.test(new URL(safe).pathname))throw Error('invalid_structure_cursor');
    const response=await fetch(safe,{redirect:'error',signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw Error('ris_structure_http_'+response.status);
    const html=await response.text();
    if(new URL(safe).searchParams.has('__ksinr')){
     const snapshot=await parseRisStructure(html,safe,new Date().toISOString());snapshots.push(snapshot);sessionUrls.add(safe);
     for(const d of [...snapshot.documents,...snapshot.agenda.flatMap(a=>a.documents)])knownDocs.add(d.url);
    }else{
     const sessions=risSessionLinks(html,safe);if(!sessions.length)throw Error('proposal_session_unresolved');
     for(const u of sessions)if(!structureVisited.has(u)&&!structureQueue.includes(u))structureQueue.push(u);
    }
    structureVisited.add(safe);
   }
  }
  const current={pending,visited:[...visited],documents:[...knownDocs],failures,pdfOffset:previous?.pdfOffset??0,releaseViews:[...releaseViews.values()]};
  const complete=pending.length===0&&!failures.length&&structureQueue.length===0;
  const coverageResult=coverage(current.releaseViews,current.visited,current.pending,current.failures,cadence);
  const runStatus=complete?'succeeded':failures.length?'failed':'partial';
  const cadenceStates={...(previous?.cadenceStates??{}),[cadence]:{pending:current.pending,visited:current.visited,failures:current.failures,releaseViews:current.releaseViews,lastCompleteAt:complete?new Date().toISOString():(activeState?.lastCompleteAt??null),lastFailedAt:failures.length?new Date().toISOString():(activeState?.lastFailedAt??null),lastStatus:runStatus,lastError:failures.length?failures[0]?.error??'RIS-Abruffehler':null}};
  const activeErrors=Object.entries(cadenceStates).filter(([,v])=>v.failures.length>0).map(([key])=>key);
  const sourceError=activeErrors.length?'RIS-Prüflücke: '+activeErrors.join(', '):null;
  const stored={...current,cadenceStates,...(structureEnabled?{structureState:{queue:structureQueue,visited:[...structureVisited],sessions:[...sessionUrls]}}:structureState?{structureState}:{})};
  const newly=current.documents.filter(x=>!previousDocuments.includes(x));
  if(payload.commit!==true)return reply({mode:'dry_run',processed,documents:current.documents.length,newCount:newly.length,pending:pending.length,complete,failures:failures.length,cycleRestart,firstFailure:failures[0]?.error??null,releaseViews:current.releaseViews,...coverageResult,cadenceStates,dueChecks:dueStatus(cadenceStates)});
  const pdfs:{url:string;hash:string;text:string|null}[]=[];
  const target=current.documents.length;
  const budget=backfill?Math.min(6,Math.max(0,target-current.pdfOffset)):Math.min(6,target);
  for(let i=0;i<budget;i++){
   const idx=(current.pdfOffset+i)%target;
   const url=current.documents[idx];
   try{pdfs.push({url,...await pdfHash(url,structureEnabled)});}catch(e){await recordStructureFailure(e);return reply({error:'ris_pdf_check_failed',detail:String(e).slice(0,180),url},422);}
  }
  current.pdfOffset=backfill?current.pdfOffset+budget:(target?(current.pdfOffset+budget)%target:0);
  stored.pdfOffset=current.pdfOffset;
  const previousHashes=pdfs.length?await sql.unsafe('select canonical_url,content_fingerprint from fib.source_observations where scope_id=$1::uuid and canonical_url=any($2::text[])',[scopeId,pdfs.map(x=>x.url)]):[];
  const byUrl=new Map(previousHashes.map(x=>[x.canonical_url as string,x.content_fingerprint as string]));
  const changedCount=pdfs.filter(x=>{const old=byUrl.get(x.url);return Boolean(old && !old.startsWith('ris:') && old!==x.hash)}).length;
  const stamp=new Date().toISOString();
  await sql.begin(async tx=>{
   const locked=await tx.unsafe("select id from fib.source_scopes where id=$1::uuid and status='candidate' for update",[scopeId]);
   if(locked.length!==1)throw new Error('scope_changed');
   const latest=await tx.unsafe('select cursor_state from fib.ris_scan_cursors where scope_id=$1::uuid',[scopeId]);
   if((latest.length?JSON.stringify(latest[0].cursor_state):null)!==previousSerialized)throw new Error('cursor_changed_retry');
   for(const snapshot of snapshots)await persistRisStructure(tx,snapshot);
   for(const pdf of pdfs)if(structureEnabled)await persistRisDocument(tx,pdf.url,pdf.hash,pdf.text,'unpdf-2.1.0',stamp);
   for(const u of newly){
    const id='ris:'+u;
    await tx.unsafe('insert into fib.source_observations(scope_id,external_id,canonical_url,content_fingerprint,first_seen_at,last_seen_at,revision) values ($1::uuid,$2,$3,$4,$5,$5,1) on conflict(scope_id,external_id) do update set last_seen_at=excluded.last_seen_at',[scopeId,id,u,id,stamp]);
   }
   for(const {url,hash} of pdfs){
     const id='ris:'+url;
     await tx.unsafe(`insert into fib.source_observations(scope_id,external_id,canonical_url,content_fingerprint,first_seen_at,last_seen_at,revision)
       values ($1::uuid,$2,$3,$4,$5,$5,1)
       on conflict(scope_id,external_id) do update set
       revision=case when fib.source_observations.content_fingerprint like 'ris:%' or fib.source_observations.content_fingerprint=excluded.content_fingerprint then fib.source_observations.revision else fib.source_observations.revision+1 end,
       content_fingerprint=excluded.content_fingerprint,last_seen_at=excluded.last_seen_at`,[scopeId,id,url,hash,stamp]);
   }
   await tx.unsafe('insert into fib.ris_scan_cursors(scope_id,cursor_state,updated_at) values ($1::uuid,$2::jsonb,now()) on conflict(scope_id) do update set cursor_state=excluded.cursor_state,updated_at=now()',[scopeId,sql.json(stored)]);
   const reason=failures.length?'RIS window fetch failed':null;
   await tx.unsafe('insert into fib.source_runs(scope_id,started_at,completed_at,status,items_seen,items_new,items_changed,error_detail,cadence) values ($1::uuid,$2,$2,$3,$4,$5,$7,$6,$8)',[scopeId,stamp,runStatus,current.documents.length,newly.length,reason,changedCount,cadence]);
   await tx.unsafe('update fib.source_scopes set last_attempt_at=$2,last_success_at=case when $3 then $2 else last_success_at end,gap_since=case when $4::text is null then null else coalesce(gap_since,$2) end,last_error=$4,updated_at=now() where id=$1::uuid',[scopeId,stamp,complete,sourceError]);
  });
  return reply({mode:'candidate_test',structureEnabled,structurePending:structureQueue.length,structureSessions:snapshots.length,processed,documents:current.documents.length,newCount:newly.length,pending:pending.length,complete,failures:failures.length,cycleRestart,pdfChecked:pdfs.length,pdfChanged:changedCount,releaseViews:current.releaseViews,...coverageResult,cadenceStates,dueChecks:dueStatus(cadenceStates),activeErrors,backfill,backfillRemaining:backfill?Math.max(0,target-current.pdfOffset):null});
 }catch(e){await recordStructureFailure(e);return reply({error:'ris_pilot_failed',detail:String(e).slice(0,180)},502)}
 finally{await sql.end()}
}
export default {fetch(req:Request){return handleRis(req,'interactive')}};