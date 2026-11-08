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
    .replace(
      /&#(\d+);/g,
      (_, v) => Number(v) <= 0x10ffff ? String.fromCodePoint(Number(v)) : "�",
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
  const bytes = typeof data === "string"
    ? new TextEncoder().encode(data)
    : data;
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
  title?: string;
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
    observedTreatment?: string | null;
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
  if (!canonical || !new URL(canonical).searchParams.has("__ksinr")) {
    throw Error("invalid_ris_session");
  }
  if (!Number.isFinite(Date.parse(observedAt))) {
    throw Error("invalid_observed_at");
  }
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
  const validDate = iso &&
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
            title: x.label,
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
    // The title anchor excludes the separate published treatment/status block.
    const titleLink = [...row.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
      .find((m) => risUrl(m[1], canonical) === top[0]);
    const observedTreatment = risText(row.match(/<p\b[^>]*class=["'][^"']*\bbeschluss\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i)?.[1] ??
      row.match(/<p\b[^>]*class=["'][^"']*_beschluss[^"']*["'][^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? "").replace(/^Beschluss:\s*/i, "") || null;
    const title = risText(titleLink?.[2] ??
      row.match(/class="[^"]*\btolink\b[^"]*"[^>]*>([\s\S]*?)<\/td>/i)?.[1] ??
        plain,
    );
    agenda.push({
      key,
      number,
      title,
      observedTreatment,
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
  if (!field("siname") || !agenda.length) {
    throw Error("incomplete_ris_structure");
  }
  const counts = new Map<string, number>();
  for (const a of agenda) counts.set(a.key, (counts.get(a.key) ?? 0) + 1);
  for (const a of agenda) {
    if (counts.get(a.key) !== 1) throw Error("duplicate_ris_top_identity");
  }
  const docs = links(html, canonical).filter(
    (x) => new URL(x.url).pathname === "/getfile.asp" && !usedDocs.has(x.url),
  );
  const documents: RisDocumentHint[] = [
    ...new Map(
      docs.map((x) => [
        x.url,
        {
          url: x.url,
          title: x.label,
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
    sessions.length ? sessions : await tx.unsafe(
      "select * from fib.ris_sessions where source_url=$1 for update",
      [snapshot.url],
    )
  )[0];
  if (
    s.last_observed_at &&
    Date.parse(s.last_observed_at) > Date.parse(snapshot.observedAt)
  ) {
    throw Error("stale_ris_snapshot");
  }
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
      "insert into fib.ris_documents(source_url,original_title) values($1,$2) on conflict(source_url) do nothing",
      [hint.url, hint.title ?? null],
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
    if (!existing.length) {
      await tx.unsafe(
        "insert into fib.ris_document_links(session_id,agenda_id,document_id,kind,snapshot_id) values($1,$2,$3,$4,$5)",
        [s.id, agendaId, doc.id, hint.kind, v.id],
      );
    }
    await ensureRisFinding(tx, doc.id);
  }
  for (const a of snapshot.agenda) {
    const top = (
      await tx.unsafe(
        `insert into fib.ris_agenda_items(session_id,source_key,number,title,latest_snapshot_id) values($1,$2,$3,$4,$5) on conflict(session_id,source_key) do update set number=excluded.number,title=excluded.title,latest_snapshot_id=excluded.latest_snapshot_id returning id`,
        [s.id, a.key, a.number, a.title, v.id],
      )
    )[0];
    if (a.proposals.length === 1) {
      await tx.unsafe(
        "insert into fib.ris_proposals(agenda_id,source_url,reference) values($1,$2,$3) on conflict do nothing",
        [top.id, a.proposals[0], a.proposalReferences[a.proposals[0]] ?? null],
      );
    }
    for (const d of a.documents) await document(d, top.id);
  }
  for (const d of snapshot.documents) await document(d, null);
  return { sessionId: s.id, revision, changed: true };
}
/** Import metadata never implies authorship or an editorial event/decision. */
export async function ensureRisFinding(
  tx: RisSql,
  documentId: string,
  versionId?: string,
) {
  const [doc] = await tx.unsafe(
    "select * from fib.ris_documents where id=$1 for update",
    [documentId],
  );
  const contexts = await tx.unsafe(
    `select l.kind,a.title agenda_title,s.session_date::text session_date,p.reference
    from fib.ris_document_links l join fib.ris_sessions s on s.id=l.session_id
    left join fib.ris_agenda_items a on a.id=l.agenda_id
    left join fib.ris_proposals p on p.agenda_id=a.id
    where l.document_id=$1 order by s.session_date desc nulls last,l.id limit 1`,
    [documentId],
  );
  const c = contexts[0] ?? {};
  const kind = ({
    proposal: "Beschlussvorlage",
    minutes: "Niederschrift",
    attachment: "Anlage",
    decision: "Beschluss",
  } as Record<string, string>)[c.kind] ?? "Sitzungsunterlage";
  const iso = c.session_date ? String(c.session_date).slice(0, 10) : null;
  const day = iso && /^\d{4}-\d{2}-\d{2}$/.test(iso)
    ? iso.split("-").reverse().join(".")
    : null;
  const title = [kind, day, c.reference, c.agenda_title || doc.original_title]
    .filter(Boolean).join(" · ");
  let findingId = doc.finding_id;
  if (!findingId) {
    const sources = await tx.unsafe(
      "select id from fib.sources where rtrim(homepage_url,'/')=$1",
      [RIS_ORIGIN],
    );
    if (sources.length !== 1) throw Error("ambiguous_ris_source");
    await tx.unsafe("select pg_advisory_xact_lock(hashtextextended($1,0))", [
      sources[0].id + "|" + doc.source_url,
    ]);
    const aliases = await tx.unsafe(
      "select id,original_url from fib.findings where source_id=$1 and original_url like $2 and original_url ~ $3",
      [
        sources[0].id,
        RIS_ORIGIN + "/getfile.asp?%",
        "[?&]id=" + new URL(doc.source_url).searchParams.get("id") + "(&|$)",
      ],
    );
    const matches = aliases.filter((r) =>
      risUrl(r.original_url) === doc.source_url
    );
    if (matches.length > 1) throw Error("ambiguous_existing_findings");
    findingId = matches[0]?.id ??
      (await tx.unsafe(
        "insert into fib.findings(source_id,title,original_url,published_at) values($1,$2,$3,$4) returning id",
        [sources[0].id, title, doc.source_url, iso],
      ))[0].id;
    await tx.unsafe("update fib.ris_documents set finding_id=$2 where id=$1", [
      doc.id,
      findingId,
    ]);
  }
  if (versionId) {
    const [v] = await tx.unsafe(
      "select * from fib.ris_document_versions where id=$1 and document_id=$2",
      [versionId, doc.id],
    );
    await tx.unsafe(
      `insert into fib.finding_versions(finding_id,revision,fingerprint,original_url,observed_at,metadata)
      select $1,(select coalesce(max(revision),0)+1 from fib.finding_versions where finding_id=$1),$2,$3,$4,$5::text::jsonb
      where not exists(select 1 from fib.finding_versions where finding_id=$1 and metadata->>'risDocumentVersionId'=$6)`,
      [
        findingId,
        v.content_hash,
        doc.source_url,
        v.observed_at,
        JSON.stringify({
          risDocumentVersionId: v.id,
          originVerified: true,
          originalTitle: doc.original_title,
          agendaTitle: c.agenda_title,
          displayTitle: title,
          sessionDate: iso,
        }),
        v.id,
      ],
    );
  }
  // Late metadata must reach existing explicit TOP choices as well. Never create
  // a TOP-event relationship here, nor overwrite an editorial justification.
  await tx.unsafe(`insert into fib.event_findings(event_id,finding_id,evidence_role,justification)
    select distinct ae.event_id,$1::uuid,'source',
      'Automatisch zugeordnet aufgrund der dokumentierten Zugehörigkeit zu TOP ' || coalesce(a.number,'?') || ' der Sitzung vom ' || coalesce(s.session_date::text,'unbekannten Datum') || '.'
    from fib.ris_document_links l join fib.ris_agenda_events ae on ae.agenda_id=l.agenda_id
    join fib.ris_agenda_items a on a.id=l.agenda_id join fib.ris_sessions s on s.id=a.session_id
    where l.document_id=$2 and l.kind in ('proposal','attachment','decision') and ae.role='main_event'
    on conflict do nothing`, [findingId,doc.id]);
  return findingId;
}
export async function persistRisDocument(
  tx: RisSql,
  url: string,
  hash: string,
  text: string | null,
  method: string,
  observedAt: string,
  original?: {
    bytes: Uint8Array;
    store: { put(key: string, bytes: Uint8Array): Promise<void> };
  },
) {
  const canonical = risUrl(url);
  if (
    !canonical || new URL(canonical).pathname !== "/getfile.asp" ||
    !/^[a-f0-9]{64}$/.test(hash)
  ) throw Error("invalid_ris_document");
  const doc = (await tx.unsafe(
    "select id,last_observed_at from fib.ris_documents where source_url=$1 for update",
    [canonical],
  ))[0];
  if (
    doc?.last_observed_at &&
    Date.parse(doc.last_observed_at) > Date.parse(observedAt)
  ) throw Error("stale_ris_document");
  if (!doc) return;
  let version = (await tx.unsafe(
    "select * from fib.ris_document_versions where document_id=$1 and content_hash=$2 for update",
    [doc.id, hash],
  ))[0];
  if (!version) {
    version = (await tx.unsafe(
      "insert into fib.ris_document_versions(document_id,content_hash,extraction_method,observed_at) values($1,$2,$3,$4) returning *",
      [doc.id, hash, method, observedAt],
    ))[0];
  }
  // Rights belong to the exact byte hash. A replacement PDF starts unconfirmed.
  if (
    ["municipality", "licensed"].includes(version.content_author) &&
    version.rights_evidence && !version.pdf_storage_key && original
  ) {
    const bytes = original.bytes;
    if (
      bytes.length < 5 || bytes.length > 25000000 ||
      new TextDecoder().decode(bytes.subarray(0, 5)) !== "%PDF-" ||
      await risHash(bytes) !== hash
    ) throw Error("ris_pdf_integrity_failed");
    const key = `${doc.id}/${version.id}/${hash}.pdf`;
    await original.store.put(key, bytes);
    await tx.unsafe(
      "update fib.ris_document_versions set pdf_storage_key=$2,pdf_size=$3,extracted_text=$4,extraction_method=$5 where id=$1",
      [version.id, key, bytes.length, text, method],
    );
  }
  await tx.unsafe(
    "update fib.ris_documents set latest_version_id=$2,last_observed_at=$3 where id=$1",
    [doc.id, version.id, observedAt],
  );
  await ensureRisFinding(tx, doc.id, version.id);
  return version.id;
}
