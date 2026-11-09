import { useState } from "react";
import { type SourceApi, sourceApi, withEventLock } from "./source-api.js";
import { ActionIcon, OriginalLink } from "./ActionIcon.js";
import { EventAssignmentView } from "./EventAssignmentView.js";
import { RisMinutesReview } from "./RisMinutesReview.js";
type Row = Record<string, any>;
// Legacy reference titles included the portal's separate status block.
export const topTitle = (a: Row) => String(a.title ?? "").replace(/\s+Beschluss:\s*.+$/i, "");
export const topStatus = (a: Row) => a.observed_treatment ||
  String(a.title ?? "").match(/\s+Beschluss:\s*(.+)$/i)?.[1] ||
  ({withdrawn:"Abgesetzt",deferred:"Vertagt",treated:"Behandelt",announced:"Angekündigt"} as Row)[a.treatment_status] || "Nicht angegeben";

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
  /** Only the isolated, static acceptance preview may show supplied source wording. */
  previewOriginalWording?: boolean;
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
    previewOriginalWording = false,
  }: Props,
) {
  const [localTop, setLocalTop] = useState(""),
    [assignment, setAssignment] = useState<"session" | "main" | "related" | null>(null);
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
  const mainEvents: Row[] = selected
    ? (data.mainEvents ?? []).filter((e: Row) => e.agenda_id === selected.id)
    : [];
  const sessionEvents: Row[] = data.sessionEvents ?? [];
  const sessionRelated: Row = data.sessionRelated ?? {messages: [],processes: [],topics: []};
  const documentKind = (d: Row) => ({
    proposal: "Beschlussvorlage",
    minutes: "Niederschrift",
    attachment: "Anlage",
    decision: "Beschluss",
  } as Record<string, string>)[d.kind] ?? "Sitzungsunterlage";
  const documentDetail = (d: Row) =>
    [displayDate(session.session_date),d.reference,d.title || d.original_title]
      .filter(Boolean).join(" · ");
  const title = (d: Row) => [documentKind(d),documentDetail(d)].filter(Boolean).join(" · ");
  const documentItem = (d: Row) => (
    <li className="ris-document-item" key={d.id ?? d.document_id}>
      <div className="ris-document-name">
        <span className="ris-external-reference">
          <OriginalLink url={d.source_url} label={`${title(d)} im RIS öffnen`} />
          <span><strong>{documentKind(d)}</strong>
            {documentDetail(d) && ` · ${documentDetail(d)}`}
          </span>
        </span>
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
            : topTitle(selected!),
          date: session.session_date,
        }}
        api={api}
        eventLock={eventLock}
        onCancel={() => setAssignment(null)}
        onDone={async () => {
          await onReload();
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
              <p role="status">{agenda.length} erfasste TOPs. {data.agendaCoverage?.scope === "reference_excerpt"
                ? "Bewusst reduzierter Referenzbestand; keine vollständige Sitzung."
                : "Beobachteter Erfassungsbestand; Vollständigkeit gegenüber der Original-Tagesordnung nicht bestätigt."}</p>
              {data.agendaCoverage?.retainedFromEarlierRevisions > 0 && <p role="status">{data.agendaCoverage.retainedFromEarlierRevisions} TOPs stammen aus früheren Fassungen und wurden im letzten Abruf nicht erneut beobachtet. Bestehende redaktionelle Bezüge bleiben erhalten.</p>}
              {data.agendaCoverage?.unresolvedTopCount > 0 && <p role="alert">{data.agendaCoverage.unresolvedTopCount} TOP-Zeilen haben keine eindeutige Nummer. Original-Tagesordnung prüfen.</p>}
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
                      <h3>TOP {a.number} · {topTitle(a)}</h3>
                      <ActionIcon
                        label={`TOP ${a.number} öffnen`}
                        onClick={() => select(a.id)}
                      >
                        →
                      </ActionIcon>
                    </div>
                    <p>TOP-Status (RIS): {topStatus(a)}</p>
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
              <div className="section-heading"><h2>TOP {selected.number} · {topTitle(selected)}</h2></div>
              <p>TOP-Status (RIS): {topStatus(selected)}</p>
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
            <section className="panel card-headed">
              <div className="section-heading"><h2>Niederschrift der Sitzung</h2></div>
              {decisions.length > 0 ? (
                <div className="ris-minutes-decisions">
                  {decisions.map((d, i) => (
                    <div key={d.version_id ?? i} className="ris-minutes-decision">
                      <p><strong>Beschlusspunkt {d.point_key ?? i + 1}</strong></p>
                      {(previewOriginalWording && d.wording || d.display_wording)
                        ? <p className="ris-minutes-wording" style={{whiteSpace:"pre-line"}}>{previewOriginalWording && d.wording || d.display_wording}</p>
                        : <p className="meta">Der vollständige Beschlusswortlaut wurde für die Anzeige noch nicht freigegeben. Bitte die Originalniederschrift verwenden.</p>}
                      <p><strong>Abstimmung:</strong> {({accepted:"angenommen",rejected:"abgelehnt",no_vote:"keine Abstimmung",unknown:"Ergebnis nicht angegeben"} as Row)[d.result] ?? "Ergebnis nicht angegeben"}
                        {d.result !== "no_vote" && <> · Ja {d.yes_count ?? "nicht angegeben"} · Nein {d.no_count ?? "nicht angegeben"}{d.abstention_count != null && <> · Enthaltungen {d.abstention_count}</>}</>}
                      </p>
                      {d.source_changed && <p role="status">Originalquelle geändert – erneute Prüfung erforderlich.</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p role="status">{String(topStatus(selected)).toLowerCase() === "abgesetzt"
                  ? "Dieser TOP wurde abgesetzt. Ein Beschluss oder Abstimmungsergebnis liegt für diesen TOP nicht vor; der protokollierte Behandlungstext ist in FIB noch nicht erfasst."
                  : "Der TOP-bezogene Beschlusstext und die Abstimmungsergebnisse wurden aus der Niederschrift noch nicht geprüft und übernommen."}</p>
              )}
              <ul>{[...sessionDocuments,...topDocuments].filter((d) => d.kind === "minutes").map(documentItem)}</ul>
            </section>
            {!previewOriginalWording && mainEvents.length > 0 && sessionDocuments.some(d => d.kind === "minutes") && (
              <RisMinutesReview agendaId={selected.id}
                eventId={mainEvents[0].event_id}
                source={sessionDocuments.find(d => d.kind === "minutes")!}
                api={api} eventLock={eventLock} onReload={onReload}/>
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
