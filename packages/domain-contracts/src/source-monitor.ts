export type SourceAccess = 'rss' | 'html' | 'ris';
export type SourceState = 'candidate' | 'active' | 'paused' | 'ended' | 'rejected';
export type RisKind = 'session' | 'agenda-item' | 'proposal' | 'resolution' | 'minutes' | 'attachment';

export interface SourceScope {
  id: string;
  publisher: string;
  label: string;
  url: string;
  access: SourceAccess;
  required: boolean;
  status: SourceState;
  risKinds?: readonly RisKind[];
}

export interface SourceCheckpoint {
  scopeId: string;
  lastSuccessAt?: string;
  lastAttemptAt?: string;
  gapSince?: string;
  lastError?: string;
}

export interface SourceObservation {
  scopeId: string;
  externalId: string;
  url: string;
  fingerprint: string;
  firstSeenAt: string;
  lastSeenAt: string;
  revision: number;
}

export function reconcileSourceObservation(
  scopeId: string,
  externalId: string,
  url: string,
  fingerprint: string,
  now: string,
  previous?: SourceObservation,
): { status: 'new' | 'changed' | 'unchanged'; observation: SourceObservation; review: boolean } {
  if (!externalId || !url || !fingerprint) throw new Error('Invalid observation');
  if (previous && (previous.scopeId !== scopeId || previous.externalId !== externalId)) {
    throw new Error('Identity mismatch');
  }
  const status = !previous ? 'new' : previous.fingerprint === fingerprint ? 'unchanged' : 'changed';
  return {
    status,
    observation: {
      scopeId, externalId, url, fingerprint,
      firstSeenAt: previous?.firstSeenAt ?? now,
      lastSeenAt: now,
      revision: previous ? previous.revision + (status === 'changed' ? 1 : 0) : 1,
    },
    review: status !== 'unchanged',
  };
}

export function updateSourceCheckpoint(
  previous: SourceCheckpoint,
  now: string,
  success: boolean,
  error?: string,
): SourceCheckpoint {
  return success
    ? { ...previous, lastAttemptAt: now, lastSuccessAt: now, gapSince: undefined, lastError: undefined }
    : { ...previous, lastAttemptAt: now, gapSince: previous.gapSince ?? previous.lastSuccessAt ?? now, lastError: error ?? 'Source unavailable' };
}
