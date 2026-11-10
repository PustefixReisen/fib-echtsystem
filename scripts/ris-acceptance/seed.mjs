// Prepare only the private acceptance database, through the same authenticated handlers.
import pg from "pg";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const root = process.env.RUNNER_TEMP;
const f = JSON.parse(readFileSync(join(root, "ris-e2e.json"), "utf8"));
const u = new URL(f.runtime);
if (
  u.hostname !== "127.0.0.1" ||
  u.port !== "54323" ||
  u.pathname !== "/fib_u4_test" ||
  u.username !== "fib_app"
)
  throw Error("Nur isolierter Runtime-Login zulässig.");
const db = new pg.Client({ connectionString: f.runtime });
await db.connect();
const first = async (q, p = []) => (await db.query(q, p)).rows[0];
async function api(body, name = "fib-editorial-write") {
  const r = await fetch("http://127.0.0.1:54321/functions/v1/" + name, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      apikey: f.anon,
      authorization: "Bearer " + f.users.admin.token,
    },
    body: JSON.stringify(body),
  });
  if (!r.ok)
    throw Error(
      "Abnahmevorbereitung: " + (body.action ?? name) + " HTTP " + r.status,
    );
  return r.json();
}
try {
  for (let i = 0; i < 12; i++) {
    await api({ commit: true }, "fib-u4-ris-pilot");
    if (
      (await first("select count(*) n from fib.ris_document_versions")).n ===
      "6"
    )
      break;
  }
  if ((await first("select count(*) n from fib.ris_sessions")).n !== "2")
    throw Error("Sitzungsbestand unvollständig.");
  await api({ commit: true }, "fib-u4-pilot");
  const result = await first(`select count(*) n from fib.ris_top_vote_results v
    join fib.ris_agenda_items a on a.id=v.agenda_id
    join fib.ris_sessions s on s.id=a.session_id
    where s.source_url like '%=1031'`);
  if (process.env.VITE_FIB_ACCEPTANCE_MODE !== "originals" && result.n !== "4")
    throw Error("Die vier erwarteten Abstimmungsergebnisse fehlen im lokalen Prüfbestand.");
  if ((await first("select count(*) n from fib.messages")).n !== "0")
    throw Error("Unerwartete Meldung.");
  writeFileSync(
    join(root, "Pruefbestand.txt"),
    "Lokaler Startbestand: 1032 TOP 2/3 ungeprüft, keine tatsächlichen Beschlüsse.\n1031 TOP 2/3/6: Abstimmungsdaten aus der im lokalen Prüfbestand verfügbaren Niederschrift.\nParkraumkonzept: Quellenbeobachtung zur eigenen Übernahme.\nDie Vorbereitungsentscheidungen sind keine persönliche Nutzerabnahme. Deine Bearbeitungen bleiben bei Wiederaufnahme erhalten.\n",
    { mode: 0o600 },
  );
  console.log(
    "Drei lokale Referenzfälle vorbereitet; keine Meldung oder Veröffentlichung angelegt.",
  );
} finally {
  await db.end();
}
