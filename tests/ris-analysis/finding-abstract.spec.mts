import assert from 'node:assert/strict';
import {validateFindingAbstract,findingAbstractKey,type AbstractContext} from
  '../../supabase/functions/_shared/finding-abstract.ts';
const fid='00000000-0000-4000-8000-000000000001';
const vid='00000000-0000-4000-8000-000000000002';
const target='00000000-0000-4000-8000-000000000003';
const sourceUrl='https://example.invalid/source';
const make=(sourceKind:AbstractContext['sourceKind'],scopeTop?:number):AbstractContext=>({
 findingId:fid,findingVersionId:vid,fingerprint:'a'.repeat(64),
 sourceUrl,sourceKind,model:'synthetic-offline-model',modelVersion:'test-1',
 schemaVersion:'v1',permitted:true,...(scopeTop?{scopeTop}:{}),
});
const evidence=(top?:number)=>[{url:sourceUrl,versionId:vid,...(top?{top}:{}),page:2}];
const raw=(top?:number)=>({summary:'FIKTIVES Beispieldokument zur Finanzierung.',
  claims:[{kind:'fact',statement:'Eine Finanzierung wird genannt.',certainty:'supported',evidence:evidence(top)}],
  relations:[{targetKind:'topic',targetId:target,status:'candidate',reason:'Ähnlicher Sachverhalt',
   evidence:evidence(top)}],limitations:['Nur synthetischer Testtext']});
for(const kind of ['ris','press','municipality','other'] as const){
 const ctx=make(kind,kind==='ris'?2:undefined);
 const result=validateFindingAbstract(ctx,raw(ctx.scopeTop));
 assert.equal(result.findingId,fid);
 assert.equal(result.sourceKind,kind);
 assert.equal(result.status,'derived_unreviewed');
 assert.equal(result.relations[0].status,'candidate');
 assert.equal(JSON.stringify(result).includes('secret'),false);
 assert.equal(await findingAbstractKey(ctx),await findingAbstractKey(ctx),'same version must dedupe');
 assert.notEqual(await findingAbstractKey(ctx),await findingAbstractKey({...ctx,fingerprint:'b'.repeat(64)}),
  'source change rekeys analysis');
 assert.notEqual(await findingAbstractKey(ctx),await findingAbstractKey({...ctx,modelVersion:'test-2'}),
  'model change rekeys analysis');
 assert.throws(()=>validateFindingAbstract({...ctx,permitted:false},raw(ctx.scopeTop)),
  /not_authorized/,'source rights fail closed');
 assert.throws(()=>validateFindingAbstract(ctx,{...raw(ctx.scopeTop),rawText:'confidential full text'}),
  /invalid_abstract/,'raw original content cannot be persisted');
 assert.throws(()=>validateFindingAbstract(ctx,{...raw(ctx.scopeTop),status:'approved'}),
  /invalid_abstract/,'model cannot approve publication');
 assert.throws(()=>validateFindingAbstract(ctx,{...raw(ctx.scopeTop),
   claims:[{...raw(ctx.scopeTop).claims[0],evidence:[{url:'https://other.invalid',versionId:vid}]}]}),
  /unverified_abstract_evidence/,'no unsupported source references');
 assert.throws(()=>validateFindingAbstract(ctx,{...raw(ctx.scopeTop),
   claims:[{...raw(ctx.scopeTop).claims[0],evidence:[]}]}),
  /unverified_abstract_evidence/,'every claim must cite a source');
 assert.throws(()=>validateFindingAbstract(ctx,{...raw(ctx.scopeTop),
   relations:[{...raw(ctx.scopeTop).relations[0],status:'confirmed'}]}),
  /invalid_abstract/,'model output cannot confirm relationships');
}
const ris=make('ris',2);
assert.throws(()=>validateFindingAbstract(ris,raw(3)),/unverified_abstract_evidence/,
 'minutes text from another TOP is not evidence');
assert.throws(()=>validateFindingAbstract(ris,raw()),/unverified_abstract_evidence/,
 'a TOP scoped abstract requires an explicit TOP reference');
assert.notEqual(await findingAbstractKey(ris),await findingAbstractKey({...ris,scopeTop:3}),
 'one source version can support independently cached TOP-specific abstracts');
console.log('PASS shared abstracts: RIS/press/municipality/other, version cache, source/TOP citations, immutable original, unauthorized/unsafe outputs fail closed');
