import pg from "pg";
import { readFileSync } from "node:fs";
import { options, privateOutput, target, clientOptions } from "./io.mjs";
import { fingerprint } from "./datasets.ts";
async function main() {
  const connection =
    process.env.FIB_MAINTENANCE_DATABASE_URL ??
    process.env.U4_TEST_DATABASE_URL;
  target(connection);
  if (typeof options.out !== "string") throw Error("Private --out required");
  const apply = options.apply === true;
  if (
    apply &&
    (typeof options.approval !== "string" || !options.approval.trim())
  )
    throw Error("Separate deployment approval reference required");
  const db = new pg.Client(clientOptions(connection));
  await db.connect();
  try {
    await db.query(apply ? "begin" : "begin read only");
    await db.query("set local lock_timeout='5s'");
    if (options.rollback) {
      if (typeof options.receipt !== "string")
        throw Error("Original private source activation receipt required");
      const receipt = JSON.parse(readFileSync(options.receipt, "utf8"));
      if (
        receipt.kind !== "fib-ris-source-activation-v1" ||
        receipt.applied !== true ||
        receipt.rows?.length !== 2
      )
        throw Error("Invalid source receipt");
      const homes = [
        "https://buergerinfo-feldkirchen.digitalfabrix.de",
        "https://www.feldkirchen.de",
      ];
      if (
        new Set(receipt.rows.map((r: any) => r.before.homepage_url)).size !== 2
      )
        throw Error("Invalid source identities");
      for (const row of receipt.rows) {
        if (
          !homes.includes(row.before.homepage_url) ||
          row.before.active !== false ||
          row.after.id !== row.before.id ||
          row.after.homepage_url !== row.before.homepage_url ||
          row.after.active !== true
        )
          throw Error("Invalid source rollback receipt");
        const current = (
          await db.query(
            "select to_jsonb(s) r from fib.sources s where id=$1" +
              (apply ? " for update" : ""),
            [row.before.id],
          )
        ).rows;
        if (
          current.length !== 1 ||
          fingerprint(current[0].r) !== fingerprint(row.after)
        )
          throw Error(
            "Source changed since activation; retain data and review, never blindly restore",
          );
        if (apply)
          await db.query("update fib.sources set active=$2 where id=$1", [
            row.before.id,
            row.before.active,
          ]);
      }
      privateOutput(
        options.out,
        JSON.stringify(
          {
            kind: "fib-ris-source-revert-v1",
            applied: apply,
            approval: options.approval ?? null,
          },
          null,
          2,
        ) + "\n",
      );
    } else {
      const before = (
        await db.query(
          "select to_jsonb(s) r from fib.sources s where homepage_url in ('https://buergerinfo-feldkirchen.digitalfabrix.de','https://www.feldkirchen.de') order by homepage_url" +
            (apply ? " for update" : ""),
        )
      ).rows.map((r) => r.r);
      if (before.length !== 2 || before.some((r) => r.active))
        throw Error(
          "Expected exactly the two existing inactive official sources; refresh read-only inventory after drift",
        );
      const rows = [];
      for (const r of before) {
        const after = apply
          ? (
              await db.query(
                "update fib.sources s set active=true where id=$1 returning to_jsonb(s) r",
                [r.id],
              )
            ).rows[0].r
          : { ...r, active: true };
        rows.push({ before: r, after });
      }
      privateOutput(
        options.out,
        JSON.stringify(
          {
            kind: "fib-ris-source-activation-v1",
            applied: apply,
            approval: options.approval ?? null,
            rows,
          },
          null,
          2,
        ) + "\n",
      );
    }
    await db.query(apply ? "commit" : "rollback");
    console.log(
      apply
        ? "Only the approved two FIB source flags changed; receipt retained privately."
        : "Read-only two-source plan written; no changes.",
    );
  } catch (e: any) {
    await db.query("rollback");
    throw e;
  } finally {
    await db.end();
  }
}
main().catch((e) => {
  console.error(e.code ?? e.message);
  process.exitCode = 1;
});
