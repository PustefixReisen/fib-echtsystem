import type { RisSql } from "./ris-structure.ts";
export async function sourceReadiness(tx: RisSql, enabled: boolean) {
  const checks =
    await tx.unsafe(`select x.name, to_regclass('fib.'||x.name) is not null installed,
 coalesce(has_table_privilege(current_user,to_regclass('fib.'||x.name),'SELECT'),false) can_read,
 case when x.name='development_batches' then true else coalesce(has_table_privilege(current_user,to_regclass('fib.'||x.name),'INSERT'),false) end can_insert
 from unnest(array['ris_committees','ris_sessions','ris_session_versions','ris_agenda_items','ris_proposals','ris_documents','ris_document_versions','ris_document_links','ris_agenda_events','ris_suggestions','ris_proposal_texts','ris_decision_points','ris_decision_versions','ris_votes','ris_relation_suggestions','ris_minutes_approvals','ris_review_log','development_batches','development_objects']) x(name)`);
  const [identity] = await tx.unsafe("select current_user runtime_role");
  return {
    contract: "fib-ris-shared-20261031-v1",
    enabled,
    runtimeRole: identity.runtime_role,
    checks,
    ready:
      enabled &&
      identity.runtime_role === "fib_app" &&
      checks.every((r: any) => r.installed && r.can_read && r.can_insert),
  };
}
