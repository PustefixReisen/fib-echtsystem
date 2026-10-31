import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const original=globalThis.fetch, previous=process.env.RUNNER_TEMP;
const root=mkdtempSync(join(tmpdir(),'fib-originals-contract-'));
process.env.RUNNER_TEMP=root;
let n=0;
const invoke=()=>import('../../scripts/ris-acceptance/originals.mjs?negative='+n++);
try{
 globalThis.fetch=async()=>new Response('<html>temporarily unavailable</html>',{headers:{'content-type':'text/html'}});
 await assert.rejects(invoke,/Original-PDF 75714/);
 assert.equal(existsSync(join(root,'75714.pdf')),false);
 globalThis.fetch=async()=>new Response('not a PDF',{headers:{'content-type':'application/pdf'}});
 await assert.rejects(invoke,/Ungültiges Original-PDF/);
 const requested=[];
 globalThis.fetch=async input=>{requested.push(String(input));return new Response('%PDF-synthetic wrong bytes',{headers:{'content-type':'application/pdf'}});};
 await assert.rejects(invoke,/75785 hat sich/);
 assert.equal(existsSync(join(root,'quellenbestand.json')),false);
 assert.equal(existsSync(join(root,'75785.pdf')),false);
 assert.ok(requested.every(u=>/^https:\/\/buergerinfo-feldkirchen.digitalfabrix.de\/getfile.asp\?id=(75714|75790|75785)$/.test(u)));
 console.log('PASS original transport rejects HTML, invalid PDF and changed reference hash; never reports substituted original provenance');
}finally{globalThis.fetch=original;if(previous===undefined)delete process.env.RUNNER_TEMP;else process.env.RUNNER_TEMP=previous;rmSync(root,{recursive:true,force:true});}
