import type { DiscoveredLink } from './u4-source-discovery.js';

export type RisLinkEvidence = {
  parentUrl: string;
  childUrl: string;
  relation: 'session-proposal' | 'session-document' | 'proposal-document';
  certainty: 'page-link-only';
};

/** An outgoing page link proves navigation, not a TOP assignment or voting result. */
export function collectRisPageEvidence(pageUrl:string, links:readonly DiscoveredLink[]):RisLinkEvidence[] {
  const pathname=new URL(pageUrl).pathname.toLowerCase();
  const session=pathname.startsWith('/si');
  const proposal=pathname.startsWith('/vo');
  if(!session && !proposal) return [];
  return links.flatMap(link=>{
    if(session && link.kind==='proposal') return [{parentUrl:pageUrl,childUrl:link.url,relation:'session-proposal' as const,certainty:'page-link-only' as const}];
    if(session && link.kind==='attachment') return [{parentUrl:pageUrl,childUrl:link.url,relation:'session-document' as const,certainty:'page-link-only' as const}];
    if(proposal && link.kind==='attachment') return [{parentUrl:pageUrl,childUrl:link.url,relation:'proposal-document' as const,certainty:'page-link-only' as const}];
    return [];
  });
}
