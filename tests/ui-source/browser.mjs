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
  await button("Sitzungsbereich").click();
  await button("Sitzung öffnen").click();
  await heading("Sitzungsübersicht").waitFor();
  await heading("TOPs").waitFor();
  await button("Info zur RIS-Übernahme").click();
  await page.getByRole("note",{name:"RIS-Geschäftsregel"}).waitFor();
  const top2 = page.locator("article").filter({has:page.getByRole("heading",{name:/^TOP 2 ·/})});
  await top2.getByRole("link",{name:"Beschlussvorlage im RIS öffnen"}).waitFor();
  await top2.getByRole("link",{name:/Niederschrift/}).waitFor();
  assert.equal(await button("Ereignis zuordnen").count(),0);
  assert.equal(await heading("Ereignisse zur Sitzung").count(),0);
  mkdirSync("/tmp/fib-source-ui", { recursive: true });
  await page.screenshot({path:"/tmp/fib-source-ui/ris-desktop.png",fullPage:true});
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth+1),false);
  await page.screenshot({path:"/tmp/fib-source-ui/ris-mobile.png",fullPage:true});
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
    0,
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS actual SourceWorkspace/RisSessionView components: read-only meeting and TOP cards, original source links, mobile layout and Gemeinde regression (simulated APIs; no live MFA or print claim)",
  );
} catch (e) {
  console.error(await page.locator("body").innerText());
  throw e;
} finally {
  await browser.close();
  await server.close();
}
