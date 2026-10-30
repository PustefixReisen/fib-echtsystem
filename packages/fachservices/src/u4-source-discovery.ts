import { createHash } from 'node:crypto';
import type { RisKind } from '../../domain-contracts/src/source-monitor.js';

export type MonitorTarget = {
  key: 'feldkirchen-news' | 'feldkirchen-archive' | 'feldkirchen-ris-releases' | 'feldkirchen-ris-session';
  url: string;
  origin: string;
};
export type DiscoveredLink = { externalId: string; url: string; title: string; kind: RisKind | 'news'; fingerprint: string };
export type FetchResponse = { ok: boolean; status: number; text(): Promise<string>; arrayBuffer?(): Promise<ArrayBuffer>; headers?: { get(name:string): string|null } };
export type HttpGet = (url: string) => Promise<FetchResponse>;

export const U4_PILOT_TARGETS: readonly MonitorTarget[] = [
  {key:'feldkirchen-news',url:'https://www.feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen',origin:'https://www.feldkirchen.de'},
  {key:'feldkirchen-archive',url:'https://www.feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen/nachrichten-archiv',origin:'https://www.feldkirchen.de'},
  {key:'feldkirchen-ris-releases',url:'https://buergerinfo-feldkirchen.digitalfabrix.de/do0040.asp?smcmode=32832',origin:'https://buergerinfo-feldkirchen.digitalfabrix.de'},
];

function decodeEntities(value: string): string {
  return value.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'")
    .replace(/&nbsp;|&#160;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
    .replace(/&#(\d+);/g,(_,n: string)=>String.fromCodePoint(Number(n)));
}
function clean(value: string): string {
  return decodeEntities(value.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ')).trim();
}
function hrefs(html: string): {url:string;title:string}[] {
  const results: {url:string;title:string}[]=[];
  const matcher=/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for(const match of html.matchAll(matcher)) {
    const title=clean(match[2] ?? '');
    if(title) results.push({url:decodeEntities(match[1] ?? ''),title});
  }
  return results;
}
function normalize(target: MonitorTarget, candidate: string): string | undefined {
  try {
    const url=new URL(candidate,target.url);
    if(url.protocol!=='https:' || url.origin!==target.origin) return undefined;
    url.hash='';
    return url.href;
  } catch {return undefined;}
}
function classifyRis(url: string, label: string): RisKind {
  const path=new URL(url).pathname.toLowerCase();
  if(/^\/si\d+\.asp/.test(path)) return 'session';
  if(/^\/to\d+\.asp/.test(path)) return 'agenda-item';
  if(/^\/vo\d+\.asp/.test(path)) return 'proposal';
  if(/^\/getfile\.asp/.test(path)) return 'attachment';
  if(/niederschrift/i.test(label)) return 'minutes';
  if(/beschluss(?!vorlage)/i.test(label)) return 'resolution';
  return 'attachment';
}
export function parseSourceListing(target: MonitorTarget, html: string): DiscoveredLink[] {
  if(!html.trim() || !/<(?:html|body|a)\b/i.test(html)) throw new Error('Unexpected empty or non-HTML source response');
  const isRis=target.key.startsWith('feldkirchen-ris-');
  const found=new Map<string,DiscoveredLink>();
  for(const a of hrefs(html)){
    const url=normalize(target,a.url);
    if(!url) continue;
    const path=new URL(url).pathname.toLowerCase();
    if(isRis){
      if(!/^\/(?:si|to|vo|do|getfile)\d+\.asp$/.test(path)) continue;
      // A document list is also a source of nested links; avoid treating it as a publication.
      if(path.endsWith('/do0040.asp')) continue;
    } else {
      if(!path.startsWith('/aktuelles/aktuelle-news/aktuelle-meldungen/')) continue;
      if(path.endsWith('/nachrichten-archiv')) continue;
    }
    const kind=isRis?classifyRis(url,a.title):'news';
    const externalId=isRis?url:'gemeinde:'+url;
    const fingerprint=createHash('sha256').update(a.title).digest('hex');
    found.set(externalId,{externalId,url,title:a.title,kind,fingerprint});
  }
  return [...found.values()];
}
export async function discoverSource(target: MonitorTarget, http: HttpGet): Promise<DiscoveredLink[]> {
  const response=await http(target.url);
  if(!response.ok) throw new Error('Source returned HTTP '+response.status);
  const html=await response.text();
  const items=parseSourceListing(target,html);
  if(items.length===0) throw new Error('No qualifying links: treat as incomplete, not as zero new publications');
  return items;
}
/** Recheck the original page: changes to the body need a different fingerprint than its listing title. */
export async function fingerprintDetail(url: string, http: HttpGet): Promise<string> {
  const response=await http(url);
  if(!response.ok) throw new Error('Detail returned HTTP '+response.status);
  const contentType=response.headers?.get('content-type')?.toLowerCase() ?? '';
  const path=new URL(url).pathname.toLowerCase();
  if(contentType.includes('pdf') || path.endsWith('/getfile.asp') || path.endsWith('.pdf')) {
    if(!response.arrayBuffer) throw new Error('PDF content requires binary-capable HTTP adapter');
    const bytes=new Uint8Array(await response.arrayBuffer());
    if(bytes.length<5 || String.fromCharCode(...bytes.slice(0,5)) !== '%PDF-') throw new Error('Unexpected PDF response');
    return createHash('sha256').update(bytes).digest('hex');
  }
  const html=await response.text();
  if(!html.trim() || !/<(?:html|body)\b/i.test(html)) throw new Error('Empty detail document');
  return createHash('sha256').update(clean(html)).digest('hex');
}
