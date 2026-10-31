import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { SourceWorkspace } from "../../apps/editorial-web/src/SourceWorkspace";
import "../../apps/editorial-web/src/app.css";
const origin = "https://buergerinfo-feldkirchen.digitalfabrix.de";
const article =
  "https://www.feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen/parkraumkonzept-der-gemeinde-feldkirchen";
const doc = {
  id: "link2",
  document_id: "doc2",
  session_id: "s1032",
  agenda_id: "t2",
  kind: "proposal",
  status: "candidate",
  source_url: origin + "/getfile.asp?id=75714",
  latest_version_id: "v1",
  version_id: "v1",
  content_hash: "a".repeat(64),
  observed_at: "2026-10-31",
  extracted_text: "Synthetischer UI-Prüftext: Vorschlag zur Förderung.",
  extraction_method: "synthetic-ui-fixture",
  finding_id: null,
};
let findings: any[] = [],
  events: any[] = [],
  suggestions: any[] = [],
  relations: any[] = [],
  links: any[] = [],
  topicLinks: any[] = [];
const observation = {
  scope_id: "news",
  external_id: article,
  canonical_url: article,
  content_fingerprint: "news-hash",
  revision: 1,
  source_id: "gemeinde",
  source_name: "Gemeinde Feldkirchen",
  last_seen_at: "2026-10-31",
};
(window as any).calls = [];
(window as any).failNext = false;
(window as any).denyLock = false;
const api = async (b: any) => {
  (window as any).calls.push(b);
  await new Promise((r) => setTimeout(r, 25));
  if ((window as any).failNext) {
    (window as any).failNext = false;
    throw Error("Die Dokumentfassung ist veraltet. Bitte neu laden.");
  }
  if (b.action === "source_choices")
    return {
      events,
      processes: [{ id: "p1", title: "Kita-Finanzierung" }],
      topics: [{ id: "theme1", title: "Kinder und Familien" }],
    };
  if (b.action === "ris_sessions")
    return {
      sessions: [
        {
          id: "s1032",
          reference: "GR/440/2026",
          committee_name: "Gemeinderat",
          session_date: "2026-10-29",
        },
      ],
    };
  if (b.action === "source_list")
    return {
      findings,
      documents: doc.finding_id
        ? []
        : [
            {
              ...doc,
              title: "Wegfall des Elternbeitragszuschusses in Höhe von 100 €",
            },
          ],
      observations: findings.some((f) => f.original_url === article)
        ? []
        : [observation],
      hasMore: false,
    };
  if (b.action === "source_read") {
    if (b.findingId) {
      const f = findings.find((f) => f.id === b.findingId);
      return {
        finding: f,
        versions: [
          {
            id: "fv1",
            revision: 1,
            fingerprint: "verified-hash",
            observed_at: "2026-10-31",
            metadata: { approvedBy: "Testredaktion" },
          },
        ],
        events: events.filter((e) => e.findingId === f.id),
        contexts:
          f.original_url === article
            ? []
            : [
                {
                  session_id: "s1032",
                  agenda_id: "t2",
                  kind: "proposal",
                  status: doc.status,
                },
              ],
        relationSuggestions: relations,
        relationships: topicLinks,
      };
    }
    if (b.versionId)
      return {
        document: doc,
        sources: [{ id: "ris", name: "RIS Feldkirchen" }],
        versions: [
          {
            id: "v1",
            content_hash: doc.content_hash,
            observed_at: doc.observed_at,
          },
        ],
        contexts: [
          {
            session_id: "s1032",
            agenda_id: "t2",
            kind: "proposal",
            status: doc.status,
          },
        ],
      };
    return { observation };
  }
  if (b.action === "ris_read")
    return {
      session: {
        id: "s1032",
        reference: "GR/440/2026",
        committee_name: "Gemeinderat",
        session_date: "2026-10-29",
        source_url: origin + "/si0057.asp?__ksinr=1032",
        current_revision: 1,
        minutes_approval: "unknown",
      },
      agenda: [
        {
          id: "t2",
          number: "2",
          title: "Wegfall des Elternbeitragszuschusses in Höhe von 100 €",
          treatment_status: "unknown",
          observed_revision: 1,
        },
        {
          id: "t3",
          number: "3",
          title:
            "Beitragsanpassung der Kindertageseinrichtungen zum 01.01.2027",
          treatment_status: "unknown",
          observed_revision: 1,
        },
      ],
      documents: [doc],
      decisions: [],
      proposals: [
        {
          id: "pr2",
          agenda_id: "t2",
          reference: "5395/2026",
          source_url: origin + "/vo0050.asp?__kvonr=8640",
        },
      ],
      suggestions,
      events: links,
      relationSuggestions: relations,
      approvals: [],
    };
  if (b.action === "ris_review_document") {
    doc.status = b.status;
    doc.kind = b.kind;
    return { id: doc.id };
  }
  if (b.action === "ris_accept_finding" || b.action === "source_accept") {
    const id = "f" + (findings.length + 1);
    findings.push({
      id,
      title: b.title,
      original_url: b.action === "source_accept" ? article : doc.source_url,
      source_name:
        b.action === "source_accept"
          ? "Gemeinde Feldkirchen"
          : "RIS Feldkirchen",
      discovered_at: "2026-10-31",
      source_id: b.sourceId,
    });
    if (b.action === "ris_accept_finding") doc.finding_id = id as any;
    return { findingId: id };
  }
  if (b.action === "source_create_event") {
    events.push({
      id: b.requestId,
      title: b.title,
      findingId: b.findingId,
      justification: b.rationale,
    });
    return { eventId: b.requestId };
  }
  if (b.action === "link_finding") {
    const e = events.find((e) => e.id === b.eventId);
    e.findingId = b.findingId;
    e.justification = b.justification;
    return {};
  }
  if (b.action === "ris_link_event") {
    links.push({ agenda_id: b.agendaId, event_id: b.eventId, role: b.role });
    return {};
  }
  if (b.action === "ris_suggest") {
    suggestions.push({
      id: "sug1",
      agenda_id: b.agendaId,
      document_version_id: b.versionId,
      kind: b.kind,
      origin: "editor",
      payload: b.payload,
      status: "pending",
    });
    return {};
  }
  if (b.action === "ris_review_suggestion") {
    suggestions.find((s) => s.id === b.suggestionId).status = b.status;
    return {};
  }
  if (b.action.endsWith("propose_relation")) {
    relations.push({
      id: "r1",
      event_id: b.eventId,
      topic_id: b.topicId,
      process_id: b.processId,
      rationale: b.rationale,
      origin: "editor",
      status: "pending",
    });
    return {};
  }
  if (b.action.endsWith("review_relation")) {
    relations[0].status = b.status;
    if (b.status === "confirmed")
      topicLinks.push({ topic_title: "Kinder und Familien" });
    return {};
  }
  throw Error("Unerwartete Testaktion " + b.action);
};
function Harness() {
  const [mode, setMode] = useState<"findings" | "sessions">("findings"),
    [opened, setOpened] = useState("");
  return (
    <main style={{ padding: "1rem", maxWidth: 1440, margin: "auto" }}>
      <p>
        Isolierter Prüfdatenbestand: reale Referenzbezeichnungen, synthetische
        Bearbeitungsdaten. Keine Produktionsverbindung.
      </p>
      <nav>
        <button onClick={() => setMode("findings")}>Fundstellenbereich</button>
        <button onClick={() => setMode("sessions")}>Sitzungsbereich</button>
      </nav>
      {opened && (
        <p role="status">Regulärer Ereigniseditor geöffnet: {opened}</p>
      )}
      <SourceWorkspace
        mode={mode}
        api={api}
        eventLock={async (_id, work) => {
          if ((window as any).denyLock)
            throw Error("Das Ereignis wird bereits bearbeitet.");
          return work();
        }}
        onHome={() => setMode("findings")}
        onOpenEvent={setOpened}
      />
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<Harness />);
