import {
  authenticatedGetEvent,
  type FibAppUserRepository,
  type FibSqlExecutor,
  type SupabaseAuthClaimsClient,
} from '../../packages/fachservices/src/index.js';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export async function runFachserviceAuthBoundaryRegression(): Promise<void> {
  const eventId = '11111111-1111-1111-1111-111111111111';
  let eventQueryCount = 0;

  const db: FibSqlExecutor = {
    async queryOne<T>(sql: string): Promise<T | null> {
      if (sql.includes('from fib.events')) {
        eventQueryCount += 1;
        return {
          id: eventId,
          title: 'Testereignis',
          summary: null,
          status: 'confirmed',
          occurred_at: null,
        } as T;
      }
      return null;
    },
  };

  const validAuth: SupabaseAuthClaimsClient = {
    async getClaims() {
      return {
        data: {
          claims: {
            sub: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            role: 'authenticated',
            aal: 'aal2',
            session_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            is_anonymous: false,
          },
        },
        error: null,
      };
    },
  };

  const missingMembership: FibAppUserRepository = {
    async findByUserId() {
      return null;
    },
  };

  const rejected = await authenticatedGetEvent(
    'verified-token-placeholder',
    eventId,
    validAuth,
    missingMembership,
    db,
  );

  assert(!rejected.ok, 'Authenticated user without FIB membership must be rejected.');
  assert(
    rejected.reason === 'fib_membership_missing',
    'Expected fib_membership_missing for authenticated non-member.',
  );
  assert(eventQueryCount === 0, 'FIB data must not be queried before membership succeeds.');

  const adminMembership: FibAppUserRepository = {
    async findByUserId(userId) {
      return { userId, role: 'admin', active: true };
    },
  };

  const allowed = await authenticatedGetEvent(
    'verified-token-placeholder',
    eventId,
    validAuth,
    adminMembership,
    db,
  );

  assert(allowed.ok, 'Active FIB admin must reach the S0 fach function.');
  assert(eventQueryCount === 1, 'FIB event should be queried exactly once after authorization.');

  const invalidAuth: SupabaseAuthClaimsClient = {
    async getClaims() {
      return { data: null, error: { message: 'invalid token' } };
    },
  };

  const invalidToken = await authenticatedGetEvent(
    'invalid-token-placeholder',
    eventId,
    invalidAuth,
    adminMembership,
    db,
  );

  assert(!invalidToken.ok, 'Invalid token must be rejected.');
  assert(invalidToken.reason === 'invalid_token', 'Expected invalid_token.');
  assert(eventQueryCount === 1, 'Invalid token must not cause another FIB data query.');
}
