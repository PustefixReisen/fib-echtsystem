import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { SourceWorkspace } from "../../apps/editorial-web/src/SourceWorkspace";
import "../../apps/editorial-web/src/app.css";
const origin = "https://buergerinfo-feldkirchen.digitalfabrix.de";
const title = "Wegfall des Elternbeitragszuschusses in Höhe von 100 €";
const display = "Beschlussvorlage · 29.10.2026 · 5395/2026 · " + title;
const finding = {
  id: "f1",
  title: display,
  original_url: origin + "/getfile.asp?id=75714",
  source_name: "RIS Feldkirchen",
  published_at: "2026-10-29",
};
const doc: any = {
  id: "l1",
  document_id: "d1",
  finding_id: "f1",
  latest_version_id: "v1",
  version_id: "v1",
  session_id: "s1",
  agenda_id: "t2",
  kind: "proposal",
  status: "candidate",
  title,
  original_title: "Vorlage",
  reference: "5395/2026",
  observed_at: "2026-11-01",
  source_url: finding.original_url,
  content_author: "municipality",
  rights_evidence: "Synthetic permission only",
  has_pdf: true,
};
const events: any[] = [{
  id: "e1",
  title: "Pressebericht zur Kita-Finanzierung",
  event_date: "2026-10-20",
  summary: "Ein Geschehen außerhalb dieser Sitzung",
}];
let local: any[] = [], direct: any[] = [], findings: any[] = [finding];
let sessionLinks: any[] = [], mainLinks: any[] = [], mainEventFindings:any[] = [];
const observation = {
  scope_id: "news",
  external_id: "article",
  canonical_url: "https://www.feldkirchen.de/aktuelles/artikel",
  source_name: "Gemeinde Feldkirchen",
  source_id: "news",
  last_seen_at: "2026-11-01",
  revision: 1,
};
(window as any).calls = [];
(window as any).denyLock = false;
(window as any).failNext = false;
(window as any).legacyChoices = false;
const api = async (b: any) => {
  (window as any).calls.push(b);
  await new Promise((r) => setTimeout(r, 20));
  if ((window as any).failNext) {
    (window as any).failNext = false;
    throw Error("Vorübergehender Verbindungsfehler");
  }
  if (b.action === "source_choices") {
    return {
      events: events.filter((e) => {
        const term=(b.search ?? "").toLocaleLowerCase("de-DE");
        const date=e.event_date ?? "";
        const shownDate=date ? new Date(date).toLocaleDateString("de-DE") : "";
        const searchable=[e.title,e.summary ?? "",date,shownDate].join(" ").toLocaleLowerCase("de-DE");
        return searchable.includes(term) && ((window as any).legacyChoices || !b.agendaId ||
          (b.eventRole === "main_event"
            ? mainEventFindings.some((link:any)=>link.event_id===e.id)
            : !mainEventFindings.some((link:any)=>link.event_id===e.id) &&
              !sessionLinks.some((link:any)=>link.event_id===e.id) &&
              !mainLinks.some((link:any)=>link.event_id===e.id)));
      }),
      processes: [],
      topics: [],
      ...(b.agendaId && !(window as any).legacyChoices ? {scopedToAgendaId:b.agendaId,scopedRole:b.eventRole} : {}),
    };
  }
  if (b.action === "ris_sessions") {
    return {
      sessions: [{
        id: "s1",
        reference: "GR/440/2026",
        committee_name: "Gemeinderat",
        session_date: "2026-10-29",
      }],
    };
  }
  if (b.action === "source_list") {
    return {
      findings,
      documents: [],
      observations: findings.length === 1 ? [observation] : [],
    };
  }
  if (b.action === "ris_read") {
    return {
      session: {
        id: "s1",
        committee_name: "Gemeinderat",
        session_date: "2026-10-29",
        source_url: origin + "/si0057.asp?__ksinr=1032",
      },
      agendaCoverage: {scope:"reference_excerpt",snapshotTopCount:2,storedTopCount:2,completeness:"unverified"},
      agenda: [{ id: "t2", number: "2", title }, {
        id: "t3",
        number: "3",
        title: "Beitragsanpassung der Kindertageseinrichtungen zum 01.01.2027",
      }],
      documents: [doc,...((window as any).showDecisionCases ? [{...doc,id:"minutes",agenda_id:null,kind:"minutes",status:"confirmed",source_url:origin+"/getfile.asp?id=75785"}] : [])],
      proposals: [{
        id: "p1",
        agenda_id: "t2",
        reference: "5395/2026",
        wording: "Must not render raw",
        source_url: origin + "/vo0050.asp?__kvonr=8640",
      }],
      topVotes: (window as any).showDecisionCases
        ? [{agenda_id:"t2",vote_index:1,result:"accepted",yes_count:10,no_count:2}]
        : [],
      events: local,
      mainEvents: mainLinks,
      mainEventFindings,
      sessionEvents: sessionLinks,
      sessionRelated: {messages: [],processes: [],topics: []},
    };
  }
  if (b.action === "ris_prepare_minutes_draft") {
    if(!b.agendaId || !b.versionId)throw Error("invalid source");
    return {status:"review_required",drafts:[
      {pointKey:"1",factualText:"Der Gemeinderat hat die weitere Planung einschließlich ihrer Finanzierung gebilligt und die Verwaltung mit der Umsetzung beauftragt.",vote:{status:"accepted",yes:10,no:2,abstention:null}},
      {pointKey:"2",factualText:"Ein weiterer Antrag wurde nach der Beratung zurückgezogen. Eine Entscheidung durch Abstimmung fand deshalb nicht statt.",vote:{status:"no_vote",yes:null,no:null,abstention:null}},
    ]};
  }
  if (b.action === "ris_suggest") {
    if (!b.payload?.manualSourceVerification || b.payload?.representation !== "complete_factual" ||
        b.payload?.usageRightsBasis || !b.payload?.wording?.trim())
      throw Error("Sachliche Beschlussprüfung fehlt");
    return {suggestionId:"synthetic-reviewed-suggestion",status:"pending"};
  }
  if (b.action === "ris_review_suggestion") {
    if (!b.rationale || b.suggestionId !== "synthetic-reviewed-suggestion") throw Error("invalid review");
    return {status:b.status};
  }
  if (b.action === "source_read") {
    if (b.scopeId) return { observation };
    const f = b.findingId
      ? findings.find((f) => f.id === b.findingId)
      : finding;
    return {
      finding: f,
      document: b.versionId ? doc : undefined,
      originVerified: f.id === "f1",
      events: events.filter((e) => direct.includes(e.id)),
      versions: [{
        id: b.versionId ? "v1" : "fv1",
        revision: b.versionId ? undefined : 1,
        observed_at: doc.observed_at,
        metadata: { risDocumentVersionId: "v1" },
      }],
      contexts: f.id === "f1"
        ? [{
          session_id: "s1",
          agenda_id: "t2",
          kind: "proposal",
          status: "candidate",
        }]
        : [],
    };
  }
  if (b.action === "source_pdf") {
    return {
      pdf: new Blob(["%PDF-1.4\n% synthetic viewer bytes"], {
        type: "application/pdf",
      }),
    };
  }
  if (b.action === "ris_link_session_event") {
    sessionLinks.push({event_id:b.eventId,event_title:events.find(e=>e.id===b.eventId)?.title,event_date:events.find(e=>e.id===b.eventId)?.event_date});
    return {};
  }
  if (b.action === "ris_unlink_session_event") {
    sessionLinks = sessionLinks.filter(e=>e.event_id!==b.eventId);
    return {};
  }
  if (b.action === "ris_link_main_event") {
    if (mainLinks.length && mainLinks[0].event_id!==b.eventId) throw Error("ris_top_main_event_already_assigned");
    mainLinks=[{agenda_id:b.agendaId,event_id:b.eventId,event_title:events.find(e=>e.id===b.eventId)?.title,event_date:events.find(e=>e.id===b.eventId)?.event_date}];
    return {};
  }
  if (b.action === "ris_unlink_main_event") {
    mainLinks=mainLinks.filter(e=>e.event_id!==b.eventId);
    return {};
  }
  if (b.action === "ris_link_event") {
    local.push({
      agenda_id: b.agendaId,
      event_id: b.eventId,
      event_title: events.find((e) => e.id === b.eventId).title,
      event_date: events.find((e) => e.id === b.eventId).event_date,
    });
    return {};
  }
  if (b.action === "ris_unlink_event") {
    local = local.filter((e) => e.event_id !== b.eventId);
    return {};
  }
  if (b.action === "link_finding") {
    direct.push(b.eventId);
    return {};
  }
  if (b.action === "unlink_finding") {
    direct = direct.filter((id) => id !== b.eventId);
    return {};
  }
  if (b.action === "source_create_event") {
    events.push({
      id: b.requestId,
      title: b.title,
      event_date: b.occurredAt,
      summary: b.summary,
    });
    if (b.sessionId) {
      sessionLinks.push({
        event_id:b.requestId,event_title:b.title,event_date:b.occurredAt,
      });
    }
    if (b.agendaId && b.mainEvent) {
      if (mainLinks.length) throw Error("ris_top_main_event_already_assigned");
      mainLinks.push({agenda_id:b.agendaId,event_id:b.requestId,event_title:b.title,event_date:b.occurredAt});
    } else if (b.agendaId) {
      local.push({
        agenda_id: b.agendaId,
        event_id: b.requestId,
        event_title: b.title,
        event_date: b.occurredAt,
      });
    } else direct.push(b.requestId);
    return { eventId: b.requestId };
  }
  if (b.action === "source_accept") {
    const id = "news-finding";
    findings.push({
      id,
      title: b.title,
      original_url: observation.canonical_url,
      source_name: "Gemeinde Feldkirchen",
    });
    return { findingId: id };
  }
  if (b.action === "ris_confirm_storage_rights") {
    doc.content_author = b.contentAuthor;
    doc.rights_evidence = b.evidence;
    return {};
  }
  if (b.action === "ris_revoke_storage_rights") {
    doc.content_author = "unknown";
    doc.has_pdf = false;
    return {};
  }
  if (b.action === "source_capture_pdf") {
    doc.has_pdf = true;
    return {};
  }
  throw Error("Unexpected test action " + b.action);
};
function Harness() {
  const [mode, setMode] = useState<"sessions" | "findings">("findings");
  return (
    <main style={{ padding: "1rem", maxWidth: 1440, margin: "auto" }}>
      <p>Isolierte UI-Prüfung mit simulierten Diensten.</p>
      <nav>
        <button onClick={() => setMode("findings")}>Fundstellenbereich</button>
        <button onClick={() => setMode("sessions")}>Sitzungsbereich</button>
      </nav>
      <SourceWorkspace
        mode={mode}
        api={api}
        eventLock={async (_id, work) => {
          if ((window as any).denyLock) {
            throw Error(
              "Ereignis wird bereits bearbeitet",
            );
          }
          return work();
        }}
        onHome={() => setMode("findings")}
        onOpenEvent={(id) => {
          (window as any).openedEvent = id;
        }}
      />
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<Harness />);
