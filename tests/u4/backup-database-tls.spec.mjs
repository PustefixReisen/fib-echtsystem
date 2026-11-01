import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import tls from 'node:tls';
import pg from 'pg';
import {readFileSync} from 'node:fs';
import {target,clientOptions,dumpEnvironment,trustedCA} from '../../scripts/ris-shared-apps/io.mjs';
const host='db.apaubomxffcwtzjimori.supabase.co';
const root=mkdtempSync(join(tmpdir(),'fib-tls-'));
const original={...process.env};
try {
 for(const password of ['p@ss:/?#% &+=','äö漢字\\\'"','literal%40', 'line\nbreak']) {
  const url=`postgresql://postgres:${encodeURIComponent(password)}@${host}:5432/postgres?sslmode=verify-full`;
  const options=clientOptions(url),env=dumpEnvironment(url,{PGHOSTADDR:'evil',PGSERVICE:'evil',PGSSLMODE:'disable',PG_CONTAINER:'test'});
  assert.equal(decodeURIComponent(new URL(options.connectionString).password),password);
  const client=new pg.Client(options);assert.equal(client.password,password);assert.equal(client.ssl.rejectUnauthorized,true);
  assert.equal(env.PGPASSWORD,password);assert.equal(env.PGSSLMODE,'verify-full');
  assert.equal(env.PGHOSTADDR,undefined);assert.equal(env.PGSERVICE,undefined);assert.equal(env.PG_CONTAINER,'test');
  assert.equal(options.ssl.rejectUnauthorized,true);
 }
 for(const url of [undefined,'secret-invalid',`https://postgres:p@${host}/postgres`,`postgres://postgres@${host}/postgres`,`postgres://postgres:p@${host}:6543/postgres`,`postgres://postgres:p@evil.invalid/postgres`,`postgres://postgres:p@${host}/postgres?host=evil.invalid`,`postgres://postgres:%ZZ@${host}/postgres`,`postgres://postgres:p@${host}/postgres#fragment`]) {
  assert.throws(()=>target(url));
 }
 assert.throws(()=>clientOptions(`postgres://postgres:p@${host}/postgres?sslmode=disable`));
 process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';assert.throws(()=>clientOptions(`postgres://postgres:p@${host}/postgres`));delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
 const ca=join(root,'ca.pem');writeFileSync(ca,'invalid');process.env.PGSSLROOTCERT=ca;
 assert.throws(()=>clientOptions(`postgres://postgres:p@${host}/postgres`));
 process.env.PGSSLROOTCERT=join(root,'missing');assert.throws(()=>dumpEnvironment(`postgres://postgres:p@${host}/postgres`));
 const gen=spawnSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-days','1','-keyout',join(root,'key.pem'),'-out',ca,'-subj','/CN=localhost','-addext','subjectAltName=DNS:localhost','-addext','basicConstraints=critical,CA:TRUE'],{stdio:'ignore'});assert.equal(gen.status,0);
 process.env.PGSSLROOTCERT=ca;assert.ok(trustedCA(ca));
 const server=tls.createServer({key:readFileSync(join(root,'key.pem')),cert:readFileSync(ca)},s=>s.end());server.on('tlsClientError',()=>{});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 async function handshake(options){await new Promise((resolve,reject)=>{const s=tls.connect({port:server.address().port,host:'127.0.0.1',...options});s.once('secureConnect',()=>{s.end();resolve();});s.once('error',reject);});}
 try {
  await handshake({...clientOptions(`postgres://postgres:p@${host}/postgres`).ssl,servername:'localhost'});
  await assert.rejects(handshake({...clientOptions(`postgres://postgres:p@${host}/postgres`).ssl,servername:'wrong.invalid'}));
  await assert.rejects(handshake({rejectUnauthorized:true,servername:'localhost'}));
 } finally {await new Promise(r=>server.close(r));}
 const bad=spawnSync(process.execPath,['scripts/backup/prepare-ca.mjs',join(root,'bad.pem')],{env:{...process.env,FIB_BACKUP_DATABASE_CA:'SENSITIVE-synthetic-value'},encoding:'utf8'});assert.notEqual(bad.status,0);assert.ok(!(bad.stdout+bad.stderr).includes('SENSITIVE-synthetic-value'));
 console.log('PASS encoded credentials, libpq environment, target guards, CA and actual TLS identity checks. No Shared-Apps connection.');
} finally {process.env=original;rmSync(root,{recursive:true,force:true});}
