import { useEffect, useState } from "react";
import { type SourceApi, withEventLock } from "./source-api.js";

type Source = { source_url:string; latest_version_id:string; status:string; kind:string };
type Prepared = {
  pointKey:string;factualText:string;
  vote:{status:string;yes:number|null;no:number|null;abstention:number|null};
};
type Props = {
  agendaId:string; eventId:string; source:Source; onReload:()=>Promise<void>;
  api:SourceApi; eventLock:typeof withEventLock;
  /** Only the static, DB-free preview supplies example copy. */
  initialText?:string;
};
/** Content-complete, independently worded decision review; original documents remain external. */
export function RisMinutesReview({agendaId,eventId,source,onReload,api,eventLock,initialText=""}:Props) {
  const [pointKey,setPointKey] = useState("1");
  const [content,setContent] = useState(initialText);
  const [result,setResult] = useState("unknown");
  const [yes,setYes] = useState("");
  const [no,setNo] = useState("");
  const [abstention,setAbstention] = useState("");
  const [verified,setVerified] = useState(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [success,setSuccess] = useState("");
  const [pending,setPending] = useState("");
  const [preparedDrafts,setPreparedDrafts] = useState<Prepared[]>([]);
  const [selectedDraft,setSelectedDraft] = useState(0);
  // Navigating to another TOP or source version must never carry over
  // an earlier AI draft, vote result or pending confirmation.
  useEffect(()=>{
    setPointKey("1");setContent(initialText);setResult("unknown");
    setYes("");setNo("");setAbstention("");setVerified(false);
    setPending("");setPreparedDrafts([]);setSelectedDraft(0);
    setError("");setSuccess("");
  },[agendaId,source.latest_version_id,initialText]);

  function applyDraft(draft:Prepared,index:number) {
    setSelectedDraft(index);
    setPointKey(String(draft.pointKey));setContent(draft.factualText);
    setResult(draft.vote.status);
    setYes(draft.vote.yes==null?"":String(draft.vote.yes));
    setNo(draft.vote.no==null?"":String(draft.vote.no));
    setAbstention(draft.vote.abstention==null?"":String(draft.vote.abstention));
    setVerified(false);
  }
  const number = (v:string) => v.trim() === "" ? null : Number(v);
  const counts = [yes,no,abstention];
  const validCounts = counts.every(v => v.trim() === "" ||
    (/^\d+$/.test(v.trim()) && Number.isSafeInteger(Number(v))));
  const complete = source.kind === "minutes" && source.status === "confirmed" &&
    source.source_url.startsWith("https://buergerinfo-feldkirchen.digitalfabrix.de/") &&
    source.latest_version_id && pointKey.trim() && content.trim().length >= 20 &&
    verified && validCounts && (result !== "no_vote" || counts.every(v => !v.trim()));
  async function prepareAutomaticDraft() {
    if (busy || pending || source.status !== "confirmed" || !source.latest_version_id) return;
    setBusy(true);setError("");setSuccess("");
    try {
      const r = await api({
        action:"ris_prepare_minutes_draft",
        agendaId,versionId:source.latest_version_id,
      });
      if (r.status !== "review_required" || !Array.isArray(r.drafts) ||
          r.drafts.length < 1)
        throw Error("Für diesen TOP konnte noch kein prüffähiger KI-Entwurf erstellt werden.");
      const drafts=r.drafts as Prepared[];
      if(drafts.some(d=>!d ||typeof d.pointKey!=="string" ||
        typeof d.factualText!=="string" ||!d.vote))
        throw Error("Unvollständiger KI-Entwurf.");
      setPreparedDrafts(drafts);applyDraft(drafts[0],0);
      setSuccess(r.drafts.length>1
        ? "KI-Entwurf vorbereitet. Mehrere Beschlusspunkte erkannt – bitte alle einzeln prüfen."
        : "KI-Entwurf vorbereitet. Inhalt und Abstimmung bitte anhand der Niederschrift prüfen.");
    }catch(e){
      setError(e instanceof Error?e.message:"Automatischer Entwurf ist noch nicht verfügbar.");
    }finally{setBusy(false);}
  }
  async function submit() {
    if (!complete || pending || busy) return;
    setBusy(true);setError("");setSuccess("");
    try {
      const r = await api({
        action:"ris_suggest",kind:"decision",origin:"editor",
        agendaId,versionId:source.latest_version_id,
        payload:{
          eventId,pointKey:pointKey.trim(),wording:content.trim(),evidenceQuote:"",
          representation:"complete_factual",manualSourceVerification:true,
          verifiedSourceUrl:source.source_url,result,
          yes:number(yes),no:number(no),abstention:number(abstention),
        },
      });
      setPending(r.suggestionId);
      setSuccess("Entwurf vorgemerkt. Noch nicht freigegeben.");
    } catch(e) {
      setError(e instanceof Error ? e.message : "Entwurf konnte nicht gespeichert werden.");
    } finally {setBusy(false);}
  }
  async function review(status:"confirmed"|"rejected") {
    if(!pending || busy)return;
    setBusy(true);setError("");setSuccess("");
    try {
      await eventLock(eventId,()=>api({
        action:"ris_review_suggestion",suggestionId:pending,status,
        rationale:"Beschlussinhalt und Abstimmung mit der amtlichen Niederschrift abgeglichen",
      }));
      setPending("");setVerified(false);
      setSuccess(status==="confirmed"?"Beschlussinhalt und Abstimmung bestätigt.":"Entwurf verworfen.");
      if(status==="confirmed"){setContent("");setYes("");setNo("");setAbstention("");}
      await onReload();
    } catch(e){
      setError(e instanceof Error ? e.message : "Bestätigung fehlgeschlagen.");
    } finally {setBusy(false);}
  }
  return <section className="panel card-headed" aria-label="Beschlussinhalt redaktionell prüfen">
    <div className="section-heading"><h2>Beschluss prüfen</h2></div>
    <p className="meta">FIB bereitet die vollständige sachliche Darstellung vor.
      Sie soll alle Entscheidungen, Aufträge, Bedingungen, Kosten und sonstigen
      wesentlichen Punkte enthalten, aber keine wörtliche Kopie sein.
      Pro Beschlusspunkt prüfen und bestätigen.</p>
    <p><a href={source.source_url} target="_blank" rel="noopener noreferrer">
      Originalniederschrift zum Vergleich öffnen ↗</a></p>
    {source.status!=="confirmed" && <p role="alert">Niederschrift noch nicht als Quelle bestätigt.</p>}
    <button type="button" disabled={busy||!!pending||source.status!=="confirmed"}
      onClick={()=>void prepareAutomaticDraft()}>KI-Entwurf vorbereiten</button>

    {preparedDrafts.length>1 && <label>Automatisch vorbereitete Beschlusspunkte
      <select aria-label="Automatisch vorbereiteten Beschlusspunkt auswählen"
        disabled={busy||!!pending} value={selectedDraft}
        onChange={e=>applyDraft(preparedDrafts[Number(e.target.value)],Number(e.target.value))}>
        {preparedDrafts.map((draft,i)=><option key={i} value={i}>
          Beschlusspunkt {draft.pointKey}</option>)}
      </select>
    </label>}
    <label>Beschlusspunkt
      <input value={pointKey} maxLength={200} disabled={!!pending||busy}
        onChange={e=>setPointKey(e.target.value)}/>
    </label>
    <label>Beschlussinhalt – vollständig, aber eigenständig formuliert
      <textarea value={content} maxLength={30000} disabled={!!pending||busy}
        onChange={e=>{setContent(e.target.value);setVerified(false);}}/>
    </label>
    <div className="button-row">
      <label>Abstimmung
        <select value={result} disabled={!!pending||busy}
          onChange={e=>{setResult(e.target.value);setVerified(false);}}>
          <option value="unknown">Nicht angegeben</option>
          <option value="accepted">Angenommen</option>
          <option value="rejected">Abgelehnt</option>
          <option value="no_vote">Keine Abstimmung</option>
        </select>
      </label>
      <label>Ja<input inputMode="numeric" value={yes} disabled={busy||!!pending||result==="no_vote"}
        onChange={e=>{setYes(e.target.value);setVerified(false);}}/></label>
      <label>Nein<input inputMode="numeric" value={no} disabled={busy||!!pending||result==="no_vote"}
        onChange={e=>{setNo(e.target.value);setVerified(false);}}/></label>
      <label>Enthaltungen<input inputMode="numeric" value={abstention} disabled={busy||!!pending||result==="no_vote"}
        onChange={e=>{setAbstention(e.target.value);setVerified(false);}}/></label>
    </div>
    <label><span><input type="checkbox" style={{width:"auto",marginRight:8}}
      checked={verified} disabled={busy||!!pending} onChange={e=>setVerified(e.target.checked)}/>
      Inhalt vollständig und sachlich richtig; Abstimmung anhand der Originalquelle geprüft.</span></label>
    {!pending
      ? <button type="button" disabled={busy||!complete} onClick={()=>void submit()}>
          Geprüften Entwurf vormerken
        </button>
      : <div className="button-row">
          <button type="button" disabled={busy} onClick={()=>void review("confirmed")}>Beschluss bestätigen</button>
          <button type="button" disabled={busy} onClick={()=>void review("rejected")}>Entwurf verwerfen</button>
        </div>}
    {error && <p role="alert">{error}</p>}
    {success && <p role="status">{success}</p>}
  </section>;
}
