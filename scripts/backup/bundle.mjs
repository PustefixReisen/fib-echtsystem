import {readdirSync,lstatSync,readFileSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {privatePath} from '../ris-shared-apps/io.mjs';
export const hash=b=>createHash('sha256').update(b).digest('hex');
function files(root,prefix=''){
 const result=[];
 for(const name of readdirSync(join(root,prefix)).sort()){
  const p=join(prefix,name),s=lstatSync(join(root,p));
  if(s.isSymbolicLink()||!s.isFile()&&!s.isDirectory())throw Error('Unsupported backup entry');
  if(s.isDirectory())result.push(...files(root,p));else result.push(p);
 }
 return result;
}
export function verify(root,commit,now=Date.now()){
 const m=JSON.parse(readFileSync(join(root,'release.json')));
 if(m.format!==1||m.project!=='apaubomxffcwtzjimori'||m.commit!==commit||!Number.isFinite(Date.parse(m.createdAt))||now-Date.parse(m.createdAt)>3600000||Date.parse(m.createdAt)>now+60000)throw Error('Wrong target, commit or expired backup');
 const actual=files(root).filter(p=>p!=='release.json');
 if(JSON.stringify(actual)!==JSON.stringify(Object.keys(m.files).sort()))throw Error('Incomplete or extra backup files');
 for(const p of actual)if(hash(readFileSync(join(root,p)))!==m.files[p])throw Error('Backup checksum mismatch');
 for(const p of ['database/fib.dump','database/manifest.json','database/auth-ids.json','frontend/index.html','configuration/state.json','configuration/evidence.json','edge/inventory.json'])if(!actual.includes(p))throw Error('Missing required component');
 const db=JSON.parse(readFileSync(join(root,'database/manifest.json')));
 if(db.schema!=='fib'||db.project!=='apaubomxffcwtzjimori'||!db.aclIncluded||db.containsAuthSecrets!==false||!Object.keys(db.tableCounts??{}).length)throw Error('Invalid schema backup');
 for(const [p,digest] of Object.entries(db.files))if(!['fib.dump','auth-ids.json'].includes(p)||hash(readFileSync(join(root,'database',p)))!==digest)throw Error('Invalid database manifest');
 if(Object.keys(db.files).length!==2||readFileSync(join(root,'database/fib.dump')).subarray(0,5).toString()!=='PGDMP')throw Error('Invalid custom dump');
 const inventory=JSON.parse(readFileSync(join(root,'edge/inventory.json')));
 if(!Array.isArray(inventory)||!inventory.length||inventory.some(f=>!/^fib-[a-z0-9-]+$/.test(f.slug)||!Number.isInteger(f.version)||typeof f.verify_jwt!=='boolean'||!actual.includes('edge/'+f.slug+'/index.ts')))throw Error('Incomplete edge inventory');
 const evidence=JSON.parse(readFileSync(join(root,'configuration/evidence.json')));
 if(evidence.commit!==commit||!['databaseRestore','edgeExport','frontendExport','configurationCapture'].every(k=>evidence[k]===true))throw Error('Missing operator verification');
 return m;
}
export function seal(root,commit){
 privatePath(root);if(!/^[a-f0-9]{40}$/.test(commit))throw Error('Full release commit required');
 const entries=files(root);if(entries.includes('release.json'))throw Error('Already sealed');
 const m={format:1,project:'apaubomxffcwtzjimori',commit,createdAt:new Date().toISOString(),files:Object.fromEntries(entries.map(p=>[p,hash(readFileSync(join(root,p)))]))};
 writeFileSync(join(root,'release.json'),JSON.stringify(m,null,2),{mode:0o600,flag:'wx'});
 try{verify(root,commit);}catch{throw Error('Bundle incomplete; do not upload or deploy');}
 return hash(readFileSync(join(root,'release.json')));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
 const [action,root,commit]=process.argv.slice(2);privatePath(root);
 if(action==='seal')console.log(seal(root,commit));
 else if(action==='verify'){const expected=process.env.FIB_BACKUP_MANIFEST_SHA256;if(!expected||hash(readFileSync(join(root,'release.json')))!==expected)throw Error('Reviewed manifest checksum required');verify(root,commit);console.log('Private release backup verified');}
 else throw Error('Use seal|verify PRIVATE_DIRECTORY FULL_RELEASE_COMMIT');
 }catch{console.error('Backup validation failed; no deployment permitted. Inspect private inputs.');process.exitCode=1;}
}
