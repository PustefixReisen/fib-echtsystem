import { useState } from "react";
import { sourceApi, withEventLock } from "./source-api.js";

type Row = Record<string, any>;
type Props = {
  data: Row;
  busy: boolean;
  onOpenEvent: (id: string) => void;
  onOpenDocument: (versionId: string) => void;
  onReload: () => Promise<void>;
};
const displayDate = (value: unknown) =>
  value ? new Date(String(value)).toLocaleDateString("de-DE") : "";
const sortAgenda = (a: Row, b: Row) =>
  String(a.number ?? "").localeCompare(String(b.number ?? ""), "de", { numeric: true });

function ExternalLink({ url, children }: { url?: string | null; children: string }) {
  return url && /^https:\/\//i.test(url)
    ? <a href={url} target="_blank" rel="noopener noreferrer">{children} ↗</a>
    : null;
}

/** RIS is an official read-only source. Only editorial event associations belong to FIB. */
export function RisSessionView({ data, busy, onOpenEvent, onOpenDocument, onReload }: Props) {
  const [showEventSearch, setShowEventSearch] = useState(false);
  const [eventSearch, setEventSearch] = useState("");
  const [eventOptions, setEventOptions] = useState<Row[]>([]);
  const [chosenEvent, setChosenEvent] = useState("");
  const [eventRole, setEventRole] = useState("treatment");
  const [reason, setReason] = useState("");
  const [eventError, setEventError] = useState("");
  const [eventBusy, setEventBusy] = useState(false);
  async function searchEvents() {
    setEventError("");
    setEventBusy(true);
    try { const result = await sourceApi({ action: "source_choices", search: eventSearch }); setEventOptions(result.events ?? []); }
    catch (error) { setEventError(error instanceof Error ? error.message : "Suche fehlgeschlagen."); }
    finally { setEventBusy(false); }
  }
  async function linkEvent() {
    if (!selectedTopId || !chosenEvent || !reason.trim()) return;
    setEventError("");
    setEventBusy(true);
    try {
      await withEventLock(chosenEvent, () => sourceApi({action: "ris_link_event", agendaId: selectedTopId, eventId: chosenEvent, role: eventRole, rationale: reason.trim()}));
      await onReload();
      setShowEventSearch(false);
      setReason("");
    } catch (error) { setEventError(error instanceof Error ? error.message : "Zuordnung fehlgeschlagen."); }
    finally { setEventBusy(false); }
  }
  const [selectedTopId, setSelectedTopId] = useState<string | null>(null);
  const session: Row = data.session;
  const agenda: Row[] = [...(data.agenda ?? [])].sort(sortAgenda);
  const selected = agenda.find((a) => a.id === selectedTopId);
  const documents: Row[] = data.documents ?? [];
  const sessionDocuments = documents.filter((d) => !d.agenda_id);
  const topDocuments = selected ? documents.filter((d) => d.agenda_id === selected.id) : [];
  const proposals: Row[] = selected ? (data.proposals ?? []).filter((p: Row) => p.agenda_id === selected.id) : [];
  const decisions: Row[] = selected ? (data.decisions ?? []).filter((d: Row) => d.agenda_id === selected.id) : [];
  const events: Row[] = selected ? (data.events ?? []).filter((e: Row) => e.agenda_id === selected.id) : [];
  const suggestions: Row[] = selected ? (data.suggestions ?? []).filter((s: Row) => s.agenda_id === selected.id) : [];
  const minutes = topDocuments.filter((d) => d.kind === "minutes");
  const distinct = (rows: Row[]) => [...new Map(rows.map((d) => [d.id ?? d.source_url, d])).values()];
  const documentTitle = (d: Row) => {
    const kind = d.kind === "minutes" ? "Niederschrift" : d.kind === "attachment" ? "Anlage" : d.kind === "proposal" ? "Beschlussvorlage" : "RIS-Dokument";
    const original = String(d.title ?? "").trim();
    const date = displayDate(session.session_date);
    const reference = String(d.reference ?? "").trim();
    return [kind, date, reference, original].filter(Boolean).join(" · ");
  };
  const documentItem = (d: Row) => (
    <li key={d.id ?? d.source_url}>
      <span>{documentTitle(d)}</span>
      {" · "}
      {d.content_author === "municipality" && d.extracted_text ? (
        <details>
          <summary>Gespeicherten Text anzeigen</summary>
          <pre className="source-evidence">{d.extracted_text}</pre>
        </details>
      ) : null}
      <ExternalLink url={d.source_url}>Original im RIS öffnen</ExternalLink>
      {d.latest_version_id && (
        <>{" · "}<button type="button" disabled={busy} onClick={() => onOpenDocument(d.latest_version_id)}>Dokumentfassung öffnen</button></>
      )}
    </li>
  );
  const selectTop = (id: string) => setSelectedTopId(id);

  if (showEventSearch && selected) return <div className="ris-simplified">
    <nav aria-label="Pfadnavigation">Sitzung · {displayDate(session.session_date)} / TOP {selected.number} / Lokalen Bezug hinzufügen</nav>
    <section className="panel">
      <h1>Lokalen Bezug hinzufügen</h1>
      <p>TOP {selected.number} · {selected.title}</p>
      <form onSubmit={(event) => { event.preventDefault(); void searchEvents(); }}>
        <label htmlFor="ris-event-search">Vorhandenes Ereignis suchen</label>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <input id="ris-event-search" type="search" value={eventSearch} onChange={(event) => setEventSearch(event.target.value)} />
          <button type="submit" disabled={eventBusy}>Suchen</button>
        </div>
      </form>
      <h2>Suchergebnisse</h2>
      <div role="radiogroup" aria-label="Ereignis auswählen">
        {eventOptions.map((item) => <label key={item.id} className="source-block" style={{ display: "block" }}>
          <input type="radio" name="ris-event-selection" checked={chosenEvent === item.id} onChange={() => setChosenEvent(item.id)} />
          {" "}{item.title || "Ereignis"}{item.event_date ? ` · ${displayDate(item.event_date)}` : ""}
        </label>)}
      </div>
      {eventOptions.length === 0 && <p>Keine Ereignisse in der Ergebnisliste.</p>}
      <p>Die technische Zuordnung verlangt derzeit eine Begründung. Diese Pflicht wird mit der Backend-Anpassung aus Issue #377 entfernt.</p>
      <label htmlFor="ris-event-rationale">Begründung (vorübergehend erforderlich)</label>
      <textarea id="ris-event-rationale" value={reason} onChange={(event) => setReason(event.target.value)} />
      {eventError && <p role="alert">{eventError}</p>}
      <div className="source-actions">
        <button type="button" disabled={eventBusy || !chosenEvent || !reason.trim()} onClick={() => void linkEvent()}>Zuordnen</button>
        <button type="button" onClick={() => setShowEventSearch(false)}>Abbrechen</button>
      </div>
    </section>
  </div>;
  return <div className="ris-simplified">
    {!selected ? (
      <>
        <section className="panel">
          <h2>Sitzung</h2>
          <p>{session.committee_name || "Gremium"} · {displayDate(session.session_date)}</p>
          <p><ExternalLink url={session.source_url}>RIS-Gesamtübersicht öffnen</ExternalLink></p>
          {sessionDocuments.length > 0 && <>
            <h3>Sitzungsweite Dokumente</h3>
            <ul>{distinct(sessionDocuments).map(documentItem)}</ul>
          </>}
          {session.minutes_approval === "approved" && <p>Niederschrift genehmigt</p>}
        </section>
        <section className="panel">
          <h2>Tagesordnung</h2>
          {agenda.map((a) => {
            const docs = distinct(documents.filter((d) => d.agenda_id === a.id));
            const prop = (data.proposals ?? []).find((p: Row) => p.agenda_id === a.id);
            const additionalDocs = docs.filter((d) => !prop || d.source_url !== prop.source_url);
            const hasDecision = (data.decisions ?? []).some((d: Row) => d.agenda_id === a.id);
            return <article className="source-block" key={a.id}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}><h3>TOP {a.number} · {a.title}</h3><button type="button" className="ris-navigation-icon" style={{ minWidth: 44, minHeight: 44, fontSize: "1.5rem", border: "none", background: "transparent", cursor: "pointer" }} onClick={() => selectTop(a.id)} aria-label={`TOP ${a.number} öffnen`} title={`TOP ${a.number} öffnen`}>→</button></div>
              <div className="ris-inline-links">
                {prop && <span>Vorlage {prop.reference || ""}</span>}
                {additionalDocs.length > 0 && <><span> · </span><span>Weitere Dokumente ({additionalDocs.length})</span></>}
                {hasDecision && <><span> · </span><span>Beschlussfassung</span></>}
              </div>
            </article>;
          })}
          {agenda.length === 0 && <p>Keine Tagesordnungspunkte erfasst.</p>}
        </section>
      </>
    ) : (
      <>
        <button type="button" onClick={() => setSelectedTopId(null)}>‹ Zurück zur Tagesordnung</button>
        <section className="panel">
          <h2>TOP {selected.number} · {selected.title}</h2>
          {minutes.length === 0 && <p>Niederschrift zum TOP noch nicht verfügbar.</p>}
          {minutes.length > 0 && selected.treatment_status && selected.treatment_status !== "unknown" &&
            <p>Status laut Niederschrift: {({ treated: "Behandelt", withdrawn: "Zurückgezogen" } as Record<string,string>)[selected.treatment_status] ?? selected.treatment_status}</p>}
        </section>
        {proposals.length > 0 && <section className="panel">
          <h2>Beschlussvorschlag</h2>
          {proposals.map((p, i) => <div className="source-block" key={p.text_id ?? p.id ?? i}>
            {p.reference && <p>Vorlage {p.reference}</p>}
            {p.wording ? <pre className="source-evidence">{p.wording}</pre> : <p>Beschlussvorschlag im Bestand noch nicht als Text verfügbar.</p>}
            {!topDocuments.some((d) => d.source_url === p.source_url) && <ExternalLink url={p.source_url}>Originalvorlage im RIS öffnen</ExternalLink>}
          </div>)}
        </section>}
        {decisions.length > 0 && <section className="panel">
          <h2>Beschlussfassung</h2>
          {decisions.map((d, i) => <article className="source-block" key={d.version_id ?? i}>
            <h3>Beschlusspunkt {d.point_key ?? i + 1}</h3>
            <pre className="source-evidence">{d.wording}</pre>
            <p>Ergebnis: {d.result ?? "Nicht angegeben"}</p>
            <p>Ja: {d.yes_count ?? "–"} · Nein: {d.no_count ?? "–"} · Enthaltungen: {d.abstention_count ?? "–"}</p>
          </article>)}
        </section>}
        {topDocuments.length > 0 && <section className="panel">
          <h2>{topDocuments.some((d) => d.kind === "minutes") ? "Dokumente und Niederschrift" : "Dokumente"}</h2>
          <ul>{distinct(topDocuments).map(documentItem)}</ul>
        </section>}
        <section className="panel">
          <h2>Lokale Bezüge</h2>
          {events.map((e, i) => <div className="source-block" key={e.event_id ?? i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "space-between" }}>
            <span>{e.event_title || e.title || `Ereignis ${i + 1}`}{e.event_date ? ` · ${displayDate(e.event_date)}` : ""}</span>
            <button type="button" onClick={() => onOpenEvent(e.event_id)} aria-label="Ereignis öffnen" title="Ereignis öffnen" style={{ minWidth: 44, minHeight: 44, border: "none", background: "transparent", fontSize: "1.5rem", cursor: "pointer" }}>→</button>
          </div>)}
          {events.length === 0 && <p>Noch kein Ereignis zugeordnet.</p>}
          {suggestions.length > 0 && <p>{suggestions.length} redaktionelle Vorschläge vorhanden; deren Bearbeitung erfolgt in der Redaktion.</p>}
          <p>Verknüpfte Meldungen, Vorgänge und Themen werden über das Ereignis geöffnet.</p>
          <button type="button" disabled={busy} onClick={() => { setShowEventSearch(true); void searchEvents(); }}>Neu: Lokaler Bezug</button>
        </section>
      </>
    )}
  </div>;
}
