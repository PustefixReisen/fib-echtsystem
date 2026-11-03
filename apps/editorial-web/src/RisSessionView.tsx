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
    onReload,
    selectedTopId,
    onSelectTop,
    registerLeaveGuard,
    api = sourceApi,
    eventLock = withEventLock,
  }: Props,
) {
  const [localTop, setLocalTop] = useState(""),
    [assignment, setAssignment] = useState<"session" | "main" | "related" | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<string[] | null>(null);
  const [error, setError] = useState(""),
    [saving, setSaving] = useState(false);
  const select = (id: string) => {
    setLocalTop(id);
    onSelectTop?.(id);
    setError("");
    setSelectedDocuments(null);
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
  const mainEvents: Row[] = selected
    ? (data.mainEvents ?? []).filter((e: Row) => e.agenda_id === selected.id)
    : [];
  const sessionEvents: Row[] = data.sessionEvents ?? [];
  const mainEventFindings: Row[] = data.mainEventFindings ?? [];
  const sessionRelated: Row = data.sessionRelated ?? {messages: [],processes: [],topics: []};
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
        <OriginalLink url={d.source_url}
          label={`${title(d)} im RIS öffnen`}
          text={title(d)} />
      </div>
    </li>
  );
  if (assignment && (assignment === "session" || selected)) {
    const isSession = assignment === "session";
    const chosen = isSession ? sessionEvents : assignment === "main" ? mainEvents : events;
    const target = isSession
      ? {sessionId: session.id}
      : {agendaId: selected!.id, ...(assignment === "main" ? {mainEvent: true} : {})};
    return (
      <EventAssignmentView
        context={isSession
          ? `Sitzung ${displayDate(session.session_date)}`
          : `Sitzung ${displayDate(session.session_date)} / TOP ${selected!.number}`}
        target={target}
        registerLeaveGuard={registerLeaveGuard}
        linkedIds={chosen.map((e: Row) => e.event_id)}
        suggestion={{
          title: isSession
            ? `${session.committee_name || "Gemeinderat"} · Sitzung am ${displayDate(session.session_date)}`
            : selected!.title,
          date: session.session_date,
        }}
        api={api}
        eventLock={eventLock}
        onCancel={() => setAssignment(null)}
        onDone={async () => {
          await onReload();
          setSelectedDocuments(null);
          setAssignment(null);
        }}
      />
    );
  }
  const unlink = (event: Row, action: string, agendaId?: string) => {
    if (!window.confirm(`Zuordnung zu „${event.event_title}“ entfernen? Das Ereignis bleibt erhalten.`)) return;
    setSaving(true);
    setError("");
    void eventLock(event.event_id, () => api({
      action,
      ...(agendaId ? {agendaId} : {sessionId: session.id}),
      eventId: event.event_id,
    })).then(onReload).catch((err) =>
      setError(err instanceof Error ? err.message : "Entfernen fehlgeschlagen.")
    ).finally(() => setSaving(false));
  };
  const eventRow = (event: Row, action: string, agendaId?: string) => (
    <div className="work-item" key={event.event_id}>
      <span>{event.event_title}{event.event_date && ` · ${displayDate(event.event_date)}`}</span>
      <div className="source-actions">
        <ActionIcon label="Ereignis öffnen" onClick={() => onOpenEvent(event.event_id)}>→</ActionIcon>
        <ActionIcon
          label={`Zuordnung zu ${event.event_title} entfernen`}
          disabled={busy || saving}
          onClick={() => unlink(event, action, agendaId)}
        >🗑</ActionIcon>
      </div>
    </div>
  );
  return (
    <div className="ris-simplified">
      <nav className="ris-session-tabs" aria-label="Sitzung und Tagesordnungspunkte">
        <button type="button" className={!selected ? "active" : ""}
          aria-current={!selected ? "page" : undefined}
          onClick={() => select("")}>
          Sitzungsübersicht
        </button>
        {agenda.map((item) => (
          <button type="button" key={item.id}
            className={selected?.id === item.id ? "active" : ""}
            aria-current={selected?.id === item.id ? "page" : undefined}
            title={`TOP ${item.number}: ${item.title}`}
            onClick={() => select(item.id)}>
            TOP {item.number}
          </button>
        ))}
      </nav>
      {error && <p role="alert">{error}</p>}
      {!selected
        ? (
          <>
            <section className="panel card-headed">
              <div className="section-heading"><h2>RIS-Gesamtübersicht</h2></div>
              <div className="ris-inline-row">
                <OriginalLink
                  label="Gesamtübersicht im RIS öffnen"
                  text={`${session.committee_name || "Gremium"} · ${displayDate(session.session_date)} · Tagesordnung`}
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
            <section className="panel card-headed">
              <div className="section-heading">
                <h2>Ereignisse zur Sitzung</h2>
                <button type="button" disabled={busy || saving} onClick={() => setAssignment("session")}>
                  Ereignis zuordnen
                </button>
              </div>
              {sessionEvents.map((e) => (
                <div className="ris-session-event" key={e.event_id}>
                  {eventRow(e, "ris_unlink_session_event")}
                  <div className="ris-derived-relations" aria-label="Abgeleitete Beziehungen">
                    {(sessionRelated.messages ?? []).filter((m: Row) => m.event_id === e.event_id)
                      .map((m: Row) => <span key={m.id}>Meldung: {m.title}</span>)}
                    {(sessionRelated.processes ?? []).filter((p: Row) => p.event_id === e.event_id)
                      .map((p: Row) => <span key={p.id}>Vorgang: {p.title}</span>)}
                    {(sessionRelated.topics ?? []).filter((t: Row) => t.event_id === e.event_id)
                      .map((t: Row) => <span key={t.id}>Thema: {t.title}</span>)}
                  </div>
                </div>
              ))}
              {!sessionEvents.length && <p>Noch kein Ereignis mit der Sitzung verbunden.</p>}
              <p className="meta">Allgemeine Presseberichte beziehen sich auf die Sitzung insgesamt, nicht auf einzelne TOPs.</p>
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
            {topDocuments.length > 0 && (
              <section className="panel card-headed">
                <div className="section-heading">
                  <h2>Beschlussvorschlag / Dokumente</h2>
                </div>
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
                <h2>TOP als Ereignis festlegen</h2>
                {!mainEvents.length && (
                  <button type="button" disabled={busy || saving} onClick={() => setAssignment("main")}>
                    Auswählen oder erstellen
                  </button>
                )}
              </div>
              {mainEvents.map((e) => eventRow(e, "ris_unlink_main_event", selected.id))}
              {!mainEvents.length && <p>Noch kein Hauptereignis zugeordnet. Die Zuordnung erfolgt nur durch die Redaktion.</p>}
              {mainEvents.length > 0 && (() => {
                const linkedFindingIds = new Set(
                  mainEventFindings.filter((row: Row) =>
                    row.event_id === mainEvents[0].event_id
                  ).map((row: Row) => row.finding_id),
                );
                const eligible = topDocuments.filter((d: Row) =>
                  (d.kind === "proposal" || d.kind === "attachment") &&
                  (!d.finding_id || !linkedFindingIds.has(d.finding_id))
                );
                const selectedIds = selectedDocuments ?? eligible.map((d: Row) => d.id);
                return eligible.length > 0 ? (
                  <div className="ris-finding-confirm">
                    <h3>Unterlagen als Fundstellen bestätigen</h3>
                    <p>Die Unterlagen werden nur nach deiner Bestätigung mit dem Hauptereignis verknüpft. Eine Beschlussfassung wird dadurch nicht bestätigt.</p>
                    <fieldset disabled={busy || saving}>
                      <legend>Vorlage und Anlagen auswählen</legend>
                      {eligible.map((d: Row) => (
                        <label key={d.id} className="ris-document-check">
                          <input type="checkbox" checked={selectedIds.includes(d.id)}
                            onChange={(e) => {
                              const current = selectedDocuments ?? eligible.map((item: Row) => item.id);
                              setSelectedDocuments(e.target.checked
                                ? [...current,d.id] : current.filter((id: string) => id !== d.id));
                            }} />
                          <span>{title(d)}</span>
                        </label>
                      ))}
                    </fieldset>
                    <button type="button" disabled={busy || saving || !selectedIds.length}
                      onClick={() => {
                        if (!window.confirm(`${selectedIds.length} RIS-Unterlage(n) als Fundstellen mit dem Hauptereignis verbinden?`)) return;
                        setSaving(true);
                        setError("");
                        void eventLock(mainEvents[0].event_id, () => api({
                          action:"ris_confirm_main_findings",
                          agendaId:selected!.id,
                          eventId:mainEvents[0].event_id,
                          linkIds:selectedIds,
                          approval:true,
                        })).then(async () => {await onReload();setSelectedDocuments(null);})
                          .catch((e) => setError(e instanceof Error ? e.message : "Fundstellen konnten nicht bestätigt werden."))
                          .finally(() => setSaving(false));
                      }}>
                      Ausgewählte Fundstellen bestätigen
                    </button>
                  </div>
                ) : null;
              })()}
            </section>
            <section className="panel card-headed">
              <div className="section-heading">
                <h2>Weitere Ereignisse zum TOP</h2>
                <button type="button" disabled={busy || saving} onClick={() => setAssignment("related")}>
                  Ereignis zuordnen
                </button>
              </div>
              {events.map((e) => eventRow(e, "ris_unlink_event", selected.id))}
              {!events.length && <p>Keine weiteren Ereignisse zugeordnet.</p>}
            </section>
          </>
        )}

    </div>
  );
}
