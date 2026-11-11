import {analysisDocumentPolicy} from '../_shared/ris-analysis.ts';
import {readRisAnalysis} from '../_shared/ris-analysis-worker.ts';
import {parseRisStructure,risUrl} from '../_shared/ris-structure.ts';
import {prepareRisMinutesSessionDrafts} from '../_shared/ris-minutes-pipeline.ts';
import {createMistralRisDraftProvider} from '../_shared/ris-minutes-mistral-provider.ts';
import {persistRisDocument} from '../_shared/ris-structure.ts';
import {extractText} from 'npm:unpdf@2.1.0';
import {originalStore,readOriginal,fetchRisOriginal} from '../_shared/ris-originals.ts';
import {sourceReadiness} from '../_shared/source-readiness.ts';
import {withDevelopmentDataset} from '../_shared/development-datasets.ts';
import {sourceEditorial} from '../_shared/source-editorial.ts';
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
    const risAction=typeof body.action==='string'&&(body.action.startsWith('ris_')||body.action.startsWith('source_'));
    if(risAction&&body.action!=='source_readiness'&&Deno.env.get('FIB_RIS_STRUCTURE_ENABLED')!=='true')return json({error:'ris_structure_disabled'},503);
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

      if (!['admin','editor'].includes(membership[0].role) && body.action !== 'source_readiness') return json({error:'editor_required'},403);
      if (body.action === 'source_create_event') {
        if (body.sessionId || body.agendaId || body.mainEvent)
          return json({error:'ris_source_readonly'},403);
        if (body.findingId && (await sql.unsafe(`select 1 from fib.ris_documents d
            join fib.ris_document_links l on l.document_id=d.id
            where d.finding_id=$1 and l.status<>'rejected'
              and (l.agenda_id is not null or l.kind='minutes') limit 1`, [body.findingId])).length)
          return json({error:'ris_source_readonly'},403);
      }
      if ((!risAction || body.action === 'source_propose_relation' || body.action === 'source_review_relation') &&
          (await sql.unsafe("select to_regclass('fib.ris_top_events') as relation"))[0]?.relation) {
        const protectedEvent = body.action === 'source_review_relation'
          ? await sql.unsafe(`select 1 from fib.ris_relation_suggestions r
              join fib.ris_top_events t on t.event_id=r.event_id where r.id=$1`, [body.suggestionId])
          : await sql.unsafe("select 1 from fib.ris_top_events where event_id=$1", [body.eventId ?? null]);
        if (protectedEvent.length) return json({error:'ris_event_readonly'},403);
      }
      if (body.action === 'source_capture_pdf') {
        const store = originalStore(Deno.env.get('SUPABASE_URL') ?? '',Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
        await sql.begin(tx=>withDevelopmentDataset(tx,body,async()=>{
          const [v]=await tx.unsafe('select v.*,d.source_url from fib.ris_document_versions v join fib.ris_documents d on d.id=v.document_id where v.id=$1 for update of d,v',[body.versionId]);
          if(!v || !['municipality','licensed'].includes(v.content_author) || !v.rights_evidence)throw Error('ris_pdf_not_permitted_or_missing');
          if(v.pdf_storage_key)return;
          const original=await fetchRisOriginal(v.source_url);
          if(original.hash!==v.content_hash)throw Error('stale_ris_review');
          const text=(await extractText(original.bytes.slice(),{mergePages:true})).text;
          await persistRisDocument(tx,v.source_url,original.hash,text,'unpdf-2.1.0',new Date().toISOString(),{bytes:original.bytes,store});
        }));
        return json({ok:true});
      }
      if (body.action === 'source_pdf') {
        const store = originalStore(Deno.env.get('SUPABASE_URL') ?? '',Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
        const bytes = await sql.begin(tx => readOriginal(tx,body.versionId,store));
        return new Response(bytes as BodyInit,{headers:{...corsHeaders,'content-type':'application/pdf','content-disposition':'inline; filename="fib-original.pdf"','cache-control':'private, no-store','x-content-type-options':'nosniff'}});
      }
      if(body.action==='ris_analysis_read'){
        if(typeof body.agendaId!=='string'||! /^[0-9a-f-]{36}$/i.test(body.agendaId))
          return json({error:'invalid_agenda_id'},400);
        if(!(await sql.unsafe("select to_regclass('fib.ris_analysis_versions') as relation"))[0]?.relation)
          return json({ok:true,status:'not_configured'});
        const result=await sql.begin(tx=>readRisAnalysis(tx,body.agendaId,
          analysisDocumentPolicy(Deno.env.get('FIB_RIS_ANALYSIS_DOCUMENTS_ENABLED')==='true',
            Deno.env.get('FIB_RIS_ANALYSIS_APPROVED_DOCUMENT_CLASSES'))));
        return json({ok:true,...result});
      }
      if(body.action==='source_readiness'){
        if(membership[0].role!=='admin')return json({error:'admin_required'},403);
        return json({ok:true,...await sourceReadiness(sql,Deno.env.get('FIB_RIS_STRUCTURE_ENABLED')==='true')});
      }
      // Opt-in, no-write, editor-triggered AI prefill. No background billing,
      // no upload until a verified source and explicit privacy/budget gates exist.
      // RIS is now a strictly imported source, never an editorial object.
      // Legacy status/document/suggestion/AI mutations are explicitly closed.
      if(typeof body.action==='string' && body.action.startsWith('ris_') &&
         body.action!=='ris_read' && body.action!=='ris_sessions')return json({error:'ris_source_readonly'},403);
      if(body.action==='ris_prepare_minutes_draft'){
        if(Deno.env.get('FIB_RIS_MISTRAL_ENABLED')!=='true' ||
           Deno.env.get('FIB_RIS_MISTRAL_BUDGET_CONFIRMED')!=='true' ||
           Deno.env.get('FIB_RIS_MISTRAL_DPA_CONFIRMED')!=='true')
          return json({error:'ris_draft_not_enabled'},503);
        const key=Deno.env.get('FIB_RIS_MISTRAL_API_KEY')??'';
        const model=Deno.env.get('FIB_RIS_MISTRAL_MODEL')??'mistral-small-latest';
        if(!key)return json({error:'ris_draft_provider_key_missing'},503);
        if(typeof body.agendaId!=='string'||! /^[0-9a-f-]{36}$/i.test(body.agendaId) ||
           typeof body.versionId!=='string'||! /^[0-9a-f-]{36}$/i.test(body.versionId))
          return json({error:'ris_invalid_draft_request'},400);
        const found=await sql.unsafe(
          `select a.number,s.id session_id,s.source_url session_source_url,
                  d.source_url document_source_url,v.content_hash document_hash
             from fib.ris_agenda_items a
             join fib.ris_sessions s on s.id=a.session_id
             join fib.ris_document_links l on l.session_id=s.id
              and l.agenda_id is null and l.kind='minutes' and l.status='confirmed'
             join fib.ris_documents d on d.id=l.document_id
             join fib.ris_document_versions v on v.id=d.latest_version_id and v.document_id=d.id
            where a.id=$1::uuid and d.latest_version_id=$2::uuid`,
          [body.agendaId,body.versionId],
        );
        if(found.length!==1)return json({error:'ris_draft_confirmed_source_required'},409);
        const row=found[0],n=Number(row.number);
        const canonicalSession=risUrl(row.session_source_url);
        if(!Number.isSafeInteger(n)||n<1||n>150||
           !canonicalSession || !canonicalSession.includes('__ksinr='))
          return json({error:'ris_draft_ambiguous_top'},409);
        const live=await fetch(canonicalSession,{redirect:'error',
          signal:AbortSignal.timeout(15000),
          headers:{accept:'text/html','user-agent':'FIB-U4-RIS-Pilot/0.1'}});
        if(!live.ok)return json({error:'ris_draft_official_session_unavailable'},502);
        const html=await live.text();
        if(html.length>1500000)return json({error:'ris_draft_source_too_large'},502);
        const observed=await parseRisStructure(html,canonicalSession,new Date().toISOString());
        const expected=observed.agenda.map(x=>Number(x.number));
        if(expected.length<1||expected.length>150||
           expected.some((k,i)=>!Number.isSafeInteger(k)||k!==i+1))
          return json({error:'ris_draft_live_agenda_incomplete'},409);
        // The minutes source must be directly linked on the current
        // authoritative session HTML, not merely stored in an older FIB row.
        const official=risUrl(row.document_source_url);
        if(!official||!observed.documents.some(d=>d.kind==='minutes'&&d.url===official))
          return json({error:'ris_draft_minutes_source_changed'},409);
        const sourceDocumentId=new URL(official).searchParams.get('id')??'';
        const provider=createMistralRisDraftProvider({
          apiKey:key,model,enabled:true,
        });
        const outcome=await prepareRisMinutesSessionDrafts({
          sessionId:row.session_id,
          sourceDocumentId,sourceUrl:official,
          expectedPdfHash:String(row.document_hash),
          expectedNumbers:expected,selectedTopNumber:n,provider,
        },fetch,async bytes=>(await extractText(bytes.slice(),{mergePages:true})).text);
        // Contains ONLY rewritten draft and vote metadata, never PDF bytes
        // or a raw official source excerpt.
        return json({ok:true,status:outcome.status,reasons:outcome.reasons,
          drafts:outcome.topResults[0]?.result.drafts??[],
          topNumber:n});
      }
      if(risAction){
        if(body.action==='ris_review_document'&&typeof body.versionId!=='string')return json({error:'invalid_review'},409);
        if(['ris_suggest','ris_propose_relation','source_propose_relation'].includes(body.action!)&&body.origin!=='editor')return json({error:'trusted_ai_ingestion_required'},403);
        const service=body.action==='ris_sessions'||body.action?.startsWith('source_')?sourceEditorial:risEditorial;
        const result=await sql.begin(tx=>withDevelopmentDataset(tx,body,()=>body.action==='ris_revoke_storage_rights' ? risEditorial(tx,{userId,kind:'human',aal:'aal2'},body,originalStore(Deno.env.get('SUPABASE_URL') ?? '',Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')) : service(tx,{userId,kind:'human',aal:'aal2'},body)));
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
        if (justification != null && (typeof justification !== 'string' || justification.length > 2000))
          return json({error:'justification_required'},400);
        if (body.risSessionId !== undefined &&
            (typeof body.risSessionId !== "string" ||
             !/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(body.risSessionId))) {
          return json({error:"invalid_ris_session"},400);
        }
        const restored = await sql.begin(tx => withDevelopmentDataset(tx,body,async () => {
          if (body.risSessionId) {
            const allowed = await tx.unsafe(
              `select 1 from fib.ris_documents d
               join fib.ris_document_links l on l.document_id=d.id
               where d.finding_id=$1::uuid and l.session_id=$2::uuid limit 1`,
              [findingId,body.risSessionId],
            );
            if (!allowed.length) throw Error("ris_finding_outside_current_session");
          }
          const inserted = await tx.unsafe(
            `insert into fib.event_findings (event_id, finding_id, evidence_role, justification)
             select $1::uuid, f.id, 'editorial_reference', $3::text
             from fib.findings f
             where f.id=$2::uuid and exists
                (select 1 from fib.events e where e.id=$1::uuid and e.status='confirmed')
             on conflict (event_id, finding_id) do nothing
             returning finding_id, justification`,
            [eventId, findingId, justification?.trim() || null],
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
        }));
        if (!restored) {
          const existing=await sql.unsafe('select event_id from fib.event_findings where event_id=$1 and finding_id=$2',[eventId,findingId]);
          return existing.length ? json({ok:true,reused:true}) : json({ error: 'finding_missing_or_already_linked' }, 409);
        }
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
      if(risAction){
        if(body.action==='ris_review_document'&&typeof body.versionId!=='string')return json({error:'invalid_review'},409);
        const known=error instanceof Error?error.message:'';
        const codes=['ris_pdf_not_permitted_or_missing','ris_stored_pdf_unavailable','ris_pdf_integrity_failed','ris_storage_not_configured','invalid_ris_input','editor_required','ambiguous_ris_source','ambiguous_development_dataset','dataset_snapshot_limit','stale_review','stale_ris_review','ambiguous_existing_findings','existing_significance_conflict','existing_event_role_conflict','missing_exact_evidence','ris_review_already_final','ris_object_missing','source_missing','invalid_source_input','invalid_review','request_conflict','source_origin_mismatch','scope_source_mismatch'];
        if(codes.includes(known))return json({error:known},409);
      }
      console.error('fib-editorial-write failed', error);
      return json({ error: 'internal_error' }, 500);
    } finally {
      await sql.end({ timeout: 1 });
    }
  },
};
