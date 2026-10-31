import assert from "node:assert/strict";
import {
  mkdtempSync,
  symlinkSync,
  existsSync,
  readFileSync,
  statSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  privateOutput,
  privatePath,
  target,
  clientOptions,
} from "../../scripts/ris-shared-apps/io.mjs";
const dir = mkdtempSync(join(tmpdir(), "fib-operator-guards-"));
try {
  const secret = "synthetic_do_not_print";
  assert.throws(
    () =>
      target(
        "postgres://postgres:" + secret + "@db.other.supabase.co/postgres",
      ),
    (e) => !e.message.includes(secret),
  );
  assert.throws(
    () => target("invalid://" + secret),
    (e) => !e.message.includes(secret),
  );
  const shared =
    "postgres://postgres:" +
    secret +
    "@db.apaubomxffcwtzjimori.supabase.co/postgres";
  assert.throws(
    () => clientOptions(shared + "?sslmode=disable"),
    /TLS required/,
  );
  const tls = clientOptions(shared + "?sslmode=no-verify");
  assert.equal(tls.ssl.rejectUnauthorized, true);
  assert.ok(!tls.connectionString.includes("sslmode"));
  symlinkSync(process.cwd(), join(dir, "repo-link"), "dir");
  assert.throws(
    () =>
      privateOutput(
        join(dir, "repo-link", "forbidden-private-output.json"),
        "private",
      ),
    /outside Git/,
  );
  assert.throws(
    () => privatePath(join(dir, "repo-link", "nested", "dump")),
    /outside Git/,
  );
  assert.ok(!existsSync("forbidden-private-output.json"));
  const old = process.cwd();
  try {
    process.chdir(dir);
    assert.throws(
      () =>
        privateOutput(join(old, "forbidden-private-output.json"), "private"),
      /outside Git/,
    );
  } finally {
    process.chdir(old);
  }
  const file = join(dir, "receipt.json");
  privateOutput(file, "private");
  assert.equal(statSync(file).mode & 0o777, 0o600);
  assert.equal(readFileSync(file, "utf8"), "private");
  assert.throws(() => privateOutput(file, "overwrite"));
  assert.equal(readFileSync(file, "utf8"), "private");
  console.log(
    "PASS operator guards: wrong project refused without credentials, verified TLS, repository/symlink exclusion and private non-overwriting receipts; no network or database calls",
  );
} finally {
  rmSync(dir, { recursive: true, force: true });
}
