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
  await page.getByText(/Bewusst reduzierter Referenzbestand; keine vollständige Sitzung/).waitFor();
  const tabs=page.getByRole("navigation",{name:"Sitzung und Tagesordnungspunkte"});
  await tabs.getByRole("button",{name:"TOP 2"}).click();
  assert.equal(await tabs.getByRole("button",{name:"TOP 2"}).getAttribute("aria-current"),"page");
  await heading("Beschlussvorschlag / Dokumente").waitFor();
  const desktopTopSpacing=await page.evaluate(() => {
    const shell=document.querySelector(".content-shell");
    const crumbs=document.querySelector(".source-workspace > .breadcrumbs");
    const header=document.querySelector(".source-workspace > .page-heading");
    return {
      shellPadding:shell ? parseFloat(getComputedStyle(shell).paddingTop) : 0,
      breadcrumbMargin:parseFloat(getComputedStyle(crumbs).marginBottom),
      headingMargin:parseFloat(getComputedStyle(header).marginBottom),
    };
  });
  assert.ok(desktopTopSpacing.shellPadding<=15 && desktopTopSpacing.breadcrumbMargin<=9 && desktopTopSpacing.headingMargin<=14,
    "Sitzungsseite hat einen kompakten Abstand über dem Titel");

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
  const liveSearch=page.getByRole("searchbox",{name:"Ereignisse filtern"});
  await liveSearch.fill("20.10.2026");
  await page.waitForFunction(() => window.calls.some(
    c=>c.action==="source_choices" && c.search==="20.10.2026"));
  await page.getByRole("radio").first().waitFor();
  assert.equal(await page.getByRole("radio").count(),1,
    "A displayed date filters event candidates without pressing a search button");
  await liveSearch.fill("Geschehen außerhalb");
  await page.waitForFunction(() => window.calls.some(
    c=>c.action==="source_choices" && c.search==="Geschehen außerhalb"));
  await page.getByRole("radio").first().waitFor();
  assert.equal(await page.getByRole("radio").count(),1,
    "A short description filters event candidates automatically");
  assert.equal(await button("Suchen").count(),0,
    "No extra search-submit click is needed");
  const detail=page.locator(".event-choice-details").first();
  assert.equal(await detail.locator("strong").innerText(),"Pressebericht zur Kita-Finanzierung");
  assert.match(await detail.locator(".event-choice-date").innerText(),/20\.10\.2026/);
  assert.match(await detail.locator(".event-choice-summary").innerText(),/Geschehen außerhalb/);
  await liveSearch.fill("");
  await page.getByRole("radio").first().waitFor();
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
  assert.equal(await button("Neu: Ereignis").count(),0,
    "Additional TOP events must be selected from existing events");
  await page.getByRole("radio").first().check();
  await button("Zuordnen").click();
  await heading("Weitere Ereignisse zum TOP").waitFor();
  assert.ok((await local().innerText()).includes("Pressebericht zur Kita-Finanzierung"));
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
  assert.equal(await button("Neu: Ereignis").count(),0);
  await button("Abbrechen").click();
  await heading("Weitere Ereignisse zum TOP").waitFor();
  // Old Preview backends ignore agenda filters. The UI must never show
  // unrelated events without a server-side scope confirmation.
  await page.evaluate(() => window.legacyChoices = true);
  await main().getByRole("button", { name: "Auswählen oder erstellen" }).click();
  await page.getByText("Die Vorschau verwendet noch einen älteren Ereignisdienst.",{exact:false}).waitFor();
  assert.equal(await page.getByRole("radio").count(),0,
    "Legacy server event lists are not accepted as current-session candidates");
  await button("Abbrechen").click();
  await page.evaluate(() => window.legacyChoices = false);
  // One explicitly chosen main TOP event; press material is never auto-linked.
  await main().getByRole("button", { name: "Auswählen oder erstellen" }).click();
  assert.equal(await page.getByRole("radio").count(),0,
    "No existing event qualifies as a main event of this Sitzung yet");
  await page.getByText("Noch kein Ereignis mit einer RIS-Fundstelle aus dieser Sitzung vorhanden.",{exact:false}).waitFor();
  await button("Neu: Ereignis").click();
  await page.getByLabel("Ereignistitel *", { exact: true }).fill("TOP 2: Beratung zum Elternbeitragszuschuss");
  await button("Speichern").click();
  await heading("TOP als Ereignis festlegen").waitFor();
  assert.equal(await main().getByRole("button", {name:"Ereignis öffnen"}).count(),1);
  assert.equal(await main().getByRole("button", {name:"Auswählen oder erstellen"}).count(),0);
  assert.equal(await page.evaluate(() => window.calls.filter(c=>c.action==="ris_link_main_event").length),0,
    "Main event creation commits the explicit role without another linking action");
  assert.equal(await main().getByRole("heading",{name:"Unterlagen als Fundstellen bestätigen"}).count(),0,
    "No separate RIS findings confirmation after selecting a TOP main event");
  assert.equal(await main().getByRole("checkbox").count(),0);
  assert.equal(await page.getByText("Beschlussvorschlag als Text derzeit nicht in FIB verfügbar.").count(),0,
    "Redundant proposal placeholder is no longer shown");
  const documentLabel=page.locator(".ris-document-item .ris-external-reference > span").first();
  assert.equal(await documentLabel.locator("strong").innerText(),"Beschlussvorlage");
  assert.equal(await documentLabel.locator("strong").evaluate(el=>getComputedStyle(el).fontWeight),"700",
    "Only document type is bold");
  assert.equal(await documentLabel.evaluate(el=>getComputedStyle(el).fontWeight),"400",
    "Date, reference and full title remain normal weight");
  const tabStyle=await page.getByRole("navigation",{name:"Sitzung und Tagesordnungspunkte"})
    .getByRole("button",{name:"TOP 2"}).evaluate(el=>{
      const st=getComputedStyle(el);return {width:parseFloat(st.borderBottomWidth),color:st.borderBottomColor};
    });
  assert.ok(tabStyle.width<=2,"Selected TOP border stays thin");
  const underline=await tabs.getByRole("button",{name:"TOP 2"}).evaluate(el=>{
    const pseudo=getComputedStyle(el,"::after");
    return {content:pseudo.content,width:parseFloat(pseudo.width),height:parseFloat(pseudo.height),position:pseudo.position};
  });
  assert.ok(underline.content!=="none" && underline.width>10 && underline.height>=2 && underline.position==="absolute",
    "Selected TOP has a separate underline below its text");

  assert.equal(await page.evaluate(() => window.calls.filter(c=>c.action==="ris_confirm_main_findings").length),0,
    "Event creation is the only required user action");
  const mainQueries=await page.evaluate(() => window.calls.filter(c=>c.action==="source_choices" && c.eventRole==="main_event"));
  assert.ok(mainQueries.every(c=>c.agendaId==="t2"),"Main event choices are scoped to the current TOP");

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
  assert.ok(await page.evaluate(() =>
    !document.querySelector(".content-shell") || parseFloat(getComputedStyle(document.querySelector(".content-shell")).paddingTop) <= 11
  ),"Mobiler Seitenkopf bleibt kompakt");

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
    1, // only the new TOP main event; related events must already exist
  );
  await page.evaluate(() => { window.showDecisionCases=true; });
  await button("Sitzungsbereich").click();
  await button("Sitzung öffnen").click();
  await page.getByRole("navigation",{name:"Sitzung und Tagesordnungspunkte"}).getByRole("button",{name:"TOP 2"}).click();
  const minutes=page.locator("section").filter({has:heading("Niederschrift der Sitzung")});
  await minutes.getByText("Beschlusspunkt A", { exact: true }).waitFor();
  await minutes.getByText("Beschlusspunkt B", { exact: true }).waitFor();
  await minutes.getByText(/Abstimmung: angenommen · Ja 10 · Nein 2/).waitFor();
  await minutes.getByText(/Die vollständige sachliche Beschlussdarstellung ist noch nicht geprüft und freigegeben/).first().waitFor();
  assert.equal(await minutes.locator("img").count(),0,"No unlicensed wording or HTML rendered");
  assert.ok((await minutes.innerText()).includes("Ja 10 · Nein 2"));
  assert.equal(await minutes.locator('a[href*="id=75785"]').count(),1,"Complete original remains linked");
  const optionalEditor=page.locator("details.ris-minutes-editor-optional");
  assert.equal(await optionalEditor.getAttribute("open"),null,"Rare correction UI is initially collapsed");
  await optionalEditor.locator("summary").click();
  const review=page.getByRole("region",{name:"Beschlussinhalt redaktionell prüfen"});
  await review.getByLabel("Beschlussinhalt – vollständig, aber eigenständig formuliert")
    .fill("Der Gemeinderat beauftragte die Verwaltung mit der Prüfung des Vorhabens sowie der anschließenden Berichterstattung.");
  await review.getByRole("combobox").selectOption("accepted");
  await review.getByLabel("Ja").fill("10");
  await review.getByLabel("Nein").fill("2");
  const submit=review.getByRole("button",{name:"Geprüften Entwurf vormerken"});
  assert.equal(await submit.isDisabled(),true,"Source verification required");
  await review.getByRole("checkbox").check();
  await submit.click();
  await review.getByText(/Entwurf vorgemerkt/).waitFor();
  const proposals=await page.evaluate(()=>window.calls.filter(c=>c.action==="ris_suggest"));
  assert.equal(proposals.length,1);
  assert.equal(proposals[0].payload.representation,"complete_factual");
  assert.equal(proposals[0].payload.usageRightsBasis,undefined);
  await review.getByRole("button",{name:"Beschluss bestätigen"}).click();
  await review.getByText(/Beschlussinhalt und Abstimmung bestätigt/).waitFor();
  assert.equal(await page.evaluate(()=>window.calls.filter(c=>c.action==="ris_review_suggestion").length),1,
    "Separate submission and confirmation");
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
