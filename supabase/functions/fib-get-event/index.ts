import { withSupabase } from 'npm:@supabase/server@1';
import postgres from 'npm:postgres@3.4.7';

import {
  SqlFibAppUserRepository,
  getEvent,
  resolveHumanActor,
  type FibSqlExecutor,
  type VerifiedAuthClaims,
} from './shared.ts';

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { 'cache-control': 'no-store' },
  });
}

function claimsFromContext(ctx: {
  userClaims?: Record<string, unknown> | null;
}): VerifiedAuthClaims | null {
  const claims = ctx.userClaims;
  if (!claims || typeof claims.sub !== 'string') return null;

  const aal = claims.aal;
  if (aal !== undefined && aal !== 'aal1' && aal !== 'aal2') return null;

  return {
    sub: claims.sub,
    aal,
    sessionId: typeof claims.session_id === 'string' ? claims.session_id : undefined,
    isAnonymous: claims.is_anonymous === true,
  };
}

export default {
  fetch: withSupabase({ auth: 'user' }, async (req, ctx) => {
    if (req.method !== 'POST') {
      return json({ error: 'method_not_allowed' }, 405);
    }

    const claims = claimsFromContext(ctx);
    if (!claims) {
      return json({ error: 'invalid_auth_claims' }, 401);
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
    } finally {
      await sql.end({ timeout: 1 });
    }
  }),
};
