/** Shared transaction body. Caller must authenticate a human reviewer with MFA. */
export type ReviewedObservation = {
  scopeId: string;
  externalId: string;
  revision: number;
  fingerprint: string;
  sourceId: string;
  title: string;
  approval: true;
};
export interface IntakeDatabase {
  transaction<T>(
    work: (db: {
      queryOne<T>(q: string, p: readonly unknown[]): Promise<T | null>;
    }) => Promise<T>,
  ): Promise<T>;
}
export async function acceptObservation(
  userId: string,
  input: ReviewedObservation,
  database: IntakeDatabase,
) {
  return database.transaction(async (db) => {
    const member = await db.queryOne<{ user_id: string }>(
      "select user_id from fib.app_users where user_id=$1 and active=true and setup_status='active' and role in ('admin','editor')",
      [userId],
    );
    if (!member) throw Error("membership_required");
    const observation = await db.queryOne<{
      canonical_url: string;
      content_fingerprint: string;
      revision: number;
      last_seen_at: string;
    }>(
      "select canonical_url,content_fingerprint,revision,last_seen_at from fib.source_observations where scope_id=$1 and external_id=$2 for update",
      [input.scopeId, input.externalId],
    );
    if (!observation) throw Error("observation_not_found");
    if (
      observation.revision !== input.revision ||
      observation.content_fingerprint !== input.fingerprint
    )
      throw Error("stale_review");
    const scope = await db.queryOne<{ source_id: string }>(
      "select source_id from fib.source_scopes where id=$1",
      [input.scopeId],
    );
    if (scope?.source_id !== input.sourceId)
      throw Error("scope_source_mismatch");
    const source = await db.queryOne<{ homepage_url: string }>(
      "select homepage_url from fib.sources where id=$1 and active=true",
      [input.sourceId],
    );
    if (!source?.homepage_url) throw Error("source_not_found");
    const origin = new URL(observation.canonical_url).origin;
    if (
      ![
        "https://www.feldkirchen.de",
        "https://buergerinfo-feldkirchen.digitalfabrix.de",
      ].includes(origin) ||
      new URL(source.homepage_url).origin !== origin
    )
      throw Error("source_origin_mismatch");
    // Serialize same-source/URL imports even when reached through distinct monitored scopes.
    await db.queryOne("select pg_advisory_xact_lock(hashtextextended($1, 0))", [
      input.sourceId + "|" + observation.canonical_url,
    ]);
    const previous = await db.queryOne<{ finding_id: string }>(
      `select finding_id from fib.finding_versions where metadata->>'scopeId'=$1 and metadata->>'externalId'=$2 and metadata->>'originRevision'=$3`,
      [input.scopeId, input.externalId, String(input.revision)],
    );
    if (previous) return { findingId: previous.finding_id, reused: true };
    const duplicates = await db.queryOne<{ count: string }>(
      "select count(*) from fib.findings where source_id=$1 and original_url=$2",
      [input.sourceId, observation.canonical_url],
    );
    if (Number(duplicates?.count) > 1)
      throw Error("ambiguous_existing_findings");
    let finding = await db.queryOne<{ id: string }>(
      "select id from fib.findings where source_id=$1 and original_url=$2",
      [input.sourceId, observation.canonical_url],
    );
    if (!finding)
      finding = await db.queryOne<{ id: string }>(
        "insert into fib.findings(source_id,title,original_url,content_fingerprint) values($1,$2,$3,$4) returning id",
        [
          input.sourceId,
          input.title,
          observation.canonical_url,
          input.fingerprint,
        ],
      );
    if (!finding) throw Error("finding_write_failed");
    // A new review receipt preserves history; existing editorial text is never overwritten.
    await db.queryOne(
      `insert into fib.finding_versions(finding_id,revision,fingerprint,original_url,observed_at,metadata)
   values($1,(select coalesce(max(revision),0)+1 from fib.finding_versions where finding_id=$1),$2,$3,$4,$5::jsonb) returning id`,
      [
        finding.id,
        input.fingerprint,
        observation.canonical_url,
        observation.last_seen_at,
        JSON.stringify({
          scopeId: input.scopeId,
          externalId: input.externalId,
          originRevision: input.revision,
          approvedBy: userId,
          approvedAt: new Date().toISOString(),
          kind: "reviewed_source_observation",
          relationships: "not_confirmed",
        }),
      ],
    );
    return { findingId: finding.id, reused: false };
  });
}
