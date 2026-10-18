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

async function resolveAal2User(req: Request): Promise<string | null> {
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

function normalizedEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

function normalizedName(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const name = value.trim().replace(/\s+/g, ' ');
  if (name.length < 2 || name.length > 120 || /[<>\x00-\x1F\x7F]/.test(name)) return null;
  return name;
}

function adminApiKey(): string | null {
  const secretKeys = Deno.env.get('SUPABASE_SECRET_KEYS');
  if (secretKeys) {
    try {
      const parsed = JSON.parse(secretKeys) as Record<string, string>;
      if (parsed.default) return parsed.default;
    } catch {
      // Fall through to the legacy key while Shared-Apps is migrated.
    }
  }
  return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? null;
}

async function authAdminFetch(path: string, init?: RequestInit) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const adminKey = adminApiKey();
  if (!supabaseUrl || !adminKey) throw new Error('auth_admin_not_configured');
  const headers: Record<string, string> = {
    apikey: adminKey,
    'content-type': 'application/json',
  };
  // Opaque sb_secret keys belong only in apikey. Legacy service_role is a JWT.
  if (!adminKey.startsWith('sb_secret_')) headers.authorization = `Bearer ${adminKey}`;
  return fetch(`${supabaseUrl}/auth/v1/admin${path}`, {
    ...init,
    headers: { ...headers, ...(init?.headers ?? {}) },
  });
}

async function findAuthUserByEmail(email: string): Promise<{ id: string; email: string; confirmed_at?: string | null } | null> {
  for (let page = 1; page <= 10; page += 1) {
    const response = await authAdminFetch(`/users?page=${page}&per_page=100`);
    if (!response.ok) throw new Error('auth_lookup_failed');
    const body = await response.json() as { users?: Array<{ id: string; email?: string; confirmed_at?: string | null }> };
    const found = body.users?.find(user => user.email?.toLowerCase() === email);
    if (found?.email) return { id: found.id, email: found.email, confirmed_at: found.confirmed_at };
    if (!body.users || body.users.length < 100) break;
  }
  return null;
}

async function sendInvite(email: string, fullName: string) {
  const redirect = encodeURIComponent('https://fib.pustivo.de/redaktion/');
  const response = await authAdminFetch(`/invite?redirect_to=${redirect}`, {
    method: 'POST',
    body: JSON.stringify({ email, data: { fib_invited_name: fullName } }),
  });
  const body = await response.json().catch(() => ({})) as { id?: string; email?: string; message?: string };
  return { response, body };
}

export default {
  async fetch(req: Request) {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
    if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

    const actorUserId = await resolveAal2User(req);
    if (!actorUserId) return json({ error: 'mfa_required_or_invalid_auth' }, 403);

    const databaseUrl = Deno.env.get('FIB_DATABASE_URL');
    if (!databaseUrl) return json({ error: 'runtime_not_configured' }, 503);
    const sql = postgres(databaseUrl, { max: 1, prepare: false, idle_timeout: 5, connect_timeout: 5 });

    try {
      const actorRows = await sql.unsafe(
        "select role, active, setup_status from fib.app_users where user_id=$1",
        [actorUserId],
      );
      const actor = actorRows[0] as any;
      if (!actor || !actor.active || actor.setup_status !== 'active' || actor.role !== 'admin') {
        return json({ error: 'admin_required' }, 403);
      }

      const body = await req.json().catch(() => null) as Record<string, unknown> | null;
      if (!body || typeof body.action !== 'string') return json({ error: 'invalid_json' }, 400);

      if (body.action === 'list') {
        const rows = await sql.unsafe(
          "select user_id, full_name, role, active, setup_status, created_at, updated_at from fib.app_users order by full_name",
        );
        return json({ ok: true, users: rows });
      }

      if (body.action === 'revoke') {
        if (typeof body.userId !== 'string') return json({ error: 'invalid_user_id' }, 400);
        if (body.userId === actorUserId) return json({ error: 'cannot_revoke_self' }, 400);
        const rows = await sql.unsafe(
          "update fib.app_users set active=false, setup_status='deactivated', updated_at=now() where user_id=$1 and setup_status<>'active' returning user_id",
          [body.userId],
        );
        if (!rows.length) return json({ error: 'not_revocable' }, 409);
        return json({ ok: true });
      }

      if (body.action !== 'invite') return json({ error: 'invalid_action' }, 400);

      const email = normalizedEmail(body.email);
      const fullName = normalizedName(body.fullName);
      const role = body.role === 'admin' || body.role === 'editor' ? body.role : null;
      if (!email || !fullName || !role) return json({ error: 'invalid_input' }, 400);

      const existingAuth = await findAuthUserByEmail(email);
      if (existingAuth) {
        const existingFib = await sql.unsafe(
          "select user_id, setup_status from fib.app_users where user_id=$1",
          [existingAuth.id],
        );
        if (existingFib.length) return json({ error: 'fib_user_already_exists' }, 409);

        await sql.unsafe(
          "insert into fib.app_users(user_id, full_name, role, active, setup_status) values ($1,$2,$3,true,'setup_pending')",
          [existingAuth.id, fullName, role],
        );
        return json({
          ok: true,
          mode: 'existing_account',
          userId: existingAuth.id,
          message: 'Vorhandenes Shared-Apps-Konto wurde nur für FIB vorautorisiert. Passwort und MFA bleiben unverändert.',
        });
      }

      const invited = await sendInvite(email, fullName);
      if (!invited.response.ok || !invited.body.id) {
        return json({ error: 'invite_delivery_failed' }, 502);
      }

      try {
        await sql.unsafe(
          "insert into fib.app_users(user_id, full_name, role, active, setup_status) values ($1,$2,$3,true,'setup_pending')",
          [invited.body.id, fullName, role],
        );
      } catch (error) {
        await authAdminFetch(`/users/${invited.body.id}`, { method: 'DELETE' }).catch(() => null);
        throw error;
      }

      return json({ ok: true, mode: 'new_account', userId: invited.body.id });
    } catch (error) {
      console.error('fib-admin-users failed', error);
      return json({ error: 'internal_error' }, 500);
    } finally {
      await sql.end({ timeout: 1 });
    }
  },
};
