import { decideTopicAction } from './lifecycle.mjs';
import postgres from 'npm:postgres@3.4.7';

// Internal topics editing API. Browser never gets direct table grants.
const corsHeaders = {
  'access-control-allow-origin': 'https://fib.pustivo.de',
  'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
  'access-control-allow-methods': 'POST, OPTIONS',
};
const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { ...corsHeaders, 'cache-control': 'no-store' } });
const uuid = (s: unknown): s is string =>
  typeof s === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
const significance = (s: unknown): s is string =>
  s === 'defining' || s === 'relevant' || s === 'supplementary';

async function resolveAal2User(req: Request): Promise<string | null> {
  const bearer = req.headers.get('authorization');
  if (!bearer?.startsWith('Bearer ')) return null;
  const token = bearer.slice(7);
  const url = Deno.env.get('SUPABASE_URL');
  const anon = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !anon) return null;
  const result = await fetch(url + '/auth/v1/user', { headers: { apikey: anon, authorization: bearer } });
  if (!result.ok) return null;
  const user = await result.json() as { id?: string };
  let claims: Record<string, unknown>;
  try {
    const part = token.split('.')[1];
    const raw = part.replace(/-/g, '+').replace(/_/g, '/');
    claims = JSON.parse(atob(raw + '='.repeat((4 - raw.length % 4) % 4)));
  } catch { return null; }
  return uuid(user.id) && claims.sub === user.id && claims.aal === 'aal2' ? user.id : null;
}

type RequestBody = {
  action?: string; topicId?: string; processId?: string; proposalId?: string;
  title?: string; guidingQuestion?: string; description?: string;
  significance?: string; rationale?: string; origin?: string;
  decision?: string;
  contributionBody?: string; editorialAssessment?: string; expectedRevision?: number; confirmation?: boolean; contributionVersionId?: string; currencyChecked?: boolean;
};

export default {
  async fetch(req: Request) {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
    if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
    const actor = await resolveAal2User(req);
    if (!actor) return json({ error: 'mfa_required_or_invalid_auth' }, 403);
    let body: RequestBody;
    try { body = await req.json(); } catch { return json({ error: 'invalid_json' }, 400); }
    const url = Deno.env.get('FIB_DATABASE_URL');
    if (!url) return json({ error: 'runtime_not_configured' }, 503);
    const sql = postgres(url, { max: 1, prepare: false, idle_timeout: 5, connect_timeout: 5 });
    try {
      const allowed = await sql.unsafe(
        "select role from fib.app_users where user_id=$1::uuid and active=true and setup_status='active'",
        [actor],
      );
      if (!allowed.length || !['admin', 'editor'].includes(allowed[0].role)) {
        return json({ error: 'editor_role_required' }, 403);
      }

      if (body.action === 'list') {
        const topics = await sql.unsafe(
          'select id,title,guiding_question,description,status from fib.topics order by title',
        );
        const proposals = await sql.unsafe(
          `select p.id,p.topic_id,p.process_id,p.suggested_significance,p.suggested_rationale,p.origin,p.status,
                  p.confirmed_significance,p.confirmed_rationale,p.reviewed_at,
                  pr.title as process_title,t.title as topic_title
             from fib.process_topic_proposals p
             join fib.processes pr on pr.id=p.process_id
             join fib.topics t on t.id=p.topic_id
            order by p.created_at desc limit 200`,
        );
        const links = await sql.unsafe(
          `select pt.topic_id,pt.process_id,pt.significance,pt.significance_rationale,
                  pr.title as process_title from fib.process_topics pt
                  join fib.processes pr on pr.id=pt.process_id`,
        );
        const processes = await sql.unsafe('select id,title from fib.processes order by title');
        return json({ topics, proposals, links, processes });
      }
      if (body.action === 'create_topic') {
        if (typeof body.title !== 'string' || !body.title.trim() || body.title.length > 200 ||
            typeof body.guidingQuestion !== 'string' || !body.guidingQuestion.trim() || body.guidingQuestion.length > 1000 ||
            (body.description != null && (typeof body.description !== 'string' || body.description.length > 5000))) {
          return json({ error: 'invalid_topic' }, 400);
        }
        const duplicate = await sql.unsafe('select id from fib.topics where lower(title)=lower($1) limit 1',[body.title.trim()]);
        if (duplicate.length) return json({error:'topic_already_exists'},409);
        const rows = await sql.unsafe(
          'insert into fib.topics (title,guiding_question,description) values ($1,$2,$3) returning id,title',
          [body.title.trim(), body.guidingQuestion.trim(), body.description?.trim() || null],
        );
        return json({ ok: true, topic: rows[0] });
      }
      if (body.action === 'save_contribution_draft') {
        if (!uuid(body.topicId) || typeof body.contributionBody !== 'string' ||
            body.contributionBody.length > 30000 ||
            (body.editorialAssessment != null && (typeof body.editorialAssessment !== 'string' || body.editorialAssessment.length > 30000)) ||
            !Number.isSafeInteger(body.expectedRevision) || Number(body.expectedRevision) < 0) {
          return json({error:'invalid_contribution_draft'},400);
        }
        const result = await sql.begin(async tx => {
          const topic = await tx.unsafe('select status from fib.topics where id=$1::uuid for update',[body.topicId]);
          if (!topic.length) return {error:'topic_not_found',code:404};
          const current = await tx.unsafe('select revision from fib.topic_contribution_drafts where topic_id=$1::uuid for update',[body.topicId]);
          const actual = current.length ? Number(current[0].revision) : 0;
          if (actual !== body.expectedRevision) return {error:'revision_conflict',code:409};
          const rows = await tx.unsafe(`insert into fib.topic_contribution_drafts
              (topic_id,body,editorial_assessment,revision,updated_by,updated_at)
              values ($1::uuid,$2,$3,1,$4::uuid,now())
              on conflict (topic_id) do update set body=excluded.body,
                editorial_assessment=excluded.editorial_assessment,
                revision=fib.topic_contribution_drafts.revision+1,
                updated_by=excluded.updated_by,updated_at=now()
              returning revision`,
              [body.topicId,body.contributionBody,body.editorialAssessment ?? null,actor]);
          return {ok:true,revision:Number(rows[0].revision)};
        });
        return json(result,'code' in result ? result.code : 200);
      }
      if (body.action === 'approve_contribution') {
        if (!uuid(body.topicId)) return json({error:'invalid_topic'},400);
        const result = await sql.begin(async tx => {
          const topics = await tx.unsafe('select status from fib.topics where id=$1::uuid for update',[body.topicId]);
          if (!topics.length) return {error:'topic_not_found',code:404};
          const drafts = await tx.unsafe('select body,editorial_assessment from fib.topic_contribution_drafts where topic_id=$1::uuid for update',[body.topicId]);
          const valid = decideTopicAction('approve',{topicStatus:topics[0].status,body:drafts[0]?.body,approvedVersion:false,approvalRevoked:false});
          if (!valid.allowed) return {error:valid.reason,code:409};
          const existing = await tx.unsafe(`select 1 from fib.topic_contribution_versions
              where topic_id=$1::uuid and revoked_at is null
                and not exists(select 1 from fib.topic_publications where contribution_version_id=fib.topic_contribution_versions.id)
              limit 1`,[body.topicId]);
          if (existing.length) return {error:'unpublished_approval_already_exists',code:409};
          const revisions=await tx.unsafe('select id from fib.topic_revisions where topic_id=$1::uuid order by revision_no desc limit 1',[body.topicId]);
          const rows=await tx.unsafe(`insert into fib.topic_contribution_versions
             (topic_id,version_no,topic_revision_id,body,editorial_assessment,approved_by)
             values ($1::uuid,(select coalesce(max(version_no),0)+1 from fib.topic_contribution_versions where topic_id=$1::uuid),
                     $2::uuid,$3,$4,$5::uuid) returning id,version_no`,
             [body.topicId,revisions[0]?.id ?? null,drafts[0].body,drafts[0].editorial_assessment,actor]);
          if (valid.resultStatus !== topics[0].status) await tx.unsafe('update fib.topics set status=$2,updated_at=now() where id=$1::uuid',[body.topicId,valid.resultStatus]);
          return {ok:true,versionId:rows[0].id,versionNo:rows[0].version_no};
        });
        return json(result,'code' in result ? result.code : 200);
      }
      if (body.action === 'revoke_contribution' || body.action === 'publish_contribution') {
        if (!uuid(body.topicId) || !uuid(body.contributionVersionId))
          return json({error:'invalid_contribution_version'},400);
        const action = body.action === 'revoke_contribution' ? 'revoke' : 'publish';
        const result = await sql.begin(async tx => {
          const topic = await tx.unsafe('select status from fib.topics where id=$1::uuid for update',[body.topicId]);
          if (!topic.length) return {error:'topic_not_found',code:404};
          const versions = await tx.unsafe(
            'select id,revoked_at from fib.topic_contribution_versions where id=$1::uuid and topic_id=$2::uuid for update',
            [body.contributionVersionId,body.topicId]);
          if (!versions.length) return {error:'version_not_found',code:404};
          const history = await tx.unsafe(
            'select count(*)::integer as n from fib.topic_publications where topic_id=$1::uuid',[body.topicId]);
          const published = await tx.unsafe(
            'select 1 from fib.topic_publications where contribution_version_id=$1::uuid limit 1',
            [body.contributionVersionId]);
          const outcome = decideTopicAction(action,{
            topicStatus:topic[0].status,
            approvedVersion:true,
            approvalRevoked:versions[0].revoked_at !== null,
            approvalEverPublished:published.length > 0,
            everPublished:Number(history[0].n) > 0,
            explicitConfirmation:body.confirmation === true,
          });
          if (!outcome.allowed) return {error:outcome.reason,code:409};
          if (action === 'revoke') {
            await tx.unsafe(
              'update fib.topic_contribution_versions set revoked_by=$2::uuid,revoked_at=now() where id=$1::uuid',
              [body.contributionVersionId,actor]);
            if (outcome.resultStatus !== topic[0].status)
              await tx.unsafe('update fib.topics set status=$2,updated_at=now() where id=$1::uuid',
                [body.topicId,outcome.resultStatus]);
          } else {
            await tx.unsafe(`update fib.topic_publications
                set ended_at=now(),ended_by=$2::uuid,ended_reason='replaced'
                where topic_id=$1::uuid and ended_at is null`,[body.topicId,actor]);
            await tx.unsafe(`insert into fib.topic_publications
                (topic_id,contribution_version_id,published_by)
                values ($1::uuid,$2::uuid,$3::uuid)`,[body.topicId,body.contributionVersionId,actor]);
          }
          return {ok:true,status:outcome.resultStatus};
        });
        return json(result,'code' in result ? result.code : 200);
      }
      if (body.action === 'defer_topic' || body.action === 'archive_topic' || body.action === 'reactivate_topic') {
        if (!uuid(body.topicId)) return json({error:'invalid_topic'},400);
        const action = body.action === 'defer_topic' ? 'defer' :
          body.action === 'archive_topic' ? 'archive' : 'reactivate';
        const result = await sql.begin(async tx => {
          const topic = await tx.unsafe('select status from fib.topics where id=$1::uuid for update',[body.topicId]);
          if (!topic.length) return {error:'topic_not_found',code:404};
          const published=await tx.unsafe(`select contribution_version_id from fib.topic_publications
              where topic_id=$1::uuid order by published_at desc limit 1`,[body.topicId]);
          const lastVersion = published.length ? await tx.unsafe(
            'select body,editorial_assessment from fib.topic_contribution_versions where id=$1::uuid',
            [published[0].contribution_version_id]) : [];
          const drafts = await tx.unsafe(
            'select body,editorial_assessment from fib.topic_contribution_drafts where topic_id=$1::uuid',
            [body.topicId]);
          const unchanged = lastVersion.length > 0 && (
            !drafts.length || (drafts[0].body === lastVersion[0].body &&
            drafts[0].editorial_assessment === lastVersion[0].editorial_assessment));
          const approved = await tx.unsafe(`select id,body,editorial_assessment
              from fib.topic_contribution_versions where topic_id=$1::uuid
              and revoked_at is null order by version_no desc limit 1`,[body.topicId]);
          const matchingFreshApproval = approved.length > 0 && drafts.length > 0 &&
            approved[0].body === drafts[0].body &&
            approved[0].editorial_assessment === drafts[0].editorial_assessment;
          const check=decideTopicAction(action,{
            topicStatus:topic[0].status,
            explicitConfirmation:body.confirmation === true,
            currencyCheckConfirmed:body.currencyChecked === true && approved.length > 0,
            unchangedContent:unchanged,
            newContentApproved:matchingFreshApproval,
          });
          if (!check.allowed) return {error:check.reason,code:409};
          if (action !== 'reactivate')
            await tx.unsafe(`update fib.topic_publications set ended_at=now(),ended_by=$2::uuid,
                ended_reason=$3 where topic_id=$1::uuid and ended_at is null`,
                [body.topicId,actor,action === 'archive' ? 'archived' : 'deferred']);
          else
            await tx.unsafe(`insert into fib.topic_currency_checks
                (topic_id,contribution_version_id,checked_by,result)
                values ($1::uuid,$2::uuid,$3::uuid,'current')`,
                [body.topicId,unchanged ? published[0].contribution_version_id : approved[0].id,actor]);
          await tx.unsafe('update fib.topics set status=$2,updated_at=now() where id=$1::uuid',
            [body.topicId,check.resultStatus]);
          return {ok:true,status:check.resultStatus};
        });
        return json(result,'code' in result ? result.code : 200);
      }
      if (body.action === 'propose') {
        if (!uuid(body.topicId) || !uuid(body.processId) || !significance(body.significance) ||
            typeof body.rationale !== 'string' || !body.rationale.trim() || body.rationale.length > 4000 ||
            body.origin !== 'editor') {
          return json({ error: 'invalid_proposal' }, 400);
        }
        const link = await sql.unsafe(
          'select 1 from fib.process_topics where process_id=$1::uuid and topic_id=$2::uuid',
          [body.processId,body.topicId],
        );
        if (link.length) return json({ error: 'relationship_already_confirmed' }, 409);
        const existing = await sql.unsafe(
          "select 1 from fib.process_topic_proposals where process_id=$1::uuid and topic_id=$2::uuid and status='pending'",
          [body.processId,body.topicId],
        );
        if (existing.length) return json({ error: 'proposal_already_pending' }, 409);
        // Until a trusted AI service integration exists, the browser may create only editor-origin proposals.
        const rows = await sql.unsafe(
          `insert into fib.process_topic_proposals (process_id,topic_id,suggested_significance,suggested_rationale,origin)
             values ($1::uuid,$2::uuid,$3,$4,$5) returning id`,
          [body.processId,body.topicId,body.significance,body.rationale.trim(),body.origin],
        );
        return json({ ok: true, proposalId: rows[0].id });
      }
      if (body.action === 'decide') {
        if (!uuid(body.proposalId) || !['confirmed', 'rejected'].includes(body.decision ?? '') ||
            (body.decision === 'confirmed' && (!significance(body.significance) ||
             typeof body.rationale !== 'string' || !body.rationale.trim() || body.rationale.length > 4000))) {
          return json({ error: 'invalid_decision' }, 400);
        }
        const outcome = await sql.begin(async tx => {
          const proposal = await tx.unsafe(
            'select process_id,topic_id,status from fib.process_topic_proposals where id=$1::uuid for update',
            [body.proposalId],
          );
          if (!proposal.length) return 'not_found';
          if (proposal[0].status !== 'pending') return 'already_decided';
          if (body.decision === 'confirmed') {
            const existing = await tx.unsafe(
              'select 1 from fib.process_topics where process_id=$1::uuid and topic_id=$2::uuid',
              [proposal[0].process_id,proposal[0].topic_id],
            );
            if (existing.length) return 'relationship_already_confirmed';
            await tx.unsafe(
              'insert into fib.process_topics (process_id,topic_id,significance,significance_rationale) values ($1::uuid,$2::uuid,$3,$4)',
              [proposal[0].process_id,proposal[0].topic_id,body.significance,body.rationale?.trim()],
            );
          }
          await tx.unsafe(
            `update fib.process_topic_proposals
                set status=$2,reviewed_by=$3::uuid,reviewed_at=now(),
                    confirmed_significance=$4,confirmed_rationale=$5
              where id=$1::uuid`,
            [body.proposalId,body.decision,actor,
              body.decision === 'confirmed' ? body.significance : null,
              body.decision === 'confirmed' ? body.rationale?.trim() : null],
          );
          return 'ok';
        });
        if (outcome !== 'ok') return json({ error: outcome }, outcome === 'not_found' ? 404 : 409);
        return json({ ok: true });
      }
      return json({ error: 'unknown_action' }, 400);
    } catch (error) {
      console.error('fib-topic-editor failed', error);
      if (error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === '23505') return json({ error: 'duplicate_topic_or_pending_proposal' }, 409);
      return json({ error: 'topic_operation_failed' }, 500);
    } finally { await sql.end(); }
  },
};
