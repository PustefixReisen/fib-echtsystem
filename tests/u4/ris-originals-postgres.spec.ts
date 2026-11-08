import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import pg from "pg";
import {
  parseRisStructure,
  persistRisDocument,
  persistRisStructure,
  RIS_ORIGIN,
  risHash,
} from "../../supabase/functions/_shared/ris-structure.ts";
import { risEditorial } from "../../supabase/functions/_shared/ris-editorial.ts";
import { sourceEditorial } from "../../supabase/functions/_shared/source-editorial.ts";
import {
  readOriginal,
  type RisOriginalStore,
} from "../../supabase/functions/_shared/ris-originals.ts";
const url = process.env.U4_TEST_DATABASE_URL;
if (!url) throw Error("isolated_test_database_required");
const target = new URL(url);
if (
  !["localhost", "127.0.0.1"].includes(target.hostname) ||
  target.pathname !== "/fib_u4_test"
) throw Error("isolated_test_database_required");
const pool = new pg.Pool({ connectionString: url });
const uid = "22222222-2222-4222-8222-222222222222",
  actor = { userId: uid, kind: "human" as const, aal: "aal2" as const };
async function tx<T>(work: (db: any) => Promise<T>) {
  const c = await pool.connect();
  try {
    await c.query("begin");
    await c.query("set local role fib_runtime");
    const r = await work({
      unsafe: async (q: string, p: any[] = []) => (await c.query(q, p)).rows,
    });
    await c.query("commit");
    return r;
  } catch (e) {
    await c.query("rollback");
    throw e;
  } finally {
    c.release();
  }
}
const first = async (q: string, p: any[] = []) =>
  (await pool.query(q, p)).rows[0];
const run = (body: any, identity = actor) =>
  tx((db) => risEditorial(db, identity, body, store));
const files = new Map<string, Uint8Array>();
let puts = 0, gets = 0, fail = false;
const store: RisOriginalStore = {
  put: async (key, bytes) => {
    puts++;
    if (fail) throw Error("synthetic_upload_failure");
    if (files.has(key)) assert.deepEqual(files.get(key), bytes);
    else files.set(key, bytes.slice());
  },
  get: async (key) => {
    gets++;
    if (!files.has(key)) throw Error("missing");
    return files.get(key)!.slice();
  },
  remove: async (key) => {
    files.delete(key);
  },
};
async function main() {
  await pool.query(
    "drop schema if exists fib cascade;drop schema if exists storage cascade;create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);create schema if not exists auth;create table if not exists auth.users(id uuid primary key);",
  );
  for (const r of ["anon", "authenticated", "service_role"]) {
    await pool.query(
      `do $$begin if not exists(select 1 from pg_roles where rolname='${r}')then create role ${r};end if;end$$`,
    );
  }
  await pool.query("insert into auth.users values($1) on conflict do nothing", [
    uid,
  ]);
  const migrations = [
    ...readFileSync("tests/ris-e2e/bootstrap.mjs", "utf8").matchAll(
      /"((?:schema|security|migrations)\/[^"\n]+\.sql)"/g,
    ),
  ].map((m) => m[1]);
  for (const path of migrations.filter((p) => !p.includes("20261102221038") && !p.includes("20261103113500"))) {
    await pool.query(readFileSync("supabase/" + path, "utf8"));
  }
  await pool.query(
    "insert into fib.app_users(user_id,role,setup_status) values($1,'editor','active')",
    [uid],
  );
  const legacy = (await first(
    "insert into fib.ris_documents(source_url) values($1) returning id",
    [RIS_ORIGIN + "/getfile.asp?id=999"],
  )).id;
  await pool.query(
    "insert into fib.ris_document_versions(document_id,content_hash,extracted_text,extraction_method,observed_at) values($1,$2,'legacy text without rights evidence','legacy',now())",
    [legacy, "c".repeat(64)],
  );
  await pool.query(
    readFileSync(
      "supabase/migrations/20261102221038_fib_ris_originals_and_editorial_links.sql",
      "utf8",
    ),
  );
  await pool.query(readFileSync("supabase/migrations/20261103113500_fib_ris_session_top_events.sql","utf8"));
  assert.equal(
    (await first(
      "select extracted_text from fib.ris_document_versions where document_id=$1",
      [legacy],
    )).extracted_text,
    null,
    "Historical unlicensed full text is removed; metadata survives",
  );
  await pool.query(
    "create table if not exists public.ris_377_sentinel(id int primary key,value text);insert into public.ris_377_sentinel values(1,'untouched') on conflict do nothing",
  );
  await pool.query("insert into fib.sources(name,homepage_url) values($1,$2)", [
    "RIS",
    RIS_ORIGIN,
  ]);
  const snapshot = await parseRisStructure(
    readFileSync("tests/u4/fixtures/ris-1032-top-2-3.html", "utf8"),
    RIS_ORIGIN + "/si0057.asp?__ksinr=1032",
    "2026-11-01T00:00:00Z",
  );
  const [a, b] = await Promise.all([
    tx((db) => persistRisStructure(db, snapshot)),
    tx((db) => persistRisStructure(db, snapshot)),
  ]);
  assert.equal(a.sessionId, b.sessionId);
  assert.equal((await first("select count(*)::int n from fib.findings")).n, 2);
  const document = await first(
    "select * from fib.ris_documents where source_url like '%id=75714'",
  );
  assert.equal(document.original_title, "Vorlage");
  const finding = await first("select * from fib.findings where id=$1", [
    document.finding_id,
  ]);
  assert.match(finding.title, /Beschlussvorlage · 29.10.2026 · 5395\/2026/);
  const bytes = new TextEncoder().encode(
      "%PDF-1.4\nsynthetic immutable original",
    ),
    hash = await risHash(bytes),
    stamp = "2026-11-01T01:00:00Z";
  const persist = (content = bytes, time = stamp) =>
    tx((db) =>
      persistRisDocument(
        db,
        document.source_url,
        hash,
        "synthetic extracted text",
        "synthetic-test",
        time,
        { bytes: content, store },
      )
    );
  const id = await persist();
  assert.ok(id);
  assert.equal(puts, 0);
  assert.equal(
    (await first(
      "select extracted_text from fib.ris_document_versions where id=$1",
      [id],
    )).extracted_text,
    null,
  );
  await assert.rejects(
    () => tx((db) => readOriginal(db, id!, store)),
    /not_permitted/,
  );
  assert.equal(gets, 0, "Denied reads never reach Storage");
  await assert.rejects(
    () =>
      run({
        action: "ris_confirm_storage_rights",
        versionId: id,
        contentAuthor: "municipality",
        evidence: "",
      }),
    /invalid_ris/,
  );
  await assert.rejects(
    () =>
      run({
        action: "ris_confirm_storage_rights",
        versionId: id,
        contentAuthor: "municipality",
        evidence: "proof",
      }, { ...actor, aal: "aal1" }),
    /mfa/,
  );
  await run({
    action: "ris_confirm_storage_rights",
    versionId: id,
    contentAuthor: "municipality",
    evidence: "Synthetic test permission; no assertion about the real PDF",
  });
  fail = true;
  await assert.rejects(persist, /synthetic_upload_failure/);
  assert.equal(
    (await first(
      "select pdf_storage_key from fib.ris_document_versions where id=$1",
      [id],
    )).pdf_storage_key,
    null,
  );
  fail = false;
  await Promise.all([persist(), persist()]);
  assert.equal(files.size, 1);
  assert.deepEqual(await tx((db) => readOriginal(db, id!, store)), bytes);
  const v = await first("select * from fib.ris_document_versions where id=$1", [
    id,
  ]);
  assert.equal(v.extracted_text, "synthetic extracted text");
  assert.equal(Number(v.pdf_size), bytes.length);
  await assert.rejects(
    () =>
      pool.query(
        "update fib.ris_document_versions set content_hash=$2 where id=$1",
        [id, "d".repeat(64)],
      ),
    /immutable/,
  );
  await assert.rejects(
    () =>
      pool.query(
        "update fib.ris_document_versions set extracted_text='forged' where id=$1",
        [id],
      ),
    /immutable/,
  );
  files.set(v.pdf_storage_key, new TextEncoder().encode("%PDF-tampered"));
  await assert.rejects(
    () => tx((db) => readOriginal(db, id!, store)),
    /integrity/,
  );
  files.set(v.pdf_storage_key, bytes);
  const changed = new TextEncoder().encode("%PDF-1.4\nchanged original"),
    changedHash = await risHash(changed);
  const newer = await tx((db) =>
    persistRisDocument(
      db,
      document.source_url,
      changedHash,
      "do not store",
      "synthetic-test",
      "2026-11-01T02:00:00Z",
      { bytes: changed, store },
    )
  );
  assert.notEqual(newer, id);
  assert.equal(files.size, 1);
  const nv = await first(
    "select * from fib.ris_document_versions where id=$1",
    [newer],
  );
  assert.equal(nv.content_author, "unknown");
  assert.equal(nv.extracted_text, null);
  await assert.rejects(
    () => tx((db) => readOriginal(db, newer!, store)),
    /not_permitted/,
  );
  assert.deepEqual(
    await tx((db) => readOriginal(db, id!, store)),
    bytes,
    "Historical authorized original remains readable",
  );
  assert.equal(
    (await first(
      "select count(*)::int n from fib.finding_versions where finding_id=$1",
      [document.finding_id],
    )).n,
    2,
  );
  await run({ action: "ris_revoke_storage_rights", versionId: id });
  assert.equal(files.size, 0);
  await assert.rejects(
    () => tx((db) => readOriginal(db, id!, store)),
    /not_permitted/,
  );
  const revoked = await first(
    "select * from fib.ris_document_versions where id=$1",
    [id],
  );
  assert.equal(revoked.extracted_text, null);
  assert.equal(revoked.content_hash, hash);
  // A successful Storage POST plus SQL rollback is recoverable and revocable.
  await run({
    action: "ris_confirm_storage_rights",
    versionId: newer,
    contentAuthor: "municipality",
    evidence: "Synthetic retry proof",
  });
  await assert.rejects(() =>
    tx(async (db) => {
      await persistRisDocument(
        db,
        document.source_url,
        changedHash,
        "text",
        "test",
        "2026-11-01T02:00:00Z",
        { bytes: changed, store },
      );
      throw Error("after_upload_rollback");
    }), /after_upload/);
  assert.equal(files.size, 1);
  assert.equal(
    (await first(
      "select pdf_storage_key from fib.ris_document_versions where id=$1",
      [newer],
    )).pdf_storage_key,
    null,
  );
  await run({ action: "ris_revoke_storage_rights", versionId: newer });
  assert.equal(files.size, 0, "Revocation also removes a rolled-back upload");
  const top = await first(
    "select id from fib.ris_agenda_items where number='2'",
  );
  // #387: further TOP events must be pre-existing; creating a new local
  // reference from the TOP dialog is forbidden even through the backend.
  await assert.rejects(
    () => tx((db) => sourceEditorial(db, actor, {
      action: "source_create_event",
      agendaId: top.id,
      title: "Forbidden new local TOP event",
      occurredAt: "2026-10-20",
      approval: true,
      requestId: crypto.randomUUID(),
    })),
    /invalid_source_input/,
  );
  const created = { eventId: crypto.randomUUID() };
  await pool.query(
    "insert into fib.events(id,title,status,occurred_at,confirmed_at) values($1,$2,'confirmed',$3,now())",
    [created.eventId,"External local event","2026-10-20"],
  );
  assert.equal(
    (await first("select count(*)::int n from fib.event_findings")).n,
    0,
    "Local reference does not create a document relationship",
  );
  await pool.query(
    "insert into fib.edit_locks(object_type,object_id,user_id,expires_at) values('event',$1,$2,now()+interval '1 hour')",
    [created.eventId, uid],
  );
  await run({
    action: "ris_link_event",
    agendaId: top.id,
    eventId: created.eventId,
  });
  const read: any = await run({ action: "ris_read", sessionId: a.sessionId });
  assert.equal(read.events.length, 1);
  assert.equal(read.events[0].event_title, "External local event");
  assert.equal(read.events[0].rationale, null);
  await run({
    action: "ris_unlink_event",
    agendaId: top.id,
    eventId: created.eventId,
  });
  assert.equal(
    (await first("select count(*)::int n from fib.events where id=$1", [
      created.eventId,
    ])).n,
    1,
  );
  // #403: TOP metadata alone is sufficient; no PDF/text/version needed.
  const mainId=crypto.randomUUID();
  const createMain={action:"source_create_event",agendaId:top.id,mainEvent:true,
    title:"Metadata-only TOP event",approval:true,requestId:mainId};
  await tx(db=>sourceEditorial(db,actor,createMain));
  await tx(db=>sourceEditorial(db,actor,createMain));
  assert.ok((await first("select justification from fib.event_findings where event_id=$1",[mainId])).justification);
  // Add a document after the explicit choice; must synchronize without reselecting.
  const late=structuredClone(snapshot);
  late.observedAt="2026-11-08T12:00:00Z";
  late.hash="d".repeat(64);
  late.agenda[0].documents.push({url:RIS_ORIGIN+"/getfile.asp?id=998",kind:"attachment",title:"Late attachment"});
  await tx(db=>persistRisStructure(db,late));
  await tx(db=>persistRisStructure(db,late));
  assert.equal((await first("select count(*)::int n from fib.event_findings where event_id=$1",[mainId])).n,2);
  assert.equal((await first("select count(*)::int n from fib.ris_document_versions v join fib.ris_documents d on d.id=v.document_id where d.source_url like '%id=998'")).n,0);
  await pool.query("insert into fib.edit_locks(object_type,object_id,user_id,expires_at) values('event',$1,$2,now()+interval '1 hour')",[mainId,uid]);
  const classified=structuredClone(late);
  classified.observedAt="2026-11-08T13:00:00Z";classified.hash="e".repeat(64);
  classified.agenda[0].documents.push({url:RIS_ORIGIN+"/getfile.asp?id=997",kind:"unknown",title:"Unclassified"});
  await tx(db=>persistRisStructure(db,classified));
  assert.equal((await first("select count(*)::int n from fib.event_findings where event_id=$1",[mainId])).n,2);
  const classifiedLink=await first("select l.id from fib.ris_document_links l join fib.ris_documents d on d.id=l.document_id where d.source_url like '%id=997'");
  await run({action:"ris_review_document",linkId:classifiedLink.id,kind:"attachment",status:"rejected",rationale:"Synthetic exclusion"});
  await tx(db=>persistRisStructure(db,{...classified,hash:"f".repeat(64),observedAt:"2026-11-08T14:00:00Z"}));
  assert.equal((await first("select count(*)::int n from fib.event_findings where event_id=$1",[mainId])).n,2,"Rejected evidence must not be adopted");
  await run({action:"ris_review_document",linkId:classifiedLink.id,kind:"attachment",status:"confirmed",rationale:"Synthetic reviewed exact TOP attachment"});
  assert.equal((await first("select count(*)::int n from fib.event_findings where event_id=$1",[mainId])).n,3,"Later classification synchronizes without PDF storage");
  const otherTop=await first("select id from fib.ris_agenda_items where number='3'");
  await run({action:"ris_link_main_event",agendaId:otherTop.id,eventId:mainId});
  await run({action:"ris_link_main_event",agendaId:otherTop.id,eventId:mainId});
  assert.equal((await first("select count(*)::int n from fib.event_findings where event_id=$1",[mainId])).n,4,"Multiple TOPs aggregate their own evidence exactly once");
  assert.equal((await first("select user_id from fib.object_last_edits where object_type='event' and object_id=$1",[mainId])).user_id,uid);
  await run({action:"ris_unlink_main_event",agendaId:top.id,eventId:mainId});
  assert.equal((await first("select count(*)::int n from fib.event_findings where event_id=$1",[mainId])).n,4,"Unlink preserves evidence and event");
  const full=await parseRisStructure('<div class="siname">Synthetic full session</div><table>'+Array.from({length:19},(_,i)=>`<tr><td>Ö ${i+1}</td><td class="tolink"><a href="to0050.asp?__ktonr=${300+i}">Synthetic ${i+1}</a></td></tr>`).join('')+'</table>',RIS_ORIGIN+'/si0057.asp?__ksinr=9999','2026-11-08');
  const fullResult=await tx(db=>persistRisStructure(db,full));
  assert.equal((await first("select count(*)::int n from fib.ris_agenda_items where session_id=$1",[fullResult.sessionId])).n,19,"19 TOPs without proposals survive DB import");
  for (const role of ["anon", "authenticated", "service_role"]) {
    const c = await pool.connect();
    try {
      await c.query("begin");
      await c.query("set local role " + role);
      await assert.rejects(
        () => c.query("select * from fib.ris_document_versions"),
        /permission denied/,
      );
    } finally {
      await c.query("rollback");
      c.release();
    }
  }
  assert.equal(
    (await first(
      "select public from storage.buckets where id='fib-ris-originals'",
    )).public,
    false,
  );
  assert.equal((await first("select count(*)::int n from fib.messages")).n, 0);
  assert.equal(
    (await first("select count(*)::int n from fib.ris_decision_points")).n,
    0,
  );
  assert.equal(
    (await first("select value from public.ris_377_sentinel where id=1")).value,
    "untouched",
  );
  console.log(
    "PASS isolated PostgreSQL: automatic idempotent findings, exact-version rights, immutable original/text pair, denied historical/new content, upload failure/rollback/retry/revocation, independent local links, MFA/RLS and untouched public sentinel; Storage transport simulated",
  );
}
main().finally(() => pool.end()).catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
