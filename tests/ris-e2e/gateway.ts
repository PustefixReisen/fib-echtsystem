// Isolated HTTP gateway. Production handlers execute unchanged under Deno.
// Only municipality/RIS HTTP responses and local CORS are test adaptations.
import session from '../../supabase/functions/fib-session-context/index.ts';
import editorial from '../../supabase/functions/fib-editorial-write/index.ts';
import coordination from '../../supabase/functions/fib-coordination/index.ts';
import events from '../../supabase/functions/fib-get-event/index.ts';
import ris from '../../supabase/functions/fib-u4-ris-pilot/index.ts';
import news from '../../supabase/functions/fib-u4-pilot/index.ts';
const root=Deno.env.get('RUNNER_TEMP')!;
const database=new URL(Deno.env.get('FIB_DATABASE_URL')!);
if(database.hostname!=='127.0.0.1'||database.port!=='54323'||database.pathname!=='/fib_u4_test'||database.username!=='fib_app')throw Error('isolated runtime required');
if(Deno.env.get('SUPABASE_URL')!=='http://127.0.0.1:54321')throw Error('isolated Auth required');
const nativeFetch=globalThis.fetch;
const origin='https://buergerinfo-feldkirchen.digitalfabrix.de';
const newsRoot='https://www.feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen';
const article=newsRoot+'/parkraumkonzept-der-gemeinde-feldkirchen';
const html=(s:string)=>new Response(s,{headers:{'content-type':'text/html; charset=utf-8'}});
const read=(p:string)=>Deno.readTextFileSync('tests/u4/fixtures/'+p);
const scenario=()=>JSON.parse(Deno.readTextFileSync(root+'/ris-scenario.json'));
globalThis.fetch=async(input:RequestInfo|URL,init?:RequestInit)=>{
 const url=new URL(input instanceof Request?input.url:String(input));
 if(url.origin==='http://127.0.0.1:54321'&&url.pathname.startsWith('/auth/v1/'))return nativeFetch(input,init);
 const state=scenario();
 let response:Response;
 if(url.origin===origin){
  if(state.outage)throw Error('synthetic source outage');
  if(url.pathname==='/do0040.asp')response=html('Dokumente mit Freigabe seit 01.01.2026 '+[1032,1031].map(id=>`<a href="si0057.asp?__ksinr=${id}">Sitzung</a>`).join('')+[75714,75790,...(state.late?[75785,99001]:[])].map(id=>`<a href="getfile.asp?id=${id}">Dokument</a>`).join(''));
  else if(url.pathname==='/si0057.asp'){
   const id=url.searchParams.get('__ksinr');
   let content=read(id==='1032'?'ris-1032-top-2-3.html':'ris-1031-top-2-3-6.html');
   if(id==='1032'&&state.late)content=content.replace('</body>','<a href="getfile.asp?id=99001">Niederschrift öffentlich – SYNTHETISCHER Genehmigungstest</a></body>');
   if(state.changed&&id==='1032')content=content.replace('GR/440/2026','GR/440/2026<!-- synthetic revision -->');
   response=html(content);
  }else if(url.pathname==='/getfile.asp'){
   const id=url.searchParams.get('id');
   if(!['75714','75790','75785','99001'].includes(id!))throw Error('unlisted fixture PDF');
   response=new Response(Deno.readFileSync(root+'/'+(id==='75714'&&state.changed?'changed':id)+'.pdf'),{headers:{'content-type':'application/pdf'}});
  }else throw Error('unlisted fixture URL');
 }else if(url.href===newsRoot||url.href===newsRoot+'/nachrichten-archiv')response=html(`<a href="${article}">Neues Parkraumkonzept in Feldkirchen</a>`);
 else if(url.href===article){if(state.newsOutage)throw Error('synthetic news outage');response=html(read('gemeinde-detail.html').replace('</main>',(state.newsChanged?'<p>Synthetische nachträgliche Ergänzung.</p>':'')+'</main>'));}
 else throw Error('external network forbidden');
 await Deno.writeTextFile('ris-e2e-results/source-transport.jsonl',JSON.stringify({url:url.href,fixture:true,sha256:Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await response.clone().arrayBuffer()))).map(x=>x.toString(16).padStart(2,'0')).join('')})+'\n',{append:true});
 return response;
};
const handlers:Record<string,{fetch:(req:Request)=>Promise<Response>|Response}>={
 'fib-session-context':session,'fib-editorial-write':editorial,'fib-coordination':coordination,'fib-get-event':events,'fib-u4-ris-pilot':ris,'fib-u4-pilot':news
};
Deno.serve({hostname:'127.0.0.1',port:54321},async(req)=>{
 const url=new URL(req.url);
 const cors={'access-control-allow-origin':'http://127.0.0.1:4173','access-control-allow-headers':'authorization,apikey,content-type,x-client-info,x-supabase-api-version','access-control-allow-methods':'GET,POST,PUT,DELETE,OPTIONS'};
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 let response:Response;
 if(url.pathname==='/health')response=Response.json({isolated:true});
 else if(url.pathname.startsWith('/auth/v1/')){
  const target='http://127.0.0.1:9999'+url.pathname.slice('/auth/v1'.length)+url.search;
  response=await nativeFetch(target,{method:req.method,headers:req.headers,body:['GET','HEAD'].includes(req.method)?undefined:await req.arrayBuffer(),redirect:'manual'});
 }else{
  const name=url.pathname.replace('/functions/v1/','');
  response=handlers[name]?await handlers[name].fetch(req):Response.json({error:'no_test_endpoint'},{status:404});
  await Deno.writeTextFile('ris-e2e-results/http-status.jsonl',JSON.stringify({endpoint:name,status:response.status})+'\n',{append:true});
 }
 const headers=new Headers(response.headers);for(const [k,v]of Object.entries(cors))headers.set(k,v);
 return new Response(response.body,{status:response.status,headers});
});
