import pg from "pg";
import { extractText } from "unpdf";
import { pathToFileURL } from "node:url";
import { adapter, datasetKeys, registerCreatedRows } from "./datasets.ts";
import { clientOptions, options, privateOutput, target } from "./io.mjs";
import { fetchRisOriginal } from "../../supabase/functions/_shared/ris-originals.ts";
import { parseRisStructure, persistRisDocument, persistRisStructure, type RisSql } from "../../supabase/functions/_shared/ris-structure.ts";
import { parseRisTopVotes, persistRisTopVotes } from "../../supabase/functions/_shared/ris-top-votes.ts";

const batch = "ris-423-rebuild";
const targets = [
  { id: "1031", reference: "GR/439/2026", date: "2026-10-15", tops: 19 },
  { id: "1032", reference: "GR/440/2026", date: "2026-10-29", tops: 12 },
];
const sessionUrl = (id: string) => "https://buergerinfo-feldkirchen.digitalfabrix.de/si0057.asp?__ksinr=" + id;

export async function captureAcceptance(fetcher = fetch) {
  return await Promise.all(targets.map(async target => {
    const url = sessionUrl(target.id);
    const response = await fetcher(url, {redirect: "error", signal: AbortSignal.timeout(20000)});
    if (!response.ok) throw Error("ris_session_http_" + response.status);
    const html = await response.text();
    if (html.length > 1500000) throw Error("ris_session_too_large");
    const snapshot = await parseRisStructure(html, url, new Date().toISOString());
    if (snapshot.reference !== target.reference || snapshot.date !== target.date ||
        snapshot.agenda.length !== target.tops || snapshot.agenda.some((a,i) => Number(a.number) !== i+1))
      throw Error("ris_acceptance_source_identity_or_coverage");
    const minutes = snapshot.documents.filter(d => d.kind === "minutes");
    if (minutes.length > 1 || (target.id === "1031" && minutes.length !== 1))
      throw Error("ris_acceptance_minutes_missing_or_ambiguous");
    const document = minutes[0];
    if (!document) return {snapshot, minutes: null};
    const original = await fetchRisOriginal(document.url, fetcher);
    const {text} = await extractText(original.bytes, {mergePages:true});
    parseRisTopVotes(text, snapshot.agenda.map(a => Number(a.number)));
    return {snapshot, minutes: {url: document.url, hash: original.hash, text}};
  }));
}

/** Caller owns the transaction. Both real sources must pass validation before any reset. */
export async function rebuildAcceptance(tx: RisSql, captures: Awaited<ReturnType<typeof captureAcceptance>>) {
  await tx.unsafe("select pg_advisory_xact_lock(hashtextextended($1,0))", [batch]);
  const scopes = await tx.unsafe("select id from fib.source_scopes where scope_key='ris-dokumentliste' and status='candidate' for update");
  if (scopes.length !== 1) throw Error("ris_acceptance_scope_not_unique");
  const sessions = await tx.unsafe(
    "select id,reference,source_url,session_date::text from fib.ris_sessions where source_url in ($1,$2) order by source_url for update",
    targets.map(t => sessionUrl(t.id)),
  );
  if (sessions.length !== 2 || sessions.some((s,i) => s.reference !== targets[i].reference || s.session_date !== targets[i].date))
    throw Error("ris_acceptance_existing_identity_mismatch");
  for (const [index, capture] of captures.entries()) {
    const known = await tx.unsafe("select source_key from fib.ris_agenda_items where session_id=$1 for update", [sessions[index].id]);
    const keys = new Set(capture.snapshot.agenda.map(a => a.key));
    if (known.some(row => !keys.has(row.source_key))) throw Error("ris_acceptance_historical_top_requires_review");
  }
  const existing = await tx.unsafe("select status from fib.development_batches where id=$1", [batch]);
  if (existing.length && existing[0].status !== "active") throw Error("ris_acceptance_batch_closed");
  let retired = 0;
  if (!existing.length) {
    // Only the two sessions' projection/association rows are replaced. Historical
    // events and their external uses, source versions and document rights remain intact.
    const ids = sessions.map(s => s.id);
    const dependents = await tx.unsafe(`select 1 from pg_constraint where contype='f' and confrelid in (
      'fib.ris_top_events'::regclass,'fib.ris_top_vote_results'::regclass,
      'fib.ris_agenda_events'::regclass,'fib.ris_session_events'::regclass)
      and not (conrelid='fib.ris_decision_points'::regclass and confrelid='fib.ris_agenda_events'::regclass and confdeltype='a')`);
    if (dependents.length) throw Error("ris_acceptance_unreviewed_incoming_fk");
    const keys = await tx.unsafe(`select a.id from fib.ris_agenda_items a where a.session_id=any($1::uuid[])`, [ids]);
    const agendaIds = keys.map(a => a.id);
    const historicDecisions = await tx.unsafe("select 1 from fib.ris_decision_points where agenda_id=any($1::uuid[]) limit 1", [agendaIds]);
    if (historicDecisions.length) throw Error("ris_acceptance_historical_decision_requires_review");
    const references = await tx.unsafe(`select 1 from fib.development_objects where ownership='reference'
      and table_name in ('ris_top_events','ris_top_vote_results','ris_agenda_events')
      and row_key->>'agenda_id'=any($1::text[]) limit 1`, [agendaIds]);
    if (references.length) throw Error("ris_acceptance_shared_projection_requires_review");
    await tx.unsafe(`delete from fib.development_objects where
      (table_name in ('ris_top_events','ris_top_vote_results','ris_agenda_events') and row_key->>'agenda_id'=any($1::text[]))`, [agendaIds]);
    await tx.unsafe("delete from fib.ris_top_vote_results where agenda_id=any($1::uuid[])", [agendaIds]);
    const top = await tx.unsafe("delete from fib.ris_top_events where agenda_id=any($1::uuid[]) returning event_id", [agendaIds]);
    const legacy = await tx.unsafe("delete from fib.ris_agenda_events where agenda_id=any($1::uuid[]) returning event_id", [agendaIds]);
    const session = await tx.unsafe("delete from fib.ris_session_events where session_id=any($1::uuid[]) returning event_id", [ids]);
    retired = new Set([...top,...legacy,...session].map(row => row.event_id)).size;
    await tx.unsafe("insert into fib.development_batches(id,purpose,approval_reference) values($1,'RIS Nachabnahme Paket A','GitHub #423')", [batch]);
  }
  const before = await datasetKeys(tx);
  const results = [];
  for (const {snapshot, minutes} of captures) {
    const imported = await persistRisStructure(tx, snapshot);
    let voteCount = 0;
    if (minutes) {
      await persistRisDocument(tx, minutes.url, minutes.hash, null, "unpdf-2.1.0", snapshot.observedAt);
      ({voteCount} = await persistRisTopVotes(tx, imported.sessionId, minutes.url, minutes.hash, minutes.text, snapshot.observedAt));
    }
    const [counts] = await tx.unsafe(`select count(*)::int tops,count(t.event_id)::int events
      from fib.ris_agenda_items a left join fib.ris_top_events t on t.agenda_id=a.id where a.session_id=$1`, [imported.sessionId]);
    if (counts.tops !== snapshot.agenda.length || counts.events !== counts.tops)
      throw Error("ris_acceptance_postcondition");
    results.push({reference: snapshot.reference, ...counts, voteCount, minutes: Boolean(minutes)});
  }
  await registerCreatedRows(tx, batch, before);
  return {reset: !existing.length, historicalEventRecordsRetained: retired, sessions: results};
}

async function main() {
  const connection = process.env.FIB_MAINTENANCE_DATABASE_URL ?? process.env.U4_TEST_DATABASE_URL;
  const {local} = target(connection);
  if (options.apply === true && !local && options.approval !== "RIS-423")
    throw Error("Protected RIS-423 operator confirmation required");
  if (typeof options.out !== "string") throw Error("Private --out required");
  const captures = await captureAcceptance();
  const db = new pg.Client(clientOptions(connection));
  await db.connect();
  try {
    await db.query("begin");
    const result = await rebuildAcceptance(adapter(db), captures);
    privateOutput(options.out, JSON.stringify({mode:options.apply === true ? "apply" : "rollback rehearsal", ...result},null,2) + "\n");
    await db.query(options.apply === true ? "commit" : "rollback");
    console.log(JSON.stringify(result));
  } finally {
    await db.end();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error("RIS acceptance rebuild aborted:", error.code ?? error.message);
    process.exitCode = 1;
  });
}
