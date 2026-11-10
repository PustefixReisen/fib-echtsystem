import { risHash, type RisSql, risUrl } from "./ris-structure.ts";

export const RIS_BUCKET = "fib-ris-originals";
export interface RisOriginalStore {
  put(key: string, bytes: Uint8Array): Promise<void>;
  get(key: string): Promise<Uint8Array>;
  remove(key: string): Promise<void>;
}
/** Server-only transport. No signed/public URL and no browser credentials. */
export function originalStore(base: string, secret: string): RisOriginalStore {
  if (!base || !secret) throw Error("ris_storage_not_configured");
  const headers = { apikey: secret, authorization: `Bearer ${secret}` };
  const path = (key: string) => {
    if (!/^[a-f0-9-]{36}\/[a-f0-9-]{36}\/[a-f0-9]{64}\.pdf$/.test(key)) {
      throw Error("invalid_storage_key");
    }
    return `${base}/storage/v1/object/${RIS_BUCKET}/${key}`;
  };
  return {
    async put(key, bytes) {
      const r = await fetch(path(key), {
        method: "POST",
        headers: {
          ...headers,
          "content-type": "application/pdf",
          "x-upsert": "false",
        },
        body: bytes as BodyInit,
        redirect: "error",
        signal: AbortSignal.timeout(20000),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        if (r.status !== 409 && String(body.statusCode) !== "409") {
          throw Error("ris_storage_upload_failed");
        }
        const existing = await fetch(path(key), {
          headers,
          redirect: "error",
          signal: AbortSignal.timeout(20000),
        });
        if (
          !existing.ok ||
          await risHash(new Uint8Array(await existing.arrayBuffer())) !==
            await risHash(bytes)
        ) throw Error("ris_storage_conflict");
      }
    },
    async get(key) {
      const r = await fetch(path(key), {
        headers,
        redirect: "error",
        signal: AbortSignal.timeout(20000),
      });
      if (!r.ok) throw Error("ris_stored_pdf_unavailable");
      return new Uint8Array(await r.arrayBuffer());
    },
    async remove(key) {
      path(key);
      const r = await fetch(`${base}/storage/v1/object/${RIS_BUCKET}`, {
        method: "DELETE",
        headers: { ...headers, "content-type": "application/json" },
        body: JSON.stringify({ prefixes: [key] }),
        redirect: "error",
        signal: AbortSignal.timeout(20000),
      });
      if (!r.ok) throw Error("ris_storage_delete_failed");
    },
  };
}
export async function readOriginal(
  tx: RisSql,
  versionId: string,
  store: RisOriginalStore,
) {
  const [v] = await tx.unsafe(
    "select * from fib.ris_document_versions where id=$1 for share",
    [versionId],
  );
  if (
    !v || !["municipality", "licensed"].includes(v.content_author) ||
    !v.rights_evidence || !v.pdf_storage_key
  ) throw Error("ris_pdf_not_permitted_or_missing");
  const bytes = await store.get(v.pdf_storage_key);
  if (
    bytes.length !== Number(v.pdf_size) ||
    await risHash(bytes) !== v.content_hash
  ) throw Error("ris_pdf_integrity_failed");
  return bytes;
}

/** Original download shared by the scanner and explicit authorized capture. */
export async function fetchRisOriginal(url: string, fetcher = fetch) {
  const canonical = risUrl(url);
  if (!canonical || new URL(canonical).pathname !== "/getfile.asp") {
    throw Error("invalid_pdf_url");
  }
  const r = await fetcher(canonical, {
    redirect: "error",
    signal: AbortSignal.timeout(20000),
    headers: {
      accept: "application/pdf",
      "user-agent": "FIB-U4-RIS-Pilot/0.3",
    },
  });
  if (!r.ok || Number(r.headers.get("content-length") ?? 0) > 25000000) {
    throw Error("ris_pdf_fetch_failed");
  }
  // Enforce the limit even if the server omits Content-Length.
  const reader = r.body?.getReader();
  if (!reader) throw Error("invalid_pdf_response");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 25000000) throw Error("pdf_too_large");
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  if (size < 5 || new TextDecoder().decode(bytes.subarray(0, 5)) !== "%PDF-") {
    throw Error("invalid_pdf_response");
  }
  return { bytes, hash: await risHash(bytes) };
}
