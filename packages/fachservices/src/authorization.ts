import type {
  AuthorizationDecision,
  AuthorizationRequest,
  FibActorContext,
} from '@fib/domain-contracts';

export function authorize(
  actor: FibActorContext,
  request: AuthorizationRequest,
): AuthorizationDecision {
  if (!actor.active) {
    return { allowed: false, reason: 'inactive_actor' };
  }

  if (actor.actorKind === 'ai_task') {
    if (request.actionLevel === 'S2' || request.actionLevel === 'S3') {
      return { allowed: false, reason: 'ai_task_cannot_execute_s2_s3' };
    }

    return { allowed: true, reason: 'allowed' };
  }

  if (!actor.userId || !actor.role) {
    return { allowed: false, reason: 'missing_human_identity' };
  }

  if (request.requiresAdmin && actor.role !== 'admin') {
    return { allowed: false, reason: 'admin_required' };
  }

  if (request.requiresMfaStepUp && actor.mfaLevel !== 'aal2') {
    return { allowed: false, reason: 'mfa_required' };
  }

  if (request.actionLevel === 'S3' && !request.explicitConfirmation) {
    return { allowed: false, reason: 'explicit_confirmation_required' };
  }

  return { allowed: true, reason: 'allowed' };
}
