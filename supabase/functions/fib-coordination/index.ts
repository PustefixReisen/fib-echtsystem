import postgres from 'npm:postgres@3.4.7';

const corsHeaders = {
  'access-control-allow-origin': 'https://fib.pustivo.de',
  'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
  'access-control-allow-methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { ...corsHeaders, 'cache-control': 'no-store' } });
}

function payload(token: string): Record<string, unknown> | null {
  try {
    const p = token.split('.')[1];
    if (!p) return null;
    const n = p.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(n + '='.repeat((4 - n.length % 4) % 4)));
  } catch { return null; }
}

async function userId(req: Request): Promise<string | null> {
  const h = req.headers.get('authorization');
  if (!h?.startsWith('Bearer ')) return null;
  const token = h.slice(7);
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !key) return null;
  const r = await fetch(url + '/auth/v1/user', { headers: { apikey: key, authorization: 'Bearer ' + token } });
  if (!r.ok) return null;
  const u = await r.json() as { id?: string };
  const p = payload(token);
  return u.id && p?.sub === u.id && p?.aal === 'aal2' ? u.id : null;
}

export default {
  async fetch(req: Request) {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
    if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

    const uid = await userId(req);
    if (!uid) return json({ error: 'mfa_required_or_invalid_auth' }, 403);

    let body: { action?: string; objectType?: string; objectId?: string };
    try { body = await req.json(); } catch { return json({ error: 'invalid_json' }, 400); }

    const { action, objectType, objectId } = body;
    const allowed = new Set(['finding','event','message','process','topic']);
    if (!objectType || !allowed.has(objectType) || !objectId) return json({ error: 'invalid_object' }, 400);

    const dbUrl = Deno.env.get('FIB_DATABASE_URL');
    if (!dbUrl) return json({ error: 'runtime_not_configured' }, 503);
    const sql = postgres(dbUrl, { max: 1, prepare: false, idle_timeout: 5, connect_timeout: 5 });

    async function state() {
      const lead = await sql.unsafe(
        "select lr.user_id, coalesce(nullif(u.call_name,''), nullif(u.full_name,''), 'Unbekannt') display_name from fib.lead_responsibilities lr join fib.app_users u on u.user_id=lr.user_id where lr.object_type=$1 and lr.object_id=$2::uuid",
        [objectType, objectId]
      );
      const lock = await sql.unsafe(
        "select l.user_id, coalesce(nullif(u.call_name,''), nullif(u.full_name,''), 'Unbekannt') display_name, l.expires_at from fib.edit_locks l join fib.app_users u on u.user_id=l.user_id where l.object_type=$1 and l.object_id=$2::uuid and l.expires_at>now()",
        [objectType, objectId]
      );
      const l1 = lead[0] as any;
      const l2 = lock[0] as any;
      return {
        lead: l1 ? { userId: l1.user_id, displayName: l1.display_name, mine: l1.user_id === uid } : null,
        lock: l2 ? { userId: l2.user_id, displayName: l2.display_name, expiresAt: l2.expires_at, mine: l2.user_id === uid } : null,
      };
    }

    try {
      const m = await sql.unsafe("select 1 from fib.app_users where user_id=$1 and active=true", [uid]);
      if (m.length === 0) return json({ error: 'fib_membership_missing_or_inactive' }, 403);

      if (action === 'get_state') return json({ ok: true, state: await state() });

      if (action === 'take_lead') {
        await sql.unsafe("insert into fib.lead_responsibilities(object_type,object_id,user_id) values ($1,$2::uuid,$3) on conflict (object_type,object_id) do update set user_id=excluded.user_id,assigned_at=now()", [objectType,objectId,uid]);
        return json({ ok: true, state: await state() });
      }

      if (action === 'release_lead') {
        await sql.unsafe("delete from fib.lead_responsibilities where object_type=$1 and object_id=$2::uuid and user_id=$3", [objectType,objectId,uid]);
        return json({ ok: true, state: await state() });
      }

      if (action === 'acquire_lock') {
        const rows = await sql.unsafe("insert into fib.edit_locks(object_type,object_id,user_id,acquired_at,renewed_at,expires_at) values ($1,$2::uuid,$3,now(),now(),now()+interval '2 minutes') on conflict (object_type,object_id) do update set user_id=excluded.user_id,acquired_at=case when fib.edit_locks.user_id=excluded.user_id then fib.edit_locks.acquired_at else now() end,renewed_at=now(),expires_at=excluded.expires_at where fib.edit_locks.user_id=excluded.user_id or fib.edit_locks.expires_at<=now() returning user_id", [objectType,objectId,uid]);
        if (rows.length === 0) return json({ ok:false, error:'locked_by_other', state: await state() }, 409);
        return json({ ok:true, state: await state() });
      }

      if (action === 'release_lock') {
        await sql.unsafe("delete from fib.edit_locks where object_type=$1 and object_id=$2::uuid and user_id=$3", [objectType,objectId,uid]);
        return json({ ok:true, state: await state() });
      }

      return json({ error: 'unknown_action' }, 400);
    } catch (e) {
      console.error('fib-coordination failed', e);
      return json({ error: 'internal_error' }, 500);
    } finally {
      await sql.end({ timeout: 1 });
    }
  },
};