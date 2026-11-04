import {buildU4SearchPlan,parseActiveReferenceSnapshot,type ReferenceLink} from '../../packages/fachservices/src/u4-search-context.js';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw Error(message);
}
const refId='11111111-1111-4111-8111-111111111111';
const link:ReferenceLink={
  id:refId,revision:2,subject_kind:'infrastructure',
  subject_label:'Radschnellweg München–Markt Schwaben',relation_kind:'crosses',
  object_kind:'place',object_label:'Feldkirchen',
  evidence_url:'https://example.org/route',rationale:'Querverbindung durch die Kommune',
};
export function caseConfirmedLocalRelationExpandsSearch() {
  const payload=parseActiveReferenceSnapshot({ok:true,activeRevision:7,references:[link]});
  const plan=buildU4SearchPlan(payload,'Feldkirchen');
  assert(plan.contextRevision===7,'must bind search plan to exact reference context revision');
  assert(plan.coreQueries.length===1 && plan.coreQueries[0].query==='Feldkirchen','must retain broad local search');
  assert(plan.extendedQueries.length===1,'one confirmed relationship should add one direction');
  assert(plan.extendedQueries[0].query==='Radschnellweg München–Markt Schwaben','must add relationship outside place keyword');
  assert(plan.extendedQueries[0].referenceIds[0]===refId,'must retain provenance');
}
export function caseUnconfirmedRelationsNeverEnterContext() {
  // Endpoint returns confirmed-only view; planner consumes that response,
  // not the admin list which contains proposed or rejected objects.
  const plan=buildU4SearchPlan(parseActiveReferenceSnapshot({
    ok:true,activeRevision:0,references:[],
  }),'Feldkirchen');
  assert(plan.extendedQueries.length===0,'no unconfirmed expansion');
  assert(plan.coreQueries.length===1,'base search stays available');
}
export function caseUnrelatedObjectsDoNotClaimLocalRelevance() {
  const plan=buildU4SearchPlan({activeRevision:2,references:[{
    ...link,subject_label:'Berlin',object_label:'Hamburg',
  }]},'Feldkirchen');
  assert(plan.extendedQueries.length===0,'unrelated object should not gain a local relevance');
}
export function caseStableDeduplicatedSearchPlan() {
  const second={...link,id:'22222222-2222-4222-8222-222222222222'};
  const plan=buildU4SearchPlan({activeRevision:3,references:[second,link]},'Feldkirchen');
  assert(plan.extendedQueries.length===1,'same search direction should be deduplicated');
  assert(plan.extendedQueries[0].referenceIds[0]===refId,'ordering must be stable');
}
export function caseBudgetIsBoundedButBaseSearchSurvives() {
  const plan=buildU4SearchPlan({activeRevision:3,references:[link]},'Feldkirchen',0);
  assert(plan.extendedQueries.length===0&&plan.coreQueries.length===1,'budget cannot suppress base search');
}
export function caseInvalidPayloadRejected() {
  let failed=false;
  try {parseActiveReferenceSnapshot({ok:true,activeRevision:3,references:[{status:'proposed'}]});}
  catch {failed=true;}
  assert(failed,'unexpected response format must fail closed');
}
