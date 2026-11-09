import { useState } from "react";
import { type SourceApi, type SourceApi as Api, withEventLock } from "./source-api.js";

type Source = {
  source_url: string;
  latest_version_id: string;
  status: string;
  kind: string;
};
type Props = {
  agendaId: string;
  eventId: string;
  source: Source;
  onReload: () => Promise<void>;
  api: SourceApi;
  eventLock: typeof withEventLock;
};

/** Explicit two-step human verification; never extracts or stores an original PDF. */
export function RisMinutesReview({ agendaId, eventId, source, onReload, api, eventLock }: Props) {
  const [pointKey,setPointKey] = useState("1");
  const [wording,setWording] = useState("");
  const [evidenceQuote,setEvidenceQuote] = useState("");
  const [result,setResult] = useState("unknown");
  const [yes,setYes] = useState("");
  const [no,setNo] = useState("");
  const [abstention,setAbstention] = useState("");
  const [usageRightsBasis,setUsageRightsBasis] = useState("");
  const [usageRightsEvidence,setUsageRightsEvidence] = useState("");
  const [verified,setVerified] = useState(false);
  const [pending,setPending] = useState("");
  const [rationale,setRationale] = useState("");
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [success,setSuccess] = useState("");
  const number = (s: string) => s.trim() === "" ? null : Number(s);
  const counts = [yes,no,abstention];
  const validCounts = counts.every((s) => s.trim() === "" ||
    (/^\d+$/.test(s.trim()) && Number.isSafeInteger(Number(s))));
  const sourceLink = source.source_url?.startsWith("https://buergerinfo-feldkirchen.digitalfabrix.de/");
  const complete = source.status === "confirmed" && Boolean(source.latest_version_id) &&
    sourceLink && verified && wording.trim() && evidenceQuote.includes(wording.trim()) &&
    pointKey.trim() && usageRightsBasis && usageRightsEvidence.trim().length >= 30 &&
    validCounts && (result !== "no_vote" || counts.every((x) => x.trim() === ""));
  async function propose() {
    if (!complete || pending) return;
    setBusy(true); setError(""); setSuccess("");
    try {
      const response = await api({
        action: "ris_suggest", origin: "editor", kind: "decision",
        agendaId, versionId:source.latest_version_id,
        payload: {
          pointKey:pointKey.trim(), eventId, wording:wording.trim(),
          evidenceQuote:evidenceQuote.trim(), result,
          yes:number(yes), no:number(no), abstention:number(abstention),
          manualSourceVerification:true,
          verifiedSourceUrl:source.source_url,
          usageRightsBasis, usageRightsEvidence:usageRightsEvidence.trim(),
        },
      });
      setPending(response.suggestionId);
      setSuccess("Entwurf gespeichert. Erst nach einer gesonderten Prüfung bestätigen.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Beschlussentwurf konnte nicht gespeichert werden.");
    } finally { setBusy(false); }
  }
  async function review(status: "confirmed" | "rejected") {
    if (!pending || !rationale.trim()) return;
    setBusy(true); setError(""); setSuccess("");
    try {
      await eventLock(eventId, () => api({
        action:"ris_review_suggestion", suggestionId:pending,
        status, rationale:rationale.trim(),
      }));
      setPending(""); setWording(""); setEvidenceQuote(""); setRationale("");
      setVerified(false); setUsageRightsEvidence(""); setUsageRightsBasis("");
      setYes(""); setNo(""); setAbstention("");
      setSuccess(status === "confirmed" ?
        "Beschluss und Abstimmung geprüft und übernommen." :
        "Beschlussentwurf verworfen.");
      await onReload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Prüfung konnte nicht abgeschlossen werden.");
    } finally { setBusy(false); }
  }
  return (
    <section className="panel card-headed" aria-label="Beschlusswortlaut redaktionell prüfen">
      <div className="section-heading"><h2>Beschluss aus Niederschrift erfassen</h2></div>
      <p className="meta">Nur für die aktuelle amtliche Niederschrift. Vollständigen Beschlusswortlaut
        einschließlich aller Beschlusspunkte getrennt erfassen. Zuerst Quelle, Wortlaut,
        Stimmen und Rechte prüfen; erst dann mit gesondertem Klick bestätigen.</p>
      <p><a href={source.source_url} target="_blank" rel="noopener noreferrer">
        Originalniederschrift im RIS öffnen ↗</a></p>
      {source.status !== "confirmed" && <p role="alert">Diese RIS-Dokumentfundstelle ist noch nicht bestätigt. Vorher keine Beschlussübernahme.</p>}
      <label>Beschlusspunkt
        <input value={pointKey} onChange={e=>setPointKey(e.target.value)} disabled={busy||!!pending} maxLength={200}/>
      </label>
      <label>Vollständiger protokollierter Beschlusswortlaut
        <textarea value={wording} onChange={e=>setWording(e.target.value)} disabled={busy||!!pending} maxLength={30000} />
      </label>
      <label>Prüfbeleg aus der Originalniederschrift (enthält Beschlusstext und Abstimmung)
        <textarea value={evidenceQuote} onChange={e=>setEvidenceQuote(e.target.value)} disabled={busy||!!pending} maxLength={30000}/>
      </label>
      <div className="button-row">
        <label>Ergebnis
          <select value={result} onChange={e=>setResult(e.target.value)} disabled={busy||!!pending}>
            <option value="unknown">Nicht angegeben</option>
            <option value="accepted">Angenommen</option>
            <option value="rejected">Abgelehnt</option>
            <option value="no_vote">Keine Abstimmung</option>
          </select>
        </label>
        <label>Ja-Stimmen<input inputMode="numeric" value={yes} onChange={e=>setYes(e.target.value)} disabled={busy||!!pending||result==="no_vote"}/></label>
        <label>Nein-Stimmen<input inputMode="numeric" value={no} onChange={e=>setNo(e.target.value)} disabled={busy||!!pending||result==="no_vote"}/></label>
        <label>Enthaltungen<input inputMode="numeric" value={abstention} onChange={e=>setAbstention(e.target.value)} disabled={busy||!!pending||result==="no_vote"}/></label>
      </div>
      <label>Rechtsgrundlage für die wörtliche Anzeige
        <select value={usageRightsBasis} onChange={e=>setUsageRightsBasis(e.target.value)} disabled={busy||!!pending}>
          <option value="">Noch nicht geklärt – keine Übernahme</option>
          <option value="official_work_5_urhg">§ 5 UrhG – dokumentiert geprüftes amtliches Werk</option>
          <option value="explicit_permission">Ausdrückliche Wiedergabeerlaubnis</option>
        </select>
      </label>
      <label>Konkreter Rechtsnachweis / Begründung (mindestens 30 Zeichen)
        <textarea value={usageRightsEvidence} onChange={e=>setUsageRightsEvidence(e.target.value)} disabled={busy||!!pending} maxLength={2000}/>
      </label>
      <label><input type="checkbox" checked={verified} disabled={busy||!!pending}
        onChange={e=>setVerified(e.target.checked)} style={{width:"auto",marginRight:8}}/>
        Ich habe Originalquelle, TOP-Zuordnung, vollständigen Wortlaut, Abstimmung
        und die dokumentierte Wiedergabeberechtigung persönlich geprüft.</label>
      {!pending ? <button type="button" disabled={busy||!complete} onClick={()=>void propose()}>
        Beschlussentwurf zur Prüfung speichern
      </button> : <>
        <p role="status">Entwurf wartet auf ausdrückliche redaktionelle Bestätigung.</p>
        <label>Prüfvermerk
          <textarea value={rationale} onChange={e=>setRationale(e.target.value)} maxLength={2000} disabled={busy}/>
        </label>
        <div className="button-row">
          <button type="button" disabled={busy||!rationale.trim()} onClick={()=>void review("confirmed")}>Beschluss und Abstimmung bestätigen</button>
          <button type="button" disabled={busy||!rationale.trim()} onClick={()=>void review("rejected")}>Entwurf verwerfen</button>
        </div>
      </>}
      {error && <p role="alert">{error}</p>}
      {success && <p role="status">{success}</p>}
    </section>
  );
}
