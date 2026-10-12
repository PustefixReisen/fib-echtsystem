// Test-only gateway: real local Auth, explicit synthetic FIB service fixtures.
import http from 'node:http';
const event = {id:'ff02ffad-e2a5-4724-a94b-073a1483051d',title:'Isolierter Auth-Test',summary:null,status:'confirmed',occurredAt:null};
http.createServer((req,res)=>{
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
  const fixtures={
    '/functions/v1/fib-get-event':{ok:true,event},
    '/functions/v1/fib-session-context':{ok:true,user:{id:'test-editor',displayName:'Testredaktion',fullName:'Testredaktion',role:'editor'}},
    '/functions/v1/fib-coordination':{ok:true,state:{lead:null,lock:null,lastEdit:null}}
  };
  res.setHeader('Content-Type','application/json');
  res.writeHead(fixtures[req.url]?200:404);res.end(JSON.stringify(fixtures[req.url]??{error:'unknown test endpoint'}));
}).listen(54321,'127.0.0.1');
