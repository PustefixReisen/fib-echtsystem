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
    target: { agendaId: string } | { findingId: string };
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
      const r = await api({ action: "source_choices", search });
      if (token === generation.current) {
        setItems(r.events ?? []);
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
    if (
      !busy &&
      (!creating || !dirty ||
        window.confirm("Ungespeicherte Eingaben verwerfen?"))
    ) onCancel();
  };
  const heading = creating
    ? "Neu: Ereignis"
    : "agendaId" in target
    ? "Lokalen Bezug hinzufügen"
    : "Ereignisbezug hinzufügen";
  return (
    <div className="source-workspace">
      <nav className="breadcrumbs" aria-label="Pfadnavigation">
        {context} / {heading}
      </nav>
      <section className="panel stack">
        <h1>{heading}</h1>
        {error && <p role="alert">{error}</p>}
        {creating
          ? (
            <form
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
                {"agendaId" in target ? "dem TOP" : "dieser Fundstelle"}{" "}
                verbunden.
              </p>
              <div className="source-actions">
                <button disabled={busy || !title.trim()}>Speichern</button>
                <button type="button" disabled={busy} onClick={cancel}>
                  Abbrechen
                </button>
              </div>
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
              {!busy && !items.length && (
                <p>Keine passenden Ereignisse gefunden.</p>
              )}
              <div className="source-actions">
                <button
                  disabled={busy || !chosen}
                  onClick={() =>
                    void perform(async () => {
                      await eventLock(chosen, () =>
                        api(
                          "agendaId" in target
                            ? {
                              action: "ris_link_event",
                              ...target,
                              eventId: chosen,
                            }
                            : {
                              action: "link_finding",
                              ...target,
                              eventId: chosen,
                            },
                        ));
                      await onDone();
                    })}
                >
                  Zuordnen
                </button>
                <button disabled={busy} onClick={() => setCreating(true)}>
                  Neu: Ereignis
                </button>
                <button disabled={busy} onClick={cancel}>Abbrechen</button>
              </div>
            </>
          )}
      </section>
    </div>
  );
}
