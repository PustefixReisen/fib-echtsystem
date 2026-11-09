import {
  extractRisMinutesCandidates, validateRisFactualDraft,
  type RisMinutesCandidate, type RisMinutesVote,
} from "./ris-minutes-candidates.ts";

/**
 * Model/provider-independent drafting contract. Raw source passages are held
 * in the invocation only. Nothing is written to FIB, its audit log or storage.
 * Never treat a model assertion of completeness as independent evidence.
 */
export type RisMinutesDraftInput = {
  pointKey:string;
  sourcePassage:string;
  vote:RisMinutesVote;
};
export type RisMinutesDraftOutput = {
  pointKey:string;
  factualText:string;
  vote:RisMinutesVote;
};
export type RisMinutesDraftProvider = (
  input:RisMinutesDraftInput[],
  instruction:string,
)=>Promise<RisMinutesDraftOutput[]>;
export type RisMinutesDraftResult = {
  status:"review_required"|"unavailable"|"rejected";
  drafts:RisMinutesDraftOutput[];
  reasons:string[];
};
/** No service key or provider implementation is configured by this module. */
export const RIS_COMPLETE_FACTUAL_INSTRUCTION =
  "Erstelle für jeden nummerierten Beschlusspunkt eine eigenständig formulierte, " +
  "inhaltlich vollständige Wiedergabe in deutscher Sprache. Übernimm alle " +
  "räumlichen Festlegungen, wesentlichen Vorgaben, Aufträge, Bedingungen, " +
  "Kostenverteilungen, Zuständigkeiten und Fristen, falls sie im Original stehen. " +
  "Füge nichts hinzu. Behalte Reihenfolge und Anzahl der Beschlusspunkte bei. " +
  "Ändere weder Ergebnis noch Ja-/Nein-/Enthaltungszahlen. " +
  "Setze bei unklarer Bedeutung keine erfundene Aussage ein, sondern melde " +
  "das Problem zur redaktionellen Klärung. Kein wörtliches Kopieren. " +
  "Die Ergebnisse sind ausschließlich ungeprüfte redaktionelle Entwürfe.";

export async function generateRisFactualReviewDraft(
  topMinutesText:string,
  provider?:RisMinutesDraftProvider,
):Promise<RisMinutesDraftResult> {
  const candidates:RisMinutesCandidate[] = extractRisMinutesCandidates(topMinutesText);
  if(!candidates.length)
    return {status:"unavailable",drafts:[],reasons:["no_structured_vote_evidence"]};
  if(!provider)
    return {status:"unavailable",drafts:[],reasons:["draft_provider_not_configured"]};
  try{
    const drafts=await provider(candidates.map(x=>({
      pointKey:x.pointKey,sourcePassage:x.sourcePassage,vote:x.vote,
    })),RIS_COMPLETE_FACTUAL_INSTRUCTION);
    const validated=validateRisFactualDraft(candidates,drafts);
    if(!validated.ok) return {status:"rejected",drafts:[],reasons:validated.reasons};
    // A syntactically valid AI draft is still neither factually verified nor authorized.
    return {status:"review_required",drafts,reasons:["human_content_review_required"]};
  }catch{
    return {status:"unavailable",drafts:[],reasons:["draft_provider_failed"]};
  }
}
