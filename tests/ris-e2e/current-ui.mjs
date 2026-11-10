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
  await page.getByRole("heading", { name: "Sitzungsübersicht", exact: true }).waitFor();
  await page.getByRole("heading", { name: "TOPs", exact: true }).waitFor();
  await page.getByRole("button",{name:"Info zur RIS-Übernahme"}).click();
  await page.getByRole("note",{name:"RIS-Geschäftsregel"}).waitFor();
  const top2 = page.locator("article").filter({has:page.getByRole("heading",{name:/^TOP 2 ·/})});
  await top2.getByRole("link",{name:"Beschlussvorlage im RIS öffnen"}).waitFor();
  const event = await db.query(`select te.event_id from fib.ris_top_events te
    join fib.ris_agenda_items a on a.id=te.agenda_id where a.session_id=$1 and a.number='2'`,[session.id]);
  assert.equal(event.rowCount,1);
  assert.equal((await db.query("select count(*)::int n from fib.ris_session_events")).rows[0].n,0);
  assert.ok((await db.query("select count(*)::int n from fib.event_findings where event_id=$1",[event.rows[0].event_id])).rows[0].n > 0);
  assert.equal((await invoke("fib-editorial-write",{action:"ris_review_agenda_status"})).status,403);
  await top2.getByRole("button",{name:/^Ereignis öffnen/}).click();
  await page.getByRole("button",{name:"Sitzungen · TOP 2"}).waitFor();
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
