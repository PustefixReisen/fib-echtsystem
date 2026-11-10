import {splitRisMinutesByAgenda} from "./ris-minutes-candidates.ts";
import {risUrl, type RisSql} from "./ris-structure.ts";

export class RisVoteSourceError extends Error {}

export function parseRisTopVotes(text: string, numbers: readonly number[]) {
  const split = splitRisMinutesByAgenda(text, numbers);
  if (!split.ok) throw new RisVoteSourceError("ris_minutes_" + split.issues.join("_"));

  return split.sections.map(({topNumber, transientText}) => {
    const lines = [...transientText.matchAll(/^[ \t]*Abstimmung[ \t]*:[ \t]*([^\r\n]*)/gim)];
    if (lines.length !== (transientText.match(/\bAbstimmung\s*:/gi) ?? []).length || lines.length > 100) {
      throw new RisVoteSourceError("ris_minutes_vote_incomplete");
    }
    const votes = lines.map(([, line]) => {
      if (/^(?:abgesetzt|zurückgezogen|keine abstimmung)$/i.test(line.trim())) {
        return {result: "no_vote", yes: null, no: null, abstention: null};
      }
      const match = /^(?:(?:einstimmig|mehrheitlich)\s+)?(angenommen|abgelehnt)\s+Ja\s+(\d+)\s+Nein\s+(\d+)(?:\s+Enthaltungen?\s+(\d+))?$/i.exec(line.trim());
      if (!match) throw new RisVoteSourceError("ris_minutes_vote_incomplete");
      const [, result, yes, no, abstention] = match;
      const counts = [Number(yes), Number(no), abstention === undefined ? null : Number(abstention)];
      if (counts.some(count => count !== null && (!Number.isSafeInteger(count) || count > 2147483647))) {
        throw new RisVoteSourceError("ris_minutes_vote_incomplete");
      }
      return {
        result: result.toLowerCase() === "angenommen" ? "accepted" : "rejected",
        yes: counts[0], no: counts[1], abstention: counts[2],
      };
    });
    return {topNumber, votes};
  });
}

/** Only source-derived status and counts are persisted. The caller owns the transaction. */
export async function persistRisTopVotes(
  tx: RisSql, sessionId: string, sourceDocumentUrl: string,
  sourceSha256: string, extractedMinutes: string, observedAt: string,
) {
  if (!/^[a-f0-9]{64}$/.test(sourceSha256) || risUrl(sourceDocumentUrl) !== sourceDocumentUrl ||
      new URL(sourceDocumentUrl).pathname !== "/getfile.asp") {
    throw new RisVoteSourceError("ris_unverified_minutes_source");
  }
  const agenda = await tx.unsafe(
    "select id,number from fib.ris_agenda_items where session_id=$1 order by number::integer for update",
    [sessionId],
  );
  const numbers = agenda.map(a => Number(a.number));
  if (numbers.some((number, index) => !Number.isSafeInteger(number) || number < 1 ||
      (index > 0 && number <= numbers[index - 1]))) {
    throw new RisVoteSourceError("ris_minutes_agenda_unordered");
  }
  const parsed = parseRisTopVotes(extractedMinutes, numbers);
  let voteCount = 0;
  for (const [index, {votes}] of parsed.entries()) {
    const agendaId = agenda[index].id;
    for (const [position, vote] of votes.entries()) {
      await tx.unsafe(
        `insert into fib.ris_top_vote_results as previous
          (agenda_id,vote_index,result,yes_count,no_count,abstention_count,
           source_document_url,source_sha256,observed_at)
         values($1,$2,$3,$4,$5,$6,$7,$8,$9)
         on conflict(agenda_id,vote_index) do update set
           result=excluded.result,yes_count=excluded.yes_count,no_count=excluded.no_count,
           abstention_count=excluded.abstention_count,source_document_url=excluded.source_document_url,
           source_sha256=excluded.source_sha256,observed_at=excluded.observed_at
         where (previous.result,previous.yes_count,previous.no_count,previous.abstention_count,
                previous.source_document_url,previous.source_sha256) is distinct from
               (excluded.result,excluded.yes_count,excluded.no_count,excluded.abstention_count,
                excluded.source_document_url,excluded.source_sha256)`,
        [agendaId, position + 1, vote.result, vote.yes, vote.no, vote.abstention,
         sourceDocumentUrl, sourceSha256, observedAt],
      );
    }
    await tx.unsafe(
      "delete from fib.ris_top_vote_results where agenda_id=$1 and vote_index>$2",
      [agendaId, votes.length],
    );
    voteCount += votes.length;
  }
  return {topCount: parsed.length, voteCount};
}
