import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync('apps/editorial-web/src/App.tsx', 'utf8');
const adminFn = readFileSync('supabase/functions/fib-admin-users/index.ts', 'utf8');
const sessionFn = readFileSync('supabase/functions/fib-session-context/index.ts', 'utf8');

test('admin invitation UI is restricted to active FIB admins', () => {
  assert.match(app, /const isAdmin = sessionContext\?\.role === 'admin'/);
  assert.match(app, /view === 'users' && isAdmin/);
  assert.match(adminFn, /actor\.role !== 'admin'/);
  assert.match(adminFn, /claims\?\.aal === 'aal2'/);
});

test('role is administratively fixed and not derived from auth metadata', () => {
  assert.match(adminFn, /body\.role === 'admin' \|\| body\.role === 'editor'/);
  assert.match(adminFn, /insert into fib\.app_users\(user_id, full_name, role, active, setup_status\)/);
  assert.doesNotMatch(sessionFn, /user_metadata.*role|app_metadata.*role/);
});

test('shared account safety keeps existing auth credentials untouched', () => {
  assert.match(adminFn, /mode: 'existing_account'/);
  assert.doesNotMatch(adminFn, /updateUserById|password.*existingAuth|DELETE.*existingAuth/);
  assert.match(app, /Passwort und MFA unverändert/);
});

test('membership only activates after AAL2 and prior invitation', () => {
  assert.match(sessionFn, /claims\?\.aal === 'aal2'/);
  assert.match(sessionFn, /row\.setup_status === 'invited'/);
  assert.match(sessionFn, /set setup_status='active'/);
});

test('revocation does not delete the shared auth account', () => {
  assert.match(adminFn, /setup_status='deactivated'/);
  assert.match(app, /gemeinsame Auth-Konto wird nicht gelöscht/);
});


test('FIB frontend exposes no public self-registration path', () => {
  assert.doesNotMatch(app, /\.auth\.signUp\s*\(/);
  assert.match(app, /signInWithPassword/);
});
