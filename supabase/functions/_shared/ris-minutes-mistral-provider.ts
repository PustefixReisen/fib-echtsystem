import {
  type RisMinutesDraftProvider, type RisMinutesDraftInput,
  type RisMinutesDraftOutput,
} from "./ris-minutes-draft.ts";

/**
 * Opt-in, stateless Mistral chat completions adapter. No arbitrary endpoints,
 * network calls or provider charges without an explicit key and activation
 * at the call site. Source text stays in the request/response memory only.
 * A successful response remains an UNVERIFIED human-review draft.
 */
export function createMistralRisDraftProvider(
  config:{apiKey:string;model:string;enabled:boolean},
  request:typeof fetch = fetch,
):RisMinutesDraftProvider {
  if(!config.enabled) throw Error("ris_draft_provider_not_approved");
  if(!config.apiKey?.trim()) throw Error("ris_draft_provider_key_missing");
  if(!/^[a-z0-9][a-z0-9._-]{1,75}$/i.test(config.model))
    throw Error("ris_draft_invalid_model");
  return async function provider(
    candidates:RisMinutesDraftInput[], instruction:string,
  ):Promise<RisMinutesDraftOutput[]> {
    if(!candidates.length || candidates.length>30 ||
       candidates.some(x=>x.sourcePassage.length>25000))
      throw Error("ris_draft_request_limits");
    const body=JSON.stringify({
      model:config.model,
      temperature:0.1,
      max_tokens:6000,
      stream:false,
      response_format:{type:"json_object"},
      messages:[
        {role:"system",content:instruction+" Antworte nur in JSON mit dem Objektfeld drafts. "+
          "Jeder Eintrag: pointKey (string), factualText (string), vote (unverändertes Objekt)."},
        {role:"user",content:JSON.stringify({draftsToPrepare:candidates})},
      ],
    });
    if(body.length>150_000)throw Error("ris_draft_request_limits");
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),30000);
    try{
      const response=await request("https://api.mistral.ai/v1/chat/completions",{
        method:"POST",signal:controller.signal,
        headers:{"Authorization":"Bearer "+config.apiKey,
          "Content-Type":"application/json"},
        body,
      });
      if(!response.ok)throw Error("ris_draft_provider_http_"+response.status);
      const content=await response.text();
      if(content.length>120_000)throw Error("ris_draft_response_too_large");
      const result=JSON.parse(content) as {
        choices?:Array<{finish_reason?:string;message?:{content?:unknown}}>;
      };
      if(result.choices?.length!==1||
         result.choices[0].finish_reason!=="stop" ||
         typeof result.choices[0].message?.content!=="string")
        throw Error("ris_draft_provider_incomplete");
      const parsed=JSON.parse(result.choices[0].message.content) as {drafts?:unknown};
      if(!Array.isArray(parsed.drafts) ||parsed.drafts.length!==candidates.length)
        throw Error("ris_draft_provider_output_mismatch");
      const drafts=parsed.drafts as RisMinutesDraftOutput[];
      if(drafts.some(d=>typeof d.pointKey!=="string" ||
         typeof d.factualText!=="string" ||d.factualText.length>12000||
         !d.vote || typeof d.vote!=="object"))
        throw Error("ris_draft_provider_output_invalid");
      return drafts;
    } finally {
      clearTimeout(timer);
    }
  };
}
