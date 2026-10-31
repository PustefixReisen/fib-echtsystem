import {risEditorial} from '../_shared/ris-editorial.ts';
import postgres from 'npm:postgres@3.4.7';

const corsHeaders = {
  'access-control-allow-origin': 'https://fib.pustivo.de',
  'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
  'access-control-allow-methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { ...corsHeaders, 'cache-control': 'no-store' } });
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

async function resolveUser(req: Request): Promise<string | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!supabaseUrl || !anonKey) return null;

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: anonKey, authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;

  const user = await response.json() as { id?: string };
  const claims = decodeJwtPayload(token);
  return user.id && claims?.sub === user.id && claims?.aal === 'aal2' ? user.id : null;
}

export default {
  async fetch(req: Request) {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
    if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

    const userId = await resolveUser(req);
    if (!userId) return json({ error: 'mfa_required_or_invalid_auth' }, 403);

    let body: {
      action?: string;
      [key:string]: any;
      eventId?: string;
      title?: string;
      summary?: string | null;
      occurredAt?: string | null;
      findingId?: string;
      restorePrevious?: boolean;
      evidenceRole?: string;
      note?: string | null;
      justification?: string | null;
    };
    try {
      body = await req.json();
    } catch {
      return json({ error: 'invalid_json' }, 400);
    }

    if(!body||typeof body!=='object'||Array.isArray(body))return json({error:'invalid_json_object'},400);
    const risAction=typeof body.action==='string'&&body.action.startsWith('ris_');
    if(risAction&&Deno.env.get('FIB_RIS_STRUCTURE_ENABLED')!=='true')return json({error:'ris_structure_disabled'},503);
    if (!risAction && body.action !== 'edit_event' && body.action !== 'link_finding' && body.action !== 'unlink_finding' && body.action !== 'update_finding_link' && body.action !== 'update_finding_justification') return json({ error: 'unknown_action' }, 400);
    if (!risAction && (!body.eventId || (body.action === 'edit_event' && (typeof body.title !== 'string' || body.title.trim().length === 0)))) {
      return json({ error: 'invalid_event_input' }, 400);
    }

    const databaseUrl = Deno.env.get('FIB_DATABASE_URL');
    if (!databaseUrl) return json({ error: 'runtime_not_configured' }, 503);

    const sql = postgres(databaseUrl, {
      max: 1,
      prepare: false,
      idle_timeout: 5,
      connect_timeout: 5,
    });

    try {
      const membership = await sql.unsafe(
        "select role from fib.app_users where user_id=$1 and active=true and setup_status='active'",
        [userId],
      );
      if (membership.length === 0) return json({ error: 'fib_membership_missing_or_inactive' }, 403);

      if(risAction){
        if(['ris_suggest','ris_propose_relation'].includes(body.action!)&&body.origin!=='editor')return json({error:'trusted_ai_ingestion_required'},403);
        const result=await sql.begin(tx=>risEditorial(tx,{userId,kind:'human',aal:'aal2'},body));
        return json({ok:true,...result});
      }

      const eventId=body.eventId;
      if(typeof eventId!=='string'||!eventId)return json({error:'invalid_event_input'},400);

      const lock = await sql.unsafe(
        "select user_id from fib.edit_locks where object_type='event' and object_id=$1::uuid and user_id=$2 and expires_at>now()",
        [eventId, userId],
      );
      if (lock.length === 0) return json({ error: 'active_edit_lock_required' }, 409);

      if (body.action === 'update_finding_justification') {
        const findingId=body.findingId;
        if (typeof findingId !== 'string' || !/^[0-9a-f-]{36}$/i.test(findingId) ||
            (typeof body.justification !== 'string' || !body.justification.trim() || body.justification.length > 2000)) return json({ error: 'invalid_justification' }, 400);
        const result = await sql.begin(async tx => {
          const rows = await tx.unsafe('select justification from fib.event_findings where event_id=$1::uuid and finding_id=$2::uuid for update', [eventId,findingId]);
          if (!rows.length) return 'missing';
          const newValue = body.justification?.trim() || null;
          if ((rows[0].justification ?? null) === newValue) return 'unchanged';
          await tx.unsafe('update fib.event_findings set justification=$3 where event_id=$1::uuid and finding_id=$2::uuid',[eventId,findingId,newValue]);
          await tx.unsafe('insert into fib.event_finding_justification_log (event_id,finding_id,actor_id,old_justification,new_justification) values ($1::uuid,$2::uuid,$3::uuid,$4,$5)',[eventId,findingId,userId,rows[0].justification,newValue]);
          await tx.unsafe("insert into fib.object_last_edits (object_type,object_id,user_id,edited_at) values ('event',$1::uuid,$2,now()) on conflict (object_type,object_id) do update set user_id=excluded.user_id,edited_at=excluded.edited_at",[eventId,userId]);
          return 'updated';
        });
        return result === 'missing' ? json({error:'association_not_found'},404) : json({ok:true});
      }

      if (body.action === 'update_finding_link') {
        const findingId=body.findingId;
        if (typeof findingId !== 'string' || !/^[0-9a-f-]{36}$/i.test(findingId)) return json({ error: 'invalid_finding_id' }, 400);
        if (typeof body.evidenceRole !== 'string' || !body.evidenceRole.trim() || body.evidenceRole.length > 120 ||
            (body.note !== null && body.note !== undefined && typeof body.note !== 'string') ||
            (typeof body.note === 'string' && body.note.length > 2000)) return json({ error: 'invalid_link_metadata' }, 400);
        const changed = await sql.begin(async tx => {
          const old = await tx.unsafe(
            'select evidence_role,note from fib.event_findings where event_id=$1::uuid and finding_id=$2::uuid for update',
            [eventId, findingId],
          );
          if (!old.length) return false;
          const nextRole = body.evidenceRole!.trim();
          const nextNote = body.note === undefined ? (old[0].note ?? null) : (body.note ?? '').trim() || null;
          if (old[0].evidence_role === nextRole && (old[0].note ?? null) === nextNote) return true;
          await tx.unsafe(
            'update fib.event_findings set evidence_role=$3,note=$4 where event_id=$1::uuid and finding_id=$2::uuid',
            [eventId, findingId, nextRole, nextNote],
          );
          await tx.unsafe(
            'insert into fib.event_finding_metadata_log (event_id,finding_id,actor_id,old_evidence_role,old_note,new_evidence_role,new_note) values ($1::uuid,$2::uuid,$3::uuid,$4,$5,$6,$7)',
            [eventId, findingId, userId, old[0].evidence_role, old[0].note, nextRole, nextNote],
          );
          await tx.unsafe(
            "insert into fib.object_last_edits (object_type,object_id,user_id,edited_at) values ('event',$1::uuid,$2,now()) on conflict (object_type,object_id) do update set user_id=excluded.user_id,edited_at=excluded.edited_at",
            [eventId, userId],
          );
          return true;
        });
        return changed ? json({ ok: true }) : json({ error: 'association_not_found' }, 404);
      }

      if (body.action === 'unlink_finding') {
        const findingId=body.findingId;
        if (typeof findingId !== 'string' || !/^[0-9a-f-]{36}$/i.test(findingId)) return json({ error: 'invalid_finding_id' }, 400);
        const removed = await sql.begin(async tx => {
          const rows = await tx.unsafe(
            "delete from fib.event_findings where event_id=$1::uuid and finding_id=$2::uuid returning evidence_role,note",
            [eventId, findingId],
          );
          if (rows.length === 0) return false;
          await tx.unsafe(
            "insert into fib.event_finding_change_log (event_id,finding_id,action,actor_id,previous_evidence_role,previous_note) values ($1::uuid,$2::uuid,'unlinked',$3::uuid,$4,$5)",
            [eventId, findingId, userId, rows[0].evidence_role, rows[0].note],
          );
          await tx.unsafe(
            "insert into fib.object_last_edits (object_type,object_id,user_id,edited_at) values ('event',$1::uuid,$2,now()) on conflict (object_type,object_id) do update set user_id=excluded.user_id,edited_at=excluded.edited_at",
            [eventId, userId],
          );
          return true;
        });
        return removed ? json({ ok: true }) : json({ error: 'association_not_found' }, 404);
      }

      if (body.action === 'link_finding') {
        const findingId=body.findingId, justification=body.justification;
        if (typeof findingId !== 'string' || !/^[0-9a-f-]{36}$/i.test(findingId) ||
            (body.restorePrevious !== undefined && typeof body.restorePrevious !== 'boolean'))
          return json({ error: 'invalid_finding_id' }, 400);
        if (typeof justification !== 'string' || !justification.trim() || justification.length > 2000)
          return json({error:'justification_required'},400);
        const restored = await sql.begin(async tx => {
          const inserted = await tx.unsafe(
            `insert into fib.event_findings (event_id, finding_id, evidence_role, justification)
             select $1::uuid, f.id, 'editorial_reference', $3::text
             from fib.findings f
             where f.id=$2::uuid and exists
                (select 1 from fib.events e where e.id=$1::uuid and e.status='confirmed')
             on conflict (event_id, finding_id) do nothing
             returning finding_id, justification`,
            [eventId, findingId, justification.trim()],
          );
          if (!inserted.length) return null;
          if (inserted[0].justification) {
            await tx.unsafe(
              'insert into fib.event_finding_justification_log (event_id,finding_id,actor_id,old_justification,new_justification) values ($1::uuid,$2::uuid,$3::uuid,null,$4)',
              [eventId, findingId, userId, inserted[0].justification],
            );
          }
          await tx.unsafe(
            "insert into fib.object_last_edits (object_type,object_id,user_id,edited_at) values ('event',$1::uuid,$2,now()) on conflict (object_type,object_id) do update set user_id=excluded.user_id,edited_at=excluded.edited_at",
            [eventId, userId],
          );
          return inserted[0];
        });
        if (!restored) return json({ error: 'finding_missing_or_already_linked' }, 409);
        return json({ ok: true, justificationSaved: true });
      }

      const title=body.title;
      if(typeof title!=='string'||!title.trim())return json({error:'invalid_event_input'},400);
      const updated = await sql.unsafe(
        `update fib.events set title=$2,
         summary = case
           when summary like 'Entwicklungsdaten; Import %' and strpos(summary, E'\\n\\n') > 0
           then left(summary, strpos(summary, E'\\n\\n') + 1) || coalesce($3::text, '')
           else $3::text end,
         occurred_at=$4, updated_at=now()
         where id=$1::uuid and status='confirmed'
         returning id,title,summary,status,occurred_at`,
        [eventId, title.trim(), body.summary ?? null, body.occurredAt ?? null],
      );
      const row = updated[0] as any;
      if (!row) return json({ error: 'event_not_editable' }, 409);

      await sql.unsafe(
        "insert into fib.object_last_edits(object_type,object_id,user_id,edited_at) values ('event',$1::uuid,$2,now()) on conflict (object_type,object_id) do update set user_id=excluded.user_id,edited_at=excluded.edited_at",
        [eventId, userId],
      );

      return json({
        ok: true,
        event: {
          id: row.id,
          title: row.title,
          summary: row.summary,
          status: row.status,
          occurredAt: row.occurred_at,
        },
      });
    } catch (error) {
      console.error('fib-editorial-write failed', error);
      return json({ error: 'internal_error' }, 500);
    } finally {
      await sql.end({ timeout: 1 });
    }
  },
};
