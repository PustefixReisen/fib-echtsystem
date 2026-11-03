import assert from "node:assert/strict";
import { chromium, firefox } from "playwright";
import pg from "pg";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { auth, totp } from "./common.mjs";

const root = process.env.RUNNER_TEMP;
const fixture = JSON.parse(readFileSync(root + "/ris-e2e.json", "utf8"));
const db = new pg.Client({
  connectionString: "postgres://postgres:" + process.env.TEST_DB_PASSWORD +
    "@127.0.0.1:54323/fib_u4_test",
});
let browser;
const results = [];
const record = (text) => { results.push(text); console.log("PASS " + text); };
const invoke = async (name, body, token = fixture.users.admin.token) => {
  const response = await fetch("http://127.0.0.1:54321/functions/v1/" + name, {
    method: "POST",
    headers: { authorization: "Bearer " + token, apikey: fixture.anon, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: response.status, data: await response.json() };
};
try {
  await db.connect();
  const limited = new pg.Client({ connectionString: fixture.runtime });
  await limited.connect();
  const role = (await limited.query("select current_user,rolsuper,rolbypassrls from pg_roles where rolname=current_user")).rows[0];
  assert.equal(role.current_user, "fib_app");
  assert.equal(role.rolsuper, false);
  assert.equal(role.rolbypassrls, false);
  await assert.rejects(() => limited.query("select * from auth.users"), /permission denied/);
  await limited.end();
  const aal1 = await auth("/token?grant_type=password", {
    email: fixture.users.editor.email, password: fixture.users.editor.password,
  });
  for (const token of [aal1.access_token, fixture.users.outsider.token, "invalid-token"]) {
    for(const action of ['ris_sessions','source_pdf','source_capture_pdf','ris_confirm_storage_rights'])assert.equal((await invoke("fib-editorial-write", { action,versionId:crypto.randomUUID() }, token)).status,403);
  }
  record("Restricted runtime database role, AAL1 and outsider access rejected");

  let imported = false;
  for (let i = 0; i < 10; i++) {
    const scan = await invoke("fib-u4-ris-pilot", { commit: true });
    assert.equal(scan.status, 200, JSON.stringify(scan.data));
    const current = (await db.query("select count(*)::int as n from fib.ris_sessions")).rows[0].n;
    const versions = (await db.query("select count(*)::int as n from fib.ris_document_versions")).rows[0].n;
    if (current === 2 && versions >= 2) { imported = true; break; }
  }
  assert.equal(imported, true, "Reference scan imports both sessions with document versions");
  assert.equal((await db.query("select count(*)::int as n from fib.ris_decision_points")).rows[0].n, 0);
  const session = (await db.query("select id from fib.ris_sessions where source_url like '%=1032'")).rows[0];
  assert.ok(session);
  record("Actual scanner and isolated PostgreSQL preserve RIS structure without invented decisions");

  browser = process.env.FIB_TEST_BROWSER === "firefox" ? await firefox.launch({firefoxUserPrefs:{"pdfjs.disabled":false,"browser.download.open_pdf_attachments_inline":true}}) : await chromium.launch(process.env.FIB_CHROMIUM_PATH?{executablePath:process.env.FIB_CHROMIUM_PATH,args:["--no-sandbox"]}:{});
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/*", (route) =>
    new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort());
  await page.goto("http://127.0.0.1:4173");
  await page.getByLabel("E-Mail", { exact: true }).fill(fixture.users.editor.email);
  await page.getByLabel("Passwort", { exact: true }).fill(fixture.users.editor.password);
  await page.getByRole("button", { name: "Anmelden", exact: true }).click();
  await page.getByRole("button", { name: "MFA bestätigen", exact: true }).waitFor();
  await new Promise((resolve) => setTimeout(resolve, 31000 - (Date.now() % 30000)));
  await page.locator('input[autocomplete="one-time-code"]').fill(totp(fixture.users.editor.secret));
  await page.getByRole("button", { name: "MFA bestätigen", exact: true }).click();
  await page.locator(".side-nav").getByRole("button", { name: "Sitzungen", exact: true }).click();
  await page.locator(".work-item").filter({ hasText: "GR/440/2026" })
    .getByRole("button", { name: "Sitzung öffnen" }).click();
  await page.getByRole("heading", { name: "Tagesordnung", exact: true }).waitFor();
  await page.getByRole("button", { name: "TOP 2 öffnen" }).click();
  await page.getByRole("heading", { name: "Beschlussvorschlag / Dokumente", exact: true }).waitFor();
  assert.equal(await page.getByRole("heading", { name: "Beschlussfassung", exact: true }).count(), 0);
  assert.equal(await page.getByLabel("Tagesordnungspunkt", { exact: true }).count(), 0);
  assert.equal(await page.getByRole("heading", { name: "Redaktionelle Prüfung", exact: true }).count(), 0);
  await page.locator("section").filter({has:page.getByRole("heading",{name:"Weitere Ereignisse zum TOP",exact:true})}).getByRole("button",{name:"Ereignis zuordnen"}).click();
  await page.getByRole("heading", { name: "Weiteres Ereignis zuordnen" }).waitFor();
  await page.getByRole("button", { name: "Abbrechen" }).click();
  assert.equal(await page.getByRole("heading", { name: "Weiteres Ereignis zuordnen" }).count(), 0);
  // Real authenticated document workflow; Storage and source responses are explicit fixtures.
  const beforeFindings=(await db.query("select count(*)::int n from fib.findings")).rows[0].n;
  assert.ok(beforeFindings>=2);
  await page.locator("section").filter({has:page.getByRole("heading",{name:"Weitere Ereignisse zum TOP",exact:true})}).getByRole("button",{name:"Ereignis zuordnen"}).click();
  await page.getByRole("button",{name:"Neu: Ereignis",exact:true}).click();
  await page.getByLabel("Ereignistitel *",{exact:true}).fill("Isolierter lokaler Bezug außerhalb der Sitzung");
  await page.getByRole("button",{name:"Speichern",exact:true}).click();
  await page.getByRole("heading",{name:"Weitere Ereignisse zum TOP",exact:true}).waitFor();
  assert.equal((await db.query("select count(*)::int n from fib.event_findings")).rows[0].n,0);
  assert.equal(await page.getByRole("button",{name:"Fundstelle öffnen",exact:true}).count(),0);
  assert.equal(await page.getByRole("heading",{name:"Ereignisbezug",exact:true}).count(),0);
  assert.equal(await page.getByRole("heading",{name:"Versionen",exact:true}).count(),0);
  assert.equal(await page.getByRole("button",{name:"PDF-Vorschau öffnen",exact:true}).count(),0);
  assert.ok(await page.locator(".ris-document-item .ris-external-reference .fib-external-icon").count()>=1);
  assert.equal(await page.locator(".ris-document-item").getByText("RIS-Original",{exact:true}).count(),0);
  await page.locator("section").filter({has:page.getByRole("heading",{name:"Weitere Ereignisse zum TOP",exact:true})}).getByRole("button",{name:"Ereignis zuordnen"}).click();
  await page.getByRole("button",{name:"Neu: Ereignis",exact:true}).click();
  await page.getByRole("button",{name:"Abbrechen",exact:true}).click();
  await page.getByRole("heading",{name:"Weiteres Ereignis zuordnen",exact:true}).waitFor();
  await page.getByRole("button",{name:"Abbrechen",exact:true}).click();
  record("Real MFA app → local TOP link → external RIS-only icon without redundant finding page → modal cancel returns to selection");
  await page.locator("section").filter({has:page.getByRole("heading",{name:"TOP als Ereignis festlegen",exact:true})})
    .getByRole("button",{name:"Auswählen oder erstellen"}).click();
  await page.getByRole("button",{name:"Neu: Ereignis"}).click();
  await page.getByLabel("Ereignistitel *",{exact:true}).fill("TOP 2: redaktionelles Hauptereignis");
  await page.getByRole("button",{name:"Speichern"}).click();
  await page.getByRole("heading",{name:"TOP als Ereignis festlegen",exact:true}).waitFor();
  await page.getByText("TOP 2: redaktionelles Hauptereignis",{exact:false}).waitFor();
  assert.equal((await db.query("select count(*)::int n from fib.ris_agenda_events where role='main_event'")).rows[0].n,1);
  assert.equal((await db.query("select count(*)::int n from fib.ris_agenda_events where role='local_reference'")).rows[0].n,1);
  record("Manual TOP main event and related events remain independent");
  await page.getByRole("navigation",{name:"Sitzung und Tagesordnungspunkte"}).getByRole("button",{name:"Sitzungsübersicht"}).click();
  await page.getByRole("heading",{name:"Ereignisse zur Sitzung",exact:true}).waitFor();
  await page.locator("section").filter({has:page.getByRole("heading",{name:"Ereignisse zur Sitzung",exact:true})})
    .getByRole("button",{name:"Ereignis zuordnen"}).click();
  await page.getByRole("radio").first().check();
  await page.getByRole("button",{name:"Zuordnen"}).click();
  await page.getByRole("heading",{name:"Ereignisse zur Sitzung",exact:true}).waitFor();
  assert.equal((await db.query("select count(*)::int n from fib.ris_session_events")).rows[0].n,1);
  assert.equal((await db.query("select count(*)::int n from fib.ris_agenda_events where role='main_event'")).rows[0].n,1,
    "A session-wide event does not automatically attach to any TOP");
  record("Session-wide event stored without automatic TOP association");
  await page.getByRole("button", { name: "TOP 3 öffnen" }).click();
  await page.getByRole("heading", { name: "Beschlussvorschlag / Dokumente", exact: true }).waitFor();
  assert.equal((await db.query("select count(*)::int n from fib.event_findings")).rows[0].n,0,
    "TOP associations do not implicitly create finding associations");
  assert.deepEqual(errors, []);
  record("Real login and TOTP → RIS agenda → TOP2/TOP3 → separate event search view, without retired review masks");
  assert.equal((await db.query("select count(*)::int as n from fib.messages")).rows[0].n, 0);
} finally {
  const resultsDirectory=process.env.FIB_TEST_RESULTS_DIR ?? "ris-e2e-results";
  mkdirSync(resultsDirectory,{recursive:true});
  writeFileSync(resultsDirectory+"/results.json", JSON.stringify(results, null, 2));
  if (browser) await browser.close();
  await db.end().catch(() => {});
}
