// Test-only gateway: real local Auth, explicit synthetic FIB service fixtures.
import http from 'node:http';
import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import ts from 'typescript';
// Execute the actual production handler, only adapting its Deno import/env for Node.
// Database contains synthetic fixture rows only. No production URL is configurable.
globalThis.Deno = {env:{get(name){return {
  SUPABASE_URL:'http://127.0.0.1:54321', SUPABASE_ANON_KEY:process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  FIB_DATABASE_URL:'postgres://postgres:'+process.env.TEST_DB_PASSWORD+'@127.0.0.1:54323/auth_test'
}[name];}}};
const handlerPath=path.join(process.env.RUNNER_TEMP,'fib-session-context.mjs');
const source=readFileSync('supabase/functions/fib-session-context/index.ts','utf8').replace("'npm:postgres@3.4.7'",JSON.stringify(import.meta.resolve('postgres')));
writeFileSync(handlerPath,ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText);
const membershipHandler=(await import(pathToFileURL(handlerPath).href)).default;

const event = {id:'ff02ffad-e2a5-4724-a94b-073a1483051d',title:'Isolierter Auth-Test',summary:null,status:'confirmed',occurredAt:null};
http.createServer(async(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:4173');
  res.setHeader('Access-Control-Allow-Headers','authorization,apikey,content-type,x-client-info,x-supabase-api-version');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');
  if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
  if(req.url.startsWith('/auth/v1/')){
    const upstream=http.request({hostname:'127.0.0.1',port:9999,path:req.url.slice('/auth/v1'.length),method:req.method,headers:req.headers},response=>{
      for(const [key,value] of Object.entries(response.headers)) if(!key.startsWith('access-control-')) res.setHeader(key,value);
      res.writeHead(response.statusCode);response.pipe(res);
    });
    upstream.on('error',()=>{res.writeHead(502);res.end();});req.pipe(upstream);return;
  }
  if(req.url.startsWith('/functions/v1/')){
    const response=await membershipHandler.fetch(new Request('http://127.0.0.1:54321/functions/v1/fib-session-context',{
      method:'POST',headers:{authorization:req.headers.authorization??'','content-type':'application/json'},body:'{}'
    }));
    const body=await response.text();
    if(req.url==='/functions/v1/fib-session-context'||response.status!==200){
      res.setHeader('Content-Type','application/json');res.writeHead(response.status);res.end(body);return;
    }
  }
  const fixtures={
    '/functions/v1/fib-get-event':{ok:true,event},
    '/functions/v1/fib-coordination':{ok:true,state:{lead:null,lock:null,lastEdit:null}}
  };
  res.setHeader('Content-Type','application/json');
  res.writeHead(fixtures[req.url]?200:404);res.end(JSON.stringify(fixtures[req.url]??{error:'unknown test endpoint'}));
}).listen(54321,'127.0.0.1');
