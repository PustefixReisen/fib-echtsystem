import assert from 'node:assert/strict';
import pg from 'pg';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
const source=process.env.U4_TEST_DATABASE_URL,container=process.env.PG_CONTAINER,root=process.env.FIB_BACKUP_DIR;
const u=new URL(source);if(!['localhost','127.0.0.1'].includes(u.hostname)||u.pathname!=='/fib_u4_test'||!root||!container||!/^[a-f0-9]+$/.test(container))throw Error('Isolated restore only');
const manifest=JSON.parse(readFileSync(join(root,'manifest.json')));
for(const [name,hash] of Object.entries(manifest.files))assert.equal(createHash('sha256').update(readFileSync(join(root,name))).digest('hex'),hash);
const c=new pg.Client({connectionString:source});await c.connect();await c.query('create database fib_u4_restore');await c.end();
u.pathname='/fib_u4_restore';const db=new pg.Client({connectionString:u.href});await db.connect();
try{
 await db.query("create schema auth;create table auth.users(id uuid primary key);create table public.memorix_sentinel(id int primary key,payload text);insert into public.memorix_sentinel values(1,'restore target unchanged')");
 for(const id of JSON.parse(readFileSync(join(root,'auth-ids.json'))))await db.query('insert into auth.users values($1)',[id]);
 const r=spawnSync('docker',['exec','-i',container,'pg_restore','-U','postgres','-d','fib_u4_restore','--no-owner','--exit-on-error'],{input:readFileSync(join(root,'fib.dump')),encoding:'utf8'});
 if(r.status!==0)throw Error('Isolated schema restore failed: '+r.stderr.slice(0,800));
 for(const [table,n] of Object.entries(manifest.tableCounts))assert.equal(Number((await db.query('select count(*) n from fib."'+table.replaceAll('"','""')+'"')).rows[0].n),n);
 assert.equal((await db.query('select payload from public.memorix_sentinel')).rows[0].payload,'restore target unchanged');
 await db.query('set role fib_runtime');await db.query('select * from fib.development_batches');
 await assert.rejects(()=>db.query('delete from fib.development_objects'));
 await assert.rejects(()=>db.query('select * from public.memorix_sentinel'));await db.query('reset role');
 console.log('PASS snapshot-consistent fib-only dump/restore, all table counts, preserved ACL/RLS and untouched public sentinel; Auth FK stubs only, no Auth restoration');
}finally{await db.end();}
