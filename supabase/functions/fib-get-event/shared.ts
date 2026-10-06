// Deploybarer Adapter fuer die erste FIB-Edge-Function.
// Fachlich gespiegelt aus packages/fachservices; dort bleibt die kanonische Fachlogik.
// Dieser Adapter wird entfernt, sobald der Functions-Build Workspace-Pakete direkt bundelt.

export type FibHumanRole = 'editor' | 'admin';
export type MfaLevel = 'aal1' | 'aal2' | undefined;

export interface FibActorContext {
  actorKind: 'human';
  userId: string;
  role: FibHumanRole;
  active: boolean;
  mfaLevel?: MfaLevel;
}

export interface VerifiedAuthClaims {
  sub: string;
  aal?: 'aal1' | 'aal2';
  sessionId?: string;
  isAnonymous?: boolean;
}

export interface FibSqlExecutor {
  queryOne<T>(sql: string, params: readonly unknown[]): Promise<T | null>;
}

interface FibAppUserRow {
  user_id: string;
  role: FibHumanRole;
  active: boolean;
}

export class SqlFibAppUserRepository {
  constructor(private readonly db: FibSqlExecutor) {}

  async findByUserId(userId: string) {
    const row = await this.db.queryOne<FibAppUserRow>(
      `select user_id, role, active from fib.app_users where user_id = $1`,
      [userId],
    );
    return row
      ? { userId: row.user_id, role: row.role, active: row.active }
      : null;
  }
}

export async function resolveHumanActor(
  claims: VerifiedAuthClaims,
  appUsers: SqlFibAppUserRepository,
): Promise<{ ok: true; actor: FibActorContext } | { ok: false; reason: string }> {
  if (claims.isAnonymous) return { ok: false, reason: 'anonymous_auth_not_allowed' };

  const membership = await appUsers.findByUserId(claims.sub);
  if (!membership) return { ok: false, reason: 'fib_membership_missing' };
  if (!membership.active) return { ok: false, reason: 'fib_membership_inactive' };

  return {
    ok: true,
    actor: {
      actorKind: 'human',
      userId: membership.userId,
      role: membership.role,
      active: true,
      mfaLevel: claims.aal,
    },
  };
}

interface EventRow {
  id: string;
  title: string;
  summary: string | null;
  status: 'confirmed' | 'withdrawn' | 'merged';
  occurred_at: string | null;
}

export async function getEvent(actor: FibActorContext, eventId: string, db: FibSqlExecutor) {
  if (!actor.active || !actor.userId || !actor.role) {
    return { ok: false as const, reason: 'forbidden' as const };
  }

  const row = await db.queryOne<EventRow>(
    `select id, title, summary, status, occurred_at from fib.events where id = $1`,
    [eventId],
  );

  if (!row) return { ok: false as const, reason: 'not_found' as const };

  return {
    ok: true as const,
    event: {
      id: row.id,
      title: row.title,
      summary: row.summary,
      status: row.status,
      occurredAt: row.occurred_at,
    },
  };
}
