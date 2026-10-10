import type { FibActorContext } from '@fib/domain-contracts';
import {
  confirmEvent,
  editMessageDraft,
  manageProcess,
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

class FakeDb implements FibSqlExecutor {
  lastEditUser: string | null = null;
  inheritedLeadUser: string | null = null;
  eventLeadOwner: string | null = 'editor-2';
  processUpdated = false;

  async queryOne<T>(sql: string, params: readonly unknown[]): Promise<T | null> {
    if (sql.includes('select id from fib.findings')) return { id: params[0] } as T;
    if (sql.includes('insert into fib.events')) return { id: 'event-new' } as T;
    if (sql.includes('insert into fib.event_findings')) return { event_id: params[0] } as T;

    if (sql.includes("where lr.object_type = 'event'")) {
      return this.eventLeadOwner ? ({ user_id: this.eventLeadOwner } as T) : null;
    }
    if (sql.includes('insert into fib.lead_responsibilities')) {
      this.inheritedLeadUser = String(params[2]);
      return {
        object_type: params[0],
        object_id: params[1],
        user_id: params[2],
        assigned_at: '2026-10-10T20:00:00Z',
      } as T;
    }
    if (sql.includes('insert into fib.object_last_edits')) {
      this.lastEditUser = String(params[2]);
      return {
        object_type: params[0],
        object_id: params[1],
        user_id: params[2],
        edited_at: '2026-10-10T20:01:00Z',
      } as T;
    }

    if (sql.includes('select id from fib.messages')) return null;
    if (sql.includes('select id from fib.events')) return { id: params[0] } as T;
    if (sql.includes('insert into fib.messages')) return { id: 'message-new' } as T;

    if (sql.includes('update fib.processes')) {
      this.processUpdated = true;
      return { id: params[0] } as T;
    }

    return null;
  }
}

export async function caseConfirmEventAppliesLeadAndLastEdit() {
  const db = new FakeDb();
  const result = await confirmEvent(
    editor,
    { findingId: 'finding-1', title: 'Neues Ereignis' },
    db,
  );

  assert(result.ok, 'confirmed event must be created');
  assert(result.eventId === 'event-new', 'created event id must be returned');
  assert(db.inheritedLeadUser === 'editor-1', 'creating editor must become initial event lead');
  assert(db.lastEditUser === 'editor-1', 'event creation must record last edit');
}

export async function caseNewMessageInheritsEventLeadAndRecordsEditor() {
  const db = new FakeDb();
  const result = await editMessageDraft(
    editor,
    { eventId: 'event-1', title: 'Meldungsentwurf' },
    db,
  );

  assert(result.ok && result.created, 'message draft must be created');
  assert(result.messageId === 'message-new', 'created message id must be returned');
  assert(db.inheritedLeadUser === 'editor-2', 'new message must inherit event lead');
  assert(db.lastEditUser === 'editor-1', 'creating editor must be stored as last editor');
}

export async function caseProcessUpdateRecordsLastEditWithoutLeadReassignment() {
  const db = new FakeDb();
  db.inheritedLeadUser = 'existing-owner';

  const result = await manageProcess(
    editor,
    {
      processId: 'process-1',
      title: 'Geänderter Vorgang',
      status: 'active',
    },
    db,
  );

  assert(result.ok && !result.created, 'existing process must be updated');
  assert(db.processUpdated, 'process update must reach persistence layer');
  assert(db.lastEditUser === 'editor-1', 'process update must record last editor');
  assert(db.inheritedLeadUser === 'existing-owner', 'process update must not reassign lead');
}
