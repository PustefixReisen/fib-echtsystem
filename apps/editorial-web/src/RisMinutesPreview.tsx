import { RisSessionView } from "./RisSessionView.js";
import "./app.css";

/** Preview-only, static examples: never calls Supabase or modifies FIB data. */
const source = "https://buergerinfo-feldkirchen.digitalfabrix.de";
const minutes = source + "/getfile.asp?id=75785";
const sessionId = "minutes-preview-1031";
const agenda = [
  {
    id: "preview-top-2",
    session_id: sessionId,
    number: "2",
    title: "Errichtung einer Hundewiese – Entscheidung über das weitere Vorgehen",
    observed_treatment: "abgesetzt",
  },
  {
    id: "preview-top-3",
    session_id: sessionId,
    number: "3",
    title: "Schaffung einer innerörtlichen Parkanlage",
    observed_treatment: "abgelehnt",
  },
  {
    id: "preview-top-6",
    session_id: sessionId,
    number: "6",
    title: "Voranfrage zur Ansiedlung eines Rechenzentrums",
    observed_treatment: "behandelt",
  },
];
const data = {
  session: {
    id: sessionId,
    committee_name: "Gemeinderat",
    session_date: "2026-10-15",
    source_url: source + "/si0057.asp?__ksinr=1031",
  },
  agendaCoverage: {
    scope: "reference_excerpt",
    snapshotTopCount: 3,
    storedTopCount: 3,
    completeness: "unverified",
  },
  agenda,
  documents: [{
    id: "preview-minutes",
    document_id: "preview-minutes-doc",
    session_id: sessionId,
    agenda_id: null,
    kind: "minutes",
    source_url: minutes,
    title: "Originalniederschrift",
    reference: null,
  }],
  proposals: [],
  decisions: [{
    agenda_id: "preview-top-3",
    point_key: "1",
    version_id: "preview-v3",
    factual_summary: "Der Vorschlag, eine innerörtliche Parkanlage mit Tiny Forest, Biodiversitätsgarten, Wegen, Sitzgelegenheiten und Bepflanzung planen zu lassen, wurde abgelehnt.",
    result: "rejected",
    yes_count: 7,
    no_count: 13,
    abstention_count: null,
    source_changed: false,
  },{
    agenda_id: "preview-top-6",
    point_key: "1",
    version_id: "preview-v6a",
    factual_summary: "Der Gemeinderat beurteilte die Voranfrage für ein Rechenzentrum grundsätzlich positiv und beschloss, den Bebauungsplanentwurf entsprechend anzupassen.",
    result: "accepted",
    yes_count: 17,
    no_count: 2,
    abstention_count: null,
    source_changed: false,
  },{
    agenda_id: "preview-top-6",
    point_key: "2",
    version_id: "preview-v6b",
    factual_summary: "Die Verwaltung wurde beauftragt, eine anteilige Beteiligung des Investors an den Planungskosten zu prüfen und gegebenenfalls einen entsprechenden städtebaulichen Vertrag auszuarbeiten.",
    result: "accepted",
    yes_count: 19,
    no_count: 0,
    abstention_count: null,
    source_changed: false,
  }],
  events: [],
  mainEvents: [],
  sessionEvents: [],
  sessionRelated: { messages: [], processes: [], topics: [] },
};

export function RisMinutesPreview() {
  return (
    <main className="ris-minutes-preview">
      <header className="panel" style={{padding: "1rem", marginBottom: "1rem"}}>
        <h1>RIS-Niederschrift – Testdarstellung</h1>
        <p role="status"><strong>Nur Vorschau. Keine Anmeldung, keine Datenbankverbindung und keine Speicherung.</strong></p>
        <p>Historisch belegte Referenzausschnitte vom 15.10.2026, sachlich zusammengefasst.
          Diese drei TOPs sind keine vollständige Tagesordnung und keine bereits im Echtsystem
          redaktionell bestätigten Beschlussdaten.</p>
        <p>Bitte nacheinander TOP 2, TOP 3 und TOP 6 auswählen und prüfen, ob Behandlung,
          Beschlussinhalt und Abstimmung verständlich dargestellt werden.</p>
      </header>
      <RisSessionView data={data} busy={false}
        selectedTopId={undefined}
        onOpenEvent={() => {}}
        onOpenDocument={() => {}}
        onReload={async () => {}}
        api={async () => {throw new Error("In der Vorschau ist keine Datenänderung möglich.");}}
        eventLock={async () => {throw new Error("In der Vorschau ist keine Datenänderung möglich.");}}
      />
    </main>
  );
}
