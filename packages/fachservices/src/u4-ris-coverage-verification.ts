import type {RisWindowPlan} from './u4-ris-monitor-policy.js';
export type RisReleaseEvidence={url:string;releaseSince:string|null;checkedAt:string};
export type RisCoverageResult={cadence:RisWindowPlan['cadence'];requiredSince:string;earliestObserved:string|null;status:'unverified'|'insufficient'|'candidate';reason:string};
/**
 * Earliest source-labelled "Freigaben seit" is an evidence for a query threshold,
 * NOT proof that all releases between two dates were returned.
 */
export function assessRisCoverage(plan:RisWindowPlan,views:readonly RisReleaseEvidence[],scanComplete:boolean):RisCoverageResult {
 const valid=views.filter(v=>v.releaseSince && /^\d{4}-\d{2}-\d{2}$/.test(v.releaseSince) && Number.isFinite(Date.parse(v.releaseSince+'T00:00:00Z')));
 const earliest=valid.length?valid.map(v=>v.releaseSince!).sort()[0]:null;
 const common={cadence:plan.cadence,requiredSince:plan.startDate,earliestObserved:earliest};
 if(!scanComplete)return {...common,status:'unverified' as const,reason:'RIS-Navigationsprüfung nicht abgeschlossen'};
 if(!earliest)return {...common,status:'unverified' as const,reason:'Kein verifizierter Freigabestart auf RIS-Seiten'};
 if(earliest>plan.startDate)return {...common,status:'insufficient' as const,reason:'Ältester nachgewiesener Freigabestart liegt nach dem geforderten Rückblick'};
 return {...common,status:'candidate' as const,reason:'Freigabestart reicht zurück; lückenlose Abdeckung und Dokumenteinzeldaten weiterhin nicht bewiesen'};
}
