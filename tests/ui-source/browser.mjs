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
    .first()
    .click();
  await page.getByRole("button", { name: "TOP 2 öffnen" }).click();
  await panel("Beschlussvorschlag").waitFor();
  assert.equal(await panel("Beschlussfassung").count(), 0);
  await page.getByRole("button", { name: "Dokumentfassung öffnen" }).first().click();
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
  await page.getByRole("button", { name: "TOP 2 öffnen" }).click();
  await page.getByRole("button", { name: "Neu: Lokaler Bezug" }).click();
  await page.getByRole("heading", { name: "Lokalen Bezug hinzufügen" }).waitFor();
  await page.getByRole("button", { name: "Abbrechen" }).click();
  assert.equal(await page.getByRole("heading", { name: "Lokalen Bezug hinzufügen" }).count(), 0);
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
    .first()
    .click();
  await page.getByRole("button", { name: "TOP 2 öffnen" }).click();
  await panel("Beschlussfassung").getByRole("heading", { name: "Beschlusspunkt A", exact: true }).waitFor();
  const first = panel("Beschlussfassung").locator("article").first();
  assert.match(await first.innerText(), /Ja: –.*Nein: –/);
  assert.equal(await first.locator("img").count(), 0, "Source text is escaped, never executed");
  assert.equal(await panel("Beschlussfassung").locator("article").count(), 2);
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
