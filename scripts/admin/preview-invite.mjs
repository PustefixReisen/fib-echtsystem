// Administrative operator only. Never import into the application/browser build.
import { randomUUID } from 'node:crypto';
import { readFileSync, appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const PROJECT = 'apaubomxffcwtzjimori';
export const AUTH = `https://${PROJECT}.supabase.co/auth/v1`;
export const REDIRECT = 'https://fib.pustivo.de/redaktion-preview/';

export class OperatorError extends Error {
  constructor(phase, status = null, accountState = 'unchanged') {
    super('Administrative invitation stopped');
    this.phase = phase; this.status = status; this.accountState = accountState;
  }
}

export function validateEmail(value) {
  if (typeof value !== 'string' || value.length > 254 || value !== value.trim() ||
      !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/.test(value)) {
    throw new OperatorError('invalid-test-address');
  }
  return value.toLowerCase();
}

async function jsonRequest(fetcher, url, options, phase, accountState = 'unchanged') {
  let response;
  try { response = await fetcher(url, { ...options, redirect: 'error', signal: AbortSignal.timeout(15000) }); }
  catch { throw new OperatorError(phase, null, accountState); }
  if (!response.ok) throw new OperatorError(phase, response.status, accountState);
  try { return await response.json(); }
  catch { throw new OperatorError(phase, response.status, accountState); }
}

export async function inviteNewTestAccount({ email, apiKey, caseId, fetcher = fetch }) {
  email = validateEmail(email);
  if (!apiKey || !/^[a-f0-9-]{36}$/.test(caseId ?? '')) throw new OperatorError('invalid-operator-config');
  const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
  // Atomic create is the ownership boundary. Existing confirmed OR unconfirmed
  // accounts must be rejected here; never invite first or resend on conflict.
  const created = await jsonRequest(fetcher, `${AUTH}/admin/users`, {
    method: 'POST', headers,
    body: JSON.stringify({ email, email_confirm: false, app_metadata: { fib_pr74_test_case: caseId } }),
  }, 'create-new-account', 'unknown-after-create-attempt');
  if (!created.id || created.email?.toLowerCase() !== email || created.email_confirmed_at ||
      created.app_metadata?.fib_pr74_test_case !== caseId) {
    throw new OperatorError('validate-created-account', null, 'created-review-required');
  }
  const invited = await jsonRequest(fetcher, `${AUTH}/invite?redirect_to=${encodeURIComponent(REDIRECT)}`, {
    method: 'POST', headers, body: JSON.stringify({ email }),
  }, 'send-invitation', 'created-review-required');
  if (invited.id !== created.id || invited.email?.toLowerCase() !== email || !invited.invited_at) {
    throw new OperatorError('validate-invitation', null, 'created-review-required');
  }
  return { result: 'invitation-sent', caseId, accountState: 'new-test-account', redirect: REDIRECT };
}

export async function obtainAdminKey(managementToken, fetcher = fetch) {
  if (!managementToken) throw new OperatorError('missing-management-access');
  const keys = await jsonRequest(fetcher, `https://api.supabase.com/v1/projects/${PROJECT}/api-keys?reveal=true`, {
    headers: { Authorization: `Bearer ${managementToken}` },
  }, 'read-existing-admin-key');
  if (!Array.isArray(keys)) throw new OperatorError('invalid-key-response');
  // Reuse an existing key only. Do not generate, rotate, or persist credentials.
  const key = keys.find(k => k.type === 'secret' && k.api_key?.startsWith('sb_secret_'))?.api_key ??
    keys.find(k => k.name === 'service_role')?.api_key;
  if (typeof key !== 'string' || !key || /[\r\n]/.test(key)) throw new OperatorError('no-existing-admin-key');
  return key;
}

export async function checkAdminAccess(apiKey, fetcher = fetch) {
  // Minimal read to prove Auth admin access; never return or log user information.
  const data = await jsonRequest(fetcher, `${AUTH}/admin/users?page=1&per_page=1`, {
    headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
  }, 'check-auth-admin-access');
  if (!Array.isArray(data.users)) throw new OperatorError('invalid-admin-response');
  return { result: 'admin-access-ready', project: PROJECT, redirect: REDIRECT, accountState: 'unchanged' };
}

async function main() {
  let caseId;
  try {
    if (process.argv.length !== 2) throw new OperatorError('arguments-not-supported');
    const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
    const input = event.inputs ?? {};
    if (process.env.GITHUB_EVENT_NAME !== 'workflow_dispatch' ||
        process.env.GITHUB_REPOSITORY !== 'PustefixReisen/fib-echtsystem' ||
        !/^[a-f0-9]{40}$/.test(input.expected_sha ?? '') || input.expected_sha !== process.env.GITHUB_SHA) {
      throw new OperatorError('unreviewed-workflow-ref');
    }
    const sending = input.operation === 'invite-preview-test';
    if (sending ? input.confirmation !== 'INVITE_PREVIEW_TEST' :
        input.operation !== 'check-invite-access' || input.confirmation !== 'CHECK_ACCESS') {
      throw new OperatorError('invalid-operation-confirmation');
    }
    const email = sending ? validateEmail(input.test_email) : null;
    const apiKey = await obtainAdminKey(process.env.SUPABASE_ACCESS_TOKEN);
    const ready = await checkAdminAccess(apiKey);
    caseId = sending ? randomUUID() : undefined;
    const result = sending ? await inviteNewTestAccount({ email, apiKey, caseId }) : ready;
    console.log(JSON.stringify(result));
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY,
      '## Preview invitation operator\n\n```json\n' + JSON.stringify(result, null, 2) + '\n```\n');
  } catch (error) {
    // Never output raw exception messages, request/response bodies, tokens or email.
    const result = { result: 'stopped', phase: error instanceof OperatorError ? error.phase : 'operator-error',
      httpStatus: error instanceof OperatorError ? error.status : null,
      accountState: error instanceof OperatorError ? error.accountState : 'unknown', caseId };
    console.log(JSON.stringify(result)); process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
