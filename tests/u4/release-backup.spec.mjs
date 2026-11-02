import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';
import {seal,verify,hash} from '../../scripts/backup/bundle.mjs';
const original='%PDF-1.4\nsynthetic-original';
const ref={id:'11111111-1111-4111-8111-111111111111',document_id:'22222222-2222-4222-8222-222222222222',content_hash:hash(original),content_author:'municipality',size:original.length};ref.storage_key=ref.document_id+'/'+ref.id+'/'+ref.content_hash+'.pdf';
const root=mkdtempSync(join(tmpdir(),'fib-backup-test-')),commit='a'.repeat(40);
const put=(p,v)=>{mkdirSync(join(root,p,'..'),{recursive:true});writeFileSync(join(root,p),typeof v==='string'?v:JSON.stringify(v),{mode:0o600});};
try{
 put('database/fib.dump','PGDMPsynthetic');put('database/auth-ids.json','[]');
 put('database/manifest.json',{format:2,risOriginals:[ref],schema:'fib',project:'apaubomxffcwtzjimori',aclIncluded:true,containsAuthSecrets:false,tableCounts:{events:0},files:{'fib.dump':hash('PGDMPsynthetic'),'auth-ids.json':hash('[]')}});
 put('frontend/index.html','synthetic');for(const slug of ['fib-editorial-write','fib-u4-ris-pilot','fib-u4-pilot'])put('edge/'+slug+'/index.ts','synthetic');put('edge/inventory.json',['fib-editorial-write','fib-u4-ris-pilot','fib-u4-pilot'].map(slug=>({slug,version:1,verify_jwt:false})));put('configuration/state.json',{});
 assert.throws(()=>seal(root,commit));rmSync(join(root,'release.json'));
 put('configuration/evidence.json',{commit,databaseRestore:true,edgeExport:true,frontendExport:true,configurationCapture:true});
 assert.throws(()=>seal(root,commit),/Bundle incomplete/);rmSync(join(root,'release.json'));
 put('originals/'+ref.storage_key,original);
 seal(root,commit);verify(root,commit);
 assert.throws(()=>verify(root,'b'.repeat(40)));assert.throws(()=>verify(root,commit,Date.now()+7200000));verify(root,commit,Date.now()+7200000,true);
 put('originals/'+ref.storage_key,'tampered-original');assert.throws(()=>verify(root,commit));put('originals/'+ref.storage_key,original);
 put('frontend/index.html','changed');assert.throws(()=>verify(root,commit));put('frontend/index.html','synthetic');
 symlinkSync('/tmp',join(root,'link'));assert.throws(()=>verify(root,commit));rmSync(join(root,'link'));
 rmSync(join(root,'database/fib.dump'));assert.throws(()=>verify(root,commit));
 console.log('PASS synthetic bundle: completeness, nested hashes, target commit, expiry, tampering, missing data and symlink rejection. No live backup/restore claimed.');
}finally{rmSync(root,{recursive:true,force:true});}
