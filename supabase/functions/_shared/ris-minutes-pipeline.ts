import {splitRisMinutesByAgenda} from "./ris-minutes-candidates.ts";
import {
  generateRisFactualReviewDraft,
  type RisMinutesDraftProvider,
  type RisMinutesDraftResult,
} from "./ris-minutes-draft.ts";

/** No raw PDF or extracted minutes content is returned, logged, or persisted. */
export type RisSessionDraftReview = {
  sessionId:string;
  sourceDocumentId:string;
  status:"review_required"|"unavailable"|"rejected";
  topResults:Array<{topNumber:number;result:RisMinutesDraftResult}>;
  reasons:string[];
};

type PdfTextExtractor=(bytes:Uint8Array)=>Promise<string>;
const officialHost="buergerinfo-feldkirchen.digitalfabrix.de";

/** This is an opt-in, no-write in-memory orchestrator, NOT an HTTP handler. */
export async function prepareRisMinutesSessionDrafts(
  opts:{
    sessionId:string;
    sourceDocumentId:string;
    sourceUrl:string;
    expectedNumbers:number[];
    /** Optional editorial focus: only one TOP is ever sent to the paid provider. */
    selectedTopNumber?:number;
    /** A configured, separately approved provider. Undefined means no disclosure. */
    provider?:RisMinutesDraftProvider;
  },
  transport:typeof fetch=fetch,
  extractor:PdfTextExtractor,
):Promise<RisSessionDraftReview>{
  const unavailable=(reason:string):RisSessionDraftReview=>({
    sessionId:opts.sessionId,sourceDocumentId:opts.sourceDocumentId,
    status:"unavailable",topResults:[],reasons:[reason],
  });
  const u=new URL(opts.sourceUrl);
  if(u.protocol!=="https:" || u.hostname!==officialHost ||u.port||
     u.pathname!=="/getfile.asp" ||
     u.searchParams.get("id")!==opts.sourceDocumentId ||
     !/^\d{1,12}$/.test(opts.sourceDocumentId))
    return unavailable("unapproved_ris_document_url");
  if(opts.expectedNumbers.length<1 ||opts.expectedNumbers.length>150 ||
     new Set(opts.expectedNumbers).size!==opts.expectedNumbers.length)
    return unavailable("invalid_expected_agenda");
  if(!opts.provider)return unavailable("draft_provider_not_configured");
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),15000);
  try{
    const response=await transport(opts.sourceUrl,{
      signal:controller.signal,redirect:"error",
      headers:{accept:"application/pdf"},
    });
    if(!response.ok)return unavailable("ris_pdf_http_"+response.status);
    const length=Number(response.headers.get("content-length")||"0");
    if(length>12_000_000)return unavailable("ris_pdf_size_limit");
    const bytes=new Uint8Array(await response.arrayBuffer());
    if(bytes.length<8||bytes.length>12_000_000||
       new TextDecoder().decode(bytes.subarray(0,5))!=="%PDF-")
      return unavailable("ris_pdf_invalid");
    const raw=await extractor(bytes);
    if(raw.length<100||raw.length>500_000)return unavailable("ris_pdf_text_invalid");
    const split=splitRisMinutesByAgenda(raw,opts.expectedNumbers);
    if(!split.ok)return unavailable("ris_top_segmentation_"+split.issues.join("_"));
    if(opts.selectedTopNumber!==undefined &&
       !opts.expectedNumbers.includes(opts.selectedTopNumber))
      return unavailable("selected_top_not_in_agenda");
    const selected=opts.selectedTopNumber===undefined?split.sections:
      split.sections.filter(x=>x.topNumber===opts.selectedTopNumber);
    const topResults:Array<{topNumber:number;result:RisMinutesDraftResult}>=[];
    for(const sec of selected){
      // No paid model call when a TOP has no vote evidence. This also
      // prevents submitting unrelated meeting discussion to a provider.
      if(!/Abstimmung\s*:/i.test(sec.transientText)){
        topResults.push({topNumber:sec.topNumber,result:{
          status:"unavailable",drafts:[],reasons:["no_structured_vote_evidence"],
        }});
        continue;
      }
      const result=await generateRisFactualReviewDraft(sec.transientText,opts.provider);
      topResults.push({topNumber:sec.topNumber,result});
    }
    const status=topResults.some(x=>x.result.status==="rejected")?"rejected"
      :topResults.some(x=>x.result.status==="unavailable")?"unavailable"
      :"review_required";
    return {sessionId:opts.sessionId,sourceDocumentId:opts.sourceDocumentId,
      status,topResults,reasons:status==="review_required"?
        ["human_content_review_required"]:["some_tops_require_manual_review"]};
  }catch{
    return unavailable("ris_pdf_or_draft_processing_failed");
  }finally{clearTimeout(timer)}
}
