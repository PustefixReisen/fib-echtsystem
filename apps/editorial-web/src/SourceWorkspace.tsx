import { RisSessionView } from "./RisSessionView.js";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { sourceApi, withEventLock, type SourceApi } from "./source-api.js";

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
  return url && /^https:\/\//i.test(url) ? (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {children ?? "Originalquelle öffnen"}
    </a>
  ) : (
    <span>Originaladresse unbekannt</span>
  );
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
    [selection, setSelection] = useState<Row | null>(null),
    [session, setSession] = useState<Row | null>(null),
    [topId, setTopId] = useState("");
  const [choices, setChoices] = useState<Row>({
      events: [],
      processes: [],
      topics: [],
    }),
    [choiceSearch, setChoiceSearch] = useState("");
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [title, setTitle] = useState(""),
    [sourceId, setSourceId] = useState(""),
    [eventId, setEventId] = useState(""),
    [rationale, setRationale] = useState(""),
    [role, setRole] = useState("proposal_publication");
  const [relationType, setRelationType] = useState("process"),
    [targetId, setTargetId] = useState(""),
    [significance, setSignificance] = useState("relevant");
  const [docId, setDocId] = useState(""),
    [docKind, setDocKind] = useState("unknown"),
    [wording, setWording] = useState(""),
    [quote, setQuote] = useState(""),
    [suggestionKind, setSuggestionKind] = useState("proposal_text"),
    [proposalId, setProposalId] = useState(""),
    [pointKey, setPointKey] = useState(""),
    [result, setResult] = useState("unknown"),
    [yes, setYes] = useState(""),
    [no, setNo] = useState(""),
    [abstention, setAbstention] = useState("");
  const [statusValue, setStatusValue] = useState("unknown");
  const [statusDocumentId, setStatusDocumentId] = useState("");
  const [statusQuote, setStatusQuote] = useState("");
  const [approvingSessionId, setApprovingSessionId] = useState("");
  const [approvingSession, setApprovingSession] = useState<Row | null>(null);
  const [approvalDocumentId, setApprovalDocumentId] = useState("");
  const [approvalQuote, setApprovalQuote] = useState("");
  const [approvalChoices, setApprovalChoices] = useState<Row[]>([]);
  const [dirty, setDirty] = useState(false);
  const dirtyRef = useRef(false);
  dirtyRef.current = dirty;
  const inFlight = useRef(false);
  const generation = useRef(0);
  const requestId = useRef(crypto.randomUUID());
  const leave = () => {
    if (inFlight.current) return false;
    const ok =
      !dirtyRef.current || window.confirm("Ungespeicherte Eingaben verwerfen?");
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
  async function loadChoices() {
    setChoices(await api({ action: "source_choices", search: choiceSearch }));
  }
  async function openFinding(input: Row) {
    if (!leave()) return;
    setDirty(false);
    setSession(null);
    setRoute("findings");
    setSelection(input);
    setDetail(null);
    setEventId("");
    setRationale("");
    requestId.current = crypto.randomUUID();
    await run(async () => {
      const d = await api({ action: "source_read", ...input });
      setDetail(d);
      setTitle(d.finding?.title ?? "");
      setSourceId(d.sources?.length === 1 ? d.sources[0].id : "");
    });
  }
  async function openSession(id: string) {
    if (!leave()) return;
    setDirty(false);
    setRoute("sessions");
    setDetail(null);
    setSelection(null);
    await run(async () => {
      const d = await api({ action: "ris_read", sessionId: id });
      setSession(d);
      setTopId("");
      setDocId("");
      setRationale("");
      setStatusValue("unknown");
      setStatusDocumentId("");
      setStatusQuote("");
      setApprovingSessionId("");
      setApprovingSession(null);
      setApprovalDocumentId("");
      setApprovalQuote("");
      const candidateList = await api({ action: "ris_sessions", search: "" });
      setApprovalChoices((candidateList.sessions ?? []).filter((item: Row) =>
        item.id !== id && item.session_date > d.session.session_date
      ));
      await loadChoices();
    });
  }
  async function refreshSession() {
    if (session)
      setSession(
        await api({ action: "ris_read", sessionId: session.session.id }),
      );
  }
  useEffect(() => {
    setRoute(mode);
    setDetail(null);
    setSession(null);
    setDirty(false);
    if (initialFindingId && mode === "findings")
      void openFinding({ findingId: initialFindingId });
    else void run(() => loadList(mode));
  }, [mode, initialFindingId]);
  useEffect(() => {
    void api({ action: "source_choices" })
      .then(setChoices)
      .catch(() => {});
  }, [api]);
  const finding = detail?.finding,
    document = detail?.document,
    observation = detail?.observation;
  const top = session?.agenda.find((a: Row) => a.id === topId);
  const documents: Row[] =
    session?.documents.filter(
      (d: Row) => !d.agenda_id || d.agenda_id === topId,
    ) ?? [];
  const selectedDoc = documents.find((d) => d.id === docId);
  const confirmedStatusDocuments = (session?.documents ?? []).filter((d: Row) =>
    d.status === "confirmed" && d.latest_version_id &&
    (!topId || !d.agenda_id || d.agenda_id === topId) &&
    (statusValue === "unknown" || statusValue === "announced" ||
      d.kind === "minutes" || d.kind === "decision")
  );
  const approvalDocuments = (approvingSession?.documents ?? []).filter((d: Row) =>
    d.status === "confirmed" && d.kind === "minutes" &&
    !d.agenda_id && d.latest_version_id
  );
  const versions = detail?.versions ?? [];
  const currentUrl =
    finding?.original_url ?? document?.source_url ?? observation?.canonical_url;
  const currentTitle =
    finding?.title ??
    (document
      ? "RIS-Dokument"
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
      caption: x.title ?? "RIS-Dokument",
      source_name: "RIS Feldkirchen",
      input: { versionId: x.version_id },
    })),
  ].filter(
    (x) =>
      filter === "all" ||
      (filter === "accepted" ? x.type === "finding" : x.type !== "finding"),
  );
  async function accept() {
    await run(async () => {
      let result;
      if (document) {
        result = await api({
          action: "ris_accept_finding",
          versionId: document.version_id,
          sourceId,
          title,
        });
      } else
        result = await api({
          action: "source_accept",
          scopeId: observation.scope_id,
          externalId: observation.external_id,
          revision: observation.revision,
          fingerprint: observation.content_fingerprint,
          sourceId: observation.source_id,
          title,
          approval: true,
        });
      setSelection({ findingId: result.findingId });
      setDetail(
        await api({ action: "source_read", findingId: result.findingId }),
      );
      await loadList("findings");
    }, "Fundstelle übernommen. Es wurde kein Ereignis und keine Meldung automatisch angelegt.");
  }
  async function linkEvent() {
    await run(async () => {
      await eventLock(eventId, () =>
        api({
          action: "link_finding",
          eventId,
          findingId: finding.id,
          justification: rationale,
        }),
      );
      setDetail(await api({ action: "source_read", findingId: finding.id }));
    }, "Fundstelle dem Ereignis zugeordnet.");
  }
  async function createEvent() {
    await run(async () => {
      const r = await api({
        action: "source_create_event",
        findingId: finding.id,
        title,
        rationale,
        approval: true,
        requestId: requestId.current,
      });
      setEventId(r.eventId);
      setDetail(await api({ action: "source_read", findingId: finding.id }));
      await loadChoices();
    }, "Ereignis ausdrücklich bestätigt. Keine Meldung erstellt.");
  }
  async function reloadContext() {
    if (session) await refreshSession();
    else if (finding)
      setDetail(await api({ action: "source_read", findingId: finding.id }));
  }
  async function saveAgendaStatus() {
    if (!topId || !statusDocumentId || !statusQuote.trim() || !rationale.trim()) return;
    const evidence = confirmedStatusDocuments.find((d: Row) => d.id === statusDocumentId);
    if (!evidence) return;
    await run(async () => {
      await api({
        action: "ris_review_agenda_status",
        agendaId: topId,
        status: statusValue,
        versionId: evidence.latest_version_id,
        evidenceQuote: statusQuote.trim(),
        rationale: rationale.trim(),
      });
      await refreshSession();
    }, "Verfahrensstand mit Quellenbeleg geprüft.");
  }
  async function loadApprovingSession(id: string) {
    setApprovingSessionId(id);
    setApprovingSession(null);
    setApprovalDocumentId("");
    setApprovalQuote("");
    setDirty(true);
    if (!id) return;
    await run(async () => {
      const d = await api({ action: "ris_read", sessionId: id });
      if (!session || d.session.session_date <= session.session.session_date)
        throw Error("Genehmigende Sitzung muss zeitlich später liegen.");
      setApprovingSession(d);
    });
  }
  async function saveMinutesApproval() {
    const evidence = approvalDocuments.find((d: Row) => d.id === approvalDocumentId);
    if (!session || !evidence || !approvalQuote.trim() || !rationale.trim()) return;
    await run(async () => {
      await api({
        action: "ris_confirm_minutes_approval",
        sessionId: session.session.id,
        approvingSessionId,
        versionId: evidence.latest_version_id,
        evidenceQuote: approvalQuote.trim(),
        rationale: rationale.trim(),
      });
      await refreshSession();
    }, "Niederschriftsgenehmigung mit späterem Sitzungsbeleg bestätigt.");
  }
  async function reviewSuggestion(s: Row, status: string, relation = false) {
    await run(async () => {
      const work = () =>
        api({
          action: relation
            ? session
              ? "ris_review_relation"
              : "source_review_relation"
            : "ris_review_suggestion",
          suggestionId: s.id,
          status,
          rationale,
        });
      const id = relation ? s.event_id : s.payload?.eventId;
      if ((status === "confirmed" && id) || (relation && id))
        await eventLock(id, work);
      else await work();
      await reloadContext();
    }, "Redaktionelle Entscheidung gespeichert.");
  }
  const reviewButtons = (s: Row, relation = false) =>
    s.status === "pending" ? (
      <div className="source-actions">
        <button
          disabled={busy || !rationale.trim()}
          onClick={() => void reviewSuggestion(s, "confirmed", relation)}
        >
          Bestätigen
        </button>
        <button
          disabled={busy || !rationale.trim()}
          onClick={() => void reviewSuggestion(s, "deferred", relation)}
        >
          Zurückstellen
        </button>
        <button
          disabled={busy || !rationale.trim()}
          onClick={() => void reviewSuggestion(s, "rejected", relation)}
        >
          Ablehnen
        </button>
      </div>
    ) : null;
  const relationForm = (
    <details>
      <summary>Bestehenden Vorgang oder bestehendes Thema vorschlagen</summary>
      <div className="stack">
        <label>
          Zuordnungsart
          <select
            aria-label="Zuordnungsart"
            value={relationType}
            onChange={(e) => {
              setRelationType(e.target.value);
              setTargetId("");
            }}
          >
            <option value="process">Vorgang</option>
            <option value="topic">Thema</option>
          </select>
        </label>
        <label>
          Bestehendes Ziel
          <select
            aria-label="Bestehendes Ziel"
            value={targetId}
            onChange={(e) => {
              setTargetId(e.target.value);
              setDirty(true);
            }}
          >
            <option value="">Bitte auswählen</option>
            {(relationType === "process" ? choices.processes : choices.topics)
              .slice(0, 100)
              .map((t: Row) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
          </select>
        </label>
        {relationType === "topic" && (
          <label>
            Bedeutung
            <select
              aria-label="Bedeutung"
              value={significance}
              onChange={(e) => {
                setSignificance(e.target.value);
                setDirty(true);
              }}
            >
              <option value="defining">Prägend</option>
              <option value="relevant">Relevant</option>
              <option value="supplementary">Ergänzend</option>
            </select>
          </label>
        )}
        <button
          disabled={
            busy ||
            !eventId ||
            !targetId ||
            !rationale.trim() ||
            !(session
              ? session.events.some(
                  (e: Row) => e.agenda_id === topId && e.event_id === eventId,
                )
              : detail?.events?.some((e: Row) => e.id === eventId))
          }
          onClick={() =>
            void run(async () => {
              await api({
                action: session
                  ? "ris_propose_relation"
                  : "source_propose_relation",
                findingId: finding?.id,
                eventId,
                ...(relationType === "process"
                  ? { processId: targetId }
                  : { topicId: targetId, significance }),
                origin: "editor",
                rationale,
              });
              await reloadContext();
            }, "Zuordnungsvorschlag gespeichert – Bestätigung steht aus.")
          }
        >
          Zuordnung vorschlagen
        </button>
      </div>
    </details>
  );
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
              {(session ? `${session.session.committee_name ?? "Sitzung"} · ${date(session.session.session_date)}` : currentTitle)}
            </span>
          </>
        )}
      </nav>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Recherche · Redaktion</p>
          <h1>
            {session
              ? `${session.session.committee_name ?? "Sitzung"} · ${date(session.session.session_date)}`
              : detail
                ? currentTitle
                : route === "sessions"
                  ? "Sitzungen"
                  : "Fundstellen"}
          </h1>
        </div>
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
      {route === "findings" && <p className="source-release-note" role="note">Recherche und redaktionelle Prüfung im Entwicklungsstand.</p>}
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
          title={
            route === "sessions"
              ? "Sitzungen im Bestand"
              : "Fundstellen und noch nicht übernommene Quellenbeobachtungen"
          }
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
          {list.hasMore || list.sessions?.length > 100 ? (
            <p role="status">
              Mehr als 100 Treffer. Bitte die Suche eingrenzen.
            </p>
          ) : null}
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
                  <button
                    disabled={busy}
                    onClick={() => void openSession(s.id)}
                  >
                    Sitzung öffnen
                  </button>
                </div>
              ))
            : items.map((x: Row) => (
                <div className="work-item" key={x.key}>
                  <div>
                    <strong>{x.caption}</strong>
                    <p>
                      {x.source_name} ·{" "}
                      {x.type === "finding"
                        ? "Übernommene Fundstelle"
                        : "Übernahme offen / neue Fassung"}
                    </p>
                  </div>
                  <button
                    disabled={busy}
                    onClick={() => void openFinding(x.input)}
                  >
                    Fundstelle öffnen
                  </button>
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
                {finding ? (
                  "Übernommene Fundstelle – fachliche Beziehungen separat prüfen"
                ) : (
                  <Status value="candidate" />
                )}
              </p>
              <p>
                {finding?.source_name ??
                  observation?.source_name ??
                  "RIS Feldkirchen"}
              </p>
              <Link url={currentUrl} />
              <p>
                Beobachtet:{" "}
                {date(
                  document?.observed_at ??
                    observation?.last_seen_at ??
                    finding?.discovered_at,
                )}
              </p>
              <p>
                Herkunftsnachweis:{" "}
                <code>
                  {document?.content_hash ??
                    observation?.content_fingerprint ??
                    finding?.content_fingerprint ??
                    "Unbekannt"}
                </code>
              </p>
              {document?.extracted_text ? (
                <details>
                  <summary>Dokumenttext – interner Beleg</summary>
                  <pre className="source-evidence">
                    {document.extracted_text}
                  </pre>
                </details>
              ) : (
                <p>
                  Kein vollständiger Quelltext in dieser Ansicht gespeichert.
                  Originalquelle prüfen.
                </p>
              )}
            </Card>
            <Card title="Versionen">
              {versions.length ? (
                versions.map((v: Row) => (
                  <details key={v.id}>
                    <summary>
                      {v.revision
                        ? "Übernahmeversion " + v.revision
                        : "Dokumentfassung"}{" "}
                      · {date(v.observed_at)}
                    </summary>
                    <p>
                      <code>{v.fingerprint ?? v.content_hash}</code>
                    </p>
                    <p>
                      Prüfer: {v.metadata?.approvedBy ?? "Siehe Prüfverlauf"}
                    </p>
                    {document && (
                      <button
                        disabled={busy || v.id === document.version_id}
                        onClick={() => void openFinding({ versionId: v.id })}
                      >
                        Dokumentfassung öffnen
                      </button>
                    )}
                    {v.metadata?.risDocumentVersionId && (
                      <button
                        disabled={busy}
                        onClick={() =>
                          void openFinding({
                            versionId: v.metadata.risDocumentVersionId,
                          })
                        }
                      >
                        Beleg dieser Fassung öffnen
                      </button>
                    )}
                  </details>
                ))
              ) : (
                <p>
                  {observation
                    ? "Beobachtungsrevision " + observation.revision
                    : "Noch keine übernommene Version."}
                </p>
              )}
            </Card>
            <Card title="Redaktioneller Zusammenhang">
              {(detail.relationships ?? [])
                .filter((r: Row) => r.process_title || r.topic_title)
                .map((r: Row, i: number) => (
                  <p key={i}>
                    Vorgang: {r.process_title ?? "Nicht zugeordnet"} · Thema:{" "}
                    {r.topic_title ?? "Nicht zugeordnet"}
                  </p>
                ))}
              {(detail.relationSuggestions ?? []).map((r: Row) => (
                <div className="source-block" key={r.id}>
                  <Status value={r.status} />
                  <p>
                    {label(r.origin)} ·{" "}
                    {r.event_title ?? "Zugeordnetes Ereignis"} →{" "}
                    {r.process_title ??
                      r.topic_title ??
                      "Ziel außerhalb aktueller Auswahl"}{" "}
                    {r.significance ? `(${label(r.significance)})` : ""}
                  </p>
                  <p>{r.rationale}</p>
                  {r.reviewed_at && (
                    <p>
                      Geprüft: {date(r.reviewed_at)} · {r.reviewed_by} ·{" "}
                      {r.review_rationale ?? "Begründung im Prüfverlauf"}
                    </p>
                  )}
                  {reviewButtons(r, true)}
                </div>
              ))}

              {(detail.events ?? []).map((e: Row) => (
                <div className="work-item" key={e.id}>
                  <div>
                    <strong>{e.title}</strong>
                    <p>{e.justification ?? "Begründung noch nicht erfasst"}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (leave()) onOpenEvent(e.id);
                    }}
                  >
                    Ereignis öffnen
                  </button>
                </div>
              ))}
              {!detail.events?.length && (
                <p>Noch keinem Ereignis zugeordnet.</p>
              )}
              {(detail.contexts ?? []).map((c: Row, i: number) => (
                <div key={i}>
                  <Status value={c.status} />
                  <span> · {label(c.kind)} </span>
                  <button
                    disabled={busy}
                    onClick={() => void openSession(c.session_id)}
                  >
                    RIS-Kontext öffnen
                  </button>
                </div>
              ))}
            </Card>
          </div>
          <aside className="detail-side-column">
            <Card
              title={finding ? "Ereignis zuordnen" : "Fundstelle übernehmen"}
            >
              {!finding ? (
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
                  {document && (
                    <label>
                      Quelle *
                      <select
                        aria-label="Quelle *"
                        value={sourceId}
                        onChange={(e) => {
                          setSourceId(e.target.value);
                          setDirty(true);
                        }}
                      >
                        <option value="">Quelle auswählen</option>
                        {(detail.sources ?? []).map((s: Row) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <p>
                    Die Übernahme bestätigt keine unsichere RIS-Zuordnung und
                    erzeugt keine Meldung.
                  </p>
                  <button
                    className="primary"
                    disabled={
                      busy ||
                      !title.trim() ||
                      Boolean(
                        document &&
                          (!sourceId ||
                            document.version_id !== document.latest_version_id),
                      )
                    }
                    onClick={() => void accept()}
                  >
                    Fundstelle ausdrücklich übernehmen
                  </button>
                </div>
              ) : (
                <div className="stack">
                  <label>
                    Ereignisse suchen
                    <input
                      value={choiceSearch}
                      onChange={(e) => setChoiceSearch(e.target.value)}
                    />
                  </label>
                  <button disabled={busy} onClick={() => void run(loadChoices)}>
                    Auswahl aktualisieren
                  </button>
                  <label>
                    Bestehendes Ereignis
                    <select
                      aria-label="Bestehendes Ereignis"
                      value={eventId}
                      onChange={(e) => {
                        setEventId(e.target.value);
                        setDirty(true);
                      }}
                    >
                      <option value="">Bitte auswählen</option>
                      {choices.events.slice(0, 100).map((e: Row) => (
                        <option value={e.id} key={e.id}>
                          {e.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Begründung *
                    <textarea aria-label="Begründung *"
                      value={rationale}
                      maxLength={2000}
                      onChange={(e) => {
                        setRationale(e.target.value);
                        setDirty(true);
                      }}
                    />
                  </label>
                  <button
                    disabled={busy || !eventId || !rationale.trim()}
                    onClick={() => void linkEvent()}
                  >
                    Fundstelle zuordnen
                  </button>
                  <details>
                    <summary>
                      Neue Sachinformation als eigenes Ereignis bestätigen
                    </summary>
                    <p>
                      Zuerst prüfen, ob ein vorhandenes Ereignis ergänzt werden
                      kann.
                    </p>
                    <label>
                      Ereignistitel *
                      <input
                        value={title}
                        maxLength={2000}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          setDirty(true);
                        }}
                      />
                    </label>
                    <button
                      disabled={busy || !title.trim() || !rationale.trim()}
                      onClick={() => void createEvent()}
                    >
                      Neues Ereignis ausdrücklich bestätigen
                    </button>
                  </details>
                </div>
              )}
            </Card>
            {finding && <Card title="Vorgänge und Themen">{relationForm}</Card>}
          </aside>
        </div>
      )}
      {session && <RisSessionView key={session.session.id} data={session} busy={busy} onOpenEvent={onOpenEvent} onOpenDocument={(versionId) => void openFinding({ versionId })} onReload={refreshSession} />}

    </div>
  );
}
