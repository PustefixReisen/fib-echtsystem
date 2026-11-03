import { useState } from "react";
import { type SourceApi, sourceApi, withEventLock } from "./source-api.js";
import { ActionIcon, OriginalLink } from "./ActionIcon.js";
import { EventAssignmentView } from "./EventAssignmentView.js";
import { PdfPreview } from "./PdfPreview.js";
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
  const [preview, setPreview] = useState<Row | null>(null),
    [error, setError] = useState(""),
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
  const previewButton = (d: Row) =>
    d.has_pdf
      ? (
        <ActionIcon
          label={`PDF-Vorschau: ${title(d)}`}
          onClick={() => setPreview(d)}
        >
          ▤
        </ActionIcon>
      )
      : (
        <span className="muted">
          {["municipality", "licensed"].includes(d.content_author)
            ? "Original-PDF noch nicht gespeichert"
            : "Speicherberechtigung ungeklärt – nur Originallink"}
        </span>
      );
  const documentItem = (d: Row) => (
    <li className="ris-document-item" key={d.id ?? d.document_id}>
      <div>
        <span>{title(d)}</span>
        {d.original_title && (
          <small>Originaltitel im RIS: {d.original_title}</small>
        )}
      </div>
      <div className="source-actions">
        {previewButton(d)}
        <OriginalLink url={d.source_url} />
        {d.latest_version_id && (
          <ActionIcon
            label="Dokumentfassung öffnen"
            disabled={busy}
            onClick={() => onOpenDocument(d.latest_version_id)}
          >
            →
          </ActionIcon>
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
            <section className="panel">
              <h2>Sitzung</h2>
              <p>
                {session.committee_name || "Gremium"} ·{" "}
                {displayDate(session.session_date)}{" "}
                <OriginalLink
                  label="RIS-Gesamtübersicht öffnen"
                  url={session.source_url}
                />
              </p>
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
            <section className="panel">
              <h2>Tagesordnung</h2>
              {agenda.map((a) => {
                const docs = documents.filter((d) => d.agenda_id === a.id),
                  prop = (data.proposals ?? []).find((p: Row) =>
                    p.agenda_id === a.id
                  );
                const additional = docs.filter((d) =>
                  d.kind !== "proposal"
                ).length;
                return (
                  <article className="source-block" key={a.id}>
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
            <button type="button" onClick={() => select("")}>
              ‹ Zurück zur Tagesordnung
            </button>
            <section className="panel">
              <h2>TOP {selected.number} · {selected.title}</h2>
              {!sessionDocuments.some((d) => d.kind === "minutes") &&
                !topDocuments.some((d) => d.kind === "minutes") && (
                <p>Niederschrift zum TOP noch nicht verfügbar.</p>
              )}
            </section>
            {proposals.length > 0 && (
              <section className="panel">
                <h2>Beschlussvorschlag</h2>
                {proposals.map((p, i) => {
                  const doc = topDocuments.find((d) =>
                    d.kind === "proposal" &&
                    (!d.reference || d.reference === p.reference)
                  );
                  return (
                    <div className="source-block" key={p.id ?? i}>
                      <p>
                        Vorlage {p.reference} ·{" "}
                        {displayDate(session.session_date)}
                      </p>
                      <p>
                        Ein Vorschlag ist keine bestätigte Beschlussfassung.
                      </p>
                      {doc ? previewButton(doc) : (
                        <OriginalLink
                          label="Originalvorlage im RIS öffnen"
                          url={p.source_url}
                        />
                      )}
                    </div>
                  );
                })}
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
            {topDocuments.length > 0 && (
              <section className="panel">
                <h2>
                  {topDocuments.some((d) => d.kind === "minutes")
                    ? "Dokumente und Niederschrift"
                    : "Dokumente"}
                </h2>
                <ul>{topDocuments.map(documentItem)}</ul>
              </section>
            )}
            {sessionDocuments.some((d) => d.kind === "minutes") && (
              <section className="panel">
                <h2>Niederschrift der Sitzung</h2>
                <ul>
                  {sessionDocuments.filter((d) => d.kind === "minutes").map(
                    documentItem,
                  )}
                </ul>
              </section>
            )}
            <section className="panel">
              <h2>Lokale Bezüge</h2>
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
              <button
                type="button"
                disabled={busy || saving}
                onClick={() => setShowSearch(true)}
              >
                Neu: Lokaler Bezug
              </button>
            </section>
          </>
        )}
      {preview && (
        <PdfPreview
          versionId={preview.latest_version_id}
          title={title(preview)}
          api={api}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}
