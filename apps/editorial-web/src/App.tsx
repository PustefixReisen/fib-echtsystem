import { FormEvent, useEffect, useState } from 'react';
import { supabase } from './supabase.js';

type AuthState = 'signed_out' | 'aal1_no_factor' | 'aal1_factor_available' | 'aal2';

type CoordinationState = {
  lead: { userId: string; displayName: string; mine: boolean } | null;
  lock: { userId: string; displayName: string; expiresAt: string; mine: boolean } | null;
};

type CoordinationResult =
  | { ok: true; state: CoordinationState }
  | { ok: false; error: string; state?: CoordinationState };

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
  const [coordination, setCoordination] = useState<CoordinationState | null>(null);
  const [coordinationMessage, setCoordinationMessage] = useState<string | null>(null);
  const [coordinationRunning, setCoordinationRunning] = useState(false);

  async function refreshAuthState() {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setState('signed_out');
      setFactorId(null);
      setQrCode(null);
      setEventResult(null);
      setServiceError(null);
      setCoordination(null);
      setCoordinationMessage(null);
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

  async function runCoordinationAction(action: 'get_state' | 'take_lead' | 'release_lead' | 'acquire_lock' | 'release_lock') {
    setCoordinationRunning(true);
    setCoordinationMessage(null);

    const { data, error } = await supabase.functions.invoke<CoordinationResult>('fib-coordination', {
      body: {
        action,
        objectType: 'event',
        objectId: LIVE_TEST_EVENT_ID,
      },
    });

    setCoordinationRunning(false);

    if (error) {
      setCoordinationMessage(error.message || 'Koordinationsfunktion konnte nicht aufgerufen werden.');
      return;
    }

    if (!data?.ok) {
      setCoordination(data?.state ?? null);
      setCoordinationMessage(
        data?.error === 'locked_by_other'
          ? 'Bearbeitung derzeit durch eine andere Person gesperrt.'
          : 'Koordinationsaktion konnte nicht ausgeführt werden.',
      );
      return;
    }

    setCoordination(data.state);
    const messages: Record<typeof action, string> = {
      get_state: 'Koordinationsstatus aktualisiert.',
      take_lead: 'Federführung übernommen.',
      release_lead: 'Federführung abgegeben.',
      acquire_lock: 'Bearbeitungssperre gesetzt.',
      release_lock: 'Bearbeitungssperre freigegeben.',
    };
    setCoordinationMessage(messages[action]);
  }

  async function logout() {
    await supabase.auth.signOut();
    setMessage('');
    setEventResult(null);
    setServiceError(null);
    setCoordination(null);
    setCoordinationMessage(null);
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

          <hr style={{ margin: '2rem 0' }} />
          <h2 style={{ fontSize: '1.15rem' }}>Redaktionelle Koordination</h2>
          <p style={{ marginBottom: '.75rem' }}>
            Testobjekt: <strong>{eventResult?.title ?? 'FIB-Testereignis'}</strong>
          </p>

          <div style={{ display: 'grid', gap: '.5rem', gridTemplateColumns: '1fr 1fr' }}>
            <button onClick={() => runCoordinationAction('get_state')} disabled={coordinationRunning}>
              Status laden
            </button>
            <button onClick={() => runCoordinationAction(coordination?.lead?.mine ? 'release_lead' : 'take_lead')} disabled={coordinationRunning}>
              {coordination?.lead?.mine ? 'Federführung abgeben' : 'Federführung übernehmen'}
            </button>
            <button onClick={() => runCoordinationAction(coordination?.lock?.mine ? 'release_lock' : 'acquire_lock')} disabled={coordinationRunning}>
              {coordination?.lock?.mine ? 'Bearbeitung beenden' : 'Bearbeitung starten'}
            </button>
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: 8 }}>
            <p style={{ marginTop: 0 }}>
              <strong>Federführung:</strong>{' '}
              {coordination?.lead ? (coordination.lead.mine ? 'Du' : coordination.lead.displayName) : 'niemand'}
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>Bearbeitung:</strong>{' '}
              {coordination?.lock
                ? coordination.lock.mine
                  ? 'von dir gesperrt'
                  : `gesperrt durch ${coordination.lock.displayName}`
                : 'frei'}
            </p>
          </div>

          {coordinationMessage && <p aria-live="polite">{coordinationMessage}</p>}
        </section>
      )}

      {state !== 'signed_out' && <p><button onClick={logout}>Abmelden</button></p>}
      {message && <p aria-live="polite">{message}</p>}
    </main>
  );
}
