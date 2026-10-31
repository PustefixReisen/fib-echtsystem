// Schema-only scope, including FIB ACLs. Snapshot and Auth FK identifiers contain no Auth secrets.
import pg from 'pg';
import {spawnSync} from 'node:child_process';
import {mkdirSync,chmodSync,existsSync,readdirSync,openSync,closeSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {options,target,clientOptions} from './io.mjs';
process.umask(0o077);
const connection=process.env.FIB_MAINTENANCE_DATABASE_URL??process.env.U4_TEST_DATABASE_URL;
const {u,local}=target(connection);
if(typeof options.out!=='string')throw Error('Private --out directory required');
const root=resolve(options.out),repo=process.cwd();if(root===repo||root.startsWith(repo+'/')||root==='/'||existsSync(root)&&readdirSync(root).length)throw Error('Use a new private directory outside Git');
mkdirSync(root,{recursive:true,mode:0o700});chmodSync(root,0o700);
const db=new pg.Client(clientOptions(connection));await db.connect();
try{
 await db.query('begin isolation level repeatable read read only');
 const snapshot=(await db.query('select pg_export_snapshot() s')).rows[0].s;
 const authIds=(await db.query('select user_id from fib.app_users order by user_id')).rows.map(r=>r.user_id);
 const tables=(await db.query("select tablename from pg_tables where schemaname='fib' order by tablename")).rows;
 const tableCounts={};for(const {tablename} of tables)tableCounts[tablename]=Number((await db.query('select count(*) n from fib."'+tablename.replaceAll('"','""')+'"')).rows[0].n);
 const env={...process.env,PGHOST:u.hostname,PGPORT:u.port||'5432',PGDATABASE:u.pathname.slice(1),PGUSER:decodeURIComponent(u.username),PGPASSWORD:decodeURIComponent(u.password),PGSSLMODE:local?'disable':'verify-full'};
 const dump=join(root,'fib.dump'),fd=openSync(dump,'wx',0o600);
 const r=spawnSync('pg_dump',['--schema=fib','--format=custom','--no-owner','--snapshot='+snapshot],{env,stdio:['ignore',fd,'pipe'],timeout:120000});closeSync(fd);
 if(r.status!==0)throw Error('Schema dump failed; verify local PostgreSQL client major and TLS configuration. No secret printed.');
 writeFileSync(join(root,'auth-ids.json'),JSON.stringify(authIds)+'\n',{mode:0o600});
 const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
 const manifest={schema:'fib',project:local?'isolated-test':'apaubomxffcwtzjimori',createdAt:new Date().toISOString(),serverVersion:(await db.query('show server_version')).rows[0].server_version,tableCounts,files:{'fib.dump':sha(dump),'auth-ids.json':sha(join(root,'auth-ids.json'))},containsAuthSecrets:false,aclIncluded:true};
 writeFileSync(join(root,'manifest.json'),JSON.stringify(manifest,null,2)+'\n',{mode:0o600});
 await db.query('rollback');console.log('Private snapshot-consistent fib dump created; no other schema data or Auth secrets exported.');
}finally{await db.end();}
