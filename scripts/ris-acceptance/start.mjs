import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, chmodSync, rmSync, openSync, closeSync, lstatSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { randomBytes } from 'node:crypto';
import { createServer } from 'node:net';
const repo=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
process.chdir(repo);process.umask(0o077);
const command=process.argv[2]??'start';
if(['help','--help','-h'].includes(command)){console.log('npm run acceptance:ris -- start [--fixtures]\nBeenden: Ctrl+C; gleicher Start setzt den privaten Bestand fort.\nLöschen: npm run acceptance:ris -- reset --confirm=RESET_LOCAL_ACCEPTANCE');process.exit(0);}
const root=resolve(process.env.FIB_ACCEPTANCE_STATE_DIR??join(homedir(),'.local/state/fib-ris-acceptance'));
if(root===repo||root.startsWith(repo+'/')||root==='/'||root===homedir())throw Error('Privater Zustand muss außerhalb des Repositorys liegen.');
if(existsSync(root)){
 if(lstatSync(root).isSymbolicLink())throw Error('Zustandsordner darf kein Symlink sein.');
 if(!existsSync(join(root,'config.json'))&&readdirSync(root).length)throw Error('Nur einen eigenen leeren Zustandsordner verwenden.');
}
mkdirSync(root,{recursive:true,mode:0o700});chmodSync(root,0o700);
const configFile=join(root,'config.json'), lock=join(root,'running');
const compose=['compose','--project-name','fib-ris-acceptance','-f',join(repo,'tests/ris-e2e/compose.yml'),'-f',join(repo,'scripts/ris-acceptance/compose.yml')];
let env={...process.env},children=[],stopping=false;
const run=(bin,args,options={})=>new Promise((done,reject)=>{const child=spawn(bin,args,{cwd:repo,env,stdio:'inherit',...options});child.on('error',reject);child.on('exit',code=>code===0?done():reject(Error(bin+' fehlgeschlagen ('+code+'). Private Protokolle prüfen.')));});
const privateJson=(path,value)=>writeFileSync(path,JSON.stringify(value,null,2)+'\n',{mode:0o600});
function launch(bin,args,log){const fd=openSync(join(root,log),'a',0o600);const p=spawn(bin,args,{cwd:repo,env,stdio:['ignore',fd,fd],detached:true});closeSync(fd);p.on('error',()=>{});children.push(p);return p;}
async function ready(url,child){for(let i=0;i<120;i++){if(child.exitCode!==null)throw Error('Lokaler Dienst beendet. Private Protokolle prüfen.');try{if((await fetch(url,{signal:AbortSignal.timeout(1000)})).ok)return;}catch{}await new Promise(r=>setTimeout(r,1000));}throw Error('Lokaler Dienst nicht rechtzeitig erreichbar.');}
async function free(port){await new Promise((ok,no)=>{const s=createServer();s.once('error',()=>no(Error('Port '+port+' ist belegt. Bestehende Umgebung zuerst beenden.')));s.listen(port,'127.0.0.1',()=>s.close(ok));});}
async function stop(){if(stopping)return;stopping=true;for(const p of children)try{process.kill(-p.pid,'SIGTERM');}catch{}await new Promise(r=>setTimeout(r,500));for(const p of children)try{process.kill(-p.pid,'SIGKILL');}catch{}if(existsSync(configFile))spawnSync('docker',[...compose,'stop'],{cwd:repo,env,stdio:'ignore',timeout:30000});rmSync(lock,{recursive:true,force:true});}
if(!['start','reset'].includes(command))throw Error('Aufruf: npm run acceptance:ris -- start [--fixtures] oder reset --confirm=RESET_LOCAL_ACCEPTANCE');
if(existsSync(lock))throw Error('Umgebung läuft oder wurde hart beendet. Zuerst Prozesse/Docker prüfen; danach nur den privaten running-Ordner entfernen.');
let config=existsSync(configFile)?JSON.parse(readFileSync(configFile,'utf8')):null;
if(config&&(config.kind!=='fib-local-acceptance-v1'||config.stateRoot!==root))throw Error('Unbekannter Zustandsordner.');
if(command==='reset'){
 if(!config||!process.argv.includes('--confirm=RESET_LOCAL_ACCEPTANCE'))throw Error('Löschen erfordert bestehenden lokalen Zustand und --confirm=RESET_LOCAL_ACCEPTANCE.');
 env={...env,TEST_DB_PASSWORD:config.dbPassword,TEST_JWT_SECRET:config.jwtSecret};
 await run('docker',[...compose,'down','--volumes','--remove-orphans']);
 rmSync(root,{recursive:true});console.log('Nur der lokale Abnahmebestand wurde gelöscht.');process.exit(0);
}
for(const key of ['FIB_DATABASE_URL','SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','VITE_SUPABASE_URL','VITE_SUPABASE_PUBLISHABLE_KEY','GITHUB_ENV','GITHUB_SHA'])delete env[key];
if(Number(process.versions.node.split('.')[0])<22)throw Error('Node.js 22 oder neuer erforderlich.');
if(spawnSync('docker',['compose','version'],{stdio:'ignore'}).status!==0)throw Error('Docker mit Compose erforderlich. Einrichtung siehe technische Abnahmeanleitung.');
await Promise.all([4173,54321,54323,9999,54324].map(free));
if(config&&!config.initialized)throw Error('Unvollständiger Erststart. Private Protokolle prüfen; bei Bedarf ausdrücklich lokalen Bestand zurücksetzen.');
if(config&&process.argv.includes('--fixtures')&&config.mode!=='fixtures')throw Error('Datenmodus einer bestehenden Abnahme darf nicht stillschweigend wechseln.');
mkdirSync(lock,{mode:0o700});
if(!config){config={kind:'fib-local-acceptance-v1',stateRoot:root,mode:process.argv.includes('--fixtures')?'fixtures':'originals',dbPassword:randomBytes(32).toString('hex'),jwtSecret:randomBytes(32).toString('hex'),initialized:false};privateJson(configFile,config);}
env={...env,TEST_DB_PASSWORD:config.dbPassword,TEST_JWT_SECRET:config.jwtSecret,RUNNER_TEMP:root,FIB_TEST_RESULTS_DIR:join(root,'logs')};
mkdirSync(env.FIB_TEST_RESULTS_DIR,{recursive:true,mode:0o700});
process.on('SIGINT',()=>void stop());process.on('SIGTERM',()=>void stop());
try{
 if(!config.initialized){
  if(config.mode==='originals')await run(process.execPath,['scripts/ris-acceptance/originals.mjs']);
  else{
   const python=join(root,'python/bin/python');
   await run('python3',['-m','venv',join(root,'python')]);
   await run(python,['-m','pip','install','reportlab==4.4.3']);
   await run(python,['tests/ris-e2e/pdfs.py']);
  }
 }
 await run('docker',[...compose,'up','-d']);
 if(!config.initialized){
  await run(process.execPath,['tests/ris-e2e/bootstrap.mjs']);
  privateJson(join(root,'ris-scenario.json'),{late:true,approval:false});
 }
 const f=JSON.parse(readFileSync(join(root,'ris-e2e.json'),'utf8'));
 // Anon bootstrap key is regenerated for each local start; user login tokens come from GoTrue.
 process.env.TEST_JWT_SECRET=config.jwtSecret;
 const {jwt}=await import('../../tests/ris-e2e/common.mjs');f.anon=jwt('anon');privateJson(join(root,'ris-e2e.json'),f);
 env={...env,FIB_DATABASE_URL:f.runtime,SUPABASE_URL:'http://127.0.0.1:54321',SUPABASE_ANON_KEY:f.anon,FIB_RIS_STRUCTURE_ENABLED:'true',VITE_SUPABASE_URL:'http://127.0.0.1:54321',VITE_SUPABASE_PUBLISHABLE_KEY:f.anon,VITE_FIB_ACCEPTANCE_MODE:config.mode};
 const gateway=launch('npx',['--yes','deno@2.9.6','run','--no-lock','--node-modules-dir=auto','--allow-env','--allow-read','--allow-write='+env.FIB_TEST_RESULTS_DIR,'--allow-net=127.0.0.1:54321,127.0.0.1:54323,127.0.0.1:9999','tests/ris-e2e/gateway.ts'],'gateway.log');
 await ready('http://127.0.0.1:54321/health',gateway);
 if(!config.initialized){await run(process.execPath,['scripts/ris-acceptance/seed.mjs']);config.initialized=true;privateJson(configFile,config);}
 // Keep the compiled preview and its local key outside the repository.
 await run('npm',['exec','--workspace','@fib/editorial-web','--','vite','build','--outDir',join(root,'web'),'--emptyOutDir']);
 const web=launch('npm',['exec','--workspace','@fib/editorial-web','--','vite','preview','--outDir',join(root,'web'),'--host','127.0.0.1','--port','4173','--strictPort'],'web.log');
 await ready('http://127.0.0.1:4173',web);
 const u=f.users.editor;
 writeFileSync(join(root,'Zugang.txt'),'FIB – ausschließlich lokales Testkonto\nAdresse: http://127.0.0.1:4173\nE-Mail: '+u.email+'\nPasswort: '+u.password+'\nTOTP-Einrichtungsschlüssel: '+u.secret+'\nIn einer Authenticator-App als zeitbasiertes Konto (6 Stellen, 30 Sekunden) eintragen.\nDiese Datei niemals hochladen/versenden. Kein produktives Passwort verwenden.\n',{mode:0o600});
 if(!existsSync(join(root,'Rueckmeldungen.md')))writeFileSync(join(root,'Rueckmeldungen.md'),'# Persönliche FIB-Abnahme\n\nDatenmodus: '+config.mode+'\nDatum / Entwicklungsstand: \n\n## Prüffall / Objekt\n\nBedienhandlung: \nErwartet: \nTatsächlich: \nAuswirkung: \nBewertung (bestätigt / teilweise bestätigt / abweichend / nicht geprüft): \n\nKeine Zugangsdaten oder TOTP-Schlüssel eintragen. Diese Datei bleibt privat.\n',{mode:0o600});
 console.log('\nLokale Abnahme bereit: http://127.0.0.1:4173\nDatenmodus: '+config.mode+'\nPrivater Zugang: '+join(root,'Zugang.txt')+'\nCtrl+C beendet die Dienste und erhält deine Bearbeitungen. Gleicher Start setzt sie fort.\nKein öffentlich erreichbarer Zugang.');
 await new Promise((done,reject)=>{const t=setInterval(()=>{if(stopping){clearInterval(t);done();}else if(children.some(p=>p.exitCode!==null)){clearInterval(t);reject(Error('Ein lokaler Dienst ist ausgefallen. Daten bleiben erhalten; private Protokolle prüfen.'));}},500);});
}catch(e){console.error(e.message);process.exitCode=1;}finally{await stop();}
