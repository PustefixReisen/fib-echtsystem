import { useState } from "react";
import { type SourceApi, sourceApi, withEventLock } from "./source-api.js";
import { ActionIcon, OriginalLink } from "./ActionIcon.js";
import { EventAssignmentView } from "./EventAssignmentView.js";
type Row = Record<string, any>;
type Props = {
  data: Row;
  busy: boolean;
  onOpenEvent: (id: string) => void;
  onOpenDocument: (versionId: string) => void;
  onReload: () => Promise<void>;
  selectedTopId?: string;
  onSelectTop?: (id: string) => void;
  registerLeaveGuard?: (guard: () => boolean) => void;
  api?: SourceApi;
  eventLock?: typeof withEventLock;
};
const displayDate = (v: unknown) =>
  v ? new Date(String(v)).toLocaleDateString("de-DE") : "Datum unbekannt";
export function RisSessionView(
  {
    data,
    busy,
    onOpenEvent,
    onOpenDocument,
    onReload,
    selectedTopId,
    onSelectTop,
    registerLeaveGuard,
    api = sourceApi,
    eventLock = withEventLock,
  }: Props,
) {
  const [localTop, setLocalTop] = useState(""),
    [showSearch, setShowSearch] = useState(false);
  const [error, setError] = useState(""),
    [saving, setSaving] = useState(false);
  const select = (id: string) => {
    setLocalTop(id);
    onSelectTop?.(id);
    setError("");
  };
  const session: Row = data.session, documents: Row[] = data.documents ?? [];
  const agenda: Row[] = [...(data.agenda ?? [])].sort((a, b) =>
    String(a.number).localeCompare(String(b.number), "de", { numeric: true })
  );
  const selected = agenda.find((a) => a.id === (selectedTopId ?? localTop));
  const topDocuments = selected
    ? documents.filter((d) => d.agenda_id === selected.id)
    : [];
  const sessionDocuments = documents.filter((d) => !d.agenda_id);
  const proposals: Row[] = selected
    ? (data.proposals ?? []).filter((p: Row) => p.agenda_id === selected.id)
    : [];
  const decisions: Row[] = selected
    ? (data.decisions ?? []).filter((d: Row) => d.agenda_id === selected.id)
    : [];
  const events: Row[] = selected
    ? (data.events ?? []).filter((e: Row) => e.agenda_id === selected.id)
    : [];
  const title = (d: Row) =>
    [
      ({
        proposal: "Beschlussvorlage",
        minutes: "Niederschrift",
        attachment: "Anlage",
        decision: "Beschluss",
      } as Record<string, string>)[d.kind] ?? "Sitzungsunterlage",
      displayDate(session.session_date),
      d.reference,
      d.title || d.original_title,
    ].filter(Boolean).join(" · ");
  const documentItem = (d: Row) => (
    <li className="ris-document-item" key={d.id ?? d.document_id}>
      <div className="ris-document-name">
        <span>{title(d)}</span>
        {d.original_title && d.original_title !== d.title && (
          <small>Originaltitel im RIS: {d.original_title}</small>
        )}
      </div>
      <div className="source-actions">
        <OriginalLink url={d.source_url} label="RIS-Original öffnen" />
        {d.latest_version_id && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onOpenDocument(d.latest_version_id)}
          >
            Fundstelle öffnen
          </button>
        )}
      </div>
    </li>
  );
  if (showSearch && selected) {
    return (
      <EventAssignmentView
        context={`Sitzung ${
          displayDate(session.session_date)
        } / TOP ${selected.number}`}
        target={{ agendaId: selected.id }}
        registerLeaveGuard={registerLeaveGuard}
        linkedIds={events.map((e) => e.event_id)}
        suggestion={{ title: selected.title, date: session.session_date }}
        api={api}
        eventLock={eventLock}
        onCancel={() => setShowSearch(false)}
        onDone={async () => {
          await onReload();
          setShowSearch(false);
        }}
      />
    );
  }
  return (
    <div className="ris-simplified">
      <nav aria-label="Pfadnavigation">
        Sitzung {displayDate(session.session_date)}
        {selected && ` / TOP ${selected.number}`}
      </nav>
      {error && <p role="alert">{error}</p>}
      {!selected
        ? (
          <>
            <section className="panel card-headed">
              <div className="section-heading"><h2>RIS-Gesamtübersicht</h2></div>
              <div className="ris-inline-row">
                <span>{session.committee_name || "Gremium"} ·{" "}
                  {displayDate(session.session_date)} · Tagesordnung</span>
                <OriginalLink
                  label="Gesamtübersicht im RIS öffnen"
                  url={session.source_url}
                />
              </div>
              {sessionDocuments.length > 0 && (
                <>
                  <h3>Sitzungsweite Dokumente</h3>
                  <ul>{sessionDocuments.map(documentItem)}</ul>
                </>
              )}
              {session.minutes_approval === "approved" && (
                <p>Niederschrift genehmigt</p>
              )}
            </section>
            <section className="panel card-headed">
              <div className="section-heading"><h2>Tagesordnung</h2></div>
              {agenda.map((a) => {
                const docs = documents.filter((d) => d.agenda_id === a.id),
                  prop = (data.proposals ?? []).find((p: Row) =>
                    p.agenda_id === a.id
                  );
                const additional = docs.filter((d) =>
                  d.kind !== "proposal"
                ).length;
                return (
                  <article className="source-block ris-top-item" key={a.id}>
                    <div className="section-heading">
                      <h3>TOP {a.number} · {a.title}</h3>
                      <ActionIcon
                        label={`TOP ${a.number} öffnen`}
                        onClick={() => select(a.id)}
                      >
                        →
                      </ActionIcon>
                    </div>
                    <p className="ris-inline-links">
                      {[
                        prop ? `Vorlage ${prop.reference || ""}` : null,
                        additional
                          ? `${additional} weitere${
                            additional === 1 ? "s" : ""
                          } Dokument${additional === 1 ? "" : "e"}`
                          : null,
                        (data.decisions ?? []).some((d: Row) =>
                            d.agenda_id === a.id
                          )
                          ? "Beschlussfassung vorhanden"
                          : null,
                      ].filter(Boolean).join(" · ")}
                    </p>
                  </article>
                );
              })}
              {!agenda.length && <p>Keine Tagesordnungspunkte erfasst.</p>}
            </section>
          </>
        )
        : (
          <>
            <section className="panel card-headed">
              <div className="section-heading"><h2>TOP {selected.number} · {selected.title}</h2></div>
              {!sessionDocuments.some((d) => d.kind === "minutes") &&
                !topDocuments.some((d) => d.kind === "minutes") && (
                <p>Niederschrift zum TOP noch nicht verfügbar.</p>
              )}
            </section>
            {(proposals.length > 0 || topDocuments.length > 0) && (
              <section className="panel card-headed">
                <div className="section-heading">
                  <h2>Beschlussvorschlag / Dokumente</h2>
                </div>
                {proposals.length > 0 && (
                  <div className="ris-proposal-copy">
                    {proposals.map((p, i) => (
                      <div key={p.id ?? i}>
                        <strong>Beschlussvorschlag · Vorlage {p.reference}</strong>
                        {p.wording || p.proposal_text
                          ? <p className="source-evidence">{p.wording || p.proposal_text}</p>
                          : <p>Beschlussvorschlag als Text derzeit nicht verfügbar. Die Vorlage kann im RIS geöffnet werden.</p>}
                        {!topDocuments.some((d) => d.kind === "proposal" && (!d.reference || d.reference === p.reference)) &&
                          <span className="ris-inline-row">
                            <span>Originalvorlage</span>
                            <OriginalLink label="Vorlage im RIS öffnen" url={p.source_url} />
                          </span>}
                      </div>
                    ))}
                  </div>
                )}
                {topDocuments.length > 0 && (
                  <ul>{topDocuments.map(documentItem)}</ul>
                )}
              </section>
            )}
            {decisions.length > 0 && (
              <section className="panel">
                <h2>Beschlussfassung</h2>
                {decisions.map((d, i) => (
                  <article className="source-block" key={d.version_id ?? i}>
                    <h3>Beschlusspunkt {d.point_key ?? i + 1}</h3>
                    <p className="source-evidence">{d.wording}</p>
                    <p>
                      Ergebnis: {({
                        accepted: "Angenommen",
                        rejected: "Abgelehnt",
                        no_vote: "Keine Abstimmung",
                        unknown: "Nicht angegeben",
                      } as Record<string, string>)[d.result] ??
                        "Nicht angegeben"}
                    </p>
                    <p>
                      Ja: {d.yes_count ?? "–"} · Nein: {d.no_count ?? "–"}{" "}
                      · Enthaltungen: {d.abstention_count ?? "–"}
                    </p>
                  </article>
                ))}
              </section>
            )}
            {sessionDocuments.some((d) => d.kind === "minutes") && (
              <section className="panel card-headed">
                <div className="section-heading"><h2>Niederschrift der Sitzung</h2></div>
                <ul>
                  {sessionDocuments.filter((d) => d.kind === "minutes").map(
                    documentItem,
                  )}
                </ul>
              </section>
            )}
            <section className="panel card-headed">
              <div className="section-heading">
                <h2>Lokale Bezüge</h2>
                <button type="button" disabled={busy || saving} onClick={() => setShowSearch(true)}>
                  Neu: Lokaler Bezug
                </button>
              </div>
              {events.map((e) => (
                <div className="work-item" key={e.event_id}>
                  <span>
                    {e.event_title}
                    {e.event_date && ` · ${displayDate(e.event_date)}`}
                  </span>
                  <div className="source-actions">
                    <ActionIcon
                      label="Ereignis öffnen"
                      onClick={() => onOpenEvent(e.event_id)}
                    >
                      →
                    </ActionIcon>
                    <ActionIcon
                      label={`Lokalen Bezug zu ${e.event_title} entfernen`}
                      disabled={busy || saving}
                      onClick={() => {
                        if (
                          !window.confirm(
                            `Zuordnung zu „${e.event_title}“ entfernen? Das Ereignis bleibt erhalten.`,
                          )
                        ) return;
                        setSaving(true);
                        setError("");
                        void eventLock(e.event_id, () =>
                          api({
                            action: "ris_unlink_event",
                            agendaId: selected.id,
                            eventId: e.event_id,
                          })).then(onReload).catch((err) =>
                            setError(
                              err instanceof Error
                                ? err.message
                                : "Entfernen fehlgeschlagen.",
                            )
                          ).finally(() => setSaving(false));
                      }}
                    >
                      🗑
                    </ActionIcon>
                  </div>
                </div>
              ))}
              {!events.length && <p>Noch kein Ereignis zugeordnet.</p>}
            </section>
          </>
        )}

    </div>
  );
}
