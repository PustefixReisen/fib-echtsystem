import type { FibActorContext } from '@fib/domain-contracts';
import {
  deactivateAppUser,
  type FibAuditSink,
  type FibSqlExecutor,
} from '../../packages/fachservices/src/index.js';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

class FakeDb implements FibSqlExecutor {
  async queryOne<T>(sql: string): Promise<T | null> {
    if (sql.includes('update fib.app_users')) return { user_id: 'user-2' } as T;
    return null;
  }
}

class Audit implements FibAuditSink {
  actions: string[] = [];
  async record(event: { action: string }) { this.actions.push(event.action); }
}

export async function caseEditorCannotDeactivateUser() {
  const actor: FibActorContext = { actorKind: 'human', userId: 'editor-1', role: 'editor', active: true, mfaLevel: 'aal2' };
  const result = await deactivateAppUser(actor, 'user-2', new FakeDb(), new Audit());
  assert(!result.ok && result.reason === 'admin_required', 'editor must not deactivate users');
}

export async function caseAdminNeedsAal2ForDeactivation() {
  const actor: FibActorContext = { actorKind: 'human', userId: 'admin-1', role: 'admin', active: true, mfaLevel: 'aal1' };
  const result = await deactivateAppUser(actor, 'user-2', new FakeDb(), new Audit());
  assert(!result.ok && result.reason === 'mfa_required', 'admin deactivation requires step-up MFA');
}

export async function caseAdminCanDeactivateAndAudit() {
  const actor: FibActorContext = { actorKind: 'human', userId: 'admin-1', role: 'admin', active: true, mfaLevel: 'aal2' };
  const audit = new Audit();
  const result = await deactivateAppUser(actor, 'user-2', new FakeDb(), audit);
  assert(result.ok, 'admin with aal2 must deactivate user');
  assert(audit.actions.includes('deactivate_app_user'), 'deactivation must be audited');
}
