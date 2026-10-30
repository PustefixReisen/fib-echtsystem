import postgres from 'npm:postgres@3.4.7';

const endpoint='https://www.feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen';
const base='https://www.feldkirchen.de';
const scopeKey='gemeinde-nachrichten';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'cache-control':'no-store'}});
async function sha(s:string) {
  const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
function extractLinks(html:string) {
  const items=new Map<string,string>();
  const re=/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for(const match of html.matchAll(re)) {
    try {
      const url=new URL((match[1]??'').replace(/&amp;/g,'&'),endpoint);
      if(url.protocol!=='https:' || url.origin!==base || !url.pathname.startsWith('/aktuelles/aktuelle-news/aktuelle-meldungen/') || url.pathname.endsWith('/nachrichten-archiv')) continue;
      const title=(match[2]??'').replace(/<[^>]*>/g,' ').trim();
      if(title)items.set(url.href,title);
    }catch{}
  }
  return [...items.keys()];
}
async function fetchHtml(url:string){
  const response=await fetch(url,{signal:AbortSignal.timeout(15000),headers:{accept:'text/html','user-agent':'FIB-U4-Integration/0.1'}});
  if(!response.ok)throw new Error('HTTP '+response.status);
  const type=response.headers.get('content-type')??'';
  if(!type.toLowerCase().includes('html'))throw new Error('not_HTML');
  const html=await response.text();
  if(!html.includes('<html') && !html.includes('<!DOCTYPE'))throw new Error('invalid_HTML');
  return html;
}
export default {
 async fetch(req:Request){
  if(req.method!=='POST')return json({error:'method_not_allowed'},405);
  const auth=req.headers.get('authorization');
  if(!auth?.startsWith('Bearer '))return json({error:'authentication_required'},401);
  const baseUrl=Deno.env.get('SUPABASE_URL'),anon=Deno.env.get('SUPABASE_ANON_KEY'),dbUrl=Deno.env.get('FIB_DATABASE_URL');
  if(!baseUrl||!anon||!dbUrl)return json({error:'runtime_not_configured'},503);
  const verify=await fetch(baseUrl+'/auth/v1/user',{headers:{apikey:anon,authorization:auth}});
  if(!verify.ok)return json({error:'invalid_auth'},403);
  const user=await verify.json() as {id:string};
  const sql=postgres(dbUrl,{max:1,prepare:false,connect_timeout:5,idle_timeout:5});
  try{
   const allowed=await sql.unsafe("select 1 from fib.app_users where user_id=$1::uuid and role='admin' and active=true and setup_status='active' limit 1",[user.id]);
   if(!allowed.length)return json({error:'admin_required'},403);
   const payload=await req.json().catch(()=>({})) as {commit?:boolean};
   const html=await fetchHtml(endpoint);
   const links=extractLinks(html);
   if(links.length<1 || links.length>50)throw new Error('unexpected_listing_count');
   const observed: {url:string;fingerprint:string}[]=[];
   for(const url of links){
     const detail=await fetchHtml(url);
     observed.push({url,fingerprint:await sha(detail.replace(/\s+/g,' '))});
   }
   if(payload.commit!==true)return json({mode:'dry_run',scopeKey,detected:observed.length,urls:observed.map(x=>x.url)});
   const now=new Date().toISOString();
   const result=await sql.begin(async tx=>{
     const scopes=await tx.unsafe("select id from fib.source_scopes where scope_key=$1 and status='candidate' for update",[scopeKey]);
     if(scopes.length!==1)throw new Error('scope_must_be_candidate');
     const scopeId=scopes[0].id as string;
     let newCount=0,changedCount=0;
     for(const x of observed){
       const externalId='gemeinde:'+x.url;
       const prior=await tx.unsafe("select content_fingerprint,revision from fib.source_observations where scope_id=$1::uuid and external_id=$2",[scopeId,externalId]);
       const revision=prior.length?(prior[0].content_fingerprint===x.fingerprint?prior[0].revision:prior[0].revision+1):1;
       if(!prior.length)newCount++;
       else if(prior[0].content_fingerprint!==x.fingerprint)changedCount++;
       await tx.unsafe("insert into fib.source_observations(scope_id,external_id,canonical_url,content_fingerprint,first_seen_at,last_seen_at,revision) values($1::uuid,$2,$3,$4,$5,$5,$6) on conflict(scope_id,external_id) do update set canonical_url=excluded.canonical_url,content_fingerprint=excluded.content_fingerprint,last_seen_at=excluded.last_seen_at,revision=excluded.revision",[scopeId,externalId,x.url,x.fingerprint,now,revision]);
     }
     await tx.unsafe("insert into fib.source_runs(scope_id,started_at,completed_at,status,items_seen,items_new,items_changed) values($1::uuid,$2,$2,'succeeded',$3,$4,$5)",[scopeId,now,observed.length,newCount,changedCount]);
     await tx.unsafe("update fib.source_scopes set last_success_at=$2,last_attempt_at=$2,gap_since=null,last_error=null,updated_at=now() where id=$1::uuid",[scopeId,now]);
     return {scopeKey,seen:observed.length,newCount,changedCount};
   });
   return json({mode:'candidate_test',...result});
  }catch(error){return json({error:'source_probe_failed',detail:String(error).slice(0,180)},502)}
  finally{await sql.end()}
 }
};
