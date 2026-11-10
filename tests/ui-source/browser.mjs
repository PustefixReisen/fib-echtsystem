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
try {
  await page.goto("http://127.0.0.1:4174");
  await page.evaluate(() => { window.showDecisionCases=true; });
  await button("Sitzungsbereich").click();
  const search = page.getByRole("searchbox");
  const sessions = page.locator(".source-list-row");
  await sessions.nth(1).waitFor();
  for (const term of ["Gemeinderat", "440", "29.10.2026", "2026-10-29"]) {
    await search.fill(term);
    await sessions.filter({ hasText: "GR/440/2026" }).waitFor();
    assert.equal(await sessions.count(), 1, term);
  }
  await search.fill("15.09.2026");
  await sessions.getByText("Bauausschuss · 15.09.2026", {exact:true}).waitFor();
  assert.equal(await sessions.count(), 1);
  await search.fill("ohne Treffer");
  await page.waitForFunction(() => window.calls.some(c => c.search === "ohne Treffer"));
  await search.fill("Gemeinderat");
  await sessions.filter({ hasText: "GR/440/2026" }).waitFor();
  // Let the deliberately slow earlier request finish after the current result.
  await page.waitForTimeout(450);
  assert.equal(await sessions.count(), 1);
  await search.fill("");
  await sessions.nth(1).waitFor();
  assert.equal(await button("Suchen").count(), 0);

  mkdirSync("/tmp/fib-source-ui", { recursive: true });
  for (const width of [1440, 412]) {
    await page.setViewportSize({ width, height: 884 });
    const council = sessions.filter({ hasText: "GR/440/2026" });
    const arrow = council.getByRole("button", { name: "Sitzung öffnen" });
    const councilLabel = council.getByText("Gemeinderat · 29.10.2026", { exact: true });
    await councilLabel.waitFor();
    const text = await councilLabel.boundingBox();
    const icon = await arrow.boundingBox();
    assert.ok(text && icon, "Sitzungsdatum und Pfeil sind sichtbar");
    assert.ok(icon.x >= text.x + text.width);
    assert.ok(icon.y <= text.y && icon.y + icon.height >= text.y + text.height);
    assert.ok(icon.width >= 44 && icon.height >= 44);
    await arrow.focus();
    await page.keyboard.press("Enter");
    await heading("Sitzungsübersicht").waitFor();
    await heading("2 öffentliche TOPs").waitFor();
    await button("Info zur RIS-Übernahme").click();
    await page.getByRole("note",{name:"RIS-Geschäftsregel"}).waitFor();
    await button("Info zur RIS-Übernahme").click();
    const top2 = page.locator("article").filter({has:page.getByRole("heading",{name:/^TOP 2 ·/})});
    const proposal = top2.getByRole("link",{name:/^Beschlussvorlage/});
    await proposal.waitFor();
    assert.match(await proposal.innerText(), /Beschlussvorlage.*5395\/2026/s);
    assert.equal(await proposal.getAttribute("target"), "_blank");
    await page.locator(".ris-overview-links a").last().focus();
    await page.keyboard.press("Tab");
    assert.ok(await proposal.evaluate(link => link.matches(":focus-visible")));
    const proposalIcon = await proposal.locator("svg").boundingBox();
    const proposalText = await proposal.locator("span").boundingBox();
    assert.ok(proposalIcon.x < proposalText.x);
    assert.ok(Math.abs(proposalIcon.y - proposalText.y) < 6);
    if (width === 412) {
      assert.ok(proposalText.height > 35);
      assert.ok((await proposal.boundingBox()).height >= 44);
    }
    const overviewLinks = await page.locator(".ris-overview-links a").evaluateAll(links =>
      links.map(link => Math.round(link.getBoundingClientRect().top))
    );
    assert.equal(overviewLinks.length, 3);
    assert.ok(Math.abs((overviewLinks[2] - overviewLinks[1]) - (overviewLinks[1] - overviewLinks[0])) <= 1);
    const voteTops = await top2.locator(".ris-result-line").evaluateAll(rows =>
      rows.map(row => Math.round(row.getBoundingClientRect().top))
    );
    assert.equal(voteTops.length, 3);
    assert.ok(voteTops[1] - voteTops[0] < 30);
    assert.ok(Math.abs((voteTops[2] - voteTops[1]) - (voteTops[1] - voteTops[0])) <= 1);
    assert.equal(await page.locator("h1").count(),1);
    assert.equal(await button("Info zur RIS-Übernahme").count(),1);
    assert.equal(await page.getByLabel("Hilfe zur aktuellen Seite").count(),0);
    assert.equal(await top2.getByRole("link",{name:/Niederschrift/}).count(),1);
    assert.equal(await top2.getByText(/^Status:/).count(),0);
    assert.equal(await top2.getByRole("button",{name:/Ereignis/}).count(),0);
    await top2.getByText(/Ja 10 · Nein 2/).waitFor();
    assert.equal(await button("Ereignis zuordnen").count(),0);
    assert.equal(await heading("Ereignisse zur Sitzung").count(),0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth+1),false);
    await page.screenshot({path:`/tmp/fib-source-ui/ris-${width}.png`,fullPage:true});
    await button("Sitzungen").click();
    await sessions.nth(1).waitFor();
  }
  await button("Fundstellenbereich").click();
  await search.fill("Gemeinde Feldkirchen");
  const findings = page.locator(".work-item");
  await findings.filter({ hasText: "Gemeinde Feldkirchen" }).waitFor();
  assert.equal(await findings.count(), 1);
  await page.locator(".work-item").filter({ hasText: "Gemeinde Feldkirchen" })
    .getByRole("button", { name: "Fundstelle öffnen" }).click();
  await page.getByLabel("Titel der Fundstelle *", { exact: true }).fill(
    "Parkraumkonzept",
  );
  await button("Fundstelle ausdrücklich übernehmen").click();
  await heading("Parkraumkonzept").waitFor();
  await button("Ereignis zuordnen").click();
  const assignment = page.getByRole("searchbox", {name:"Ereignisse filtern"});
  for (const term of ["Kita-Finanzierung", "20.10.2026", "außerhalb dieser Sitzung"]) {
    await assignment.fill(term);
    await page.getByText("Pressebericht zur Kita-Finanzierung", {exact:true}).waitFor();
  }
  await assignment.fill("unbekannt");
  await page.getByText("Pressebericht zur Kita-Finanzierung", {exact:true}).waitFor({state:"hidden"});
  assert.equal(
    await page.evaluate(() =>
      window.calls.filter((c) => c.action === "source_create_event").length
    ),
    0,
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS actual SourceWorkspace/RisSessionView components: read-only meeting and TOP cards, original source links, live search, 1440/412 px layout and Gemeinde regression (simulated APIs; no live MFA or print claim)",
  );
} catch (e) {
  console.error(await page.locator("body").innerText());
  throw e;
} finally {
  await browser.close();
  await server.close();
}
