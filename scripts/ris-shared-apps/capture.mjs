import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { extractText } from "unpdf";
import { options, privateOutput } from "./io.mjs";
if (typeof options.out !== "string")
  throw Error("--out=/private/path/bundle.json required");
const root = mkdtempSync(join(tmpdir(), "fib-ris-private-capture-"));
const sha = (b) => createHash("sha256").update(b).digest("hex");
try {
  const r = spawnSync(
    process.execPath,
    ["scripts/ris-acceptance/originals.mjs"],
    { env: { ...process.env, RUNNER_TEMP: root }, stdio: "inherit" },
  );
  if (r.status !== 0) throw Error("Original capture failed; no fallback");
  const docs = [];
  for (const id of ["75714", "75790", "75785", "74647", "75243", "75379"]) {
    const bytes = readFileSync(join(root, id + ".pdf")),
      result = await extractText(new Uint8Array(bytes), { mergePages: true });
    if (!result.text.trim()) throw Error("Original PDF without usable text");
    docs.push({
      url:
        "https://buergerinfo-feldkirchen.digitalfabrix.de/getfile.asp?id=" + id,
      hash: sha(bytes),
      text: result.text,
      method: "unpdf-2.1.0",
      originalBytes: true,
    });
  }
  const sessions = [
    ["1032", "ris-1032-top-2-3.html"],
    ["1031", "ris-1031-top-2-3-6.html"],
  ].map(([id, file]) => ({
    url:
      "https://buergerinfo-feldkirchen.digitalfabrix.de/si0057.asp?__ksinr=" +
      id,
    html: readFileSync("tests/u4/fixtures/" + file, "utf8"),
    scope: "documented_reference_excerpt",
    fixture: file,
  }));
  const bundle = {
    kind: "fib-shared-ris-bundle-v1",
    batch: "ris-abnahme-20261031",
    capturedAt: new Date().toISOString(),
    sessions,
    documents: docs,
    newsUrl:
      "https://www.feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen/parkraumkonzept-der-gemeinde-feldkirchen",
  };
  privateOutput(options.out, JSON.stringify(bundle, null, 2) + "\n");
  console.log(
    "Private reference bundle captured. No database, account or deployment changed.",
  );
} finally {
  rmSync(root, { recursive: true, force: true });
}
