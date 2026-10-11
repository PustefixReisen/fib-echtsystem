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
      eventId?: string;
      title?: string;
      summary?: string | null;
      occurredAt?: string | null;
    };
    try {
      body = await req.json();
    } catch {
      return json({ error: 'invalid_json' }, 400);
    }

    if (body.action !== 'edit_event') return json({ error: 'unknown_action' }, 400);
    if (!body.eventId || typeof body.title !== 'string' || body.title.trim().length === 0) {
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

      const lock = await sql.unsafe(
        "select user_id from fib.edit_locks where object_type='event' and object_id=$1::uuid and user_id=$2 and expires_at>now()",
        [body.eventId, userId],
      );
      if (lock.length === 0) return json({ error: 'active_edit_lock_required' }, 409);

      const updated = await sql.unsafe(
        "update fib.events set title=$2, summary=$3, occurred_at=$4, updated_at=now() where id=$1::uuid and status='confirmed' returning id,title,summary,status,occurred_at",
        [body.eventId, body.title.trim(), body.summary ?? null, body.occurredAt ?? null],
      );
      const row = updated[0] as any;
      if (!row) return json({ error: 'event_not_editable' }, 409);

      await sql.unsafe(
        "insert into fib.object_last_edits(object_type,object_id,user_id,edited_at) values ('event',$1::uuid,$2,now()) on conflict (object_type,object_id) do update set user_id=excluded.user_id,edited_at=excluded.edited_at",
        [body.eventId, userId],
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
