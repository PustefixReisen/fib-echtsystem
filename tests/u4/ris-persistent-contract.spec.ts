import {isRisCollection} from "../../apps/editorial-web/src/ris-presentation.ts";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { extractText } from "unpdf";
import {
  parseRisStructure,
  risAgendaCoverage,
  risUrl,
  RIS_ORIGIN,
} from "../../supabase/functions/_shared/ris-structure.ts";
const html = readFileSync("tests/u4/fixtures/ris-1032-top-2-3.html", "utf8");
const url = RIS_ORIGIN + "/si0057.asp?__ksinr=1032";
async function main() {
  assert.equal(isRisCollection(RIS_ORIGIN+"/do0040.asp?smcmode=32832"),true);
  assert.equal(isRisCollection(RIS_ORIGIN+"/si0040.asp"),true);
  assert.equal(isRisCollection(RIS_ORIGIN+"/getfile.asp?id=75785"),false);
  assert.equal(isRisCollection(RIS_ORIGIN+"/si0057.asp?__ksinr=1031"),false);
  assert.equal(isRisCollection("https://other.invalid/do0040.asp"),false);
  const ref = await parseRisStructure(readFileSync("tests/u4/fixtures/ris-1031-top-2-3-6.html","utf8"),RIS_ORIGIN+"/si0057.asp?__ksinr=1031","2026-11-08");
  assert.equal(ref.agenda.length,3,"Explicitly reduced real reference, not all 19 TOPs");
  assert.equal(ref.agenda[0].observedTreatment,"abgesetzt");
  assert.equal(ref.agenda[1].observedTreatment,"abgelehnt");
  assert.ok(ref.agenda.every(a=>!a.title.includes("Beschluss:")));
  // Synthetic full public agenda includes TOPs without proposal links.
  const completeHtml='<div class="siname">Synthetic</div><table>'+Array.from({length:19},(_,i)=>`<tr><td class="tofnum">Ö ${i+1}</td><td class="tolink"><a href="to0050.asp?__ktonr=${100+i}">Synthetic TOP ${i+1}</a></td></tr>`).join('')+'</table>';
  const complete=await parseRisStructure(completeHtml,url,"2026-11-08");
  assert.equal(complete.agenda.length,19);
  assert.ok(complete.agenda.every(a=>a.proposals.length===0));
  const headerAndExtraColumn = completeHtml.replace('<table>','<table><tr><th class="tofnum">TOP</th><th>Titel</th></tr>').replaceAll('<td class="tofnum">','<td>Zusatzspalte</td><td class="tofnum">');
  const withHeader=await parseRisStructure(headerAndExtraColumn,url,"2026-11-08");
  assert.equal(withHeader.agenda.length,19,"Header is not a TOP; number cell may follow another column");
  assert.equal(withHeader.agenda[18].number,"19");
  assert.equal(risAgendaCoverage(withHeader).scope,"observed_page");
  assert.equal(risAgendaCoverage(withHeader).completeness,"unverified","All parsed rows alone never prove a full session");
  ref.capture={scope:"documented_reference_excerpt"};
  assert.equal(risAgendaCoverage(ref).scope,"reference_excerpt");
  assert.equal(risAgendaCoverage(undefined).scope,"unknown");
  assert.equal(risAgendaCoverage(ref,[{observed_revision:1},{observed_revision:2}],2).retainedFromEarlierRevisions,1);
  const s = await parseRisStructure(html, url, "2026-10-31T12:00:00Z");
  assert.equal(s.date, "2026-10-29");
  assert.equal(s.agenda.length, 2);
  assert.equal(s.agenda[0].documents[0].kind, "proposal");
  assert.equal(
    s.agenda[0].proposalReferences[RIS_ORIGIN + "/vo0050.asp?__kvonr=8640"],
    "5395/2026",
  );
  assert.equal(risUrl("https://attacker.invalid/getfile.asp?id=1"), null);
  assert.equal(
    risUrl(
      "https://a:b@buergerinfo-feldkirchen.digitalfabrix.de/getfile.asp?id=1",
    ),
    null,
  );
  assert.equal(
    risUrl("/getfile.asp?id=1&type=do"),
    RIS_ORIGIN + "/getfile.asp?id=1",
  );
  await assert.rejects(
    () =>
      parseRisStructure(
        "<html>temporarily unavailable</html>",
        url,
        new Date().toISOString(),
      ),
    /incomplete/,
  );
  await assert.rejects(
    () =>
      parseRisStructure(
        html.replace("&Ouml; 3", "&Ouml; 2"),
        url,
        new Date().toISOString(),
      ),
    /duplicate/,
  );
  const missing = await parseRisStructure(
    html
      .replace("29.10.2026", "31.02.2026")
      .replace("sigrname", "unknownfield"),
    url,
    new Date().toISOString(),
  );
  assert.equal(missing.date, null);
  assert.equal(missing.committee, null);
  const ambiguous = await parseRisStructure(
    html.replace(
      "5395/2026</a>",
      '5395/2026</a><a href="vo0050.asp?__kvonr=999">conflict</a>',
    ),
    url,
    new Date().toISOString(),
  );
  assert.ok(ambiguous.agenda[0].issues.includes("ambiguous_proposals"));
  // A later TOP detail link does not change the established session/number identity.
  const withTop = await parseRisStructure(
    html.replace(
      "5395/2026</a>",
      '5395/2026</a><a href="to0050.asp?__ktonr=999">TOP</a>',
    ),
    url,
    new Date().toISOString(),
  );
  assert.equal(withTop.agenda[0].key, s.agenda[0].key);
  assert.equal(withTop.agenda[0].publishedTopUrls.length, 1);
  // Valid synthetic PDF exercises the pinned production extractor, not a mock.
  const stream = "BT /F1 12 Tf 20 100 Td (RIS extraction test) Tj ET";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 200] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const [i, obj] of objects.entries()) {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  }
  const xref = pdf.length;
  pdf +=
    "xref\n0 6\n0000000000 65535 f \n" +
    offsets
      .slice(1)
      .map((n) => String(n).padStart(10, "0") + " 00000 n \n")
      .join("") +
    `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const result = await extractText(new TextEncoder().encode(pdf), {
    mergePages: true,
  });
  assert.ok(result.text.includes("RIS extraction test"));
  const handler = readFileSync(
    "supabase/functions/fib-editorial-write/index.ts",
    "utf8",
  );
  assert.ok(handler.includes("body.origin!=='editor'"));
  console.log(
    "RIS structure ambiguity, provenance, stable identity and actual pinned PDF text extraction passed",
  );
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
