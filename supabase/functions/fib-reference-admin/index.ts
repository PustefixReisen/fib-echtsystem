import postgres from 'npm:postgres@3.4.7';

const cors = {
  'access-control-allow-origin': 'https://fib.pustivo.de',
  'access-control-allow-headers': 'authorization, apikey, x-client-info, content-type',
  'access-control-allow-methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { ...cors, 'cache-control': 'no-store' } });

const kinds = new Set(['place','infrastructure','actor','facility','subject']);
const relations = new Set(['located_in','crosses','connects','serves','functional_link','thematic_link']);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ObjectInput = {kind: string; label: string};
function objectInput(input: unknown): ObjectInput | null {
  if (!input || typeof input !== 'object') return null;
  const {kind,label} = input as Record<string, unknown>;
  if (typeof kind !== 'string' || !kinds.has(kind) || typeof label !== 'string') return null;
  const clean = label.trim().replace(/\s+/g, ' ');
  return clean.length >= 2 && clean.length <= 180 ? {kind,label:clean} : null;
}
function evidence(input: unknown): string | null {
  if (typeof input !== 'string' || input.length > 2000 || /\s/.test(input)) return null;
  try { const url = new URL(input); return url.protocol === 'https:' && !!url.hostname && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}
function claims(token: string): Record<string,unknown> | null {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const normalized = part.replace(/-/g,'+').replace(/_/g,'/');
    return JSON.parse(atob(normalized+'='.repeat((4-normalized.length%4)%4)));
  } catch { return null; }
}
async function authorizedUser(request: Request): Promise<string | null> {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  const url = Deno.env.get('SUPABASE_URL');
  const anon = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !anon) return null;
  const response = await fetch(url+'/auth/v1/user', {
    headers: {apikey: anon, authorization: header}, signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) return null;
  const user = await response.json() as {id?:string};
  const payload = claims(header.slice(7));
  return user.id && payload?.sub === user.id && payload.aal === 'aal2' ? user.id : null;
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') return new Response(null, {status:204,headers:cors});
    if (request.method !== 'POST') return json({ok:false,error:'method_not_allowed'},405);
    let body: Record<string,unknown>;
    try {
      body = await request.json() as Record<string,unknown>;
      if (!body || typeof body !== 'object' || Array.isArray(body)) throw Error();
    } catch { return json({ok:false,error:'invalid_body'},400); }

    let userId: string | null;
    try { userId = await authorizedUser(request); }
    catch { return json({ok:false,error:'auth_unavailable'},503); }
    if (!userId) return json({ok:false,error:'mfa_required'},403);
    const db = Deno.env.get('FIB_DATABASE_URL');
    if (!db) return json({ok:false,error:'runtime_not_configured'},503);
    const sql = postgres(db,{max:1,prepare:false,connect_timeout:5,idle_timeout:5});
    try {
      const role = await sql`select 1 from fib.app_users
        where user_id=${userId}::uuid and role='admin' and active=true and setup_status='active' limit 1`;
      if (!role.length) return json({ok:false,error:'admin_required'},403);

      if (body.action === 'list') {
        const rows = await sql`
          select l.id, l.status, l.revision, l.relation_kind, l.evidence_url, l.rationale,
                 l.created_at, l.decided_at,
                 s.label as subject_label, s.object_kind as subject_kind,
                 o.label as object_label, o.object_kind as object_kind
          from fib.research_reference_links l
          join fib.research_reference_objects s on s.id=l.subject_id
          join fib.research_reference_objects o on o.id=l.object_id
          order by case when l.status='proposed' then 0 else 1 end, l.created_at desc limit 200`;
        const [version] = await sql`select active_revision from fib.research_context_state where singleton=true`;
        return json({ok:true,links:rows,activeRevision:Number(version?.active_revision ?? 0)});
      }

      if (body.action === 'propose') {
        const subject = objectInput(body.subject), object = objectInput(body.object);
        const relation = typeof body.relationKind === 'string' ? body.relationKind : '';
        const url = evidence(body.evidenceUrl);
        const rationale = typeof body.rationale === 'string' ? body.rationale.trim() : '';
        if (!subject || !object || !relations.has(relation) || !url ||
          rationale.length < 8 || rationale.length > 2000 ||
          (subject.kind===object.kind && subject.label.toLowerCase()===object.label.toLowerCase()))
          return json({ok:false,error:'invalid_proposal'},400);
        const result = await sql.begin(async tx => {
          const [s] = await tx`insert into fib.research_reference_objects(object_kind,label)
             values(${subject.kind},${subject.label})
             on conflict(object_kind,normalized_label) do update set label=excluded.label
             returning id`;
          const [o] = await tx`insert into fib.research_reference_objects(object_kind,label)
             values(${object.kind},${object.label})
             on conflict(object_kind,normalized_label) do update set label=excluded.label
             returning id`;
          const [link] = await tx`insert into fib.research_reference_links
            (subject_id,object_id,relation_kind,evidence_url,rationale,created_by)
            values(${s.id},${o.id},${relation},${url},${rationale},${userId}::uuid)
            returning id,revision,status`;
          await tx`insert into fib.research_reference_audit(link_id,actor_id,action,revision,snapshot)
            values(${link.id},${userId}::uuid,'propose',${link.revision},
              jsonb_build_object('subject',${subject.label},'object',${object.label},
              'relation',${relation},'evidence',${url},'rationale',${rationale}))`;
          return link;
        });
        return json({ok:true,link:result});
      }

      if (body.action === 'decide') {
        const id = typeof body.linkId === 'string' ? body.linkId : '';
        const revision = body.revision;
        const decision = body.decision;
        if (!uuid.test(id) || !Number.isSafeInteger(revision) || (revision as number) < 1 ||
          (decision !== 'confirmed' && decision !== 'rejected'))
          return json({ok:false,error:'invalid_decision'},400);
        const result = await sql.begin(async tx => {
          const [updated] = await tx`update fib.research_reference_links
            set status=${decision}, revision=revision+1, decided_by=${userId}::uuid,
                decided_at=now(), updated_at=now()
            where id=${id}::uuid and revision=${revision as number} and status='proposed'
            returning id,revision,status,subject_id,object_id,relation_kind,evidence_url,rationale`;
          if (!updated) return null;
          await tx`insert into fib.research_reference_audit(link_id,actor_id,action,revision,snapshot)
            values(${id}::uuid,${userId}::uuid,${decision==='confirmed'?'confirm':'reject'},
              ${updated.revision},${tx.json(updated)})`;
          if (decision === 'confirmed') {
            await tx`update fib.research_context_state
              set active_revision=active_revision+1, changed_at=now() where singleton=true`;
          }
          return updated;
        });
        if (!result) return json({ok:false,error:'revision_conflict_or_not_proposed'},409);
        return json({ok:true,link:result});
      }
      return json({ok:false,error:'unknown_action'},400);
    } catch(error) {
      // Database errors are not sent to the browser: their details may contain SQL/connection secrets.
      console.error('reference-admin-error',error instanceof Error?error.name:'unknown');
      return json({ok:false,error:'operation_failed'},500);
    } finally { await sql.end({timeout:2}); }
  }
};
