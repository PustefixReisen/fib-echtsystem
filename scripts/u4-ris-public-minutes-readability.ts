/** Read-only public RIS minutes PDF readability check. No PDF or extracted text
 * is written, printed, uploaded, persisted or included in CI artifacts.
 * Metadata-only diagnostics for the human-reviewed factual drafting pipeline.
 */
import {extractText} from "unpdf";
import {splitRisMinutesByAgenda,extractRisMinutesCandidates} from "../supabase/functions/_shared/ris-minutes-candidates.ts";
const endpoints=[
  "https://buergerinfo-feldkirchen.digitalfabrix.de/getfile.asp?id=75785&type=do&smcmode=32832",
  "https://buergerinfo-feldkirchen.digitalfabrix.de/getfile.asp?id=75785",
];
async function run(){
  let lastError="";
  for(const url of endpoints){
    const c=new AbortController();const timeout=setTimeout(()=>c.abort(),15000);
    try{
      const resp=await fetch(url,{signal:c.signal,redirect:"follow",headers:{
        Accept:"application/pdf",
        "User-Agent":"FIB-U4-RIS-Pilot/0.1 (read-only PDF metadata check)",
      }});
      if(!resp.ok)throw Error("pdf_http_"+resp.status);
      const indicated=Number(resp.headers.get("content-length")||"0");
      if(indicated>12_000_000)throw Error("pdf_too_large");
      const data=new Uint8Array(await resp.arrayBuffer());
      if(data.length>12_000_000||data.length<8||
        new TextDecoder().decode(data.slice(0,5))!=="%PDF-")
        throw Error("pdf_missing_or_invalid_signature");
      const parsed=await extractText(data.slice(),{mergePages:true});
      const text=parsed.text||"";
      // No protected source text in logs; strictly structural presence flags.
      const lines=text.split(/\r?\n/);
      const topPrefixed=lines.map(line=>line.match(/^\s*(?:TOP|Tagesordnungspunkt)\s*(\d{1,2})(?:[.\s:]|$)/i)?.[1]).filter(Boolean);
      const numbered=lines.map(line=>line.match(/^\s*(\d{1,2})[.)]\s+\S/)?.[1]).filter(Boolean);
      const numLines=lines.filter(line=>/^\s*II[.)]?\s*Beschluss\b/i.test(line));
      const votes=(text.match(/Abstimmung\s*:/gi)||[]).length;
      console.log(JSON.stringify({scope:"real_1031_minutes_structure_metadata",
        totalLines:lines.length,prefixedTopHeadings:topPrefixed.length,
        prefixedTopNumbers:[...new Set(topPrefixed)],numberedLineCount:numbered.length,
        numberedUnique:[...new Set(numbered)],beschlussSectionHeaders:numLines.length,
        abstimmungLabels:votes,noExtractedTextOutput:true}));
      const expected=Array.from({length:19},(_,i)=>i+1);
      const split=splitRisMinutesByAgenda(text,expected);
      console.log(JSON.stringify({scope:"real_1031_minutes_section_split",
        valid:split.ok,issues:split.issues,sectionCount:split.sections.length,
        sectionNumbers:split.sections.map(v=>v.topNumber),
        noOriginalStorage:true,noExtractedTextOutput:true}));
      if(!split.ok)throw Error("real_minutes_top_segmentation_incomplete");
      const recognized=split.sections.map(s=>({
        top:s.topNumber, voteCount:extractRisMinutesCandidates(s.transientText).length,
      }));
      const parsedVoteCount=recognized.reduce((sum,s)=>sum+s.voteCount,0);
      console.log(JSON.stringify({scope:"real_1031_minutes_vote_coverage",
        sourceVoteLabels:votes,parsedVoteCount,perTop:recognized,
        fullVoteCoverage:parsedVoteCount===votes,
        noOriginalStorage:true,noExtractedTextOutput:true}));
      if(parsedVoteCount!==votes)throw Error("real_minutes_incomplete_vote_coverage");
      const section=(n:number)=>split.sections.find(s=>s.topNumber===n)?.transientText??"";
      const v2=extractRisMinutesCandidates(section(2));
      const v3=extractRisMinutesCandidates(section(3));
      const v6=extractRisMinutesCandidates(section(6));
      console.log(JSON.stringify({scope:"real_1031_minutes_reference_votes",
        top2:v2.map(v=>({status:v.vote.status,yes:v.vote.yes,no:v.vote.no})),
        top3:v3.map(v=>({status:v.vote.status,yes:v.vote.yes,no:v.vote.no})),
        top6:v6.map(v=>({status:v.vote.status,yes:v.vote.yes,no:v.vote.no})),
        noOriginalStorage:true,noExtractedTextOutput:true}));
      if(v2.length!==1||v2[0].vote.status!=="no_vote"||
         v3.length!==1||v3[0].vote.yes!==7||v3[0].vote.no!==13||
         v6.length!==2||v6[0].vote.yes!==17||v6[0].vote.no!==2||
         v6[1].vote.yes!==19||v6[1].vote.no!==0)throw Error("real_minutes_reference_votes_mismatch");
      const detectable=[/Hundewiese/i,/Parkanlage/i,/Rechenzentrum/i];
      console.log(JSON.stringify({
        scope:"real_1031_minutes_transient_readability",
        status:"accessible",pdfBytes:data.byteLength,
        extractedCharacters:text.length,
        expectedTopicMarkers:detectable.map((re,i)=>({top:[2,3,6][i],found:re.test(text)})),
        noOriginalStorage:true,noExtractedTextOutput:true,noDatabaseWrites:true,
      }));
      if(text.length<500)throw Error("pdf_extracted_text_too_short");
      return;
    }catch(e){lastError=String(e).slice(0,150);}
    finally{clearTimeout(timeout)}
  }
  console.error(JSON.stringify({scope:"real_1031_minutes_transient_readability",
    status:"unavailable",error:lastError,noDatabaseWrites:true}));
  process.exitCode=1;
}
void run().catch(e=>{console.error(String(e).slice(0,160));process.exitCode=1;});
