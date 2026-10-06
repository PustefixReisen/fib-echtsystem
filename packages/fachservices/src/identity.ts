import type { FibActorContext, FibHumanRole } from '@fib/domain-contracts';

export interface VerifiedAuthClaims {
  sub: string;
  aal?: 'aal1' | 'aal2';
  sessionId?: string;
  isAnonymous?: boolean;
}

export interface FibAppUserRecord {
  userId: string;
  role: FibHumanRole;
  active: boolean;
}

export interface FibAppUserRepository {
  findByUserId(userId: string): Promise<FibAppUserRecord | null>;
}

export type HumanActorResolution =
  | { ok: true; actor: FibActorContext }
  | {
      ok: false;
      reason:
        | 'anonymous_auth_not_allowed'
        | 'fib_membership_missing'
        | 'fib_membership_inactive';
    };

export async function resolveHumanActor(
  claims: VerifiedAuthClaims,
  appUsers: FibAppUserRepository,
): Promise<HumanActorResolution> {
  if (claims.isAnonymous) {
    return { ok: false, reason: 'anonymous_auth_not_allowed' };
  }

  const membership = await appUsers.findByUserId(claims.sub);

  if (!membership) {
    return { ok: false, reason: 'fib_membership_missing' };
  }

  if (!membership.active) {
    return { ok: false, reason: 'fib_membership_inactive' };
  }

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
