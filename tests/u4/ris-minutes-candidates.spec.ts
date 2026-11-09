import assert from "node:assert/strict";
import {generateRisFactualReviewDraft} from "../../supabase/functions/_shared/ris-minutes-draft.ts";
import {readFileSync} from "node:fs";
import {extractRisMinutesCandidates,validateRisFactualDraft} from
  "../../supabase/functions/_shared/ris-minutes-candidates.ts";
const indexed = JSON.parse(readFileSync("tests/u4/fixtures/ris-1031-public-agenda-indexed-20261109.json","utf8"));
assert.equal(indexed.kind,"indexed_official_ris_public_agenda_reference");
assert.equal(indexed.agenda.length,19,"All 19 publicly indexed agenda rows must remain present");
assert.deepEqual(indexed.agenda.map((a:{number:string})=>Number(a.number)),
  Array.from({length:19},(_,i)=>i+1),"All real public numbers 1..19 must be present once");
assert.equal(indexed.agenda.find((a:{number:string})=>a.number==="2")?.proposal_reference,"5283/2026");
assert.equal(indexed.agenda.find((a:{number:string})=>a.number==="3")?.proposal_reference,"5351/2026");
assert.equal(indexed.agenda.find((a:{number:string})=>a.number==="6")?.proposal_reference,"5370/2026");
assert.equal(indexed.agenda.find((a:{number:string})=>a.number==="18")?.proposal_reference,null);
const source=readFileSync("tests/u4/fixtures/ris-1031-minutes-excerpts.txt","utf8");
const sections=source.split(/\[… Ausschnitt …\]/);
assert.equal(sections.length,3);
const [top2,top3,top6]=sections.map(extractRisMinutesCandidates);
assert.equal(top2.length,1);
assert.equal(top2[0].vote.status,"no_vote");
assert.equal(top2[0].vote.yes,null);
assert.equal(top3.length,1);
assert.deepEqual([top3[0].vote.status,top3[0].vote.yes,top3[0].vote.no],["rejected",7,13]);
assert.equal(top6.length,2);
assert.deepEqual(top6.map(c=>[c.pointKey,c.vote.status,c.vote.yes,c.vote.no]),[
  ["1","accepted",17,2],["2","accepted",19,0],
]);
assert.ok(top6[0].sourcePassage.includes("Rechenzentrums"));
assert.ok(top6[0].sourcePassage.includes("Sondergebiet"));
assert.ok(top6[1].sourcePassage.includes("Verhältnis der"));
const factual=[
  {pointKey:"1",factualText:"Der Gemeinderat bewertet die Ansiedlung eines Rechenzentrums positiv; der Bebauungsplanentwurf soll geändert werden und im Westen ein Sondergebiet mit geänderten baulichen Vorgaben ausweisen.",vote:top6[0].vote},
  {pointKey:"2",factualText:"Die Verwaltung soll eine Beteiligung des Investors an Planungskosten vertraglich prüfen; die Verfahrenskosten sollen nach dem Verhältnis der Grundstücksgrößen verteilt werden.",vote:top6[1].vote},
];
assert.equal(validateRisFactualDraft(top6,factual).ok,true);
assert.ok(validateRisFactualDraft(top6,[factual[0]]).reasons.includes("candidate_count_mismatch"));
assert.ok(validateRisFactualDraft(top6,[factual[0],{...factual[1],vote:{...factual[1].vote,yes:17}}]).reasons.includes("vote_changed"));
assert.ok(extractRisMinutesCandidates("Unklare Beratung ohne Abstimmungsergebnis").length===0);
console.log("PASS RIS referenced minutes: TOP2 no vote, TOP3 7:13, TOP6 two separate 17:2/19:0; no invented votes, candidate review required");

async function checkDraftContract(){
const unavailable=await generateRisFactualReviewDraft(sections[2]);
assert.equal(unavailable.status,"unavailable");
assert.deepEqual(unavailable.reasons,["draft_provider_not_configured"]);
const incomplete=await generateRisFactualReviewDraft(sections[2],async(_items,instructions)=>{
  assert.ok(instructions.includes("Kostenverteilungen"));
  return [factual[0]];
});
assert.equal(incomplete.status,"rejected");
assert.ok(incomplete.reasons.includes("candidate_count_mismatch"));
const review=await generateRisFactualReviewDraft(sections[2],async(items)=>items.map((item,i)=>({
  ...factual[i],pointKey:item.pointKey,vote:item.vote,
})));
assert.equal(review.status,"review_required");
assert.equal(review.drafts.length,2);
assert.deepEqual(review.reasons,["human_content_review_required"]);
const voteTamper=await generateRisFactualReviewDraft(sections[2],async(items)=>items.map((item,i)=>({
  ...factual[i],pointKey:item.pointKey,vote:{...item.vote,no:99},
})));
assert.equal(voteTamper.status,"rejected");
assert.deepEqual(voteTamper.drafts,[]);
console.log("PASS provider-neutral AI drafting: no provider is unavailable, incomplete/changed votes fail, valid draft still needs human review");

}
void checkDraftContract().catch(error=>{console.error(error);process.exitCode=1;});
