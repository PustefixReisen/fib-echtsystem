import {risReleaseHistoryLinks,risReleaseWindow} from './u4-ris-release-history.js';

export type RisWindowFetch = (url:string)=>Promise<{ok:boolean;status:number;text():Promise<string>}>;
export type RisCoverage = {
  complete:boolean;
  fetchedUrls:string[];
  documents:string[];
  failures:{url:string;error:string}[];
  limited:boolean;
};
/** Inspect a bounded number of RIS release windows.
 * Never report completeness when navigation was truncated or a page failed.
 */
export async function scanRisReleaseWindows(entryUrl:string,fetchPage:RisWindowFetch,maxWindows=8):Promise<RisCoverage>{
  if(!Number.isSafeInteger(maxWindows)||maxWindows<1||maxWindows>50)throw new Error('Invalid window budget');
  const queue=[entryUrl],scheduled=new Set(queue),fetchedUrls:string[]=[],documents=new Set<string>();
  const failures:{url:string;error:string}[]=[];
  while(queue.length && fetchedUrls.length<maxWindows){
    const url=queue.shift()!;
    try {
      const response=await fetchPage(url);
      if(!response.ok)throw new Error('HTTP '+response.status);
      const html=await response.text();
      if(!/<(?:html|body|a)\b/i.test(html))throw new Error('Invalid HTML');
      const window=risReleaseWindow(html,url);
      for(const d of window.documentUrls)documents.add(d);
      fetchedUrls.push(url);
      for(const linked of risReleaseHistoryLinks(html,url)){
        if(!scheduled.has(linked)){
          scheduled.add(linked);
          queue.push(linked);
        }
      }
    }catch(err){
      failures.push({url,error:err instanceof Error?err.message:String(err)});
      // Failed navigation is a coverage gap; do not advance a full-success cursor.
    }
  }
  const limited=queue.length>0;
  return {complete:failures.length===0&&!limited,fetchedUrls,documents:[...documents],failures,limited};
}
