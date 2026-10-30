import {fingerprintRisPdf,type RisPdfFetch} from './u4-ris-pdf-fingerprint.js';

export type RisPdfPrior={url:string;fingerprint:string;revision:number};
export type RisPdfChange={url:string;fingerprint:string;revision:number;kind:'new'|'changed'|'unchanged'};
/** Only return a success result when every requested PDF has been fetched and hashed.
 * Callers must commit observations and checkpoint together, never on a partial result.
 */
export async function checkRisPdfChanges(
 urls:readonly string[],
 prior:ReadonlyMap<string,RisPdfPrior>,
 fetchPdf:RisPdfFetch,
):Promise<RisPdfChange[]>{
 const results:RisPdfChange[]=[];
 for(const url of new Set(urls)){
  const fingerprint=await fingerprintRisPdf(url,fetchPdf);
  const old=prior.get(url);
  const kind=!old?'new':old.fingerprint===fingerprint?'unchanged':'changed';
  results.push({url,fingerprint,kind,revision:!old?1:kind==='changed'?old.revision+1:old.revision});
 }
 return results;
}
