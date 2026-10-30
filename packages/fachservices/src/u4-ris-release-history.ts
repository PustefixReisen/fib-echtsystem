/** RIS do0040.asp is a time-windowed document release listing.
 * A successful single-page fetch does not prove historical completeness.
 */
export function risReleaseHistoryLinks(html:string,listingUrl:string):string[]{
  const base=new URL(listingUrl);
  if(!/^\/do0040\.asp$/i.test(base.pathname))throw new Error('Not RIS release listing');
  const urls=new Set<string>();
  for(const match of html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)){
    try {
      const u=new URL((match[1]??'').replace(/&amp;/g,'&'),base);
      if(u.origin!==base.origin||u.protocol!=='https:'||!/^\/do0040\.asp$/i.test(u.pathname))continue;
      if(!/^\d{7}$/.test(u.searchParams.get('smcadat')??''))continue;
      urls.add(u.href);
    }catch{}
  }
  return [...urls];
}
export type RisReleaseWindow={entryUrl:string;listingDateParameter:string|null;documentUrls:string[]};
/** Releases are observed by document identity, never by their position on a day page. */
export function risReleaseWindow(html:string,listingUrl:string):RisReleaseWindow{
  const base=new URL(listingUrl);
  const documentUrls=new Set<string>();
  for(const m of html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)){
    try{
      const u=new URL((m[1]??'').replace(/&amp;/g,'&'),base);
      if(u.protocol!=='https:'||u.origin!==base.origin||!/^\/getfile\.asp$/i.test(u.pathname)||!u.searchParams.has('id'))continue;
      documentUrls.add(u.href);
    }catch{}
  }
  return {entryUrl:base.href,listingDateParameter:base.searchParams.get('smcadat'),documentUrls:[...documentUrls]};
}
