import { RIS_ORIGIN, type RisSql } from "./ris-structure.ts";
import { type RisActor, risEditorial } from "./ris-editorial.ts";
import { acceptObservation } from "./reviewed-observation.ts";
function text(v: unknown, max = 2000) {
  if (typeof v !== "string" || !v.trim() || v.length > max) {
    throw Error("invalid_source_input");
  }
  return v.trim();
}
export async function sourceEditorial(
  tx: RisSql,
  actor: RisActor,
  input: Record<string, any>,
) {
  if (actor.kind !== "human" || actor.aal !== "aal2") {
    throw Error("source_forbidden");
  }
  const member = await tx.unsafe(
    "select user_id from fib.app_users where user_id=$1 and active and setup_status='active' and role in ('admin','editor') for share",
    [actor.userId],
  );
  if (!member.length) throw Error("source_forbidden");
  const query = "%" + String(input.search ?? "").slice(0, 200) + "%";
  if (input.action === "ris_sessions") {
    return {
      sessions: await tx.unsafe(
        "select s.*,c.name committee_name from fib.ris_sessions s left join fib.ris_committees c on c.id=s.committee_id where coalesce(s.reference,'') ilike $1 or coalesce(c.name,'') ilike $1 order by s.session_date desc nulls last limit 101",
        [query],
      ),
    };
  }
  if (input.action === "source_choices") {
    return {
      events: await tx.unsafe(
        "select id,title,occurred_at event_date,summary from fib.events where status='confirmed' and title ilike $1 order by title limit 101",
        [query],
      ),
      processes: await tx.unsafe(
        "select id,title from fib.processes where status<>'archived' and title ilike $1 order by title limit 101",
        [query],
      ),
      topics: await tx.unsafe(
        "select id,title from fib.topics where status<>'archived' and title ilike $1 order by title limit 101",
        [query],
      ),
    };
  }
  if (input.action === "source_propose_relation") {
    const link = await tx.unsafe(
      "select event_id from fib.event_findings where event_id=$1 and finding_id=$2",
      [input.eventId, input.findingId],
    );
    if (!link.length) throw Error("source_missing");
    return risEditorial(tx, actor, {
      ...input,
      action: "ris_propose_relation",
    });
  }
  if (input.action === "source_review_relation") {
    return risEditorial(tx, actor, { ...input, action: "ris_review_relation" });
  }
  if (input.action === "source_list") {
    const findings = await tx.unsafe(
      `select f.*,s.name source_name from fib.findings f join fib.sources s on s.id=f.source_id where coalesce(f.title,'') ilike $1 or coalesce(f.original_url,'') ilike $1 or s.name ilike $1 order by f.discovered_at desc limit 101`,
      [query],
    );
    const observations = await tx.unsafe(
      `select o.*,sc.source_id,s.name source_name from fib.source_observations o join fib.source_scopes sc on sc.id=o.scope_id join fib.sources s on s.id=sc.source_id where (o.canonical_url ilike $1 or s.name ilike $1) and not exists(select 1 from fib.finding_versions v where v.metadata->>'scopeId'=o.scope_id::text and v.metadata->>'externalId'=o.external_id and v.metadata->>'originRevision'=o.revision::text) and not exists(select 1 from fib.ris_documents d where split_part(o.canonical_url,'&',1)=d.source_url) order by o.last_seen_at desc limit 101`,
      [query],
    );
    const documents = await tx.unsafe(
      `select d.*,v.content_hash,v.observed_at,v.id version_id,(select a.title from fib.ris_document_links l join fib.ris_agenda_items a on a.id=l.agenda_id where l.document_id=d.id limit 1) title from fib.ris_documents d join fib.ris_document_versions v on v.id=d.latest_version_id where (d.source_url ilike $1 or exists(select 1 from fib.ris_document_links l join fib.ris_agenda_items a on a.id=l.agenda_id where l.document_id=d.id and a.title ilike $1)) and not exists(select 1 from fib.finding_versions fv where fv.finding_id=d.finding_id and fv.metadata->>'risDocumentVersionId'=v.id::text) order by v.observed_at desc limit 101`,
      [query],
    );
    return {
      findings: findings.slice(0, 100),
      observations: observations.slice(0, 100),
      documents: documents.slice(0, 100),
      hasMore: [findings, observations, documents].some((a) => a.length > 100),
    };
  }
  if (input.action === "source_read") {
    if (input.findingId) {
      const f = (
        await tx.unsafe(
          "select f.*,s.name source_name from fib.findings f join fib.sources s on s.id=f.source_id where f.id=$1",
          [input.findingId],
        )
      )[0];
      if (!f) throw Error("source_missing");
      return {
        finding: f,
        originVerified: Boolean(
          (await tx.unsafe(
            "select id from fib.ris_documents where finding_id=$1",
            [f.id],
          )).length,
        ),
        relationSuggestions: await tx.unsafe(
          "select r.*,(select l.detail->>'rationale' from fib.ris_review_log l where l.object_id=r.id and l.action='ris_review_relation' order by l.created_at desc limit 1) review_rationale,p.title process_title,t.title topic_title,e.title event_title from fib.ris_relation_suggestions r join fib.event_findings ef on ef.event_id=r.event_id join fib.events e on e.id=r.event_id left join fib.processes p on p.id=r.process_id left join fib.topics t on t.id=r.topic_id where ef.finding_id=$1",
          [f.id],
        ),
        relationships: await tx.unsafe(
          "select e.id event_id,p.title process_title,t.title topic_title,et.significance from fib.event_findings ef join fib.events e on e.id=ef.event_id left join fib.event_processes ep on ep.event_id=e.id left join fib.processes p on p.id=ep.process_id left join fib.event_topics et on et.event_id=e.id left join fib.topics t on t.id=et.topic_id where ef.finding_id=$1",
          [f.id],
        ),
        versions: await tx.unsafe(
          "select * from fib.finding_versions where finding_id=$1 order by revision desc",
          [f.id],
        ),
        events: await tx.unsafe(
          "select e.id,e.title,e.occurred_at event_date,ef.justification from fib.event_findings ef join fib.events e on e.id=ef.event_id where ef.finding_id=$1",
          [f.id],
        ),
        contexts: await tx.unsafe(
          "select distinct l.session_id,l.agenda_id,l.status,l.kind from fib.ris_documents d join fib.ris_document_links l on l.document_id=d.id where d.finding_id=$1",
          [f.id],
        ),
      };
    }
    if (input.versionId) {
      const document = (
        await tx.unsafe(
          "select d.*,v.id version_id,v.content_hash,v.extracted_text,v.observed_at,v.extraction_method,v.content_author,v.rights_evidence,v.pdf_storage_key is not null as has_pdf from fib.ris_documents d join fib.ris_document_versions v on v.document_id=d.id where v.id=$1",
          [input.versionId],
        )
      )[0];
      if (!document) throw Error("source_missing");
      const sources = await tx.unsafe(
        "select id,name from fib.sources where active and rtrim(homepage_url,'/')=$1",
        [RIS_ORIGIN],
      );
      return {
        document,
        originVerified: true,
        finding: document.finding_id
          ? (await tx.unsafe("select * from fib.findings where id=$1", [
            document.finding_id,
          ]))[0]
          : null,
        events: document.finding_id
          ? await tx.unsafe(
            "select e.id,e.title,e.occurred_at event_date,ef.justification from fib.event_findings ef join fib.events e on e.id=ef.event_id where ef.finding_id=$1",
            [document.finding_id],
          )
          : [],
        sources,
        versions: await tx.unsafe(
          "select id,content_hash,observed_at,extraction_method,content_author,pdf_storage_key is not null as has_pdf from fib.ris_document_versions where document_id=$1 order by observed_at desc",
          [document.id],
        ),
        contexts: await tx.unsafe(
          "select session_id,agenda_id,status,kind from fib.ris_document_links where document_id=$1",
          [document.id],
        ),
      };
    }
    const observation = (
      await tx.unsafe(
        "select o.*,sc.source_id,s.name source_name from fib.source_observations o join fib.source_scopes sc on sc.id=o.scope_id join fib.sources s on s.id=sc.source_id where o.scope_id=$1 and o.external_id=$2",
        [input.scopeId, input.externalId],
      )
    )[0];
    if (!observation) throw Error("source_missing");
    return { observation };
  }
  if (input.action === "source_accept") {
    if (
      input.approval !== true ||
      !Number.isInteger(input.revision) ||
      input.revision < 1
    ) {
      throw Error("invalid_review");
    }
    const title = text(input.title);
    return acceptObservation(
      actor.userId,
      { ...input, title } as Parameters<typeof acceptObservation>[1],
      {
        transaction: (work) =>
          work({
            queryOne: async <T>(q: string, p: readonly unknown[]) =>
              ((await tx.unsafe(q, [...p]))[0] as T) ?? null,
          }),
      },
    );
  }
  if (input.action === "source_create_event") {
    if (
      input.approval !== true ||
      !/^[a-f0-9-]{36}$/i.test(input.requestId ?? "")
    ) {
      throw Error("invalid_review");
    }
    const title = text(input.title);
    const rationale =
      typeof input.rationale === "string" && input.rationale.trim()
        ? text(input.rationale)
        : null;
    const summary = input.summary == null ? null : text(input.summary, 10000);
    if (
      input.occurredAt != null && typeof input.occurredAt !== "string" ||
      input.rationale != null && typeof input.rationale !== "string"
    ) throw Error("invalid_source_input");
    const occurredAt = input.occurredAt || null;
    if (occurredAt && !Number.isFinite(Date.parse(occurredAt))) {
      throw Error("invalid_source_input");
    }
    if ([input.findingId,input.agendaId,input.sessionId].filter(Boolean).length !== 1 ||
        input.mainEvent && !input.agendaId) {
      throw Error("invalid_source_input");
    }
    await tx.unsafe("select pg_advisory_xact_lock(hashtextextended($1,0))", [
      "source-event:" + input.requestId,
    ]);
    const finding = input.findingId
      ? (await tx.unsafe("select id from fib.findings where id=$1", [
        input.findingId,
      ]))[0]
      : null;
    if (input.findingId && !finding) throw Error("source_missing");
    if (
      input.agendaId &&
      !(await tx.unsafe(
        "select id from fib.ris_agenda_items where id=$1 for update",
        [input.agendaId],
      )).length
    ) throw Error("source_missing");
    if (input.sessionId && !(await tx.unsafe(
      "select id from fib.ris_sessions where id=$1 for update",
      [input.sessionId],
    )).length) throw Error("source_missing");
    if (input.agendaId && input.mainEvent) {
      const primary = await tx.unsafe(
        "select event_id from fib.ris_agenda_events where agenda_id=$1 and role='main_event'",
        [input.agendaId],
      );
      // A retry with the same request ID must remain idempotent.
      if (primary.length && primary[0].event_id !== input.requestId) {
        throw Error("ris_top_main_event_already_assigned");
      }
    }
    const old = (
      await tx.unsafe(
        "select e.title,e.summary,e.occurred_at,ef.finding_id,ef.justification from fib.events e left join fib.event_findings ef on ef.event_id=e.id and ef.finding_id=$2 where e.id=$1",
        [input.requestId, finding?.id ?? null],
      )
    )[0];
    if (old) {
      if (
        old.title !== title ||
        old.summary !== summary ||
        (old.occurred_at ? new Date(old.occurred_at).toISOString() : null) !==
          (occurredAt ? new Date(occurredAt).toISOString() : null) ||
        old.finding_id !== (finding?.id ?? null) ||
        old.justification !== rationale
      ) {
        throw Error("request_conflict");
      }
      if (
        input.agendaId &&
        !(await tx.unsafe(
          "select event_id from fib.ris_agenda_events where agenda_id=$1 and event_id=$2 and role=$3",
          [input.agendaId, input.requestId, input.mainEvent ? "main_event" : "local_reference"],
        )).length
      ) throw Error("request_conflict");
      if (input.sessionId && !(await tx.unsafe(
        "select event_id from fib.ris_session_events where session_id=$1 and event_id=$2",
        [input.sessionId,input.requestId],
      )).length) throw Error("request_conflict");
      return { eventId: input.requestId, reused: true };
    }
    await tx.unsafe(
      "insert into fib.events(id,title,status,summary,occurred_at,confirmed_at) values($1,$2,'confirmed',$3,$4,now())",
      [input.requestId, title, summary, occurredAt],
    );
    if (finding) {
      await tx.unsafe(
        "insert into fib.event_findings(event_id,finding_id,evidence_role,justification) values($1,$2,'source',$3)",
        [input.requestId, finding.id, rationale],
      );
    }
    if (input.agendaId) {
      await tx.unsafe(
        "insert into fib.ris_agenda_events(agenda_id,event_id,role,reviewed_by) values($1,$2,$3,$4)",
        [input.agendaId, input.requestId, input.mainEvent ? "main_event" : "local_reference", actor.userId],
      );
    }
    if (input.sessionId) {
      await tx.unsafe(
        "insert into fib.ris_session_events(session_id,event_id,origin,reviewed_by) values($1,$2,'manual',$3)",
        [input.sessionId,input.requestId,actor.userId],
      );
    }
    await tx.unsafe(
      "insert into fib.lead_responsibilities(object_type,object_id,user_id) values('event',$1,$2)",
      [input.requestId, actor.userId],
    );
    await tx.unsafe(
      "insert into fib.object_last_edits(object_type,object_id,user_id) values('event',$1,$2)",
      [input.requestId, actor.userId],
    );
    return { eventId: input.requestId };
  }
  throw Error("unknown_source_action");
}
