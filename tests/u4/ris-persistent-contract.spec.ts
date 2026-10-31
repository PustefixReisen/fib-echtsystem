import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {extractText} from 'unpdf';
import {parseRisStructure,risUrl,RIS_ORIGIN} from '../../supabase/functions/_shared/ris-structure.ts';
const html=readFileSync('tests/u4/fixtures/ris-1032-top-2-3.html','utf8');
const url=RIS_ORIGIN+'/si0057.asp?__ksinr=1032';
async function main(){
 const s=await parseRisStructure(html,url,'2026-10-31T12:00:00Z');
 assert.equal(s.date,'2026-10-29');assert.equal(s.agenda.length,2);assert.equal(s.agenda[0].documents[0].kind,'proposal');
 assert.equal(s.agenda[0].proposalReferences[RIS_ORIGIN+'/vo0050.asp?__kvonr=8640'],'5395/2026');
 assert.equal(risUrl('https://attacker.invalid/getfile.asp?id=1'),null);assert.equal(risUrl('https://a:b@buergerinfo-feldkirchen.digitalfabrix.de/getfile.asp?id=1'),null);
 assert.equal(risUrl('/getfile.asp?id=1&type=do'),RIS_ORIGIN+'/getfile.asp?id=1');
 await assert.rejects(()=>parseRisStructure('<html>temporarily unavailable</html>',url,new Date().toISOString()),/incomplete/);
 await assert.rejects(()=>parseRisStructure(html.replace('&Ouml; 3','&Ouml; 2'),url,new Date().toISOString()),/duplicate/);
 const missing=await parseRisStructure(html.replace('29.10.2026','31.02.2026').replace('sigrname','unknownfield'),url,new Date().toISOString());assert.equal(missing.date,null);assert.equal(missing.committee,null);
 const ambiguous=await parseRisStructure(html.replace('5395/2026</a>','5395/2026</a><a href="vo0050.asp?__kvonr=999">conflict</a>'),url,new Date().toISOString());assert.ok(ambiguous.agenda[0].issues.includes('ambiguous_proposals'));
 // A later TOP detail link does not change the established session/number identity.
 const withTop=await parseRisStructure(html.replace('5395/2026</a>','5395/2026</a><a href="to0050.asp?__ktonr=999">TOP</a>'),url,new Date().toISOString());assert.equal(withTop.agenda[0].key,s.agenda[0].key);assert.equal(withTop.agenda[0].publishedTopUrls.length,1);
 // Valid synthetic PDF exercises the pinned production extractor, not a mock.
 const stream='BT /F1 12 Tf 20 100 Td (RIS extraction test) Tj ET';
 const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 200] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
 let pdf='%PDF-1.4\n';const offsets=[0];for(const [i,obj] of objects.entries()){offsets.push(pdf.length);pdf+=`${i+1} 0 obj\n${obj}\nendobj\n`;}
 const xref=pdf.length;pdf+='xref\n0 6\n0000000000 65535 f \n'+offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
 const result=await extractText(new TextEncoder().encode(pdf),{mergePages:true});assert.ok(result.text.includes('RIS extraction test'));
 const handler=readFileSync('supabase/functions/fib-editorial-write/index.ts','utf8');assert.ok(handler.includes("body.origin!=='editor'"));
 console.log('RIS structure ambiguity, provenance, stable identity and actual pinned PDF text extraction passed');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
