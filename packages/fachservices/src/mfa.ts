export interface SupabaseMfaClient {
  enroll(params: {
    factorType: 'totp';
    friendlyName?: string;
  }): Promise<{
    data: {
      id: string;
      type: string;
      friendly_name?: string;
      totp?: {
        qr_code: string;
        secret: string;
        uri: string;
      };
    } | null;
    error: { message?: string } | null;
  }>;

  challengeAndVerify(params: {
    factorId: string;
    code: string;
  }): Promise<{
    data: unknown | null;
    error: { message?: string } | null;
  }>;

  getAuthenticatorAssuranceLevel(): Promise<{
    data: {
      currentLevel: 'aal1' | 'aal2' | null;
      nextLevel: 'aal1' | 'aal2' | null;
      currentAuthenticationMethods?: unknown[];
    } | null;
    error: { message?: string } | null;
  }>;
}

export type BeginTotpEnrollmentResult =
  | {
      ok: true;
      factorId: string;
      qrCode: string;
      secret: string;
      uri: string;
    }
  | { ok: false; reason: 'mfa_enroll_failed' | 'invalid_enrollment_response' };

export async function beginTotpEnrollment(
  mfa: SupabaseMfaClient,
  friendlyName = 'FIB Redaktionszugang',
): Promise<BeginTotpEnrollmentResult> {
  const { data, error } = await mfa.enroll({
    factorType: 'totp',
    friendlyName,
  });

  if (error || !data) {
    return { ok: false, reason: 'mfa_enroll_failed' };
  }

  if (!data.id || !data.totp?.qr_code || !data.totp.secret || !data.totp.uri) {
    return { ok: false, reason: 'invalid_enrollment_response' };
  }

  return {
    ok: true,
    factorId: data.id,
    qrCode: data.totp.qr_code,
    secret: data.totp.secret,
    uri: data.totp.uri,
  };
}

export type VerifyTotpResult =
  | { ok: true; assuranceLevel: 'aal2' }
  | {
      ok: false;
      reason:
        | 'mfa_verification_failed'
        | 'aal_check_failed'
        | 'aal2_not_reached';
    };

export async function verifyTotpAndRequireAal2(
  mfa: SupabaseMfaClient,
  factorId: string,
  code: string,
): Promise<VerifyTotpResult> {
  const verification = await mfa.challengeAndVerify({ factorId, code });

  if (verification.error) {
    return { ok: false, reason: 'mfa_verification_failed' };
  }

  const aal = await mfa.getAuthenticatorAssuranceLevel();

  if (aal.error || !aal.data) {
    return { ok: false, reason: 'aal_check_failed' };
  }

  if (aal.data.currentLevel !== 'aal2') {
    return { ok: false, reason: 'aal2_not_reached' };
  }

  return { ok: true, assuranceLevel: 'aal2' };
}
