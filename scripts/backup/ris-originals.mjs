// Capture only snapshot-referenced, legally authorized FIB original versions.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { options, privatePath } from "../ris-shared-apps/io.mjs";
export async function captureOriginals(
  bundle,
  env = process.env,
  request = fetch,
) {
  const root = privatePath(bundle),
    manifest = JSON.parse(
      readFileSync(join(root, "database/manifest.json"), "utf8"),
    );
  if (
    manifest.schema !== "fib" ||
    !["apaubomxffcwtzjimori", "isolated-test"].includes(manifest.project) ||
    manifest.format !== 2 || !Array.isArray(manifest.risOriginals)
  ) throw Error("Snapshot original inventory required");
  const records = manifest.risOriginals;
  if (
    records.length &&
    (!env.FIB_ACCEPTANCE_USER_TOKEN || !env.VITE_SUPABASE_PUBLISHABLE_KEY)
  ) {
    throw Error(
      "Existing human AAL2 token and publishable key required privately",
    );
  }
  for (const v of records) {
    const key = `${v.document_id}/${v.id}/${v.content_hash}.pdf`;
    if (
      v.storage_key !== key ||
      !/^([a-f0-9-]{36}\/){2}[a-f0-9]{64}\.pdf$/.test(key) ||
      !["municipality", "licensed"].includes(v.content_author)
    ) throw Error("Invalid original reference");
    const path = join(root, "originals", key);
    if (existsSync(path)) throw Error("Do not overwrite an original export");
    const r = await request(
      "https://apaubomxffcwtzjimori.supabase.co/functions/v1/fib-editorial-write",
      {
        method: "POST",
        headers: {
          authorization: "Bearer " + env.FIB_ACCEPTANCE_USER_TOKEN,
          apikey: env.VITE_SUPABASE_PUBLISHABLE_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({ action: "source_pdf", versionId: v.id }),
        redirect: "error",
        signal: AbortSignal.timeout(30000),
      },
    );
    if (
      !r.ok || !r.headers.get("content-type")?.startsWith("application/pdf")
    ) throw Error("Authorized original export failed");
    const bytes = Buffer.from(await r.arrayBuffer());
    if (
      bytes.length !== Number(v.size) ||
      createHash("sha256").update(bytes).digest("hex") !== v.content_hash
    ) throw Error("Original export hash mismatch");
    mkdirSync(join(path, ".."), { recursive: true, mode: 0o700 });
    writeFileSync(path, bytes, { mode: 0o600, flag: "wx" });
  }
  return records.length;
}
if (
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    if (typeof options.bundle !== "string") {
      throw Error("Private --bundle required");
    }
    console.log(
      `Exported ${await captureOriginals(
        options.bundle,
      )} snapshot-referenced original PDFs; no RIS request, public URL or privileged browser key.`,
    );
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}
