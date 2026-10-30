import {parseSourceListing, fingerprintDetail,U4_PILOT_TARGETS} from '../packages/fachservices/src/u4-source-discovery.js';
import {collectRisPageEvidence} from '../packages/fachservices/src/u4-ris-link-evidence.js';
import {extractRisAgendaRows} from '../packages/fachservices/src/u4-ris-agenda-evidence.js';

const http=async (url:string)=> {
  const timeout=AbortSignal.timeout(15000);
  return fetch(url,{signal:timeout,headers:{'User-Agent':'FIB-SourceMonitor-Test/0.1','Accept':'text/html,application/pdf,*/*'}})
};
async function run(){
  const report=[] as Record<string,unknown>[];
  for(const target of U4_PILOT_TARGETS.filter(t=>t.key!=='feldkirchen-archive')){
    const response=await http(target.url);
    if(!response.ok) throw new Error(target.key+' HTTP '+response.status);
    const html=await response.text();
    const found=parseSourceListing(target,html);
    const types=[...new Set(found.map(x=>x.kind))];
    console.log(JSON.stringify({scope:target.key,detected:found.length,types,examples:found.slice(0,3).map(x=>x.url)}));
    if(found.length<1)throw new Error('No parsed links in '+target.key);
    report.push({scope:target.key,found:found.length});
    if(target.key==='feldkirchen-ris-releases'){
      const docs=found.filter(x=>x.kind==='attachment');
      const templates=found.filter(x=>x.kind==='proposal');
      if(!docs.length || !templates.length)throw new Error('RIS lists do not expose proposal and PDF links');
      const doc=docs.find(x=>x.url.includes('getfile.asp'));
      if(!doc)throw new Error('No getfile PDF URL');
      const fingerprint=await fingerprintDetail(doc.url,async(url)=>await http(url));
      if(fingerprint.length!==64)throw new Error('PDF fingerprint invalid');
      console.log(JSON.stringify({pdfDocumentChecked:true,sha256Length:fingerprint.length}));
    }
  }
  const sessionUrl='https://buergerinfo-feldkirchen.digitalfabrix.de/si0057.asp?__ksinr=1032&smcmode=32832';
  const sessionResponse=await http(sessionUrl);
  if(!sessionResponse.ok)throw new Error('Session HTTP '+sessionResponse.status);
  const sessionHtml=await sessionResponse.text();
  const sessionLinks=parseSourceListing({key:'feldkirchen-ris-session',url:sessionUrl,origin:new URL(sessionUrl).origin},sessionHtml);
  const evidence=collectRisPageEvidence(sessionUrl,sessionLinks);
  const agendaRows=extractRisAgendaRows(sessionHtml,sessionUrl);
  console.log(JSON.stringify({scope:'ris-agenda-row-validation',count:agendaRows.length,topNumbers:agendaRows.map(x=>x.topNumber??null),documents:agendaRows.map(x=>x.documentUrls.length)}));
  const proposals=evidence.filter(e=>e.relation==='session-proposal');
  const attachments=evidence.filter(e=>e.relation==='session-document');
  if(!proposals.length||!attachments.length)throw new Error('Missing RIS session document/proposal links');
  console.log(JSON.stringify({scope:'feldkirchen-ris-session',proposals:proposals.length,attachments:attachments.length,certainty:'page-link-only'}));
  console.log('Live U4 source adapter test passed');
}
void run().catch(error=>{console.error(error);process.exitCode=1});
