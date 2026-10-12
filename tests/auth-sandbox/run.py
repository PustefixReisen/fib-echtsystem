"""Real GoTrue + captured SMTP tests. Never accepts a remote Auth endpoint.

Only synthetic accounts are created. Secrets/tokens/mail bodies are never reported.
"""
import base64
import hashlib
import hmac
import html
import json
import os
from pathlib import Path
import re
import secrets
import struct
import subprocess
import sys
import time
import uuid
from urllib import request, error, parse

AUTH = 'http://127.0.0.1:9999'
MAIL = 'http://127.0.0.1:54324'
RESULTS = []
OUT = Path(os.environ.get('AUTH_TEST_REPORT_DIR', 'auth-test-results'))
OUT.mkdir(exist_ok=True)

class NoRedirect(request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

opener = request.build_opener(NoRedirect)

def call(path, body=None, token=None, method=None, base=AUTH):
    assert base in (AUTH, MAIL), 'Only isolated loopback endpoints are allowed'
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = 'Bearer ' + token
    req = request.Request(base + path, data=json.dumps(body).encode() if body is not None else None,
                          headers=headers, method=method or ('POST' if body is not None else 'GET'))
    try:
        resp = opener.open(req, timeout=15)
    except error.HTTPError as exc:
        resp = exc
    raw = resp.read().decode()
    try:
        data = json.loads(raw)
    except ValueError:
        data = {}
    return resp.status, data, dict(resp.headers)

def check(name, condition, status=None, code=None):
    RESULTS.append({'test': name, 'result': 'PASS' if condition else 'FAIL',
                    'http_status': status, 'auth_error_code': code})
    print(('PASS ' if condition else 'FAIL ') + name, flush=True)
    return condition

def success(path, body=None, token=None, method=None):
    status, data, _ = call(path, body, token, method)
    if not 200 <= status < 300:
        if status >= 500:
            logs = subprocess.run(['docker', 'compose', '-f', 'tests/auth-sandbox/compose.yml', 'logs', '--no-color', '--tail', '10', 'auth'], capture_output=True, text=True).stdout
            for line in logs.splitlines():
                try:
                    details = json.loads(line.split(' | ', 1)[-1])
                    diagnostic = str(details.get('error', ''))
                    for key in ['TEST_DB_PASSWORD', 'TEST_JWT_SECRET']:
                        diagnostic = diagnostic.replace(os.environ.get(key, 'not-set'), '[REDACTED]')
                    if diagnostic: print('Auth diagnostic: ' + diagnostic[:1000])
                except ValueError:
                    pass
        # Never embed request data, response data or tokens in exceptions.
        raise RuntimeError('Auth operation failed: ' + path.split('?')[0] + ' HTTP ' + str(status))
    return data

def claims(token):
    part = token.split('.')[1]
    return json.loads(base64.urlsafe_b64decode(part + '=' * (-len(part) % 4)))

def mail_link(address, kind, exclude=None):
    for _ in range(40):
        status, listing, _ = call('/api/v1/messages', base=MAIL)
        if status == 200:
            for item in listing.get('messages', []):
                if not any(x.get('Address') == address for x in item.get('To', [])):
                    continue
                _, message, _ = call('/api/v1/message/' + item['ID'], base=MAIL)
                content = html.unescape(message.get('HTML', '') + '\n' + message.get('Text', ''))
                for link in re.findall(r'https?://[^\s<>"\']+', content):
                    p = parse.urlparse(link)
                    query = parse.parse_qs(p.query)
                    if p.hostname == '127.0.0.1' and p.port == 54321 and query.get('type') == [kind] and link != exclude:
                        return link
        time.sleep(.5)
    raise RuntimeError('Expected captured test email not received')

def verify_link(link):
    parsed = parse.urlparse(link)
    assert parsed.hostname == '127.0.0.1' and parsed.port == 54321
    status, data, headers = call('/verify?' + parsed.query)
    location = headers.get('Location', headers.get('location', ''))
    params = parse.parse_qs(parse.urlparse(location).fragment)
    params.update(parse.parse_qs(parse.urlparse(location).query))
    return status, {key: values[0] for key, values in params.items()}, location

def login(address, password):
    return success('/token?grant_type=password', {'email': address, 'password': password})

def local_sql(statement):
    result = subprocess.run(['docker', 'compose', '-f', 'tests/auth-sandbox/compose.yml', 'exec', '-T', 'db',
                             'psql', '-U', 'postgres', '-d', 'auth_test', '-v', 'ON_ERROR_STOP=1', '-c', statement],
                            capture_output=True, text=True)
    if result.returncode:
        raise RuntimeError('Isolated database fixture setup failed')

def new_account(label):
    address = 'fib-' + label + '-' + secrets.token_hex(4) + '@example.test'
    password = secrets.token_urlsafe(24)
    created = success('/signup', {'email': address, 'password': password})
    assert 'access_token' not in created
    link = mail_link(address, 'signup')
    _, session, _ = verify_link(link)
    assert session.get('access_token')
    return address, password, login(address, password)

def totp(secret):
    key = base64.b32decode(secret + '=' * (-len(secret) % 8))
    digest = hmac.new(key, struct.pack('>Q', int(time.time()) // 30), hashlib.sha1).digest()
    offset = digest[-1] & 15
    return str((struct.unpack('>I', digest[offset:offset+4])[0] & 0x7fffffff) % 1000000).zfill(6)

def step_up(session, factor, secret, wait=False):
    if wait:
        time.sleep(31 - (time.time() % 30))
    token = session['access_token']
    challenge = success('/factors/' + factor + '/challenge', {}, token)
    elevated = success('/factors/' + factor + '/verify', {'challenge_id': challenge['id'], 'code': totp(secret)}, token)
    assert claims(elevated['access_token'])['aal'] == 'aal2'
    return elevated

def enroll(session):
    factor = success('/factors', {'factor_type': 'totp', 'friendly_name': 'isolated-test'}, session['access_token'])
    return step_up(session, factor['id'], factor['totp']['secret']), factor['id'], factor['totp']['secret']

def registration():
    address = 'fib-confirm-' + secrets.token_hex(4) + '@example.test'
    password = secrets.token_urlsafe(24)
    data = success('/signup', {'email': address, 'password': password})
    check('Signup does not issue a session before email confirmation', not data.get('access_token'))
    status, data, _ = call('/token?grant_type=password', {'email': address, 'password': password})
    check('Unconfirmed email cannot sign in', status == 400 and data.get('error_code') == 'email_not_confirmed', status, data.get('error_code'))
    link = mail_link(address, 'signup')
    _, params, location = verify_link(link)
    check('Captured confirmation link signs in at allowed callback', bool(params.get('access_token')) and location.startswith('http://127.0.0.1:4173'))
    _, reused, _ = verify_link(link)
    check('Confirmation link cannot be replayed', not reused.get('access_token') and bool(reused.get('error_code')))
    _, invalid, _ = verify_link('http://127.0.0.1:54321/auth/v1/verify?type=signup&token=invalid-test-token')
    check('Invalid confirmation token is rejected', not invalid.get('access_token') and bool(invalid.get('error_code')))

def server_mfa():
    address, password, session = new_account('mfa')
    elevated, factor, secret = enroll(session)
    aal1 = login(address, password)
    assert claims(aal1['access_token'])['aal'] == 'aal1'
    for label, body in [('password', {'password': secrets.token_urlsafe(24)}), ('email', {'email': 'blocked-' + secrets.token_hex(4) + '@example.test'})]:
        status, data, _ = call('/user', body, aal1['access_token'], 'PUT')
        check('Direct AAL1 ' + label + ' change is denied by Auth server', status in (401, 403) and data.get('error_code') == 'insufficient_aal', status, data.get('error_code'))
    challenge = success('/factors/' + factor + '/challenge', {}, aal1['access_token'])
    wrong = str((int(totp(secret)) + 1) % 1000000).zfill(6)
    status, data, _ = call('/factors/' + factor + '/verify', {'challenge_id': challenge['id'], 'code': wrong}, aal1['access_token'])
    check('Wrong MFA code is denied', status >= 400, status, data.get('error_code'))
    check('MFA enrollment produces AAL2', claims(elevated['access_token'])['aal'] == 'aal2')

def email_change():
    address, password, session = new_account('email')
    elevated, _, _ = enroll(session)
    token = elevated['access_token']
    new_address = 'fib-new-' + secrets.token_hex(4) + '@example.test'
    success('/user', {'email': new_address}, token, 'PUT')
    old_link = mail_link(address, 'email_change')
    new_link = mail_link(new_address, 'email_change')
    user = success('/user', token=token)
    check('Email remains old while confirmations are pending', user['email'] == address)
    verify_link(old_link)
    user = success('/user', token=token)
    check('Old-address confirmation alone does not change email', user['email'] == address)
    verify_link(new_link)
    user = success('/user', token=token)
    check('Both captured confirmations activate new address', user['email'] == new_address)
    status, _, _ = call('/token?grant_type=password', {'email': address, 'password': password})
    check('Old email cannot sign in after completed change', status == 400, status)
    updated = login(new_address, password)
    check('New email signs in and still requires MFA', claims(updated['access_token'])['aal'] == 'aal1')
    _, replay, _ = verify_link(new_link)
    check('Email-change link cannot be replayed', not replay.get('access_token') and bool(replay.get('error_code')))

def password_change():
    address, password, session = new_account('password')
    elevated, _, _ = enroll(session)
    token = elevated['access_token']
    other = login(address, password)
    status, data, _ = call('/user', {'password': 'too-short'}, token, 'PUT')
    check('Server rejects password shorter than 12 characters', status == 422, status, data.get('error_code'))
    replacement = secrets.token_urlsafe(24)
    status, _, _ = call('/user', {'password': replacement}, token, 'PUT')
    check('AAL2 password change succeeds', status == 200, status)
    status, _, _ = call('/token?grant_type=password', {'email': address, 'password': password})
    check('Old password no longer signs in', status == 400, status)
    changed = login(address, replacement)
    check('New password signs in at AAL1 until MFA', claims(changed['access_token'])['aal'] == 'aal1')
    status, data, _ = call('/token?grant_type=refresh_token', {'refresh_token': other['refresh_token']})
    check('Other session refresh is revoked after password change', status >= 400, status, data.get('error_code'))

def recovery():
    address, password, session = new_account('recovery')
    _, factor, secret = enroll(session)
    success('/recover', {'email': address})
    link = mail_link(address, 'recovery')
    _, recovered, location = verify_link(link)
    check('Recovery email returns to allowed callback', bool(recovered.get('access_token')) and location.startswith('http://127.0.0.1:4173'))
    assert recovered.get('access_token')
    check('Recovery does not bypass MFA', claims(recovered['access_token'])['aal'] == 'aal1')
    new_password = secrets.token_urlsafe(24)
    status, data, _ = call('/user', {'password': new_password}, recovered['access_token'], 'PUT')
    check('Recovered AAL1 session cannot reset password before MFA', status in (401, 403) and data.get('error_code') == 'insufficient_aal', status, data.get('error_code'))
    elevated = step_up(recovered, factor, secret, wait=True)
    status, _, _ = call('/user', {'password': new_password}, elevated['access_token'], 'PUT')
    check('Recovery plus MFA permits password reset', status == 200, status)
    status, _, _ = call('/token?grant_type=password', {'email': address, 'password': password})
    check('Password from before recovery no longer works', status == 400, status)
    reset = login(address, new_password)
    check('Recovered account still requires MFA on next login', claims(reset['access_token'])['aal'] == 'aal1')
    _, replay, _ = verify_link(link)
    check('Recovery link cannot be replayed', not replay.get('access_token') and bool(replay.get('error_code')))

def stale_session():
    address, password, session = new_account('reauth')
    elevated, _, _ = enroll(session)
    token = elevated['access_token']
    session_id = str(uuid.UUID(claims(token)['session_id']))
    local_sql("update auth.sessions set created_at = now() - interval '25 hours' where id = '" + session_id + "'")
    status, data, _ = call('/user', {'password': secrets.token_urlsafe(24)}, token, 'PUT')
    check('AAL2 session older than 24 hours requires reauthentication', status == 400 and data.get('error_code') == 'reauthentication_needed', status, data.get('error_code'))

def expired_confirmation():
    address = 'fib-expired-' + secrets.token_hex(4) + '@example.test'
    data = success('/signup', {'email': address, 'password': secrets.token_urlsafe(24)})
    link = mail_link(address, 'signup')
    user_id = str(uuid.UUID(data['id']))
    local_sql("update auth.users set confirmation_sent_at = now() - interval '2 hours' where id = '" + user_id + "'")
    _, params, _ = verify_link(link)
    check('Expired email confirmation cannot issue a session', not params.get('access_token') and params.get('error_code') == 'otp_expired')

for _ in range(60):
    try:
        if call('/health')[0] == 200:
            break
    except Exception:
        pass
    time.sleep(1)
else:
    logs = subprocess.run(['docker', 'compose', '-f', 'tests/auth-sandbox/compose.yml', 'logs', '--no-color', 'auth'], capture_output=True, text=True).stdout
    for name in ['TEST_DB_PASSWORD', 'TEST_JWT_SECRET']:
        if os.environ.get(name):
            logs = logs.replace(os.environ[name], '[REDACTED]')
    print(logs[-8000:])
    print(subprocess.run(['docker', 'compose', '-f', 'tests/auth-sandbox/compose.yml', 'ps', '-a'], capture_output=True, text=True).stdout)
    raise SystemExit('Isolated Auth server did not become healthy')

for scenario in [registration, server_mfa, email_change, password_change, recovery, stale_session, expired_confirmation]:
    try:
        scenario()
    except Exception as exc:
        check(scenario.__name__ + ': scenario completed', False)
        print('Scenario interrupted: ' + (str(exc) if isinstance(exc, RuntimeError) else type(exc).__name__), flush=True)

report = {'scope': 'isolated GoTrue v2.197.0; no production credentials or data', 'results': RESULTS}
(OUT / 'auth-results.json').write_text(json.dumps(report, indent=2) + '\n')
rows = ['# Isolated Auth integration results', '', '| Test | Result | HTTP |', '|---|---|---|']
rows += ['| ' + r['test'] + ' | ' + r['result'] + ' | ' + str(r.get('http_status') or '') + ' |' for r in RESULTS]
(OUT / 'auth-results.md').write_text('\n'.join(rows) + '\n')
if os.environ.get('RUNNER_TEMP'):
    address, password, session = new_account('browser')
    _, factor, secret = enroll(session)
    fixture = Path(os.environ['RUNNER_TEMP']) / 'fib-auth-browser.json'
    fixture.write_text(json.dumps({'email': address, 'password': password, 'factor': factor, 'secret': secret}))
    fixture.chmod(0o600)
if any(r['result'] != 'PASS' for r in RESULTS):
    sys.exit(1)
