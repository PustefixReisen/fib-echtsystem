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

/** A resumable batch preserves the pending RIS navigation for a later run.
 * Persist this state atomically with observations before claiming progress.
 * This function itself does not persist or certify a historical start date.
 */
export type RisWindowCursor={
 pending:string[];
 visited:string[];
 documents:string[];
 failures:{url:string;error:string}[];
};
export async function scanRisReleaseBatch(
 entryUrl:string,
 fetchPage:RisWindowFetch,
 maxWindows:number,
 previous?:RisWindowCursor,
):Promise<{cursor:RisWindowCursor;complete:boolean;processed:number}>{
 if(!Number.isSafeInteger(maxWindows)||maxWindows<1||maxWindows>50)throw new Error('Invalid window budget');
 const allowed=new URL(entryUrl);
 const validate=(value:string)=>{
  const u=new URL(value);
  if(u.origin!==allowed.origin || !/^\/do0040\.asp$/i.test(u.pathname) || u.protocol!=='https:')throw new Error('Unexpected RIS cursor URL');
  u.hash='';
  return u.href;
 };
 const restart=Boolean(previous && previous.pending.length===0 && previous.failures.length===0);
 const visited=new Set((restart?[]:(previous?.visited??[])).map(validate));
 const documents=new Set(previous?.documents??[]);
 const failures=[...(previous?.failures??[])];
 const pending=(restart?[entryUrl]:(previous?.pending??[entryUrl])).map(validate).filter(u=>!visited.has(u));
 const known=new Set([...visited,...pending]);
 let processed=0;
 while(pending.length && processed<maxWindows){
  const url=pending.shift()!;
  processed++;
  try {
   const response=await fetchPage(url);
   if(!response.ok)throw new Error('HTTP '+response.status);
   const html=await response.text();
   if(!/<(?:html|body|a)\b/i.test(html))throw new Error('Invalid HTML');
   const window=risReleaseWindow(html,url);
   // A successful page must provide a meaningful observation or navigation.
   const links=risReleaseHistoryLinks(html,url).map(validate);
   if(window.documentUrls.length===0 && links.length===0)throw new Error('Empty RIS release listing without navigation');
   window.documentUrls.forEach(d=>documents.add(d));
   visited.add(url);
   for(let i=failures.length-1;i>=0;i--)if(failures[i]?.url===url)failures.splice(i,1);
   for(const link of links)if(!known.has(link)){known.add(link);pending.push(link);}
  } catch(e){
   failures.push({url,error:e instanceof Error?e.message:String(e)});
   // Retain the failed window for retry in next batch; do not mark it visited.
   pending.push(url);
   break;
  }
 }
 return {cursor:{pending,visited:[...visited],documents:[...documents],failures},
  complete:pending.length===0&&failures.length===0,processed};
}
