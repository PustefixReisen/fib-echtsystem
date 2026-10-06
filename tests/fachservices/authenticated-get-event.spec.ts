import {
  authenticatedGetEvent,
  type FibAppUserRepository,
  type FibAppUserRecord,
  type FibSqlExecutor,
  type SupabaseAuthClaimsClient,
} from '../../packages/fachservices/src/index.js';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

class FakeAuth implements SupabaseAuthClaimsClient {
  constructor(
    private readonly claims: {
      sub?: unknown;
      role?: unknown;
      aal?: unknown;
      session_id?: unknown;
      is_anonymous?: unknown;
    } | null,
  ) {}

  async getClaims() {
    return this.claims
      ? { data: { claims: this.claims }, error: null }
      : { data: null, error: { message: 'invalid token' } };
  }
}

class FakeAppUsers implements FibAppUserRepository {
  constructor(private readonly record: FibAppUserRecord | null) {}

  async findByUserId(): Promise<FibAppUserRecord | null> {
    return this.record;
  }
}

class FakeDb implements FibSqlExecutor {
  queryCount = 0;

  constructor(private readonly row: unknown) {}

  async queryOne<T>(): Promise<T | null> {
    this.queryCount += 1;
    return this.row as T | null;
  }
}

export async function caseAuthenticatedButNotFibMemberIsRejected() {
  const db = new FakeDb(null);
  const result = await authenticatedGetEvent(
    'jwt',
    'event-1',
    new FakeAuth({ sub: 'user-1', role: 'authenticated', aal: 'aal1' }),
    new FakeAppUsers(null),
    db,
  );

  assert(!result.ok && result.reason === 'fib_membership_missing', 'membership must be required');
  assert(db.queryCount === 0, 'FIB data must not be queried without membership');
}

export async function caseActiveFibMemberCanReadEvent() {
  const db = new FakeDb({
    id: 'event-1',
    title: 'Testereignis',
    summary: null,
    status: 'confirmed',
    occurred_at: null,
  });

  const result = await authenticatedGetEvent(
    'jwt',
    'event-1',
    new FakeAuth({ sub: 'user-1', role: 'authenticated', aal: 'aal2' }),
    new FakeAppUsers({ userId: 'user-1', role: 'editor', active: true }),
    db,
  );

  assert(result.ok, 'active FIB member should pass S0 read authorization');
  assert(result.event.id === 'event-1', 'expected event must be returned');
  assert(db.queryCount === 1, 'event query must run exactly once');
}

export async function caseInvalidTokenStopsBeforeMembershipAndDatabase() {
  const db = new FakeDb(null);
  const result = await authenticatedGetEvent(
    'invalid-jwt',
    'event-1',
    new FakeAuth(null),
    new FakeAppUsers({ userId: 'user-1', role: 'admin', active: true }),
    db,
  );

  assert(!result.ok && result.reason === 'invalid_token', 'invalid token must be rejected');
  assert(db.queryCount === 0, 'database must not be queried for an invalid token');
}
