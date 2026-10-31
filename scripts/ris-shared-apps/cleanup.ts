import pg from "pg";
import { options, privateOutput, target, clientOptions } from "./io.mjs";
import { adapter, cleanupPlan, cleanup } from "./datasets.ts";
async function main() {
  const connection =
    process.env.FIB_MAINTENANCE_DATABASE_URL ??
    process.env.U4_TEST_DATABASE_URL;
  target(connection);
  if (typeof options.batch !== "string" || typeof options.out !== "string")
    throw Error("--batch and private --out required");
  const apply = options.apply === true;
  if (
    apply &&
    (typeof options.approval !== "string" ||
      !options.approval.trim() ||
      (!options.close && typeof options["plan-sha"] !== "string"))
  )
    throw Error("Separate cleanup approval and reviewed --plan-sha required");
  const db = new pg.Client(clientOptions(connection));
  await db.connect();
  const tx = adapter(db);
  try {
    await db.query(apply ? "begin" : "begin read only");
    await db.query("set local time zone 'UTC'");
    const plan = await cleanupPlan(tx, options.batch);
    if (apply && options.close) {
      if (!["active", "closed"].includes(plan.status))
        throw Error("dataset_not_active");
      await tx.unsafe(
        "update fib.development_batches set status='closed' where id=$1 and status='active'",
        [options.batch],
      );
      privateOutput(
        options.out,
        JSON.stringify(
          { batch: options.batch, approval: options.approval, closed: true },
          null,
          2,
        ) + "\n",
      );
      await db.query("commit");
      console.log(
        "Dataset closed for tracking. No application data removed. Generate a new cleanup plan before deletion.",
      );
    } else if (apply) {
      const result = await cleanup(tx, options.batch, options["plan-sha"]);
      privateOutput(
        options.out,
        JSON.stringify(
          {
            batch: options.batch,
            approval: options.approval,
            planSha256: plan.sha256,
            ...result,
          },
          null,
          2,
        ) + "\n",
      );
      await db.query("commit");
      console.log(
        "Only explicitly owned rows removed. Master data, users, references and other applications retained.",
      );
    } else {
      privateOutput(options.out, JSON.stringify(plan, null, 2) + "\n");
      await db.query("rollback");
      console.log("Read-only cleanup plan written; no data changed.");
    }
  } catch (e: any) {
    await db.query("rollback");
    console.error("Cleanup aborted:", e.code ?? e.message);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
}
main().catch((e) => {
  console.error(e.code ?? e.message);
  process.exitCode = 1;
});
