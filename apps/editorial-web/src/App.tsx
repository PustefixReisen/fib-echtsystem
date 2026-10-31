import {SourceWorkspace} from './SourceWorkspace.js';
import { FormEvent, useEffect, useState, useRef, type ReactNode } from 'react';
import { PasswordField } from './PasswordField.js';
import { supabase, invitationMode, authLinkError, invitationPasswordDone, rememberInvitationPassword } from './supabase.js';
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

type AuthState = 'checking' | 'auth_error' | 'signed_out' | 'aal1_no_factor' | 'aal1_factor_available' | 'aal2';
type EditorialView = 'dashboard' | 'event' | 'events' | 'topics' | 'profile' | 'users' | 'u4pilot' | 'findings' | 'sessions';
type TopicData = { id:string; title:string; guiding_question:string | null; description:string | null; status:string };
type TopicProposal = { id:string; topic_id:string; process_id:string; suggested_significance:string; suggested_rationale:string; status:string; origin:string; process_title:string; topic_title:string };
type TopicContributionVersion = {id:string;version_no:number;body:string;editorial_assessment:string|null;approved_at:string;revoked_at:string|null;published_at:string|null;ended_at:string|null};
type TopicContributionData = {topic:TopicData;draft:{body:string;editorial_assessment:string|null;revision:number;updated_at:string}|null;versions:TopicContributionVersion[];currentPublication:{contribution_version_id:string;published_at:string}|null};
type TopicListData = { topics:TopicData[]; proposals:TopicProposal[]; processes:{id:string;title:string}[]; links:{topic_id:string;process_id:string;significance:string;significance_rationale:string|null;process_title:string}[] };

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

type EventSource = { findingId: string; findingTitle: string; originalUrl: string | null; sourceName: string; evidenceRole?: string | null; note?: string | null; justification?: string | null; previousJustification?: string | null };
function isImportedFindingNote(note: string | null | undefined): boolean {
  if (!note?.trim().startsWith('{')) return false;
  try {
    const metadata = JSON.parse(note) as Record<string, unknown>;
    return typeof metadata.batch === 'string' && metadata.batch.startsWith('demo-') &&
      typeof metadata.demonstrator_id === 'string' && typeof metadata.original_source === 'object';
  } catch { return false; }
}
function evidenceRoleLabel(role: string | null | undefined): string {
  const labels: Record<string, string> = {
    primary_official: 'Amtliche Originalquelle',
    editorial_reference: 'Redaktionell zugeordneter Beleg',
  };
  return role ? (labels[role] ?? `Weitere Belegrolle (${role})`) : 'Nicht festgelegt';
}
type EventResult = { ok: true; event: EventData; sources?: EventSource[] };
type FindingListResult = { ok: true; findings: EventSource[]; hasMore: boolean };
function readableSummary(summary: string | null): string | null {
  if (!summary) return null;
  if (!summary.startsWith('Entwicklungsdaten; Import ')) return summary;
  const split = summary.indexOf('\n\n');
  return split >= 0 ? summary.slice(split + 2) : summary;
}
function readableEventTitle(title: string): string {
  return title.replace(/^\[ENTWICKLUNG [^\]]+\]\s*/, '');
}
function readableSourceName(name: string): string {
  return name.replace(/^\[ENTWICKLUNG [^\]]+\]\s*/, '');
}
type EventListResult = { ok: true; events: EventData[]; hasMore: boolean };

type SessionContext = {
  id: string;
  displayName: string;
  fullName: string;
  role: 'editor' | 'admin';
};

type SessionContextResult = { ok: true; user: SessionContext };

type AdminUser = {
  user_id: string;
  full_name: string;
  role: 'editor' | 'admin';
  active: boolean;
  setup_status: 'invited' | 'setup_pending' | 'active' | 'deactivated';
  created_at: string;
  updated_at: string;
  email: string | null;
  invited_at: string | null;
  confirmed_at: string | null;
};

type AdminUsersResult =
  | { ok: true; users: AdminUser[] }
  | { ok: true; mode: 'new_account' | 'existing_account'; userId: string; message?: string }
  | { ok: false; error: string };

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [state, setState] = useState<AuthState>('checking');
  const [message, setMessage] = useState(authLinkError ? 'Dieser Link ist ungültig oder abgelaufen. Bitte fordere einen neuen Link an.' : '');
  const sourceLeaveRef=useRef<()=>boolean>(()=>true);
  const [sourceFindingId,setSourceFindingId]=useState<string|null>(null);
  const [view, setView] = useState<EditorialView>('dashboard');
  const [topicData,setTopicData] = useState<TopicListData | null>(null);
  const [topicListOpen,setTopicListOpen] = useState(true);
  const [topicSearch,setTopicSearch] = useState('');
  const [topicFilter,setTopicFilter] = useState('all');
  const [topicEditTitle,setTopicEditTitle] = useState('');
  const [topicEditQuestion,setTopicEditQuestion] = useState('');
  const [topicEditDescription,setTopicEditDescription] = useState('');
  const [topicContribution,setTopicContribution] = useState<TopicContributionData | null>(null);
  const [topicBody,setTopicBody] = useState('');
  const [topicAssessment,setTopicAssessment] = useState('');
  const [topicBusy,setTopicBusy] = useState(false);
  const [topicError,setTopicError] = useState('');
  const [topicTitle,setTopicTitle] = useState('');
  const [topicQuestion,setTopicQuestion] = useState('');
  const [topicDescription,setTopicDescription] = useState('');
  const [topicId,setTopicId] = useState('');
  const [topicCoordination,setTopicCoordination] = useState<CoordinationState | null>(null);
  const [topicCoordinationBusy,setTopicCoordinationBusy] = useState(false);
  const [topicCoordinationMessage,setTopicCoordinationMessage] = useState<string | null>(null);
  const [processId,setProcessId] = useState('');
  const [processPickerOpen,setProcessPickerOpen] = useState(false);
  const [processQuery,setProcessQuery] = useState('');
  const availableTopicProcesses = (topicData?.processes ?? []).filter(p=>
    !topicData?.links.some(l=>l.topic_id===topicId && l.process_id===p.id) &&
    !topicData?.proposals.some(q=>q.topic_id===topicId && q.process_id===p.id && ['pending','deferred','rejected'].includes(q.status))
  );
  const selectableProcessId = availableTopicProcesses.some(p=>p.id===processId) ? processId : '';
  const filteredTopicProcesses=availableTopicProcesses.filter(p=>p.title.toLocaleLowerCase('de-DE').includes(processQuery.trim().toLocaleLowerCase('de-DE'))).slice(0,100);
  const [topicStep,setTopicStep] = useState<1|2|3>(1);
  const [topicCreateOpen,setTopicCreateOpen] = useState(false);
  const [topicSignificance,setTopicSignificance] = useState('relevant');
  const [topicRationale,setTopicRationale] = useState('');
  const [topicReviews,setTopicReviews] = useState<Record<string,{significance:string;rationale:string;status?:string}>>({});
  const [eventResult, setEventResult] = useState<EventData | null>(null);
  const [eventSources, setEventSources] = useState<EventSource[]>([]);
  const [sourceSearch, setSourceSearch] = useState('');
  const [sourceMatches, setSourceMatches] = useState<EventSource[]>([]);
  const [linkJustificationDrafts, setLinkJustificationDrafts] = useState<Record<string,string>>({});
  const [sourcePickerOpen, setSourcePickerOpen] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
  const [sourceRoleDraft, setSourceRoleDraft] = useState('');
  const [sourceNoteDraft, setSourceNoteDraft] = useState('');
  const [sourceBusy, setSourceBusy] = useState(false);
  const [sourceMessage, setSourceMessage] = useState<string | null>(null);
  const sourceRequestRef = useRef(0);
  const eventListRequestRef = useRef(0);
  const [eventList, setEventList] = useState<EventData[]>([]);
  const [eventSearch, setEventSearch] = useState('');
  const [eventListBusy, setEventListBusy] = useState(false);
  const [eventListError, setEventListError] = useState<string | null>(null);
  const [eventListHasMore, setEventListHasMore] = useState(false);
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
  const [editFailed, setEditFailed] = useState(false);
  const [editSaved, setEditSaved] = useState(false);
  const leaveGuardRef = useRef(false);
  const currentViewRef = useRef<EditorialView>('dashboard');
  const historyLeaveRef = useRef<() => boolean>(() => true);
  const [sessionContext, setSessionContext] = useState<SessionContext | null>(null);
  const [membershipStatus, setMembershipStatus] = useState<'checking' | 'pending' | 'error' | 'active'>('checking');
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [profileCallName, setProfileCallName] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [adminUsersLoading, setAdminUsersLoading] = useState(false);
  const [u4Busy,setU4Busy] = useState(false);
  const [u4Result,setU4Result] = useState<Record<string,unknown>|null>(null);
  const [u4Error,setU4Error] = useState<string|null>(null);
  const [adminInviteName, setAdminInviteName] = useState('');
  const [adminInviteEmail, setAdminInviteEmail] = useState('');
  const [adminInviteRole, setAdminInviteRole] = useState<'editor' | 'admin'>('editor');
  const [adminInviteBusy, setAdminInviteBusy] = useState(false);
  const [adminInviteMessage, setAdminInviteMessage] = useState<string | null>(null);
  const [adminDialog, setAdminDialog] = useState<'new' | string | null>(null);

  const [accountEmail, setAccountEmail] = useState('');
  const [newAccountEmail, setNewAccountEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securitySaving, setSecuritySaving] = useState(false);
  const [securityMessage, setSecurityMessage] = useState('');
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [recoverySending, setRecoverySending] = useState(false);

  const [invitationUserId, setInvitationUserId] = useState<string | null>(null);
  const [invitationPasswordPending, setInvitationPasswordPending] = useState(invitationMode);
  const [initialPassword, setInitialPassword] = useState('');
  const [initialPasswordConfirm, setInitialPasswordConfirm] = useState('');
  const [invitationSaving, setInvitationSaving] = useState(false);
  const [authenticatedUserId, setAuthenticatedUserId] = useState<string | null>(null);
  const activeUserId = useRef<string | null>(null);
  const authRevision = useRef(0);
  const mfaBusy = useRef(false);
  const invitationBusy = useRef(false);


  const eventDirty = editingEvent && !!eventResult && (
    editTitle !== eventResult.title ||
    (editSummary.trim() || null) !== (readableSummary(eventResult.summary)?.trim() || null) ||
    editOccurredAt !== (eventResult.occurredAt?.slice(0, 10) ?? '')
  );
  leaveGuardRef.current = eventDirty || editSaving;
  currentViewRef.current = view;

  function confirmLeave(): boolean {
    if (editSaving || !sourceLeaveRef.current()) return false;
    return !eventDirty || window.confirm('Ungespeicherte Änderungen\\n\\nÄnderungen verwerfen und den Bereich verlassen?');
  }

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!leaveGuardRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, []);

  historyLeaveRef.current = () => {
    if (!confirmLeave()) return false;
    if (editingEvent) { setEditingEvent(false); void runCoordinationAction('release_lock', true); }
    return true;
  };

  useEffect(() => {
    if (view === 'events' || view === 'event' || view === 'findings') {
      const group = document.getElementById('nav-recherche') as HTMLDetailsElement | null;
      if (group) group.open = true;
    }
  }, [view]);

  function navigateTo(nextView: EditorialView) {
    if (nextView === view || !confirmLeave()) return;
    if (editingEvent) { setEditingEvent(false); void runCoordinationAction('release_lock', true); }
    window.history.pushState({ fibView: nextView }, '', window.location.href);
    setView(nextView);
    setNavigationOpen(false);
    if (nextView === 'dashboard') void loadEditorialStart();
    if (nextView === 'events') void loadEventList();
    if (nextView === 'users') void loadAdminUsers();
    if (nextView === 'topics') {setTopicListOpen(true);void loadTopics();}
  }

  function showTopic(t: TopicData) {
    setTopicId(t.id);
    setTopicCoordination(null);
    setTopicCoordinationMessage(null);
    void topicCoordinationAction('get_state', t.id);
    setTopicEditTitle(t.title);
    setTopicEditQuestion(t.guiding_question ?? '');
    setTopicEditDescription(t.description ?? '');
    setTopicListOpen(false);
    setTopicStep(1);
    setTopicError('');
    void loadTopicContribution(t.id);
  }
  async function topicCoordinationAction(action: 'get_state' | 'take_lead' | 'release_lead', id = topicId) {
    if (!id || topicCoordinationBusy) return;
    setTopicCoordinationBusy(true);
    setTopicCoordinationMessage(null);
    try {
      const {data,error}=await supabase.functions.invoke<CoordinationResult>('fib-coordination',{
        body:{action,objectType:'topic',objectId:id},
      });
      if (error || !data?.ok) {
        setTopicCoordinationMessage('Redaktionelle Koordination konnte nicht aktualisiert werden.');
        return;
      }
      setTopicCoordination(data.state);
      if (action==='take_lead') setTopicCoordinationMessage('Federführung übernommen.');
      if (action==='release_lead') setTopicCoordinationMessage('Federführung abgegeben.');
    } finally { setTopicCoordinationBusy(false); }
  }
  async function loadTopicContribution(id:string) {
    setTopicContribution(null);
    try {
      const {data,error}=await supabase.functions.invoke<TopicContributionData & {error?:string}>(
        'fib-topic-editor',{body:{action:'get_contribution',topicId:id}});
      if(error || !data || data.error) throw new Error(data?.error ?? 'Beitrag konnte nicht geladen werden.');
      setTopicContribution(data);
      setTopicBody(data.draft?.body ?? '');
      setTopicAssessment(data.draft?.editorial_assessment ?? '');
    } catch(e) {
      setTopicError(e instanceof Error ? e.message : 'Beitrag konnte nicht geladen werden.');
    }
  }
  async function contributionAction(action:string, extras:Record<string,unknown>) {
    if(topicBusy || !topicId) return;
    setTopicBusy(true);setTopicError('');
    try {
      const {data,error}=await supabase.functions.invoke<{ok?:boolean;error?:string}>(
        'fib-topic-editor',{body:{action,topicId,...extras}});
      if(error || !data?.ok) throw new Error(data?.error ?? 'Aktion fehlgeschlagen');
      await loadTopicContribution(topicId);
      await loadTopics();
    } catch(e) {
      setTopicError(e instanceof Error ? e.message : 'Aktion fehlgeschlagen');
      setTopicBusy(false);
    }
  }

  async function loadTopics() {
    setTopicBusy(true); setTopicError('');
    try {
      const {data,error} = await supabase.functions.invoke<TopicListData & {error?:string}>('fib-topic-editor',{body:{action:'list'}});
      if(error || !data || data.error) throw new Error(data?.error ?? 'Laden fehlgeschlagen');
      setTopicData(data);
      setTopicId(current => data.topics.some(t => t.id===current) ? current : data.topics[0]?.id ?? '');
      setProcessId(current => data.processes.some(p=>p.id===current) ? current : data.processes[0]?.id ?? '');
      setTopicReviews(current => {
        const next={...current};
        for(const p of data.proposals) if(['pending','deferred','rejected'].includes(p.status) && !next[p.id])
          next[p.id]={significance:p.suggested_significance,rationale:p.suggested_rationale,status:p.status};
        return next;
      });
    } catch(e) {setTopicError(e instanceof Error ? e.message : 'Themen konnten nicht geladen werden.');}
    finally {setTopicBusy(false);}
  }
  async function topicAction(action:string, body:Record<string,unknown>) {
    if(topicBusy) return;
    setTopicBusy(true);setTopicError('');
    try {
      const {data,error}=await supabase.functions.invoke<{ok?:boolean;error?:string;topic?:{id:string}}>('fib-topic-editor',{body:{action,...body}});
      if(error || !data?.ok) throw new Error(data?.error ?? 'Aktion fehlgeschlagen');
      await loadTopics();
      if(action==='create_topic') {setTopicCreateOpen(false);setTopicTitle('');setTopicQuestion('');setTopicDescription('');if(data.topic){setTopicId(data.topic.id);setTopicListOpen(false);setTopicStep(1);void loadTopicContribution(data.topic.id);}}
      if(action==='propose') {setTopicRationale('');setTopicStep(2);}
      if(action==='delete_topic') {setTopicListOpen(true);setTopicId('');setTopicContribution(null);}
    } catch(e) {setTopicError(e instanceof Error ? e.message : 'Aktion fehlgeschlagen');setTopicBusy(false);}
  }

  async function refreshAuthState() {
    const revision = ++authRevision.current;
    try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (revision !== authRevision.current) return;
    if (sessionError) throw sessionError;
    if (!sessionData.session) {
      activeUserId.current = null;
      setAuthenticatedUserId(null);
      setState('signed_out');
      setInvitationUserId(null);
      setInitialPassword('');
      setInitialPasswordConfirm('');
      setMembershipStatus('checking');
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

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (revision !== authRevision.current) return;
    if (userError || !userData.user || userData.user.id !== sessionData.session.user.id) throw new Error('invalid identity');
    if (activeUserId.current !== userData.user.id) {
      activeUserId.current = userData.user.id;
      setAuthenticatedUserId(userData.user.id);
      setSessionContext(null);
      setEventResult(null);
      setCoordination(null);
      setInitialPassword('');
      setInitialPasswordConfirm('');
      setNewPassword('');
      setConfirmPassword('');
    }
    if (invitationMode && !userData.user.invited_at) throw new Error('not an invited account');
    if (invitationMode) {
      setInvitationUserId(userData.user.id);
      setInvitationPasswordPending(!invitationPasswordDone(userData.user.id));
    }
    setAccountEmail(userData.user.email ?? '');
    const { data: aal, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (revision !== authRevision.current) return;
    if (aalError || !aal) throw new Error('MFA status unavailable');

    if (aal.currentLevel === 'aal2') {
      setState('aal2');
      setMessage('');
      return;
    }

    const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (revision !== authRevision.current) return;
    if (factorsError) throw factorsError;

    const verifiedTotp = factors?.totp.find((factor) => factor.status === 'verified');
    if (verifiedTotp) {
      setFactorId(verifiedTotp.id);
      setState('aal1_factor_available');
      setMessage('Bitte den Code aus der Authenticator-App eingeben.');
      return;
    }

    setState('aal1_no_factor');
    setMessage(invitationMode && !invitationPasswordDone(userData.user.id) ? '' : 'Für FIB muss zuerst TOTP-MFA eingerichtet werden.');
    } catch {
      if (revision !== authRevision.current) return;
      setState('auth_error');
      setSessionContext(null);
      setMessage('Der Kontozugang konnte nicht sicher geprüft werden. Bitte erneut versuchen oder neu anmelden.');
    }
  }

  useEffect(() => {
    if (authLinkError) return;
    window.history.replaceState({ ...(window.history.state ?? {}), fibView: 'dashboard' }, '', window.location.href);
    const onPopState = (event: PopStateEvent) => {
      const nextView = event.state?.fibView === 'findings' ? 'findings' : event.state?.fibView === 'sessions' ? 'sessions' : event.state?.fibView === 'event' ? 'event' : event.state?.fibView === 'events' ? 'events' : event.state?.fibView === 'profile' ? 'profile' : event.state?.fibView === 'users' ? 'users' : 'dashboard';
      if (!historyLeaveRef.current()) {
        window.history.pushState({ fibView: currentViewRef.current }, '', window.location.href);
        return;
      }
      setView(nextView);
      setNavigationOpen(false);
      if (nextView === 'dashboard') void loadEditorialStart();
      if (nextView === 'events') void loadEventList();
      if (nextView === 'users') void loadAdminUsers();
    };
    window.addEventListener('popstate', onPopState);

    void refreshAuthState();
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true);
      window.setTimeout(() => { void refreshAuthState(); }, 0);
    });
    return () => {
      window.removeEventListener('popstate', onPopState);
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (state === 'aal2' && !invitationPasswordPending && !eventResult && !serviceRunning) {
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
    if (view === 'event' && eventResult) void loadCoordinationState();
  }, [view, eventResult?.id]);

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
    if (mfaBusy.current) return;
    mfaBusy.current = true;
    try {
    setFactorId(null);
    setQrCode(null);
    setTotpSecret(null);
    setCode('');
    setMessage('MFA-Einrichtung wird vorbereitet …');

    const identity = await supabase.auth.getUser();
    if (identity.error || !identity.data.user) throw new Error('identity unavailable');
    const pendingKey = `fib-pending-totp-${identity.data.user.id}`;
    const pendingId = sessionStorage.getItem(pendingKey);
    if (pendingId) {
      const factors = await supabase.auth.mfa.listFactors();
      if (factors.error) throw factors.error;
      const pending = factors.data.all.find(factor => factor.id === pendingId);
      if (pending?.status === 'verified') { await refreshAuthState(); return; }
      if (pending?.status === 'unverified') {
        const removed = await supabase.auth.mfa.unenroll({ factorId: pendingId });
        if (removed.error) throw removed.error;
      }
      sessionStorage.removeItem(pendingKey);
    }
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: `FIB Redaktionszugang ${new Date().toISOString()}`,
    });

    if (error || !data.totp) {
      setMessage('TOTP konnte nicht eingerichtet werden.');
      return;
    }

    sessionStorage.setItem(pendingKey, data.id);
    setFactorId(data.id);
    setQrCode(data.totp.qr_code);
    setTotpSecret(data.totp.secret);
    setMessage('Authenticator einrichten: QR-Code scannen oder den Schlüssel manuell in Aegis eintragen.');
    } catch { setMessage('MFA-Einrichtung nicht erreichbar. Bitte erneut versuchen.'); }
    finally { mfaBusy.current = false; }
  }

  async function restartTotpEnrollment() {
    // Only the unverified factor created by this tab may be replaced.
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
    if (!factorId || !code.trim() || mfaBusy.current) return;
    mfaBusy.current = true;
    try {
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: code.trim(),
    });
    setCode('');

    if (error) {
      setMessage('Der MFA-Code konnte nicht bestätigt werden. Bitte einen aktuellen Code verwenden.');
      return;
    }

    if (activeUserId.current) sessionStorage.removeItem(`fib-pending-totp-${activeUserId.current}`);
    setFactorId(null);
    setQrCode(null);
    setTotpSecret(null);
    await refreshAuthState();
    } catch { setMessage('MFA konnte nicht geprüft werden. Bitte erneut versuchen.'); }
    finally { setCode(''); mfaBusy.current = false; }
  }

  useEffect(() => {
    if (view !== 'events') return;
    const timer = window.setTimeout(() => { void loadEventList(eventSearch); }, 300);
    return () => window.clearTimeout(timer);
  }, [view, eventSearch]);

  async function loadEventList(search = '') {
    const request = ++eventListRequestRef.current;
    setEventListBusy(true);
    setEventListError(null);
    const { data, error } = await supabase.functions.invoke<EventListResult>('fib-get-event', {
      body: { action: 'list_events', search },
    });
    if (request !== eventListRequestRef.current) return;
    setEventListBusy(false);
    if (error || !data?.ok) {
      let detail = 'Unbekannte Serverantwort';
      if (error && 'context' in error && error.context instanceof Response) {
        const response = error.context;
        let code = '';
        try { const body = await response.clone().json() as { error?: string }; code = body.error ?? ''; } catch { /* keine gültige JSON-Antwort */ }
        detail = `HTTP ${response.status}${code ? ` · ${code}` : ''}`;
      } else if (error) {
        detail = error.name === 'FunctionsFetchError' ? 'Verbindung zum Ereignisdienst fehlgeschlagen' : 'Aufruf des Ereignisdienstes fehlgeschlagen';
      } else if (data && 'error' in data) {
        detail = String(data.error);
      }
      setEventListError(`Ereignisse konnten nicht geladen werden (${detail}).`);
      return;
    }
    setEventList(data.events);
    setEventListHasMore(data.hasMore);
  }

  async function openListedEvent(eventId: string) {
    setServiceRunning(true);
    setServiceError(null);
    const { data, error } = await supabase.functions.invoke<EventResult>('fib-get-event', {
      body: { eventId },
    });
    setServiceRunning(false);
    if (error || !data?.ok) {
      setEventListError('Dieses Ereignis konnte nicht geöffnet werden.');
      return;
    }
    setEventResult(data.event);
    setEventSources(data.sources ?? []);
    setCoordination(null);
    setCoordinationMessage(null);
    setEditingEvent(false);
    navigateTo('event');
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
      body: { action: 'get_state', objectType: 'event', objectId: eventResult?.id ?? LIVE_TEST_EVENT_ID },
    });
    if (!error && data?.ok) setCoordination(data.state);
  }

  async function loadSessionContext() {
    // Invitation onboarding must never call any FIB service before first-password completion.
    if (invitationMode && invitationPasswordPending) return false;
    setMembershipStatus('checking');
    setSessionContext(null);
    const { data, error } = await supabase.functions.invoke<SessionContextResult>('fib-session-context', {
      body: {},
    });
    if (error || !data?.ok) {
      const response = error && 'context' in error && error.context instanceof Response ? error.context : null;
      const details = response ? await response.clone().json().catch(() => null) as {error?: string} | null : null;
      setMembershipStatus(details?.error === 'fib_membership_missing_or_inactive' ? 'pending' : 'error');
      return false;
    }
    setSessionContext(data.user);
    setProfileCallName(data.user.displayName === data.user.fullName ? '' : data.user.displayName);
    setMembershipStatus('active');
    return true;
  }

  async function loadEditorialStart() {
    if (invitationMode && invitationPasswordPending) return;
    if (await loadSessionContext()) await Promise.all([loadEvent(), loadCoordinationState()]);
  }

  async function runU4Pilot(commit:boolean) {
    if(sessionContext?.role!=='admin' || state!=='aal2' || u4Busy)return;
    if(commit && !window.confirm('Testdaten der Gemeinde-Nachrichten in Shared-Apps speichern?'))return;
    setU4Busy(true);setU4Error(null);setU4Result(null);
    try {
      const {data,error}=await supabase.functions.invoke<Record<string,unknown>>('fib-u4-pilot',{body:{commit}});
      if(error || !data || data.error) {
        setU4Error(String(data?.error ?? error?.message ?? 'Abruf fehlgeschlagen'));return;
      }
      setU4Result(data);
    }catch(err){setU4Error(err instanceof Error?err.message:'Verbindungsfehler');}
    finally{setU4Busy(false)}
  }

  async function runRisPilot(commit:boolean,cadence:'daily'|'weekly'='daily') {
    if(sessionContext?.role!=='admin' || state!=='aal2' || u4Busy)return;
    if(commit && !window.confirm('RIS-Testdaten speichern und offenen historischen Rückblick fortsetzen?'))return;
    setU4Busy(true);setU4Error(null);setU4Result(null);
    try {
      const {data,error}=await supabase.functions.invoke<Record<string,unknown>>('fib-u4-ris-pilot',{body:{commit,cadence}});
      if(error || !data || data.error) {setU4Error(String(data?.detail ?? data?.error ?? error?.message ?? 'RIS-Abruf fehlgeschlagen'));return;}
      setU4Result({...data,ris:true});
    }catch(err){setU4Error(err instanceof Error?err.message:'Verbindungsfehler');}
    finally{setU4Busy(false)}
  }

  async function runRisCombinedAcceptance() {
    if(sessionContext?.role!=='admin'||state!=='aal2'||u4Busy)return;
    if(!window.confirm('Beide RIS-Prüfpläne (30 und 120 Tage) vollständig testen? Höchstens 8 kontrollierte Teilaufrufe, keine Zeitsteuerung.'))return;
    setU4Busy(true);setU4Error(null);setU4Result(null);
    try {
      for(const cadence of ['daily','weekly'] as const) {
        let complete=false;
        for(let part=0;part<4;part++) {
          const {data,error}=await supabase.functions.invoke<Record<string,unknown>>('fib-u4-ris-pilot',{body:{commit:true,cadence}});
          if(error||!data||data.error){setU4Error('RIS '+cadence+' · Paket '+(part+1)+': '+String(data?.detail??data?.error??error?.message??'Abruf fehlgeschlagen'));return;}
          setU4Result({...data,ris:true});
          if(Number(data.failures??0)>0){setU4Error('RIS '+cadence+': Abruffehler; Prüfstand wurde zur Wiederaufnahme gespeichert.');return;}
          if(data.complete===true){complete=true;break;}
        }
        if(!complete){setU4Error('RIS '+cadence+': maximale Paketanzahl erreicht; der Prüfstand ist gespeichert.');return;}
      }
    }catch(err){setU4Error(err instanceof Error?err.message:'Verbindungsfehler');}
    finally{setU4Busy(false)}
  }

  async function runRisPdfBackfill() {
    if(sessionContext?.role!=='admin' || state!=='aal2' || u4Busy)return;
    if(!window.confirm('Bis zu 16 kleine Pakete zur nachträglichen RIS-PDF-Inhaltsprüfung starten? Keine automatische Dauerüberwachung.'))return;
    setU4Busy(true);setU4Error(null);setU4Result(null);
    try {
      for(let batch=0;batch<16;batch++) {
        const {data,error}=await supabase.functions.invoke<Record<string,unknown>>('fib-u4-ris-pilot',{body:{commit:true,pdfBackfill:true}});
        if(error||!data||data.error){setU4Error('PDF-Paket '+(batch+1)+': '+String(data?.detail??data?.error??error?.message??'Abruf fehlgeschlagen'));return;}
        setU4Result({...data,ris:true});
        if(data.backfillRemaining===0)return;
      }
    }catch(err){setU4Error(err instanceof Error?err.message:'Verbindungsfehler');}
    finally{setU4Busy(false)}
  }

  async function loadAdminUsers() {
    if (sessionContext?.role !== 'admin') return;
    setAdminUsersLoading(true);
    setAdminInviteMessage(null);
    const { data, error } = await supabase.functions.invoke<AdminUsersResult>('fib-admin-users', {
      body: { action: 'list' },
    });
    setAdminUsersLoading(false);
    if (error || !data?.ok || !('users' in data)) {
      setAdminInviteMessage('Die Benutzerverwaltung konnte nicht geladen werden.');
      return;
    }
    setAdminUsers(data.users);
  }

  async function inviteAdminUser(event: FormEvent) {
    event.preventDefault();
    if (sessionContext?.role !== 'admin' || adminInviteBusy) return;
    setAdminInviteBusy(true);
    setAdminInviteMessage('Einladung wird vorbereitet …');
    const { data, error } = await supabase.functions.invoke<AdminUsersResult>('fib-admin-users', {
      body: { action: 'invite', fullName: adminInviteName, email: adminInviteEmail, role: adminInviteRole },
    });
    setAdminInviteBusy(false);
    if (error || !data?.ok || !('mode' in data)) {
      const response = error && 'context' in error && error.context instanceof Response ? error.context : null;
      const details = response ? await response.clone().json().catch(() => null) as {error?: string} | null : null;
      setAdminInviteMessage(details?.error === 'fib_user_already_exists'
        ? 'Für diese Person besteht bereits ein FIB-Zugang oder eine offene Vorautorisierung.'
        : 'Die Einladung konnte nicht sicher angelegt werden.');
      return;
    }
    setAdminInviteName('');
    setAdminInviteEmail('');
    setAdminInviteRole('editor');
    setAdminInviteMessage(data.mode === 'new_account'
      ? 'Einladung versendet. Die Rolle ist vorautorisiert; Zugriff entsteht erst nach Passwort und MFA.'
      : (data.message ?? 'Vorhandenes Shared-Apps-Konto wurde für FIB vorautorisiert.'));
    await loadAdminUsers();
  }

  async function repeatAdminInvitation(userId: string) {
    if (sessionContext?.role !== 'admin' || adminInviteBusy) return;
    setAdminInviteBusy(true);
    setAdminInviteMessage('Einladung wird erneut versendet …');
    const { data, error } = await supabase.functions.invoke<AdminUsersResult>('fib-admin-users', {
      body: { action: 'repeat', userId },
    });
    setAdminInviteBusy(false);
    if (error || !data?.ok) {
      setAdminInviteMessage('Die Einladung konnte nicht erneut versendet werden. Bereits bestätigte Konten verwenden ihre bestehende Anmeldung.');
      return;
    }
    setAdminInviteMessage('Einladung erneut versendet.');
    await loadAdminUsers();
  }

  async function revokeAdminInvitation(userId: string) {
    if (sessionContext?.role !== 'admin' || adminInviteBusy) return;
    if (!window.confirm('Offene FIB-Einladung wirklich zurücknehmen? Das gemeinsame Auth-Konto wird nicht gelöscht.')) return;
    setAdminInviteBusy(true);
    const { data, error } = await supabase.functions.invoke<AdminUsersResult>('fib-admin-users', {
      body: { action: 'revoke', userId },
    });
    setAdminInviteBusy(false);
    if (error || !data?.ok) {
      setAdminInviteMessage('Die Einladung konnte nicht zurückgenommen werden.');
      return;
    }
    setAdminInviteMessage('FIB-Einladung zurückgenommen. Das gemeinsame Auth-Konto blieb unverändert.');
    await loadAdminUsers();
  }

  async function runCoordinationAction(action: 'get_state' | 'take_lead' | 'release_lead' | 'acquire_lock' | 'renew_lock' | 'release_lock', quiet = false) {
    if (!quiet) setCoordinationRunning(true);
    if (!quiet) setCoordinationMessage(null);

    const { data, error } = await supabase.functions.invoke<CoordinationResult>('fib-coordination', {
      body: { action, objectType: 'event', objectId: eventResult?.id ?? LIVE_TEST_EVENT_ID },
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

  useEffect(() => {
    if (!sourcePickerOpen) return;
    const timer = window.setTimeout(() => { void searchAvailableFindings(sourceSearch); }, 300);
    return () => window.clearTimeout(timer);
  }, [sourcePickerOpen, sourceSearch]);

  async function searchAvailableFindings(search = '') {
    const request = ++sourceRequestRef.current;
    setSourceBusy(true);
    setSourceMessage(null);
    const { data, error } = await supabase.functions.invoke<FindingListResult>('fib-get-event', {
      body: { action: 'list_findings', search, eventId: eventResult?.id },
    });
    if (request !== sourceRequestRef.current) return;
    setSourceBusy(false);
    if (error || !data?.ok) {
      setSourceMessage('Fundstellen konnten nicht geladen werden.');
      return;
    }
    setSourceMatches(data.findings);
    if (data.hasMore) setSourceMessage('Maximal 100 Fundstellen. Suche bitte eingrenzen.');
  }

  function startFindingMetadataEdit(source: EventSource) {
    setEditingSourceId(source.findingId);
    setSourceRoleDraft(source.evidenceRole ?? 'editorial_reference');
    setSourceNoteDraft(source.justification ?? '');
    setSourceMessage(null);
  }

  async function saveFindingMetadata(findingId: string) {
    if (!eventResult || sourceBusy) return;
    setSourceBusy(true);
    setSourceMessage(null);
    const acquiredForThisAction = !coordination?.lock?.mine;
    try {
      if (acquiredForThisAction && !await runCoordinationAction('acquire_lock', true)) {
        setSourceMessage('Bearbeitungssperre konnte nicht übernommen werden.');
        return;
      }
      const { data, error } = await supabase.functions.invoke<{ok?: boolean; error?: string}>('fib-editorial-write', {
        body: {action: 'update_finding_justification', eventId: eventResult.id, findingId, justification: sourceNoteDraft.trim() || null},
      });
      if (error || !data?.ok) {
        setSourceMessage('Änderung nicht gespeichert (' + (data?.error ?? 'server_error') + ').');
        return;
      }
      const { data: updated, error: refreshError } = await supabase.functions.invoke<EventResult>('fib-get-event', {
        body: {eventId: eventResult.id},
      });
      if (refreshError || !updated?.ok) {
        setSourceMessage('Änderung gespeichert, aber Daten konnten nicht neu geladen werden. Bitte Ereignis aktualisieren.');
      } else {
        setEventSources(updated.sources ?? []);
        setSourceMessage('Begründung der Zuordnung gespeichert.');
      }
      setEditingSourceId(null);
    } finally {
      if (acquiredForThisAction) await runCoordinationAction('release_lock', true);
      setSourceBusy(false);
      await loadCoordinationState();
    }
  }

  async function unlinkFinding(findingId: string) {
    if (!eventResult || !window.confirm('Zuordnung dieser Fundstelle zum Ereignis aufheben? Die Fundstelle bleibt im System erhalten.')) return;
    setSourceBusy(true);
    setSourceMessage(null);
    const acquiredForThisAction = !coordination?.lock?.mine;
    if (acquiredForThisAction) {
      const allowed = await runCoordinationAction('acquire_lock', true);
      if (!allowed) {
        setSourceBusy(false);
        setSourceMessage('Das Ereignis ist gesperrt. Bitte den Koordinationsstatus prüfen.');
        return;
      }
    }
    try {
      const { data, error } = await supabase.functions.invoke<{ok?: boolean; error?: string}>('fib-editorial-write', {
        body: { action: 'unlink_finding', eventId: eventResult.id, findingId },
      });
      if (error || !data?.ok) {
        setSourceMessage('Die Zuordnung konnte nicht aufgehoben werden.');
        return;
      }
      const { data: updated, error: readError } = await supabase.functions.invoke<EventResult>('fib-get-event', {
        body: { eventId: eventResult.id },
      });
      if (!readError && updated?.ok) setEventSources(updated.sources ?? []);
      setSourceMessage('Zuordnung aufgehoben und protokolliert.');
    } finally {
      if (acquiredForThisAction) await runCoordinationAction('release_lock', true);
      setSourceBusy(false);
      await loadCoordinationState();
    }
  }

  async function linkFinding(findingId: string) {
    if (!eventResult || sourceBusy) return;
    const selected = sourceMatches.find(item => item.findingId === findingId);
    const justification = (linkJustificationDrafts[findingId] ?? selected?.previousJustification ?? '').trim();
    if (!justification) { setSourceMessage('Bitte zuerst die Begründung der Zuordnung eingeben.'); return; }
    setSourceBusy(true);
    setSourceMessage(null);
    const acquiredForThisAction = !coordination?.lock?.mine;
    try {
      if (acquiredForThisAction) {
        const allowed = await runCoordinationAction('acquire_lock', true);
        if (!allowed) {
          setSourceMessage('Keine Zuordnung möglich: Bearbeitungssperre konnte nicht übernommen werden.');
          return;
        }
      }
      const { data, error } = await supabase.functions.invoke<{ok?: boolean; error?: string}>('fib-editorial-write', {
        body: { action: 'link_finding', eventId: eventResult.id, findingId, justification },
      });
      if (error || !data?.ok) {
        const code = data?.error ?? 'server_error';
        setSourceMessage(`Zuordnung fehlgeschlagen (${code}). Bitte den Koordinationsstatus prüfen.`);
        return;
      }
      // Erfolg der Schreiboperation unmittelbar darstellen; anschließend mit Datenbankstand abgleichen.
      if (selected) setEventSources(current => current.some(item => item.findingId === findingId) ? current : [...current, selected]);
      const { data: updated, error: refreshError } = await supabase.functions.invoke<EventResult>('fib-get-event', {
        body: { eventId: eventResult.id },
      });
      if (!refreshError && updated?.ok) {
        setEventSources(updated.sources ?? []);
        setSourceMessage('Fundstelle mit Begründung zugeordnet.');
      } else {
        setSourceMessage('Fundstelle gespeichert; der Abgleich mit der Datenbank ist noch nicht gelungen. Bitte Ereignis neu öffnen.');
      }
    } finally {
      if (acquiredForThisAction) await runCoordinationAction('release_lock', true);
      setSourceBusy(false);
      await loadCoordinationState();
    }
  }

  async function startEventEditing() {
    if (!eventResult) return;
    const acquired = await runCoordinationAction('acquire_lock');
    if (!acquired) return;
    setEditTitle(eventResult.title);
    setEditSummary(readableSummary(eventResult.summary) ?? '');
    setEditOccurredAt(eventResult.occurredAt ? eventResult.occurredAt.slice(0, 10) : '');
    setEditMessage(null);
    setEditFailed(false);
    setEditSaved(false);
    setEditingEvent(true);
  }

  async function cancelEventEditing() {
    if (!confirmLeave()) return;
    setEditingEvent(false);
    setEditMessage(null);
    if (coordination?.lock?.mine) await runCoordinationAction('release_lock');
  }

  async function saveEventEdit(event: FormEvent) {
    event.preventDefault();
    if (!eventResult || !editTitle.trim() || !eventDirty) return;

    setEditSaving(true);
    setEditFailed(false);
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
      setEditFailed(true);
      setEditMessage(error?.message || 'Änderungen konnten nicht gespeichert werden.');
      return;
    }

    setEventResult(data.event);
    setEditingEvent(false);
    setEditSaved(true);
    setEditMessage(null);
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

  async function setInvitationPassword(event: FormEvent) {
    event.preventDefault();
    if (!invitationMode || !invitationUserId || invitationBusy.current) return;
    if (initialPassword.length < 12 || initialPassword !== initialPasswordConfirm) {
      setMessage('Bitte mindestens 12 Zeichen eingeben und das Passwort identisch wiederholen.');
      return;
    }
    invitationBusy.current = true;
    setInvitationSaving(true);
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || data.user?.id !== invitationUserId || !data.user.invited_at) throw new Error('identity changed');
      // Auth itself enforces AAL2 if this account already has a verified factor.
      const result = await supabase.auth.updateUser({ password: initialPassword });
      if (result.error) {
        setMessage('Passwort konnte nicht festgelegt werden. Bitte die Passwortregeln prüfen; bei abgelaufener Sitzung einen neuen Link anfordern.');
        return;
      }
      rememberInvitationPassword(invitationUserId);
      setInvitationPasswordPending(false);
      await refreshAuthState();
    } catch {
      setMessage('Die Passwortfestlegung konnte nicht sicher abgeschlossen werden. Bitte erneut versuchen.');
    } finally {
      setInitialPassword('');
      setInitialPasswordConfirm('');
      setInvitationSaving(false);
      invitationBusy.current = false;
    }
  }

  async function logout() {
    if (!confirmLeave()) return;
    ++authRevision.current;
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) { setMessage('Abmelden fehlgeschlagen. Bitte erneut versuchen.'); return; }
    if (invitationMode) sessionStorage.removeItem('fib-invitation-password-user');
    setInitialPassword('');
    setInitialPasswordConfirm('');
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

  if (authLinkError) {
    return <main className="auth-shell"><section className="auth-card"><h1>Link nicht verwendbar</h1><p>Dieser Link ist ungültig oder abgelaufen. Bitte fordere einen neuen Einladungslink an.</p><a href={window.location.pathname}>Zur Anmeldung</a></section></main>;
  }

  const showInvitationPassword = invitationMode && invitationPasswordPending && invitationUserId && (state === 'aal1_no_factor' || state === 'aal2');
  if (showInvitationPassword) {
    return <main className="auth-shell"><section className="auth-card">
      <p className="eyebrow">Feldkirchen im Blick · Einladung</p>
      <h1>Passwort festlegen</h1>
      <p>Deine Einladung gilt für <strong>{accountEmail}</strong>.</p>
      <p>Lege zuerst dein Passwort fest. Danach richtest du deinen Authenticator ein. Die Freischaltung als FIB-Redakteur erfolgt getrennt durch einen Administrator.</p>
      <form className="stack" onSubmit={setInvitationPassword}>
        <PasswordField label="Erstes Passwort" autoComplete="new-password" minLength={12} value={initialPassword} onChange={e => setInitialPassword(e.target.value)} required disabled={invitationSaving} />
        <PasswordField label="Erstes Passwort wiederholen" autoComplete="new-password" minLength={12} value={initialPasswordConfirm} onChange={e => setInitialPasswordConfirm(e.target.value)} required disabled={invitationSaving} />
        <button className="primary" disabled={invitationSaving}>{invitationSaving ? 'Wird gespeichert …' : 'Passwort festlegen'}</button>
      </form>
      <p role="status">{message}</p>
      <button onClick={logout} disabled={invitationSaving}>Abmelden</button>
    </section></main>;
  }

  if (state === 'aal2' && membershipStatus !== 'active') {
    return <main className="auth-shell"><section className="auth-card">
      <p className="eyebrow">Feldkirchen im Blick</p>
      <h1>{membershipStatus === 'pending' ? 'Freischaltung ausstehend' : membershipStatus === 'error' ? 'Freischaltung nicht prüfbar' : 'Freischaltung wird geprüft'}</h1>
      <p>Angemeldet als <strong>{accountEmail}</strong>. Dein zweiter Faktor ist bestätigt. Das FIB-Redaktionssystem ist erst nach gesonderter Freischaltung zugänglich.</p>
      {passwordRecovery && <form className="stack" onSubmit={updatePassword}><p>Lege jetzt ein neues Passwort fest.</p><PasswordField label="Neues Passwort" autoComplete="new-password" minLength={12} value={newPassword} onChange={e=>setNewPassword(e.target.value)} required /><PasswordField label="Neues Passwort wiederholen" autoComplete="new-password" minLength={12} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required /><button disabled={securitySaving}>Passwort ändern</button></form>}
      {securityMessage && <p role="status">{securityMessage}</p>}
      {membershipStatus === 'pending' && <p>Bitte wende dich an einen FIB-Administrator. Die Einrichtung deines Kontos allein verleiht keine Redaktionsrechte.</p>}
      {membershipStatus === 'error' && <p>Deine Berechtigung konnte nicht sicher überprüft werden. Bis zur erfolgreichen Prüfung bleibt der Zugang gesperrt.</p>}
      <button type="button" disabled={membershipStatus === 'checking'} onClick={() => void loadEditorialStart()}>Freischaltung erneut prüfen</button>
      <button type="button" onClick={logout}>Abmelden</button>
    </section></main>;
  }

  if (state !== 'aal2') {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <p className="eyebrow">Feldkirchen im Blick</p>
          <h1>Redaktionssystem</h1>

          {(state === 'aal1_no_factor' || state === 'aal1_factor_available') && <p>Angemeldet als <strong>{accountEmail}</strong>.</p>}
          {state === 'checking' && <p>Kontozugang wird geprüft …</p>}
          {state === 'auth_error' && <button onClick={() => void refreshAuthState()}>Erneut prüfen</button>}
          {state === 'signed_out' && invitationMode && <p>Die Einladung ist ungültig, abgelaufen oder bereits verwendet. Bitte fordere bei deinem Administrator einen neuen Link an.</p>}
          {state === 'signed_out' && !invitationMode && (
            <form onSubmit={login} className="stack">
              <label>E-Mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
              <PasswordField label="Passwort" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" className="primary">Anmelden</button>
              <button type="button" disabled={recoverySending} onClick={() => void requestPasswordRecovery()}>{recoverySending ? "Anfrage wird verarbeitet …" : "Passwort vergessen?"}</button>
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
                <form className="stack" onSubmit={(event) => { event.preventDefault(); void verifyTotp(); }}>
                  <label>Code aus der Authenticator-App
                    <input autoFocus inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} />
                  </label>
                  <button type="submit" className="primary" disabled={!code.trim()}>Bestätigen</button>
                </form>
              )}
            </div>
          )}

          {state === 'aal1_factor_available' && (
            <form className="stack" onSubmit={(event) => { event.preventDefault(); void verifyTotp(); }}>
              <p>Bitte den aktuellen Code aus deiner Authenticator-App eingeben.</p>
              <input autoFocus aria-label="MFA-Code" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} />
              <button type="submit" className="primary" disabled={!code.trim()}>MFA bestätigen</button>
            </form>
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
          <button type="button" className="mobile-nav-close" aria-label="Navigationsmenü schließen" onClick={() => setNavigationOpen(false)}>✕ <span>Schließen</span></button>
          <div className="nav-section">
            <button className={view === 'dashboard' ? 'nav-item active' : 'nav-item'} onClick={() => navigateTo('dashboard')}><NavIcon src={dashboardIcon} />Dashboard</button>
            <button className="nav-item" disabled><NavIcon src={workbasketIcon} />Arbeitskorb <span>folgt</span></button>
          </div>

          <div className="nav-section">
            <p className="nav-heading">Inhalte</p>
            <button className="nav-item" disabled><NavIcon src={reportIcon} />Meldungen <span>folgt</span></button>
            <button className="nav-item" disabled><NavIcon src={processIcon} />Vorgänge <span>folgt</span></button>
            <button className={view === "topics" ? "nav-item active" : "nav-item"} aria-current={view === "topics" ? "page" : undefined} onClick={() => navigateTo("topics")}><NavIcon src={topicIcon} />Themen</button>
            <button className={view==='sessions'?'nav-item active':'nav-item'} onClick={()=>navigateTo('sessions')}><NavIcon src={sessionIcon} />Sitzungen</button>
          </div>

          <div className="nav-section">
            <p className="nav-heading">Redaktion</p>
            <details id="nav-recherche">
              <summary>Recherche</summary>
              <button className="nav-subitem" disabled>Rechercheaufträge</button>
              <button className={view==='findings'?'nav-subitem active':'nav-subitem'} onClick={()=>{setSourceFindingId(null);navigateTo('findings');}}>Fundstellen</button>
              <button className={view === 'events' || view === 'event' ? 'nav-subitem active' : 'nav-subitem'} aria-current={view === 'events' || view === 'event' ? 'page' : undefined} onClick={() => navigateTo('events')}>Ereignisse</button>
              <button className="nav-subitem" disabled>Quellen</button>
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
              <button className={view === 'u4pilot' ? 'nav-item active' : 'nav-item'} aria-current={view === 'u4pilot' ? 'page' : undefined} onClick={() => navigateTo('u4pilot')}>Tasks & Läufe</button>
              <button className="nav-item" disabled>KI & Kosten</button>
              <button className="nav-item" disabled>Referenzsystem</button>
              <button className={view === 'users' ? 'nav-item active' : 'nav-item'} aria-current={view === 'users' ? 'page' : undefined} onClick={() => navigateTo('users')}>Benutzer & Rollen</button>
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
        {(view==='findings'||view==='sessions')&&<SourceWorkspace mode={view} initialFindingId={sourceFindingId} onHome={()=>navigateTo('dashboard')} onOpenEvent={id=>void openListedEvent(id)} registerLeaveGuard={guard=>{sourceLeaveRef.current=guard;}}/>}
        {view === 'topics' && (
          <section className="panel card-headed fib-topic-screen">
            {topicError && <p className="error" role="alert">{topicError}</p>}
            {topicListOpen ? <>
              <div className="topic-list-heading">
                <div><p className="eyebrow">Redaktion · Themen</p><h1 className="object-title"><img className="object-icon" src={topicIcon} alt="" />Themen</h1></div>
                <div className="topic-header-actions"><button type="button" className="icon-button" aria-label="Themenliste aktualisieren" title="Aktualisieren" disabled={topicBusy} onClick={()=>void loadTopics()}>↻</button><button type="button" onClick={()=>setTopicCreateOpen(v=>!v)}>{topicCreateOpen?'Schließen':'Neues Thema'}</button></div>
              </div>
              <p>Themen auswählen und bearbeiten. Bestehende Vorgänge und Ereignisse werden durch lokale Bezüge eingebunden.</p>
              {topicCreateOpen && <form className="topic-definition-form" onSubmit={e=>{e.preventDefault();void topicAction('create_topic',{title:'[ENTWICKLUNG #136] '+topicTitle.trim(),guidingQuestion:topicQuestion,description:topicDescription});}}>
                <h2>Neues Entwicklungsthema</h2>
                <label>Titel<input required maxLength={170} value={topicTitle} onChange={e=>setTopicTitle(e.target.value)}/></label>
                <label>Leitfrage<input required maxLength={1000} value={topicQuestion} onChange={e=>setTopicQuestion(e.target.value)}/></label>
                <label>Beschreibung<textarea maxLength={5000} value={topicDescription} onChange={e=>setTopicDescription(e.target.value)}/></label>
                <button type="submit" disabled={topicBusy || !topicTitle.trim() || !topicQuestion.trim()}>Thema anlegen</button>
              </form>}
              <div className="topic-list-filters">
                <label>Themen suchen<input type="search" value={topicSearch} onChange={e=>setTopicSearch(e.target.value)} placeholder="Titel oder Leitfrage"/></label>
                <label>Status<select value={topicFilter} onChange={e=>setTopicFilter(e.target.value)}>
                  <option value="all">Alle</option><option value="draft">Entwurf</option><option value="active">Aktiv</option><option value="deferred">Zurückgestellt</option><option value="archived">Archiviert</option>
                </select></label>
              </div>
              <div className="topic-list-results">
                {topicData?.topics.filter(t=>(topicFilter==='all'||t.status===topicFilter||(topicFilter==='deferred'&&t.status==='dormant'))&&
                  (t.title+' '+(t.guiding_question??'')).toLocaleLowerCase('de-DE').includes(topicSearch.trim().toLocaleLowerCase('de-DE'))).map(t=>(
                    <article className="work-item" key={t.id}>
                      <div><h2>{t.title}</h2><p>{t.guiding_question}</p>
                        <p className="meta">Status: {t.status==='draft'?'Entwurf':t.status==='active'?'Aktiv':t.status==='deferred'||t.status==='dormant'?'Zurückgestellt':'Archiviert'}</p>
                      </div>
                      <button type="button" className="icon-button" aria-label={`Thema ${t.title} bearbeiten`} title="Thema bearbeiten" onClick={()=>showTopic(t)}>✎</button>
                    </article>
                  ))}
                {!topicBusy && !topicData?.topics.some(t=>(topicFilter==='all'||t.status===topicFilter||(topicFilter==='deferred'&&t.status==='dormant'))&&
                  (t.title+' '+(t.guiding_question??'')).toLocaleLowerCase('de-DE').includes(topicSearch.trim().toLocaleLowerCase('de-DE'))) && <p>Keine passenden Themen gefunden.</p>}
              </div>
               
            </> : <>
              <nav className="breadcrumbs" aria-label="Brotkrumen"><button type="button" onClick={()=>setTopicListOpen(true)}>‹ Zurück</button><span>›</span><span aria-current="page">{topicData?.topics.find(t=>t.id===topicId)?.title ?? 'Thema'}</span></nav>
              <p className="eyebrow">Redaktion · Themenbearbeitung</p>
              <h1 className="object-title"><img className="object-icon" src={topicIcon} alt="" />{(topicData?.topics.find(t=>t.id===topicId)?.title ?? 'Thema').replace(/^\[ENTWICKLUNG[^\]]*\]\s*/, '')}</h1>
              <nav className="topic-editor-tabs" aria-label="Bereiche der Themenbearbeitung">
                {(['Themadefinition','Lokale Bezüge','Beitrag'] as const).map((label,i)=>(
                  <button type="button" key={label} className={topicStep===i+1?'selected':''} aria-current={topicStep===i+1?'page':undefined} onClick={()=>setTopicStep((i+1) as 1|2|3)}>{label}</button>
                ))}
              </nav>
              <div className="topic-detail-grid">
                <div className="topic-detail-main">
              {topicStep===1 && <section className="topic-editor-area topic-area-card">
                <div className="topic-area-card-header">
                  <h2>Themadefinition</h2>
                  <div className="topic-area-card-actions">
                    <span className="topic-status-text">Status: {topicData?.topics.find(t=>t.id===topicId)?.status==='draft'?'Entwurf':topicData?.topics.find(t=>t.id===topicId)?.status==='active'?'Aktiv':topicData?.topics.find(t=>t.id===topicId)?.status==='archived'?'Archiviert':'Zurückgestellt'}</span>
                    <button type="button" className="icon-button" aria-label="Themadefinition aktualisieren" title="Aktualisieren" disabled={topicBusy} onClick={()=>void loadTopics()}>↻</button>
                  </div>
                </div>
                <p className="meta">Änderungen an der Themadefinition werden intern versioniert.</p>
                <form className="topic-definition-form" onSubmit={e=>{e.preventDefault();void topicAction('update_topic',{topicId,title:topicEditTitle,guidingQuestion:topicEditQuestion,description:topicEditDescription});}}>
                  <label>Titel<input required maxLength={200} value={topicEditTitle} onChange={e=>setTopicEditTitle(e.target.value)}/></label>
                  <label>Leitfrage<input required maxLength={1000} value={topicEditQuestion} onChange={e=>setTopicEditQuestion(e.target.value)}/></label>
                  <label>Erläuterung<textarea maxLength={5000} value={topicEditDescription} onChange={e=>setTopicEditDescription(e.target.value)}/></label>
                  <button type="submit" disabled={topicBusy || !topicEditTitle.trim() || !topicEditQuestion.trim()}>Themadefinition speichern</button>
                </form>
                <p className="meta">Redaktionelle Koordination: Die bestehende Federführung wird in einem weiteren Arbeitspaket hier eingebunden.</p>
                {topicContribution && topicContribution.versions.every(v=>!v.published_at && !!v.revoked_at) && <div className="topic-delete-area">
                  <button type="button" disabled={topicBusy} onClick={()=>{
                    if(window.confirm('Dieses noch nie veröffentlichte Thema wirklich löschen? Es verschwindet aus der Themenliste. Die Prüfprotokolle bleiben intern erhalten.'))
                      void topicAction('delete_topic',{topicId,confirmation:true});
                  }}>Thema löschen</button>
                </div>}
              </section>}
              {topicStep===2 && <section className="topic-editor-area topic-area-card">
                <div className="topic-area-card-header"><h2>Lokale Bezüge</h2><button type="button" className="icon-button" aria-label="Lokale Bezüge aktualisieren" title="Aktualisieren" disabled={topicBusy} onClick={()=>void loadTopics()}>↻</button></div>
                <p>Vorgänge und ergänzende Einzelereignisse, die für dieses Thema Bedeutung besitzen. Eine Zuordnung wird erst nach redaktioneller Bestätigung wirksam.</p>
                <p className="meta">Die direkte Suche nach ergänzenden Einzelereignissen folgt in einem weiteren Arbeitspaket.</p>
            <details className="topic-add-link">
              <summary>Bezug hinzufügen</summary>
              <p className="meta">Neuen Vorgang zur redaktionellen Prüfung vorschlagen. Einzelereignisse folgen mit der Fachfunktion.</p>
              <form onSubmit={e=>{e.preventDefault();void topicAction('propose',{topicId,processId:selectableProcessId,significance:topicSignificance,rationale:topicRationale,origin:'editor'});}}>
  
              <div className="topic-process-choice"><span>Vorgang</span><p>{availableTopicProcesses.find(p=>p.id===selectableProcessId)?.title ?? 'Noch kein Vorgang ausgewählt'}</p><button type="button" disabled={!availableTopicProcesses.length} onClick={()=>{setProcessQuery('');setProcessPickerOpen(true);}}>Vorgang suchen und auswählen</button></div>
              {!availableTopicProcesses.length && <p>Alle vorhandenen Vorgänge sind bereits zugeordnet oder werden geprüft.</p>}
              {processPickerOpen && <div className="topic-picker-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setProcessPickerOpen(false);}}>
                <section className="topic-picker-dialog" role="dialog" aria-modal="true" aria-label="Vorgang auswählen">
                  <div className="topic-picker-heading"><h3>Vorgang auswählen</h3><button type="button" onClick={()=>setProcessPickerOpen(false)}>Schließen</button></div>
                  <label>Nach Vorgang suchen<input autoFocus type="search" value={processQuery} onChange={e=>setProcessQuery(e.target.value)} placeholder="Titel oder Stichwort" /></label>
                  <p className="meta">{filteredTopicProcesses.length} Treffer{filteredTopicProcesses.length===100?' (maximal 100 angezeigt)':''}</p>
                  <div className="topic-picker-results">{filteredTopicProcesses.map(p=><button type="button" key={p.id} onClick={()=>{setProcessId(p.id);setProcessPickerOpen(false);}}>{p.title}</button>)}
                  {filteredTopicProcesses.length===0 && <p>Kein passender Vorgang gefunden.</p>}</div>
                </section>
              </div>}
              <label>Vorgeschlagene Bedeutung<select value={topicSignificance} onChange={e=>setTopicSignificance(e.target.value)}><option value="defining">Prägend</option><option value="relevant">Relevant</option><option value="supplementary">Ergänzend</option></select></label>
              <label>Begründung<textarea required maxLength={4000} value={topicRationale} onChange={e=>setTopicRationale(e.target.value)}/></label>
              <button type="submit" disabled={topicBusy || !topicId || !selectableProcessId || !topicRationale.trim()}>Vorschlag speichern (noch nicht wirksam)</button>
            </form>
            </details>
            <div className="topic-links-table-wrap">
              <table className="topic-links-table">
                <thead><tr><th scope="col">Lokaler Bezug</th><th scope="col">Typ</th><th scope="col">Bedeutung</th><th scope="col">Status</th><th scope="col"><span className="visually-hidden">Aktionen</span></th></tr></thead>
                <tbody>
                {(topicData?.links ?? []).filter(l=>l.topic_id===topicId).map(l=>{
                  const key=`confirmed-${l.process_id}`;
                  const review=topicReviews[key] ?? {significance:l.significance,rationale:l.significance_rationale ?? '',status:'confirmed'};
                  return <tr key={`linked-${l.process_id}`}>
                    <td><details className="topic-row-details"><summary>{l.process_title}</summary>
                      <p><strong>Begründung:</strong> {l.significance_rationale || 'Keine Begründung hinterlegt.'}</p>
                      <div className="topic-inline-editor">
                        <label>Status<select value={review.status ?? 'confirmed'} onChange={e=>setTopicReviews(v=>({...v,[key]:{...review,status:e.target.value}}))}>
                          <option value="pending">Kandidat</option><option value="confirmed">Zugeordnet</option><option value="deferred">Zurückgestellt</option><option value="rejected">Fachlich unpassend</option>
                        </select></label>
                        <label>Bedeutung<select value={review.significance} onChange={e=>setTopicReviews(v=>({...v,[key]:{...review,significance:e.target.value}}))}><option value="defining">Prägend</option><option value="relevant">Relevant</option><option value="supplementary">Ergänzend</option></select></label>
                        <label>Begründung<textarea maxLength={4000} value={review.rationale} onChange={e=>setTopicReviews(v=>({...v,[key]:{...review,rationale:e.target.value}}))}/></label>
                        <button type="button" disabled={topicBusy || !review.rationale.trim()} onClick={()=>void topicAction((review.status ?? 'confirmed')==='confirmed'?'update_confirmed_link':'transition_confirmed_link',{topicId,processId:l.process_id,decision:review.status ?? 'confirmed',significance:review.significance,rationale:review.rationale})}>Änderungen speichern</button>
                      </div>
                    </details></td>
                    <td>Vorgang</td><td>{review.significance==='defining'?'Prägend':review.significance==='relevant'?'Relevant':'Ergänzend'}</td><td>Zugeordnet</td>
                    <td><span title="Bezug in der ersten Spalte öffnen">✎</span></td>
                  </tr>;
                })}
                {(topicData?.proposals ?? []).filter(p=>p.topic_id===topicId && ['pending','deferred','rejected'].includes(p.status)).map(p=>{
                  const review=topicReviews[p.id] ?? {significance:p.suggested_significance,rationale:p.suggested_rationale,status:p.status};
                  const status=review.status ?? p.status;
                  return <tr key={`proposal-${p.id}`}>
                    <td><details className="topic-row-details"><summary>{p.process_title}</summary>
                      <p className="meta">Herkunft: {p.origin==='ai'?'KI':'Redaktion'} · Redaktioneller Status kann jederzeit bewusst neu bewertet werden.</p>
                      <p><strong>Begründung:</strong> {p.suggested_rationale}</p>
                      <div className="topic-inline-editor">
                        <label>Status<select value={status} onChange={e=>setTopicReviews(v=>({...v,[p.id]:{...review,status:e.target.value}}))}>
                          <option value="pending">Kandidat</option><option value="confirmed">Zugeordnet</option><option value="deferred">Zurückgestellt</option><option value="rejected">Fachlich unpassend</option>
                        </select></label>
                        <label>Bedeutung<select value={review.significance} onChange={e=>setTopicReviews(v=>({...v,[p.id]:{...review,significance:e.target.value}}))}><option value="defining">Prägend</option><option value="relevant">Relevant</option><option value="supplementary">Ergänzend</option></select></label>
                        <label>Begründung<textarea maxLength={4000} value={review.rationale} onChange={e=>setTopicReviews(v=>({...v,[p.id]:{...review,rationale:e.target.value}}))}/></label>
                        <button type="button" disabled={topicBusy || !review.rationale.trim()} onClick={()=>void topicAction('decide',{proposalId:p.id,decision:status,significance:review.significance,rationale:review.rationale})}>Änderungen speichern</button>
                      </div>
                    </details></td>
                    <td>Vorgang</td><td>{review.significance==='defining'?'Prägend':review.significance==='relevant'?'Relevant':'Ergänzend'}</td>
                    <td>{status==='pending'?'Kandidat':status==='deferred'?'Zurückgestellt':status==='rejected'?'Fachlich unpassend':'Zugeordnet'}</td><td><span title="Zum Bearbeiten Bezug in der ersten Spalte öffnen">✎</span></td>
                  </tr>;
                })}
                {!(topicData?.links.some(l=>l.topic_id===topicId) || topicData?.proposals.some(p=>p.topic_id===topicId && ['pending','deferred','rejected'].includes(p.status))) && <tr><td colSpan={5}>Noch keine lokalen Bezüge vorhanden.</td></tr>}
                </tbody>
              </table>
            </div>
            <p className="meta">Alle lokalen Bezüge bleiben gemeinsam sichtbar: Kandidat, Zugeordnet, Zurückgestellt oder Fachlich unpassend. Bedeutung und Begründung können zeilenbezogen bearbeitet werden.</p>

              </section>}
              {topicStep===3 && <section className="topic-editor-area topic-area-card">
                <div className="topic-area-card-header"><h2>Beitrag</h2><div className="topic-area-card-actions"><span className="topic-status-text">{topicContribution?.currentPublication?'Intern veröffentlicht':topicContribution?.versions.some(v=>!v.revoked_at)?'Freigegeben':'Noch keine Freigabe'}</span><button type="button" className="icon-button" aria-label="Beitrag aktualisieren" title="Aktualisieren" disabled={topicBusy} onClick={()=>void loadTopicContribution(topicId)}>↻</button></div></div>
                <p>Der sachliche Thementext und die optionale „Unsere Einordnung“ werden getrennt bearbeitet.</p>
                {topicContribution ? <>
                  <p className="meta">Themenstatus: {topicContribution.topic.status==='draft'?'Entwurf':topicContribution.topic.status==='active'?'Aktiv':topicContribution.topic.status==='deferred'||topicContribution.topic.status==='dormant'?'Zurückgestellt':'Archiviert'} · {topicContribution.currentPublication?'Eine freigegebene Fassung ist intern als Veröffentlichung erfasst.':'Keine aktive Veröffentlichung erfasst.'}</p>
                  <label>Thementext<textarea className="topic-contribution-body" value={topicBody} onChange={e=>setTopicBody(e.target.value)} maxLength={30000}/></label>
                  <label>Unsere Einordnung (optional)<textarea className="topic-contribution-assessment" value={topicAssessment} onChange={e=>setTopicAssessment(e.target.value)} maxLength={30000}/></label>
                  {((topicContribution.draft?.body??'')!==topicBody || (topicContribution.draft?.editorial_assessment??'')!==topicAssessment) && <p className="meta">Ungespeicherte Änderungen – vor einer Freigabe speichern.</p>}
                  <div className="topic-editor-actions topic-contribution-toolbar">
                    <button type="button" disabled={topicBusy} onClick={()=>void contributionAction('save_contribution_draft',{contributionBody:topicBody,editorialAssessment:topicAssessment,expectedRevision:topicContribution.draft?.revision??0})}>Arbeitsfassung speichern</button>
                    <details className="topic-action-menu">
                      <summary aria-label="Weitere Beitragsaktionen">Aktionen ▾</summary>
                      <div className="topic-action-menu-items">
                        <button type="button" disabled={topicBusy || !topicBody.trim() || (topicContribution.draft?.body??'')!==topicBody || (topicContribution.draft?.editorial_assessment??'')!==topicAssessment} onClick={()=>void contributionAction('approve_contribution',{})}>Fassung freigeben</button>
                        {topicContribution.versions.find(v=>!v.revoked_at&&!v.published_at) && <button type="button" disabled={topicBusy} onClick={()=>{const v=topicContribution.versions.find(v=>!v.revoked_at&&!v.published_at);if(v&&window.confirm('Diese noch unveröffentlichte Freigabe zurücknehmen?'))void contributionAction('revoke_contribution',{contributionVersionId:v.id});}}>Freigabe zurücknehmen</button>}
                        {topicContribution.topic.status==='active' && <>
                          <button type="button" disabled={topicBusy} onClick={()=>{if(window.confirm('Thema zurückstellen und öffentliche Sichtbarkeit beenden?'))void contributionAction('defer_topic',{confirmation:true});}}>Thema zurückstellen</button>
                          <button type="button" disabled={topicBusy} onClick={()=>{if(window.confirm('Thema dauerhaft archivieren und öffentliche Sichtbarkeit beenden?'))void contributionAction('archive_topic',{confirmation:true});}}>Thema archivieren</button>
                        </>}
                        {(topicContribution.topic.status==='deferred'||topicContribution.topic.status==='archived') && <button type="button" disabled={topicBusy} onClick={()=>{if(window.confirm('Aktualität der freigegebenen Fassung geprüft? Das Thema wird aktiviert, jedoch nicht veröffentlicht.'))void contributionAction('reactivate_topic',{confirmation:true,currencyChecked:true});}}>Nach Aktualitätsprüfung wiederaufnehmen</button>}
                        <p className="meta">Öffentliche Veröffentlichung wird erst mit dem K0-Publikationsprozess verfügbar.</p>
                      </div>
                    </details>
                  </div>
                  <details className="topic-versions"><summary>Versionsverlauf ({topicContribution.versions.length})</summary>
                    {topicContribution.versions.length===0 && <p>Noch keine freigegebenen Beitragsfassungen.</p>}
                    {topicContribution.versions.map(v=><details key={v.id}>
                      <summary>Version {v.version_no} · {new Date(v.approved_at).toLocaleDateString('de-DE')}{v.revoked_at?' · Freigabe zurückgenommen':v.published_at?' · Veröffentlichung dokumentiert':' · Freigegeben'}</summary>
                      <h4>Thementext (schreibgeschützt)</h4><p className="topic-version-text">{v.body}</p>
                      {v.editorial_assessment && <><h4>Unsere Einordnung</h4><p className="topic-version-text">{v.editorial_assessment}</p></>}
                    </details>)}
                  </details>
                </> : <p role="status">Beitragsdaten werden geladen …</p>}
              </section>}
                </div>
                <aside className="panel card-headed topic-coordination-panel" aria-label="Redaktionelle Koordination">
                  <div className="section-heading"><h2>Redaktionelle Koordination</h2>
                    <button type="button" className="icon-button" title="Koordination aktualisieren" aria-label="Koordination aktualisieren" disabled={topicCoordinationBusy} onClick={()=>void topicCoordinationAction('get_state')}>↻</button>
                  </div>
                  <p><strong>Federführung:</strong> {topicCoordination?.lead ? (topicCoordination.lead.mine ? (sessionContext?.displayName ?? topicCoordination.lead.displayName) : topicCoordination.lead.displayName) : 'niemand'}</p>
                  <p><strong>Bearbeitung:</strong> {topicCoordination?.lock ? (topicCoordination.lock.mine ? 'durch mich gesperrt' : `gesperrt durch ${topicCoordination.lock.displayName}`) : 'frei'}</p>
                  <p><strong>Letzte Bearbeitung:</strong> {topicCoordination?.lastEdit ? `${topicCoordination.lastEdit.displayName} · ${new Date(topicCoordination.lastEdit.editedAt).toLocaleString('de-DE')}` : 'noch nicht erfasst'}</p>
                  <button type="button" className="action-button" disabled={topicCoordinationBusy || (!!topicCoordination?.lead && !topicCoordination.lead.mine)} onClick={()=>void topicCoordinationAction(topicCoordination?.lead?.mine?'release_lead':'take_lead')}>
                    {topicCoordination?.lead?.mine?'Federführung abgeben':'Federführung übernehmen'}
                  </button>
                  {topicCoordinationMessage && <p role="status">{topicCoordinationMessage}</p>}
                </aside>
              </div>
              <div className="topic-editor-actions"><button type="button" className="icon-button" aria-label="Themenbearbeitung aktualisieren" title="Aktualisieren" disabled={topicBusy} onClick={()=>{void loadTopics();void loadTopicContribution(topicId);}}>↻</button></div>
            </>}
            {topicBusy && <p role="status">Bearbeitung läuft …</p>}
          </section>
        )}
        {view === 'events' && (
          <>
            <nav className="breadcrumbs" aria-label="Brotkrumen">
              <button onClick={() => navigateTo('dashboard')}>Dashboard</button>
              <span>›</span><span aria-current="page">Ereignisse</span>
            </nav>
            <div className="page-heading">
              <div><p className="eyebrow">Redaktion · Recherche</p><h1 className="object-title"><img className="object-icon" src={eventIcon} alt="" aria-hidden="true" />Ereignisse</h1></div>
            </div>
            <section className="panel card-headed">
              <h2>Ereignisse suchen</h2>
              <div className="finding-filter">
                <label>Titel oder Beschreibung
                  <input type="search" value={eventSearch} onChange={e => setEventSearch(e.target.value)} maxLength={120} placeholder="Suchbegriff eingeben …" />
                </label>
                {eventSearch && <button type="button" className="event-filter-reset" aria-label="Ereignisfilter löschen" title="Filter löschen" onClick={() => setEventSearch('')}><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16l-6.5 7.3V19l-3 1v-7.7L4 5Z" /><path d="M3 21 21 3" /></svg></button>}
              </div>
              {eventListBusy && <p role="status">Ereignisse werden geladen …</p>}
              {eventListError && <p className="error" role="alert">{eventListError}</p>}
              {!eventListBusy && !eventListError && eventList.length === 0 && <p>Keine Ereignisse gefunden.</p>}
              {!eventListBusy && eventList.map((item) => (
                <article className="work-item" key={item.id}>
                  <div><h3>{readableEventTitle(item.title)}</h3>{readableSummary(item.summary) && <p>{readableSummary(item.summary)}</p>}
                    <p className="meta">Status: {eventStatusLabel(item.status)} · Zeitpunkt: {item.occurredAt ? new Date(item.occurredAt).toLocaleDateString('de-DE') : 'nicht angegeben'}</p>
                  </div>
                  <button className="action-button" disabled={serviceRunning} onClick={() => void openListedEvent(item.id)}><ActionIcon name="open" />Öffnen</button>
                </article>
              ))}
              {eventListHasMore && <p className="meta">Es werden maximal 100 Ereignisse angezeigt. Bitte die Suche eingrenzen.</p>}
            </section>
          </>
        )}

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
                    {readableSummary(eventResult.summary) && <p>{readableSummary(eventResult.summary)}</p>}
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

        {view === 'u4pilot' && isAdmin && (
          <>
            <nav className="breadcrumbs" aria-label="Brotkrumen">
              <button onClick={() => navigateTo('dashboard')}>Dashboard</button>
              <span>›</span><span aria-current="page">Tasks & Läufe</span>
            </nav>
            <div className="page-heading"><div><p className="eyebrow">Administration · U4</p><h1>Quellenmonitor testen</h1>
              <p>Kontrollierter Test der Gemeinde-Nachrichten. Keine automatische Überwachung.</p></div></div>
            <section className="panel card-headed">
              <div className="section-heading"><h2>Gemeinde Feldkirchen – Nachrichten</h2></div>
              <div style={{padding:'1rem'}}>
                <p>Der lesende Test zeigt erkannte Veröffentlichungen. Der Speichertest legt technische Beobachtungen, aber keine redaktionellen Meldungen an.</p>
                <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap'}}>
                  <button type="button" disabled={u4Busy} onClick={()=>void runU4Pilot(false)}>Nur prüfen (ohne Speicherung)</button>
                  <button type="button" disabled={u4Busy} onClick={()=>void runU4Pilot(true)}>Testdaten speichern</button>
                </div>
                <div style={{marginTop:'1.5rem'}}>
                  <h3>RIS – Dokumentfreigaben (Pilot)</h3>
                  <p>Pro Lauf werden höchstens zwei historische Freigabefenster geprüft. Unvollständige historische Erfassung wird ausdrücklich angezeigt; es werden keine Beschlüsse erzeugt.</p>
                  <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap'}}>
                    <button type="button" disabled={u4Busy} onClick={()=>void runRisPilot(false)}>RIS nur prüfen</button>
                    <button type="button" disabled={u4Busy} onClick={()=>void runRisPilot(true)}>RIS-Testlauf speichern</button>
                    <button type="button" disabled={u4Busy} onClick={()=>void runRisPilot(true,'weekly')}>RIS-120-Tage-Prüfung testen</button>
                    <button type="button" disabled={u4Busy} onClick={()=>void runRisCombinedAcceptance()}>RIS-Betriebsprüfung gesamt testen</button>
                    <button type="button" disabled={u4Busy} onClick={()=>void runRisPdfBackfill()}>RIS-PDFs gesammelt prüfen</button>
                  </div>
                </div>
                {u4Busy && <p role="status">Quellenabruf läuft …</p>}
                {u4Error && <p role="alert">Fehler: {u4Error}</p>}
                {u4Result && <div aria-live="polite">
                  <p><strong>Ergebnis:</strong> {u4Result.mode==='dry_run'?'Lesender Test':'Speichertest'}</p>
                  {u4Result.ris===true && u4Result.backfill===true && <p>PDF-Nachprüfung: {String(u4Result.pdfChecked)} PDFs im letzten Paket geprüft · Noch offen: {String(u4Result.backfillRemaining)}</p>}
                  {u4Result.ris ? <>
                    <p>RIS-Dokumentverweise: {String(u4Result.documents)} · Neue Verweise: {String(u4Result.newCount)} · Noch zu prüfende Freigabeansichten: {String(u4Result.pending)} · Alle gefundenen Ansichten geprüft: {u4Result.complete?'Ja':'Nein'}</p>
                    {typeof u4Result.coverageStatus==='string' && <p>Rückblick ({u4Result.cadence==='weekly'?'120':'30'} Tage) · benötigt ab: {String(u4Result.requiredSince)} · frühester belegter Start: {String(u4Result.earliestObserved??'unbekannt')} · Nachweis: {u4Result.coverageStatus==='candidate'?'Startdatum ausreichend; Vollständigkeit nicht belegt':u4Result.coverageStatus==='in_progress'?'Prüfung läuft':u4Result.coverageStatus==='insufficient'?'Rückblick nicht ausreichend':'Nicht nachgewiesen'}</p>}
                    {Array.isArray(u4Result.dueChecks) && <p>Prüfbedarf: {(u4Result.dueChecks as {cadence:string;due:boolean;reason:string;overdueDays:number|null}[]).map(x=>`${x.cadence==='daily'?'Täglich':'Wöchentlich'}: ${x.reason==='recovery_needed'?'Nachholung erforderlich':x.reason==='never_completed'?'Noch kein Abschluss':x.due?'Fällig':'Nicht fällig'}`).join(' · ')}</p>}
                    {u4Result.cadenceStates && typeof u4Result.cadenceStates==='object' && <div role="status"><strong>Getrennte RIS-Prüfstände:</strong> {(['daily','weekly'] as const).map(mode=>{const state=(u4Result.cadenceStates as Record<string,{pending?:string[];failures?:unknown[];lastCompleteAt?:string|null;lastStatus?:string}>)[mode];return <p key={mode}>{mode==='daily'?'Täglich · 30 Tage':'Wöchentlich · 120 Tage'}: {state?`Status: ${state.lastStatus??'unbekannt'} · offene Ansichten: ${state.pending?.length??0} · Fehler: ${state.failures?.length??0} · letzter Abschluss: ${state.lastCompleteAt?new Date(state.lastCompleteAt).toLocaleString('de-DE'):'noch keiner'}`:'Noch nicht geprüft'}</p>})}</div>}
                    {Array.isArray(u4Result.releaseViews) && u4Result.releaseViews.length>0 && <details><summary>Belegte RIS-Freigabezeiträume ({u4Result.releaseViews.length} Ansichten)</summary><ul>
                      {(u4Result.releaseViews as {url?:string;releaseSince?:string|null;checkedAt?:string}[]).map((view,i)=><li key={view.url??i}>Freigaben seit: {view.releaseSince??'nicht ermittelbar'} · geprüft: {view.checkedAt?new Date(view.checkedAt).toLocaleString('de-DE'):'–'} · <a href={view.url} target="_blank" rel="noopener noreferrer">RIS-Ansicht öffnen</a></li>)}
                    </ul><p>Der angezeigte Freigabestart ist kein Beleg für das Veröffentlichungsdatum einzelner Dokumente oder die vollständige historische Abdeckung.</p></details>}
                  </> : <p>Erkannt: {String(u4Result.detected ?? u4Result.seen ?? '–')} · Neu: {String(u4Result.newCount ?? '–')} · Verändert: {String(u4Result.changedCount ?? '–')}</p>}
                  {Array.isArray(u4Result.urls) && <details><summary>Erkannte Seiten anzeigen</summary><ul>{u4Result.urls.map((url,i)=><li key={i}>{String(url)}</li>)}</ul></details>}
                </div>}
              </div>
            </section>
          </>
        )}

        {view === 'users' && isAdmin && (
          <>
            <nav className="breadcrumbs" aria-label="Brotkrumen">
              <button onClick={() => navigateTo('dashboard')}>Dashboard</button>
              <span>›</span><span aria-current="page">Benutzer & Rollen</span>
            </nav>
            <div className="page-heading"><div><p className="eyebrow">Administration</p><h1>Benutzer & Rollen</h1><p>FIB-Zugang wird ausschließlich administrativ vorautorisiert. Ein Auth-Konto allein gewährt keinen Zugriff.</p></div></div>
            <section className="panel card-headed admin-users-panel">
              <div className="section-heading">
                <h2>Benutzer &amp; Rollen</h2>
                <div className="button-row">
                  <button type="button" className="primary" onClick={() => { setAdminInviteMessage(null); setAdminDialog('new'); }}>Neuer Benutzer</button>
                  <button type="button" className="action-button" aria-label="Benutzerliste aktualisieren" title="Benutzerliste aktualisieren" onClick={() => void loadAdminUsers()} disabled={adminUsersLoading || adminInviteBusy}><ActionIcon name="refresh" /></button>
                </div>
              </div>
              {adminInviteMessage && <p className="status-message" role="status">{adminInviteMessage}</p>}
              {adminUsersLoading ? <p role="status">Benutzer werden geladen …</p> : adminUsers.length === 0 ? <p>Noch keine FIB-Benutzer vorhanden.</p> : (
                <table className="admin-users-table">
                  <thead><tr><th>Name</th><th className="admin-users-email">E-Mail</th><th>Rolle</th><th>Status</th><th><span className="sr-only">Aktion</span></th></tr></thead>
                  <tbody>{adminUsers.map(user => (
                    <tr key={user.user_id}>
                      <td>{user.full_name}</td>
                      <td className="admin-users-email">{user.email ?? '–'}</td>
                      <td>{user.role === 'admin' ? 'Admin' : 'Redakteur'}</td>
                      <td>{user.setup_status === 'active' && user.active ? 'Aktiv' : user.setup_status === 'deactivated' || !user.active ? 'Deaktiviert' : 'Ausstehend'}</td>
                      <td><button type="button" className="action-button admin-row-action" aria-label={`Benutzer ${user.full_name} bearbeiten`} title="Benutzer bearbeiten" onClick={() => { setAdminInviteMessage(null); setAdminDialog(user.user_id); }}><ActionIcon name="edit" /></button></td>
                    </tr>
                  ))}</tbody>
                </table>
              )}
            </section>
            {adminDialog !== null && (
              <div className="admin-dialog-backdrop" onMouseDown={event => { if (event.target === event.currentTarget && !adminInviteBusy) setAdminDialog(null); }}>
                <section className="admin-dialog" role="dialog" aria-modal="true" aria-label={adminDialog === 'new' ? 'Neuer Benutzer' : 'Benutzer bearbeiten'} onKeyDown={event => { if (event.key === 'Escape' && !adminInviteBusy) setAdminDialog(null); }}>
                  <div className="section-heading"><h2>{adminDialog === 'new' ? 'Neuer Benutzer' : 'Benutzer bearbeiten'}</h2><button type="button" aria-label="Dialog schließen" title="Schließen" onClick={() => setAdminDialog(null)}>✕</button></div>
                  {adminDialog === 'new' ? (
                    <form className="stack" onSubmit={async event => { await inviteAdminUser(event); }}>
                      <label>Vollständiger Name<input autoFocus value={adminInviteName} onChange={e => setAdminInviteName(e.target.value)} maxLength={120} required autoComplete="name" /></label>
                      <label>E-Mail-Adresse<input type="email" value={adminInviteEmail} onChange={e => setAdminInviteEmail(e.target.value)} maxLength={254} required autoComplete="email" /></label>
                      <label>FIB-Rolle<select value={adminInviteRole} onChange={e => setAdminInviteRole(e.target.value as 'editor' | 'admin')}><option value="editor">Redakteur</option><option value="admin">Admin</option></select></label>
                      <p className="meta">Bei bestehenden Shared-Apps-Konten bleiben Passwort und MFA unverändert. Nur der FIB-Zugang wird vorautorisiert.</p>
                      <button className="primary" type="submit" disabled={adminInviteBusy || !adminInviteName.trim() || !adminInviteEmail.trim()}>{adminInviteBusy ? 'Verarbeitet …' : 'Einladen'}</button>
                    </form>
                  ) : (() => {
                    const user = adminUsers.find(item => item.user_id === adminDialog);
                    if (!user) return <p>Benutzer nicht gefunden.</p>;
                    return <div className="stack">
                      <p><strong>Name:</strong> {user.full_name}</p>
                      <p><strong>E-Mail:</strong> {user.email ?? '–'}</p>
                      <p><strong>Rolle:</strong> {user.role === 'admin' ? 'Admin' : 'Redakteur'}</p>
                      <p><strong>Status:</strong> {user.setup_status === 'active' && user.active ? 'Aktiv' : user.active ? 'Einrichtung ausstehend' : 'Deaktiviert'}</p>
                      {user.invited_at && <p className="meta">Einladung vom {new Date(user.invited_at).toLocaleString('de-DE')}</p>}
                      {(user.setup_status === 'invited' || user.setup_status === 'setup_pending') && user.active && <div className="button-row">
                        {user.setup_status === 'setup_pending' && !user.confirmed_at && user.email && <button type="button" onClick={() => void repeatAdminInvitation(user.user_id)} disabled={adminInviteBusy}>Einladung erneut senden</button>}
                        <button type="button" onClick={() => void revokeAdminInvitation(user.user_id)} disabled={adminInviteBusy}>Einladung zurücknehmen</button>
                      </div>}
                      {user.setup_status === 'active' && <p className="meta">Änderung von Namen, Rolle und Zugang aktiver Benutzer folgt mit gesicherter Serverfunktion.</p>}
                    </div>;
                  })()}
                  {adminInviteMessage && <p className="status-message" role="status">{adminInviteMessage}</p>}
                </section>
              </div>
            )}
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
                <PasswordField label="Neues Passwort" autoComplete="new-password" minLength={12} value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                <PasswordField label="Neues Passwort wiederholen" autoComplete="new-password" minLength={12} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
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
              <span>›</span><button onClick={() => navigateTo('events')}>Ereignisse</button>
              <span>›</span>
              <span aria-current="page">Ereignis</span>
            </nav>

            <div className="page-heading event-heading">
              <div>
                <p className="eyebrow">Ereignis</p>
                <h1 className="object-title"><img className="object-icon" src={eventIcon} alt="" aria-hidden="true" />{readableEventTitle(eventResult.title)}</h1>
                {readableSummary(eventResult.summary) && <p>{readableSummary(eventResult.summary)}</p>}
              </div>
              <button className="action-button" onClick={() => navigateTo('events')}><ActionIcon name="back" />Zurück</button>
            </div>

            <section className="object-status">
              <div><span>Zustand / Status</span><strong>{eventStatusLabel(eventResult.status)}</strong></div>
              
            </section>

            <div className="detail-grid">
              <div className="detail-content-column">
              <section className={`panel card-headed${editingEvent ? " workflow-dock-host" : ""}`}>
                <div className="section-heading">
                  <div className="card-title-group"><h2>Ereignisdaten</h2>{editingEvent && <span className="card-mode-label">Bearbeiten</span>}</div>
                  {editingEvent && <span className={editFailed ? 'card-edit-state error' : !editTitle.trim() ? 'card-edit-state error' : eventDirty ? 'card-edit-state dirty' : 'card-edit-state'} role="status">{editSaving ? 'Speichern läuft …' : editFailed ? 'Änderung nicht gespeichert' : !editTitle.trim() ? '⚠ Pflichteingaben unvollständig' : eventDirty ? '● Ungespeicherte Änderungen' : 'Unverändert'}</span>}
                  {!editingEvent && editSaved && <span className="card-edit-state saved" role="status">✓ Gespeichert</span>}
                  {!editingEvent && (
                    <button className="primary action-button" onClick={startEventEditing} disabled={sourcePickerOpen || coordinationRunning || !!(coordination?.lock && !coordination.lock.mine)}>
                      <ActionIcon name="edit" />
                      Bearbeiten
                    </button>
                  )}
                </div>

                {editingEvent ? (
                  <form className="stack edit-form" onSubmit={saveEventEdit}>
                    <label>Titel *
                      <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required aria-invalid={!editTitle.trim()} />
                      {!editTitle.trim() && <small className="field-validation-note">Bitte einen Titel eingeben.</small>}
                    </label>
                    <label>Zusammenfassung
                      <textarea value={editSummary} onChange={(e) => setEditSummary(e.target.value)} rows={4} />
                    </label>
                    <label>Ereignisdatum
                      <input type="date" value={editOccurredAt} onChange={(e) => setEditOccurredAt(e.target.value)} />
                    </label>
                    <div className="workflow-action-dock" role="group" aria-label="Aktionen für Ereignisbearbeitung">
                      <button type="submit" className="primary action-button" disabled={editSaving || !editTitle.trim() || !eventDirty}><ActionIcon name="save" />{editSaving ? 'Speichert …' : 'Speichern'}</button>
                      <button type="button" className="action-button" onClick={cancelEventEditing} disabled={editSaving}>Abbrechen</button>
                    </div>
                  </form>
                ) : (
                  <dl className="data-list">
                    <div><dt>Titel</dt><dd>{readableEventTitle(eventResult.title)}</dd></div>
                    <div><dt>Zusammenfassung</dt><dd>{readableSummary(eventResult.summary) ?? 'Noch keine Zusammenfassung'}</dd></div>
                    <div><dt>Ereignisdatum</dt><dd>{eventResult.occurredAt ? new Date(eventResult.occurredAt).toLocaleDateString('de-DE') : 'Noch nicht gesetzt'}</dd></div>
                  </dl>
                )}
                {editMessage && <p aria-live="polite" className="status-message">{editMessage}</p>}
              </section>

              <section className={`panel card-headed${sourcePickerOpen ? " workflow-dock-host" : ""}`}>
                <div className="section-heading">
                  <div className="card-heading-content"><div className="card-title-group"><h2>Quellen und Fundstellen</h2>{sourcePickerOpen && <span className="card-mode-label">Bearbeiten</span>}</div>{sourcePickerOpen && <p className="card-heading-help">Fundstellen zuordnen, bearbeiten oder entfernen.</p>}</div>
                  {sourcePickerOpen && editingSourceId && <span className={!sourceNoteDraft.trim() ? 'card-edit-state error' : 'card-edit-state dirty'} role="status">{!sourceNoteDraft.trim() ? '⚠ Pflichteingaben unvollständig' : sourceNoteDraft !== (eventSources.find(item => item.findingId === editingSourceId)?.justification ?? '') ? '● Ungespeicherte Änderungen' : 'Unverändert'}</span>}
                  {!sourcePickerOpen && <button type="button" className="primary action-button" disabled={editingEvent} onClick={() => { setSourcePickerOpen(true); setSourceMessage(null); }}>Fundstellen bearbeiten</button>}
                </div>
                
                {eventSources.length === 0 ? <p>Für dieses Ereignis sind noch keine Fundstellen zugeordnet.</p> : (
                  <ul className="event-source-list">
                    {eventSources.map((source) => (
                      <li key={source.findingId}>
                        <strong>{readableSourceName(source.sourceName)}</strong>
                        <span>{source.originalUrl && /^https?:\/\//i.test(source.originalUrl) ? <a href={source.originalUrl} target="_blank" rel="noopener noreferrer">{source.findingTitle}</a> : source.findingTitle}</span>
                        <button type="button" disabled={editingEvent||sourcePickerOpen} onClick={()=>{setSourceFindingId(source.findingId);navigateTo('findings');}}>Fundstelle öffnen</button>
                        {editingSourceId !== source.findingId && source.justification && <p className="finding-justification">{source.justification}</p>}
                        {sourcePickerOpen && (editingSourceId === source.findingId ? (
                          <div className="stack finding-justification-editor">
                            <label>Begründung der Zuordnung *
                              <textarea aria-invalid={!sourceNoteDraft.trim()} className="finding-justification-input" value={sourceNoteDraft} maxLength={2000} onChange={e => setSourceNoteDraft(e.target.value)} rows={3} placeholder="Warum wurde diese Fundstelle dem Ereignis zugeordnet? Welche Information liefert sie dazu?" />
                              {!sourceNoteDraft.trim() && <small className="field-validation-note">Bitte eine Begründung eingeben.</small>}
                            </label>

                          </div>
                        ) : (
                          <div className="button-row">
                            <button type="button" disabled={sourceBusy || !!editingSourceId} onClick={() => startFindingMetadataEdit(source)}>Zuordnung bearbeiten</button>
                            <button type="button" disabled={sourceBusy || !!editingSourceId} onClick={() => void unlinkFinding(source.findingId)}>Zuordnung aufheben</button>
                          </div>
                        ))}
                      </li>
                    ))}
                  </ul>
                )}
                {sourcePickerOpen && <div className="stack">
                  <div className="finding-filter">
                    <label>Fundstellen filtern – Titel oder Quelle
                      <input type="search" value={sourceSearch} onChange={event => setSourceSearch(event.target.value)} maxLength={120} placeholder="Suchbegriff eingeben …" />
                    </label>
                    <button type="button" className="action-button" disabled={!sourceSearch} onClick={() => setSourceSearch('')}>Filter löschen</button>
                  </div>
                  {sourceBusy && <p role="status">Suche läuft …</p>}
                  {sourceMatches.filter(finding => !eventSources.some(item => item.findingId === finding.findingId)).map(finding => <div className="work-item finding-link-item" key={finding.findingId}>
                    <div className="finding-link-fields"><strong>{readableSourceName(finding.sourceName)}</strong><p>{finding.findingTitle}</p>
                      <label>Begründung der Zuordnung *
                        <textarea id={`finding-justification-${finding.findingId}`} rows={3} maxLength={2000} value={linkJustificationDrafts[finding.findingId] ?? finding.previousJustification ?? ''} onChange={e => setLinkJustificationDrafts(current => ({...current, [finding.findingId]: e.target.value}))} placeholder="Warum ist diese Fundstelle dem Ereignis zugeordnet?" aria-invalid={!(linkJustificationDrafts[finding.findingId] ?? finding.previousJustification ?? '').trim()} />
                      </label>
                      {!(linkJustificationDrafts[finding.findingId] ?? finding.previousJustification ?? '').trim() && <small id={`finding-link-hint-${finding.findingId}`} className="field-validation-note">Bitte zuerst die Zuordnung begründen. Danach auf „Zuordnen“ klicken.</small>}
                    </div>
                    <div className="finding-link-actions">
                      <button type="button" onClick={() => { if (!(linkJustificationDrafts[finding.findingId] ?? finding.previousJustification ?? "").trim()) { document.getElementById(`finding-justification-${finding.findingId}`)?.focus(); return; } void linkFinding(finding.findingId); }} disabled={sourceBusy} aria-describedby={`finding-link-hint-${finding.findingId}`}>Zuordnen</button>
                    </div>
                  </div>)}
                </div>}
                {sourceMessage && <p role="status">{sourceMessage}</p>}
                {sourcePickerOpen && <div className="workflow-action-dock" role="group" aria-label="Aktionen für Fundstellenbearbeitung">
                  {editingSourceId ? <>
                    <button type="button" className="primary action-button" disabled={sourceBusy || !sourceNoteDraft.trim() || sourceNoteDraft === (eventSources.find(item => item.findingId === editingSourceId)?.justification ?? '')} onClick={() => void saveFindingMetadata(editingSourceId)}><ActionIcon name="save" />Speichern</button>
                    <button type="button" className="action-button" disabled={sourceBusy} onClick={() => { const current = eventSources.find(item => item.findingId === editingSourceId); if (sourceNoteDraft !== (current?.justification ?? '') && !window.confirm('Ungespeicherte Änderungen an dieser Zuordnung verwerfen?')) return; setEditingSourceId(null); }}>Abbrechen</button>
                  </> : <button type="button" className="action-button" disabled={sourceBusy} onClick={() => { const pending = sourceMatches.some(finding => !eventSources.some(item => item.findingId === finding.findingId) && (linkJustificationDrafts[finding.findingId] ?? "").trim().length > 0); if (pending && !window.confirm("Nicht zugeordnete Begründungsentwürfe verwerfen und Fundstellenbearbeitung beenden?")) return; setSourcePickerOpen(false); setLinkJustificationDrafts({}); setSourceMessage(null); }}>Fertig</button>}
                </div>}

              </section>

                            </div>

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
