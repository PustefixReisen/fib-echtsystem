# Einheitliche FIB-Fundstellenabstracts – technisches Kernmodell

**Stand:** 12.11.2026 · **Issue #440** · **Status:** Codevertrag und Tests, **keine** produktive Speicherung oder KI-Anbindung.

## Einordnung

Das Modul `supabase/functions/_shared/finding-abstract.ts` ist eine quellenunabhängige Validierungsgrenze. Es erzeugt keine Inhalte: Ein späterer regelbasierter oder KI-basierter Erzeuger übergibt einen Vorschlag, der gegen feste Felder, Quellen-/Versionsbelege, Umfang und Kandidatenstatus geprüft wird.

### Fachliche Identität und künftige Speicherung

- **Quellenobjekt**: `fib.findings.id` mit vorhandenen `fib.finding_versions.id` als verbindliche Versionsidentität. Ein RIS-Original kann über `fib.ris_documents.finding_id` dieser Quelle zugeordnet sein.
- **Analyseidentität**: Fundstellenfassung + Fingerprint + Quellenklasse + optionale TOP-Nummer + Modell/Verfahrensversion + Schema/Vertragsversion. Wiederholte identische Verarbeitung hat denselben Schlüssel (`findingAbstractKey`).
- **Abgeleitetes Ergebnis**: neutraler `summary`, einzelne `claims` (Tatsache vs. Schlussfolgerung, Sicherheit, Fundstellen-/Versionsbeleg), `relations` ausschließlich `candidate`, `limitations`; `status=derived_unreviewed`.
- **RIS-Sammelniederschrift**: bleibt **eine** Fundstelle. TOP-spezifische Abstracts werden über `scopeTop` logisch getrennt; ohne TOP-identische Belege keine Speicherung.
- **Spätere persistente Tabelle**: z. B. `fib.finding_abstract_versions` mit eigenem ID, `finding_id`, `finding_version_id`, `input_hash`, `contract_version`, `model_version`, `schema_version`, `top_number nullable`, `result jsonb`, `generated_at`, eindeutiger Index auf Verarbeitungsschlüssel. Reiner Append, RLS, kein Update/Delete für Runtime. **Erst migrations-/sicherheitsgeprüft bereitstellen**; noch nicht angelegt.
- **Stale-Erkennung**: Bei Änderung der aktuellen Quellenfassung oder des Verarbeitungsprofils alte Analysen nicht als aktuell ausgeben; alte Versionen bleiben für Provenienz vorhanden.

### Vertrauensgrenze

1. Ohne verifizierte Berechtigung (`permitted=false`) wird jede Validierung verweigert. Ein späterer Betreiber muss die Berechtigung *außerhalb des Modelloutputs* anhand der konkreten Fundstellen-/Dokumentversion ermitteln; `permitted` ist keine Selbstauskunft des KI-Modells.
2. Unbekannte Felder (auch `rawText`, `originalPdf`, `status=approved`) werden abgewiesen. Modelloutputs können Originale und Publikationsstatus weder setzen noch bearbeiten.
3. Jede Erkenntnis und jede Beziehung benötigt mindestens einen Beleg auf dieselbe Versions-ID und URL. Ein optionaler TOP-Bereich ist exakt gebunden.
4. Die Validierung beweist **nicht** die Wahrheit der Behauptung oder ob die erwähnte Passage tatsächlich auf der Seite steht. Das benötigt gesonderte Segment-/Belegprüfung und fachliche Tests.
5. Nachrichten-/Meldungsfreigabe, Rollen und Rechte der Redaktion bleiben getrennt. Keine auto-bestätigte Beziehung.
6. Kein Modell-/Netzwerk-Aufruf, keine PDF-Verarbeitung, kein Secrets-/Budgetzugriff im Kernmodul.

### Prüfung

`node --import tsx tests/ris-analysis/finding-abstract.spec.mts`

Vier Quellenarten, TOP-sicheres Abgrenzen, Versions-/Modellwechsel, Rechte-Fehlpfad, keine unbekannten Felder, keine Modellfreigabe, keine unbelegten/externen Zitate und ausschließlich Kandidatenbeziehungen. Läuft über den bestehenden RIS-Analysis-CI-Workflow ohne neue Infrastruktur.

### Nicht in diesem Paket implementiert

Persistenzmigration, ausführender asynchroner Worker, echtes KI-Provider-API, Rechteklassifikation, echte Dokumentsegmentierung, Nutzeroberfläche, Live-Release. Sie erfordern gesonderte Umsetzung und Freigabe; die laufende RIS-Regelanalyse `rules-3` bleibt davon unabhängig.
