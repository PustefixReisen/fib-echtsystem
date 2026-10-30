import assert from 'node:assert/strict';
import {discoverSource, parseSourceListing, fingerprintDetail, U4_PILOT_TARGETS} from '../../packages/fachservices/src/u4-source-discovery.js';
import {reconcileSourceObservation,updateSourceCheckpoint} from '../../packages/domain-contracts/src/source-monitor.js';

const news=U4_PILOT_TARGETS[0]!;
const ris=U4_PILOT_TARGETS[2]!;
const listing='<html><body><a href="/aktuelles/aktuelle-news/aktuelle-meldungen/vernissage-2026">Vernissage 2026</a><a href="https://unrelated.example/evil">Fremdquelle</a><a href="/aktuelles/aktuelle-news/aktuelle-meldungen/nachrichten-archiv">Archiv</a></body></html>';
const items=parseSourceListing(news,listing);
assert.equal(items.length,1);
assert.equal(items[0]?.kind,'news');
assert.equal(items[0]?.url,'https://www.feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen/vernissage-2026');
const risLinks=parseSourceListing(ris,'<html><body><a href="si0057.asp?__ksinr=1032&amp;smcmode=32832">29. Oktober Gemeinderat</a><a href="vo0050.asp?__kvonr=5395">Wegfall Zuschuss Vorlage</a><a href="getfile.asp?id=7">Anlage</a></body></html>');
assert.deepEqual(risLinks.map(x=>x.kind),['session','proposal','attachment']);
assert.equal(risLinks[0]?.url.includes('&smcmode='),true);

// Regression against the actual current + archive URL shapes (municipality site).
const actualArchive = U4_PILOT_TARGETS[1]!;
const archived = parseSourceListing(actualArchive,
  '<html><body><a href="/aktuelles/aktuelle-news/aktuelle-meldungen/nachrichten-archiv/katastrophenschutz-leuchttuerme-feldkirchen">Katastrophenschutz-Leuchttürme Feldkirchen</a></body></html>');
assert.equal(archived.length,1);
assert.equal(archived[0]?.kind,'news');
assert.ok(archived[0]?.url.endsWith('/nachrichten-archiv/katastrophenschutz-leuchttuerme-feldkirchen'));

const http=async(url:string)=>({ok:true,status:200,text:async()=>url.includes('/vernissage-2026')?'<html><body>Neue Details</body></html>':listing});
const discovered=await discoverSource(news,http);
assert.equal(discovered.length,1);
const detail=await fingerprintDetail(discovered[0]!.url,http);
const first=reconcileSourceObservation('scope',discovered[0]!.externalId,discovered[0]!.url,detail,'2026-10-29T21:00:00Z');
const again=reconcileSourceObservation('scope',discovered[0]!.externalId,discovered[0]!.url,detail,'2026-10-29T22:00:00Z',first.observation);
assert.equal(again.status,'unchanged');
const changed=reconcileSourceObservation('scope',discovered[0]!.externalId,discovered[0]!.url,'changed-content','2026-10-29T23:00:00Z',again.observation);
assert.equal(changed.status,'changed');
assert.equal(changed.observation.revision,2);
await assert.rejects(()=>discoverSource(news,async()=>({ok:true,status:200,text:async()=>'<html><body>no items</body></html>'})),/No qualifying/);
await assert.rejects(()=>discoverSource(news,async()=>({ok:false,status:503,text:async()=>''})),/HTTP 503/);
const previous={scopeId:'scope',lastSuccessAt:'2026-10-29T12:00:00Z'};
const failure=updateSourceCheckpoint(previous,'2026-10-29T18:00:00Z',false,'503');
assert.equal(failure.gapSince,previous.lastSuccessAt);

const pdfUrl='https://buergerinfo-feldkirchen.digitalfabrix.de/getfile.asp?id=75813&type=do';
const pdfBytes=new TextEncoder().encode('%PDF-1.7 example fixture');
const pdfFingerprint=await fingerprintDetail(pdfUrl,async()=>({
  ok:true,status:200,text:async()=>{throw new Error('Should not decode PDF as HTML')},
  headers:{get:()=> 'application/pdf'},
  arrayBuffer:async()=>pdfBytes.buffer
}));
assert.equal(pdfFingerprint.length,64);
await assert.rejects(()=>fingerprintDetail(pdfUrl,async()=>({
  ok:true,status:200,text:async()=>'<html>login page</html>',
  headers:{get:()=> 'text/html'},
  arrayBuffer:async()=>new TextEncoder().encode('<html>login page</html>').buffer
})),/Unexpected PDF response/);

console.log('U4 HTML and PDF source discovery cases passed');
