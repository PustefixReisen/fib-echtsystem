import assert from "node:assert/strict";
import { chromium } from "playwright";
import { createServer } from "vite";
const server = await createServer({
  configFile: "tests/ui-source/vite.config.ts",
});
await server.listen();
console.log("server ready");
import { mkdirSync, readFileSync } from "node:fs";
const deploy = readFileSync(
  ".github/workflows/editorial-web-deploy.yml",
  "utf8",
);
assert.ok(!/^  push:/m.test(deploy));
assert.ok(deploy.includes("inputs.confirmation == 'DEPLOY'"));
const browser = await chromium.launch({ headless: true });
console.log("browser ready");
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
page.setDefaultTimeout(12000);
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.route("**/*", (r) =>
  new URL(r.request().url()).hostname === "127.0.0.1"
    ? r.continue()
    : r.abort(),
);
let acceptNavigation = true;
page.on("dialog", (d) => (acceptNavigation ? d.accept() : d.dismiss()));
const panel = (title) =>
  page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: title, exact: true }) });
try {
  await page.goto("http://127.0.0.1:4174");
  console.log("page loaded");
  await page
    .getByRole("button", { name: "Fundstelle öffnen", exact: true })
    .first()
    .waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "Fundstelle öffnen", exact: true })
      .count(),
    2,
  );
  await page
    .getByRole("button", { name: "Sitzungsbereich", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Sitzung öffnen", exact: true })
    .click();
  await page
    .getByLabel("Tagesordnungspunkt", { exact: true })
    .selectOption("t2");
  await page
    .getByText("Kein tatsächlicher Beschluss im geprüften Bestand belegt.", {
      exact: false,
    })
    .waitFor();
  assert.equal(
    await panel("Tatsächliche Beschlüsse")
      .getByText("Abgelehnt", { exact: true })
      .count(),
    0,
  );
  await page
    .getByText("Unsicher – noch nicht bestätigt", { exact: true })
    .waitFor();
  await page
    .getByRole("button", {
      name: "In Fundstellenverwaltung öffnen",
      exact: true,
    })
    .click();
  assert.equal(
    await page
      .getByRole("button", { name: "Fundstelle ausdrücklich übernehmen" })
      .isDisabled(),
    true,
  );
  await page
    .getByLabel("Titel der Fundstelle *", { exact: true })
    .fill("Vorlage zum Elternbeitragszuschuss");
  acceptNavigation = false;
  await page
    .getByRole("button", { name: "Zurück zur Liste", exact: true })
    .click();
  assert.equal(
    await page
      .getByLabel("Titel der Fundstelle *", { exact: true })
      .inputValue(),
    "Vorlage zum Elternbeitragszuschuss",
  );
  acceptNavigation = true;
  await page.evaluate(() => (window.failNext = true));
  await page
    .getByRole("button", { name: "Fundstelle ausdrücklich übernehmen" })
    .click();
  await page.getByRole("alert").filter({ hasText: "veraltet" }).waitFor();
  assert.equal(
    await page
      .getByLabel("Titel der Fundstelle *", { exact: true })
      .inputValue(),
    "Vorlage zum Elternbeitragszuschuss",
  );
  await page
    .getByRole("button", { name: "Fundstelle ausdrücklich übernehmen" })
    .click();
  await page.getByText("Fundstelle übernommen.", { exact: false }).waitFor();
  assert.equal(
    await page.evaluate(
      () =>
        window.calls.filter((c) => c.action === "source_create_event").length,
    ),
    0,
  );
  await page
    .getByText("Neue Sachinformation als eigenes Ereignis bestätigen", {
      exact: true,
    })
    .click();
  await page
    .getByLabel("Ereignistitel *", { exact: true })
    .fill("Veröffentlichung der Vorlage zum Elternbeitragszuschuss");
  await page
    .getByLabel("Begründung *", { exact: true })
    .fill("Die Vorlage belegt die angekündigte Beratung; noch kein Beschluss.");
  await page
    .getByRole("button", { name: "Neues Ereignis ausdrücklich bestätigen" })
    .click();
  await page
    .getByText("Ereignis ausdrücklich bestätigt.", { exact: false })
    .waitFor();
  await page
    .getByRole("button", { name: "Ereignis öffnen", exact: true })
    .first()
    .click();
  await page
    .getByText("Regulärer Ereigniseditor geöffnet:", { exact: false })
    .waitFor();
  await page.getByRole("button", { name: "RIS-Kontext öffnen" }).click();
  await page
    .getByLabel("Tagesordnungspunkt", { exact: true })
    .selectOption("t2");
  await page
    .getByLabel("Begründung für die nächste Entscheidung *", { exact: true })
    .fill("Dokument und Bezug anhand der Originalquelle geprüft.");
  await page
    .getByLabel("Dokument auswählen", { exact: true })
    .selectOption("link2");
  await page
    .getByRole("button", { name: "Dokument bestätigen", exact: true })
    .click();
  await page.getByText("Dokumentzuordnung geprüft.", { exact: true }).waitFor();
  const event = await page.evaluate(
    () =>
      window.calls.find((c) => c.action === "source_create_event").requestId,
  );
  await page.getByLabel("Ereignis", { exact: true }).selectOption(event);
  await page.evaluate(() => (window.denyLock = true));
  await page.getByRole("button", { name: "TOP dem Ereignis zuordnen" }).click();
  await page
    .getByRole("alert")
    .filter({ hasText: "bereits bearbeitet" })
    .waitFor();
  assert.equal(
    await page.evaluate(
      () => window.calls.filter((c) => c.action === "ris_link_event").length,
    ),
    0,
  );
  await page.evaluate(() => (window.denyLock = false));
  await page.getByRole("button", { name: "TOP dem Ereignis zuordnen" }).click();
  await page
    .getByText("TOP und Ereignis ausdrücklich zugeordnet.", { exact: true })
    .waitFor();
  await page
    .getByText("Belegten Text als Vorschlag erfassen", { exact: true })
    .click();
  await page.getByLabel("Vorlage", { exact: true }).selectOption("pr2");
  await page
    .getByLabel("Wortlaut *", { exact: true })
    .fill("Vorschlag zur Förderung.");
  await page
    .getByLabel("Wortgetreuer Beleg einschließlich Abstimmung *", {
      exact: true,
    })
    .fill("Synthetischer UI-Prüftext: Vorschlag zur Förderung.");
  await page
    .getByRole("button", { name: "Vorschlag speichern", exact: true })
    .click();
  await panel("Offene und entschiedene Vorschläge")
    .getByText("Vorschlag – Prüfung offen", { exact: true })
    .waitFor();
  await panel("Offene und entschiedene Vorschläge")
    .getByRole("button", { name: "Bestätigen", exact: true })
    .click();
  await panel("Offene und entschiedene Vorschläge")
    .getByText("Bestätigt", { exact: true })
    .waitFor();
  assert.equal(
    await panel("Tatsächliche Beschlüsse")
      .getByRole("heading", { name: /Beschlusspunkt/ })
      .count(),
    0,
  );
  await page
    .getByText("Bestehenden Vorgang oder bestehendes Thema vorschlagen", {
      exact: true,
    })
    .click();
  await page.getByLabel("Zuordnungsart", { exact: true }).selectOption("topic");
  await page
    .getByLabel("Bestehendes Ziel", { exact: true })
    .selectOption("theme1");
  await page
    .getByRole("button", { name: "Zuordnung vorschlagen", exact: true })
    .click();
  await panel("Ereignisse, Vorgänge und Themen")
    .getByText("Vorschlag – Prüfung offen", { exact: true })
    .waitFor();
  await panel("Ereignisse, Vorgänge und Themen")
    .getByRole("button", { name: "Bestätigen", exact: true })
    .click();
  await panel("Ereignisse, Vorgänge und Themen")
    .getByText("Bestätigt", { exact: true })
    .waitFor();
  mkdirSync("/tmp/fib-source-ui", { recursive: true });
  await page.screenshot({
    path: "/tmp/fib-source-ui/ris-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    ),
    false,
    "No horizontal overflow at 390px",
  );
  await page.screenshot({
    path: "/tmp/fib-source-ui/ris-mobile.png",
    fullPage: true,
  });
  // Independent Gemeinde handoff uses the same list/detail/editor components.
  await page
    .getByRole("button", { name: "Fundstellenbereich", exact: true })
    .click();
  await page
    .locator(".work-item")
    .filter({ hasText: "Gemeinde Feldkirchen" })
    .getByRole("button", { name: "Fundstelle öffnen", exact: true })
    .click();
  await page
    .getByLabel("Titel der Fundstelle *", { exact: true })
    .fill("Neues Parkraumkonzept in Feldkirchen");
  await page
    .getByRole("button", { name: "Fundstelle ausdrücklich übernehmen" })
    .click();
  await page.getByText("Fundstelle übernommen.", { exact: false }).waitFor();
  assert.ok(
    await page
      .getByRole("heading", {
        name: "Neues Parkraumkonzept in Feldkirchen",
        exact: true,
      })
      .count(),
  );
  // Synthetic rendering cases, not assertions about the real 29 October decisions.
  await page.evaluate(() => (window.showDecisionCases = true));
  await page
    .getByRole("button", { name: "Sitzungsbereich", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Sitzung öffnen", exact: true })
    .click();
  await page
    .getByLabel("Tagesordnungspunkt", { exact: true })
    .selectOption("t2");
  await panel("Tatsächliche Beschlüsse")
    .getByRole("heading", { name: "Beschlusspunkt A", exact: true })
    .waitFor();
  const first = panel("Tatsächliche Beschlüsse").locator("article").first();
  await first.getByText("Unbekannt", { exact: true }).waitFor();
  assert.match(await first.innerText(), /Ja: unbekannt.*Nein: unbekannt/);
  assert.equal(
    await first.locator("img").count(),
    0,
    "Source text is escaped, never executed",
  );
  await first
    .getByText("Die Quelle hat sich geändert.", { exact: false })
    .waitFor();
  await panel("Tatsächliche Beschlüsse")
    .getByText("Abgelehnt", { exact: true })
    .waitFor();
  assert.equal(
    await panel("Tatsächliche Beschlüsse").locator("article").count(),
    2,
  );
  assert.deepEqual(errors, []);
  console.log(
    "RIS + Gemeinde UI: shared source management, explicit intake, event handoff, proposal/decision separation, stale-input retry, lock denial, mobile layout and no automatic message passed",
  );
} catch (error) {
  console.error(await page.locator("body").innerText());
  console.error(errors);
  throw error;
} finally {
  await browser.close();
  await server.close();
}
