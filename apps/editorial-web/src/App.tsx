import { FormEvent, useEffect, useState } from 'react';
import { supabase } from './supabase.js';
import './app.css';

type AuthState = 'signed_out' | 'aal1_no_factor' | 'aal1_factor_available' | 'aal2';
type EditorialView = 'dashboard' | 'event';

type CoordinationState = {
  lead: { userId: string; displayName: string; mine: boolean } | null;
  lock: { userId: string; displayName: string; expiresAt: string; mine: boolean } | null;
};

type CoordinationResult =
  | { ok: true; state: CoordinationState }
  | { ok: false; error: string; state?: CoordinationState };

type EventData = {
  id: string;
  title: string;
  summary: string | null;
  status: 'confirmed' | 'withdrawn' | 'merged';
  occurredAt: string | null;
};

type EventResult = { ok: true; event: EventData };

const LIVE_TEST_EVENT_ID = 'ff02ffad-e2a5-4724-a94b-073a1483051d';

function eventStatusLabel(status: EventData['status']) {
  if (status === 'confirmed') return 'Bestätigt';
  if (status === 'withdrawn') return 'Zurückgezogen';
  return 'Zusammengeführt';
}

export function App() {
  const [email, setEmail] = useState('josef@kjwalter.de');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [state, setState] = useState<AuthState>('signed_out');
  const [message, setMessage] = useState('');
  const [view, setView] = useState<EditorialView>('dashboard');
  const [eventResult, setEventResult] = useState<EventData | null>(null);
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
      setTotpSecret(null);
      setEventResult(null);
      setServiceError(null);
      setCoordination(null);
      setCoordinationMessage(null);
      setView('dashboard');
      return;
    }

    const { data: aal, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aalError || !aal) {
      setMessage('MFA-Status konnte nicht geprüft werden.');
      return;
    }

    if (aal.currentLevel === 'aal2') {
      setState('aal2');
      setMessage('');
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
    const { data } = supabase.auth.onAuthStateChange(() => void refreshAuthState());
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (state === 'aal2' && !eventResult && !serviceRunning) {
      void loadEditorialStart();
    }
  }, [state]);

  async function login(event: FormEvent) {
    event.preventDefault();
    setMessage('Anmeldung wird geprüft …');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setPassword('');
    if (error) {
      setMessage('Anmeldung fehlgeschlagen.');
      return;
    }
    await refreshAuthState();
  }

  async function enrollTotp() {
    setFactorId(null);
    setQrCode(null);
    setTotpSecret(null);
    setCode('');
    setMessage('MFA-Einrichtung wird vorbereitet …');

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: `FIB Redaktionszugang ${new Date().toISOString()}`,
    });

    if (error || !data.totp) {
      setMessage('TOTP konnte nicht eingerichtet werden.');
      return;
    }

    setFactorId(data.id);
    setQrCode(data.totp.qr_code);
    setTotpSecret(data.totp.secret);
    setMessage('Authenticator einrichten: QR-Code scannen oder den Schlüssel manuell in Aegis eintragen.');
  }

  async function restartTotpEnrollment() {
    const currentFactorId = factorId;
    setFactorId(null);
    setQrCode(null);
    setTotpSecret(null);
    setCode('');
    if (currentFactorId) await supabase.auth.mfa.unenroll({ factorId: currentFactorId });
    await enrollTotp();
  }

  async function copyTotpSecret() {
    if (!totpSecret) return;
    try {
      await navigator.clipboard.writeText(totpSecret);
      setMessage('Einrichtungsschlüssel kopiert.');
    } catch {
      setMessage('Kopieren war nicht möglich. Bitte den Schlüssel manuell übernehmen.');
    }
  }

  async function verifyTotp() {
    if (!factorId || !code.trim()) return;
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: code.trim(),
    });
    setCode('');

    if (error) {
      setMessage('Der MFA-Code konnte nicht bestätigt werden. Bitte einen aktuellen Code verwenden.');
      return;
    }

    setFactorId(null);
    setQrCode(null);
    setTotpSecret(null);
    await refreshAuthState();
  }

  async function loadEvent() {
    setServiceRunning(true);
    setServiceError(null);
    const { data, error } = await supabase.functions.invoke<EventResult>('fib-get-event', {
      body: { eventId: LIVE_TEST_EVENT_ID },
    });
    setServiceRunning(false);

    if (error || !data?.ok) {
      setServiceError(error?.message || 'Ereignis konnte nicht geladen werden.');
      return null;
    }

    setEventResult(data.event);
    return data.event;
  }

  async function loadCoordinationState() {
    const { data, error } = await supabase.functions.invoke<CoordinationResult>('fib-coordination', {
      body: { action: 'get_state', objectType: 'event', objectId: LIVE_TEST_EVENT_ID },
    });
    if (!error && data?.ok) setCoordination(data.state);
  }

  async function loadEditorialStart() {
    await Promise.all([loadEvent(), loadCoordinationState()]);
  }

  async function runCoordinationAction(action: 'get_state' | 'take_lead' | 'release_lead' | 'acquire_lock' | 'release_lock') {
    setCoordinationRunning(true);
    setCoordinationMessage(null);

    const { data, error } = await supabase.functions.invoke<CoordinationResult>('fib-coordination', {
      body: { action, objectType: 'event', objectId: LIVE_TEST_EVENT_ID },
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
      acquire_lock: 'Bearbeitung gestartet.',
      release_lock: 'Bearbeitung beendet.',
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
    setTotpSecret(null);
    setView('dashboard');
  }

  if (state !== 'aal2') {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <p className="eyebrow">Feldkirchen im Blick</p>
          <h1>Redaktionssystem</h1>

          {state === 'signed_out' && (
            <form onSubmit={login} className="stack">
              <label>E-Mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
              <label>Passwort<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
              <button type="submit" className="primary">Anmelden</button>
            </form>
          )}

          {state === 'aal1_no_factor' && (
            <div className="stack">
              <p>Für den Redaktionszugang ist zusätzlich MFA erforderlich.</p>
              {!qrCode && <button onClick={enrollTotp} className="primary">Authenticator einrichten</button>}
              {qrCode && <img src={qrCode} alt="QR-Code für FIB-TOTP" className="qr" />}
              {totpSecret && (
                <div className="notice">
                  <strong>Auf diesem Gerät einrichten</strong>
                  <p>In Aegis: + → Manuelle Eingabe → TOTP.</p>
                  <code>{totpSecret}</code>
                  <div className="button-row">
                    <button type="button" onClick={copyTotpSecret}>Schlüssel kopieren</button>
                    <button type="button" onClick={restartTotpEnrollment}>Neu starten</button>
                  </div>
                </div>
              )}
              {qrCode && (
                <label>Code aus der Authenticator-App
                  <input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} />
                  <button onClick={verifyTotp} className="primary">Bestätigen</button>
                </label>
              )}
            </div>
          )}

          {state === 'aal1_factor_available' && (
            <div className="stack">
              <p>Bitte den aktuellen Code aus deiner Authenticator-App eingeben.</p>
              <input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} />
              <button onClick={verifyTotp} className="primary">MFA bestätigen</button>
            </div>
          )}

          {state !== 'signed_out' && <button onClick={logout} className="link-button">Abmelden</button>}
          {message && <p aria-live="polite" className="status-message">{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <div className="editorial-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Feldkirchen im Blick</p>
          <strong>Redaktionssystem</strong>
        </div>
        <div className="topbar-actions">
          <span className="role-pill">Redaktion · MFA aktiv</span>
          <button onClick={logout}>Abmelden</button>
        </div>
      </header>

      <nav className="main-nav" aria-label="Hauptnavigation">
        <button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>Dashboard</button>
        <button disabled>Recherche</button>
        <button disabled>Inhalte</button>
        <button disabled>Veröffentlichung</button>
      </nav>

      <main className="content-shell">
        {view === 'dashboard' && (
          <>
            <div className="page-heading">
              <div>
                <p className="eyebrow">Übersicht</p>
                <h1>Dashboard</h1>
                <p>Was braucht als Nächstes redaktionelle Aufmerksamkeit?</p>
              </div>
            </div>

            <section className="status-grid" aria-label="Redaktionsstatus">
              <article><span>Neue Funde</span><strong>–</strong><small>noch nicht angebunden</small></article>
              <article><span>Meine Aufgaben</span><strong>–</strong><small>noch nicht angebunden</small></article>
              <article><span>Freigaben</span><strong>–</strong><small>noch nicht angebunden</small></article>
              <article><span>Systemhinweise</span><strong>{serviceError ? '1' : '0'}</strong><small>{serviceError ? 'Handlungsbedarf' : 'keine'}</small></article>
            </section>

            <section className="panel main-work">
              <div className="section-heading">
                <div>
                  <h2>Als Nächstes bearbeiten</h2>
                  <p>Im ersten UI-Slice wird hier ein reales Ereignis aus dem FIB-Fachservice verwendet.</p>
                </div>
              </div>

              {serviceRunning && <p>Ereignis wird geladen …</p>}
              {serviceError && <p className="error">{serviceError}</p>}
              {eventResult && (
                <article className="work-item">
                  <div>
                    <span className="tag">Ereignis</span>
                    <h3>{eventResult.title}</h3>
                    {eventResult.summary && <p>{eventResult.summary}</p>}
                    <p className="meta">Zustand: {eventStatusLabel(eventResult.status)} · Federführung: {coordination?.lead ? (coordination.lead.mine ? 'Du' : coordination.lead.displayName) : 'niemand'}</p>
                  </div>
                  <button className="primary" onClick={() => setView('event')}>Öffnen</button>
                </article>
              )}
            </section>

            <section className="panel muted-panel">
              <h2>Arbeitskorb</h2>
              <p>Der Arbeitskorb bleibt bewusst nachgeordnet. Er nimmt später offene oder zurückgestellte Entscheidungen auf; er ist kein Pflicht-Zwischenschritt für jede Bearbeitung.</p>
            </section>
          </>
        )}

        {view === 'event' && eventResult && (
          <>
            <nav className="breadcrumbs" aria-label="Brotkrumen">
              <button onClick={() => setView('dashboard')}>Dashboard</button>
              <span>›</span>
              <span>Ereignisse</span>
              <span>›</span>
              <span aria-current="page">{eventResult.title}</span>
            </nav>

            <div className="page-heading event-heading">
              <div>
                <p className="eyebrow">Ereignis</p>
                <h1>{eventResult.title}</h1>
                {eventResult.summary && <p>{eventResult.summary}</p>}
              </div>
              <button onClick={() => setView('dashboard')}>Zur Übersicht</button>
            </div>

            <section className="object-status">
              <div><span>Zustand / Status</span><strong>{eventStatusLabel(eventResult.status)}</strong></div>
              <div><span>Nächster Schritt</span><strong>Bearbeitung im Ereignis fortsetzen</strong></div>
            </section>

            <div className="detail-grid">
              <section className="panel">
                <h2>Ereignisdaten</h2>
                <dl className="data-list">
                  <div><dt>Titel</dt><dd>{eventResult.title}</dd></div>
                  <div><dt>Zusammenfassung</dt><dd>{eventResult.summary ?? 'Noch keine Zusammenfassung'}</dd></div>
                  <div><dt>Ereignisdatum</dt><dd>{eventResult.occurredAt ? new Date(eventResult.occurredAt).toLocaleDateString('de-DE') : 'Noch nicht gesetzt'}</dd></div>
                </dl>
                <p className="implementation-note">Die Schreibfunktion ist im Fachservice vorhanden. Die UI-Anbindung für tatsächliches Bearbeiten und Speichern folgt im nächsten Teil dieses Slices.</p>
              </section>

              <aside className="panel">
                <h2>Redaktionelle Koordination</h2>
                <p><strong>Federführung:</strong> {coordination?.lead ? (coordination.lead.mine ? 'Du' : coordination.lead.displayName) : 'niemand'}</p>
                <p><strong>Bearbeitung:</strong> {coordination?.lock ? (coordination.lock.mine ? 'von dir gesperrt' : `gesperrt durch ${coordination.lock.displayName}`) : 'frei'}</p>

                <div className="stack compact">
                  <button onClick={() => runCoordinationAction(coordination?.lead?.mine ? 'release_lead' : 'take_lead')} disabled={coordinationRunning}>
                    {coordination?.lead?.mine ? 'Federführung abgeben' : 'Federführung übernehmen'}
                  </button>
                  <button className="primary" onClick={() => runCoordinationAction(coordination?.lock?.mine ? 'release_lock' : 'acquire_lock')} disabled={coordinationRunning}>
                    {coordination?.lock?.mine ? 'Bearbeitung beenden' : 'Bearbeitung starten'}
                  </button>
                  <button onClick={() => runCoordinationAction('get_state')} disabled={coordinationRunning}>Status aktualisieren</button>
                </div>

                {coordinationMessage && <p aria-live="polite" className="status-message">{coordinationMessage}</p>}
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
