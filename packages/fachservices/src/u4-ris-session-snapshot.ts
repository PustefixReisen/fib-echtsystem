import {createHash} from 'node:crypto';
import {extractRisAgendaRows} from './u4-ris-agenda-evidence.js';
import {risStructureCandidates} from './u4-ris-structure-candidates.js';

function text(html:string):string {
 return html.replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&')
  .replace(/&Ouml;/g,'Ö').replace(/&#(\d+);/g,(_,n)=>{const c=Number(n);return c<=0x10ffff?String.fromCodePoint(c):'�';})
  .replace(/\s+/g,' ').trim();
}
function cell(html:string,name:string):string|null {
 const matches=[...html.matchAll(new RegExp('<div\\b[^>]*class="[^"]*\\b'+name+'\\b[^"]*"[^>]*>([\\s\\S]*?)</div>','gi'))].map(x=>text(x[1]));
 return matches.length===1&&matches[0]?matches[0]:null;
}
/** Observation only: neither imports into the editorial model nor asserts a decision. */
export function risSessionSnapshot(html:string,url:string,observedAt:string){
 const candidates=risStructureCandidates(html,url);
 if(!Number.isFinite(Date.parse(observedAt)))throw Error('invalid_observation_time');
 const date=cell(html,'sidat');
 const match=date?.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
 const iso=match?`${match[3]}-${match[2]}-${match[1]}`:null;
 const dateValid=iso&&Number.isFinite(Date.parse(iso))&&new Date(iso).toISOString().startsWith(iso);
 const rows=extractRisAgendaRows(html,url);
 const canonical=new URL(url);canonical.search='?__ksinr='+canonical.searchParams.get('__ksinr');canonical.hash='';
 const topCounts=new Map<string,number>();
 for(const c of candidates)if(c.topNumber)topCounts.set(c.topNumber,(topCounts.get(c.topNumber)??0)+1);
 return {
  session:{externalId:canonical.href,sourceUrl:url,reference:cell(html,'siname'),committee:cell(html,'sigrname'),date:dateValid?iso:null},
  provenance:{sourceUrl:url,observedAt,sha256:createHash('sha256').update(html).digest('hex')},
  coverage:'observed_rows_only' as const,
  agenda:candidates.map((c,i)=>({...c,title:rows[i].rowText,
   reviewRequired:true as const,
   issues:[...(!c.topNumber?['missing_top_number']:[]),...(c.topNumber&&(topCounts.get(c.topNumber)??0)>1?['ambiguous_top']:[])],
   // Document type cannot be inferred from its existence or a generic PDF label.
   documents:c.documentUrls.map(sourceUrl=>({sourceUrl,kind:'unclassified' as const})),
  })),
 };
}
