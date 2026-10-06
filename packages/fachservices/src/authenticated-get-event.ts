import type { FibAppUserRepository } from './identity.js';
import { resolveHumanActor } from './identity.js';
import type { FibSqlExecutor } from './app-user-repository.js';
import { getEvent, type GetEventResult } from './get-event.js';
import {
  verifySupabaseAccessToken,
  type SupabaseAuthClaimsClient,
} from './supabase-auth.js';

export type AuthenticatedGetEventResult =
  | GetEventResult
  | {
      ok: false;
      reason:
        | 'invalid_token'
        | 'missing_subject'
        | 'unexpected_auth_role'
        | 'invalid_aal'
        | 'anonymous_auth_not_allowed'
        | 'fib_membership_missing'
        | 'fib_membership_inactive';
    };

/**
 * First complete FIB request path for a human user:
 * verified Supabase JWT -> fib.app_users membership -> central authorization -> fib.events.
 */
export async function authenticatedGetEvent(
  jwt: string,
  eventId: string,
  auth: SupabaseAuthClaimsClient,
  appUsers: FibAppUserRepository,
  db: FibSqlExecutor,
): Promise<AuthenticatedGetEventResult> {
  const verified = await verifySupabaseAccessToken(auth, jwt);

  if (!verified.ok) {
    return verified;
  }

  const actorResolution = await resolveHumanActor(verified.claims, appUsers);

  if (!actorResolution.ok) {
    return actorResolution;
  }

  return getEvent(actorResolution.actor, eventId, db);
}
