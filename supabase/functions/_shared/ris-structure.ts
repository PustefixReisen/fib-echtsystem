/** Shared scanner/persistence contract; no runtime environment or network globals. */
export const RIS_ORIGIN = "https://buergerinfo-feldkirchen.digitalfabrix.de";
export interface RisSql {
  unsafe(query: string, values?: any[]): Promise<any[]>;
}
export function risText(s: string): string {
  return s
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&Ouml;/g, "Ö")
    .replace(/&ouml;/g, "ö")
    .replace(/&uuml;/g, "ü")
    .replace(/&auml;/g, "ä")
    .replace(/&#(\d+);/g, (_, v) =>
      Number(v) <= 0x10ffff ? String.fromCodePoint(Number(v)) : "�",
    )
    .replace(/\s+/g, " ")
    .trim();
}
export function risUrl(value: string, base = RIS_ORIGIN): string | null {
  try {
    const u = new URL(value.replace(/&amp;/g, "&"), base);
    if (u.origin !== RIS_ORIGIN || u.username || u.password) return null;
    const field = /^\/si\d+\.asp$/i.test(u.pathname)
      ? "__ksinr"
      : /^\/vo\d+\.asp$/i.test(u.pathname)
        ? "__kvonr"
        : /^\/to\d+\.asp$/i.test(u.pathname)
          ? "__ktonr"
          : u.pathname.toLowerCase() === "/getfile.asp"
            ? "id"
            : null;
    if (!field || !/^\d+$/.test(u.searchParams.get(field) ?? "")) return null;
    return (
      u.origin +
      u.pathname.toLowerCase() +
      "?" +
      field +
      "=" +
      u.searchParams.get(field)
    );
  } catch {
    return null;
  }
}
export async function risHash(data: string | Uint8Array): Promise<string> {
  const bytes =
    typeof data === "string" ? new TextEncoder().encode(data) : data;
  return [
    ...new Uint8Array(
      await crypto.subtle.digest("SHA-256", bytes as BufferSource),
    ),
  ]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
}
function links(html: string, base: string) {
  return [
    ...html.matchAll(
      /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    ),
  ]
    .map((m) => ({ url: risUrl(m[1], base), label: risText(m[2]) }))
    .filter((x) => x.url) as { url: string; label: string }[];
}
export function risSessionLinks(html: string, base: string) {
  return [
    ...new Set(
      links(html, base)
        .map((x) => x.url)
        .filter((x) => new URL(x).searchParams.has("__ksinr")),
    ),
  ];
}
export type RisDocumentHint = {
  url: string;
  kind: "unknown" | "proposal" | "minutes" | "attachment";
};
export type RisSnapshot = {
  url: string;
  hash: string;
  observedAt: string;
  committee: string | null;
  reference: string | null;
  date: string | null;
  agenda: {
    key: string;
    number: string | null;
    title: string;
    proposals: string[];
    documents: RisDocumentHint[];
    issues: string[];
    publishedTopUrls: string[];
    proposalReferences: Record<string, string>;
  }[];
  documents: RisDocumentHint[];
};
export async function parseRisStructure(
  html: string,
  url: string,
  observedAt: string,
): Promise<RisSnapshot> {
  const canonical = risUrl(url);
  if (!canonical || !new URL(canonical).searchParams.has("__ksinr"))
    throw Error("invalid_ris_session");
  if (!Number.isFinite(Date.parse(observedAt)))
    throw Error("invalid_observed_at");
  const field = (name: string) => {
    const a = [
      ...html.matchAll(
        new RegExp(
          '<div[^>]*class="[^"]*\\b' +
            name +
            '\\b[^"]*"[^>]*>([\\s\\S]*?)</div>',
          "g",
        ),
      ),
    ];
    return a.length === 1 ? risText(a[0][1]) || null : null;
  };
  const date = field("sidat")?.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  const iso = date ? `${date[3]}-${date[2]}-${date[1]}` : null;
  const validDate =
    iso &&
    Number.isFinite(Date.parse(iso)) &&
    new Date(iso).toISOString().slice(0, 10) === iso
      ? iso
      : null;
  const agenda: RisSnapshot["agenda"] = [],
    usedDocs = new Set<string>();
  for (const m of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const row = m[1],
      plain = risText(row),
      a = links(row, canonical);
    const first = risText(row.match(/<td\b[^>]*>([\s\S]*?)<\/td>/i)?.[1] ?? "");
    const number =
      /^(?:Ö\s*|TOP\s*)?(\d{1,3}(?:\.\d{1,3})?)\.?$/.exec(first)?.[1] ?? null;
    if (!number && !/\btofnum\b/.test(row)) continue;
    const top = [
      ...new Set(
        a
          .filter((x) => new URL(x.url).searchParams.has("__ktonr"))
          .map((x) => x.url),
      ),
    ];
    const proposals = [
      ...new Set(
        a
          .filter((x) => new URL(x.url).searchParams.has("__kvonr"))
          .map((x) => x.url),
      ),
    ];
    const docs = a.filter((x) => new URL(x.url).pathname === "/getfile.asp");
    const documents: RisDocumentHint[] = [
      ...new Map(
        docs.map((x) => [
          x.url,
          {
            url: x.url,
            kind: /^Vorlage$/i.test(x.label)
              ? ("proposal" as const)
              : /Anlage/i.test(x.label)
                ? ("attachment" as const)
                : ("unknown" as const),
          },
        ]),
      ).values(),
    ];
    documents.forEach((x) => usedDocs.add(x.url));
    const key = number
      ? "number:" + number
      : top.length === 1
        ? top[0]
        : "unresolved:" + (await risHash(row));
    const title = risText(
      row.match(/class="[^"]*\btolink\b[^"]*"[^>]*>([\s\S]*?)<\/td>/i)?.[1] ??
        plain,
    );
    agenda.push({
      key,
      number,
      title,
      proposals,
      documents,
      publishedTopUrls: top,
      proposalReferences: Object.fromEntries(
        a.filter((x) => proposals.includes(x.url)).map((x) => [x.url, x.label]),
      ),
      issues: [
        ...(!number ? ["missing_top_number"] : []),
        ...(proposals.length > 1 ? ["ambiguous_proposals"] : []),
        ...(top.length !== 1 ? ["identity_from_number_or_row"] : []),
      ],
    });
  }
  if (!field("siname") || !agenda.length)
    throw Error("incomplete_ris_structure");
  const counts = new Map<string, number>();
  for (const a of agenda) counts.set(a.key, (counts.get(a.key) ?? 0) + 1);
  for (const a of agenda)
    if (counts.get(a.key) !== 1) throw Error("duplicate_ris_top_identity");
  const docs = links(html, canonical).filter(
    (x) => new URL(x.url).pathname === "/getfile.asp" && !usedDocs.has(x.url),
  );
  const documents: RisDocumentHint[] = [
    ...new Map(
      docs.map((x) => [
        x.url,
        {
          url: x.url,
          kind: /Niederschrift|Protokoll/i.test(x.label)
            ? ("minutes" as const)
            : /Anlage/i.test(x.label)
              ? ("attachment" as const)
              : ("unknown" as const),
        },
      ]),
    ).values(),
  ];
  return {
    url: canonical,
    hash: await risHash(html),
    observedAt,
    committee: field("sigrname"),
    reference: field("siname"),
    date: validDate,
    agenda,
    documents,
  };
}
/** Caller owns one transaction covering scanner checkpoint and all snapshots. */
export async function persistRisStructure(tx: RisSql, snapshot: RisSnapshot) {
  await tx.unsafe("select pg_advisory_xact_lock(hashtextextended($1,0))", [
    "ris-session:" + snapshot.url,
  ]);
  let committeeId = null;
  if (snapshot.committee) {
    const c = await tx.unsafe(
      `insert into fib.ris_committees(source_key,name,source_url,identity_basis) values($1,$2,$3,'observed_label') on conflict(source_key) do update set name=excluded.name returning id`,
      ["label:" + snapshot.committee, snapshot.committee, snapshot.url],
    );
    committeeId = c[0].id;
  }
  const sessions = await tx.unsafe(
    `insert into fib.ris_sessions(source_url,committee_id,reference,session_date,last_observed_at) values($1,$2,$3,$4,$5) on conflict(source_url) do nothing returning id`,
    [
      snapshot.url,
      committeeId,
      snapshot.reference,
      snapshot.date,
      snapshot.observedAt,
    ],
  );
  const s = (
    sessions.length
      ? sessions
      : await tx.unsafe(
          "select * from fib.ris_sessions where source_url=$1 for update",
          [snapshot.url],
        )
  )[0];
  if (
    s.last_observed_at &&
    Date.parse(s.last_observed_at) > Date.parse(snapshot.observedAt)
  )
    throw Error("stale_ris_snapshot");
  const latest = (
    await tx.unsafe(
      "select id,content_hash,revision from fib.ris_session_versions where session_id=$1 order by revision desc limit 1",
      [s.id],
    )
  )[0];
  if (latest?.content_hash === snapshot.hash) {
    await tx.unsafe(
      "update fib.ris_sessions set last_observed_at=$2 where id=$1",
      [s.id, snapshot.observedAt],
    );
    return { sessionId: s.id, revision: latest.revision, changed: false };
  }
  // Bind serialized JSON as text: postgres.js otherwise serializes the string again
  // when PostgreSQL infers a jsonb parameter (node-postgres does not).
  const revision = (latest?.revision ?? 0) + 1;
  const v = (
    await tx.unsafe(
      "insert into fib.ris_session_versions(session_id,revision,content_hash,observed_at,source_url,snapshot) values($1,$2,$3,$4,$5,$6::text::jsonb) returning id",
      [
        s.id,
        revision,
        snapshot.hash,
        snapshot.observedAt,
        snapshot.url,
        JSON.stringify(snapshot),
      ],
    )
  )[0];
  await tx.unsafe(
    "update fib.ris_sessions set committee_id=coalesce($2,committee_id),reference=coalesce($3,reference),session_date=coalesce($4,session_date),current_revision=$5,last_observed_at=$6 where id=$1",
    [
      s.id,
      committeeId,
      snapshot.reference,
      snapshot.date,
      revision,
      snapshot.observedAt,
    ],
  );
  async function document(hint: RisDocumentHint, agendaId: string | null) {
    await tx.unsafe(
      "insert into fib.ris_documents(source_url) values($1) on conflict(source_url) do nothing",
      [hint.url],
    );
    const doc = (
      await tx.unsafe("select id from fib.ris_documents where source_url=$1", [
        hint.url,
      ])
    )[0];
    // Observed hints never overwrite editorially reviewed type/status.
    const existing = await tx.unsafe(
      "select id from fib.ris_document_links where session_id=$1 and agenda_id is not distinct from $2::uuid and document_id=$3",
      [s.id, agendaId, doc.id],
    );
    if (!existing.length)
      await tx.unsafe(
        "insert into fib.ris_document_links(session_id,agenda_id,document_id,kind,snapshot_id) values($1,$2,$3,$4,$5)",
        [s.id, agendaId, doc.id, hint.kind, v.id],
      );
  }
  for (const a of snapshot.agenda) {
    const top = (
      await tx.unsafe(
        `insert into fib.ris_agenda_items(session_id,source_key,number,title,latest_snapshot_id) values($1,$2,$3,$4,$5) on conflict(session_id,source_key) do update set number=excluded.number,title=excluded.title,latest_snapshot_id=excluded.latest_snapshot_id returning id`,
        [s.id, a.key, a.number, a.title, v.id],
      )
    )[0];
    if (a.proposals.length === 1)
      await tx.unsafe(
        "insert into fib.ris_proposals(agenda_id,source_url,reference) values($1,$2,$3) on conflict do nothing",
        [top.id, a.proposals[0], a.proposalReferences[a.proposals[0]] ?? null],
      );
    for (const d of a.documents) await document(d, top.id);
  }
  for (const d of snapshot.documents) await document(d, null);
  return { sessionId: s.id, revision, changed: true };
}
export async function persistRisDocument(
  tx: RisSql,
  url: string,
  hash: string,
  text: string | null,
  method: string,
  observedAt: string,
) {
  const canonical = risUrl(url);
  if (
    !canonical ||
    new URL(canonical).pathname !== "/getfile.asp" ||
    !/^[a-f0-9]{64}$/.test(hash)
  )
    throw Error("invalid_ris_document");
  const doc = (
    await tx.unsafe(
      "select id,last_observed_at from fib.ris_documents where source_url=$1 for update",
      [canonical],
    )
  )[0];
  if (
    doc?.last_observed_at &&
    Date.parse(doc.last_observed_at) > Date.parse(observedAt)
  )
    throw Error("stale_ris_document");
  if (!doc) return; // Release-list PDF without known session/TOP is only a source observation.
  let version = (
    await tx.unsafe(
      "select id from fib.ris_document_versions where document_id=$1 and content_hash=$2",
      [doc.id, hash],
    )
  )[0];
  if (!version)
    version = (
      await tx.unsafe(
        "insert into fib.ris_document_versions(document_id,content_hash,extracted_text,extraction_method,observed_at) values($1,$2,$3,$4,$5) returning id",
        [doc.id, hash, text, method, observedAt],
      )
    )[0];
  await tx.unsafe(
    "update fib.ris_documents set latest_version_id=$2,last_observed_at=$3 where id=$1",
    [doc.id, version.id, observedAt],
  );
  return version.id;
}
