import { useState } from "react";

type Row = Record<string, any>;
type Props = {
  data: Row;
  busy: boolean;
  onOpenEvent: (id: string) => void;
  onOpenDocument: (versionId: string) => void;
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
export function RisSessionView({ data, busy, onOpenEvent, onOpenDocument }: Props) {
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
  const documentItem = (d: Row) => (
    <li key={d.id ?? d.source_url}>
      <span>{d.title || (d.kind === "minutes" ? "Niederschrift" : d.kind === "attachment" ? "Anlage" : "Dokument")}</span>
      {" · "}
      {d.extracted_text ? (
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
            const hasDecision = (data.decisions ?? []).some((d: Row) => d.agenda_id === a.id);
            return <article className="source-block" key={a.id}>
              <h3><button type="button" className="ris-text-link" onClick={() => selectTop(a.id)}>TOP {a.number} · {a.title}</button></h3>
              <div className="ris-inline-links">
                {prop && <button type="button" onClick={() => selectTop(a.id)}>Vorlage {prop.reference || ""}</button>}
                {docs.length > 1 && <><span> · </span><button type="button" onClick={() => selectTop(a.id)}>Weitere Dokumente ({docs.length - (prop ? 1 : 0)})</button></>}
                {hasDecision && <><span> · </span><button type="button" onClick={() => selectTop(a.id)}>Beschlussfassung</button></>}
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
            <ExternalLink url={p.source_url}>Originalvorlage im RIS öffnen</ExternalLink>
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
          <h2>Dokumente und Niederschrift</h2>
          <ul>{distinct(topDocuments).map(documentItem)}</ul>
        </section>}
        <section className="panel">
          <h2>Redaktionelle Zusammenhänge</h2>
          {events.map((e, i) => <p key={e.event_id ?? i}>
            <button type="button" onClick={() => onOpenEvent(e.event_id)}>Ereignis öffnen</button>
            {e.process_id && <span> · Vorgang verbunden</span>}
            {e.topic_id && <span> · Thema verbunden</span>}
          </p>)}
          {events.length === 0 && <p>Noch kein Ereignis zugeordnet.</p>}
          {suggestions.length > 0 && <p>{suggestions.length} redaktionelle Vorschläge vorhanden; deren Bearbeitung erfolgt in der Redaktion.</p>}
          <p>Verknüpfte Meldungen, Vorgänge und Themen werden über das Ereignis geöffnet.</p>
        </section>
      </>
    )}
  </div>;
}
