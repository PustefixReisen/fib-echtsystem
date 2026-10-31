import { readFileSync } from "node:fs";
// These legacy VM harnesses still execute actual shared support, not a fake ownership service.
export const edgeDatasetSupport =
  ["development-datasets.ts", "source-readiness.ts"]
    .map((p) =>
      readFileSync("supabase/functions/_shared/" + p, "utf8")
        .replace(/^import[^\n]*$/gm, "")
        .replace(/\bexport /g, ""),
    )
    .join("\n") + "\n";
