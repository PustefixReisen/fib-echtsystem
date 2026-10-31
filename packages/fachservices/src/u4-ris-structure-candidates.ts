import {extractRisAgendaRows} from './u4-ris-agenda-evidence.js';

// A cautious intermediate representation for editorial review.
// Not a stored Sitzung/TOP record, not an approved Fundstelle or an Ereignis.
export type RisStructureCandidate={
 sessionUrl:string;
 topNumber:string|null;
 proposalUrl:string;
 documentUrls:string[];
 relationEvidence:'same-html-row';
 decision:{status:'not_verified';decisionUrl:null};
 editorial:{fundstelle:'candidate';ereignis:'not_created';vorgang:'not_created';thema:'not_created'};
};
export function risStructureCandidates(html:string,sessionUrl:string):RisStructureCandidate[]{
 const path=new URL(sessionUrl);
 if(path.protocol!=='https:'||!/^\/si\d+\.asp$/i.test(path.pathname)||!path.searchParams.has('__ksinr'))
  throw new Error('not_ris_session_url');
 return extractRisAgendaRows(html,sessionUrl).map(row=>({
  sessionUrl,
  topNumber:row.topNumber??null,
  proposalUrl:row.proposalUrl,
  documentUrls:row.documentUrls,
  relationEvidence:row.evidence,
  decision:{status:'not_verified',decisionUrl:null},
  editorial:{fundstelle:'candidate',ereignis:'not_created',vorgang:'not_created',thema:'not_created'}
 }));
}
