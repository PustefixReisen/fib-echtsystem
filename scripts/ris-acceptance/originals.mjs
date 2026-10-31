// Download once into the protected local state. Never mirror source bytes in Git/CI artifacts.
import {writeFileSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
const root=process.env.RUNNER_TEMP;
if(!root)throw Error('Privater Zustandsordner fehlt.');
const minutes=JSON.parse(readFileSync('tests/u4/fixtures/ris-1031-provenance.json','utf8'));
const manifest=[];
for(const id of ['75714','75790','75785','74647','75243','75379']){
 const url='https://buergerinfo-feldkirchen.digitalfabrix.de/getfile.asp?id='+id;
 const r=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(30000)});
 if(!r.ok||!r.headers.get('content-type')?.toLowerCase().includes('pdf'))throw Error('Original-PDF '+id+' nicht verfügbar; keine Ersatzdaten eingesetzt.');
 const bytes=Buffer.from(await r.arrayBuffer());
 if(bytes.length>20_000_000||bytes.subarray(0,5).toString()!=='%PDF-')throw Error('Ungültiges Original-PDF '+id);
 const sha256=createHash('sha256').update(bytes).digest('hex');
 if(id==='75785'&&sha256!==minutes.pdfSha256)throw Error('Niederschrift 75785 hat sich seit der Referenz geändert. Quellenstand vor fachlicher Abnahme klären; kein stiller Ersatz.');
 writeFileSync(join(root,id+'.pdf'),bytes,{mode:0o600});
 manifest.push({id,url,sha256,retrievedAt:new Date().toISOString(),originalBytes:true});
}
writeFileSync(join(root,'quellenbestand.json'),JSON.stringify(manifest,null,2)+'\n',{mode:0o600});
console.log('Sechs Original-PDFs ausschließlich im privaten lokalen Zustand gespeichert. HTML-/Nachrichtenansichten bleiben dokumentierte Ausschnitte.');
