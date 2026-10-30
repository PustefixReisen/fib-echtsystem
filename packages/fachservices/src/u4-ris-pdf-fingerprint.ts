import {createHash} from 'node:crypto';

export type RisPdfFetch=(url:string)=>Promise<{ok:boolean;status:number;headers:{get(name:string):string|null};arrayBuffer():Promise<ArrayBuffer>}>;
export async function fingerprintRisPdf(url:string,fetchPdf:RisPdfFetch):Promise<string>{
 const parsed=new URL(url);
 if(parsed.protocol!=='https:'||parsed.hostname!=='buergerinfo-feldkirchen.digitalfabrix.de'||parsed.pathname.toLowerCase()!=='/getfile.asp'||!parsed.searchParams.has('id'))
  throw new Error('Unexpected RIS document address');
 const response=await fetchPdf(url);
 if(!response.ok)throw new Error('RIS PDF HTTP '+response.status);
 const bytes=new Uint8Array(await response.arrayBuffer());
 if(bytes.length<5||new TextDecoder().decode(bytes.slice(0,5))!=='%PDF-')throw new Error('RIS document is not a PDF');
 if(bytes.byteLength>25_000_000)throw new Error('RIS PDF exceeds size limit');
 return createHash('sha256').update(bytes).digest('hex');
}
