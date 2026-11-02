// Schema-only scope, including FIB ACLs. Snapshot and Auth FK identifiers contain no Auth secrets.
import pg from "pg";
import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  chmodSync,
  existsSync,
  readdirSync,
  openSync,
  closeSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { options, target, clientOptions, privatePath, dumpEnvironment } from "./io.mjs";
process.umask(0o077);
const connection =
  process.env.FIB_MAINTENANCE_DATABASE_URL ?? process.env.U4_TEST_DATABASE_URL;
const { u, local } = target(connection);
if (typeof options.out !== "string")
  throw Error("Private --out directory required");
const root = privatePath(options.out);
if (root === "/" || (existsSync(root) && readdirSync(root).length))
  throw Error("Use a new private directory outside Git");
mkdirSync(root, { recursive: true, mode: 0o700 });
chmodSync(root, 0o700);
const db = new pg.Client(clientOptions(connection));
try {
  await db.connect();
} catch (error) {
  const code = error?.code;
  const kind = code === "28P01" ? "AUTH_FAILED"
    : code === "3D000" ? "DATABASE_NOT_FOUND"
    : code === "ENOTFOUND" || code === "EAI_AGAIN" ? "DNS_FAILED"
    : code === "ETIMEDOUT" || code === "ECONNREFUSED" ? "NETWORK_FAILED"
    : ["UNABLE_TO_VERIFY_LEAF_SIGNATURE", "SELF_SIGNED_CERT_IN_CHAIN", "DEPTH_ZERO_SELF_SIGNED_CERT", "CERT_HAS_EXPIRED", "ERR_TLS_CERT_ALTNAME_INVALID"].includes(code) ? "TLS_FAILED"
    : "CONNECTION_FAILED";
  console.error("FIB_DB_DIAG: " + kind);
  process.exit(1);
}
try {
  await db.query("begin isolation level repeatable read read only");
  const snapshot = (await db.query("select pg_export_snapshot() s")).rows[0].s;
  const authIds = (
    await db.query("select user_id from fib.app_users order by user_id")
  ).rows.map((r) => r.user_id);
  const tables = (
    await db.query(
      "select tablename from pg_tables where schemaname='fib' order by tablename",
    )
  ).rows;
  const tableCounts = {};
  for (const { tablename } of tables)
    tableCounts[tablename] = Number(
      (
        await db.query(
          'select count(*) n from fib."' +
            tablename.replaceAll('"', '""') +
            '"',
        )
      ).rows[0].n,
    );
  const risOriginals = tables.some(t=>t.tablename==='ris_document_versions') ? (await db.query(`select id,document_id,content_hash,to_jsonb(v)->>'pdf_storage_key' storage_key,(to_jsonb(v)->>'pdf_size')::bigint size,to_jsonb(v)->>'content_author' content_author from fib.ris_document_versions v where to_jsonb(v)->>'pdf_storage_key' is not null order by id`)).rows : [];
  if(risOriginals.some(v=>!['municipality','licensed'].includes(v.content_author)))throw Error('Unlicensed original in snapshot; resolve storage rights before backup');
  const env = dumpEnvironment(connection);
  const dump = join(root, "fib.dump"),
    fd = openSync(dump, "wx", 0o600);
  const r = spawnSync(
    "pg_dump",
    ["--schema=fib", "--format=custom", "--no-owner", "--snapshot=" + snapshot],
    { env, stdio: ["ignore", fd, "pipe"], timeout: 120000 },
  );
  closeSync(fd);
  if (r.status !== 0) console.error("FIB_DB_DIAG: PG_DUMP_FAILED");
  if (r.status !== 0)
    throw Error(
      "Schema dump failed; verify local PostgreSQL client major and TLS configuration. No secret printed.",
    );
  writeFileSync(join(root, "auth-ids.json"), JSON.stringify(authIds) + "\n", {
    mode: 0o600,
  });
  const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
  const manifest = {
    format: 2,
    risOriginals,
    schema: "fib",
    project: local ? "isolated-test" : "apaubomxffcwtzjimori",
    createdAt: new Date().toISOString(),
    serverVersion: (await db.query("show server_version")).rows[0]
      .server_version,
    tableCounts,
    files: {
      "fib.dump": sha(dump),
      "auth-ids.json": sha(join(root, "auth-ids.json")),
    },
    containsAuthSecrets: false,
    aclIncluded: true,
  };
  writeFileSync(
    join(root, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
    { mode: 0o600 },
  );
  await db.query("rollback");
  console.log(
    "Private snapshot-consistent fib dump created; no other schema data or Auth secrets exported.",
  );
} finally {
  await db.end();
}
