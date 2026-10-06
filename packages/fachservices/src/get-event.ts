import type { FibActorContext } from '@fib/domain-contracts';
import { authorize } from './authorization.js';
import type { FibSqlExecutor } from './app-user-repository.js';

export interface EventSummary {
  id: string;
  title: string;
  summary: string | null;
  status: 'confirmed' | 'withdrawn' | 'merged';
  occurredAt: string | null;
}

interface EventRow {
  id: string;
  title: string;
  summary: string | null;
  status: 'confirmed' | 'withdrawn' | 'merged';
  occurred_at: string | null;
}

export type GetEventResult =
  | { ok: true; event: EventSummary }
  | { ok: false; reason: 'forbidden' | 'not_found' };

export async function getEvent(
  actor: FibActorContext,
  eventId: string,
  db: FibSqlExecutor,
): Promise<GetEventResult> {
  const decision = authorize(actor, { actionLevel: 'S0' });

  if (!decision.allowed) {
    return { ok: false, reason: 'forbidden' };
  }

  const row = await db.queryOne<EventRow>(
    `select id, title, summary, status, occurred_at
       from fib.events
      where id = $1`,
    [eventId],
  );

  if (!row) {
    return { ok: false, reason: 'not_found' };
  }

  return {
    ok: true,
    event: {
      id: row.id,
      title: row.title,
      summary: row.summary,
      status: row.status,
      occurredAt: row.occurred_at,
    },
  };
}
