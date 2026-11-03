import { ActionIcon, OriginalLink } from "./ActionIcon.js";
import { EventAssignmentView } from "./EventAssignmentView.js";
import { RisSessionView } from "./RisSessionView.js";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { type SourceApi, sourceApi, withEventLock } from "./source-api.js";

type Row = Record<string, any>;
type Props = {
  mode: "findings" | "sessions";
  onHome: () => void;
  onOpenEvent: (id: string) => void;
  initialFindingId?: string | null;
  api?: SourceApi;
  eventLock?: typeof withEventLock;
  registerLeaveGuard?: (guard: () => boolean) => void;
};
const labels: Record<string, string> = {
  unknown: "Unbekannt",
  approved: "Genehmigt",
  relevant: "Relevant",
  defining: "Prägend",
  supplementary: "Ergänzend",
  candidate: "Unsicher – noch nicht bestätigt",
  confirmed: "Bestätigt",
  pending: "Vorschlag – Prüfung offen",
  rejected: "Abgelehnt",
  deferred: "Zurückgestellt",
  proposal: "Vorlage",
  minutes: "Niederschrift",
  attachment: "Anlage",
  decision: "Tatsächlicher Beschluss",
  proposal_text: "Beschlussvorschlag",
  accepted: "Angenommen",
  no_vote: "Keine Abstimmung",
  announced: "Angekündigt",
  treated: "Behandelt",
  withdrawn: "Zurückgezogen",
  proposal_publication: "Veröffentlichung einer Vorlage",
  treatment: "Behandlung",
  minutes_publication: "Veröffentlichung einer Niederschrift",
  ai: "KI-Vorschlag",
  editor: "Redaktioneller Vorschlag",
};
const label = (value: unknown) =>
  labels[String(value)] ?? String(value ?? "Unbekannt");
const date = (value: unknown) =>
  value ? new Date(String(value)).toLocaleDateString("de-DE") : "Unbekannt";
function Link({
  url,
  children,
}: {
  url?: string | null;
  children?: ReactNode;
}) {
  return url && /^https:\/\//i.test(url)
    ? (
      <span>
        {children}
        <OriginalLink url={url} label="Originalquelle öffnen" />
      </span>
    )
    : <span>Originaladresse unbekannt</span>;
}
function Card({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="panel card-headed">
      <div className="section-heading">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
function Status({ value }: { value: unknown }) {
  return (
    <span className={`source-status source-status-${String(value)}`}>
      {label(value)}
    </span>
  );
}
export function SourceWorkspace({
  mode,
  onHome,
  onOpenEvent,
  initialFindingId,
  api = sourceApi,
  eventLock = withEventLock,
  registerLeaveGuard,
}: Props) {
  const [assignment, setAssignment] = useState(false);
  const [returnContext, setReturnContext] = useState<
    { sessionId: string; agendaId: string; number: string } | null
  >(null);
  const [route, setRoute] = useState<"findings" | "sessions">(mode),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all");
  const [list, setList] = useState<Row>({
      findings: [],
      observations: [],
      documents: [],
      sessions: [],
    }),
    [detail, setDetail] = useState<Row | null>(null),
    [session, setSession] = useState<Row | null>(null),
    [topId, setTopId] = useState("");
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [title, setTitle] = useState("");
  const [dirty, setDirty] = useState(false);
  const assignmentGuard = useRef<() => boolean>(() => true);
  const dirtyRef = useRef(false);
  dirtyRef.current = dirty;
  const inFlight = useRef(false);
  const generation = useRef(0);
  const leave = () => {
    if (inFlight.current || !assignmentGuard.current()) return false;
    const ok = !dirtyRef.current ||
      window.confirm("Ungespeicherte Eingaben verwerfen?");
    if (ok) {
      dirtyRef.current = false;
      setDirty(false);
    }
    return ok;
  };
  useEffect(() => {
    registerLeaveGuard?.(leave);
    return () => registerLeaveGuard?.(() => true);
  }, []);
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);
  async function run(work: () => Promise<void>, success = "") {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await work();
      if (success) {
        setNotice(success);
        setDirty(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Aktion fehlgeschlagen.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  async function loadList(next = route) {
    const token = ++generation.current;
    const data = await api({
      action: next === "sessions" ? "ris_sessions" : "source_list",
      search,
    });
    if (token === generation.current) setList(data);
  }
  async function openFinding(input: Row, preserveContext = false) {
    if (!leave()) return;
    setDirty(false);
    if (!preserveContext) setReturnContext(null);
    setSession(null);
    setRoute("findings");
    setDetail(null);
    await run(async () => {
      const d = await api({ action: "source_read", ...input });
      setDetail(d);
      setTitle(d.finding?.title ?? "");
    });
  }
  async function openSession(id: string, agendaId = "") {
    if (!leave()) return;
    setDirty(false);
    setRoute("sessions");
    setDetail(null);
    await run(async () => {
      const d = await api({ action: "ris_read", sessionId: id });
      setSession(d);
      setTopId(agendaId);
    });
  }
  async function refreshSession() {
    if (session) {
      setSession(
        await api({ action: "ris_read", sessionId: session.session.id }),
      );
    }
  }
  useEffect(() => {
    setRoute(mode);
    setDetail(null);
    setSession(null);
    setDirty(false);
    if (initialFindingId && mode === "findings") {
      void openFinding({ findingId: initialFindingId });
    } else void run(() => loadList(mode));
  }, [mode, initialFindingId]);
  const finding = detail?.finding,
    document = detail?.document,
    observation = detail?.observation;
  const versions = detail?.versions ?? [];
  const currentUrl = finding?.original_url ?? document?.source_url ??
    observation?.canonical_url;
  const currentTitle = finding?.title ??
    (document
      ? document.original_title || "Sitzungsunterlage"
      : observation
      ? "Quellenbeobachtung"
      : "Fundstellen");
  const items = [
    ...(list.findings ?? []).map((x: Row) => ({
      ...x,
      key: x.id,
      type: "finding",
      caption: x.title ?? "Fundstelle ohne Titel",
      input: { findingId: x.id },
    })),
    ...(list.observations ?? []).map((x: Row) => ({
      ...x,
      key: x.scope_id + x.external_id,
      type: "observation",
      caption: x.canonical_url,
      input: { scopeId: x.scope_id, externalId: x.external_id },
    })),
    ...(list.documents ?? []).map((x: Row) => ({
      ...x,
      key: x.version_id,
      type: "document",
      caption: x.title ?? "Sitzungsunterlage",
      source_name: "RIS Feldkirchen",
      input: { versionId: x.version_id },
    })),
  ].filter(
    (x) =>
      filter === "all" ||
      (filter === "accepted" ? x.type === "finding" : x.type !== "finding"),
  );
  async function accept() {
    await run(
      async () => {
        if (!observation) return;
        const result = await api({
          action: "source_accept",
          scopeId: observation.scope_id,
          externalId: observation.external_id,
          revision: observation.revision,
          fingerprint: observation.content_fingerprint,
          sourceId: observation.source_id,
          title,
          approval: true,
        });
        setDetail(
          await api({ action: "source_read", findingId: result.findingId }),
        );
        await loadList("findings");
      },
      "Fundstelle übernommen. Es wurde kein Ereignis und keine Meldung automatisch angelegt.",
    );
  }
  if (assignment && finding) {
    return (
      <EventAssignmentView
        context={currentTitle}
        target={{ findingId: finding.id }}
        registerLeaveGuard={(guard) => {
          assignmentGuard.current = guard;
        }}
        linkedIds={(detail?.events ?? []).map((e: Row) => e.id)}
        suggestion={{
          title: finding.title,
          date: finding.published_at,
          summary: "",
        }}
        api={api}
        eventLock={eventLock}
        onCancel={() => setAssignment(false)}
        onDone={async () => {
          setDetail(
            await api({
              action: "source_read",
              ...(document
                ? { versionId: document.version_id }
                : { findingId: finding.id }),
            }),
          );
          setAssignment(false);
        }}
      />
    );
  }
  return (
    <div className="source-workspace">
      <nav className="breadcrumbs" aria-label="Brotkrumen">
        <button
          onClick={() => {
            if (leave()) onHome();
          }}
        >
          Dashboard
        </button>
        <span>›</span>
        <button
          onClick={() => {
            if (!leave()) return;
            setDirty(false);
            setDetail(null);
            setSession(null);
            void run(() => loadList());
          }}
        >
          {route === "sessions" ? "Sitzungen" : "Fundstellen"}
        </button>
        {(detail || session) && (
          <>
            <span>›</span>
            <span aria-current="page">
              {session
                ? `${session.session.committee_name ?? "Sitzung"} · ${
                  date(session.session.session_date)
                }`
                : currentTitle}
            </span>
          </>
        )}
      </nav>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Recherche · Redaktion</p>
          <h1>
            {session
              ? `${session.session.committee_name ?? "Sitzung"} · ${
                date(session.session.session_date)
              }`
              : detail
              ? currentTitle
              : route === "sessions"
              ? "Sitzungen"
              : "Fundstellen"}
          </h1>
        </div>
        <div className="source-actions ris-page-navigation">
          {session && topId && (
            <button type="button" disabled={busy} onClick={() => setTopId("")}>
              ‹ Zurück zur Tagesordnung
            </button>
          )}
        <button
          className="action-button"
          disabled={busy}
          onClick={() => {
            if (!leave()) return;
            setDirty(false);
            setDetail(null);
            setSession(null);
            void run(() => loadList());
          }}
        >
          Zurück zur Liste
        </button>
        </div>
      </div>
      {returnContext && detail && (
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            void openSession(returnContext.sessionId, returnContext.agendaId)}
        >
          {returnContext.number
            ? `Zurück zu TOP ${returnContext.number}`
            : "Zurück zur Sitzung"}
        </button>
      )}
      {route === "findings" && (
        <p className="source-release-note" role="note">
          Recherche und redaktionelle Prüfung im Entwicklungsstand.
        </p>
      )}
      {busy && <p role="status">Daten werden verarbeitet …</p>}
      {error && (
        <p role="alert" className="status-message error">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="status-message">
          {notice}
        </p>
      )}
      {dirty && (
        <p className="card-edit-state dirty">● Ungespeicherte Eingaben</p>
      )}
      {!detail && !session && (
        <Card
          title={route === "sessions"
            ? "Sitzungen im Bestand"
            : "Fundstellen und noch nicht übernommene Quellenbeobachtungen"}
          action={
            <button
              disabled={busy}
              aria-label="Liste aktualisieren"
              onClick={() => void run(() => loadList())}
            >
              ↻
            </button>
          }
        >
          <form
            className="finding-filter"
            onSubmit={(e) => {
              e.preventDefault();
              void run(() => loadList());
            }}
          >
            <label>
              Suche nach Titel, Quelle oder Adresse
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <button disabled={busy}>Suchen</button>
            {route === "findings" && (
              <label>
                Status
                <select
                  aria-label="Status"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">Alle</option>
                  <option value="accepted">Übernommene Fundstellen</option>
                  <option value="pending">
                    Übernahme offen / neue Fassung
                  </option>
                </select>
              </label>
            )}
          </form>
          {list.hasMore || list.sessions?.length > 100
            ? (
              <p role="status">
                Mehr als 100 Treffer. Bitte die Suche eingrenzen.
              </p>
            )
            : null}
          {route === "sessions"
            ? (list.sessions ?? []).slice(0, 100).map((s: Row) => (
              <div className="work-item" key={s.id}>
                <div>
                  <strong>{s.reference ?? "Sitzung ohne Referenz"}</strong>
                  <p>
                    {s.committee_name ?? "Gremium unbekannt"} ·{" "}
                    {date(s.session_date)}
                  </p>
                </div>
                <ActionIcon label="Sitzung öffnen" disabled={busy} onClick={()=>void openSession(s.id)}>→</ActionIcon>
              </div>
            ))
            : items.map((x: Row) => (
              <div className="work-item" key={x.key}>
                <div>
                  <strong>{x.caption}</strong>
                  <p>
                    {x.source_name} · {x.type === "finding"
                      ? "Übernommene Fundstelle"
                      : "Übernahme offen / neue Fassung"}
                  </p>
                </div>
                <ActionIcon label="Fundstelle öffnen" disabled={busy} onClick={()=>void openFinding(x.input)}>→</ActionIcon>
              </div>
            ))}
          {!busy &&
            !error &&
            (route === "sessions" ? !list.sessions?.length : !items.length) && (
            <p>
              Keine passenden Einträge im erfassten Bestand. Das ist kein
              Nachweis, dass die Quelle keine Veröffentlichungen enthält.
            </p>
          )}
        </Card>
      )}
      {detail && (
        <div className="detail-grid">
          <div className="detail-content-column">
            <Card title="Inhalt und Herkunft">
              {document &&
                document.version_id !== document.latest_version_id && (
                <p role="alert">
                  Historische Dokumentfassung. Für eine neue Übernahme die
                  aktuelle Fassung öffnen.
                </p>
              )}
              <p>
                {finding
                  ? (
                    detail.originVerified
                      ? "Amtliche Herkunft: verifizierter RIS-Import. Redaktionelle Verwendung separat prüfen."
                      : "Übernommene Fundstelle – fachliche Beziehungen separat prüfen"
                  )
                  : (
                    detail.originVerified
                      ? "Amtliche Herkunft: verifizierter RIS-Import"
                      : <Status value="candidate" />
                  )}
              </p>
              <p>
                {finding?.source_name ??
                  observation?.source_name ??
                  "RIS Feldkirchen"}
              </p>
              <Link url={currentUrl} />
              <p>
                {observation
                  ? "Zuletzt geprüft"
                  : document?.observed_at || versions[0]?.observed_at ? "Stand der gespeicherten Fassung" : "Erstmals erfasst"}: {date(
                    document?.observed_at ??
                      observation?.last_seen_at ??
                      versions[0]?.observed_at ??
                      finding?.discovered_at,
                  )}
              </p>
              {document?.original_title && (
                <p>Originaltitel im RIS: {document.original_title}</p>
              )}
              <div className="ris-inline-row">
                <span>Originaldokument im RIS öffnen</span>
                <OriginalLink url={currentUrl} label="RIS-Original öffnen" />
              </div>
              <p>
                In FIB ist derzeit kein Dokumentvolltext gespeichert. Für den
                vollständigen Inhalt bitte die Originalquelle im RIS öffnen.
              </p>
            </Card>
            <Card title="Ereignisbezug" action={finding ? (
              <button disabled={busy} onClick={() => setAssignment(true)}>
                Ereignis zuordnen
              </button>
            ) : undefined}>
              {(detail.events ?? []).map((e: Row) => (
                <div className="work-item" key={e.id}>
                  <div>
                    <strong>{e.title}</strong>
                    <p>{e.justification ?? "Begründung noch nicht erfasst"}</p>
                  </div>
                  <div className="source-actions">
                    <ActionIcon
                      label="Ereignis öffnen"
                      onClick={() => {
                        if (leave()) {
                          onOpenEvent(e.id);
                        }
                      }}
                    >
                      →
                    </ActionIcon>
                    <ActionIcon
                      label={`Ereignisbezug zu ${e.title} entfernen`}
                      disabled={busy}
                      onClick={() => {
                        if (
                          window.confirm(
                            `Zuordnung zu „${e.title}“ entfernen? Das Ereignis bleibt erhalten.`,
                          )
                        ) {
                          void run(async () => {
                            await eventLock(e.id, () =>
                              api({
                                action: "unlink_finding",
                                eventId: e.id,
                                findingId: finding.id,
                              }));
                            setDetail(
                              await api({
                                action: "source_read",
                                ...(document
                                  ? { versionId: document.version_id }
                                  : { findingId: finding.id }),
                              }),
                            );
                          });
                        }
                      }}
                    >
                      🗑
                    </ActionIcon>
                  </div>
                </div>
              ))}
              {!detail.events?.length && (
                <p>Noch keinem Ereignis zugeordnet.</p>
              )}
              {(detail.contexts ?? []).map((c: Row, i: number) => (
                <div className="ris-inline-row" key={i}>
                  <span>
                    RIS-Zuordnung: {label(c.kind)}
                  </span>
                  <button type="button" disabled={busy}
                    onClick={() => void openSession(c.session_id, c.agenda_id ?? "")}>
                    Sitzung / TOP öffnen
                  </button>
                </div>
              ))}
            </Card>
          </div>
          {!finding && !document && (
            <aside className="detail-side-column">
              <Card title="Fundstelle übernehmen">
                <div className="stack">
                  <label>
                    Titel der Fundstelle *
                    <input
                      value={title}
                      maxLength={2000}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setDirty(true);
                      }}
                    />
                  </label>
                  <p>Die Übernahme legt keine Meldung an.</p>
                  <button className="primary" disabled={busy || !title.trim()}
                    onClick={() => void accept()}>
                    Fundstelle ausdrücklich übernehmen
                  </button>
                </div>
              </Card>
            </aside>
          )}
        </div>
      )}
      {session && (
        <RisSessionView
          key={session.session.id}
          data={session}
          busy={busy}
          onOpenEvent={onOpenEvent}
          selectedTopId={topId}
          onSelectTop={setTopId}
          registerLeaveGuard={(guard) => {
            assignmentGuard.current = guard;
          }}
          api={api}
          eventLock={eventLock}
          onOpenDocument={(versionId) => {
            const a = session.agenda.find((a: Row) => a.id === topId);
            setReturnContext({
              sessionId: session.session.id,
              agendaId: topId,
              number: a?.number ?? "",
            });
            void openFinding({ versionId }, true);
          }}
          onReload={refreshSession}
        />
      )}

    </div>
  );
}
