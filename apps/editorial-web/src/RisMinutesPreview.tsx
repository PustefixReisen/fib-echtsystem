import { RisSessionView } from "./RisSessionView.js";
import { RisMinutesReview } from "./RisMinutesReview.js";
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
    wording: "Der Gemeinderat beschließt einen Entwurf für die Schaffung einer innerörtlichen Parkanlage mit Tiny Forest, Biodiversitätsgarten, Wegen, Bänken und allgemeiner Bepflanzung erarbeiten zu lassen und dem Gemeinderat zur weiteren Beratung vorzulegen. Mittel für die Planung sind im Haushalt 2027 vorzusehen.",
    result: "rejected",
    yes_count: 7,
    no_count: 13,
    abstention_count: null,
    source_changed: false,
  },{
    agenda_id: "preview-top-6",
    point_key: "1",
    version_id: "preview-v6a",
    wording: "1. Der Gemeinderat beurteilt die vorliegende Voranfrage zur Ansiedlung eines Rechenzentrums grundsätzlich positiv. Der Vorentwurf des Bebauungsplanes ist entsprechend anzupassen. Ziele sind die Ausweisung eines Sondergebietes „Rechenzentrum“ im westlichen Bereich des Plangebietes sowie die Anpassung der baulichen Parameter.",
    result: "accepted",
    yes_count: 17,
    no_count: 2,
    abstention_count: null,
    source_changed: false,
  },{
    agenda_id: "preview-top-6",
    point_key: "2",
    version_id: "preview-v6b",
    wording: "2. Die Verwaltung wird beauftragt, aufgrund der relevanten Anpassungen an den Bebauungsplan eine anteilige Kostenbeteiligung an den Planungskosten des Investors in einem städtebaulichen Vertrag zu prüfen und ggf. einen entsprechenden Vertrag zu erarbeiten.\n\nDie Kosten des Verfahrens tragen der Investor und die Gemeinde Feldkirchen im Verhältnis der Grundstücksgrößen.",
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
        <p>Historische Referenzausschnitte der Niederschrift vom 15.10.2026, im Beschlusswortlaut ohne inhaltliche Kürzung dargestellt. PDF-Zeilenumbrüche und Trennstriche wurden nur für die Lesbarkeit aufgelöst.
          Diese drei TOPs sind keine vollständige Tagesordnung und keine bereits im Echtsystem
          redaktionell bestätigten Beschlussdaten.</p>
        <p>Bitte nacheinander TOP 2, TOP 3 und TOP 6 auswählen und prüfen, ob Behandlung,
          Beschlussinhalt und Abstimmung verständlich dargestellt werden.</p>
      </header>
      <RisSessionView data={data} busy={false} previewOriginalWording={true}
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

/** A complete UI trial with an in-memory stand-in, never real RIS writes. */
export function RisMinutesReviewPreview() {
  const demoSource = {
    source_url: minutes,
    latest_version_id: "preview-original-version",
    status: "confirmed",
    kind: "minutes",
  };
  return (
    <main className="ris-minutes-preview" style={{padding:"1rem"}}>
      <header className="panel" style={{padding:"1rem",marginBottom:"1rem"}}>
        <h1>RIS-Beschlussprüfung – vereinfachter Bedienungstest</h1>
        <p role="status"><strong>Reine Testansicht. Keine echte Rechtefreigabe, keine Anmeldung,
          keine Datenbankverbindung und keine Speicherung.</strong></p>
        <p>Ein inhaltlich vollständiger, eigenständig formulierter Entwurf ist bereits eingetragen. Prüfe ihn, ergänze bei Bedarf Details und bestätige das Abstimmungsergebnis.
          Die Einträge werden ausschließlich an einen simulierten Testdienst übergeben.
          In der echten Redaktion ist eine konkrete, dokumentierte Wiedergabeberechtigung erforderlich.</p>
      </header>
      <RisMinutesReview agendaId="preview-top-6" eventId="preview-main-event"
        source={demoSource}
        initialText={"Der Gemeinderat bewertet die geplante Ansiedlung eines Rechenzentrums positiv. Der Bebauungsplanentwurf soll hierfür angepasst werden. Im westlichen Teil des Plangebiets soll ein Sondergebiet für das Rechenzentrum vorgesehen werden; die baulichen Parameter sind entsprechend zu ändern."}
        onReload={async()=>{}}
        api={async(body)=>{
          if(body.action === "ris_suggest") return {suggestionId:"preview-pending",status:"pending"};
          if(body.action === "ris_review_suggestion") return {status:body.status};
          throw Error("In der Vorschau sind nur die beiden simulierten Prüfschritte zulässig.");
        }}
        eventLock={async(_eventId,work)=>work()}
      />
    </main>
  );
}
