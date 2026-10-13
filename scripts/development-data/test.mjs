// Runs only in embedded, disposable PostgreSQL (PGlite), never against Shared-Apps.
// npm install --prefix <scratch> --no-save @electric-sql/pglite@0.3.14
// PGLITE_MODULE=<absolute path to dist/index.js> node scripts/development-data/test.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
const { PGlite } = await import(pathToFileURL(process.env.PGLITE_MODULE).href);
const dir = 'data/development/demo-20261013/';
const manifest = JSON.parse(fs.readFileSync(dir+'manifest.json', 'utf8'));
const sql = fs.readFileSync(dir+'import.sql', 'utf8');
const dry = fs.readFileSync(dir+'dry-run.sql', 'utf8');
const db = new PGlite();
await db.exec('create role anon; create role authenticated; create role service_role; create schema auth; create table auth.users(id uuid primary key);');
await db.exec(fs.readFileSync('supabase/schema/core.sql', 'utf8'));
const sentinel = '11111111-1111-4111-8111-111111111111';
await db.query('insert into fib.events(id,title) values ($1,$2)', [sentinel,'Vorhandenes Testereignis']);
const state = async () => (await db.query(`select jsonb_agg(to_jsonb(t) order by id) as v from fib.events t`)).rows[0].v;
const before = await state();
await db.exec(dry);
assert.deepEqual(await state(),before);
await db.exec(sql);
const first = {};
for (const [table,rows] of Object.entries(manifest.rows)) {
  const all = (await db.query('select to_jsonb(t) as v from fib.'+table+' t order by to_jsonb(t)::text')).rows;
  assert.equal(all.length,rows.length+(table==='events'?1:0));
  first[table]=all;
}
assert.deepEqual((await state()).find(x=>x.id===sentinel),before[0]);
await db.exec(sql);
for (const table of Object.keys(manifest.rows)) {
  assert.deepEqual((await db.query('select to_jsonb(t) as v from fib.'+table+' t order by to_jsonb(t)::text')).rows,first[table]);
}
assert.equal((await db.query("select count(*)::int n from fib.messages where status <> 'draft' or approved_at is not null or published_at is not null")).rows[0].n,0);
assert.equal((await db.query('select count(*)::int n from fib.findings where public_via_fib or publication_rights_confirmed')).rows[0].n,0);
assert.equal((await db.query('select count(*)::int n from fib.topics')).rows[0].n,0);
// Human edits are protected: a second import aborts and does not revert them.
await db.query('update fib.events set title=$1 where id=$2',['Redaktionell geändert',manifest.rows.events[0].id]);
await assert.rejects(db.exec(sql),/Import conflict/);
await db.exec('rollback');
assert.equal((await db.query('select title from fib.events where id=$1',[manifest.rows.events[0].id])).rows[0].title,'Redaktionell geändert');
await db.close();
// Late natural-key collision must roll back earlier inserted sources/findings too.
const db2=new PGlite();
await db2.exec('create role anon; create role authenticated; create role service_role; create schema auth; create table auth.users(id uuid primary key);');
await db2.exec(fs.readFileSync('supabase/schema/core.sql','utf8'));
await db2.query('insert into fib.events(id,title) values ($1,$2)',[sentinel,manifest.rows.events[0].title.replace('[ENTWICKLUNG demo-20261013] ','')]);
await assert.rejects(db2.exec(sql),/Natural-key collision/);
await db2.exec('rollback');
assert.equal((await db2.query('select count(*)::int n from fib.sources')).rows[0].n,0);
assert.equal((await db2.query('select count(*)::int n from fib.events')).rows[0].n,1);
await db2.close();
// A shared minutes document is represented once and linked to both events.
assert.equal(manifest.rows.findings.filter(x=>x.original_url.includes('id=74927&')).length,1);
const minutes=manifest.rows.findings.find(x=>x.original_url.includes('id=74927&')).id;
assert.equal(manifest.rows.event_findings.filter(x=>x.finding_id===minutes).length,2);
const eventIds=new Set(manifest.rows.events.map(x=>x.id));
assert.equal(eventIds.size,7);
assert.equal(manifest.rows.messages.length,eventIds.size);
const statements=sql.replace(/'(?:''|[^'])*'/g,"''").replace(/--[^\n]*/g,'');
assert(!/\b(update|delete|truncate|alter|grant|revoke|create\s+(table|function|trigger))\b/i.test(statements));
assert(!/\b(auth|public)\./i.test(statements));
console.log('PASS: dry-run rollback; counts/FKs; existing row unchanged; idempotence including timestamps; draft/no publication; no automatic topics; edit conflict; late collision atomicity; shared finding; seven distinct events; write scope.');
