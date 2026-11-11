// Read-only capture of the real FIB source flags; never infer project feature secrets.
import pg from "pg";
import { options, target, clientOptions, privateOutput } from "../ris-shared-apps/io.mjs";
import { pathToFileURL } from "node:url";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const KEYS = ["id","active","homepage_url"];
export function sourceState(sources, scopes, createdAt = new Date().toISOString()) {
  if (!Array.isArray(sources) || !Array.isArray(scopes)) throw Error("Invalid FIB source rows");
  if (sources.some(s=>!UUID.test(s.id)||typeof s.active!=="boolean"||typeof s.homepage_url!=="string")) throw Error("Unexpected source schema");
  if (scopes.some(s=>!UUID.test(s.id)||!UUID.test(s.source_id)||typeof s.scope_key!=="string"||typeof s.status!=="string")) throw Error("Unexpected source scope schema");
  const refs=new Set(sources.map(s=>s.id));
  if (refs.size!==sources.length || scopes.some(s=>!refs.has(s.source_id)) || new Set(scopes.map(s=>s.id)).size!==scopes.length) throw Error("Source identity inconsistency");
  return {
    format: "fib-db-source-state-v1",
    capturedAt:createdAt,
    scope:"fib-only-read-only",
    sourceFlags:sources.map(s=>Object.fromEntries(KEYS.map(k=>[k,s[k]]))).sort((a,b)=>a.id.localeCompare(b.id)),
    scopeFlags:scopes.map(s=>({id:s.id,source_id:s.source_id,scope_key:s.scope_key,status:s.status,required:s.required})).sort((a,b)=>a.id.localeCompare(b.id)),
    projectFeatures:{status:"not_captured",reason:"Supabase project-level flags/secrets require independent privileged review"},
    operatorReview:false
  };
}
export async function capture(connection, out) {
  target(connection); // only FIB Shared-Apps or isolated authorized test
  const db=new pg.Client(clientOptions(connection));
  await db.connect();
  try {
    await db.query("begin isolation level repeatable read read only");
    const sources=(await db.query("select id,active,homepage_url from fib.sources order by id")).rows;
    const scopes=(await db.query("select id,source_id,scope_key,status,required from fib.source_scopes order by id")).rows;
    const state=sourceState(sources,scopes);
    await db.query("rollback");
    privateOutput(out,JSON.stringify(state,null,2)+"\n");
    return {sources:sources.length,scopes:scopes.length};
  } catch(e) {
    await db.query("rollback").catch(()=>{});
    throw e;
  } finally {await db.end();}
}
if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  process.umask(0o077);
  try {
    const connection=process.env.FIB_MAINTENANCE_DATABASE_URL ?? process.env.U4_TEST_DATABASE_URL;
    if (typeof options.out!=="string") throw Error("Private --out required");
    const result=await capture(connection,options.out);
    console.log("FIB DB source flags captured read-only. Project feature states remain unverified. "+JSON.stringify(result));
  } catch {
    console.error("FIB source configuration capture failed; no review evidence or release authorization produced.");
    process.exitCode=1;
  }
}
