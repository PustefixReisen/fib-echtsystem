import type { FibActorContext } from '@fib/domain-contracts';
import {
  acquireEditLock,
  forceReleaseEditLock,
  initializeLeadResponsibility,
  manageLeadResponsibility,
  recordLastEdit,
  requestHandover,
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
  activeUsers = new Set(['editor-1', 'editor-2', 'admin-1']);
  leadOwner: string | null = null;
  eventLeadOwner: string | null = null;
  lastEditUser: string | null = null;

  async queryOne<T>(sql: string, params: readonly unknown[]): Promise<T | null> {
    if (sql.includes('from fib.app_users')) {
      const userId = String(params[0]);
      return this.activeUsers.has(userId) ? ({ user_id: userId } as T) : null;
    }
    if (sql.includes("where lr.object_type = 'event'")) {
      return this.eventLeadOwner ? ({ user_id: this.eventLeadOwner } as T) : null;
    }
    if (sql.includes('insert into fib.lead_responsibilities')) {
      if (sql.includes('do nothing') && this.leadOwner) return null;
      this.leadOwner = String(params[2]);
      return {
        object_type: params[0],
        object_id: params[1],
        user_id: params[2],
        assigned_at: '2026-10-10T19:00:00Z',
      } as T;
    }
    if (sql.includes('insert into fib.object_last_edits')) {
      this.lastEditUser = String(params[2]);
      return {
        object_type: params[0],
        object_id: params[1],
        user_id: params[2],
        edited_at: '2026-10-10T19:30:00Z',
      } as T;
    }
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


export async function caseLeadCannotBeAssignedToInactiveUser() {
  const db = new FakeDb();
  const result = await manageLeadResponsibility(
    editor,
    { objectType: 'event', objectId: 'e1' },
    'inactive-user',
    db,
  );
  assert(!result.ok && result.reason === 'target_user_not_active', 'inactive user must not receive lead');
  assert(db.leadOwner === null, 'lead must remain unchanged');
}

export async function caseHandoverCannotTargetInactiveUser() {
  const db = new FakeDb();
  const result = await requestHandover(
    editor,
    { objectType: 'event', objectId: 'e1' },
    'inactive-user',
    'Bitte übernehmen',
    db,
  );
  assert(!result.ok && result.reason === 'target_user_not_active', 'inactive user must not receive handover request');
}

export async function caseHandoverCannotTargetRequester() {
  const db = new FakeDb();
  const result = await requestHandover(
    editor,
    { objectType: 'event', objectId: 'e1' },
    'editor-1',
    null,
    db,
  );
  assert(!result.ok && result.reason === 'cannot_request_self', 'handover request to self must be rejected');
}


export async function caseEventInheritsCreatingEditorFromFinding() {
  const db = new FakeDb();
  const result = await initializeLeadResponsibility(
    editor,
    { objectType: 'event', objectId: 'event-1' },
    { objectType: 'finding', objectId: 'finding-1' },
    db,
  );
  assert(result.ok && result.assigned && result.userId === 'editor-1', 'new event must receive creating editor as lead');
  assert(db.leadOwner === 'editor-1', 'event lead must be persisted');
}

export async function caseMessageInheritsLeadFromEvent() {
  const db = new FakeDb();
  db.eventLeadOwner = 'editor-2';

  const result = await initializeLeadResponsibility(
    editor,
    { objectType: 'message', objectId: 'message-1' },
    { objectType: 'event', objectId: 'event-1' },
    db,
  );
  assert(result.ok && result.assigned && result.userId === 'editor-2', 'message must inherit active event lead');
  assert(db.leadOwner === 'editor-2', 'inherited lead must be persisted');
}

export async function caseInheritedLeadNeverOverwritesOwnLead() {
  const db = new FakeDb();
  db.eventLeadOwner = 'editor-2';
  db.leadOwner = 'admin-1';

  const result = await initializeLeadResponsibility(
    editor,
    { objectType: 'topic', objectId: 'topic-1' },
    { objectType: 'event', objectId: 'event-1' },
    db,
  );
  assert(result.ok && !result.assigned && result.reason === 'target_already_has_lead', 'existing target lead must win');
  assert(db.leadOwner === 'admin-1', 'existing target lead must not be overwritten');
}

export async function caseLastEditRecordsHumanAndTime() {
  const db = new FakeDb();
  const result = await recordLastEdit(
    editor,
    { objectType: 'process', objectId: 'process-1' },
    db,
  );
  assert(result.ok, 'last edit must be recorded');
  assert(result.lastEdit.userId === 'editor-1', 'last edit must identify editor');
  assert(result.lastEdit.editedAt === '2026-10-10T19:30:00Z', 'last edit must contain edit timestamp');
  assert(db.lastEditUser === 'editor-1', 'last edit must be persisted');
}
