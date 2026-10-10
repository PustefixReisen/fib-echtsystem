import type { FibActorContext } from '@fib/domain-contracts';
import {
  acquireEditLock,
  forceReleaseEditLock,
  type FibAuditSink,
  type FibSqlExecutor,
} from '../../packages/fachservices/src/index.js';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const editor: FibActorContext = {
  actorKind: 'human',
  userId: 'editor-1',
  role: 'editor',
  active: true,
  mfaLevel: 'aal2',
};

const admin: FibActorContext = {
  actorKind: 'human',
  userId: 'admin-1',
  role: 'admin',
  active: true,
  mfaLevel: 'aal2',
};

class FakeDb implements FibSqlExecutor {
  lockOwner: string | null = null;

  async queryOne<T>(sql: string, params: readonly unknown[]): Promise<T | null> {
    if (sql.includes('insert into fib.edit_locks')) {
      const userId = String(params[2]);
      if (this.lockOwner && this.lockOwner !== userId) return null;
      this.lockOwner = userId;
      return {
        object_type: params[0],
        object_id: params[1],
        user_id: userId,
        acquired_at: '2026-10-10T08:00:00Z',
        renewed_at: '2026-10-10T08:00:00Z',
        expires_at: '2026-10-10T08:02:00Z',
      } as T;
    }
    if (sql.includes('select object_type') && this.lockOwner) {
      return {
        object_type: params[0],
        object_id: params[1],
        user_id: this.lockOwner,
        acquired_at: '2026-10-10T08:00:00Z',
        renewed_at: '2026-10-10T08:00:00Z',
        expires_at: '2026-10-10T08:02:00Z',
      } as T;
    }
    if (sql.includes('delete from fib.edit_locks')) {
      if (!this.lockOwner) return null;
      const previous = this.lockOwner;
      this.lockOwner = null;
      return { user_id: previous } as T;
    }
    return null;
  }
}

class Audit implements FibAuditSink {
  actions: string[] = [];
  async record(event: { action: string }) {
    this.actions.push(event.action);
  }
}

export async function caseSecondEditorCannotAcquireActiveLock() {
  const db = new FakeDb();
  const first = await acquireEditLock(editor, { objectType: 'event', objectId: 'e1' }, db);
  const second = await acquireEditLock({ ...editor, userId: 'editor-2' }, { objectType: 'event', objectId: 'e1' }, db);
  assert(first.ok, 'first editor must acquire lock');
  assert(!second.ok && second.reason === 'locked_by_other', 'second editor must be blocked');
}

export async function caseOnlyAdminWithMfaCanForceRelease() {
  const db = new FakeDb();
  const audit = new Audit();
  await acquireEditLock(editor, { objectType: 'topic', objectId: 't1' }, db);

  const denied = await forceReleaseEditLock(editor, { objectType: 'topic', objectId: 't1' }, db, audit);
  assert(!denied.ok, 'editor must not force release');

  const released = await forceReleaseEditLock(admin, { objectType: 'topic', objectId: 't1' }, db, audit);
  assert(released.ok && released.removed, 'admin with aal2 must force release');
  assert(audit.actions.includes('force_release_edit_lock'), 'force release must be audited');
}
