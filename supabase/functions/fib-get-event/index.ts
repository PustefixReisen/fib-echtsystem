import postgres from 'npm:postgres@3.4.7';

import {
  SqlFibAppUserRepository,
  getEvent,
  resolveHumanActor,
  type FibSqlExecutor,
  type VerifiedAuthClaims,
} from './shared.ts';

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

async function verifyUserToken(req: Request): Promise<VerifiedAuthClaims | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!supabaseUrl || !anonKey) return null;

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return null;

  const user = await response.json() as { id?: string };
  if (!user.id) return null;

  const payload = decodeJwtPayload(token);
  if (!payload || payload.sub !== user.id) return null;

  const aal = payload.aal;
  if (aal !== undefined && aal !== 'aal1' && aal !== 'aal2') return null;

  return {
    sub: user.id,
    aal,
    sessionId: typeof payload.session_id === 'string' ? payload.session_id : undefined,
    isAnonymous: payload.is_anonymous === true,
  };
}

export default {
  async fetch(req: Request) {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return json({ error: 'method_not_allowed' }, 405);
    }

    const claims = await verifyUserToken(req);
    if (!claims) {
      return json({ error: 'invalid_auth_claims' }, 401);
    }

    if (claims.aal !== 'aal2') {
      return json({ error: 'mfa_required' }, 403);
    }

    const databaseUrl = Deno.env.get('FIB_DATABASE_URL');
    if (!databaseUrl) {
      return json({ error: 'runtime_not_configured' }, 503);
    }

    let payload: { eventId?: unknown };
    try {
      payload = await req.json();
    } catch {
      return json({ error: 'invalid_json' }, 400);
    }

    if (typeof payload.eventId !== 'string' || payload.eventId.length === 0) {
      return json({ error: 'event_id_required' }, 400);
    }

    const sql = postgres(databaseUrl, {
      max: 1,
      prepare: false,
      idle_timeout: 5,
      connect_timeout: 5,
    });

    const db: FibSqlExecutor = {
      async queryOne<T>(statement, params) {
        const rows = await sql.unsafe(statement, [...params] as never[]);
        return (rows[0] as T | undefined) ?? null;
      },
    };

    try {
      const appUsers = new SqlFibAppUserRepository(db);
      const actorResolution = await resolveHumanActor(claims, appUsers);

      if (!actorResolution.ok) {
        return json({ error: actorResolution.reason }, 403);
      }

      const result = await getEvent(actorResolution.actor, payload.eventId, db);

      if (!result.ok) {
        return json(
          { error: result.reason },
          result.reason === 'not_found' ? 404 : 403,
        );
      }

      return json(result);
    } catch (error) {
      console.error('fib-get-event failed', error);
      return json({ error: 'internal_error' }, 500);
    } finally {
      await sql.end({ timeout: 1 });
    }
  },
};
