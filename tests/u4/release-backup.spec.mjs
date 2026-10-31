import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';
import {seal,verify,hash} from '../../scripts/backup/bundle.mjs';
const root=mkdtempSync(join(tmpdir(),'fib-backup-test-')),commit='a'.repeat(40);
const put=(p,v)=>{mkdirSync(join(root,p,'..'),{recursive:true});writeFileSync(join(root,p),typeof v==='string'?v:JSON.stringify(v),{mode:0o600});};
try{
 put('database/fib.dump','PGDMPsynthetic');put('database/auth-ids.json','[]');
 put('database/manifest.json',{schema:'fib',project:'apaubomxffcwtzjimori',aclIncluded:true,containsAuthSecrets:false,tableCounts:{events:0},files:{'fib.dump':hash('PGDMPsynthetic'),'auth-ids.json':hash('[]')}});
 put('frontend/index.html','synthetic');put('edge/fib-example/index.ts','synthetic');put('edge/inventory.json',[{slug:'fib-example',version:1,verify_jwt:false}]);put('configuration/state.json',{});
 assert.throws(()=>seal(root,commit));rmSync(join(root,'release.json'));
 put('configuration/evidence.json',{commit,databaseRestore:true,edgeExport:true,frontendExport:true,configurationCapture:true});
 seal(root,commit);verify(root,commit);
 assert.throws(()=>verify(root,'b'.repeat(40)));assert.throws(()=>verify(root,commit,Date.now()+7200000));
 put('frontend/index.html','changed');assert.throws(()=>verify(root,commit));put('frontend/index.html','synthetic');
 symlinkSync('/tmp',join(root,'link'));assert.throws(()=>verify(root,commit));rmSync(join(root,'link'));
 rmSync(join(root,'database/fib.dump'));assert.throws(()=>verify(root,commit));
 console.log('PASS synthetic bundle: completeness, nested hashes, target commit, expiry, tampering, missing data and symlink rejection. No live backup/restore claimed.');
}finally{rmSync(root,{recursive:true,force:true});}
