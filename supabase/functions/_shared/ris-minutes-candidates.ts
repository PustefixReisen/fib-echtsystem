/**
 * Read-only RIS minutes extraction for an already identified TOP.
 * No content is persisted and a parsed passage is never a publishable decision.
 * All recognition is fail-closed; unclear results require human/source review.
 */
export type RisMinutesVote = {
  status:"accepted"|"rejected"|"no_vote"|"unknown";
  yes:number|null;
  no:number|null;
  abstention:number|null;
  originalLabel:string;
};
export type RisMinutesCandidate = {
  pointKey:string;
  sourcePassage:string;
  vote:RisMinutesVote;
  needsReview:true;
};
const votePattern = /Abstimmung:\s*([^\n\r]*?)(?=\s+Ja\s+\d+\s+Nein\s+\d+|\r?\n|$)(?:\s+Ja\s+(\d+)\s+Nein\s+(\d+))?/gi;
export function cleanMinutesPreviewText(input:string):string {
  return input.replace(/([\p{L}])-\s*\r?\n\s*([\p{L}])/gu,"$1$2")
    .replace(/\f/g,"\n")
    .replace(/^\s*Öffentliche Sitzung[^\n]*Seite\s+\d+\s*$/gim,"")
    .replace(/^\s*II\.\s*Beschluss\s*$/gim,"")
    .replace(/\r/g,"")
    .replace(/\n[ \t]+/g,"\n")
    .replace(/\n{3,}/g,"\n\n").trim();
}
function vote(label:string, yes?:string,no?:string):RisMinutesVote {
  const term=label.toLocaleLowerCase("de-DE");
  const status=term.includes("abgelehnt") ? "rejected"
    : term.includes("angenommen") ? "accepted"
    : /abgesetzt|verzicht|zurückgezogen/.test(term) ? "no_vote"
    : "unknown";
  return {status,yes:yes===undefined?null:Number(yes),no:no===undefined?null:Number(no),
    abstention:null,originalLabel:label.trim()};
}
export function extractRisMinutesCandidates(topMinutesText:string):RisMinutesCandidate[] {
  const normalized=cleanMinutesPreviewText(topMinutesText);
  if(!normalized) return [];
  const matches=[...normalized.matchAll(votePattern)];
  if(!matches.length) return [];
  let pos=0;
  return matches.map((m,i)=>{
    const raw=normalized.slice(pos,m.index).trim();
    pos=(m.index??0)+m[0].length;
    const trimmed=raw.replace(/^\s*(\d+)\.\s*/,"").trim();
    const pointKey=raw.match(/^\s*(\d+)\./)?.[1] ?? String(i+1);
    return {pointKey,sourcePassage:trimmed,
      vote:vote(m[1]??"",m[2],m[3]),needsReview:true as const};
  }).filter(c=>c.sourcePassage.length>0);
}
/** Never assume model output is complete or trustworthy. */
export function validateRisFactualDraft(
  candidates:RisMinutesCandidate[],
  drafts:Array<{pointKey:string;factualText:string;vote:RisMinutesVote}>,
):{ok:boolean;reasons:string[]} {
  const reasons:string[]=[];
  if(candidates.length===0 || candidates.length!==drafts.length) reasons.push("candidate_count_mismatch");
  const seen=new Set<string>();
  for(const c of candidates){
    const d=drafts.find(x=>x.pointKey===c.pointKey);
    if(!d || seen.has(c.pointKey)){reasons.push("missing_or_duplicate_point");continue;}
    seen.add(c.pointKey);
    if(d.factualText.trim().length<30) reasons.push("factual_text_too_short");
    if(d.vote.status!==c.vote.status || d.vote.yes!==c.vote.yes ||
       d.vote.no!==c.vote.no || d.vote.abstention!==c.vote.abstention) reasons.push("vote_changed");
  }
  return {ok:reasons.length===0,reasons};
}

/** Split one temporarily extracted minutes document by its official TOP headings.
 * Do not accept missing/duplicate/out-of-order headings: that would silently
 * assign one TOP's decision to another. Caller is responsible for source trust.
 * The complete text never needs to be persisted.
 */
export function splitRisMinutesByAgenda(
  text:string, expectedNumbers:readonly number[],
):{ok:boolean;sections:Array<{topNumber:number;transientText:string}>;issues:string[]} {
  if(!text||text.length>500_000||expectedNumbers.length===0||
     new Set(expectedNumbers).size!==expectedNumbers.length)
    return {ok:false,sections:[],issues:["invalid_source_or_reference"]};
  const lines=text.replace(/\r/g,"").split("\n");
  const headings:Array<{n:number;line:number}>=[];
  for(let i=0;i<lines.length;i++){
    const match=/^\s*(?:TOP|Tagesordnungspunkt)\s*(\d{1,3})(?=[\s.:]|$)/i.exec(lines[i]);
    if(match)headings.push({n:Number(match[1]),line:i});
  }
  const actual=headings.map(h=>h.n),issues:string[]=[];
  if(actual.length!==expectedNumbers.length)issues.push("top_count_mismatch");
  if(actual.length!==new Set(actual).size)issues.push("duplicate_top_heading");
  if(actual.some((n,i)=>n!==expectedNumbers[i]))issues.push("top_sequence_mismatch");
  if(issues.length)return {ok:false,sections:[],issues};
  return {ok:true,sections:headings.map((h,i)=>({
    topNumber:h.n,
    transientText:lines.slice(h.line+1,headings[i+1]?.line??lines.length).join("\n").trim(),
  })),issues:[]};
}
