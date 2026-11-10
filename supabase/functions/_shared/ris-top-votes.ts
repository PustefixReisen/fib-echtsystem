import {splitRisMinutesByAgenda,extractRisMinutesCandidates} from "./ris-minutes-candidates.ts";
import type {RisSql} from "./ris-structure.ts";

/** Only factual status/counts are persisted, never original minutes wording. */
export async function persistRisTopVotes(
  tx:RisSql, sessionId:string, sourceDocumentUrl:string,
  sourceSha256:string, extractedMinutes:string, observedAt:string,
):Promise<{topCount:number;voteCount:number}>{
  if(!/^[a-f0-9]{64}$/.test(sourceSha256)||
     !/^https:\/\/buergerinfo-feldkirchen\.digitalfabrix\.de\/getfile\.asp\?/.test(sourceDocumentUrl))
    throw Error("ris_unverified_minutes_source");
  const agenda=await tx.unsafe(
    "select id,number from fib.ris_agenda_items where session_id=$1 order by number::integer for update",
    [sessionId],
  );
  if(!agenda.length)throw Error("ris_minutes_agenda_missing");
  const numbers=agenda.map(a=>Number(a.number));
  if(numbers.some((n,i)=>!Number.isSafeInteger(n)||(i>0&&n!==numbers[i-1]+1)))
    throw Error("ris_minutes_agenda_unordered");
  const split=splitRisMinutesByAgenda(extractedMinutes,numbers);
  if(!split.ok)throw Error("ris_minutes_top_segmentation_"+split.issues.join("_"));
  const labels=(extractedMinutes.match(/Abstimmung\s*:/gi)??[]).length;
  let votes=0;
  const parsed=split.sections.map((sec,i)=>{
    const candidates=extractRisMinutesCandidates(sec.transientText);
    votes+=candidates.length;
    return {agendaId:agenda[i].id,candidates};
  });
  if(votes!==labels)throw Error("ris_minutes_vote_incomplete");
  // All source values are checked before the first write. A changed PDF replaces
  // only source-derived vote metadata in this same DB transaction.
  for(const item of parsed){
    await tx.unsafe("delete from fib.ris_top_vote_results where agenda_id=$1",[item.agendaId]);
    for(let i=0;i<item.candidates.length;i++){
      const v=item.candidates[i].vote;
      await tx.unsafe(
        `insert into fib.ris_top_vote_results
          (agenda_id,vote_index,result,yes_count,no_count,abstention_count,
           source_document_url,source_sha256,observed_at)
         values($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [item.agendaId,i+1,v.status,v.yes,v.no,v.abstention,
         sourceDocumentUrl,sourceSha256,observedAt],
      );
    }
  }
  return {topCount:parsed.length,voteCount:votes};
}
