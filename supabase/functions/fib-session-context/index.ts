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

  const user = await response.json() as { id?: string; email?: string };
  const claims = decodeJwtPayload(token);
  return user.id && claims?.sub === user.id && claims?.aal === 'aal2' ? user.id : null;
}

export default {
  async fetch(req: Request) {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
    if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

    const userId = await resolveUser(req);
    if (!userId) return json({ error: 'mfa_required_or_invalid_auth' }, 403);

    const databaseUrl = Deno.env.get('FIB_DATABASE_URL');
    if (!databaseUrl) return json({ error: 'runtime_not_configured' }, 503);

    let action: 'get_context' | 'update_call_name' = 'get_context';
    let nextCallName: string | null = null;
    try {
      const body = await req.json() as { action?: string; callName?: unknown };
      if (body.action === 'update_call_name') {
        action = 'update_call_name';
        if (typeof body.callName !== 'string' || body.callName.length > 80) return json({ error: 'invalid_call_name' }, 400);
        const trimmed = body.callName.trim();
        if (trimmed.length > 60 || /[<>\x00-\x1F\x7F]/.test(trimmed)) return json({ error: 'invalid_call_name' }, 400);
        nextCallName = trimmed || null;
      } else if (body.action && body.action !== 'get_context') {
        return json({ error: 'invalid_action' }, 400);
      }
    } catch {
      return json({ error: 'invalid_json' }, 400);
    }

    const sql = postgres(databaseUrl, { max: 1, prepare: false, idle_timeout: 5, connect_timeout: 5 });

    try {
      const rows = await sql.unsafe(
        "select user_id, full_name, call_name, role, active, setup_status from fib.app_users where user_id=$1",
        [userId],
      );
      const row = rows[0] as any;
      if (!row || !row.active || row.setup_status !== 'active') {
        return json({ error: 'fib_membership_missing_or_inactive' }, 403);
      }

      if (action === 'update_call_name') {
        const updated = await sql.unsafe(
          "update fib.app_users set call_name=$2 where user_id=$1 and active=true and setup_status='active' returning user_id, full_name, call_name, role",
          [userId, nextCallName],
        );
        if (!updated.length) return json({ error: 'fib_membership_missing_or_inactive' }, 403);
        Object.assign(row, updated[0]);
      }

      return json({
        ok: true,
        user: {
          id: row.user_id,
          displayName: row.call_name || row.full_name,
          fullName: row.full_name,
          role: row.role,
        },
      });
    } catch (error) {
      console.error('fib-session-context failed', error);
      return json({ error: 'internal_error' }, 500);
    } finally {
      await sql.end({ timeout: 1 });
    }
  },
};
