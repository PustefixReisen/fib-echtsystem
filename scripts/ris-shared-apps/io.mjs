import { X509Certificate } from "node:crypto";
import { resolve, dirname, basename } from "node:path";
import {
  mkdirSync,
  writeFileSync,
  existsSync,
  lstatSync,
  readFileSync,
  realpathSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
const repositoryRoot = realpathSync(
  fileURLToPath(new URL("../../", import.meta.url)),
);
export function privatePath(path) {
  const p = resolve(path);
  let ancestor = p;
  const suffix = [];
  while (!existsSync(ancestor)) {
    suffix.unshift(basename(ancestor));
    ancestor = dirname(ancestor);
  }
  const canonical = resolve(realpathSync(ancestor), ...suffix);
  if (
    [p, canonical].some(
      (candidate) =>
        candidate === repositoryRoot ||
        candidate.startsWith(repositoryRoot + "/"),
    )
  )
    throw Error("Private output must be outside Git");
  return p;
}
export const options = Object.fromEntries(
  process.argv
    .slice(2)
    .map((s) => s.replace(/^--/, "").split(/=(.*)/s).slice(0, 2))
    .map(([k, v]) => [k, v ?? true]),
);
export function privateOutput(path, body) {
  const p = privatePath(path);
  if (existsSync(p) && lstatSync(p).isSymbolicLink())
    throw Error("No symlink output");
  mkdirSync(dirname(p), { recursive: true, mode: 0o700 });
  writeFileSync(p, body, { mode: 0o600, flag: "wx" });
  return p;
}
export function target(connection) {
  if (!connection)
    throw Error(
      "Maintenance connection required; never place it in a command argument",
    );
  let u;
  try {
    u = new URL(connection);
  } catch {
    throw Error("Invalid maintenance connection; credential not printed");
  }
  if (!["postgres:", "postgresql:"].includes(u.protocol) || u.hash)
    throw Error("Invalid database URL protocol or fragment; encode credentials");
  try { decodeURIComponent(u.username); decodeURIComponent(u.password); }
  catch { throw Error("Invalid percent encoding in database credentials"); }
  for (const key of u.searchParams.keys()) {
    if (!["sslmode", "sslcert", "sslkey", "sslrootcert", "application_name"].includes(key) || u.searchParams.getAll(key).length !== 1)
      throw Error("Unsupported database URL parameter");
  }
  const local =
    ["localhost", "127.0.0.1"].includes(u.hostname) &&
    u.pathname === "/fib_u4_test" &&
    u.username === "postgres";
  const shared =
    ((u.hostname === "db.apaubomxffcwtzjimori.supabase.co" &&
      u.username === "postgres") ||
      (u.hostname.endsWith(".pooler.supabase.com") &&
        u.username === "postgres.apaubomxffcwtzjimori")) &&
    u.pathname === "/postgres";
  if (!local && !shared)
    throw Error(
      "Only approved FIB Shared-Apps target or isolated fib_u4_test accepted",
    );
  if (!local && (!u.password || (u.port && u.port !== "5432")))
    throw Error("Password and session/direct PostgreSQL port 5432 required");
  return { u, local };
}

export function trustedCA(path) {
  if (!path) return undefined;
  try {
    const pem = readFileSync(path, "utf8");
    const cert = new X509Certificate(pem);
    if (!cert.ca || Date.parse(cert.validTo) <= Date.now()) throw Error();
    return pem;
  } catch { throw Error("Trusted PostgreSQL CA missing, invalid or expired"); }
}

export function clientOptions(connection) {
  const { u, local } = target(connection);
  if (!local && process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0")
    throw Error("TLS verification must remain enabled");
  if (!local && u.searchParams.get("sslmode") === "disable")
    throw Error("TLS required for Shared-Apps");
  for (const k of ["sslmode", "sslcert", "sslkey", "sslrootcert"])
    u.searchParams.delete(k);
  return {
    connectionString: u.href,
    ssl: local
      ? false
      : {
          rejectUnauthorized: true,
          ...(process.env.PGSSLROOTCERT
            ? { ca: trustedCA(process.env.PGSSLROOTCERT) }
            : {}),
        },
  };
}

// libpq and pg use exactly the same parsed credentials and trust file.
export function dumpEnvironment(connection, environment = process.env) {
  const { u, local } = target(connection);
  clientOptions(connection); // validate TLS switches and CA before spawning libpq
  const env = { ...environment };
  // Never inherit libpq connection overrides, client identities or service files.
  for (const key of Object.keys(env)) if (key.startsWith("PG") && key !== "PG_CONTAINER") delete env[key];
  return { ...env, PGHOST: u.hostname, PGPORT: u.port || "5432",
    PGDATABASE: decodeURIComponent(u.pathname.slice(1)), PGUSER: decodeURIComponent(u.username),
    PGPASSWORD: decodeURIComponent(u.password), PGSSLMODE: local ? "disable" : "verify-full",
    ...(process.env.PGSSLROOTCERT ? { PGSSLROOTCERT: process.env.PGSSLROOTCERT } : {}) };
}
