import postgres from 'npm:postgres@3.4.7';
const origin='https://buergerinfo-feldkirchen.digitalfabrix.de';
const entry=origin+'/do0040.asp?smcmode=32832';
const cors={'access-control-allow-origin':'https://fib.pustivo.de','access-control-allow-headers':'authorization,apikey,x-client-info,content-type','access-control-allow-methods':'POST, OPTIONS'};
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{...cors,'cache-control':'no-store'}});
function valid(href:string,base=entry):string|null{
 try{const u=new URL(href.replace(/&amp;/g,'&'),base);u.hash='';if(u.protocol!=='https:'||u.origin!==origin)return null;return u.href;}catch{return null;}
}
function extract(html:string,url:string){
 const docs=new Set<string>(),navigation=new Set<string>();
 for(const m of html.matchAll(/<a\\b[^>]*href\\s*=\\s*["']([^"']+)["']/gi)){
  const u=valid(m[1]??'',url);if(!u)continue;
  const parsed=new URL(u);
  if(parsed.pathname.toLowerCase()==='/getfile.asp'&&parsed.searchParams.has('id'))docs.add(u);
  if(parsed.pathname.toLowerCase()==='/do0040.asp'&&/^\\d{7}$/.test(parsed.searchParams.get('smcadat')??''))navigation.add(u);
 }
 return {docs:[...docs],navigation:[...navigation]};
}
async function page(url:string){
 const resp=await fetch(url,{signal:AbortSignal.timeout(15000),headers:{accept:'text/html','user-agent':'FIB-U4-RIS-Pilot/0.1'}});
 if(!resp.ok)throw new Error('RIS HTTP '+resp.status);
 const html=await resp.text();if(!/<(?:html|body|a)\\b/i.test(html))throw new Error('RIS invalid HTML');
 return extract(html,url);
}
export default {async fetch(req:Request){
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(req.method!=='POST')return reply({error:'method_not_allowed'},405);
 const auth=req.headers.get('authorization');if(!auth?.startsWith('Bearer '))return reply({error:'authentication_required'},401);
 const base=Deno.env.get('SUPABASE_URL'),anon=Deno.env.get('SUPABASE_ANON_KEY'),dbUrl=Deno.env.get('FIB_DATABASE_URL');
 if(!base||!anon||!dbUrl)return reply({error:'runtime_not_configured'},503);
 const verification=await fetch(base+'/auth/v1/user',{headers:{apikey:anon,authorization:auth}});
 if(!verification.ok)return reply({error:'invalid_auth'},403);
 const user=await verification.json() as {id:string};
 let claims:{sub?:string;aal?:string};
 try{claims=JSON.parse(atob(auth.slice(7).split('.')[1].replace(/-/g,'+').replace(/_/g,'/')))}catch{return reply({error:'invalid_claims'},403)}
 if(claims.sub!==user.id||claims.aal!=='aal2')return reply({error:'mfa_required'},403);
 const sql=postgres(dbUrl,{max:1,prepare:false,connect_timeout:5,idle_timeout:5});
 try{
  const allowed=await sql.unsafe("select 1 from fib.app_users where user_id=$1::uuid and role='admin' and active=true and setup_status='active' limit 1",[user.id]);
  if(!allowed.length)return reply({error:'admin_required'},403);
  const payload=await req.json().catch(()=>({})) as {commit?:boolean};
  const scopes=await sql.unsafe("select id from fib.source_scopes where scope_key='ris-dokumentliste' and status='candidate'");
  if(scopes.length!==1)throw new Error('ris_scope_unavailable');
  const scopeId=scopes[0].id as string;
  const rows=await sql.unsafe('select cursor_state from fib.ris_scan_cursors where scope_id=$1::uuid',[scopeId]);
  const previous=rows[0]?.cursor_state as {pending:string[];visited:string[];documents:string[];failures:{url:string;error:string}[]} | undefined;
  const previousSerialized=previous?JSON.stringify(previous):null;
  const visited=new Set(previous?.visited??[]);
  const knownDocs=new Set(previous?.documents??[]);
  const pending=[...(previous?.pending?.length?previous.pending:[entry])];
  const known=new Set([...visited,...pending]);
  const failures=[...(previous?.failures??[])];
  let processed=0;
  while(pending.length && processed<2){
   const u=valid(pending.shift()!);
   if(!u||new URL(u).pathname.toLowerCase()!=='/do0040.asp')throw new Error('invalid_cursor_url');
   processed++;
   try{
    const result=await page(u);
    if(!result.docs.length&&!result.navigation.length)throw new Error('empty_release_page');
    result.docs.forEach(x=>knownDocs.add(x));visited.add(u);
    for(let i=failures.length-1;i>=0;i--)if(failures[i].url===u)failures.splice(i,1);
    for(const linked of result.navigation)if(!known.has(linked)){known.add(linked);pending.push(linked);}
   }catch(err){failures.push({url:u,error:String(err).slice(0,140)});pending.push(u);break;}
  }
  const current={pending,visited:[...visited],documents:[...knownDocs],failures};
  const complete=pending.length===0&&!failures.length;
  const newly=current.documents.filter(x=>!previous?.documents?.includes(x));
  if(payload.commit!==true)return reply({mode:'dry_run',processed,documents:current.documents.length,newCount:newly.length,pending:pending.length,complete,failures:failures.length});
  const stamp=new Date().toISOString();
  await sql.begin(async tx=>{
   const locked=await tx.unsafe("select id from fib.source_scopes where id=$1::uuid and status='candidate' for update",[scopeId]);
   if(locked.length!==1)throw new Error('scope_changed');
   const latest=await tx.unsafe('select cursor_state from fib.ris_scan_cursors where scope_id=$1::uuid',[scopeId]);
   if((latest.length?JSON.stringify(latest[0].cursor_state):null)!==previousSerialized)throw new Error('cursor_changed_retry');
   for(const u of newly){
    const id='ris:'+u;
    await tx.unsafe('insert into fib.source_observations(scope_id,external_id,canonical_url,content_fingerprint,first_seen_at,last_seen_at,revision) values ($1::uuid,$2,$3,$4,$5,$5,1) on conflict(scope_id,external_id) do update set last_seen_at=excluded.last_seen_at',[scopeId,id,u,id,stamp]);
   }
   await tx.unsafe('insert into fib.ris_scan_cursors(scope_id,cursor_state,updated_at) values ($1::uuid,$2::jsonb,now()) on conflict(scope_id) do update set cursor_state=excluded.cursor_state,updated_at=now()',[scopeId,JSON.stringify(current)]);
   const reason=complete?null:failures.length?'RIS window fetch failed':'Historical scan not yet complete';
   await tx.unsafe('insert into fib.source_runs(scope_id,started_at,completed_at,status,items_seen,items_new,items_changed,error_detail) values ($1::uuid,$2,$2,$3,$4,$5,0,$6)',[scopeId,stamp,complete?'succeeded':'failed',current.documents.length,newly.length,reason]);
   await tx.unsafe('update fib.source_scopes set last_attempt_at=$2,last_success_at=case when $3 then $2 else last_success_at end,gap_since=case when $3 then null else coalesce(gap_since,$2) end,last_error=$4,updated_at=now() where id=$1::uuid',[scopeId,stamp,complete,reason]);
  });
  return reply({mode:'candidate_test',processed,documents:current.documents.length,newCount:newly.length,pending:pending.length,complete,failures:failures.length});
 }catch(e){return reply({error:'ris_pilot_failed',detail:String(e).slice(0,180)},502)}
 finally{await sql.end()}
}};