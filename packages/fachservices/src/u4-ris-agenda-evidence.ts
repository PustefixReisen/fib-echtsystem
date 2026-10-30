export type RisAgendaEvidence = {
  proposalUrl:string;
  documentUrls:string[];
  rowText:string;
  evidence:'same-html-row';
  topNumber?:string;
};
/**
 * Only pairs a proposal and its documents when exactly one proposal appears
 * inside the same HTML table row. Does not assert a decision or vote.
 */
export function extractRisAgendaRows(html:string, pageUrl:string):RisAgendaEvidence[] {
  const origin=new URL(pageUrl).origin;
  const result:RisAgendaEvidence[]=[];
  const seen=new Set<string>();
  const rowPattern=/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  const hrefPattern=/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi;
  for(const row of html.matchAll(rowPattern)){
    const body=row[1]??'';
    const urls:string[]=[];
    for(const match of body.matchAll(hrefPattern)){
      try{
        const u=new URL((match[1]??'').replace(/&amp;/g,'&'),pageUrl);
        if(u.protocol==='https:' && u.origin===origin)urls.push(u.href);
      }catch{}
    }
    const proposals=[...new Set(urls.filter(u=>/^\/vo\d+\.asp$/i.test(new URL(u).pathname) && new URL(u).searchParams.has('__kvonr')))];
    if(proposals.length!==1 || seen.has(proposals[0]))continue;
    const docs=[...new Set(urls.filter(u=>new URL(u).pathname.toLowerCase()==='/getfile.asp' && new URL(u).searchParams.has('id')))];
    const text=body.replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/\s+/g,' ').trim();
    const firstCell=body.match(/<td\b[^>]*>([\s\S]*?)<\/td>/i)?.[1]?.replace(/<[^>]*>/g,' ').trim()??'';
    const topNumber=/^(?:TOP\s*)?(\d{1,2}(?:\.\d{1,2})?)\.?$/i.exec(firstCell)?.[1];
    result.push({proposalUrl:proposals[0],documentUrls:docs,rowText:text.slice(0,300),evidence:'same-html-row',...(topNumber?{topNumber}:{})});
    seen.add(proposals[0]);
  }
  return result;
}
