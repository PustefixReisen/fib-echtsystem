import { supabase } from "./supabase.js";
export type SourceApi = (body: Record<string, unknown>) => Promise<any>;
const messages: Record<string, string> = {
  ris_structure_disabled:
    "Noch nicht produktiv nutzbar: Datenbank und serverseitige Funktionen sind noch nicht freigegeben.",
  stale_review:
    "Die Quelle wurde inzwischen geändert. Bitte neu laden und die aktuelle Fassung prüfen.",
  stale_ris_review:
    "Die Dokumentfassung ist veraltet. Bitte die aktuelle Fassung prüfen.",
  missing_exact_evidence:
    "Der Beleg muss wortgetreu im ausgewählten Dokument enthalten sein.",
  ris_object_missing:
    "Objekt, bestätigter Beleg oder gültige Bearbeitungssperre fehlt. Bitte neu laden und die Zuordnung prüfen.",
  ris_review_already_final:
    "Dieser Vorschlag wurde bereits entschieden. Für eine neue Bewertung ist ein neuer Vorschlag erforderlich.",
  ambiguous_existing_findings:
    "Mehrere bestehende Fundstellen passen zu dieser Quelle. Die Dublette muss redaktionell geklärt werden.",
  active_edit_lock_required: "Bitte die Bearbeitungssperre erneut anfordern.",
  existing_significance_conflict:
    "Der vorhandene Themenbezug hat eine andere Bedeutung. Er wird nicht überschrieben.",
  trusted_ai_ingestion_required:
    "KI-Vorschläge benötigen einen vertrauenswürdigen serverseitigen Auftrag.",
};
export const sourceApi: SourceApi = async (body) => {
  const { data, error } = await supabase.functions.invoke(
    "fib-editorial-write",
    { body },
  );
  if (error || !data?.ok) {
    let code = data?.error;
    try {
      if (error?.context instanceof Response)
        code = (await error.context.clone().json()).error;
    } catch {
      /* No technical payload in UI. */
    }
    throw Error(
      messages[code] ??
        "Die Aktion konnte nicht gespeichert werden. Bitte Verbindung, Berechtigung und Freigabestand prüfen.",
    );
  }
  return data;
};
export async function withEventLock<T>(
  eventId: string,
  work: () => Promise<T>,
): Promise<T> {
  const call = async (action: string) => {
    const { data, error } = await supabase.functions.invoke(
      "fib-coordination",
      { body: { action, objectType: "event", objectId: eventId } },
    );
    if (error || !data?.ok)
      throw Error(
        "Das Ereignis wird bereits bearbeitet oder die Sperre ist abgelaufen.",
      );
    return data;
  };
  const state = await call("get_state");
  const alreadyMine = Boolean(state.state?.lock?.mine);
  await call("acquire_lock");
  try {
    return await work();
  } finally {
    if (!alreadyMine) await call("release_lock").catch(() => {});
  }
}
