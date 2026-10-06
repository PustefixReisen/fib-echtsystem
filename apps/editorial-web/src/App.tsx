import { FormEvent, useEffect, useState } from 'react';
import { supabase } from './supabase.js';

type AuthState = 'signed_out' | 'aal1_no_factor' | 'aal1_factor_available' | 'aal2';

type EventResult = {
  ok: true;
  event: {
    id: string;
    title: string;
    summary: string | null;
    status: 'confirmed' | 'withdrawn' | 'merged';
    occurredAt: string | null;
  };
};

const LIVE_TEST_EVENT_ID = 'ff02ffad-e2a5-4724-a94b-073a1483051d';

export function App() {
  const [email, setEmail] = useState('josef@kjwalter.de');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [state, setState] = useState<AuthState>('signed_out');
  const [message, setMessage] = useState('');
  const [eventResult, setEventResult] = useState<EventResult['event'] | null>(null);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [serviceRunning, setServiceRunning] = useState(false);

  async function refreshAuthState() {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setState('signed_out');
      setFactorId(null);
      setQrCode(null);
      setEventResult(null);
      setServiceError(null);
      return;
    }

    const { data: aal, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aalError || !aal) {
      setMessage('MFA-Status konnte nicht geprüft werden.');
      return;
    }

    if (aal.currentLevel === 'aal2') {
      setState('aal2');
      setMessage('Anmeldung mit MFA erfolgreich.');
      return;
    }

    const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) {
      setMessage('MFA-Faktoren konnten nicht gelesen werden.');
      return;
    }

    const verifiedTotp = factors?.totp.find((factor) => factor.status === 'verified');
    if (verifiedTotp) {
      setFactorId(verifiedTotp.id);
      setState('aal1_factor_available');
      setMessage('Bitte den Code aus der Authenticator-App eingeben.');
      return;
    }

    setState('aal1_no_factor');
    setMessage('Für FIB muss zuerst TOTP-MFA eingerichtet werden.');
  }

  useEffect(() => {
    void refreshAuthState();

    const { data } = supabase.auth.onAuthStateChange(() => {
      void refreshAuthState();
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    setMessage('Anmeldung wird geprüft …');
    setEventResult(null);
    setServiceError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setPassword('');

    if (error) {
      setMessage('Anmeldung fehlgeschlagen.');
      return;
    }

    await refreshAuthState();
  }

  async function enrollTotp() {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'FIB Redaktionszugang',
    });

    if (error || !data.totp) {
      setMessage('TOTP konnte nicht eingerichtet werden.');
      return;
    }

    setFactorId(data.id);
    setQrCode(data.totp.qr_code);
    setMessage('QR-Code mit der Authenticator-App scannen und anschließend den sechsstelligen Code eingeben.');
  }

  async function verifyTotp() {
    if (!factorId || !code.trim()) return;

    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: code.trim(),
    });

    setCode('');

    if (error) {
      setMessage('Der MFA-Code konnte nicht bestätigt werden.');
      return;
    }

    setQrCode(null);
    await refreshAuthState();
  }

  async function runLiveServiceTest() {
    setServiceRunning(true);
    setEventResult(null);
    setServiceError(null);

    const { data, error } = await supabase.functions.invoke<EventResult>('fib-get-event', {
      body: { eventId: LIVE_TEST_EVENT_ID },
    });

    setServiceRunning(false);

    if (error) {
      setServiceError(error.message || 'FIB-Fachservice konnte nicht aufgerufen werden.');
      return;
    }

    if (!data?.ok) {
      setServiceError('FIB-Fachservice lieferte kein gültiges Ergebnis.');
      return;
    }

    setEventResult(data.event);
  }

  async function logout() {
    await supabase.auth.signOut();
    setMessage('');
    setEventResult(null);
    setServiceError(null);
  }

  return (
    <main style={{ maxWidth: 520, margin: '3rem auto', fontFamily: 'system-ui, sans-serif', padding: '0 1rem' }}>
      <h1>FIB Redaktion</h1>

      {state === 'signed_out' && (
        <form onSubmit={login}>
          <p>
            <label>
              E-Mail<br />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
          </p>
          <p>
            <label>
              Passwort<br />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
          </p>
          <button type="submit">Anmelden</button>
        </form>
      )}

      {state === 'aal1_no_factor' && (
        <section>
          <p>Die erste Anmeldung ist erfolgt. Für den Redaktionszugang ist zusätzlich MFA erforderlich.</p>
          {!qrCode && <button onClick={enrollTotp}>Authenticator einrichten</button>}
          {qrCode && <img src={qrCode} alt="QR-Code für FIB-TOTP" style={{ display: 'block', maxWidth: 260, margin: '1rem 0' }} />}
          {qrCode && (
            <p>
              <label>
                Code aus der Authenticator-App<br />
                <input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} />
              </label>{' '}
              <button onClick={verifyTotp}>Bestätigen</button>
            </p>
          )}
        </section>
      )}

      {state === 'aal1_factor_available' && (
        <section>
          <p>Bitte den aktuellen Code aus deiner Authenticator-App eingeben.</p>
          <p>
            <input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} />{' '}
            <button onClick={verifyTotp}>MFA bestätigen</button>
          </p>
        </section>
      )}

      {state === 'aal2' && (
        <section>
          <p><strong>MFA bestätigt.</strong> Der Redaktionszugang kann jetzt den FIB-Fachservice verwenden.</p>
          <p>
            <button onClick={runLiveServiceTest} disabled={serviceRunning}>
              {serviceRunning ? 'Live-Test läuft …' : 'FIB-Fachservice live testen'}
            </button>
          </p>
          {eventResult && (
            <div>
              <p><strong>Live-Test erfolgreich.</strong></p>
              <p>{eventResult.title}</p>
              {eventResult.summary && <p>{eventResult.summary}</p>}
            </div>
          )}
          {serviceError && <p><strong>Live-Test fehlgeschlagen:</strong> {serviceError}</p>}
        </section>
      )}

      {state !== 'signed_out' && <p><button onClick={logout}>Abmelden</button></p>}
      {message && <p aria-live="polite">{message}</p>}
    </main>
  );
}
