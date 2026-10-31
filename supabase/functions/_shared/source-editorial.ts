import { type RisSql, RIS_ORIGIN } from "./ris-structure.ts";
import { risEditorial, type RisActor } from "./ris-editorial.ts";
import { acceptObservation } from "./reviewed-observation.ts";
function text(v: unknown, max = 2000) {
  if (typeof v !== "string" || !v.trim() || v.length > max)
    throw Error("invalid_source_input");
  return v.trim();
}
export async function sourceEditorial(
  tx: RisSql,
  actor: RisActor,
  input: Record<string, any>,
) {
  if (actor.kind !== "human" || actor.aal !== "aal2")
    throw Error("source_forbidden");
  const member = await tx.unsafe(
    "select user_id from fib.app_users where user_id=$1 and active and setup_status='active' and role in ('admin','editor') for share",
    [actor.userId],
  );
  if (!member.length) throw Error("source_forbidden");
  const query = "%" + String(input.search ?? "").slice(0, 200) + "%";
  if (input.action === "ris_sessions")
    return {
      sessions: await tx.unsafe(
        "select s.*,c.name committee_name from fib.ris_sessions s left join fib.ris_committees c on c.id=s.committee_id where coalesce(s.reference,'') ilike $1 or coalesce(c.name,'') ilike $1 order by s.session_date desc nulls last limit 101",
        [query],
      ),
    };
  if (input.action === "source_choices")
    return {
      events: await tx.unsafe(
        "select id,title from fib.events where status='confirmed' and title ilike $1 order by title limit 101",
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
  if (input.action === "source_review_relation")
    return risEditorial(tx, actor, { ...input, action: "ris_review_relation" });
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
        relationSuggestions: await tx.unsafe(
          "select r.*,p.title process_title,t.title topic_title,e.title event_title from fib.ris_relation_suggestions r join fib.event_findings ef on ef.event_id=r.event_id join fib.events e on e.id=r.event_id left join fib.processes p on p.id=r.process_id left join fib.topics t on t.id=r.topic_id where ef.finding_id=$1",
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
          "select e.id,e.title,ef.justification from fib.event_findings ef join fib.events e on e.id=ef.event_id where ef.finding_id=$1",
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
          "select d.*,v.id version_id,v.content_hash,v.extracted_text,v.observed_at,v.extraction_method from fib.ris_documents d join fib.ris_document_versions v on v.document_id=d.id where v.id=$1",
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
        sources,
        versions: await tx.unsafe(
          "select id,content_hash,observed_at,extraction_method from fib.ris_document_versions where document_id=$1 order by observed_at desc",
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
    )
      throw Error("invalid_review");
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
    )
      throw Error("invalid_review");
    const title = text(input.title),
      rationale = text(input.rationale);
    await tx.unsafe("select pg_advisory_xact_lock(hashtextextended($1,0))", [
      "source-event:" + input.requestId,
    ]);
    const finding = (
      await tx.unsafe("select id from fib.findings where id=$1", [
        input.findingId,
      ])
    )[0];
    if (!finding) throw Error("source_missing");
    const old = (
      await tx.unsafe(
        "select e.title,ef.finding_id from fib.events e left join fib.event_findings ef on ef.event_id=e.id where e.id=$1",
        [input.requestId],
      )
    )[0];
    if (old) {
      if (old.title !== title || old.finding_id !== finding.id)
        throw Error("request_conflict");
      return { eventId: input.requestId, reused: true };
    }
    await tx.unsafe(
      "insert into fib.events(id,title,status,confirmed_at) values($1,$2,'confirmed',now())",
      [input.requestId, title],
    );
    await tx.unsafe(
      "insert into fib.event_findings(event_id,finding_id,evidence_role,justification) values($1,$2,'source',$3)",
      [input.requestId, finding.id, rationale],
    );
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
