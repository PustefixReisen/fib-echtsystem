import {resolve,dirname} from 'node:path';
import {mkdirSync,writeFileSync,existsSync,lstatSync} from 'node:fs';
export const options=Object.fromEntries(process.argv.slice(2).map(s=>s.replace(/^--/,'').split(/=(.*)/s).slice(0,2)).map(([k,v])=>[k,v??true]));
export function privateOutput(path,body){
 const p=resolve(path);const repo=process.cwd();
 if(p===repo||p.startsWith(repo+'/'))throw Error('Private output must be outside Git');
 if(existsSync(p)&&lstatSync(p).isSymbolicLink())throw Error('No symlink output');
 mkdirSync(dirname(p),{recursive:true,mode:0o700});writeFileSync(p,body,{mode:0o600,flag:'wx'});return p;
}
export function target(connection){
 if(!connection)throw Error('Maintenance connection required; never place it in a command argument');
 const u=new URL(connection),local=['localhost','127.0.0.1'].includes(u.hostname)&&u.pathname==='/fib_u4_test'&&u.username==='postgres';
 const shared=(u.hostname==='db.apaubomxffcwtzjimori.supabase.co'&&u.username==='postgres'||u.hostname.endsWith('.pooler.supabase.com')&&u.username==='postgres.apaubomxffcwtzjimori')&&u.pathname==='/postgres';
 if(!local&&!shared)throw Error('Only approved FIB Shared-Apps target or isolated fib_u4_test accepted');return {u,local};
}
