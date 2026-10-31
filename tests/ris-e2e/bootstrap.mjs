import pg from "pg";
import { randomBytes, createHash } from "node:crypto";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  appendFileSync,
} from "node:fs";
import { jwt, auth, totp } from "./common.mjs";
if (
  !process.env.TEST_DB_PASSWORD ||
  !process.env.TEST_JWT_SECRET ||
  !process.env.RUNNER_TEMP
)
  throw Error("isolated credentials required");
const db = new pg.Client({
  connectionString:
    "postgres://postgres:" +
    process.env.TEST_DB_PASSWORD +
    "@127.0.0.1:54323/fib_u4_test",
});
await db.connect();
try {
  for (let i = 0; i < 60; i++) {
    try {
      await auth("/health");
      break;
    } catch (e) {
      if (i === 59) throw e;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  for (const role of ["anon", "authenticated", "service_role"])
    await db.query(
      `do $$ begin if not exists(select 1 from pg_roles where rolname='${role}') then create role ${role}; end if; end $$`,
    );
  const files = [
    "schema/core.sql",
    "security/runtime-roles.sql",
    "security/runtime-policies.sql",
    "migrations/20261010194500_fib_last_edit_coordination.sql",
    "migrations/20261014114500_event_finding_change_log.sql",
    "migrations/20261015120000_event_finding_metadata_log.sql",
    "migrations/20261015123000_finding_justification.sql",
    "migrations/20261029200933_fib_u4_source_monitor_persistence.sql",
    "migrations/20261030093000_fib_u4_source_observations.sql",
    "migrations/20261030132000_u4_ris_scan_cursors.sql",
    "migrations/20261030134000_u4_ris_cursor_runtime_rls.sql",
    "migrations/20261030163000_fib_ris_source_run_cadence.sql",
    "migrations/20261031081340_fib_ris_editorial_structure.sql",
  ];
  for (const file of files)
    await db.query(readFileSync("supabase/" + file, "utf8"));
  const password = randomBytes(32).toString("hex");
  await db.query(`alter role fib_app password '${password}'`);
  const users = {};
  for (const role of ["admin", "editor", "outsider"]) {
    const email = "ris-" + role + "@example.test",
      password = randomBytes(24).toString("base64url");
    const user = await auth(
      "/admin/users",
      { email, password, email_confirm: true },
      jwt("service_role"),
    );
    const session = await auth("/token?grant_type=password", {
      email,
      password,
    });
    const factor = await auth(
      "/factors",
      { factor_type: "totp", friendly_name: "Isolated RIS test" },
      session.access_token,
    );
    const challenge = await auth(
      "/factors/" + factor.id + "/challenge",
      {},
      session.access_token,
    );
    const verified = await auth(
      "/factors/" + factor.id + "/verify",
      { challenge_id: challenge.id, code: totp(factor.totp.secret) },
      session.access_token,
    );
    users[role] = {
      email,
      password,
      id: user.id,
      secret: factor.totp.secret,
      token: verified.access_token,
    };
    if (role !== "outsider")
      await db.query(
        "insert into fib.app_users(user_id,full_name,role,setup_status) values($1,$2,$3,'active')",
        [user.id, "Isolierte " + role, role],
      );
  }
  await db.query(
    "insert into fib.events(id,title) values('ff02ffad-e2a5-4724-a94b-073a1483051d','Isolierter Startbestand')",
  );
  await db.query(
    "insert into fib.processes(title) values('Prüfvorgang Kita und Verkehr')",
  );
  await db.query(
    "insert into fib.topics(title) values('Prüfthema kommunale Entwicklung')",
  );
  for (const [name, home, key, entry, method] of [
    [
      "RIS Feldkirchen",
      "https://buergerinfo-feldkirchen.digitalfabrix.de",
      "ris-dokumentliste",
      "https://buergerinfo-feldkirchen.digitalfabrix.de/do0040.asp?smcmode=32832",
      "ris",
    ],
    [
      "Gemeinde Feldkirchen",
      "https://www.feldkirchen.de",
      "gemeinde-nachrichten",
      "https://www.feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen",
      "html",
    ],
  ]) {
    const source = (
      await db.query(
        "insert into fib.sources(name,homepage_url) values($1,$2) returning id",
        [name, home],
      )
    ).rows[0].id;
    await db.query(
      "insert into fib.source_scopes(source_id,scope_key,scope_label,entry_url,access_method) values($1,$2,$3,$4,$5)",
      [source, key, name, entry, method],
    );
  }
  // Real inherited runtime login; never a superuser/SET ROLE stand-in in handlers.
  const runtime =
    "postgres://fib_app:" + password + "@127.0.0.1:54323/fib_u4_test";
  const anon = jwt("anon");
  const fixture = { users, runtime, anon, files };
  writeFileSync(
    process.env.RUNNER_TEMP + "/ris-e2e.json",
    JSON.stringify(fixture),
    { mode: 0o600 },
  );
  writeFileSync(process.env.RUNNER_TEMP + "/ris-scenario.json", "{}", {
    mode: 0o600,
  });
  const results = process.env.FIB_TEST_RESULTS_DIR ?? "ris-e2e-results";
  mkdirSync(results, { recursive: true });
  writeFileSync(
    results + "/migrations.json",
    JSON.stringify(
      {
        database: "fib_u4_test",
        postgres: 16,
        files: files.map((path) => ({
          path: "supabase/" + path,
          sha256: createHash("sha256")
            .update(readFileSync("supabase/" + path))
            .digest("hex"),
        })),
        commit: process.env.GITHUB_SHA ?? null,
        runtimeRole: "fib_app inherits fib_runtime; no superuser/BYPASSRLS",
      },
      null,
      2,
    ),
  );
  for (const value of [
    runtime,
    anon,
    ...Object.values(users).flatMap((u) => [u.password, u.secret, u.token]),
  ])
    if (process.env.GITHUB_ENV) console.log("::add-mask::" + value);
  if (process.env.GITHUB_ENV)
    appendFileSync(
      process.env.GITHUB_ENV,
      `VITE_SUPABASE_URL=http://127.0.0.1:54321\nVITE_SUPABASE_PUBLISHABLE_KEY=${anon}\nFIB_DATABASE_URL=${runtime}\nSUPABASE_URL=http://127.0.0.1:54321\nSUPABASE_ANON_KEY=${anon}\nFIB_RIS_STRUCTURE_ENABLED=true\n`,
    );
  console.log(
    "Isolated schema, actual Auth accounts/TOTP and restricted runtime login prepared",
  );
} finally {
  await db.end();
}
