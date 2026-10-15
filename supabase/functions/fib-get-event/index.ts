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

    let payload: { action?: unknown; eventId?: unknown; search?: unknown };
    try {
      payload = await req.json();
    } catch {
      return json({ error: 'invalid_json' }, 400);
    }

    const listing = payload.action === 'list_events';
    const findingsListing = payload.action === 'list_findings';
    if (payload.action !== undefined && !listing && !findingsListing && payload.action !== 'get_event') {
      return json({ error: 'invalid_action' }, 400);
    }
    if (!listing && !findingsListing && (typeof payload.eventId !== 'string' || payload.eventId.length === 0)) {
      return json({ error: 'event_id_required' }, 400);
    }
    if ((listing || findingsListing) && (payload.search !== undefined && (typeof payload.search !== 'string' || payload.search.length > 120))) {
      return json({ error: 'invalid_search' }, 400);
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

      if (findingsListing) {
        const search = typeof payload.search === 'string' ? payload.search.trim() : '';
        const rows = await sql.unsafe(
          `select f.id, f.title, f.original_url, s.name as source_name,
                    (select j.new_justification from fib.event_finding_justification_log j
                     where j.finding_id=f.id and j.event_id=$2::uuid
                     order by j.changed_at desc, j.id desc limit 1) as previous_justification
             from fib.findings f join fib.sources s on s.id = f.source_id
             where $1::text = '' or f.title ilike '%' || $1 || '%' or s.name ilike '%' || $1 || '%'
             order by f.discovered_at desc nulls last, f.id desc limit 101`,
          [search, typeof payload.eventId === 'string' && /^[0-9a-f-]{36}$/i.test(payload.eventId) ? payload.eventId : null],
        );
        return json({
          ok: true,
          findings: rows.slice(0, 100).map(row => ({
            findingId: row.id, findingTitle: row.title, originalUrl: row.original_url, sourceName: row.source_name, previousJustification: row.previous_justification,
          })),
          hasMore: rows.length > 100,
        });
      }
      if (listing) {
        const search = typeof payload.search === 'string' ? payload.search.trim() : '';
        const rows = await sql.unsafe(
          `select id, title, summary, status, occurred_at from fib.events
           where ($1::text = '' or title ilike '%' || $1 || '%' or coalesce(summary, '') ilike '%' || $1 || '%')
           order by occurred_at desc nulls last, id desc limit 101`,
          [search],
        );
        return json({
          ok: true,
          events: rows.slice(0, 100).map((row) => ({
            id: row.id, title: row.title, summary: row.summary, status: row.status, occurredAt: row.occurred_at,
          })),
          hasMore: rows.length > 100,
        });
      }

      const result = await getEvent(actorResolution.actor, payload.eventId as string, db);

      if (!result.ok) {
        return json(
          { error: result.reason },
          result.reason === 'not_found' ? 404 : 403,
        );
      }

      const sources = await sql.unsafe(
        `select distinct f.id as finding_id, f.title as finding_title, f.original_url,
                s.name as source_name, ef.evidence_role, ef.note, ef.justification
         from fib.event_findings ef
         join fib.findings f on f.id = ef.finding_id
         join fib.sources s on s.id = f.source_id
         where ef.event_id = $1::uuid
         order by s.name, f.title`,
        [payload.eventId],
      );
      return json({
        ...result,
        sources: sources.map((row) => ({
          findingId: row.finding_id,
          findingTitle: row.finding_title,
          originalUrl: row.original_url,
          sourceName: row.source_name,
          evidenceRole: row.evidence_role,
          note: row.note,
          justification: row.justification,
        })),
      });
    } catch (error) {
      console.error('fib-get-event failed', error);
      return json({ error: 'internal_error' }, 500);
    } finally {
      await sql.end({ timeout: 1 });
    }
  },
};
