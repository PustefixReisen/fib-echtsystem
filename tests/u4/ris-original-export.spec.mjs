import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {createHash} from 'node:crypto';
import {captureOriginals} from '../../scripts/backup/ris-originals.mjs';
const root=mkdtempSync(join(tmpdir(),'fib-original-export-'));
const bytes=Buffer.from('%PDF-1.4\nsynthetic storage original'),hash=createHash('sha256').update(bytes).digest('hex');
const ref={id:'11111111-1111-4111-8111-111111111111',document_id:'22222222-2222-4222-8222-222222222222',content_hash:hash,content_author:'municipality',size:bytes.length};ref.storage_key=`${ref.document_id}/${ref.id}/${hash}.pdf`;
const manifest={format:2,schema:'fib',project:'isolated-test',risOriginals:[ref]};
const save=()=>writeFileSync(join(root,'database/manifest.json'),JSON.stringify(manifest));
try{
 mkdirSync(join(root,'database'));save();let calls=0;
 const env={FIB_ACCEPTANCE_USER_TOKEN:'synthetic',VITE_SUPABASE_PUBLISHABLE_KEY:'synthetic'};
 const request=async(url,init)=>{calls++;assert.match(url,/apaubomxffcwtzjimori/);assert.equal(JSON.parse(init.body).action,'source_pdf');assert.equal(init.redirect,'error');return new Response(bytes,{headers:{'content-type':'application/pdf'}});};
 await assert.rejects(()=>captureOriginals(root,{},request),/AAL2/);assert.equal(calls,0);
 await assert.rejects(()=>captureOriginals(root,env,async()=>new Response('denied',{status:403})),/export failed/);
 await assert.rejects(()=>captureOriginals(root,env,async()=>new Response('%PDF-corrupted',{headers:{'content-type':'application/pdf'}})),/hash mismatch/);
 assert.equal(existsSync(join(root,'originals')),false);
 manifest.risOriginals=[{...ref,content_author:'unknown'}];save();await assert.rejects(()=>captureOriginals(root,env,request),/Invalid original/);assert.equal(calls,0);
 manifest.risOriginals=[ref];save();assert.equal(await captureOriginals(root,env,request),1);assert.deepEqual(readFileSync(join(root,'originals',ref.storage_key)),bytes);
 await assert.rejects(()=>captureOriginals(root,env,request),/overwrite/);
 console.log('PASS original backup export: exact snapshot hash/size, human authorization, unknown rights denied, no overwrite, no RIS request; HTTP simulated');
}finally{rmSync(root,{recursive:true,force:true});}
