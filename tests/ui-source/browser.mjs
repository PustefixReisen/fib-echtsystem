import assert from "node:assert/strict";
import { chromium } from "playwright";
import { createServer } from "vite";
import { mkdirSync, readFileSync } from "node:fs";
const deploy = readFileSync(
  ".github/workflows/editorial-web-deploy.yml",
  "utf8",
);
assert.ok(!/^  push:/m.test(deploy));
assert.ok(deploy.includes("inputs.confirmation == 'DEPLOY'"));
const server = await createServer({
  configFile: "tests/ui-source/vite.config.ts",
});
await server.listen();
const browser = await chromium.launch(
  process.env.FIB_CHROMIUM_PATH
    ? { executablePath: process.env.FIB_CHROMIUM_PATH, args: ["--no-sandbox"] }
    : {},
);
const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
page.setDefaultTimeout(10000);
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("dialog", (d) => d.accept());
await page.route(
  "**/*",
  (r) =>
    new URL(r.request().url()).hostname === "127.0.0.1"
      ? r.continue()
      : r.abort(),
);
const button = (name) => page.getByRole("button", { name, exact: true });
const heading = (name) => page.getByRole("heading", { name, exact: true });
const local = () =>
  page.locator("section").filter({ has: heading("Lokale Bezüge") });
try {
  await page.goto("http://127.0.0.1:4174");
  await button("Sitzungsbereich").click();
  await button("Sitzung öffnen").click();
  await button("TOP 2 öffnen").click();
  await heading("Beschlussvorschlag / Dokumente").waitFor();
  assert.equal(await heading("Beschlussfassung").count(), 0);
  assert.equal(
    await page.getByText("Must not render raw", { exact: true }).count(),
    0,
  );
  assert.equal(
    await page.locator("h3 button").count(),
    0,
    "Object titles are selectable text",
  );
  assert.ok(
    (await page.locator(".ris-document-item").innerText()).includes(
      "29.10.2026",
    ),
  );
  assert.equal(await page.getByRole("button", { name: /^PDF-Vorschau:/ }).count(), 0);
  assert.equal(await heading("Versionen").count(), 0);
  assert.equal(await heading("Beschlussvorschlag / Dokumente").count(), 1);
  assert.equal(await button("Fundstelle öffnen").count(), 1);
  await button("Neu: Lokaler Bezug").click();
  await heading("Lokalen Bezug hinzufügen").waitFor();
  assert.equal(await page.locator("select").count(), 0);
  assert.equal(
    await page.locator("textarea").count(),
    0,
    "Local association has no rationale",
  );
  await page.getByRole("radio").first().check();
  await page.evaluate(() => window.denyLock = true);
  await button("Zuordnen").click();
  await page.getByRole("alert").waitFor();
  await page.evaluate(() => window.denyLock = false);
  await button("Zuordnen").click();
  await heading("Lokale Bezüge").waitFor();
  assert.ok(
    (await local().innerText()).includes("Pressebericht zur Kita-Finanzierung"),
  );
  const call = await page.evaluate(() =>
    window.calls.find((c) => c.action === "ris_link_event")
  );
  assert.equal(call.rationale, undefined);
  assert.equal(call.role, undefined);
  await button("Neu: Lokaler Bezug").click();
  await page.getByText(/Bereits zugeordnet/).waitFor();
  assert.ok(await page.getByRole("radio").first().isDisabled());
  await button("Abbrechen").click();
  await local().getByRole("button", { name: /Lokalen Bezug.*entfernen/ })
    .click();
  await page.getByText("Noch kein Ereignis zugeordnet.").waitFor();
  await button("Neu: Lokaler Bezug").click();
  await button("Neu: Ereignis").click();
  await page.getByLabel("Ereignistitel *", { exact: true }).fill(
    "Lokales Ereignis außerhalb der Sitzung",
  );
  await button("Speichern").click();
  await heading("Lokale Bezüge").waitFor();
  assert.ok(
    (await local().innerText()).includes(
      "Lokales Ereignis außerhalb der Sitzung",
    ),
  );
  await button("Fundstelle öffnen").click();
  await page.getByText(/Amtliche Herkunft: verifizierter RIS-Import/).waitFor();
  assert.equal(await button("Fundstelle ausdrücklich übernehmen").count(), 0);
  await button("Ereignis zuordnen").click();
  await page.getByRole("radio").filter({ hasText: "" }).first().check();
  await button("Zuordnen").click();
  await button("Ereignis zuordnen").waitFor();
  assert.equal(
    await page.getByRole("button", { name: "Ereignis öffnen", exact: true })
      .count(),
    1,
  );
  await button("Ereignis zuordnen").click();
  await button("Neu: Ereignis").click();
  assert.ok(
    (await page.getByLabel("Ereignistitel *", { exact: true }).inputValue())
      .includes("29.10.2026"),
  );
  await page.getByLabel("Ereignistitel *", { exact: true }).fill(
    "Ereignis aus Dokument-Fundstelle",
  );
  await button("Speichern").click();
  await button("Ereignis zuordnen").waitFor();
  assert.equal(
    await page.getByRole("button", { name: "Ereignis öffnen", exact: true })
      .count(),
    2,
    "A finding can support multiple events",
  );
  await button("Zurück zu TOP 2").click();
  await heading("Beschlussvorschlag / Dokumente").waitFor();
  assert.equal(
    await local().getByRole("button", { name: "Ereignis öffnen", exact: true })
      .count(),
    1,
    "Document relationships do not add TOP relationships",
  );
  mkdirSync("/tmp/fib-source-ui", { recursive: true });
  await page.screenshot({
    path: "/tmp/fib-source-ui/ris-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(() =>
      document.documentElement.scrollWidth > innerWidth + 1
    ),
    false,
  );
  const actionRows=await page.locator('.ris-document-item .fib-action-icon').evaluateAll(nodes=>nodes.map(n=>Math.round(n.getBoundingClientRect().top)));
  assert.equal(new Set(actionRows).size,1,'Document actions stay together at mobile width');
  await page.screenshot({
    path: "/tmp/fib-source-ui/ris-mobile.png",
    fullPage: true,
  });
  await button("Fundstellenbereich").click();
  await page.locator(".work-item").filter({ hasText: "Gemeinde Feldkirchen" })
    .getByRole("button", { name: "Fundstelle öffnen" }).click();
  await page.getByLabel("Titel der Fundstelle *", { exact: true }).fill(
    "Parkraumkonzept",
  );
  await button("Fundstelle ausdrücklich übernehmen").click();
  await heading("Parkraumkonzept").waitFor();
  assert.equal(
    await page.evaluate(() =>
      window.calls.filter((c) => c.action === "source_create_event").length
    ),
    2,
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS actual SourceWorkspace/RisSessionView components: independent local/direct n:m links, optional rationale, event creation, lock retry, external RIS navigation without stored-PDF UI, exact TOP return, origin, title, mobile and Gemeinde regression (simulated APIs; no live MFA or print claim)",
  );
} catch (e) {
  console.error(await page.locator("body").innerText());
  throw e;
} finally {
  await browser.close();
  await server.close();
}
