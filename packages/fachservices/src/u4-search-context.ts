/**
 * U4 dynamic search context, issue #394.
 * This module generates search directions; it does not retrieve pages or decide relevance.
 * Source monitoring MUST NOT use this plan as a pre-filter.
 */
export type ReferenceLink = {
  id: string;
  revision: number;
  subject_kind: string;
  subject_label: string;
  relation_kind: string;
  object_kind: string;
  object_label: string;
  evidence_url: string;
  rationale: string;
};

export type ActiveReferenceSnapshot = {
  activeRevision: number;
  references: ReferenceLink[];
};

export type SearchDirection = {
  query: string;
  reason: string;
  referenceIds: string[];
};

export type U4SearchPlan = {
  contextRevision: number;
  coreQueries: SearchDirection[];
  extendedQueries: SearchDirection[];
  unknownReferences: number;
};

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const permittedRelations = new Set([
  'located_in', 'crosses', 'connects', 'serves', 'functional_link', 'thematic_link',
]);

/** Deterministic, bounded query candidates derived only from confirmed context. */
export function buildU4SearchPlan(
  snapshot: ActiveReferenceSnapshot,
  locationName: string,
  maxExtendedQueries = 24,
): U4SearchPlan {
  if (!Number.isSafeInteger(snapshot.activeRevision) || snapshot.activeRevision < 0)
    throw Error('invalid_active_context_revision');
  if (!Number.isSafeInteger(maxExtendedQueries) || maxExtendedQueries < 0 || maxExtendedQueries > 100)
    throw Error('invalid_search_budget');
  const place = locationName.trim().replace(/\s+/g, ' ');
  if (!place || place.length > 180) throw Error('invalid_location');
  const coreQueries: SearchDirection[] = [
    { query: place, reason: 'Unmittelbarer Ortsbezug; niemals durch Referenzen ersetzen', referenceIds: [] },
  ];
  const extendedQueries: SearchDirection[] = [];
  const seen = new Set<string>([place.toLocaleLowerCase('de-DE')]);
  let unknownReferences = 0;

  // Prefer stable ID ordering rather than depending on database retrieval order.
  const sorted = [...snapshot.references].sort((a,b)=>a.id.localeCompare(b.id));
  for (const link of sorted) {
    if (!uuid.test(link.id) || !Number.isSafeInteger(link.revision) || link.revision < 1 ||
        !permittedRelations.has(link.relation_kind) ||
        typeof link.subject_label !== 'string' || typeof link.object_label !== 'string') {
      unknownReferences += 1;
      continue;
    }
    const subject = link.subject_label.trim().replace(/\s+/g, ' ');
    const object = link.object_label.trim().replace(/\s+/g, ' ');
    if (!subject || !object || subject.length > 180 || object.length > 180) {
      unknownReferences += 1;
      continue;
    }
    const placeKey = place.toLocaleLowerCase('de-DE');
    const a = subject.toLocaleLowerCase('de-DE');
    const b = object.toLocaleLowerCase('de-DE');
    // A grounded relationship to the requested locality expands the directions.
    // Other objects may become relevant through later contextual graph traversal,
    // but must not silently be treated as a proven local relationship here.
    if (a !== placeKey && b !== placeKey) continue;
    const candidate = a === placeKey ? object : subject;
    const key = candidate.toLocaleLowerCase('de-DE');
    if (seen.has(key)) continue;
    seen.add(key);
    if (extendedQueries.length >= maxExtendedQueries) break;
    extendedQueries.push({
      query: candidate,
      reason: `Bestätigte Beziehung (${link.relation_kind}) zum Rechercheort ${place}`,
      referenceIds: [link.id],
    });
  }
  return {contextRevision:snapshot.activeRevision,coreQueries,extendedQueries,unknownReferences};
}

/** Validated bridge to the MFA/admin-backed confirmed-only context endpoint. */
export function parseActiveReferenceSnapshot(data: unknown): ActiveReferenceSnapshot {
  if (!data || typeof data !== 'object') throw Error('invalid_reference_response');
  const payload = data as Record<string,unknown>;
  if (payload.ok !== true ||
      !Number.isSafeInteger(payload.activeRevision) || (payload.activeRevision as number) < 0 ||
      !Array.isArray(payload.references)) throw Error('invalid_reference_response');
  const references = payload.references;
  if (references.length > 10000) throw Error('reference_limit_exceeded');
  for (const value of references) {
    if (!value || typeof value !== 'object') throw Error('invalid_reference_item');
    const item = value as Record<string,unknown>;
    if (typeof item.id !== 'string' || typeof item.subject_label !== 'string' ||
        typeof item.object_label !== 'string' || typeof item.relation_kind !== 'string' ||
        typeof item.revision !== 'number') throw Error('invalid_reference_item');
  }
  return {activeRevision:payload.activeRevision as number,references:references as ReferenceLink[]};
}
