import { RIS_ORIGIN, risUrl, type RisSql } from "./ris-structure.ts";
/** Run inside one transaction. Actor is supplied by verified server auth, never request JSON. */
export type RisActor = {
  userId: string;
  kind: "human" | "ai";
  aal: "aal1" | "aal2";
};
function required(v: unknown, max = 2000): string {
  if (typeof v !== "string" || !v.trim() || v.length > max)
    throw Error("invalid_ris_input");
  return v.trim();
}
async function one(tx: RisSql, q: string, p: any[] = []) {
  const r = await tx.unsafe(q, p);
  if (!r.length) throw Error("ris_object_missing");
  return r[0];
}
async function lockEvent(tx: RisSql, id: string, userId: string) {
  await one(
    tx,
    "select e.id from fib.events e join fib.edit_locks l on l.object_id=e.id and l.object_type='event' where e.id=$1 and e.status='confirmed' and l.user_id=$2 and l.expires_at>now() for update of e,l",
    [id, userId],
  );
}
async function audit(
  tx: RisSql,
  actor: RisActor,
  action: string,
  id: string,
  detail: unknown,
) {
  await tx.unsafe(
    "insert into fib.ris_review_log(actor_id,action,object_id,detail) values($1,$2,$3,$4::jsonb)",
    [actor.userId, action, id, JSON.stringify(detail)],
  );
}
export async function risEditorial(
  tx: RisSql,
  actor: RisActor,
  input: Record<string, any>,
) {
  if (actor.kind !== "human" || actor.aal !== "aal2")
    throw Error("ris_human_mfa_required");
  await one(
    tx,
    "select user_id from fib.app_users where user_id=$1 and active and setup_status='active' and role in ('admin','editor') for share",
    [actor.userId],
  );
  const action = required(input.action, 80);
  if (action === "ris_read") {
    const session = await one(
      tx,
      "select s.*,c.name committee_name from fib.ris_sessions s left join fib.ris_committees c on c.id=s.committee_id where s.id=$1",
      [input.sessionId],
    );
    const agenda = await tx.unsafe(
      "select a.*,v.revision observed_revision from fib.ris_agenda_items a join fib.ris_session_versions v on v.id=a.latest_snapshot_id where a.session_id=$1 order by a.number",
      [session.id],
    );
    const documents = await tx.unsafe(
      "select l.*,d.source_url,d.finding_id,d.latest_version_id,v.extracted_text,v.extraction_method,v.content_hash,v.observed_at from fib.ris_document_links l join fib.ris_documents d on d.id=l.document_id left join fib.ris_document_versions v on v.id=d.latest_version_id where l.session_id=$1",
      [session.id],
    );
    const decisions = await tx.unsafe(
      `select p.*,v.id version_id,v.wording,v.document_version_id,v.created_at,w.result,w.yes_count,w.no_count,w.abstention_count,w.evidence_quote,(d.latest_version_id<>v.document_version_id) source_changed from fib.ris_decision_points p join fib.ris_agenda_items a on a.id=p.agenda_id join fib.ris_decision_versions v on v.point_id=p.id join fib.ris_document_versions dv on dv.id=v.document_version_id join fib.ris_documents d on d.id=dv.document_id left join fib.ris_votes w on w.decision_version_id=v.id where a.session_id=$1`,
      [session.id],
    );
    const events = await tx.unsafe(
      "select ae.*,ep.process_id,et.topic_id from fib.ris_agenda_events ae join fib.ris_agenda_items a on a.id=ae.agenda_id left join fib.event_processes ep on ep.event_id=ae.event_id left join fib.event_topics et on et.event_id=ae.event_id where a.session_id=$1",
      [session.id],
    );
    const suggestions = await tx.unsafe(
      "select s.* from fib.ris_suggestions s join fib.ris_agenda_items a on a.id=s.agenda_id where a.session_id=$1",
      [session.id],
    );
    const proposals = await tx.unsafe(
      "select p.*,t.id text_id,t.wording,t.document_version_id from fib.ris_proposals p join fib.ris_agenda_items a on a.id=p.agenda_id left join fib.ris_proposal_texts t on t.proposal_id=p.id where a.session_id=$1",
      [session.id],
    );
    const approvals = await tx.unsafe(
      "select * from fib.ris_minutes_approvals where session_id=$1",
      [session.id],
    );
    const relationSuggestions = await tx.unsafe(
      "select distinct r.* from fib.ris_relation_suggestions r join fib.ris_agenda_events ae on ae.event_id=r.event_id join fib.ris_agenda_items a on a.id=ae.agenda_id where a.session_id=$1",
      [session.id],
    );
    const snapshots = await tx.unsafe("select id,revision,observed_at,content_hash,source_url,snapshot from fib.ris_session_versions where session_id=$1 order by revision desc limit 50", [session.id]);
    const reviewLog = await tx.unsafe(`select r.* from fib.ris_review_log r where r.object_id=$1 or r.object_id in(select id from fib.ris_agenda_items where session_id=$1 union select id from fib.ris_document_links where session_id=$1 union select s.id from fib.ris_suggestions s join fib.ris_agenda_items a on a.id=s.agenda_id where a.session_id=$1 union select s.id from fib.ris_relation_suggestions s join fib.ris_agenda_events ae on ae.event_id=s.event_id join fib.ris_agenda_items a on a.id=ae.agenda_id where a.session_id=$1) order by r.created_at desc limit 100`,[session.id]);
    return {
      snapshots, reviewLog,
      session,
      agenda,
      documents,
      decisions,
      events,
      suggestions,
      proposals,
      approvals,
      relationSuggestions,
    };
  }
  if (action === "ris_review_agenda_status") {
    if (
      !["unknown", "announced", "deferred", "treated", "withdrawn"].includes(
        input.status,
      )
    )
      throw Error("invalid_agenda_status");
    const rationale = required(input.rationale),
      quote = required(input.evidenceQuote, 30000);
    const evidence = await one(
      tx,
      `select v.extracted_text from fib.ris_document_versions v join fib.ris_documents d on d.id=v.document_id join fib.ris_document_links l on l.document_id=d.id join fib.ris_agenda_items a on a.session_id=l.session_id where a.id=$1 and (l.agenda_id=a.id or l.agenda_id is null) and l.status='confirmed' and v.id=$2 and d.latest_version_id=v.id and (l.kind in ('minutes','decision') or $3 in ('unknown','announced')) for update of a,d`,
      [input.agendaId, input.versionId, input.status],
    );
    if (!evidence.extracted_text?.includes(quote))
      throw Error("missing_exact_evidence");
    const old = await one(
      tx,
      "select treatment_status from fib.ris_agenda_items where id=$1",
      [input.agendaId],
    );
    await tx.unsafe(
      "update fib.ris_agenda_items set treatment_status=$2 where id=$1",
      [input.agendaId, input.status],
    );
    await audit(tx, actor, action, input.agendaId, {
      old: old.treatment_status,
      status: input.status,
      versionId: input.versionId,
      quote,
      rationale,
    });
    return { status: input.status };
  }
  if (action === "ris_confirm_minutes_approval") {
    const quote = required(input.evidenceQuote, 30000),
      rationale = required(input.rationale);
    const evidence = await one(
      tx,
      `select v.extracted_text from fib.ris_document_versions v join fib.ris_documents d on d.id=v.document_id join fib.ris_document_links l on l.document_id=d.id join fib.ris_sessions later on later.id=l.session_id join fib.ris_sessions earlier on earlier.id=$1 where later.id=$2 and later.session_date>earlier.session_date and l.kind='minutes' and l.status='confirmed' and l.agenda_id is null and v.id=$3 and d.latest_version_id=v.id for update of earlier,d`,
      [input.sessionId, input.approvingSessionId, input.versionId],
    );
    if (!evidence.extracted_text?.includes(quote))
      throw Error("missing_exact_evidence");
    await tx.unsafe(
      "insert into fib.ris_minutes_approvals(session_id,approving_session_id,document_version_id,evidence_quote,reviewed_by) values($1,$2,$3,$4,$5) on conflict do nothing",
      [
        input.sessionId,
        input.approvingSessionId,
        input.versionId,
        quote,
        actor.userId,
      ],
    );
    await tx.unsafe(
      "update fib.ris_sessions set minutes_approval='approved' where id=$1",
      [input.sessionId],
    );
    await audit(tx, actor, action, input.sessionId, {
      approvingSessionId: input.approvingSessionId,
      versionId: input.versionId,
      quote,
      rationale,
    });
    return { status: "approved" };
  }
  if (action === "ris_review_document") {
    const status = input.status,
      kind = input.kind;
    if (
      !["confirmed", "rejected"].includes(status) ||
      !["unknown", "proposal", "minutes", "decision", "attachment"].includes(
        kind,
      )
    )
      throw Error("invalid_ris_review");
    const old = await one(
      tx,
      "select * from fib.ris_document_links where id=$1 for update",
      [input.linkId],
    );
    // The browser supplies the exact version it displayed. Older internal callers
    // may classify a link without a version; this does not confirm any decision.
    if (input.versionId !== undefined) {
      const document = await one(tx, "select latest_version_id from fib.ris_documents where id=$1 for update", [old.document_id]);
      if (!input.versionId || document.latest_version_id !== input.versionId) throw Error("stale_ris_review");
    }
    if (kind === "minutes" && old.agenda_id)
      throw Error("minutes_are_session_wide");
    if (status === "confirmed" && kind === "unknown")
      throw Error("document_kind_required");
    const rationale = required(input.rationale);
    await tx.unsafe(
      "update fib.ris_document_links set kind=$2,status=$3,reviewed_by=$4,reviewed_at=now() where id=$1",
      [old.id, kind, status, actor.userId],
    );
    await audit(tx, actor, action, old.id, { old, kind, status, rationale, versionId: input.versionId ?? null });
    return { id: old.id };
  }
  if (action === "ris_accept_finding") {
    const v = await one(
      tx,
      "select v.*,d.source_url,d.finding_id,d.latest_version_id from fib.ris_document_versions v join fib.ris_documents d on d.id=v.document_id where v.id=$1 for update of d",
      [input.versionId],
    );
    if (v.latest_version_id !== v.id) throw Error("stale_ris_review");
    const source = await one(
      tx,
      "select homepage_url from fib.sources where id=$1 and active",
      [input.sourceId],
    );
    if (new URL(source.homepage_url).origin !== RIS_ORIGIN)
      throw Error("source_origin_mismatch");
    const title = required(input.title);
    await tx.unsafe("select pg_advisory_xact_lock(hashtextextended($1,0))", [
      input.sourceId + "|" + v.source_url,
    ]);
    // Reuse legacy download-query variants, but refuse ambiguous existing findings.
    const aliases = await tx.unsafe(
      "select id,original_url from fib.findings where source_id=$1 and original_url like $2 and original_url ~ $3",
      [
        input.sourceId,
        RIS_ORIGIN + "/getfile.asp?%",
        "[?&]id=" + new URL(v.source_url).searchParams.get("id") + "(&|$)",
      ],
    );
    const matches = aliases.filter(
      (row) => risUrl(row.original_url) === v.source_url,
    );
    if (matches.length > 1) throw Error("ambiguous_existing_findings");
    if (v.finding_id && matches[0]?.id !== v.finding_id)
      throw Error("finding_source_mismatch");
    const finding =
      matches[0] ??
      (await one(
        tx,
        "insert into fib.findings(source_id,title,original_url,content_fingerprint) values($1,$2,$3,$4) returning id",
        [input.sourceId, title, v.source_url, v.content_hash],
      ));
    const exists = await tx.unsafe(
      "select id from fib.finding_versions where finding_id=$1 and metadata->>'risDocumentVersionId'=$2",
      [finding.id, v.id],
    );
    if (!exists.length)
      await tx.unsafe(
        `insert into fib.finding_versions(finding_id,revision,fingerprint,original_url,observed_at,metadata) values($1,(select coalesce(max(revision),0)+1 from fib.finding_versions where finding_id=$1),$2,$3,$4,$5::jsonb)`,
        [
          finding.id,
          v.content_hash,
          v.source_url,
          v.observed_at,
          JSON.stringify({
            risDocumentVersionId: v.id,
            approvedBy: actor.userId,
            relationships: "not_confirmed",
          }),
        ],
      );
    await tx.unsafe("update fib.ris_documents set finding_id=$2 where id=$1", [
      v.document_id,
      finding.id,
    ]);
    await audit(tx, actor, action, v.id, { findingId: finding.id });
    return { findingId: finding.id };
  }
  if (action === "ris_link_event") {
    if (
      ![
        "proposal_publication",
        "treatment",
        "decision",
        "minutes_publication",
      ].includes(input.role)
    )
      throw Error("invalid_ris_event_role");
    await lockEvent(tx, input.eventId, actor.userId);
    // The ordinary editorial workflow must already have accepted the finding/event relation.
    await one(
      tx,
      `select a.id from fib.ris_agenda_items a join fib.ris_document_links l on l.session_id=a.session_id and (l.agenda_id=a.id or l.agenda_id is null) join fib.ris_documents d on d.id=l.document_id join fib.event_findings ef on ef.finding_id=d.finding_id where a.id=$1 and ef.event_id=$2 and l.status='confirmed'`,
      [input.agendaId, input.eventId],
    );
    await tx.unsafe(
      "insert into fib.ris_agenda_events(agenda_id,event_id,role,rationale,reviewed_by) values($1,$2,$3,$4,$5) on conflict do nothing",
      [
        input.agendaId,
        input.eventId,
        input.role,
        required(input.rationale),
        actor.userId,
      ],
    );
    const link = await one(
      tx,
      "select role from fib.ris_agenda_events where agenda_id=$1 and event_id=$2",
      [input.agendaId, input.eventId],
    );
    if (link.role !== input.role) throw Error("existing_event_role_conflict");
    await audit(tx, actor, action, input.agendaId, {
      eventId: input.eventId,
      role: input.role,
    });
    return { linked: true };
  }
  if (action === "ris_propose_relation") {
    if (
      !["ai", "editor"].includes(input.origin) ||
      Boolean(input.processId) === Boolean(input.topicId)
    )
      throw Error("invalid_ris_relation");
    if (
      input.topicId &&
      !["defining", "relevant", "supplementary"].includes(input.significance)
    )
      throw Error("invalid_significance");
    await one(
      tx,
      "select id from fib.events where id=$1 and status='confirmed'",
      [input.eventId],
    );
    const r = await one(
      tx,
      "insert into fib.ris_relation_suggestions(event_id,process_id,topic_id,significance,origin,rationale,created_by) values($1,$2,$3,$4,$5,$6,$7) returning id",
      [
        input.eventId,
        input.processId ?? null,
        input.topicId ?? null,
        input.topicId ? input.significance : null,
        input.origin,
        required(input.rationale),
        actor.userId,
      ],
    );
    return { suggestionId: r.id, status: "pending" };
  }
  if (action === "ris_review_relation") {
    if (!["confirmed", "rejected", "deferred"].includes(input.status))
      throw Error("invalid_ris_review");
    const rationale = required(input.rationale);
    const s = await one(
      tx,
      "select * from fib.ris_relation_suggestions where id=$1 for update",
      [input.suggestionId],
    );
    if (s.status !== "pending") {
      if (s.status === input.status) return { status: s.status, reused: true };
      throw Error("ris_review_already_final");
    }
    await lockEvent(tx, s.event_id, actor.userId);
    if (input.status === "confirmed") {
      // Existing rejected/deferred suggestions are not reopened; existing assignments are not overwritten.
      if (s.process_id) {
        await one(
          tx,
          "select id from fib.processes where id=$1 and status<>'archived' for share",
          [s.process_id],
        );
        await tx.unsafe(
          "insert into fib.event_processes(event_id,process_id,is_primary) values($1,$2,false) on conflict do nothing",
          [s.event_id, s.process_id],
        );
      } else {
        await one(
          tx,
          "select id from fib.topics where id=$1 and status<>'archived' for share",
          [s.topic_id],
        );
        const previous = await tx.unsafe(
          "select significance from fib.event_topics where event_id=$1 and topic_id=$2",
          [s.event_id, s.topic_id],
        );
        if (previous.length && previous[0].significance !== s.significance)
          throw Error("existing_significance_conflict");
        await tx.unsafe(
          "insert into fib.event_topics(event_id,topic_id,significance,significance_rationale) values($1,$2,$3,$4) on conflict do nothing",
          [s.event_id, s.topic_id, s.significance, rationale],
        );
      }
    }
    await tx.unsafe(
      "update fib.ris_relation_suggestions set status=$2,reviewed_by=$3,reviewed_at=now() where id=$1",
      [s.id, input.status, actor.userId],
    );
    await audit(tx, actor, action, s.id, { status: input.status, rationale });
    return { status: input.status };
  }
  if (action === "ris_suggest") {
    if (
      !["decision", "proposal_text"].includes(input.kind) ||
      !["ai", "editor"].includes(input.origin)
    )
      throw Error("invalid_ris_suggestion");
    const payload = input.payload;
    if (!payload || typeof payload !== "object")
      throw Error("invalid_ris_input");
    const wording = required(payload.wording, 30000),
      quote = required(payload.evidenceQuote, 30000);
    const v = await one(
      tx,
      "select v.*,d.latest_version_id from fib.ris_document_versions v join fib.ris_documents d on d.id=v.document_id where v.id=$1",
      [input.versionId],
    );
    if (v.id !== v.latest_version_id) throw Error("stale_ris_review");
    if (!v.extracted_text?.includes(quote) || !quote.includes(wording))
      throw Error("missing_exact_evidence");
    await one(
      tx,
      "select a.id from fib.ris_agenda_items a join fib.ris_document_links l on l.session_id=a.session_id and (l.agenda_id=a.id or l.agenda_id is null) where a.id=$1 and l.document_id=$2",
      [input.agendaId, v.document_id],
    );
    const r = await one(
      tx,
      "insert into fib.ris_suggestions(agenda_id,document_version_id,kind,origin,payload,created_by) values($1,$2,$3,$4,$5::jsonb,$6) returning id",
      [
        input.agendaId,
        v.id,
        input.kind,
        input.origin,
        JSON.stringify({ ...payload, wording, evidenceQuote: quote }),
        actor.userId,
      ],
    );
    return { suggestionId: r.id, status: "pending" };
  }
  if (action === "ris_review_suggestion") {
    if (!["confirmed", "rejected", "deferred"].includes(input.status))
      throw Error("invalid_ris_review");
    const rationale = required(input.rationale);
    const s = await one(
      tx,
      "select * from fib.ris_suggestions where id=$1 for update",
      [input.suggestionId],
    );
    if (s.status !== "pending") {
      if (s.status === input.status) return { status: s.status, reused: true };
      throw Error("ris_review_already_final");
    }
    if (input.status === "confirmed") {
      const p = s.payload;
      const v = await one(
        tx,
        "select v.*,d.latest_version_id from fib.ris_document_versions v join fib.ris_documents d on d.id=v.document_id where v.id=$1 for update of d",
        [s.document_version_id],
      );
      if (v.id !== v.latest_version_id) throw Error("stale_ris_review");
      if (
        !v.extracted_text?.includes(p.evidenceQuote) ||
        !p.evidenceQuote?.includes(p.wording)
      )
        throw Error("missing_exact_evidence");
      if (s.kind === "proposal_text") {
        await one(
          tx,
          `select p.id from fib.ris_proposals p join fib.ris_document_links l on l.agenda_id=p.agenda_id where p.id=$1 and p.agenda_id=$2 and l.document_id=$3 and l.kind='proposal' and l.status='confirmed'`,
          [p.proposalId, s.agenda_id, v.document_id],
        );
        await tx.unsafe(
          "insert into fib.ris_proposal_texts(proposal_id,document_version_id,wording,suggestion_id) values($1,$2,$3,$4)",
          [p.proposalId, v.id, p.wording, s.id],
        );
      } else {
        await lockEvent(tx, p.eventId, actor.userId);
        // A proposal PDF is never admissible as an actual decision. A reviewed minutes document is.
        await one(
          tx,
          `select a.id from fib.ris_agenda_items a join fib.ris_document_links l on l.session_id=a.session_id join fib.ris_documents d on d.id=l.document_id join fib.event_findings ef on ef.finding_id=d.finding_id where a.id=$1 and l.document_id=$2 and ((l.agenda_id is null and l.kind='minutes') or (l.agenda_id=a.id and l.kind='decision')) and l.status='confirmed' and ef.event_id=$3`,
          [s.agenda_id, v.document_id, p.eventId],
        );
        if (!["unknown", "accepted", "rejected", "no_vote"].includes(p.result))
          throw Error("unknown_vote_result_required");
        for (const c of ["yes", "no", "abstention"])
          if (p[c] != null && (!Number.isInteger(p[c]) || p[c] < 0))
            throw Error("invalid_vote_counts");
        const pointKey = required(p.pointKey, 200);
        await tx.unsafe(
          "insert into fib.ris_decision_points(agenda_id,event_id,point_key) values($1,$2,$3) on conflict do nothing",
          [s.agenda_id, p.eventId, pointKey],
        );
        const point = await one(
          tx,
          "select id from fib.ris_decision_points where agenda_id=$1 and event_id=$2 and point_key=$3",
          [s.agenda_id, p.eventId, pointKey],
        );
        const version = await one(
          tx,
          "insert into fib.ris_decision_versions(point_id,document_version_id,wording,suggestion_id) values($1,$2,$3,$4) returning id",
          [point.id, v.id, p.wording, s.id],
        );
        await tx.unsafe(
          "insert into fib.ris_votes(decision_version_id,result,yes_count,no_count,abstention_count,evidence_quote) values($1,$2,$3,$4,$5,$6)",
          [
            version.id,
            p.result,
            p.yes ?? null,
            p.no ?? null,
            p.abstention ?? null,
            p.evidenceQuote,
          ],
        );
      }
    }
    await tx.unsafe(
      "update fib.ris_suggestions set status=$2,reviewed_by=$3,reviewed_at=now() where id=$1",
      [s.id, input.status, actor.userId],
    );
    await audit(tx, actor, action, s.id, { status: input.status, rationale });
    return { status: input.status };
  }
  throw Error("unknown_ris_action");
}
