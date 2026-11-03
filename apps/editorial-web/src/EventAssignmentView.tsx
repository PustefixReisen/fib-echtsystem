import { useEffect, useRef, useState } from "react";
import { type SourceApi, sourceApi, withEventLock } from "./source-api.js";
type Row = Record<string, any>;
/** Shared search and existing source_create_event workflow for both relationships. */
export function EventAssignmentView(
  {
    context,
    target,
    linkedIds,
    suggestion,
    onDone,
    onCancel,
    api = sourceApi,
    eventLock = withEventLock,
    registerLeaveGuard,
  }: {
    context: string;
    target: { agendaId: string; mainEvent?: boolean } | { sessionId: string } | { findingId: string };
    linkedIds: string[];
    suggestion: { title: string; date?: string; summary?: string };
    onDone: () => Promise<void>;
    onCancel: () => void;
    registerLeaveGuard?: (guard: () => boolean) => void;
    api?: SourceApi;
    eventLock?: typeof withEventLock;
  },
) {
  const [search, setSearch] = useState(""),
    [items, setItems] = useState<Row[]>([]),
    [chosen, setChosen] = useState("");
  const [creating, setCreating] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [scopeUnavailable, setScopeUnavailable] = useState(false);
  const [title, setTitle] = useState(suggestion.title),
    [date, setDate] = useState(suggestion.date?.slice(0, 10) ?? ""),
    [summary, setSummary] = useState(suggestion.summary ?? "");
  const [rationale, setRationale] = useState("");
  const requestId = useRef(crypto.randomUUID()),
    inFlight = useRef(false),
    generation = useRef(0);
  async function perform(work: () => Promise<void>) {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      await work();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Aktion fehlgeschlagen.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  async function searchEvents() {
    if (inFlight.current) return;
    const token = ++generation.current;
    await perform(async () => {
      const r = await api({ action: "source_choices", search,
        ...("agendaId" in target
          ? { agendaId: target.agendaId, eventRole: target.mainEvent ? "main_event" : "local_reference" }
          : {}),
      });
      if (token === generation.current) {
        // Older Preview backends silently ignore new server-side filters.
        // Never display potentially unrelated events without scope attestation.
        const scoped = "agendaId" in target;
        const role = scoped ? target.mainEvent ? "main_event" : "local_reference" : "";
        const validScope = !scoped ||
          (r.scopedToAgendaId === target.agendaId && r.scopedRole === role);
        setScopeUnavailable(!validScope);
        setItems(validScope ? (r.events ?? []) : []);
        setChosen("");
      }
    });
  }
  useEffect(() => {
    void searchEvents();
    return () => {
      generation.current++;
    };
  }, []);
  const dirty = title !== suggestion.title ||
    summary !== (suggestion.summary ?? "") ||
    date !== (suggestion.date?.slice(0, 10) ?? "") || Boolean(rationale);
  useEffect(() => {
    registerLeaveGuard?.(() =>
      !inFlight.current &&
      (!creating || !dirty ||
        window.confirm("Ungespeicherte Eingaben verwerfen?"))
    );
    const unload = (e: BeforeUnloadEvent) => {
      if (creating && dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", unload);
    return () => {
      registerLeaveGuard?.(() => true);
      window.removeEventListener("beforeunload", unload);
    };
  }, [creating, dirty, registerLeaveGuard]);
  const cancel = () => {
    if (busy) return;
    if (creating) {
      if (dirty && !window.confirm("Ungespeicherte Eingaben verwerfen?")) return;
      setCreating(false);
      return;
    }
    onCancel();
  };
  const heading = creating
    ? "Neu: Ereignis"
    : "sessionId" in target
    ? "Sitzungsereignis zuordnen"
    : "agendaId" in target
    ? target.mainEvent ? "Ereignis zum TOP zuordnen" : "Weiteres Ereignis zuordnen"
    : "Ereignisbezug hinzufügen";
  return (
    <div className="fib-assignment-overlay">
      <section className="fib-assignment-dialog" role="dialog" aria-modal="true"
        aria-label={heading} onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            cancel();
          }
        }}>
      <nav className="breadcrumbs" aria-label="Pfadnavigation">
        {context} / {heading}
      </nav>
      <div className="fib-assignment-content">
        <h1>{heading}</h1>
        {error && <p role="alert">{error}</p>}
        {creating
          ? (
            <form
              id="fib-event-create-form"
              className="stack"
              onSubmit={(e) => {
                e.preventDefault();
                void perform(async () => {
                  await api({
                    action: "source_create_event",
                    ...target,
                    title,
                    summary: summary || null,
                    occurredAt: date || null,
                    rationale: rationale || null,
                    approval: true,
                    requestId: requestId.current,
                  });
                  await onDone();
                });
              }}
            >
              <label>
                Ereignistitel *<input
                  required
                  maxLength={2000}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label>
                Ereignisdatum<input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              <label>
                Kurzbeschreibung<textarea
                  maxLength={10000}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </label>
              {"findingId" in target && (
                <label>
                  Begründung der Zuordnung (optional)<textarea
                    maxLength={2000}
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                  />
                </label>
              )}
              <p>
                Mit dem Speichern wird das Ereignis angelegt und mit{" "}
                {"sessionId" in target ? "der Sitzung" : "agendaId" in target ? "dem TOP" : "dieser Fundstelle"}{" "}
                verbunden.
              </p>
            </form>
          )
          : (
            <>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void searchEvents();
                }}
                className="finding-filter"
              >
                <label>
                  Vorhandenes Ereignis suchen<input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
                <button disabled={busy}>Suchen</button>
              </form>
              <h2>Suchergebnisse</h2>
              {scopeUnavailable && <p role="status">Die Vorschau verwendet noch einen älteren Ereignisdienst. Eine auf die aktuelle Sitzung beschränkte Ereignisauswahl ist hier nicht verfügbar.</p>}
              {!scopeUnavailable && "agendaId" in target && target.mainEvent && !items.length && !busy &&
                <p>Noch kein Ereignis mit einer RIS-Fundstelle aus dieser Sitzung vorhanden. Bitte ein neues Hauptereignis anlegen.</p>}
              <fieldset disabled={busy}>
                <legend>Ereignis auswählen</legend>
                {items.map((item) => (
                  <label
                    className="source-block event-search-result"
                    key={item.id}
                  >
                    <input
                      type="radio"
                      name="event-selection"
                      checked={chosen === item.id}
                      disabled={linkedIds.includes(item.id)}
                      onChange={() => setChosen(item.id)}
                    />
                    <span>
                      {item.title}
                      {item.event_date && (
                        <span>
                          · {new Date(item.event_date).toLocaleDateString(
                            "de-DE",
                          )}
                        </span>
                      )}
                      {linkedIds.includes(item.id) && " · Bereits zugeordnet"}
                      {item.summary && <small>{item.summary}</small>}
                    </span>
                  </label>
                ))}
              </fieldset>
              {!busy && !items.length && !scopeUnavailable && (!("agendaId" in target) || !target.mainEvent) && (
                <p>Keine passenden Ereignisse gefunden.</p>
              )}

            </>
          )}
      </div>
      <footer className="fib-assignment-footer">
        {creating ? (
          <>
            <button type="submit" form="fib-event-create-form" disabled={busy || !title.trim()}>Speichern</button>
            <button type="button" disabled={busy} onClick={cancel}>Abbrechen</button>
          </>
        ) : (
          <>
            <button type="button" disabled={busy || !chosen} onClick={() =>
              void perform(async () => {
                await eventLock(chosen, () => api(
                  "sessionId" in target
                    ? {action: "ris_link_session_event", ...target, eventId: chosen}
                    : "agendaId" in target
                    ? {action: target.mainEvent ? "ris_link_main_event" : "ris_link_event", ...target, eventId: chosen}
                    : {action: "link_finding", ...target, eventId: chosen},
                ));
                await onDone();
              })}>Zuordnen</button>
            {(!("agendaId" in target) || !!target.mainEvent) && (
              <button type="button" disabled={busy} onClick={() => setCreating(true)}>Neu: Ereignis</button>
            )}
            <button type="button" disabled={busy} onClick={cancel}>Abbrechen</button>
          </>
        )}
      </footer>
      </section>
    </div>
  );
}
