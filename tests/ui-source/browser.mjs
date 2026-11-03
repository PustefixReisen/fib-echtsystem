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
  page.locator("section").filter({ has: heading("Weitere Ereignisse zum TOP") });
const main = () => page.locator("section").filter({has: heading("TOP als Ereignis festlegen")});
const sessionEvents = () => page.locator("section").filter({has: heading("Ereignisse zur Sitzung")});
const linkRelated = () => local().getByRole("button", { name: "Ereignis zuordnen" });
try {
  await page.goto("http://127.0.0.1:4174");
  await button("Sitzungsbereich").click();
  await button("Sitzung öffnen").click();
  const tabs=page.getByRole("navigation",{name:"Sitzung und Tagesordnungspunkte"});
  await tabs.getByRole("button",{name:"TOP 2"}).click();
  assert.equal(await tabs.getByRole("button",{name:"TOP 2"}).getAttribute("aria-current"),"page");
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
  assert.equal(await page.locator(".ris-document-item .fib-external-icon").count(), 1);
  assert.equal(await page.locator(".ris-document-item").getByRole("button",{name:"Fundstelle öffnen"}).count(),0);
  await linkRelated().click();
  await heading("Weiteres Ereignis zuordnen").waitFor();
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
  await heading("Weitere Ereignisse zum TOP").waitFor();
  assert.ok(
    (await local().innerText()).includes("Pressebericht zur Kita-Finanzierung"),
  );
  const call = await page.evaluate(() =>
    window.calls.find((c) => c.action === "ris_link_event")
  );
  assert.equal(call.rationale, undefined);
  assert.equal(call.role, undefined);
  await linkRelated().click();
  await page.getByText(/Bereits zugeordnet/).waitFor();
  assert.ok(await page.getByRole("radio").first().isDisabled());
  await button("Abbrechen").click();
  await local().getByRole("button", { name: /Zuordnung zu .* entfernen/ })
    .click();
  await page.getByText("Keine weiteren Ereignisse zugeordnet.").waitFor();
  await linkRelated().click();
  await button("Neu: Ereignis").click();
  await page.getByLabel("Ereignistitel *", { exact: true }).fill(
    "Lokales Ereignis außerhalb der Sitzung",
  );
  await button("Speichern").click();
  await heading("Weitere Ereignisse zum TOP").waitFor();
  assert.ok(
    (await local().innerText()).includes(
      "Lokales Ereignis außerhalb der Sitzung",
    ),
  );
  assert.equal(await page.locator(".ris-document-item .fib-external-icon").count(),1,
    "RIS original is linked exactly once next to its document title");
  assert.equal(await page.locator(".ris-document-item").getByText("RIS-Original",{exact:true}).count(),0);
  assert.equal(await button("Fundstelle öffnen").count(),0,
    "RIS TOP does not open a redundant findings detail");
  await heading("Beschlussvorschlag / Dokumente").waitFor();
  assert.equal(
    await local().getByRole("button", { name: "Ereignis öffnen", exact: true }).count(),
    1,
  );
  await linkRelated().click();
  await button("Neu: Ereignis").click();
  await button("Abbrechen").click();
  await heading("Weiteres Ereignis zuordnen").waitFor();
  await button("Abbrechen").click();
  await heading("Weitere Ereignisse zum TOP").waitFor();
  // One explicitly chosen main TOP event; press material is never auto-linked.
  await main().getByRole("button", { name: "Auswählen oder erstellen" }).click();
  await button("Neu: Ereignis").click();
  await page.getByLabel("Ereignistitel *", { exact: true }).fill("TOP 2: Beratung zum Elternbeitragszuschuss");
  await button("Speichern").click();
  await heading("TOP als Ereignis festlegen").waitFor();
  assert.equal(await main().getByRole("button", {name:"Ereignis öffnen"}).count(),1);
  assert.equal(await main().getByRole("button", {name:"Auswählen oder erstellen"}).count(),0);
  assert.equal(await page.evaluate(() => window.calls.filter(c=>c.action==="ris_link_main_event").length),0,
    "Main event creation commits the explicit role without another linking action");
  await page.getByRole("navigation", {name:"Sitzung und Tagesordnungspunkte"}).getByRole("button",{name:"Sitzungsübersicht"}).click();
  await heading("Ereignisse zur Sitzung").waitFor();
  await sessionEvents().getByRole("button",{name:"Ereignis zuordnen"}).click();
  await page.getByRole("radio").first().check();
  await button("Zuordnen").click();
  await heading("Ereignisse zur Sitzung").waitFor();
  assert.equal(await sessionEvents().getByRole("button",{name:"Ereignis öffnen"}).count(),1);
  assert.equal(await page.evaluate(() => window.calls.filter(c=>c.action==="ris_link_session_event").length),1);
  assert.equal(await page.getByText("TOP 2: Beratung zum Elternbeitragszuschuss").count(),0,
    "Session event selection cannot automatically add the TOP's editorial main event to its list");
  await button("TOP 2 öffnen").click();
  await heading("TOP als Ereignis festlegen").waitFor();
  mkdirSync("/tmp/fib-source-ui", { recursive: true });
  await page.screenshot({
    path: "/tmp/fib-source-ui/ris-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await tabs.getByRole("button",{name:"TOP 2"}).count(),1);
  assert.equal(await page.getByRole("button",{name:"‹ Zurück zur Tagesordnung"}).count(),0);
  assert.equal(
    await page.evaluate(() =>
      document.documentElement.scrollWidth > innerWidth + 1
    ),
    false,
  );
  assert.equal(await page.locator('.ris-document-item .ris-external-reference .fib-external-icon').count(),1);
  assert.equal(await page.evaluate(() => {
    const row=document.querySelector('.ris-document-item .ris-external-reference');
    const icon=row?.querySelector('.fib-external-icon');
    const name=row?.querySelector('span');
    return Boolean(icon && name && icon.getBoundingClientRect().left < name.getBoundingClientRect().left);
  }), true, 'External RIS icon precedes the plain document title at mobile width');
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
    "PASS actual SourceWorkspace/RisSessionView components: local event links, modal cancel navigation, event creation, lock retry, external RIS navigation without stored-PDF UI, exact TOP return, origin, title, mobile and Gemeinde regression (simulated APIs; no live MFA or print claim)",
  );
} catch (e) {
  console.error(await page.locator("body").innerText());
  throw e;
} finally {
  await browser.close();
  await server.close();
}
