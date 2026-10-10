import type { FibActorContext, FibObjectRef } from '@fib/domain-contracts';
import { authorize } from './authorization.js';
import type { FibSqlExecutor } from './app-user-repository.js';
import { initializeLeadResponsibility, recordLastEdit } from './coordination.js';

function humanWriteAllowed(actor: FibActorContext, level: 'S1' | 'S2') {
  const decision = authorize(actor, { actionLevel: level });
  return decision.allowed && actor.actorKind === 'human' && !!actor.userId;
}

async function applyCreateCoordination(
  actor: FibActorContext,
  target: FibObjectRef,
  source: FibObjectRef,
  db: FibSqlExecutor,
) {
  const lead = await initializeLeadResponsibility(actor, target, source, db);
  if (!lead.ok) return { ok: false as const, reason: 'lead_initialization_failed' as const };

  const lastEdit = await recordLastEdit(actor, target, db);
  if (!lastEdit.ok) return { ok: false as const, reason: 'last_edit_failed' as const };

  return { ok: true as const, lead, lastEdit: lastEdit.lastEdit };
}

export async function confirmEvent(
  actor: FibActorContext,
  input: {
    findingId: string;
    title: string;
    summary?: string | null;
    occurredAt?: string | null;
  },
  db: FibSqlExecutor,
) {
  if (!humanWriteAllowed(actor, 'S2')) return { ok: false as const, reason: 'forbidden' as const };

  const finding = await db.queryOne<{ id: string }>(
    `select id from fib.findings where id = $1`,
    [input.findingId],
  );
  if (!finding) return { ok: false as const, reason: 'finding_not_found' as const };

  const event = await db.queryOne<{ id: string }>(
    `insert into fib.events(title, summary, status, occurred_at, confirmed_at, updated_at)
     values ($1, $2, 'confirmed', $3, now(), now())
     returning id`,
    [input.title, input.summary ?? null, input.occurredAt ?? null],
  );
  if (!event) return { ok: false as const, reason: 'write_failed' as const };

  const link = await db.queryOne<{ event_id: string }>(
    `insert into fib.event_findings(event_id, finding_id, evidence_role)
     values ($1, $2, 'source')
     on conflict (event_id, finding_id) do update set evidence_role = excluded.evidence_role
     returning event_id`,
    [event.id, input.findingId],
  );
  if (!link) return { ok: false as const, reason: 'finding_link_failed' as const, eventId: event.id };

  const coordination = await applyCreateCoordination(
    actor,
    { objectType: 'event', objectId: event.id },
    { objectType: 'finding', objectId: input.findingId },
    db,
  );
  if (!coordination.ok) return { ...coordination, eventId: event.id };

  return { ok: true as const, eventId: event.id, coordination };
}

export async function editMessageDraft(
  actor: FibActorContext,
  input: {
    eventId: string;
    title: string;
    teaser?: string | null;
    body?: string | null;
  },
  db: FibSqlExecutor,
) {
  if (!humanWriteAllowed(actor, 'S1')) return { ok: false as const, reason: 'forbidden' as const };

  const existing = await db.queryOne<{ id: string }>(
    `select id from fib.messages where event_id = $1`,
    [input.eventId],
  );

  if (existing) {
    const updated = await db.queryOne<{ id: string }>(
      `update fib.messages
          set title = $2, teaser = $3, body = $4, updated_at = now()
        where id = $1 and status = 'draft'
        returning id`,
      [existing.id, input.title, input.teaser ?? null, input.body ?? null],
    );
    if (!updated) return { ok: false as const, reason: 'message_not_editable' as const };

    const lastEdit = await recordLastEdit(actor, { objectType: 'message', objectId: updated.id }, db);
    if (!lastEdit.ok) return { ok: false as const, reason: 'last_edit_failed' as const, messageId: updated.id };

    return { ok: true as const, messageId: updated.id, created: false as const };
  }

  const event = await db.queryOne<{ id: string }>(`select id from fib.events where id = $1`, [input.eventId]);
  if (!event) return { ok: false as const, reason: 'event_not_found' as const };

  const created = await db.queryOne<{ id: string }>(
    `insert into fib.messages(event_id, title, teaser, body, status, updated_at)
     values ($1, $2, $3, $4, 'draft', now())
     returning id`,
    [input.eventId, input.title, input.teaser ?? null, input.body ?? null],
  );
  if (!created) return { ok: false as const, reason: 'write_failed' as const };

  const coordination = await applyCreateCoordination(
    actor,
    { objectType: 'message', objectId: created.id },
    { objectType: 'event', objectId: input.eventId },
    db,
  );
  if (!coordination.ok) return { ...coordination, messageId: created.id };

  return { ok: true as const, messageId: created.id, created: true as const, coordination };
}

export async function manageProcess(
  actor: FibActorContext,
  input: {
    processId?: string;
    sourceEventId?: string;
    title: string;
    description?: string | null;
    currentState?: string | null;
    status?: 'active' | 'dormant' | 'completed' | 'archived';
  },
  db: FibSqlExecutor,
) {
  if (!humanWriteAllowed(actor, 'S2')) return { ok: false as const, reason: 'forbidden' as const };

  if (input.processId) {
    const updated = await db.queryOne<{ id: string }>(
      `update fib.processes
          set title = $2, description = $3, current_state = $4, status = $5, updated_at = now()
        where id = $1
        returning id`,
      [input.processId, input.title, input.description ?? null, input.currentState ?? null, input.status ?? 'active'],
    );
    if (!updated) return { ok: false as const, reason: 'process_not_found' as const };

    const lastEdit = await recordLastEdit(actor, { objectType: 'process', objectId: updated.id }, db);
    if (!lastEdit.ok) return { ok: false as const, reason: 'last_edit_failed' as const, processId: updated.id };
    return { ok: true as const, processId: updated.id, created: false as const };
  }

  if (!input.sourceEventId) return { ok: false as const, reason: 'source_event_required' as const };

  const created = await db.queryOne<{ id: string }>(
    `insert into fib.processes(title, description, current_state, status, updated_at)
     values ($1, $2, $3, $4, now())
     returning id`,
    [input.title, input.description ?? null, input.currentState ?? null, input.status ?? 'active'],
  );
  if (!created) return { ok: false as const, reason: 'write_failed' as const };

  const linked = await db.queryOne<{ process_id: string }>(
    `insert into fib.event_processes(event_id, process_id, is_primary)
     values ($1, $2, true)
     on conflict (event_id, process_id) do update set is_primary = excluded.is_primary
     returning process_id`,
    [input.sourceEventId, created.id],
  );
  if (!linked) return { ok: false as const, reason: 'event_link_failed' as const, processId: created.id };

  const coordination = await applyCreateCoordination(
    actor,
    { objectType: 'process', objectId: created.id },
    { objectType: 'event', objectId: input.sourceEventId },
    db,
  );
  if (!coordination.ok) return { ...coordination, processId: created.id };

  return { ok: true as const, processId: created.id, created: true as const, coordination };
}

export async function manageTopic(
  actor: FibActorContext,
  input: {
    topicId?: string;
    sourceEventId?: string;
    title: string;
    guidingQuestion?: string | null;
    description?: string | null;
    currentState?: string | null;
    status?: 'active' | 'dormant' | 'archived';
    significance?: 'defining' | 'relevant' | 'supplementary';
  },
  db: FibSqlExecutor,
) {
  if (!humanWriteAllowed(actor, 'S2')) return { ok: false as const, reason: 'forbidden' as const };

  if (input.topicId) {
    const updated = await db.queryOne<{ id: string }>(
      `update fib.topics
          set title = $2, guiding_question = $3, description = $4, current_state = $5, status = $6, updated_at = now()
        where id = $1
        returning id`,
      [
        input.topicId,
        input.title,
        input.guidingQuestion ?? null,
        input.description ?? null,
        input.currentState ?? null,
        input.status ?? 'active',
      ],
    );
    if (!updated) return { ok: false as const, reason: 'topic_not_found' as const };

    const lastEdit = await recordLastEdit(actor, { objectType: 'topic', objectId: updated.id }, db);
    if (!lastEdit.ok) return { ok: false as const, reason: 'last_edit_failed' as const, topicId: updated.id };
    return { ok: true as const, topicId: updated.id, created: false as const };
  }

  if (!input.sourceEventId) return { ok: false as const, reason: 'source_event_required' as const };

  const created = await db.queryOne<{ id: string }>(
    `insert into fib.topics(title, guiding_question, description, current_state, status, updated_at)
     values ($1, $2, $3, $4, $5, now())
     returning id`,
    [
      input.title,
      input.guidingQuestion ?? null,
      input.description ?? null,
      input.currentState ?? null,
      input.status ?? 'active',
    ],
  );
  if (!created) return { ok: false as const, reason: 'write_failed' as const };

  const linked = await db.queryOne<{ topic_id: string }>(
    `insert into fib.event_topics(event_id, topic_id, significance)
     values ($1, $2, $3)
     on conflict (event_id, topic_id) do update set significance = excluded.significance, updated_at = now()
     returning topic_id`,
    [input.sourceEventId, created.id, input.significance ?? 'relevant'],
  );
  if (!linked) return { ok: false as const, reason: 'event_link_failed' as const, topicId: created.id };

  const coordination = await applyCreateCoordination(
    actor,
    { objectType: 'topic', objectId: created.id },
    { objectType: 'event', objectId: input.sourceEventId },
    db,
  );
  if (!coordination.ok) return { ...coordination, topicId: created.id };

  return { ok: true as const, topicId: created.id, created: true as const, coordination };
}
