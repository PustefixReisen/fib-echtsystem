import assert from 'node:assert/strict';
import {extractRisAgendaRows} from '../../packages/fachservices/src/u4-ris-agenda-evidence.js';
import {collectRisPageEvidence} from '../../packages/fachservices/src/u4-ris-link-evidence.js';
import type {DiscoveredLink} from '../../packages/fachservices/src/u4-source-discovery.js';

// A structural contract: do not infer a *Beschluss* from a proposal or PDF.
const base='https://buergerinfo-feldkirchen.digitalfabrix.de';
const session=base+'/si0057.asp?__ksinr=1032&smcmode=32832';
const proposal2=base+'/vo0050.asp?__kvonr=8640';
const proposal3=base+'/vo0050.asp?__kvonr=8642';
const pdf2=base+'/getfile.asp?id=75854&type=do';
const html='<table>'+
 '<tr><td>2</td><td><a href="vo0050.asp?__kvonr=8640">Vorlage</a><a href="getfile.asp?id=75854&amp;type=do">PDF</a></td></tr>'+
 '<tr><td>3</td><td><a href="vo0050.asp?__kvonr=8642">Vorlage</a></td></tr>'+
 '</table>';
const rows=extractRisAgendaRows(html,session);
assert.equal(rows.length,2);
assert.deepEqual(rows.map(x=>x.topNumber),['2','3']);
assert.equal(rows[0].proposalUrl,proposal2);
assert.deepEqual(rows[0].documentUrls,[pdf2]);
assert.equal(rows[1].proposalUrl,proposal3);
assert.deepEqual(rows[1].documentUrls,[]);
assert.ok(rows.every(x=>x.evidence==='same-html-row'));
const links:DiscoveredLink[]=[
 {url:proposal2,kind:'proposal',title:'Vorlage'} as DiscoveredLink,
 {url:pdf2,kind:'attachment',title:'PDF'} as DiscoveredLink
];
const evidence=collectRisPageEvidence(session,links);
assert.deepEqual(evidence.map(x=>x.relation),['session-proposal','session-document']);
assert.ok(evidence.every(x=>x.certainty==='page-link-only'));
assert.equal(evidence.some(x=>String(x.relation).includes('decision')),false);
// Two proposals in one row must not be attached to an arbitrary TOP.
const ambiguous='<table><tr><td>4</td><td><a href="vo0050.asp?__kvonr=8640">A</a><a href="vo0050.asp?__kvonr=8642">B</a></td></tr></table>';
assert.equal(extractRisAgendaRows(ambiguous,session).length,0);
console.log('RIS session/TOP/proposal evidence contract passed; no Beschluss inferred');
