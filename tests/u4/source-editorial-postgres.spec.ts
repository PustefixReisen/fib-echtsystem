import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import pg from "pg";
import { sourceEditorial } from "../../supabase/functions/_shared/source-editorial.ts";
import { risEditorial } from "../../supabase/functions/_shared/ris-editorial.ts";
const connection = process.env.U4_TEST_DATABASE_URL;
if (!connection) throw Error("isolated_test_database_required");
const url = new URL(connection);
if (
  !["localhost", "127.0.0.1"].includes(url.hostname) ||
  url.pathname !== "/fib_u4_test"
)
  throw Error("isolated_test_database_required");
const pool = new pg.Pool({ connectionString: connection });
const actor = {
  userId: "22222222-2222-4222-8222-222222222222",
  kind: "human" as const,
  aal: "aal2" as const,
};
async function run(input: any, identity = actor) {
  const c = await pool.connect();
  try {
    await c.query("begin");
    await c.query("set local role fib_runtime");
    const r = await sourceEditorial(
      { unsafe: async (q, p) => (await c.query(q, p)).rows },
      identity,
      input,
    );
    await c.query("commit");
    return r as any;
  } catch (e) {
    await c.query("rollback");
    throw e;
  } finally {
    c.release();
  }
}
const first = async (q: string, p: any[] = []) =>
  (await pool.query(q, p)).rows[0];
async function main() {
  await pool.query(
    readFileSync(
      "supabase/migrations/20261015123000_finding_justification.sql",
      "utf8",
    ),
  );
  const source = (
    await first(
      "insert into fib.sources(name,homepage_url) values('Gemeinde Feldkirchen','https://www.feldkirchen.de') returning id",
    )
  ).id;
  const scope = (
    await first(
      "insert into fib.source_scopes(source_id,scope_key,scope_label,entry_url,access_method) values($1,'news-ui','Nachrichten','https://www.feldkirchen.de','html') returning id",
      [source],
    )
  ).id;
  const provenance = JSON.parse(
    readFileSync("tests/u4/fixtures/gemeinde-provenance.json", "utf8"),
  );
  const article = provenance.base + "/" + provenance.detail;
  await pool.query(
    "insert into fib.source_observations(scope_id,external_id,canonical_url,content_fingerprint,first_seen_at,last_seen_at,revision) values($1,$2,$2,$3,now(),now(),1)",
    [scope, article, provenance.responseSha256.detail],
  );
  const before = await first(
    "select (select count(*) from fib.events) events,(select count(*) from fib.messages) messages",
  );
  const list = await run({
    action: "source_list",
    search: "Gemeinde Feldkirchen",
  });
  assert.ok(list.observations.some((o: any) => o.external_id === article));
  const read = await run({
    action: "source_read",
    scopeId: scope,
    externalId: article,
  });
  assert.equal(read.observation.revision, 1);
  const input = {
    action: "source_accept",
    scopeId: scope,
    sourceId: source,
    externalId: article,
    revision: 1,
    fingerprint: provenance.responseSha256.detail,
    title: "Neues Parkraumkonzept in Feldkirchen",
    approval: true,
  };
  await assert.rejects(
    () => run(input, { ...actor, aal: "aal1" } as any),
    /forbidden/,
  );
  await assert.rejects(
    () => run({ ...input, approval: false }),
    /invalid_review/,
  );
  await assert.rejects(() => run({ ...input, revision: 2 }), /stale_review/);
  const [a, b] = await Promise.all([run(input), run(input)]);
  assert.equal(a.findingId, b.findingId);
  assert.equal(
    (
      await first(
        "select count(*) from fib.finding_versions where finding_id=$1",
        [a.findingId],
      )
    ).count,
    "1",
  );
  assert.equal(
    (await first("select count(*) from fib.events")).count,
    before.events,
  );
  assert.ok(
    !(await run({ action: "source_list" })).observations.some(
      (o: any) => o.external_id === article,
    ),
  );
  const request = {
    action: "source_create_event",
    findingId: a.findingId,
    title: "Veröffentlichung des Parkraumkonzepts",
    rationale: "Amtliche Nachricht zur Einführung des Parkraumkonzepts",
    approval: true,
    requestId: crypto.randomUUID(),
  };
  await assert.rejects(
    () => run({ ...request, approval: false }),
    /invalid_review/,
  );
  const event = await run(request);
  assert.equal((await run(request)).eventId, event.eventId);
  await assert.rejects(
    () => run({ ...request, title: "Anderer Inhalt" }),
    /request_conflict/,
  );
  await assert.rejects(
    () => run({ ...request, rationale: "Abweichender Auftrag" }),
    /request_conflict/,
  );
  assert.equal(
    (
      await first(
        "select user_id from fib.lead_responsibilities where object_type='event' and object_id=$1",
        [event.eventId],
      )
    ).user_id,
    actor.userId,
  );
  assert.equal(
    (
      await first(
        "select user_id from fib.object_last_edits where object_type='event' and object_id=$1",
        [event.eventId],
      )
    ).user_id,
    actor.userId,
  );
  await assert.rejects(
    () =>
      run({
        action: "source_propose_relation",
        findingId: crypto.randomUUID(),
        eventId: event.eventId,
        origin: "editor",
      }),
    /source_missing/,
  );
  const detail = await run({ action: "source_read", findingId: a.findingId });
  assert.equal(detail.events[0].id, event.eventId);
  assert.equal(detail.events[0].justification, request.rationale);
  const topic = (await first("select id from fib.topics limit 1")).id;
  const suggestion = await run({
    action: "source_propose_relation",
    findingId: a.findingId,
    eventId: event.eventId,
    topicId: topic,
    significance: "relevant",
    origin: "editor",
    rationale: "Verkehr und öffentlicher Raum",
  });
  await assert.rejects(
    () =>
      run({
        action: "source_review_relation",
        suggestionId: suggestion.suggestionId,
        status: "confirmed",
        rationale: "Geprüft",
      }),
    /missing/,
  );
  await pool.query(
    "insert into fib.edit_locks(object_type,object_id,user_id,expires_at) values('event',$1,$2,now()+interval '2 minutes')",
    [event.eventId, actor.userId],
  );
  await run({
    action: "source_review_relation",
    suggestionId: suggestion.suggestionId,
    status: "confirmed",
    rationale: "Bestehendes Thema wird ergänzt",
  });
  assert.ok(
    (
      await run({ action: "source_read", findingId: a.findingId })
    ).relationships.some((r: any) => r.topic_title),
  );
  await pool.query(
    "update fib.source_observations set revision=2,content_fingerprint=$3 where scope_id=$1 and external_id=$2",
    [scope, article, "changed-test"],
  );
  await assert.rejects(() => run(input), /stale_review/);
  assert.ok(
    (await run({ action: "source_list" })).observations.some(
      (o: any) => o.external_id === article,
    ),
  );
  await run({ ...input, revision: 2, fingerprint: "changed-test" });
  assert.equal(
    (await run({ action: "source_read", findingId: a.findingId })).versions
      .length,
    2,
  );
  assert.equal(
    (await first("select count(*) from fib.messages")).count,
    before.messages,
  );
  assert.ok(
    (await run({ action: "ris_sessions", search: "Gemeinderat" })).sessions
      .length,
  );
  console.log(
    "Unified source UI services: real news reference → versioned finding → explicit regular event → reviewed existing topic; retries, stale input, MFA, locking and no automatic message passed",
  );
}
main()
  .finally(() => pool.end())
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
