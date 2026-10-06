import type { VerifiedAuthClaims } from './identity.js';

export interface SupabaseClaimsPayload {
  sub?: unknown;
  role?: unknown;
  aal?: unknown;
  session_id?: unknown;
  is_anonymous?: unknown;
}

export interface SupabaseAuthClaimsClient {
  getClaims(jwt?: string): Promise<{
    data: { claims?: SupabaseClaimsPayload | null } | null;
    error: { message?: string } | null;
  }>;
}

export type VerifySupabaseAccessTokenResult =
  | { ok: true; claims: VerifiedAuthClaims }
  | {
      ok: false;
      reason:
        | 'invalid_token'
        | 'missing_subject'
        | 'unexpected_auth_role'
        | 'invalid_aal';
    };

/**
 * Verifies a Supabase access token through Auth.getClaims().
 * No authorization is derived from JWT user metadata. FIB membership and role
 * are resolved separately from fib.app_users.
 */
export async function verifySupabaseAccessToken(
  auth: SupabaseAuthClaimsClient,
  jwt: string,
): Promise<VerifySupabaseAccessTokenResult> {
  const { data, error } = await auth.getClaims(jwt);

  if (error || !data?.claims) {
    return { ok: false, reason: 'invalid_token' };
  }

  const raw = data.claims;

  if (typeof raw.sub !== 'string' || raw.sub.length === 0) {
    return { ok: false, reason: 'missing_subject' };
  }

  if (raw.role !== 'authenticated') {
    return { ok: false, reason: 'unexpected_auth_role' };
  }

  if (raw.aal !== undefined && raw.aal !== 'aal1' && raw.aal !== 'aal2') {
    return { ok: false, reason: 'invalid_aal' };
  }

  return {
    ok: true,
    claims: {
      sub: raw.sub,
      aal: raw.aal,
      sessionId: typeof raw.session_id === 'string' ? raw.session_id : undefined,
      isAnonymous: raw.is_anonymous === true,
    },
  };
}
