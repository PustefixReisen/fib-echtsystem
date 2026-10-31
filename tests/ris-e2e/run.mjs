import assert from "node:assert/strict";
import { chromium } from "playwright";
import pg from "pg";
import { readFileSync, writeFileSync } from "node:fs";
import { auth, totp } from "./common.mjs";
const root = process.env.RUNNER_TEMP;
const f = JSON.parse(readFileSync(root + "/ris-e2e.json", "utf8"));
const db = new pg.Client({
  connectionString:
    "postgres://postgres:" +
    process.env.TEST_DB_PASSWORD +
    "@127.0.0.1:54323/fib_u4_test",
});
await db.connect();
const results = [];
let phase = "setup",
  page,
  browser,
  ready = false,
  editorToken;
function pass(name) {
  results.push({ name, status: "bestätigt" });
  console.log("PASS " + name);
}
const first = async (q, p = []) => (await db.query(q, p)).rows[0];
const count = async (table) =>
  Number((await first("select count(*) n from fib." + table)).n);
let scenario = {};
function state(p) {
  scenario = { ...scenario, ...p };
  writeFileSync(root + "/ris-scenario.json", JSON.stringify(scenario));
}
async function call(name, body, token = f.users.admin.token) {
  const response = await fetch("http://127.0.0.1:54321/functions/v1/" + name, {
    method: "POST",
    headers: {
      authorization: "Bearer " + token,
      apikey: f.anon,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return { status: response.status, data: await response.json() };
}
async function ok(name, body, token = editorToken) {
  const r = await call(name, body, token);
  assert.equal(
    r.status,
    200,
    name + " " + body.action + " " + JSON.stringify(r.data),
  );
  return r.data;
}
const editorial = (body) => ok("fib-editorial-write", body);
async function scanUntil(test) {
  for (let i = 0; i < 10; i++) {
    await ok("fib-u4-ris-pilot", { commit: true }, f.users.admin.token);
    if (await test()) return;
  }
  throw Error("Scanner did not reach expected state");
}
const section = (title) =>
  page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: title, exact: true }) });
const nav = (name) =>
  page.locator(".side-nav").getByRole("button", { name, exact: true });
async function openSession(reference, top) {
  await nav("Sitzungen").click();
  await page
    .locator(".work-item")
    .filter({ hasText: reference })
    .getByRole("button", { name: "Sitzung öffnen", exact: true })
    .click();
  await page
    .getByLabel("Tagesordnungspunkt", { exact: true })
    .selectOption(top ?? "");
}
async function rationale(
  text = "Originalbeleg geprüft; ausdrückliche redaktionelle Testentscheidung.",
) {
  await page
    .getByLabel("Begründung für die nächste Entscheidung *", { exact: true })
    .fill(text);
}
async function reviewDoc(linkId, kind) {
  await rationale();
  await page
    .getByLabel("Dokument auswählen", { exact: true })
    .selectOption(linkId);
  await page.getByLabel("Dokumentart", { exact: true }).selectOption(kind);
  await page
    .getByRole("button", { name: "Dokument bestätigen", exact: true })
    .click();
  await page.getByText("Dokumentzuordnung geprüft.", { exact: true }).waitFor();
}
async function accept(title) {
  await page.getByLabel("Titel der Fundstelle *", { exact: true }).fill(title);
  await page
    .getByRole("button", { name: "Fundstelle ausdrücklich übernehmen" })
    .click();
  await page.getByText("Fundstelle übernommen.", { exact: false }).waitFor();
}
async function createEvent(title) {
  await page
    .getByText("Neue Sachinformation als eigenes Ereignis bestätigen", {
      exact: true,
    })
    .click();
  await page.getByLabel("Ereignistitel *", { exact: true }).fill(title);
  await page
    .getByLabel("Begründung *", { exact: true })
    .fill(
      "Ausdrücklich bestätigte Sachinformation aus der ausgewählten Fundstelle.",
    );
  await page
    .getByRole("button", { name: "Neues Ereignis ausdrücklich bestätigen" })
    .click();
  await page
    .getByText("Ereignis ausdrücklich bestätigt.", { exact: false })
    .waitFor();
  return (await first("select id from fib.events where title=$1", [title])).id;
}
async function proposeRelation(kind, id) {
  const summary = page.getByText(
    "Bestehenden Vorgang oder bestehendes Thema vorschlagen",
    { exact: true },
  );
  if ((await summary.locator("..").getAttribute("open")) === null)
    await summary.click();
  await page.getByLabel("Zuordnungsart", { exact: true }).selectOption(kind);
  await page.getByLabel("Bestehendes Ziel", { exact: true }).selectOption(id);
  await page
    .getByRole("button", { name: "Zuordnung vorschlagen", exact: true })
    .click();
  await page
    .getByText("Zuordnungsvorschlag gespeichert", { exact: false })
    .waitFor();
  await section("Redaktioneller Zusammenhang")
    .getByRole("button", { name: "Bestätigen", exact: true })
    .click();
  await page
    .getByText("Redaktionelle Entscheidung gespeichert.", { exact: true })
    .waitFor();
}
try {
  phase = "security and runtime";
  const runtime = new pg.Client({ connectionString: f.runtime });
  await runtime.connect();
  const role = (
    await runtime.query(
      "select current_user,rolsuper,rolbypassrls from pg_roles where rolname=current_user",
    )
  ).rows[0];
  assert.equal(role.current_user, "fib_app");
  assert.equal(role.rolsuper, false);
  assert.equal(role.rolbypassrls, false);
  await assert.rejects(
    () => runtime.query("select * from auth.users"),
    /permission denied/,
  );
  await runtime.end();
  for (const role of ["anon", "authenticated", "service_role"]) {
    await db.query("begin");
    await db.query("set local role " + role);
    await assert.rejects(
      () => db.query("select * from fib.ris_sessions"),
      /permission denied/,
    );
    await db.query("rollback");
  }
  const low = await auth("/token?grant_type=password", {
    email: f.users.editor.email,
    password: f.users.editor.password,
  });
  for (const token of [low.access_token, f.users.outsider.token, "not-a-token"])
    assert.equal(
      (await call("fib-editorial-write", { action: "source_list" }, token))
        .status,
      403,
    );
  assert.equal(
    (await call("fib-u4-ris-pilot", { commit: true }, f.users.editor.token))
      .status,
    403,
  );
  pass(
    "Real GoTrue AAL1/nonmember/invalid-token rejection and restricted fib_app/RLS",
  );
  phase = "scanner intake";
  await scanUntil(
    async () =>
      (await count("ris_document_versions")) >= 2 &&
      (await count("ris_sessions")) === 2,
  );
  assert.equal(await count("ris_decision_points"), 0);
  assert.equal(await count("findings"), 0);
  await ok("fib-u4-pilot", { commit: true }, f.users.admin.token);
  assert.equal((await count("source_observations")) >= 3, true);
  const s1032 = await first(
    "select * from fib.ris_sessions where source_url like '%=1032'",
  );
  const s1031 = await first(
    "select * from fib.ris_sessions where source_url like '%=1031'",
  );
  const tops = (await db.query("select * from fib.ris_agenda_items")).rows;
  const top = (s, n) =>
    tops.find((t) => t.session_id === s.id && t.number === n).id;
  const doc = async (id) =>
    first(
      "select d.*,v.extracted_text from fib.ris_documents d left join fib.ris_document_versions v on v.id=d.latest_version_id where d.source_url=$1",
      ["https://buergerinfo-feldkirchen.digitalfabrix.de/getfile.asp?id=" + id],
    );
  const link = async (id, agenda = null) =>
    first(
      "select l.* from fib.ris_document_links l join fib.ris_documents d on d.id=l.document_id where d.source_url=$1 and l.agenda_id is not distinct from $2",
      [
        "https://buergerinfo-feldkirchen.digitalfabrix.de/getfile.asp?id=" + id,
        agenda,
      ],
    );
  assert.match(
    (await doc(75714)).extracted_text,
    /Synthetischer Vorschlagstext/,
  );
  await db.query("insert into fib.development_batches(id,purpose,approval_reference) values('ris-e2e','Isolated actual handler ownership test','CI')");
  const {DATASET_KEYS,keyExpression}=await import('../../supabase/functions/_shared/development-datasets.ts');
  for(const t of Object.keys(DATASET_KEYS)) {
    const ownership=['source_scopes','source_observations','ris_committees'].includes(t)?'reference':'owned';
    await db.query(`insert into fib.development_objects(batch_id,table_name,row_key,ownership,initial_fingerprint) select 'ris-e2e',$1,${keyExpression(t)},$2,repeat('a',64) from fib."${t}" t where $1 not in ('events','findings','finding_versions')`,[t,ownership]);
  }
  const readiness=await ok('fib-editorial-write',{action:'source_readiness'},f.users.admin.token);
  assert.equal(readiness.ready,true);assert.equal(readiness.runtimeRole,'fib_app');
  pass(
    "Actual RIS/news scanners → persisted structure/observations → real unpdf extraction",
  );
  phase = "browser login and real TOTP";
  browser = await chromium.launch();
  page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
  page.setDefaultTimeout(15000);
  const browserErrors = [];
  page.on("pageerror", (e) => browserErrors.push(e.message));
  page.on("dialog", (d) => d.accept());
  await page.route("**/*", (r) =>
    new URL(r.request().url()).hostname === "127.0.0.1"
      ? r.continue()
      : r.abort(),
  );
  page.on("request", (r) => {
    if (r.url().includes("/functions/v1/"))
      editorToken = r.headers().authorization?.slice(7) ?? editorToken;
  });
  await page.goto("http://127.0.0.1:4173");
  await page.getByLabel("E-Mail", { exact: true }).fill(f.users.editor.email);
  await page
    .getByLabel("Passwort", { exact: true })
    .fill(f.users.editor.password);
  await page.getByRole("button", { name: "Anmelden", exact: true }).click();
  await page
    .getByRole("button", { name: "MFA bestätigen", exact: true })
    .waitFor();
  assert.equal(await nav("Fundstellen").count(), 0);
  await new Promise((r) => setTimeout(r, 31000 - (Date.now() % 30000)));
  await page
    .locator('input[autocomplete="one-time-code"]')
    .fill(totp(f.users.editor.secret));
  await page
    .getByRole("button", { name: "MFA bestätigen", exact: true })
    .click();
  await nav("Sitzungen").waitFor();
  ready = true;
  assert.equal(
    JSON.parse(Buffer.from(editorToken.split(".")[1], "base64url")).aal,
    "aal2",
  );
  pass(
    "Entire application: password login → actual browser TOTP verification → membership gate",
  );
  phase = "1032 regular editorial workflow";
  await openSession("GR/440/2026", top(s1032, "2"));
  await page
    .getByText("Kein tatsächlicher Beschluss im geprüften Bestand belegt.", {
      exact: false,
    })
    .waitFor();
  await page
    .getByRole("button", {
      name: "In Fundstellenverwaltung öffnen",
      exact: true,
    })
    .click();
  await accept("Vorlage Elternbeitragszuschuss 29.10.2026");
  assert.equal(await count("events"), 1, "intake must not create events");
  const event = await createEvent(
    "Vorlagenveröffentlichung Elternbeitragszuschuss",
  );
  const finding = (await doc(75714)).finding_id;
  await page
    .getByRole("button", { name: "Ereignis öffnen", exact: true })
    .first()
    .click();
  await page
    .getByRole("button", { name: "Fundstelle öffnen", exact: true })
    .waitFor();
  await page
    .getByRole("button", { name: "Fundstelle öffnen", exact: true })
    .click();
  await page
    .getByRole("button", { name: "RIS-Kontext öffnen", exact: true })
    .click();
  await page
    .getByLabel("Tagesordnungspunkt", { exact: true })
    .selectOption(top(s1032, "2"));
  await reviewDoc((await link(75714, top(s1032, "2"))).id, "proposal");
  await page.getByLabel("Ereignis", { exact: true }).selectOption(event);
  // Second identity holds the actual lock, not an injected UI failure.
  await ok(
    "fib-coordination",
    { action: "acquire_lock", objectType: "event", objectId: event },
    f.users.admin.token,
  );
  await page.getByRole("button", { name: "TOP dem Ereignis zuordnen" }).click();
  await page
    .getByRole("alert")
    .filter({ hasText: "bereits bearbeitet" })
    .waitFor();
  assert.equal(await count("ris_agenda_events"), 0);
  await ok(
    "fib-coordination",
    { action: "release_lock", objectType: "event", objectId: event },
    f.users.admin.token,
  );
  await page.getByRole("button", { name: "TOP dem Ereignis zuordnen" }).click();
  await page
    .getByText("TOP und Ereignis ausdrücklich zugeordnet.", { exact: true })
    .waitFor();
  assert.equal(
    (
      await first(
        "select user_id from fib.lead_responsibilities where object_id=$1",
        [event],
      )
    ).user_id,
    f.users.editor.id,
  );
  // Confirm a proposal as a proposal through the same actual UI/API path.
  await rationale();
  await page
    .getByText("Belegten Text als Vorschlag erfassen", { exact: true })
    .click();
  await page
    .getByLabel("Vorschlagsart", { exact: true })
    .selectOption("proposal_text");
  const proposal = await first(
    "select id from fib.ris_proposals where agenda_id=$1",
    [top(s1032, "2")],
  );
  await page.getByLabel("Vorlage", { exact: true }).selectOption(proposal.id);
  await page
    .getByLabel("Wortlaut *", { exact: true })
    .fill("Synthetischer Vorschlagstext zu TOP 2.");
  await page
    .getByLabel("Wortgetreuer Beleg einschließlich Abstimmung *", {
      exact: true,
    })
    .fill((await doc(75714)).extracted_text);
  await page
    .getByRole("button", { name: "Vorschlag speichern", exact: true })
    .click();
  await page
    .getByText("Vorschlag gespeichert – noch nicht bestätigt.", { exact: true })
    .waitFor();
  assert.equal(await count("ris_proposal_texts"), 0);
  await rationale();
  await section("Offene und entschiedene Vorschläge")
    .getByRole("button", { name: "Bestätigen", exact: true })
    .click();
  await page
    .getByText("Redaktionelle Entscheidung gespeichert.", { exact: true })
    .waitFor();
  assert.equal(await count("ris_proposal_texts"), 1);
  assert.equal(await count("ris_decision_points"), 0);
  const initialVersion = (await doc(75714)).latest_version_id;
  const before = await count("ris_decision_points");
  const invalid = await editorial({
    action: "ris_suggest",
    agendaId: top(s1032, "2"),
    versionId: (await doc(75714)).latest_version_id,
    kind: "decision",
    origin: "editor",
    payload: {
      eventId: event,
      pointKey: "invalid",
      wording: "Synthetischer Vorschlagstext",
      evidenceQuote: (await doc(75714)).extracted_text,
      result: "unknown",
    },
  });
  await ok("fib-coordination", {
    action: "acquire_lock",
    objectType: "event",
    objectId: event,
  });
  assert.equal(
    (
      await call(
        "fib-editorial-write",
        {
          action: "ris_review_suggestion",
          suggestionId: invalid.suggestionId,
          status: "confirmed",
          rationale: "Negativkontrolle Vorlage",
        },
        editorToken,
      )
    ).status,
    409,
  );
  await ok("fib-coordination", {
    action: "release_lock",
    objectType: "event",
    objectId: event,
  });
  assert.equal(await count("ris_decision_points"), before);
  assert.equal(
    (
      await call(
        "fib-editorial-write",
        { action: "ris_suggest", origin: "ai" },
        editorToken,
      )
    ).status,
    403,
  );
  await editorial({
    action: "ris_review_suggestion",
    suggestionId: invalid.suggestionId,
    status: "rejected",
    rationale: "Vorlage belegt keinen tatsächlichen Beschluss",
  });
  await openSession("GR/440/2026", top(s1032, "3"));
  await page.locator("strong").filter({hasText:"5397/2026"}).waitFor();
  await page
    .getByText("Kein tatsächlicher Beschluss im geprüften Bestand belegt.", {
      exact: false,
    })
    .waitFor();
  pass(
    "1032 TOP2/3: regular source/event navigation, persisted roles/lock conflict, proposal never becomes decision",
  );
  phase = "late publication and rollback";
  const revisions = await count("ris_session_versions");
  const cursors = JSON.stringify(
    (
      await db.query(
        "select cursor_state from fib.ris_scan_cursors order by scope_id",
      )
    ).rows,
  );
  state({ late: true, changed: true });
  await db.query(
    "create function fib.test_abort_snapshot() returns trigger language plpgsql as $$ begin raise exception 'isolated rollback injection'; end $$; create trigger test_abort_snapshot before insert on fib.ris_session_versions for each row execute function fib.test_abort_snapshot()",
  );
  assert.equal((await call("fib-u4-ris-pilot", { commit: true })).status, 502);
  assert.equal(await count("ris_session_versions"), revisions);
  assert.equal(
    JSON.stringify(
      (
        await db.query(
          "select cursor_state from fib.ris_scan_cursors order by scope_id",
        )
      ).rows,
    ),
    cursors,
  );
  await db.query(
    "drop trigger test_abort_snapshot on fib.ris_session_versions; drop function fib.test_abort_snapshot()",
  );
  state({ outage: true });
  const failed = await call("fib-u4-ris-pilot", { commit: true });
  assert.ok(failed.status !== 200 || failed.data.failures > 0);
  state({ outage: false });
  await scanUntil(
    async () =>
      !!(await doc(75785))?.latest_version_id &&
      !!(await doc(99001))?.latest_version_id &&
      (await doc(75714)).extracted_text.includes("geänderte"),
  );
  assert.equal(await count("ris_decision_points"), 0);
  assert.equal(
    (
      await call(
        "fib-editorial-write",
        {
          action: "ris_review_document",
          linkId: (await link(75714, top(s1032, "2"))).id,
          versionId: initialVersion,
          kind: "proposal",
          status: "confirmed",
          rationale: "Überholte Fassung",
        },
        editorToken,
      )
    ).status,
    409,
  );
  assert.ok((await count("ris_session_versions")) > revisions);
  pass(
    "Actual failed SQL transaction rolls back structure/checkpoint; outage and late PDF publication recover",
  );
  phase = "1031 minutes → decisions in real browser";
  await openSession("GR/439/2026");
  const minutes = await doc(75785),
    minutesLink = await link(75785);
  await reviewDoc(minutesLink.id, "minutes");
  await section("Niederschriften und Anlagen")
    .locator("article")
    .filter({ has: page.locator('a[href*="id=75785"]') })
    .getByRole("button", {
      name: "In Fundstellenverwaltung öffnen",
      exact: true,
    })
    .click();
  await accept("Niederschrift 15.10.2026 – dokumentierte Originalausschnitte");
  const minutesEvent = await createEvent(
    "Beschlüsse aus der Niederschrift 15.10.2026",
  );
  const text = minutes.extracted_text;
  const excerpt = (start, end) => {
    const a = text.indexOf(start),
      b = text.indexOf(end, a);
    assert.ok(a >= 0 && b > a, "Reference excerpt boundaries");
    return text.slice(a, b + end.length);
  };
  const cases = [
    [
      "2",
      "withdrawal",
      "no_vote",
      null,
      null,
      "Der Antrag wurde zurückgezogen und auf eine Abstimmung verzichtet.",
    ],
    [
      "3",
      "park",
      "rejected",
      7,
      13,
      excerpt(
        "Der Gemeinderat beschließt einen Entwurf",
        "im Haushalt 2027 vorzusehen.",
      ),
    ],
    [
      "6",
      "1",
      "accepted",
      17,
      2,
      excerpt(
        "Der Gemeinderat beurteilt die vorliegende Voranfrage",
        "Bereich des Plangebietes sowie die Anpassung der baulichen Parameter.",
      ),
    ],
    [
      "6",
      "2",
      "accepted",
      19,
      0,
      excerpt("Die Verwaltung wird beauftragt", "zu erarbeiten."),
    ],
  ];
  for (const [number, key, result, yes, no, wording] of cases) {
    await openSession("GR/439/2026", top(s1031, number));
    await rationale();
    await page
      .getByLabel("Ereignis", { exact: true })
      .selectOption(minutesEvent);
    await page
      .getByLabel("Rolle des Ereignisses", { exact: true })
      .selectOption("decision");
    await page
      .getByRole("button", { name: "TOP dem Ereignis zuordnen" })
      .click();
    await page
      .getByText("TOP und Ereignis ausdrücklich zugeordnet.", { exact: true })
      .waitFor();
    await page
      .getByLabel("Dokument auswählen", { exact: true })
      .selectOption(minutesLink.id);
    await page
      .getByText("Belegten Text als Vorschlag erfassen", { exact: true })
      .click();
    await page
      .getByLabel("Vorschlagsart", { exact: true })
      .selectOption("decision");
    await page.getByLabel("Beschlusspunkt *", { exact: true }).fill(key);
    await page.getByLabel("Ergebnis", { exact: true }).selectOption(result);
    await page
      .getByLabel("Ja (leer = unbekannt)", { exact: true })
      .fill(yes === null ? "" : String(yes));
    await page
      .getByLabel("Nein (leer = unbekannt)", { exact: true })
      .fill(no === null ? "" : String(no));
    assert.ok(text.includes(wording));
    await page.getByLabel("Wortlaut *", { exact: true }).fill(wording);
    await page
      .getByLabel("Wortgetreuer Beleg einschließlich Abstimmung *", {
        exact: true,
      })
      .fill(text);
    await page
      .getByRole("button", { name: "Vorschlag speichern", exact: true })
      .click();
    await page
      .getByText("Vorschlag gespeichert – noch nicht bestätigt.", {
        exact: true,
      })
      .waitFor();
    await section("Offene und entschiedene Vorschläge")
      .getByRole("button", { name: "Bestätigen", exact: true })
      .click();
    await page
      .getByText("Redaktionelle Entscheidung gespeichert.", { exact: true })
      .waitFor();
  }
  const votes = (
    await db.query(
      "select result,yes_count,no_count,abstention_count from fib.ris_votes order by yes_count nulls first",
    )
  ).rows;
  assert.deepEqual(
    votes.map(({ result, yes_count, no_count }) => [
      result,
      yes_count,
      no_count,
    ]),
    [
      ["no_vote", null, null],
      ["rejected", 7, 13],
      ["accepted", 17, 2],
      ["accepted", 19, 0],
    ],
  );
  assert.deepEqual(votes[0], {
    result: "no_vote",
    yes_count: null,
    no_count: null,
    abstention_count: null,
  });
  assert.equal(
    await section("Tatsächliche Beschlüsse").locator("article").count(),
    2,
  );
  await page.screenshot({
    path: "ris-e2e-results/1031-two-decisions.png",
    fullPage: true,
  });
  pass(
    "1031 real excerpts: no vote, rejection 7/13 and two TOP6 decisions 17/2 + 19/0 through browser → Deno → SQL",
  );
  phase = "PR350 procedural status and approval";
  await openSession("GR/439/2026", top(s1031, "2"));
  await rationale();
  await page
    .getByLabel("Verfahrensstand", { exact: true })
    .selectOption("withdrawn");
  await page
    .getByLabel("Beleg für Verfahrensstand", { exact: true })
    .selectOption(minutesLink.id);
  await page
    .getByLabel("Wortgetreuer Beleg für Verfahrensstand", { exact: true })
    .fill(cases[0][5]);
  await page
    .getByRole("button", { name: "Verfahrensstand ausdrücklich bestätigen" })
    .click();
  await page
    .getByText("Verfahrensstand mit Quellenbeleg geprüft.", { exact: true })
    .waitFor();
  assert.equal(
    (
      await first(
        "select treatment_status from fib.ris_agenda_items where id=$1",
        [top(s1031, "2")],
      )
    ).treatment_status,
    "withdrawn",
  );
  await openSession("GR/440/2026");
  const approvalLink = await link(99001);
  await reviewDoc(approvalLink.id, "minutes");
  await openSession("GR/439/2026");
  await rationale(
    "Ausschließlich synthetischer Genehmigungsfall – keine Aussage über reale Genehmigung.",
  );
  await page
    .getByLabel("Genehmigende Sitzung", { exact: true })
    .selectOption(s1032.id);
  await page
    .getByLabel("Genehmigungsdokument", { exact: true })
    .selectOption(approvalLink.id);
  await page
    .getByLabel("Wortgetreuer Genehmigungsbeleg", { exact: true })
    .fill("Nicht im Dokument enthalten");
  await page
    .getByRole("button", {
      name: "Niederschriftsgenehmigung ausdrücklich bestätigen",
    })
    .click();
  await page.getByRole("alert").filter({ hasText: "wortgetreu" }).waitFor();
  assert.equal(
    (
      await first("select minutes_approval from fib.ris_sessions where id=$1", [
        s1031.id,
      ])
    ).minutes_approval,
    "unknown",
  );
  await page
    .getByLabel("Wortgetreuer Genehmigungsbeleg", { exact: true })
    .fill(
      "SYNTHETISCHER TEST: Die Niederschrift vom 15.10.2026 wird genehmigt.",
    );
  await page
    .getByRole("button", {
      name: "Niederschriftsgenehmigung ausdrücklich bestätigen",
    })
    .click();
  await page
    .getByText(
      "Niederschriftsgenehmigung mit späterem Sitzungsbeleg bestätigt.",
      { exact: true },
    )
    .waitFor();
  assert.equal(await count("ris_minutes_approvals"), 1);
  pass(
    "Both PR350 dialogs persist audit/evidence; missing quote denies approval; positive approval strictly synthetic",
  );
  phase = "news complete regular workflow";
  await nav("Fundstellen").click();
  await page
    .locator(".work-item")
    .filter({ hasText: "Gemeinde Feldkirchen" })
    .getByRole("button", { name: "Fundstelle öffnen", exact: true })
    .click();
  await accept("Neues Parkraumkonzept in Feldkirchen");
  await page
    .getByLabel("Bestehendes Ereignis", { exact: true })
    .selectOption("ff02ffad-e2a5-4724-a94b-073a1483051d");
  await page
    .getByLabel("Begründung *", { exact: true })
    .fill("Synthetischer bestehender Ereignisbezug für Integrationstest.");
  await page
    .getByRole("button", { name: "Fundstelle zuordnen", exact: true })
    .click();
  await page
    .getByText("Fundstelle dem Ereignis zugeordnet.", { exact: true })
    .waitFor();
  const newsEvent = await createEvent("Nachricht zum Parkraumkonzept");
  const process = (await first("select id from fib.processes limit 1")).id,
    topic = (await first("select id from fib.topics limit 1")).id;
  await proposeRelation("process", process);
  await proposeRelation("topic", topic);
  assert.equal(
    (
      await first(
        "select count(*) n from fib.event_processes where event_id=$1",
        [newsEvent],
      )
    ).n,
    "1",
  );
  assert.equal(
    (
      await first("select count(*) n from fib.event_topics where event_id=$1", [
        newsEvent,
      ])
    ).n,
    "1",
  );
  await page.screenshot({
    path: "ris-e2e-results/news-to-editorial.png",
    fullPage: true,
  });
  const observation = await first(
    "select o.*,s.source_id from fib.source_observations o join fib.source_scopes s on s.id=o.scope_id where s.scope_key='gemeinde-nachrichten'",
  );
  const stale = {
    action: "source_accept",
    scopeId: observation.scope_id,
    externalId: observation.external_id,
    sourceId: observation.source_id,
    revision: observation.revision,
    fingerprint: observation.content_fingerprint,
    title: "Neues Parkraumkonzept in Feldkirchen",
    approval: true,
  };
  state({ newsOutage: true });
  assert.equal((await call("fib-u4-pilot", { commit: true })).status, 502);
  state({ newsOutage: false, newsChanged: true });
  await ok("fib-u4-pilot", { commit: true }, f.users.admin.token);
  assert.equal(
    (await call("fib-editorial-write", stale, editorToken)).status,
    409,
  );
  const updated = await first(
    "select * from fib.source_observations where scope_id=$1",
    [observation.scope_id],
  );
  assert.equal(updated.revision, 2);
  const current = {
    ...stale,
    revision: updated.revision,
    fingerprint: updated.content_fingerprint,
  };
  const [a, b] = await Promise.all([editorial(current), editorial(current)]);
  assert.equal(a.findingId, b.findingId);
  assert.equal(
    (
      await first(
        "select count(*) n from fib.finding_versions where finding_id=$1",
        [a.findingId],
      )
    ).n,
    "2",
  );
  pass(
    "Parkraumkonzept observation → browser finding/event → confirmed existing process/topic; revisions, concurrent repeat, outage recovery",
  );
  phase = "final integrity";
  assert.equal(await count("messages"), 0);
  assert.equal(await count("processes"), 1);
  assert.equal(await count("topics"), 1);
  assert.equal(await count("ris_decision_points"), 4);
  assert.equal(
    (
      await first(
        "select count(*) n from fib.ris_decision_points p join fib.ris_agenda_items a on a.id=p.agenda_id where a.session_id=$1",
        [s1032.id],
      )
    ).n,
    "0",
  );
  assert.ok((await count("ris_review_log")) > 10);
  assert.equal(
    (
      await first(
        "select count(*) n from fib.ris_review_log where jsonb_typeof(detail) <> 'object'",
      )
    ).n,
    "0",
  );
  assert.equal(
    (
      await first(
        "select count(*) n from fib.finding_versions where jsonb_typeof(metadata) <> 'object'",
      )
    ).n,
    "0",
  );
  assert.deepEqual(browserErrors, []);
  await db.query("update fib.app_users set active=false where user_id=$1", [
    f.users.editor.id,
  ]);
  assert.equal(
    (await call("fib-editorial-write", { action: "source_list" }, editorToken))
      .status,
    403,
  );
  await db.query("update fib.app_users set active=true where user_id=$1", [
    f.users.editor.id,
  ]);
  pass(
    "No automatic publication/target creation; live membership revocation denies existing AAL2 session",
  );
  writeFileSync(
    "ris-e2e-results/database-summary.json",
    JSON.stringify(
      {
        sessions: await count("ris_sessions"),
        findings: await count("findings"),
        events: await count("events"),
        decisions: await count("ris_decision_points"),
        votes,
        messages: await count("messages"),
        reviewLog: await count("ris_review_log"),
      },
      null,
      2,
    ),
  );
} catch (error) {
  results.push({ name: phase, status: "abweichend" });
  console.error("FAIL phase: " + phase);
  if (ready)
    console.error(
      "UI alerts:",
      await page.getByRole("alert").allTextContents(),
    );
  if (ready)
    await page
      .screenshot({ path: "ris-e2e-results/failure.png", fullPage: true })
      .catch(() => {});
  throw error;
} finally {
  writeFileSync(
    "ris-e2e-results/results.json",
    JSON.stringify(results, null, 2),
  );
  writeFileSync(
    "ris-e2e-results/results.md",
    "# Integrierte RIS-Abnahme\n\n" +
      results.map((r) => "- " + r.status + ": " + r.name).join("\n") +
      "\n\nReal: Gesamt-App, GoTrue Login/TOTP, Deno-Handler, PostgreSQL 16, fib_app/fib_runtime. Simuliert: externe Quellenantworten (reduzierte reale HTML-Ausschnitte; synthetische PDF-Hüllen mit dokumentierten Originaltextauszügen bzw. ausdrücklich synthetischen Vorschlags-/Genehmigungstexten). Kein Produktiv- oder fachlicher Abnahmenachweis.\n",
  );
  if (browser) await browser.close();
  await db.end();
}
