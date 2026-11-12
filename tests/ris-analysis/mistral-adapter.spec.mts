import assert from 'node:assert/strict';
import {prepareMistralAbstractAdapter,type MistralAdapterConfig} from
  '../../supabase/functions/_shared/finding-abstract-mistral.ts';
import {type AbstractRepositoryInput} from
  '../../supabase/functions/_shared/finding-abstract-storage.ts';
const ctx:AbstractRepositoryInput={
 findingId:'00000000-0000-4000-8000-000000000001',
 findingVersionId:'00000000-0000-4000-8000-000000000002',
 fingerprint:'a'.repeat(64),sourceUrl:'https://example.invalid/ris',
 sourceKind:'ris',scopeTop:2,model:'mistral-small-latest',
 modelVersion:'mock-1',schemaVersion:'v1'};
const segments=[{page:1,top:2,text:'FIKTIVE Sitzung zu einer Kindertageseinrichtung.'}];
const evidence=[{url:ctx.sourceUrl,versionId:ctx.findingVersionId,page:1,top:2}];
const valid={summary:'Fiktiver Inhalt',claims:[{kind:'fact',statement:'Kita wird erwähnt.',
 certainty:'supported',evidence}],relations:[],limitations:[]};
const answer=(data:unknown)=>({model:'mistral-small-latest',usage:{
 prompt_tokens:360,completion_tokens:110},choices:[{finish_reason:'stop',message:{
 content:JSON.stringify(data)}}]});
let calls=0,reserved=0,settled=0,uncertain=0,released=0,liveCents=0;
const gate={reserve:async(_key:string,cents:number)=>{
 reserved++;
 assert.ok(cents>0&&cents<=500);
 // A synthetic atomic cumulative reservation ledger for the test.
 if(liveCents+cents>500)throw Error('budget_exhausted');
 liveCents+=cents;
 return {settle:async(spent:number)=>{settled++;liveCents-=cents-spent;},
   uncertain:async()=>{uncertain++;},
   releaseUnsent:async()=>{released++;liveCents-=cents;}};
}};
const config:MistralAdapterConfig={
 enabled:false,operatorApproved:false,privacyApproved:false,rightsApproved:false,
 model:'mistral-small-latest',eurInputPerMillion:0.15,eurOutputPerMillion:0.60,
 maxOutputTokens:1200,maxInputTokens:4000,reservationKey:'b'.repeat(64),
 budget:gate,transport:async req=>{calls++;assert.equal(req.endpoint,'https://api.mistral.ai/v1/chat/completions');
 assert.equal(req.body.response_format.type,'json_object');
 assert.equal(req.body.max_tokens,1200);assert.equal(req.body.stream,false);
 assert.ok(req.body.messages[1].content.includes('TOP: 2'));
 return answer(valid);
 }};
const invoke=(cfg=config,input=segments)=>
 prepareMistralAbstractAdapter(cfg)({context:ctx,segments:input});
await assert.rejects(()=>invoke(),/not_authorized/);
assert.equal(calls,0);assert.equal(reserved,0);
for(const change of [{enabled:true},{operatorApproved:true},{privacyApproved:true},{rightsApproved:true}])
 await assert.rejects(()=>invoke({...config,...change}),/not_authorized/);
const enabled={...config,enabled:true,operatorApproved:true,privacyApproved:true,rightsApproved:true};
await assert.rejects(()=>invoke({...enabled,eurInputPerMillion:500}),/invalid_configuration/);
await assert.rejects(()=>invoke({...enabled,maxInputTokens:3}),/mistral_input_limit/);
assert.equal(calls,0);assert.equal(reserved,0);
const result=await invoke(enabled);
assert.deepEqual(result,valid);
assert.equal(calls,1);assert.equal(reserved,1);assert.equal(settled,1);
assert.equal(uncertain,0);
await assert.rejects(()=>invoke({...enabled,transport:async()=>{calls++;throw Error('provider_unreachable');}}),
 /provider_unreachable/);
assert.equal(uncertain,1,'transport ambiguity must retain budget reservation');
await assert.rejects(()=>invoke({...enabled,transport:async()=>answer({...valid,
   claims:[{...valid.claims[0],evidence:[{url:'https://wrong.invalid/',versionId:ctx.findingVersionId}]}]})}),
 /unverified_abstract_evidence/);
assert.equal(settled,2,'Invalid paid output must still be billed');
assert.equal(uncertain,1,'Billing completed, output validation failure is not an uncertain charge');
await assert.rejects(()=>invoke({...enabled,transport:async()=>answer({...valid,status:'approved'})}),
 /invalid_abstract/);
assert.equal(settled,3,'Model cannot grant publication even when billed');
const wrongTop={...valid,claims:[{...valid.claims[0],
 evidence:[{url:ctx.sourceUrl,versionId:ctx.findingVersionId,page:1,top:3}]}]};
await assert.rejects(()=>invoke({...enabled,transport:async()=>answer(wrongTop)}),
 /unverified_abstract_evidence/);
assert.equal(settled,4);
await assert.rejects(()=>invoke({...enabled,transport:async()=>({
 ...answer(valid),choices:[{finish_reason:'length',message:{content:JSON.stringify(valid)}}]})}),
 /bad_response/);
assert.equal(uncertain,2);
await assert.rejects(()=>invoke({...enabled,transport:async()=>({
 ...answer(valid),usage:undefined})}),/usage_missing/);
assert.equal(uncertain,3);
const denied={...enabled,budget:{reserve:async()=>{throw Error('budget_exhausted')}}};
await assert.rejects(()=>invoke(denied),/budget_exhausted/);
assert.ok(calls>=1);
console.log('PASS Mistral adapter (offline): hard-disabled default, four approvals, token cap, reserve-before-send, billed invalid output, ambiguous charges, JSON/source/TOP validation, no HTTP or secrets');
