import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {mkdtempSync,readFileSync,statSync,openSync,closeSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {chromium} from 'playwright';
import pg from 'pg';
import {totp} from './common.mjs';
const root=mkdtempSync(join(tmpdir(),'fib-manual-smoke-'));
const env={...process.env,FIB_ACCEPTANCE_STATE_DIR:root};
let child,browser;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function start(){
 const fd=openSync(root+'.private.log','a',0o600);
 child=spawn(process.execPath,['scripts/ris-acceptance/start.mjs','start','--fixtures'],{env,stdio:['ignore',fd,fd]});closeSync(fd);
 for(let i=0;i<300;i++){
  if(child.exitCode!==null)throw Error('Manueller Start fehlgeschlagen; privates Protokoll prüfen.');
  if(existsSync(join(root,'Zugang.txt')))try{if((await fetch('http://127.0.0.1:4173')).ok)return;}catch{}
  await wait(1000);
 }
 throw Error('Manuelle Umgebung nicht bereit.');
}
async function stop(){if(!child||child.exitCode!==null)return;child.kill('SIGINT');await Promise.race([new Promise(r=>child.once('exit',r)),wait(45000).then(()=>{throw Error('Manueller Stop fehlgeschlagen');})]);}
async function findings(page){
 const group=page.locator('#nav-recherche');
 if((await group.getAttribute('open'))===null)await group.locator('summary').click();
 await group.getByRole('button',{name:'Fundstellen',exact:true}).click();
}
async function login(){
 const f=JSON.parse(readFileSync(join(root,'ris-e2e.json'),'utf8'));
 const context=await browser.newContext();await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 const page=await context.newPage();page.setDefaultTimeout(20000);
 await page.goto('http://127.0.0.1:4173');
 await page.getByRole('note').filter({hasText:'Synthetische PDF-Testdaten'}).waitFor();
 await page.getByLabel('E-Mail',{exact:true}).fill(f.users.editor.email);
 await page.getByLabel('Passwort',{exact:true}).fill(f.users.editor.password);
 await page.getByRole('button',{name:'Anmelden',exact:true}).click();
 await page.getByRole('button',{name:'MFA bestätigen',exact:true}).waitFor();
 await wait(31000-Date.now()%30000);
 await page.locator('input[autocomplete="one-time-code"]').fill(totp(f.users.editor.secret));
 await page.getByRole('button',{name:'MFA bestätigen',exact:true}).click();
 await page.locator('.side-nav').getByRole('button',{name:'Sitzungen',exact:true}).waitFor();
 return {page,context,f};
}
try{
 await start();browser=await chromium.launch();
 const {page,context,f}=await login();
 for(const file of ['config.json','ris-e2e.json','Zugang.txt'])assert.equal(statSync(join(root,file)).mode&0o777,0o600);
 assert.equal(statSync(root).mode&0o777,0o700);
 const db=new pg.Client({connectionString:f.runtime});await db.connect();
 assert.equal((await db.query('select count(*) n from fib.ris_decision_points')).rows[0].n,'4');
 assert.equal((await db.query('select count(*) n from fib.ris_minutes_approvals')).rows[0].n,'0');
 await db.end();
 await page.locator('.side-nav').getByRole('button',{name:'Sitzungen',exact:true}).click();
 await page.locator('.work-item').filter({hasText:'GR/439/2026'}).getByRole('button',{name:'Sitzung öffnen'}).click();
 const top6=await page.getByLabel('Tagesordnungspunkt',{exact:true}).locator('option').filter({hasText:/^TOP 6\b/}).getAttribute('value');
 await page.getByLabel('Tagesordnungspunkt',{exact:true}).selectOption(top6);
 assert.equal(await page.locator('section').filter({has:page.getByRole('heading',{name:'Tatsächliche Beschlüsse',exact:true})}).locator('article').count(),2);
 await findings(page);
 await page.locator('.work-item').filter({hasText:'Gemeinde Feldkirchen'}).getByRole('button',{name:'Fundstelle öffnen',exact:true}).click();
 await page.getByLabel('Titel der Fundstelle *',{exact:true}).fill('Persönlicher Abnahmefortschritt – Speicherung prüfen');
 await page.getByRole('button',{name:'Fundstelle ausdrücklich übernehmen'}).click();
 await page.getByText('Fundstelle übernommen.',{exact:false}).waitFor();
 await context.close();await stop();
 console.log('PASS manual launcher, private credentials, actual browser login/MFA and prepared reference decisions');
 await start();const next=await login();
 assert.equal(next.f.users.editor.password,f.users.editor.password);
 await findings(next.page);
 await next.page.getByText('Persönlicher Abnahmefortschritt – Speicherung prüfen',{exact:true}).waitFor();
 const resumed=new pg.Client({connectionString:next.f.runtime});await resumed.connect();
 assert.equal((await resumed.query('select count(*) n from fib.ris_decision_points')).rows[0].n,'4');
 assert.equal((await resumed.query('select count(*) n from fib.messages')).rows[0].n,'0');await resumed.end();
 await next.context.close();await stop();
 console.log('PASS same manual launcher resumed real PostgreSQL/Auth and preserved editorial changes without reseeding');
}finally{
 if(browser)await browser.close();await stop();
 const r=spawnSync(process.execPath,['scripts/ris-acceptance/start.mjs','reset','--confirm=RESET_LOCAL_ACCEPTANCE'],{env,stdio:'ignore'});
 assert.equal(r.status,0,'Local test reset must succeed');
}
