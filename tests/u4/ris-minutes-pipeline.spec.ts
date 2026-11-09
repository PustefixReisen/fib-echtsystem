import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {prepareRisMinutesSessionDrafts} from "../../supabase/functions/_shared/ris-minutes-pipeline.ts";
import type {RisMinutesDraftProvider} from "../../supabase/functions/_shared/ris-minutes-draft.ts";
const sourceUrl="https://buergerinfo-feldkirchen.digitalfabrix.de/getfile.asp?id=75785";
const sourceText=[
  "TOP 1",
  "Die Gemeinde will eine Parkanlage errichten und bittet um Erstellung eines Plans mit Wegen und Bäumen.",
  "Abstimmung: mehrheitlich angenommen Ja 17 Nein 2",
  "TOP 2",
  "Ein Antrag wurde nach Aussprache zurückgezogen; der Gemeinderat führte keine Abstimmung durch.",
  "Abstimmung: abgesetzt",
].join("\n");
let downloads=0;
const fakeFetch:typeof fetch=async()=>{
  downloads++;
  return new Response(new Uint8Array([37,80,68,70,45,49,50,51,49]),{
    status:200,headers:{"content-length":"9"}});
};
const mockExtractor=async()=>sourceText;
const mockProvider:RisMinutesDraftProvider=async items=>items.map(item=>({
  pointKey:item.pointKey,
  factualText:"Der Gemeinderat befasste sich mit dem dargestellten Anliegen und entschied entsprechend den nachgewiesenen einzelnen Vorgaben und Bedingungen.",
  vote:item.vote,
}));
async function run(){
  const args={sessionId:"1031",sourceDocumentId:"75785",sourceUrl,expectedNumbers:[1,2]};
  const disabled=await prepareRisMinutesSessionDrafts(args,fakeFetch,mockExtractor);
  assert.equal(disabled.status,"unavailable");
  assert.deepEqual(disabled.reasons,["draft_provider_not_configured"]);
  assert.equal(downloads,0,"Must never fetch copyrighted content without approved provider");
  const invalid=await prepareRisMinutesSessionDrafts({...args,sourceUrl:"https://evil.invalid/getfile.asp?id=75785",provider:mockProvider},fakeFetch,mockExtractor);
  assert.deepEqual(invalid.reasons,["unapproved_ris_document_url"]);
  assert.equal(downloads,0);
  const hash=createHash("sha256").update(Uint8Array.from([37,80,68,70,45,49,50,51,49])).digest("hex");
  const changed=await prepareRisMinutesSessionDrafts({
    ...args,provider:mockProvider,expectedPdfHash:"0".repeat(64),
  },fakeFetch,mockExtractor);
  assert.deepEqual(changed.reasons,["ris_minutes_source_changed"]);
  assert.equal(changed.topResults.length,0,"Never send stale source data to AI");
  const ready=await prepareRisMinutesSessionDrafts({...args,provider:mockProvider,expectedPdfHash:hash},fakeFetch,mockExtractor);
  assert.equal(ready.status,"review_required");
  assert.equal(ready.topResults.length,2);
  assert.equal(ready.topResults[0].result.drafts[0].vote.yes,17);
  assert.equal(ready.topResults[1].result.drafts[0].vote.status,"no_vote");
  assert.equal(downloads,2,"One guarded source read for stale-hash test and one for valid source");
  const incomplete=await prepareRisMinutesSessionDrafts({...args,expectedNumbers:[1,2,3],provider:mockProvider},fakeFetch,mockExtractor);
  assert.equal(incomplete.status,"unavailable");
  assert.ok(incomplete.reasons[0].includes("segmentation"));
  assert.equal(incomplete.topResults.length,0,"Never release subset when source is incomplete");
  let paidCalls=0;
  const trackingProvider:RisMinutesDraftProvider=async (items,instruction)=>{
    paidCalls++;
    return mockProvider(items,instruction);
  };
  const oneNoVote=await prepareRisMinutesSessionDrafts({
    ...args,expectedNumbers:[1,2,3],provider:trackingProvider,
  },fakeFetch,async()=>sourceText+"\nTOP 3\nNur Bekanntgaben ohne Beschluss");
  assert.equal(oneNoVote.status,"unavailable");
  assert.equal(oneNoVote.topResults.length,3);
  assert.deepEqual(oneNoVote.topResults[2].result.reasons,["no_structured_vote_evidence"]);
  assert.equal(paidCalls,2,"No provider request for TOP without voting decision");
  console.log("PASS official URL restriction, no-provider/no-fetch, in-memory segmentation, full review and incomplete-source rejection");
}
void run().catch(e=>{console.error(e);process.exitCode=1;});
