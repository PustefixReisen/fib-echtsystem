import type { FibActorContext, FibAppUserProfile, FibHumanRole } from '@fib/domain-contracts';
import { authorize } from './authorization.js';
import type { FibSqlExecutor } from './app-user-repository.js';
import type { FibAuditSink } from './coordination.js';

interface AppUserProfileRow {
  user_id: string;
  full_name: string;
  call_name: string | null;
  role: FibHumanRole;
  active: boolean;
  setup_status: FibAppUserProfile['setupStatus'];
  created_at: string;
  updated_at: string;
}

function profile(row: AppUserProfileRow): FibAppUserProfile {
  return {
    userId: row.user_id,
    fullName: row.full_name,
    callName: row.call_name,
    role: row.role,
    active: row.active,
    setupStatus: row.setup_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function authorizeAdmin(actor: FibActorContext) {
  return authorize(actor, { actionLevel: 'S2', requiresAdmin: true, requiresMfaStepUp: true });
}

export async function manageAppUser(
  actor: FibActorContext,
  input: { userId: string; fullName: string; callName?: string | null; role: FibHumanRole; setupStatus: FibAppUserProfile['setupStatus'] },
  db: FibSqlExecutor,
  audit: FibAuditSink,
) {
  const decision = authorizeAdmin(actor);
  if (!decision.allowed || !actor.userId) return { ok: false as const, reason: decision.reason };

  const row = await db.queryOne<AppUserProfileRow>(
    `insert into fib.app_users(user_id, full_name, call_name, role, active, setup_status)
     values ($1, $2, $3, $4, true, $5)
     on conflict (user_id) do update set
       full_name = excluded.full_name,
       call_name = excluded.call_name,
       role = excluded.role,
       setup_status = excluded.setup_status,
       active = case when excluded.setup_status = 'deactivated' then false else fib.app_users.active end,
       updated_at = now()
     returning user_id, full_name, call_name, role, active, setup_status, created_at, updated_at`,
    [input.userId, input.fullName, input.callName ?? null, input.role, input.setupStatus],
  );
  if (!row) return { ok: false as const, reason: 'write_failed' as const };

  await audit.record({ actorUserId: actor.userId, action: 'manage_app_user', objectType: 'app_user', objectId: input.userId });
  return { ok: true as const, user: profile(row) };
}

export async function deactivateAppUser(
  actor: FibActorContext,
  userId: string,
  db: FibSqlExecutor,
  audit: FibAuditSink,
) {
  const decision = authorizeAdmin(actor);
  if (!decision.allowed || !actor.userId) return { ok: false as const, reason: decision.reason };

  const row = await db.queryOne<{ user_id: string }>(
    `update fib.app_users
        set active = false, setup_status = 'deactivated', updated_at = now()
      where user_id = $1
      returning user_id`,
    [userId],
  );
  if (!row) return { ok: false as const, reason: 'not_found' as const };

  await audit.record({ actorUserId: actor.userId, action: 'deactivate_app_user', objectType: 'app_user', objectId: userId });
  return { ok: true as const };
}
