import type {
  FibActorContext,
  FibEditLock,
  FibHandoverRequest,
  FibHandoverStatus,
  FibObjectRef,
} from '@fib/domain-contracts';
import { authorize } from './authorization.js';
import type { FibSqlExecutor } from './app-user-repository.js';

export interface FibAuditSink {
  record(event: {
    actorUserId: string;
    action: string;
    objectType?: string;
    objectId?: string;
    details?: Record<string, unknown>;
  }): Promise<void>;
}

interface LockRow {
  object_type: FibObjectRef['objectType'];
  object_id: string;
  user_id: string;
  acquired_at: string;
  renewed_at: string;
  expires_at: string;
}

interface HandoverRow {
  id: string;
  object_type: FibObjectRef['objectType'];
  object_id: string;
  requested_by_user_id: string;
  requested_user_id: string;
  message: string | null;
  status: FibHandoverStatus;
  created_at: string;
  responded_at: string | null;
}

function asLock(row: LockRow): FibEditLock {
  return {
    object: { objectType: row.object_type, objectId: row.object_id },
    userId: row.user_id,
    acquiredAt: row.acquired_at,
    renewedAt: row.renewed_at,
    expiresAt: row.expires_at,
  };
}

function requireHuman(actor: FibActorContext) {
  const decision = authorize(actor, { actionLevel: 'S2' });
  return decision.allowed && actor.actorKind === 'human' && !!actor.userId;
}

async function isActiveFibUser(userId: string, db: FibSqlExecutor) {
  const row = await db.queryOne<{ user_id: string }>(
    `select user_id
       from fib.app_users
      where user_id = $1 and active = true and setup_status = 'active'`,
    [userId],
  );
  return !!row;
}

export async function manageLeadResponsibility(
  actor: FibActorContext,
  object: FibObjectRef,
  userId: string | null,
  db: FibSqlExecutor,
) {
  if (!requireHuman(actor)) return { ok: false as const, reason: 'forbidden' as const };

  if (userId !== null && !(await isActiveFibUser(userId, db))) {
    return { ok: false as const, reason: 'target_user_not_active' as const };
  }

  if (userId === null) {
    await db.queryOne(
      `delete from fib.lead_responsibilities
        where object_type = $1 and object_id = $2
        returning object_id`,
      [object.objectType, object.objectId],
    );
  } else {
    await db.queryOne(
      `insert into fib.lead_responsibilities(object_type, object_id, user_id)
       values ($1, $2, $3)
       on conflict (object_type, object_id)
       do update set user_id = excluded.user_id, assigned_at = now()
       returning object_id`,
      [object.objectType, object.objectId, userId],
    );
  }

  return { ok: true as const };
}

export async function acquireEditLock(
  actor: FibActorContext,
  object: FibObjectRef,
  db: FibSqlExecutor,
  ttlSeconds = 120,
) {
  if (!requireHuman(actor) || !actor.userId) return { ok: false as const, reason: 'forbidden' as const };

  const row = await db.queryOne<LockRow>(
    `insert into fib.edit_locks(object_type, object_id, user_id, acquired_at, renewed_at, expires_at)
     values ($1, $2, $3, now(), now(), now() + ($4::text || ' seconds')::interval)
     on conflict (object_type, object_id)
     do update set
       user_id = excluded.user_id,
       acquired_at = case when fib.edit_locks.user_id = excluded.user_id then fib.edit_locks.acquired_at else now() end,
       renewed_at = now(),
       expires_at = excluded.expires_at
     where fib.edit_locks.user_id = excluded.user_id
        or fib.edit_locks.expires_at <= now()
     returning object_type, object_id, user_id, acquired_at, renewed_at, expires_at`,
    [object.objectType, object.objectId, actor.userId, ttlSeconds],
  );

  if (!row) {
    const current = await db.queryOne<LockRow>(
      `select object_type, object_id, user_id, acquired_at, renewed_at, expires_at
         from fib.edit_locks
        where object_type = $1 and object_id = $2 and expires_at > now()`,
      [object.objectType, object.objectId],
    );
    return { ok: false as const, reason: 'locked_by_other' as const, lock: current ? asLock(current) : null };
  }

  return { ok: true as const, lock: asLock(row) };
}

export async function renewEditLock(
  actor: FibActorContext,
  object: FibObjectRef,
  db: FibSqlExecutor,
  ttlSeconds = 120,
) {
  if (!requireHuman(actor) || !actor.userId) return { ok: false as const, reason: 'forbidden' as const };

  const row = await db.queryOne<LockRow>(
    `update fib.edit_locks
        set renewed_at = now(),
            expires_at = now() + ($4::text || ' seconds')::interval
      where object_type = $1 and object_id = $2 and user_id = $3 and expires_at > now()
      returning object_type, object_id, user_id, acquired_at, renewed_at, expires_at`,
    [object.objectType, object.objectId, actor.userId, ttlSeconds],
  );

  return row
    ? { ok: true as const, lock: asLock(row) }
    : { ok: false as const, reason: 'lock_missing_or_not_owned' as const };
}

export async function releaseEditLock(
  actor: FibActorContext,
  object: FibObjectRef,
  db: FibSqlExecutor,
) {
  if (!requireHuman(actor) || !actor.userId) return { ok: false as const, reason: 'forbidden' as const };

  const row = await db.queryOne<{ object_id: string }>(
    `delete from fib.edit_locks
      where object_type = $1 and object_id = $2 and user_id = $3
      returning object_id`,
    [object.objectType, object.objectId, actor.userId],
  );

  return row
    ? { ok: true as const }
    : { ok: false as const, reason: 'lock_missing_or_not_owned' as const };
}

export async function forceReleaseEditLock(
  actor: FibActorContext,
  object: FibObjectRef,
  db: FibSqlExecutor,
  audit: FibAuditSink,
) {
  const decision = authorize(actor, { actionLevel: 'S2', requiresAdmin: true, requiresMfaStepUp: true });
  if (!decision.allowed || !actor.userId) return { ok: false as const, reason: decision.reason };

  const removed = await db.queryOne<{ user_id: string }>(
    `delete from fib.edit_locks
      where object_type = $1 and object_id = $2
      returning user_id`,
    [object.objectType, object.objectId],
  );

  if (removed) {
    await audit.record({
      actorUserId: actor.userId,
      action: 'force_release_edit_lock',
      objectType: object.objectType,
      objectId: object.objectId,
      details: { previousUserId: removed.user_id },
    });
  }
  return { ok: true as const, removed: !!removed };
}

export async function requestHandover(
  actor: FibActorContext,
  object: FibObjectRef,
  requestedUserId: string,
  message: string | null,
  db: FibSqlExecutor,
) {
  if (!requireHuman(actor) || !actor.userId) return { ok: false as const, reason: 'forbidden' as const };
  if (!(await isActiveFibUser(requestedUserId, db))) {
    return { ok: false as const, reason: 'target_user_not_active' as const };
  }
  if (requestedUserId === actor.userId) {
    return { ok: false as const, reason: 'cannot_request_self' as const };
  }

  const row = await db.queryOne<HandoverRow>(
    `insert into fib.handover_requests(
       object_type, object_id, requested_by_user_id, requested_user_id, message
     ) values ($1, $2, $3, $4, $5)
     returning id, object_type, object_id, requested_by_user_id, requested_user_id,
               message, status, created_at, responded_at`,
    [object.objectType, object.objectId, actor.userId, requestedUserId, message],
  );
  if (!row) return { ok: false as const, reason: 'write_failed' as const };

  const request: FibHandoverRequest = {
    id: row.id,
    object: { objectType: row.object_type, objectId: row.object_id },
    requestedByUserId: row.requested_by_user_id,
    requestedUserId: row.requested_user_id,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
    respondedAt: row.responded_at,
  };
  return { ok: true as const, request };
}

export async function respondHandover(
  actor: FibActorContext,
  requestId: string,
  status: Extract<FibHandoverStatus, 'accepted' | 'declined'>,
  db: FibSqlExecutor,
) {
  if (!requireHuman(actor) || !actor.userId) return { ok: false as const, reason: 'forbidden' as const };

  const row = await db.queryOne<HandoverRow>(
    `update fib.handover_requests
        set status = $3, responded_at = now()
      where id = $1 and requested_user_id = $2 and status = 'open'
      returning id, object_type, object_id, requested_by_user_id, requested_user_id,
                message, status, created_at, responded_at`,
    [requestId, actor.userId, status],
  );
  return row
    ? { ok: true as const }
    : { ok: false as const, reason: 'not_found_or_not_recipient' as const };
}
