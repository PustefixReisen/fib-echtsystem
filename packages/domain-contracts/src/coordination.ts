export type FibCoordinatedObjectType =
  | 'finding'
  | 'event'
  | 'message'
  | 'process'
  | 'topic';

export interface FibObjectRef {
  objectType: FibCoordinatedObjectType;
  objectId: string;
}

export interface FibLeadResponsibility {
  object: FibObjectRef;
  userId: string;
  assignedAt: string;
}

export interface FibEditLock {
  object: FibObjectRef;
  userId: string;
  acquiredAt: string;
  renewedAt: string;
  expiresAt: string;
}

export type FibHandoverStatus = 'open' | 'accepted' | 'declined' | 'done' | 'void';

export interface FibHandoverRequest {
  id: string;
  object: FibObjectRef;
  requestedByUserId: string;
  requestedUserId: string;
  message: string | null;
  status: FibHandoverStatus;
  createdAt: string;
  respondedAt: string | null;
}

export interface FibAppUserProfile {
  userId: string;
  fullName: string;
  callName: string | null;
  role: 'editor' | 'admin';
  active: boolean;
  setupStatus: 'invited' | 'setup_pending' | 'active' | 'deactivated';
  createdAt: string;
  updatedAt: string;
}
