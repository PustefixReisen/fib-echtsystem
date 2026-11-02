/** Upgrade existing RIS metadata through the same importer; never creates events/messages. */
import pg from "pg";
import { clientOptions, options, privateOutput } from "./io.mjs";
import { ensureRisFinding } from "../../supabase/functions/_shared/ris-structure.ts";
import { withDevelopmentDataset } from "../../supabase/functions/_shared/development-datasets.ts";
import { adapter, fingerprint } from "./datasets.ts";
async function main() {
  if (typeof options.out !== "string") throw Error("Private --out required");
  const apply = options.apply === true;
  if (
    apply &&
    (typeof options.approval !== "string" || !options.approval.trim() ||
      typeof options["plan-sha"] !== "string")
  ) throw Error("Reviewed --plan-sha and --approval required");
  const db = new pg.Client(
    clientOptions(
      process.env.FIB_MAINTENANCE_DATABASE_URL ??
        process.env.U4_TEST_DATABASE_URL,
    ),
  );
  await db.connect();
  try {
    await db.query("begin");
    const tx = adapter(db);
    const rows = await tx.unsafe(
      "select id,source_url,finding_id,latest_version_id from fib.ris_documents order by id for update",
    );
    const plan = { kind: "ris-automatic-findings-upgrade-v1", documents: rows },
      sha = fingerprint(plan);
    if (apply && sha !== options["plan-sha"]) {
      throw Error("stale_backfill_plan");
    }
    const results = [];
    if (apply) {
      for (const d of rows) {
        results.push(
          await withDevelopmentDataset(
            tx,
            { action: "ris_backfill_finding", versionId: d.latest_version_id },
            () => ensureRisFinding(tx, d.id, d.latest_version_id ?? undefined),
          ),
        );
      }
    }
    privateOutput(
      options.out,
      JSON.stringify(
        { ...plan, sha256: sha, applied: apply, results },
        null,
        2,
      ) + "\n",
    );
    await db.query(apply ? "commit" : "rollback");
    console.log(
      apply
        ? "Applied reviewed RIS finding metadata upgrade."
        : "Private RIS finding upgrade plan written; no writes.",
    );
  } catch (e) {
    await db.query("rollback");
    throw e;
  } finally {
    await db.end();
  }
}
main().catch((e) => {
  console.error(e instanceof Error ? e.message : "Upgrade failed");
  process.exitCode = 1;
});
