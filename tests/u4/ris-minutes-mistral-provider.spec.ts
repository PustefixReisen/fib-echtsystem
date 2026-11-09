import assert from "node:assert/strict";
import {createMistralRisDraftProvider} from "../../supabase/functions/_shared/ris-minutes-mistral-provider.ts";
import {generateRisFactualReviewDraft} from "../../supabase/functions/_shared/ris-minutes-draft.ts";
const top="1. Der Rat beschließt, den Bebauungsplan im Westen anzupassen und das Sondergebiet zuzuweisen.\nAbstimmung: mehrheitlich angenommen Ja 17 Nein 2";
const answer=[
  {pointKey:"1",factualText:"Der Gemeinderat sieht im westlichen Bereich eine Änderung des Bebauungsplans und die Ausweisung des Sondergebiets vor.",
    vote:{status:"accepted",yes:17,no:2,abstention:null,originalLabel:"mehrheitlich angenommen"}},
];
let calls=0;
const mock:typeof fetch=async(url,options)=>{
  calls++;
  assert.equal(url,"https://api.mistral.ai/v1/chat/completions");
  assert.equal(options?.method,"POST");
  assert.equal((options?.headers as Record<string,string>).Authorization,"Bearer test-not-real");
  const data=JSON.parse(String(options?.body));
  assert.equal(data.model,"mistral-small-latest");
  assert.equal(data.response_format.type,"json_object");
  assert.equal(data.messages[1].content.includes("Bebauungsplan"),true);
  return new Response(JSON.stringify({choices:[{finish_reason:"stop",
    message:{content:JSON.stringify({drafts:answer})}}]}),{
    status:200,headers:{"content-type":"application/json"}});
};
const cfg={apiKey:"test-not-real",model:"mistral-small-latest",enabled:true};
assert.throws(()=>createMistralRisDraftProvider({...cfg,enabled:false},mock),
  /not_approved/);
assert.throws(()=>createMistralRisDraftProvider({...cfg,apiKey:""},mock),
  /key_missing/);
async function run(){
  const provider=createMistralRisDraftProvider(cfg,mock);
  const result=await generateRisFactualReviewDraft(top,provider);
  assert.equal(result.status,"review_required");
  assert.equal(result.drafts[0].vote.yes,17);
  assert.equal(result.drafts[0].vote.no,2);
  assert.equal(calls,1);
  const tampered:typeof fetch=async()=>new Response(JSON.stringify({
    choices:[{finish_reason:"stop",message:{content:JSON.stringify({
      drafts:[{...answer[0],vote:{...answer[0].vote,yes:18}}]})}}]}),{status:200});
  const invalid=await generateRisFactualReviewDraft(top,createMistralRisDraftProvider(cfg,tampered));
  assert.equal(invalid.status,"rejected");
  assert.ok(invalid.reasons.includes("vote_changed"));
  const badHttp:typeof fetch=async()=>new Response("",{status:429});
  const failed=await generateRisFactualReviewDraft(top,createMistralRisDraftProvider(cfg,badHttp));
  assert.equal(failed.status,"unavailable");
  assert.deepEqual(failed.reasons,["draft_provider_failed"]);
  const empty=await generateRisFactualReviewDraft(top);
  assert.equal(empty.status,"unavailable");
  assert.equal(calls,1,"No request when provider not configured");
  console.log("PASS opt-in Mistral transport, disabled-by-default, vote tampering and failed upstream");
}
void run().catch(e=>{console.error(e);process.exitCode=1;});
