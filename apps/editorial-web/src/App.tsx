import { FormEvent, useEffect, useState, type ReactNode } from 'react';
import { supabase } from './supabase.js';
import fibLogo from '../../../assets/brand/logo/fib-logo-primary-approved.png';
import eventIcon from '../../../assets/brand/icons/ereignis.svg';
import dashboardIcon from '../../../assets/brand/icons/redaktion-dashboard.svg';
import workbasketIcon from '../../../assets/brand/icons/redaktion-arbeitskorb.svg';
import reportIcon from '../../../assets/brand/icons/meldung.svg';
import processIcon from '../../../assets/brand/icons/vorgang.svg';
import topicIcon from '../../../assets/brand/icons/thema.svg';
import sessionIcon from '../../../assets/brand/icons/nav-sitzungen.svg';
import assistantIcon from '../../../assets/brand/icons/fib-assistent.svg';
import './app.css';

type AuthState = 'signed_out' | 'aal1_no_factor' | 'aal1_factor_available' | 'aal2';
type EditorialView = 'dashboard' | 'event' | 'profile';

type CoordinationState = {
  lead: { userId: string; displayName: string; mine: boolean } | null;
  lock: { userId: string; displayName: string; expiresAt: string; mine: boolean } | null;
  lastEdit: { userId: string; displayName: string; editedAt: string } | null;
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

type SessionContext = {
  id: string;
  displayName: string;
  fullName: string;
  role: 'editor' | 'admin';
};

type SessionContextResult = { ok: true; user: SessionContext };

const LIVE_TEST_EVENT_ID = 'ff02ffad-e2a5-4724-a94b-073a1483051d';

type ActionName = 'open' | 'edit' | 'save' | 'refresh' | 'back';
function ActionIcon({ name }: { name: ActionName }) {
  const paths: Record<ActionName, ReactNode> = {
    open: <><path d="M5 19 19 5M10 5h9v9" /></>,
    edit: <><path d="m4 20 4.5-1 11-11-3.5-3.5-11 11zM14 6l4 4" /></>,
    save: <><path d="M4 3h14l3 3v15H3V3zM7 3v7h10V3M7 21v-8h10v8" /></>,
    refresh: <><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></>,
    back: <><path d="m14 4-8 8 8 8M6 12h15" /></>,
  };
  return <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
function ProfileIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>);
}

function NavIcon({ src }: { src: string }) {
  return <img className="nav-icon" src={src} alt="" aria-hidden="true" />;
}

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
  const [editingEvent, setEditingEvent] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editOccurredAt, setEditOccurredAt] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [editMessage, setEditMessage] = useState<string | null>(null);
  const [sessionContext, setSessionContext] = useState<SessionContext | null>(null);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [profileCallName, setProfileCallName] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [accountEmail, setAccountEmail] = useState('');
  const [newAccountEmail, setNewAccountEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securitySaving, setSecuritySaving] = useState(false);
  const [securityMessage, setSecurityMessage] = useState('');
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [recoverySending, setRecoverySending] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  function navigateTo(nextView: EditorialView) {
    if (nextView === view) return;
    window.history.pushState({ fibView: nextView }, '', window.location.href);
    setView(nextView);
    setNavigationOpen(false);
    if (nextView === 'dashboard') void loadEditorialStart();
  }

  async function refreshAuthState() {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setState('signed_out');
      setAccountEmail('');
      setPasswordRecovery(false);
      setFactorId(null);
      setQrCode(null);
      setTotpSecret(null);
      setEventResult(null);
      setServiceError(null);
      setCoordination(null);
      setCoordinationMessage(null);
      setSessionContext(null);
      setNavigationOpen(false);
      setView('dashboard');
      return;
    }

    setAccountEmail(sessionData.session.user.email ?? '');
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
    window.history.replaceState({ ...(window.history.state ?? {}), fibView: 'dashboard' }, '', window.location.href);
    const onPopState = (event: PopStateEvent) => {
      const nextView = event.state?.fibView === 'event' ? 'event' : event.state?.fibView === 'profile' ? 'profile' : 'dashboard';
      setView(nextView);
      setNavigationOpen(false);
      if (nextView === 'dashboard') void loadEditorialStart();
    };
    window.addEventListener('popstate', onPopState);

    void refreshAuthState();
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true);
      void refreshAuthState();
    });
    return () => {
      window.removeEventListener('popstate', onPopState);
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (state === 'aal2' && !eventResult && !serviceRunning) {
      void loadEditorialStart();
    }
  }, [state]);

  useEffect(() => {
    if (state === 'aal2' && passwordRecovery) setView('profile');
  }, [state, passwordRecovery]);

  useEffect(() => {
    if (state !== 'aal2' || view !== 'profile') {
      setNewPassword('');
      setConfirmPassword('');
      setNewAccountEmail('');
      setSecurityMessage('');
    }
  }, [state, view]);

  useEffect(() => {
    if (!editingEvent || !coordination?.lock?.mine) return;

    const timer = window.setInterval(() => {
      void runCoordinationAction('renew_lock', true);
    }, 60_000);

    return () => window.clearInterval(timer);
  }, [editingEvent, coordination?.lock?.mine]);

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

  async function loadSessionContext() {
    const { data, error } = await supabase.functions.invoke<SessionContextResult>('fib-session-context', {
      body: {},
    });
    if (!error && data?.ok) { setSessionContext(data.user); setProfileCallName(data.user.displayName === data.user.fullName ? '' : data.user.displayName); }
  }

  async function loadEditorialStart() {
    await Promise.all([loadEvent(), loadCoordinationState(), loadSessionContext()]);
  }

  async function runCoordinationAction(action: 'get_state' | 'take_lead' | 'release_lead' | 'acquire_lock' | 'renew_lock' | 'release_lock', quiet = false) {
    if (!quiet) setCoordinationRunning(true);
    if (!quiet) setCoordinationMessage(null);

    const { data, error } = await supabase.functions.invoke<CoordinationResult>('fib-coordination', {
      body: { action, objectType: 'event', objectId: LIVE_TEST_EVENT_ID },
    });

    if (!quiet) setCoordinationRunning(false);

    if (error) {
      if (!quiet) setCoordinationMessage(error.message || 'Koordinationsfunktion konnte nicht aufgerufen werden.');
      return false;
    }

    if (!data?.ok) {
      setCoordination(data?.state ?? null);
      if (!quiet) setCoordinationMessage(
        data?.error === 'locked_by_other'
          ? 'Bearbeitung derzeit durch eine andere Person gesperrt.'
          : data?.error === 'lock_missing_or_not_owned'
            ? 'Die Bearbeitungssperre ist abgelaufen. Bitte Bearbeitung neu starten.'
            : 'Koordinationsaktion konnte nicht ausgeführt werden.',
      );
      return false;
    }

    setCoordination(data.state);
    const messages: Record<typeof action, string> = {
      get_state: 'Koordinationsstatus aktualisiert.',
      take_lead: 'Federführung übernommen.',
      release_lead: 'Federführung abgegeben.',
      acquire_lock: 'Bearbeitung gestartet.',
      renew_lock: 'Bearbeitungssperre erneuert.',
      release_lock: 'Bearbeitung beendet.',
    };
    if (!quiet) setCoordinationMessage(messages[action]);
    return true;
  }

  async function startEventEditing() {
    if (!eventResult) return;
    const acquired = await runCoordinationAction('acquire_lock');
    if (!acquired) return;
    setEditTitle(eventResult.title);
    setEditSummary(eventResult.summary ?? '');
    setEditOccurredAt(eventResult.occurredAt ? eventResult.occurredAt.slice(0, 10) : '');
    setEditMessage(null);
    setEditingEvent(true);
  }

  async function cancelEventEditing() {
    setEditingEvent(false);
    setEditMessage(null);
    if (coordination?.lock?.mine) await runCoordinationAction('release_lock');
  }

  async function saveEventEdit(event: FormEvent) {
    event.preventDefault();
    if (!eventResult || !editTitle.trim()) return;

    setEditSaving(true);
    setEditMessage(null);
    const { data, error } = await supabase.functions.invoke<EventResult>('fib-editorial-write', {
      body: {
        action: 'edit_event',
        eventId: eventResult.id,
        title: editTitle.trim(),
        summary: editSummary.trim() || null,
        occurredAt: editOccurredAt ? `${editOccurredAt}T00:00:00` : null,
      },
    });
    setEditSaving(false);

    if (error || !data?.ok) {
      setEditMessage(error?.message || 'Änderungen konnten nicht gespeichert werden.');
      return;
    }

    setEventResult(data.event);
    setEditingEvent(false);
    setEditMessage('Änderungen gespeichert.');
    await runCoordinationAction('release_lock', true);
    await loadCoordinationState();
  }

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);
    const { data, error } = await supabase.functions.invoke<SessionContextResult>('fib-session-context', {
      body: { action: 'update_call_name', callName: profileCallName },
    });
    setProfileSaving(false);
    if (error || !data?.ok) {
      setProfileMessage('Rufname konnte nicht gespeichert werden. Bitte erneut versuchen.');
      return;
    }
    setSessionContext(data.user);
    setProfileCallName(data.user.displayName === data.user.fullName ? '' : data.user.displayName);
    setProfileMessage('Rufname gespeichert.');
    await loadCoordinationState();
  }

  async function ensureSecureProfileSession(): Promise<boolean> {
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (error || data?.currentLevel !== 'aal2') {
      setSecurityMessage('Bitte erneut mit MFA anmelden, bevor du Zugangsdaten änderst.');
      await refreshAuthState();
      return false;
    }
    return true;
  }

  async function requestPasswordRecovery() {
    if (recoverySending) return;
    const desired = email.trim();
    if (!desired) {
      setMessage('Bitte zuerst deine E-Mail-Adresse eingeben.');
      return;
    }
    setRecoverySending(true);
    try {
      await supabase.auth.resetPasswordForEmail(desired, {
        redirectTo: window.location.origin + window.location.pathname,
      });
      setMessage('Wenn die Adresse registriert ist und die Anfrage verarbeitet werden kann, erhältst du eine E-Mail zur Passwortwiederherstellung. Bitte auch den Spamordner prüfen.');
    } catch {
      setMessage('Die Anfrage konnte nicht abgeschlossen werden. Bitte die Verbindung prüfen und später erneut versuchen.');
    } finally {
      setRecoverySending(false);
    }
  }

  async function updateEmail(event: FormEvent) {
    event.preventDefault();
    if (securitySaving) return;
    const desired = newAccountEmail.trim();
    if (!desired || desired === accountEmail) return;
    setSecuritySaving(true);
    setSecurityMessage('');
    try {
      if (!(await ensureSecureProfileSession())) return;
      const { error } = await supabase.auth.updateUser({ email: desired });
      setSecurityMessage(error
        ? 'E-Mail-Änderung fehlgeschlagen. Bitte Anmeldung und Adresse prüfen.'
        : 'Änderung angefordert. Bitte die Bestätigungs-E-Mail(s) prüfen. Wann die neue Adresse aktiv wird, hängt von den Auth-Einstellungen ab.');
      if (!error) setNewAccountEmail('');
    } catch {
      setSecurityMessage('E-Mail-Änderung konnte nicht bestätigt werden. Bitte Verbindung und Kontostand prüfen.');
    } finally {
      setSecuritySaving(false);
    }
  }

  async function updatePassword(event: FormEvent) {
    event.preventDefault();
    if (securitySaving) return;
    if (newPassword.length < 12 || newPassword !== confirmPassword) {
      setSecurityMessage('Bitte ein Passwort mit mindestens 12 Zeichen eingeben und identisch wiederholen.');
      return;
    }
    setSecuritySaving(true);
    setSecurityMessage('');
    try {
      if (!(await ensureSecureProfileSession())) return;
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (!error) setPasswordRecovery(false);
      setSecurityMessage(error
        ? 'Passwort konnte nicht geändert werden. Gegebenenfalls ist eine erneute Anmeldung erforderlich.'
        : 'Passwort aktualisiert. Für andere Geräte kann eine erneute Anmeldung erforderlich sein.');
    } catch {
      setSecurityMessage('Passwortänderung konnte nicht bestätigt werden. Bitte Verbindung und Anmeldung prüfen.');
    } finally {
      setNewPassword('');
      setConfirmPassword('');
      setSecuritySaving(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setMessage('');
    setEventResult(null);
    setServiceError(null);
    setCoordination(null);
    setCoordinationMessage(null);
    setTotpSecret(null);
    setEditingEvent(false);
    setSessionContext(null);
    setNavigationOpen(false);
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
              <button type="button" disabled={recoverySending} onClick={(event) => {
                const emailInput = event.currentTarget.form?.querySelector<HTMLInputElement>('input[type="email"]');
                if (emailInput?.reportValidity()) void requestPasswordRecovery();
              }}>{recoverySending ? 'Anfrage wird verarbeitet …' : 'Passwort vergessen?'}</button>
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

  const isAdmin = sessionContext?.role === 'admin';

  return (
    <div className="editorial-shell">
      <header className="topbar">
        <div className="brand-block">
          <button className="menu-toggle" onClick={() => setNavigationOpen((open) => !open)} aria-label="Navigation öffnen oder schließen">☰</button>
          <img src={fibLogo} alt="Feldkirchen im Blick" className="brand-logo" />
          <strong className="app-label">Redaktionssystem</strong>
        </div>

        <label className="global-search">
          <span className="sr-only">In FIB suchen</span>
          <input type="search" placeholder="In FIB suchen …" disabled title="Die globale Suche wird in einem späteren Slice angebunden." />
        </label>
      </header>

      <div className="app-layout">
        <aside className={`side-nav ${navigationOpen ? 'open' : ''}`} aria-label="Hauptnavigation">
          <div className="nav-section">
            <button className={view === 'dashboard' ? 'nav-item active' : 'nav-item'} onClick={() => navigateTo('dashboard')}><NavIcon src={dashboardIcon} />Dashboard</button>
            <button className="nav-item" disabled><NavIcon src={workbasketIcon} />Arbeitskorb <span>folgt</span></button>
          </div>

          <div className="nav-section">
            <p className="nav-heading">Inhalte</p>
            <button className="nav-item" disabled><NavIcon src={reportIcon} />Meldungen <span>folgt</span></button>
            <button className="nav-item" disabled><NavIcon src={processIcon} />Vorgänge <span>folgt</span></button>
            <button className="nav-item" disabled><NavIcon src={topicIcon} />Themen <span>folgt</span></button>
            <button className="nav-item" disabled><NavIcon src={sessionIcon} />Sitzungen <span>folgt</span></button>
          </div>

          <div className="nav-section">
            <p className="nav-heading">Redaktion</p>
            <details>
              <summary>Recherche</summary>
              <button className="nav-subitem" disabled>Funde</button>
              <button className="nav-subitem" disabled>Quellen</button>
              <button className="nav-subitem" disabled>Beobachtungsaufträge</button>
            </details>
            <details>
              <summary>Veröffentlichung</summary>
              <button className="nav-subitem" disabled>Freigaben</button>
              <button className="nav-subitem" disabled>Medien & Dateien</button>
              <button className="nav-subitem" disabled>Kommunikation</button>
              <button className="nav-subitem" disabled>Besucherführung</button>
            </details>
            <details>
              <summary>Auswertung</summary>
              <button className="nav-subitem" disabled>Besucher & Wirkung</button>
              <button className="nav-subitem" disabled>Inhalte</button>
              <button className="nav-subitem" disabled>Recherche</button>
              <button className="nav-subitem" disabled>Redaktion</button>
            </details>
            <button className="nav-item" disabled><NavIcon src={assistantIcon} />FIB-Assistent <span>folgt</span></button>
          </div>

          {isAdmin && (
            <div className="nav-section admin-section">
              <p className="nav-heading">Administration</p>
              <button className="nav-item" disabled>Tasks & Läufe</button>
              <button className="nav-item" disabled>KI & Kosten</button>
              <button className="nav-item" disabled>Referenzsystem</button>
              <button className="nav-item" disabled>Benutzer & Rollen</button>
              <button className="nav-item" disabled>System</button>
              <button className="nav-item" disabled>Audit</button>
            </div>
          )}

          <div className="nav-user">
            <div className="nav-user-identity">
              <div className="nav-user-details">
                <strong>{sessionContext?.displayName ?? 'FIB-Redaktion'}</strong>
                <span>{isAdmin ? 'Admin' : 'Redakteur'}</span>
              </div>
              <button className="profile-gear" type="button" title="Mein Profil" aria-label="Mein Profil öffnen" aria-current={view === 'profile' ? 'page' : undefined} onClick={() => { setProfileMessage(null); navigateTo('profile'); }}>
                <ProfileIcon />
              </button>
            </div>
            <button onClick={logout}>Abmelden</button>
          </div>
        </aside>

        {navigationOpen && <button className="nav-backdrop" aria-label="Navigation schließen" onClick={() => setNavigationOpen(false)} />}

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

            <section className="panel main-work card-headed">
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
                    <h3 className="object-title"><img className="object-icon" src={eventIcon} alt="" aria-hidden="true" />{eventResult.title}</h3>
                    {eventResult.summary && <p>{eventResult.summary}</p>}
                    <p className="meta">Zustand: {eventStatusLabel(eventResult.status)} · Federführung: {coordination?.lead ? (coordination.lead.mine ? (sessionContext?.displayName ?? coordination.lead.displayName) : coordination.lead.displayName) : 'niemand'}</p>
                  </div>
                  <button className="primary action-button" onClick={() => navigateTo('event')}><ActionIcon name="open" />Öffnen</button>
                </article>
              )}
            </section>

            <div className="dashboard-secondary">
              <section className="panel card-headed">
                <h2>Neue Funde</h2>
                <p>Alle neuen Funde der Redaktion. Datenanbindung folgt.</p>
              </section>
              <section className="panel card-headed">
                <h2>Freigaben</h2>
                <p>Alle für deine Rolle bearbeitbaren Freigaben. Datenanbindung folgt.</p>
              </section>
              <section className="panel card-headed">
                <h2>Recherche-Status</h2>
                <p>Nur handlungsrelevante Recherchehinweise. Datenanbindung folgt.</p>
              </section>
              <section className="panel card-headed">
                <h2>FIB-Assistent</h2>
                <p>„Was möchtest du klären?“ – die Assistenten-Anbindung folgt.</p>
              </section>
              <section className="panel card-headed">
                <h2>Zuletzt verändert</h2>
                <p>Schneller Wiedereinstieg in zuletzt bearbeitete Inhalte. Datenanbindung folgt.</p>
              </section>
              <section className="panel card-headed">
                <h2>Systemhinweise</h2>
                <p>{serviceError ? 'Es gibt aktuell einen technischen Handlungsbedarf.' : 'Aktuell kein technischer Hinweis aus dem angebundenen Ereignis-Service.'}</p>
              </section>
            </div>

            <section className="panel muted-panel dashboard-workbasket card-headed">
              <h2>Arbeitskorb</h2>
              <p>Offene oder bewusst zurückgestellte Entscheidungen. Er bleibt nachgeordnet und ist kein Pflicht-Zwischenschritt für jede Bearbeitung.</p>
            </section>
          </>
        )}

        {view === 'profile' && (
          <>
            <nav className="breadcrumbs" aria-label="Brotkrumen">
              <button onClick={() => navigateTo('dashboard')}>Dashboard</button>
              <span>›</span><span aria-current="page">Mein Profil</span>
            </nav>
            <div className="page-heading"><div><p className="eyebrow">Persönliche Einstellungen</p><h1 className="profile-page-title"><ProfileIcon />Mein Profil</h1></div></div>
            <section className="panel card-headed profile-panel">
              <h2>Benutzerdaten</h2>
              <p><strong>Vollständiger Name:</strong> {sessionContext?.fullName ?? '–'}</p>
              <p><strong>Rolle:</strong> {isAdmin ? 'Admin' : 'Redakteur'}</p>
              <form className="stack" onSubmit={saveProfile}>
                <label>Rufname (optional)
                  <input value={profileCallName} onChange={e => setProfileCallName(e.target.value)} maxLength={60} autoComplete="nickname" />
                </label>
                <p className="meta">Ohne Rufnamen wird dein vollständiger Name angezeigt.</p>
                <div className="button-row">
                  <button className="primary action-button" type="submit" disabled={profileSaving}><ActionIcon name="save" />{profileSaving ? 'Speichert …' : 'Speichern'}</button>
                  <button type="button" onClick={() => navigateTo('dashboard')}>Zurück</button>
                </div>
              </form>
              {profileMessage && <p className="status-message" role="status">{profileMessage}</p>}
            </section>
            <section className="panel card-headed profile-panel">
              <h2>Zugangssicherheit</h2>
              <p className="meta">Die Änderung deiner E-Mail-Adresse oder deines Passworts gilt für alle Anwendungen, die du mit diesem gemeinsamen Konto nutzt.</p>
              {passwordRecovery && <p className="notice" role="status">Deine Wiederherstellung ist mit MFA bestätigt. Bitte jetzt ein neues Passwort festlegen.</p>}
              <p><strong>Aktuelle E-Mail-Adresse:</strong> {accountEmail || '–'}</p>
              <form className="stack" onSubmit={updateEmail}>
                <label>Neue E-Mail-Adresse
                  <input type="email" autoComplete="email" value={newAccountEmail} onChange={e => setNewAccountEmail(e.target.value)} required />
                </label>
                <div className="button-row"><button type="submit" disabled={securitySaving || !newAccountEmail.trim()}>E-Mail-Änderung anfordern</button></div>
                <p className="meta">Du erhältst Bestätigungs-E-Mails. Die Änderung ist erst nach erfolgreicher Verifizierung abgeschlossen.</p>
              </form>
              <form className="stack security-form" onSubmit={updatePassword}>
                <h3>Passwort ändern</h3>
                <label>Neues Passwort
                  <input type="password" autoComplete="new-password" minLength={12} value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                </label>
                <label>Neues Passwort wiederholen
                  <input type="password" autoComplete="new-password" minLength={12} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </label>
                <div className="button-row"><button type="submit" disabled={securitySaving || !newPassword}>Passwort ändern</button></div>
              </form>
              <p className="meta">Die Verwaltung und der sichere Wechsel von MFA-Faktoren folgen als gesonderter Schritt.</p>
              {securityMessage && <p className="status-message" role="status">{securityMessage}</p>}
            </section>
          </>
        )}

        {view === 'event' && eventResult && (
          <>
            <nav className="breadcrumbs" aria-label="Brotkrumen">
              <button onClick={() => navigateTo('dashboard')}>Dashboard</button>
              <span>›</span>
              <span aria-current="page">Ereignis</span>
            </nav>

            <div className="page-heading event-heading">
              <div>
                <p className="eyebrow">Ereignis</p>
                <h1 className="object-title"><img className="object-icon" src={eventIcon} alt="" aria-hidden="true" />{eventResult.title}</h1>
                {eventResult.summary && <p>{eventResult.summary}</p>}
              </div>
              <button className="action-button" onClick={() => window.history.back()}><ActionIcon name="back" />Zurück</button>
            </div>

            <section className="object-status">
              <div><span>Zustand / Status</span><strong>{eventStatusLabel(eventResult.status)}</strong></div>
              <div><span>Nächster Schritt</span><strong>Bearbeitung im Ereignis fortsetzen</strong></div>
            </section>

            <div className="detail-grid">
              <section className="panel card-headed">
                <div className="section-heading">
                  <div><h2>Ereignisdaten</h2></div>
                  {!editingEvent && (
                    <button className="primary action-button" onClick={startEventEditing} disabled={coordinationRunning || !!(coordination?.lock && !coordination.lock.mine)}>
                      <ActionIcon name="edit" />
                      Bearbeiten
                    </button>
                  )}
                </div>

                {editingEvent ? (
                  <form className="stack edit-form" onSubmit={saveEventEdit}>
                    <label>Titel
                      <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
                    </label>
                    <label>Zusammenfassung
                      <textarea value={editSummary} onChange={(e) => setEditSummary(e.target.value)} rows={6} />
                    </label>
                    <label>Ereignisdatum
                      <input type="date" value={editOccurredAt} onChange={(e) => setEditOccurredAt(e.target.value)} />
                    </label>
                    <div className="button-row">
                      <button type="submit" className="primary action-button" disabled={editSaving}><ActionIcon name="save" />{editSaving ? 'Speichert …' : 'Speichern'}</button>
                      <button type="button" onClick={cancelEventEditing} disabled={editSaving}>Abbrechen</button>
                    </div>
                  </form>
                ) : (
                  <dl className="data-list">
                    <div><dt>Titel</dt><dd>{eventResult.title}</dd></div>
                    <div><dt>Zusammenfassung</dt><dd>{eventResult.summary ?? 'Noch keine Zusammenfassung'}</dd></div>
                    <div><dt>Ereignisdatum</dt><dd>{eventResult.occurredAt ? new Date(eventResult.occurredAt).toLocaleDateString('de-DE') : 'Noch nicht gesetzt'}</dd></div>
                  </dl>
                )}
                {editMessage && <p aria-live="polite" className="status-message">{editMessage}</p>}
              </section>

              <aside className="panel card-headed">
                <div className="section-heading"><h2>Redaktionelle Koordination</h2></div>
                <p><strong>Federführung:</strong> {coordination?.lead ? (coordination.lead.mine ? (sessionContext?.displayName ?? coordination.lead.displayName) : coordination.lead.displayName) : 'niemand'}</p>
                <p><strong>Bearbeitung:</strong> {coordination?.lock ? (coordination.lock.mine ? `gesperrt durch ${sessionContext?.displayName ?? coordination.lock.displayName}` : `gesperrt durch ${coordination.lock.displayName}`) : 'frei'}</p>
                <p><strong>Letzte Bearbeitung:</strong> {coordination?.lastEdit ? `${coordination.lastEdit.displayName} · ${new Date(coordination.lastEdit.editedAt).toLocaleString('de-DE')}` : 'noch nicht erfasst'}</p>

                <div className="stack compact">
                  <button onClick={() => runCoordinationAction(coordination?.lead?.mine ? 'release_lead' : 'take_lead')} disabled={coordinationRunning}>
                    {coordination?.lead?.mine ? 'Federführung abgeben' : 'Federführung übernehmen'}
                  </button>
                  {!editingEvent && <button className="primary" onClick={() => runCoordinationAction(coordination?.lock?.mine ? 'release_lock' : 'acquire_lock')} disabled={coordinationRunning}>
                    {coordination?.lock?.mine ? 'Bearbeitung beenden' : 'Bearbeitung starten'}
                  </button>}
                  <button className="action-button" onClick={() => runCoordinationAction('get_state')} disabled={coordinationRunning}><ActionIcon name="refresh" />Status aktualisieren</button>
                </div>

                {coordinationMessage && <p aria-live="polite" className="status-message">{coordinationMessage}</p>}
              </aside>
            </div>
          </>
        )}
        </main>
      </div>
    </div>
  );
}
