// Read-only post-deployment probe; requires the existing human admin's private AAL2 token.
import { options, privateOutput } from "./io.mjs";
const token = process.env.FIB_ACCEPTANCE_USER_TOKEN,
  key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!token || !key || typeof options.out !== "string")
  throw Error(
    "Private existing admin token, existing publishable key and --out required; never paste tokens into Git/Chat",
  );
if (!["staged", "enabled"].includes(options.expect))
  throw Error("--expect must be staged or enabled");
const base = "https://apaubomxffcwtzjimori.supabase.co/functions/v1/";
const call = async (name, body) => {
  const r = await fetch(base + name, {
    method: "POST",
    headers: {
      authorization: "Bearer " + token,
      apikey: key,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60000),
  });
  if (!r.ok)
    throw Error(
      name + " HTTP " + r.status + "; stop rollout and check private logs",
    );
  return r.json();
};
const readiness = await call("fib-editorial-write", {
  action: "source_readiness",
});
const staged = options.expect === "staged";
if (
  readiness.contract !== "fib-ris-shared-20261031-v1" ||
  readiness.checks?.length !== 19 ||
  readiness.runtimeRole !== "fib_app" ||
  !readiness.checks?.every((c) => c.installed && c.can_read && c.can_insert) ||
  (!staged && !readiness.ready) ||
  (staged && readiness.enabled)
)
  throw Error("Runtime/schema/feature readiness mismatch; no data import");
let dryRun = null;
if (!staged) {
  const r = await call("fib-u4-ris-pilot", { commit: false });
  if (r.mode !== "dry_run") throw Error("Expected read-only RIS dry run");
  dryRun = { mode: r.mode, status: "passed" };
}
privateOutput(
  options.out,
  JSON.stringify({ readiness, dryRun, mutations: false }, null, 2) + "\n",
);
console.log(
  "Read-only Shared-Apps probe passed; no account, data or configuration changed.",
);
