import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import pg from "pg";
import {
  parseRisStructure,
  persistRisStructure,
  persistRisDocument,
  risHash,
  RIS_ORIGIN,
} from "../../supabase/functions/_shared/ris-structure.ts";
import {
  risEditorial,
  type RisActor,
} from "../../supabase/functions/_shared/ris-editorial.ts";
import { confirmEvent } from "../../packages/fachservices/src/editorial-write.js";
const connection = process.env.U4_TEST_DATABASE_URL;
if (!connection) throw Error("U4_TEST_DATABASE_URL required");
const target = new URL(connection);
if (
  !["localhost", "127.0.0.1"].includes(target.hostname) ||
  target.pathname !== "/fib_u4_test"
)
  throw Error("isolated_test_database_required");
const pool = new pg.Pool({ connectionString: connection });
const uid = "22222222-2222-4222-8222-222222222222";
const actor: RisActor = { userId: uid, kind: "human", aal: "aal2" };
const adapter = (c: pg.PoolClient) => ({
  unsafe: async (q: string, p: any[] = []) => (await c.query(q, p)).rows,
});
async function tx<T>(work: (db: ReturnType<typeof adapter>) => Promise<T>) {
  const c = await pool.connect();
  try {
    await c.query("begin");
    await c.query("set local role fib_runtime");
    const r = await work(adapter(c));
    await c.query("commit");
    return r;
  } catch (e) {
    await c.query("rollback");
    throw e;
  } finally {
    c.release();
  }
}
const run = (input: Record<string, any>, a = actor) =>
  tx((db) => risEditorial(db, a, input));
const count = async (t: string) =>
  Number((await pool.query("select count(*) from fib." + t)).rows[0].count);
const first = async (q: string, p: any[] = []) =>
  (await pool.query(q, p)).rows[0];
async function main() {
  await pool.query(
    "drop schema if exists fib cascade; create schema if not exists auth; create table if not exists auth.users(id uuid primary key)",
  );
  for (const r of ["anon", "authenticated", "service_role", "fib_runtime"])
    await pool.query(
      `do $$ begin if not exists(select 1 from pg_roles where rolname='${r}') then create role ${r}; end if; end $$`,
    );
  await pool.query("insert into auth.users values($1) on conflict do nothing", [
    uid,
  ]);
  for (const path of [
    "schema/core.sql",
    "security/runtime-roles.sql",
    "security/runtime-policies.sql",
    "migrations/20261010194500_fib_last_edit_coordination.sql",
    "migrations/20261029200933_fib_u4_source_monitor_persistence.sql",
    "migrations/20261030093000_fib_u4_source_observations.sql",
    "migrations/20261031081340_fib_ris_editorial_structure.sql",
  ])
    await pool.query(readFileSync("supabase/" + path, "utf8"));
  await pool.query(
    "insert into fib.app_users(user_id,role,setup_status) values($1,'editor','active')",
    [uid],
  );
  const sourceId = (
    await first(
      "insert into fib.sources(name,homepage_url) values($1,$2) returning id",
      ["RIS", RIS_ORIGIN],
    )
  ).id;
  const html = readFileSync(
    "tests/u4/fixtures/ris-1031-top-2-3-6.html",
    "utf8",
  );
  const snapshot = await parseRisStructure(
    html,
    RIS_ORIGIN + "/si0057.asp?__ksinr=1031",
    "2026-10-31T10:00:00Z",
  );
  assert.equal(snapshot.agenda.length, 3);
  assert.equal(snapshot.documents[0].kind, "minutes");
  const [a, b] = await Promise.all([
    tx((db) => persistRisStructure(db, snapshot)),
    tx((db) => persistRisStructure(db, snapshot)),
  ]);
  assert.equal(a.sessionId, b.sessionId);
  assert.equal(await count("ris_session_versions"), 1);
  assert.equal(await count("ris_agenda_items"), 3);
  assert.equal(await count("ris_decision_points"), 0);
  await assert.rejects(
    () =>
      tx((db) =>
        persistRisStructure(db, {
          ...snapshot,
          observedAt: "2026-10-30T10:00:00Z",
        }),
      ),
    /stale/,
  );
  const text = readFileSync(
    "tests/u4/fixtures/ris-1031-minutes-excerpts.txt",
    "utf8",
  );
  const url = snapshot.documents[0].url;
  const hash = await risHash(text);
  const versionId = await tx((db) =>
    persistRisDocument(
      db,
      url,
      hash,
      text,
      "fixture:pdftotext-layout-excerpt",
      "2026-10-31T10:00:00Z",
    ),
  );
  const link = await first(
    "select * from fib.ris_document_links where kind='minutes'",
  );
  const top = (
    await first("select id from fib.ris_agenda_items where number='6'")
  ).id;
  await assert.rejects(
    () =>
      run(
        {
          action: "ris_review_document",
          linkId: link.id,
          status: "confirmed",
          kind: "minutes",
          rationale: "geprüft",
        },
        { ...actor, kind: "ai" },
      ),
    /human_mfa/,
  );
  await assert.rejects(
    () =>
      run(
        { action: "ris_read", sessionId: a.sessionId },
        { ...actor, aal: "aal1" },
      ),
    /human_mfa/,
  );
  await run({
    action: "ris_review_document",
    linkId: link.id,
    status: "confirmed",
    kind: "minutes",
    rationale: "Sitzungsweite Niederschrift verifiziert",
  });
  assert.equal(
    (
      await first("select minutes_approval from fib.ris_sessions where id=$1", [
        a.sessionId,
      ])
    ).minutes_approval,
    "unknown",
  );
  const withdrawn = await first(
    "select id from fib.ris_agenda_items where number='2'",
  );
  await run({
    action: "ris_review_agenda_status",
    agendaId: withdrawn.id,
    versionId,
    status: "withdrawn",
    evidenceQuote:
      "Der Antrag wurde zurückgezogen und auf eine Abstimmung verzichtet.",
    rationale: "Niederschrift belegt Rücknahme",
  });
  assert.equal(
    (
      await first(
        "select treatment_status from fib.ris_agenda_items where id=$1",
        [withdrawn.id],
      )
    ).treatment_status,
    "withdrawn",
  );
  await assert.rejects(
    () =>
      run({
        action: "ris_confirm_minutes_approval",
        sessionId: a.sessionId,
        approvingSessionId: a.sessionId,
        versionId,
        evidenceQuote: "Abstimmung: abgesetzt",
        rationale: "Verfügbarkeit ist keine Genehmigung",
      }),
    /missing/,
  );
  await pool.query(
    "insert into fib.findings(source_id,title,original_url) values($1,$2,$3)",
    [sourceId, "Vorhandener Redaktionstitel", url + "&type=do"],
  );
  const finding = await run({
    action: "ris_accept_finding",
    versionId,
    sourceId,
    title: "Niederschrift 15.10.2026",
  });
  await run({
    action: "ris_accept_finding",
    versionId,
    sourceId,
    title: "Niederschrift 15.10.2026",
  });
  assert.equal(await count("findings"), 1);
  assert.equal(
    (await first("select title from fib.findings")).title,
    "Vorhandener Redaktionstitel",
  );
  assert.equal(await count("finding_versions"), 1);
  for (const t of ["events", "messages", "processes", "topics"])
    assert.equal(await count(t), 0);
  const event = await tx(async (db) => {
    const r = await confirmEvent(
      {
        actorKind: "human",
        userId: uid,
        role: "editor",
        active: true,
        mfaLevel: "aal2",
      },
      { findingId: finding.findingId!, title: "Behandlung Rechenzentrum" },
      {
        queryOne: async <T>(q: string, p: readonly unknown[]) =>
          ((await db.unsafe(q, [...p]))[0] ?? null) as T | null,
      },
    );
    if (!r.ok) throw Error(r.reason);
    return r;
  });
  await assert.rejects(
    () =>
      run({
        action: "ris_link_event",
        agendaId: top,
        eventId: event.eventId,
        role: "decision",
        rationale: "Behandlung",
      }),
    /missing/,
  );
  await pool.query(
    "insert into fib.edit_locks(object_type,object_id,user_id,expires_at) values('event',$1,$2,now()+interval '1 hour')",
    [event.eventId, uid],
  );
  await run({
    action: "ris_link_event",
    agendaId: top,
    eventId: event.eventId,
    role: "decision",
    rationale: "Beschlusspunkte 1 und 2 in Niederschrift",
  });
  // Exact excerpt submitted as a candidate, never automatically interpreted as a decision.
  const quote1 = text
    .slice(
      text.indexOf("      1. Der Gemeinderat"),
      text.indexOf("      2. Die Verwaltung"),
    )
    .trim();
  const quote2 = text.slice(text.indexOf("      2. Die Verwaltung")).trim();
  assert.ok(quote1.includes("Ja 17 Nein 2"));
  assert.ok(quote2.includes("Ja 19 Nein 0"));
  const suggestions = [];
  for (const [i, quote] of [quote1, quote2].entries()) {
    const s = await run({
      action: "ris_suggest",
      agendaId: top,
      versionId,
      kind: "decision",
      origin: "ai",
      payload: {
        wording: quote.split("Abstimmung:")[0].trim(),
        evidenceQuote: quote,
        eventId: event.eventId,
        pointKey: String(i + 1),
        result: i === 0 ? "accepted" : "unknown",
        yes: i === 0 ? 17 : null,
        no: i === 0 ? 2 : null,
      },
    });
    suggestions.push(s.suggestionId);
  }
  assert.equal(await count("ris_decision_points"), 0);
  for (const suggestionId of suggestions)
    await run({
      action: "ris_review_suggestion",
      suggestionId,
      status: "confirmed",
      rationale:
        "Wortlaut und Ergebnis explizit geprüft; unbekannte Werte bleiben offen",
    });
  assert.equal(await count("ris_decision_points"), 2);
  assert.equal(await count("ris_votes"), 2);
  assert.equal(
    (await first("select * from fib.ris_votes where result='unknown'"))
      .yes_count,
    null,
  );
  await run({
    action: "ris_review_suggestion",
    suggestionId: suggestions[0],
    status: "confirmed",
    rationale: "retry",
  });
  assert.equal(await count("ris_votes"), 2);
  await assert.rejects(
    () =>
      run({
        action: "ris_review_suggestion",
        suggestionId: suggestions[0],
        status: "rejected",
        rationale: "kein stilles Umschreiben",
      }),
    /already_final/,
  );
  // Different version of same point is preserved, not overwritten.
  const revision = await run({
    action: "ris_suggest",
    agendaId: top,
    versionId,
    kind: "decision",
    origin: "editor",
    payload: {
      wording: quote2.split("Abstimmung:")[0].trim(),
      evidenceQuote: quote2,
      eventId: event.eventId,
      pointKey: "2",
      result: "accepted",
      yes: 19,
      no: 0,
    },
  });
  await run({
    action: "ris_review_suggestion",
    suggestionId: revision.suggestionId,
    status: "confirmed",
    rationale: "Ergebnis nachgetragen, bisherige Fassung bleibt sichtbar",
  });
  assert.equal(await count("ris_decision_points"), 2);
  assert.equal(await count("ris_decision_versions"), 3);
  const processId = (
    await first(
      "insert into fib.processes(title) values('Bestehender Vorgang') returning id",
    )
  ).id;
  const topicId = (
    await first(
      "insert into fib.topics(title) values('Bestehendes Thema') returning id",
    )
  ).id;
  for (const relation of [
    { processId },
    { topicId, significance: "relevant" },
  ]) {
    const s = await run({
      action: "ris_propose_relation",
      eventId: event.eventId,
      ...relation,
      origin: "ai",
      rationale: "Vorschlag aus explizitem Ereignis",
    });
    assert.equal(
      await count(relation.processId ? "event_processes" : "event_topics"),
      0,
    );
    await run({
      action: "ris_review_relation",
      suggestionId: s.suggestionId,
      status: "confirmed",
      rationale: "Redaktionelle Einordnung bestätigt",
    });
  }
  const projection = await run({ action: "ris_read", sessionId: a.sessionId });
  assert.equal(projection.decisions!.length, 3);
  assert.equal(projection.events![0].topic_id, topicId);
  const pending = await run({
    action: "ris_suggest",
    agendaId: top,
    versionId,
    kind: "decision",
    origin: "ai",
    payload: {
      wording: quote1,
      evidenceQuote: quote1,
      eventId: event.eventId,
      pointKey: "pending",
      result: "unknown",
    },
  });
  await tx((db) =>
    persistRisDocument(
      db,
      url,
      "b".repeat(64),
      text + "\nUpdated",
      "synthetic-change",
      "2026-10-31T11:00:00Z",
    ),
  );
  await assert.rejects(
    () =>
      run({
        action: "ris_review_suggestion",
        suggestionId: pending.suggestionId,
        status: "confirmed",
        rationale: "stale",
      }),
    /stale/,
  );
  await assert.rejects(
    () =>
      tx((db) =>
        persistRisDocument(db, url, hash, text, "old", "2026-10-31T09:00:00Z"),
      ),
    /stale/,
  );
  assert.ok(
    (
      await run({ action: "ris_read", sessionId: a.sessionId })
    ).decisions!.every((d: any) => d.source_changed),
  );
  // A proposal containing a decision-shaped quote is still not an actual decision.
  const proposalDoc = await first(
    "select d.* from fib.ris_documents d join fib.ris_document_links l on l.document_id=d.id where l.agenda_id=$1 and l.kind='proposal'",
    [top],
  );
  const proposalLink = await first(
    "select id from fib.ris_document_links where document_id=$1 and agenda_id=$2",
    [proposalDoc.id, top],
  );
  const pv = await tx((db) =>
    persistRisDocument(
      db,
      proposalDoc.source_url,
      "d".repeat(64),
      quote1,
      "synthetic-negative-evidence",
      "2026-10-31T12:00:00Z",
    ),
  );
  await run({
    action: "ris_review_document",
    linkId: proposalLink.id,
    status: "confirmed",
    kind: "proposal",
    rationale: "Vorlage, kein Beschluss",
  });
  const invalid = await run({
    action: "ris_suggest",
    agendaId: top,
    versionId: pv,
    kind: "decision",
    origin: "ai",
    payload: {
      wording: quote1,
      evidenceQuote: quote1,
      eventId: event.eventId,
      pointKey: "not-a-decision",
      result: "accepted",
    },
  });
  await assert.rejects(
    () =>
      run({
        action: "ris_review_suggestion",
        suggestionId: invalid.suggestionId,
        status: "confirmed",
        rationale: "darf nicht genügen",
      }),
    /missing/,
  );
  const prop = (
    await first("select id from fib.ris_proposals where agenda_id=$1", [top])
  ).id;
  const suggestion = await run({
    action: "ris_suggest",
    agendaId: top,
    versionId: pv,
    kind: "proposal_text",
    origin: "editor",
    payload: { wording: quote1, evidenceQuote: quote1, proposalId: prop },
  });
  await run({
    action: "ris_review_suggestion",
    suggestionId: suggestion.suggestionId,
    status: "confirmed",
    rationale: "Synthetischer Test für den getrennten Vorschlagspfad",
  });
  assert.equal(await count("ris_proposal_texts"), 1);
  assert.equal(await count("ris_decision_points"), 2);
  const deferred = await run({
    action: "ris_propose_relation",
    eventId: event.eventId,
    topicId,
    significance: "supplementary",
    origin: "ai",
    rationale: "Alternative",
  });
  await run({
    action: "ris_review_relation",
    suggestionId: deferred.suggestionId,
    status: "deferred",
    rationale: "Zurückgestellt",
  });
  await assert.rejects(
    () =>
      run({
        action: "ris_review_relation",
        suggestionId: deferred.suggestionId,
        status: "confirmed",
        rationale: "kein stilles Wiederöffnen",
      }),
    /already_final/,
  );
  const before = await count("ris_session_versions");
  await assert.rejects(
    () =>
      tx(async (db) => {
        await persistRisStructure(db, {
          ...snapshot,
          hash: "c".repeat(64),
          observedAt: "2026-10-31T12:00:00Z",
        });
        throw Error("rollback");
      }),
    /rollback/,
  );
  assert.equal(await count("ris_session_versions"), before);
  // Historical omission does not delete reviewed objects or resurrect rejected links.
  await run({
    action: "ris_review_document",
    linkId: link.id,
    status: "rejected",
    kind: "minutes",
    rationale: "synthetic review case",
  });
  await tx((db) =>
    persistRisStructure(db, {
      ...snapshot,
      hash: "c".repeat(64),
      observedAt: "2026-10-31T12:00:00Z",
      agenda: [snapshot.agenda[0]],
    }),
  );
  assert.equal(await count("ris_agenda_items"), 3);
  assert.equal(
    (
      await first("select status from fib.ris_document_links where id=$1", [
        link.id,
      ])
    ).status,
    "rejected",
  );
  for (const role of ["anon", "authenticated", "service_role"])
    await assert.rejects(
      () =>
        tx(async (db) => {
          await db.unsafe("set local role " + role);
          await db.unsafe("select * from fib.ris_document_versions");
        }),
      /permission denied/,
    );
  await pool.query("grant usage on schema fib to fib_runtime");
  await tx(async (db) => {
    await db.unsafe("set local role fib_runtime");
    assert.equal(
      (await db.unsafe("select * from fib.ris_agenda_items")).length,
      3,
    );
  });
  for (const op of [
    "delete from fib.ris_agenda_items",
    "update fib.ris_document_versions set extracted_text='forged'",
    "update fib.ris_review_log set detail='{}'",
  ])
    await assert.rejects(
      () =>
        tx(async (db) => {
          await db.unsafe("set local role fib_runtime");
          await db.unsafe(op);
        }),
      /permission denied/,
    );
  await assert.rejects(
    () =>
      pool.query(
        "insert into fib.ris_votes(decision_version_id,result,evidence_quote,yes_count) select id,$1,$2,-1 from fib.ris_decision_versions limit 1",
        ["accepted", "bad"],
      ),
    /check constraint/,
  );
  // Actual published no-vote and rejected results, explicitly reviewed as separate events.
  await run({
    action: "ris_review_document",
    linkId: link.id,
    status: "confirmed",
    kind: "minutes",
    rationale: "Beleg für weitere Referenzfälle wieder ausdrücklich bestätigt",
  });
  const currentMinutes = (
    await first(
      "select latest_version_id from fib.ris_documents where source_url=$1",
      [url],
    )
  ).latest_version_id;
  await run({
    action: "ris_accept_finding",
    versionId: currentMinutes,
    sourceId,
    title: "Vorhandener Titel bleibt",
  });
  for (const example of [
    {
      number: "2",
      title: "Rücknahme des Hundewiesenantrags",
      quote: text.slice(0, text.indexOf("[… Ausschnitt …]")).trim(),
      result: "no_vote",
      yes: null,
      no: null,
    },
    {
      number: "3",
      title: "Abstimmung zum Parkanlagenantrag",
      quote: text.split("[… Ausschnitt …]")[1].trim(),
      result: "rejected",
      yes: 7,
      no: 13,
    },
  ]) {
    const agendaId = (
      await first(
        "select id from fib.ris_agenda_items where session_id=$1 and number=$2",
        [a.sessionId, example.number],
      )
    ).id;
    const ev = await tx(async (db) => {
      const r = await confirmEvent(
        {
          actorKind: "human",
          userId: uid,
          role: "editor",
          active: true,
          mfaLevel: "aal2",
        },
        { findingId: finding.findingId!, title: example.title },
        {
          queryOne: async <T>(q: string, p: readonly unknown[]) =>
            ((await db.unsafe(q, [...p]))[0] ?? null) as T | null,
        },
      );
      if (!r.ok) throw Error(r.reason);
      return r;
    });
    await pool.query(
      "insert into fib.edit_locks(object_type,object_id,user_id,expires_at) values('event',$1,$2,now()+interval '1 hour')",
      [ev.eventId, uid],
    );
    await run({
      action: "ris_link_event",
      agendaId,
      eventId: ev.eventId,
      role: "decision",
      rationale: "Tatsächliche Behandlung laut Niederschrift",
    });
    const candidate = await run({
      action: "ris_suggest",
      agendaId,
      versionId: currentMinutes,
      kind: "decision",
      origin: "editor",
      payload: {
        wording: example.quote.split("Abstimmung:")[0].trim(),
        evidenceQuote: example.quote,
        eventId: ev.eventId,
        pointKey: "1",
        result: example.result,
        yes: example.yes,
        no: example.no,
      },
    });
    await run({
      action: "ris_review_suggestion",
      suggestionId: candidate.suggestionId,
      status: "confirmed",
      rationale: "Originalwortlaut und Ergebnis geprüft",
    });
  }
  assert.equal(await count("ris_decision_points"), 4);
  assert.equal(
    (await first("select count(*) from fib.ris_votes where result='no_vote'"))
      .count,
    "1",
  );
  assert.equal(
    (await first("select no_count from fib.ris_votes where result='rejected'"))
      .no_count,
    13,
  );
  const duplicate = await first(
    "insert into fib.findings(source_id,title,original_url) values($1,$2,$3) returning id",
    [sourceId, "synthetic duplicate", url],
  );
  await assert.rejects(
    () =>
      run({
        action: "ris_accept_finding",
        versionId: currentMinutes,
        sourceId,
        title: "nicht willkürlich auswählen",
      }),
    /ambiguous/,
  );
  await pool.query("delete from fib.findings where id=$1", [duplicate.id]);
  await pool.query("update fib.app_users set active=false where user_id=$1", [
    uid,
  ]);
  await assert.rejects(
    () => run({ action: "ris_read", sessionId: a.sessionId }),
    /missing/,
  );
  await pool.query("update fib.app_users set active=true where user_id=$1", [
    uid,
  ]);
  // Positive approval lifecycle is synthetic and explicitly separate from the real excerpts.
  const approvalText =
    "Synthetischer Prüffall: Die Niederschrift vom 15.10.2026 wird genehmigt.";
  const approvalUrl = RIS_ORIGIN + "/getfile.asp?id=99998";
  const later = await tx((db) =>
    persistRisStructure(db, {
      ...snapshot,
      url: RIS_ORIGIN + "/si0057.asp?__ksinr=99998",
      date: "2026-10-29",
      hash: "e".repeat(64),
      observedAt: "2026-10-31T13:00:00Z",
      documents: [{ url: approvalUrl, kind: "minutes" }],
    }),
  );
  const approvalHash = await risHash(approvalText);
  const approvalVersion = await tx((db) =>
    persistRisDocument(
      db,
      approvalUrl,
      approvalHash,
      approvalText,
      "synthetic-approval",
      "2026-10-31T13:00:00Z",
    ),
  );
  const approvalLink = await first(
    "select id from fib.ris_document_links where session_id=$1 and agenda_id is null",
    [later.sessionId],
  );
  await run({
    action: "ris_review_document",
    linkId: approvalLink.id,
    status: "confirmed",
    kind: "minutes",
    rationale: "Synthetischer Genehmigungsbeleg",
  });
  await run({
    action: "ris_confirm_minutes_approval",
    sessionId: a.sessionId,
    approvingSessionId: later.sessionId,
    versionId: approvalVersion,
    evidenceQuote: approvalText,
    rationale: "Explizite Genehmigung in späterer Sitzung",
  });
  assert.equal(
    (
      await first("select minutes_approval from fib.ris_sessions where id=$1", [
        a.sessionId,
      ])
    ).minutes_approval,
    "approved",
  );
  assert.equal(await count("ris_minutes_approvals"), 1);
  const otherAgenda = await first(
    "select id from fib.ris_agenda_items where session_id=$1 limit 1",
    [later.sessionId],
  );
  await assert.rejects(
    () =>
      pool.query(
        "insert into fib.ris_document_links(session_id,agenda_id,document_id,snapshot_id) values($1,$2,$3,$4)",
        [a.sessionId, otherAgenda.id, link.document_id, link.snapshot_id],
      ),
    /foreign key/,
  );

  assert.equal(await count("messages"), 0);
  console.log(
    "RIS relational persistence + explicit finding/event/process/topic workflow, real excerpts, votes, unknowns, versions, races, rollback, RLS: passed",
  );
}
main()
  .finally(() => pool.end())
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
