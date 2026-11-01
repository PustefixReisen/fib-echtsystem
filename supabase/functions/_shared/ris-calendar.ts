/**
 * Read-only RIS calendar discovery. Monthly pages expose actual session anchors.
 * All URLs are same-origin and normalized; no proposal reverse inference.
 */
export const calendarOrigin = 'https://buergerinfo-feldkirchen.digitalfabrix.de';
export function calendarMonth(year: number, month: number): string {
  if (!Number.isInteger(year)||year<2000||year>2100||!Number.isInteger(month)||month<1||month>12) throw Error('invalid_calendar_period');
  return calendarOrigin+'/si0040.asp?__cjahr='+year+'&__cmonat='+month+'&__canz=1&__cselect=0';
}
export function calendarSessions(html:string):string[] {
  const result=new Set<string>();
  for(const m of html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi)){
    try{
      const u=new URL(m[1].replace(/&amp;/g,'&'),calendarOrigin+'/si0040.asp');
      if(u.protocol!=='https:'||u.origin!==calendarOrigin||u.username||u.password)continue;
      if(!/^\/si\d+\.asp$/i.test(u.pathname))continue;
      const id=u.searchParams.get('__ksinr');
      if(!id||!/^\d+$/.test(id))continue;
      result.add(calendarOrigin+u.pathname.toLowerCase()+'?__ksinr='+id);
    }catch{/* Invalid links are never adopted. */}
  }
  return [...result];
}
