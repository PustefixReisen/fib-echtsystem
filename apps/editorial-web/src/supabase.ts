import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('VITE_SUPABASE_URL und VITE_SUPABASE_PUBLISHABLE_KEY müssen gesetzt sein.');
}

// Capture the flow before Auth consumes the fragment. URL flags select UI only;
// authenticated identity and FIB membership are always checked independently.
const entry = new URL(window.location.href);
const fragment = new URLSearchParams(entry.hash.slice(1));
export const authLinkError = fragment.has('error') || fragment.has('error_code') || entry.searchParams.has('error');
export const invitationMode = fragment.get('type') === 'invite' || entry.searchParams.get('onboarding') === 'invite';
if (invitationMode) {
  entry.searchParams.set('onboarding', 'invite');
  // A new link must not fall back to a previous invitation's session on failure.
  if (entry.hash) sessionStorage.removeItem('fib-invitation-auth');
}
if (authLinkError) {
  entry.hash = '';
  for (const key of ['error', 'error_code', 'error_description']) entry.searchParams.delete(key);
}
window.history.replaceState(window.history.state, '', entry);

// Invites use tab-scoped storage separate from the existing account's session.
// No administrator credential or existing normal session is overwritten.
export const supabase = createClient(supabaseUrl, supabasePublishableKey, invitationMode ? {
  auth: { storageKey: 'fib-invitation-auth', storage: sessionStorage },
} : undefined);

export function invitationPasswordDone(userId: string): boolean {
  return sessionStorage.getItem('fib-invitation-password-user') === userId;
}
export function rememberInvitationPassword(userId: string) {
  // Navigation progress only, never an authorization claim.
  sessionStorage.setItem('fib-invitation-password-user', userId);
}
