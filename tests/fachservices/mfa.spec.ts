import {
  beginTotpEnrollment,
  verifyTotpAndRequireAal2,
  type SupabaseMfaClient,
} from '../../packages/fachservices/src/index.js';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

class FakeMfa implements SupabaseMfaClient {
  constructor(
    private readonly options: {
      enrollError?: boolean;
      verifyError?: boolean;
      currentLevel?: 'aal1' | 'aal2' | null;
    } = {},
  ) {}

  async enroll() {
    if (this.options.enrollError) {
      return { data: null, error: { message: 'enroll failed' } };
    }

    return {
      data: {
        id: 'factor-1',
        type: 'totp',
        friendly_name: 'FIB Redaktionszugang',
        totp: {
          qr_code: '<svg>qr</svg>',
          secret: 'SECRET',
          uri: 'otpauth://totp/FIB',
        },
      },
      error: null,
    };
  }

  async challengeAndVerify() {
    return this.options.verifyError
      ? { data: null, error: { message: 'invalid code' } }
      : { data: {}, error: null };
  }

  async getAuthenticatorAssuranceLevel() {
    return {
      data: {
        currentLevel: this.options.currentLevel ?? 'aal2',
        nextLevel: this.options.currentLevel ?? 'aal2',
        currentAuthenticationMethods: [],
      },
      error: null,
    };
  }
}

export async function caseTotpEnrollmentReturnsQrData() {
  const result = await beginTotpEnrollment(new FakeMfa());
  assert(result.ok, 'TOTP enrollment should succeed');
  assert(result.factorId === 'factor-1', 'factor id must be returned');
  assert(result.qrCode.length > 0, 'QR code must be returned');
}

export async function caseVerifiedTotpMustReachAal2() {
  const result = await verifyTotpAndRequireAal2(new FakeMfa({ currentLevel: 'aal2' }), 'factor-1', '123456');
  assert(result.ok && result.assuranceLevel === 'aal2', 'verified TOTP must reach aal2');
}

export async function caseAal1AfterVerificationIsRejected() {
  const result = await verifyTotpAndRequireAal2(new FakeMfa({ currentLevel: 'aal1' }), 'factor-1', '123456');
  assert(!result.ok && result.reason === 'aal2_not_reached', 'aal1 must not pass MFA gate');
}
