import postgres from 'npm:postgres@3.4.7';

const corsHeaders = {
  'access-control-allow-origin': 'https://fib.pustivo.de',
  'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
  'access-control-allow-methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { ...corsHeaders, 'cache-control': 'no-store' },
  });
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

async function verifyUserToken(req: Request) {
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
  if (!user.id) return null;

  const payload = decodeJwtPayload(token);
  if (!payload || payload.sub !== user.id || payload.aal !== 'aal2') return null;

  return { userId: user.id };
}

type ObjectType = 'finding' | 'event' | 'message' | 'process' | 'topic';

export default {
  async fetch(req: Request) {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

    const verified = await verifyUserToken(req);
    if (!verified) return json({ error: 'mfa_required_or_invalid_auth' }, 403);

    let payload: { action?: unknown; objectType?: unknown; objectId?: unknown };
    try {
      payload = await req.json();
    } catch {
      return json({ error: 'invalid_json' }, 400);
    }

    const { action, objectType, objectId } = payload;
    const allowedTypes = new Set<ObjectType>(['finding', 'event', 'message', 'process', 'topic']);
    if (typeof objectType !== 'string' || !allowedTypes.has(objectType as ObjectType)) {
      return json({ error: 'invalid_object_type' }, 400);
    }
    if (typeof objectId !== 'string' || objectId.length === 0) {
      return json({ error: 'object_id_required' }, 400);
    }

    const databaseUrl = Deno.env.get('FIB_DATABASE_URL');
    if (!databaseUrl) return json({ error: 'runtime_not_configured' }, 503);

    const sql = postgres(databaseUrl, {
      max: 1,
      prepare: false,
      idle_timeout: 5,
      connect_timeout: 5,
    });

    async function assertMembership() {
      const rows = await sql.unsafe(
        'select user_id, active from fib.app_users where user_id = $1',
        [verified.userId],
      );
      const row = rows[0] as { user_id?: string; active?: boolean } | undefined;
      return !!row?.user_id && row.active === true;
    }

    async function getState() {
      const leadRows = await sql.unsafe(
        `select lr.user_id,
                coalesce(nullif(u.call_name,''), nullif(u.full_name,''), 'Unbekannt') as display_name
           from fib.lead_responsibilities lr
           join fib.app_users u on u.user_id = lr.user_id
          where lr.object_type = $1 and lr.object_id = $2::uuid`,
        [objectType, objectId],
      );
      const lockRows = await sql.unsafe(
        `select l.user_id,
                coalesce(nullif(u.call_name,''), nullif(u.full_name,''), 'Unbekannt') as display_name,
                l.expires_at
           from fib.edit_locks l
           join fib.app_users u on u.user_id = l.user_id
          where l.object_type = $1
            and l.object_id = $2::uuid
            and l.expires_at > now()`,
        [objectType, objectId],
      );

      const lead = leadRows[0] as { user_id?: string; display_name?: string } | undefined;
      const lock = lockRows[0] as { user_id?: string; display_name?: string; expires_at?: string } | undefined;

      return {
        lead: lead?.user_id
          ? { userId: lead.user_id, displayName: lead.display_name, mine: lead.user_id === verified.userId }
          : null,
        lock: lock?.user_id
          ? { userId: lock.user_id, displayName: lock.display_name, expiresAt: lock.expires_at, mine: lock.user_id === verified.userId }
          : null,
      };
    }

    try {
      if (!(await assertMembership())) {
        return json({ error: 'fib_membership_missing_or_inactive' }, 403);
      }

      if (action === 'get_state') {
        return json({ ok: true, state: await getState() });
      }

      if (action === 'take_lead') {
        await sql.unsafe(
          `insert into fib.lead_responsibilities(object_type, object_id, user_id)
           values ($1, $2::uuid, $3)
           on conflict (object_type, object_id)
           do update set user_id = excluded.user_id, assigned_at = now()`,
          [objectType, objectId, verified.userId],
        );
        return json({ ok: true, state: await getState() });
      }

      if (action === 'release_lead') {
        await sql.unsafe(
          `delete from fib.lead_responsibilities
            where object_type = $1 and object_id = $2::uuid and user_id = $3`,
          [objectType, objectId, verified.userId],
        );
        return json({ ok: true, state: await getState() });
      }

      if (action === 'acquire_lock') {
        const rows = await sql.unsafe(
          `insert into fib.edit_locks(object_type, object_id, user_id, acquired_at, renewed_at, expires_at)
           values ($1, $2::uuid, $3, now(), now(), now() + interval '2 minutes')
           on conflict (object_type, object_id)
           do update set
             user_id = excluded.user_id,
             acquired_at = case when fib.edit_locks.user_id = excluded.user_id
                                then fib.edit_locks.acquired_at else now() end,
             renewed_at = now(),
             expires_at = excluded.expires_at
           where fib.edit_locks.user_id = excluded.user_id
              or fib.edit_locks.expires_at <= now()
           returning user_id`,
          [objectType, objectId, verified.userId],
        );
        if (rows.length === 0) {
          return json({ ok: false, error: 'locked_by_other', state: await getState() }, 409);
        }
        return json({ ok: true, state: await getState() });
      }

      if (action === 'release_lock') {
        await sql.unsafe(
          `delete from fib.edit_locks
            where object_type = $1 and object_id = $2::uuid and user_id = $3`,
          [objectType, objectId, verified.userId],
        );
        return json({ ok: true, state: await getState() });
      }

      return json({ error: 'unknown_action' }, 400);
    } catch (error) {
      console.error('fib-coordination failed', error);
      return json({ error: 'internal_error' }, 500);
    } finally {
      await sql.end({ timeout: 1 });
    }
  },
};
