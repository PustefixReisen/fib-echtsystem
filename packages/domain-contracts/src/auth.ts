export type FibHumanRole = 'editor' | 'admin';

export type FibActorKind = 'human' | 'ai_task';

export type FibActionLevel = 'S0' | 'S1' | 'S2' | 'S3';

export interface FibActorContext {
  actorKind: FibActorKind;
  userId?: string;
  role?: FibHumanRole;
  active: boolean;
  mfaLevel?: 'aal1' | 'aal2';
}

export interface AuthorizationRequest {
  actionLevel: FibActionLevel;
  requiresAdmin?: boolean;
  requiresMfaStepUp?: boolean;
  explicitConfirmation?: boolean;
}

export interface AuthorizationDecision {
  allowed: boolean;
  reason:
    | 'allowed'
    | 'inactive_actor'
    | 'missing_human_identity'
    | 'admin_required'
    | 'mfa_required'
    | 'explicit_confirmation_required'
    | 'ai_task_cannot_execute_s2_s3';
}
