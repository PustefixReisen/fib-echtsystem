# U4 – Persistente RIS-Struktur und redaktionelle Übergabe

| Version | Stand | Bearbeitung |
|---|---|---|
| 1.2 | 31.10.2026 | Entwicklung mit KI-Unterstützung, Auftrag Josef Walter |

## Geltung

Technische Ableitung der abgenommenen Fachhandbuchkapitel 03, 06 und 07;
keine neue Fachregel. Zugehörig: #281, PR #348,
[Abnahmebericht](u4-reference-sources-acceptance.md).
Die Migration `20261031081340_fib_ris_editorial_structure.sql` ist **nur vorbereitet**.
Code-Merge ist keine Freigabe für Shared-Apps, Deployment oder Automatisierung.

## Physisches Modell

| Fachgegenstand | FIB-Tabellen / Kardinalität | Herkunft / Grenze |
|---|---|---|
| Gremium | `ris_committees` → 0..n `ris_sessions` | beobachteter Name mit `identity_basis=observed_label`; keine erfundene amtliche Gremien-ID |
| Sitzung | `ris_sessions` → 1..n `ris_session_versions` | kanonische RIS-ID/URL, Referenz, Datum soweit vorhanden; Hash, Abrufzeit und strukturierter Snapshot je Änderung |
| TOP | Sitzung → 0..n `ris_agenda_items` | Sitzung/Nummer als stabile technische Identität; veröffentlichte TOP-Detail-URLs zusätzlich im Snapshot; keine Gleichsetzung mit Ereignis |
| Vorlage | TOP → 0..n `ris_proposals` → 0..n `ris_proposal_texts` | RIS-Vorlagen-URL und Referenz; Textfassung nur mit exaktem Dokumentbeleg und Bestätigung |
| Dokument / Anlage | `ris_documents` → 0..n `ris_document_versions`; n:m `ris_document_links` zu Sitzung/TOP | Byte-Hash, Text, Extraktionsverfahren, Beobachtungszeit; Zuordnung zunächst Kandidat; keine Freigabe zur öffentlichen Kopie |
| Niederschrift | bestätigter Dokumentlink `kind=minutes`, nur zur ganzen Sitzung | Verfügbarkeit bedeutet keine Genehmigung; getrennte `ris_minutes_approvals` mit Beleg einer späteren Sitzung |
| Vorschlag / tatsächlicher Beschluss | `ris_suggestions` → bestätigter Vorschlagstext **oder** Beschlussfassung | KI/editorielle Herkunft, Nutzlast, Status, Ersteller, Prüfer und Zeitpunkt; kein automatischer Beschluss |
| Beschlusspunkt | TOP + ausdrücklich zugeordnetes Beschlussereignis → 0..n `ris_decision_points` | mehrere Punkte je TOP; kein globales einzelnes Ja/Nein-Feld |
| Fassung / Abstimmung | Punkt → 1..n `ris_decision_versions` → 0..n `ris_votes` | jede Fassung an Dokumentversion gebunden; Ergebnis `unknown/accepted/rejected/no_vote`; unbekannte Stimmenzahlen `null` |
| Redaktioneller Kontext | TOP n:m Ereignis über `ris_agenda_events` | Rolle unterscheidet Vorlagenveröffentlichung, Behandlung, Beschluss und Niederschriftsveröffentlichung |
| Vorgang / Thema | `ris_relation_suggestions` → vorhandene `event_processes` / `event_topics` | nur bestehende Zielobjekte; Bedeutung beim Thema und Begründung; ausdrückliche Bestätigung |
| Prüfspur | `ris_review_log` | unveränderliche Prüfvermerke; keine DELETE-Rechte für die neuen Tabellen |

Fremdschlüssel sichern insbesondere Sitzung/TOP/Snapshot, Dokument/aktuelle Version
und Beschlusspunkt/Beschlussereignis. Unique-Constraints verhindern doppelte
Identitäten und wiederholte Materialisierung derselben Bestätigung. RLS lässt
keinen direkten Zugriff für `anon`, `authenticated` oder `service_role` zu.
`fib_runtime` erhält nur Rechte auf die konkret benannten FIB-Tabellen; historische
Versionen und Prüfvermerke sind für diese Rolle nicht aktualisierbar.
Die Migration ändert weder `public` noch Default-Grants, Zugangsdaten oder Cron.

## Scanner und Änderungsverarbeitung

`fib-u4-ris-pilot` verwendet den gemeinsamen Parser und Persistenzcode aus
`_shared/ris-structure.ts`. Aktivierung erfolgt ausschließlich über
`FIB_RIS_STRUCTURE_ENABLED=true`; ohne diesen Wert läuft der bisherige Monitorpfad.

1. Freigabelisten liefern Sitzungs- und Vorlagenlinks. Vorlagenseiten liefern
   verknüpfte Sitzungen. Ausschließlich der offizielle HTTPS-Ursprung ist zulässig;
   Weiterleitungen werden abgewiesen.
2. Pro Batch werden höchstens zwei Strukturseiten zusätzlich zu den bisherigen
   Listen-/PDF-Budgets verarbeitet. Bekannte Sitzungen werden in neuen Zyklen erneut
   besucht, damit nachträglich erschienene Niederschriften erkannt werden.
3. Sitzungen, TOPs, Vorlagen und Dokumenthinweise werden atomar mit dem Scanner-
   Checkpoint gespeichert. Fehler lassen keinen vorgerückten Cursor zurück.
   Bei verfügbarer Datenbank wird ein Fehlerlauf samt Quellenlücke dokumentiert.
4. PDFs erhalten Byte-Hashes und Text über fest gepinntes `unpdf@2.1.0`.
   Unbekannte PDFs ohne Sitzungs-/TOP-Kontext bleiben Quellenbeobachtungen.
   Kein OCR, keine automatische Beurteilung des Textinhalts.
5. Download-Queryvarianten derselben Dokument-ID werden kanonisiert; eine bereits
   vorhandene Fundstelle mit alter Download-URL wird wiederverwendet. Mehrdeutige
   bestehende Fundstellen werden zur Prüfung zurückgewiesen. Gleiche Inhalte werden wiederverwendet. Änderungen erhalten unveränderliche
   Versionen. Veraltete Beobachtungen werden zurückgewiesen. Ein Rückwechsel zu
   früheren Bytes setzt den aktuellen Zeiger auf die bereits vorhandene Fassung.
6. Weggefallene Zeilen löschen keine redaktionellen Objekte. Die zuletzt tatsächlich
   beobachteten Snapshot-IDs zeigen den Unterschied zwischen aktuellem Ausschnitt
   und früherem Bestand. Bestätigte oder abgelehnte Links werden nicht durch einen
   erneuten Scan überschrieben.

Das ist ein begrenzter Erfassungsweg, kein historischer Vollständigkeitsbeweis.
TOP-Umnummerierungen, umbenannte Gremien, widersprüchliche Vorlagenlinks und
unbekannte RIS-Seitenformen benötigen Prüfung. Doppelte TOP-Identitäten oder
unvollständige Sitzungsseiten brechen die Verarbeitung ab. Eine mehrdeutige
Vorlagenzeile bleibt im Snapshot belegt und wird nicht beliebig zugeordnet.
PDF-Rotation kann spätere Inhaltsprüfungen über mehrere Aufrufe verteilen.
Das Ausschalten des Features bewahrt den Struktur-Cursor für die spätere Wiederaufnahme;
bestehende Quellenbeobachtungen mit alten URL-Varianten werden nicht gelöscht.

## API und Fachservice

Die vorhandene, **nicht neu deployte** Edge Function `fib-editorial-write` delegiert
`ris_*`-Aktionen an `_shared/ris-editorial.ts`. Verifiziertes Login, AAL2 und aktive
FIB-Mitgliedschaft bleiben Voraussetzung. Der Akteur stammt aus der serverseitig
geprüften Sitzung, niemals aus dem Request. Jede Aktion läuft in einer Transaktion.

| Aktion | Wirkung |
|---|---|
| `ris_read` | interne Sitzungsprojektion mit TOPs, Dokumenttext/-version, Vorschlägen, bestätigten Fassungen und Beziehungen; `source_changed` zeigt neuere Belege |
| `ris_review_document` | Dokumentart und Beziehung mit Begründung bestätigen/ablehnen; Niederschrift bleibt sitzungsweit |
| `ris_accept_finding` | aktuelle Dokumentversion explizit in vorhandene `findings`/`finding_versions` übernehmen; vorhandenen Redaktionstext nicht überschreiben |
| vorhandener `confirmEvent` | getrennte ausdrückliche Ereignisanlage; getestet mit Federführung und Änderungsvermerk; kein neuer RIS-Sonderereignistyp |
| `ris_link_event` | vorhandenes bestätigtes Ereignis mit vorhandener Fundstellenbeziehung einem TOP zuordnen; aktive Ereignissperre erforderlich |
| `ris_suggest` | belegten Text als Vorschlag speichern; noch keine fachlich wirksame Entscheidung |
| `ris_review_suggestion` | Vorschlag bestätigen, zurückstellen oder ablehnen; tatsächlicher Beschluss nur aus bestätigter Niederschrift oder TOP-bezogenem Beschlussdokument, mit Ereignissperre und exaktem Beleg |
| `ris_propose_relation` / `ris_review_relation` | Vorgangs-/Themenbezug vorschlagen und ausdrücklich bestätigen; keine Neuanlage und kein stilles Überschreiben anderer Bedeutung |
| `ris_review_agenda_status` | Verfahrensstand mit aktuellem Textbeleg ausdrücklich prüfen; Abstimmungsergebnis bleibt getrennt |
| `ris_confirm_minutes_approval` | Genehmigung mit exaktem Beleg aus bestätigter Niederschrift einer später datierten Sitzung dokumentieren |

Die generischen Prüfdialoge verwenden UUIDs aus `ris_read`; schreibende Aufrufe
liefern fachliche Kennungen bzw. Status zurück. Die Browser-API akzeptiert als
Vorschlagsherkunft ausschließlich `editor`. Der interne Service kann vorbereitete
KI-Vorschläge verarbeiten; eine vertrauenswürdige KI-Auftragsanbindung ist noch
nicht implementiert. Die Tests liefern solche Kandidaten ausdrücklich als
simulierte interne Ergebnisse. Kein Browser kann sich als KI ausgeben.

Bereits bestätigte/abgelehnte/zurückgestellte Vorschläge sind nicht stillschweigend
wieder zu öffnen. Eine erneute Bewertung benötigt einen neuen Vorschlag; alte
Fassungen und Prüfvermerke bleiben erhalten. Eine veraltete Dokumentversion lässt
sich nicht als aktuelle Entscheidung bestätigen. Der bloße PDF-Fund, ein Link oder
eine Vorlage reichen nicht für einen tatsächlichen Beschluss. Meldungen werden
in keinem dieser Wege automatisch angelegt.

## Tests und Produktionsvorbereitung

- `ris-persistent-contract.spec.ts`: reale HTML-Ausschnitte, fehlende und mehrdeutige
  Angaben, stabile Identität bei späteren Detail-URLs, fremde Hosts, echte
  Textextraktion eines gültigen synthetischen PDFs mit der produktiven Bibliothek.
- `ris-persistence-postgres.spec.ts`: reale reduzierte Niederschrift 15.10.2026,
  echte Migration, regulärer `confirmEvent`, `fib_runtime`, Konkurrenz/Rollback,
  mehrere Punkte/Fassungen, unbekanntes Ergebnis, getrennte Vorschlagstexte,
  Quellenänderungen, falscher Dokumenttyp, RLS und unveränderliche Belege.
- `ris-scanner-structure-postgres.spec.ts`: tatsächlicher Scanner und redaktioneller
  HTTP-Adapter, simuliertes externes HTTP/Auth/PDF-Textresultat, PostgreSQL,
  Ausfall/Wiederanlauf, neue Niederschrift unter bekannter Sitzung, Feature aus,
  AAL1-Abweisung und Schutz gegen vorgetäuschte KI-Herkunft.

Die CI prüft zusätzlich beide vorbereiteten Edge Functions mit `deno@2.9.6 check`;
das ersetzt keinen Supabase-Deployment-/Smoke-Test.

Die beiden PostgreSQL-Tests laufen in dieser Reihenfolge im vorhandenen
`U4 PostgreSQL integration`-Workflow; sie akzeptieren nur localhost/127.0.0.1 und
`fib_u4_test`. Die Testinstallation enthält die bestehenden Runtime-Policies und
die Migration für `object_last_edits`; Superuserzugriff wäre hier kein ausreichender
Fachservice-Nachweis. Nur die Testvorbereitung verwendet den Datenbankeigentümer.

Vor Produktion gesondert freizugeben: schema-spezifische Sicherung/Restore-Plan,
Prüfung des realen Migrations-/Rollenstands, genau diese additive Migration,
Bereitstellung der beteiligten Edge Functions und bewusstes Setzen des Feature-
Schalters. Nicht pauschal historische Runtime-Skripte erneut in Produktion ausführen:
sie enthalten weitergehende Bestandsgrants. Die neuen unveränderlichen Tabellen
müssen ihre engeren Rechte behalten. `FIB_RIS_AUTOMATION_ENABLED` und Cron bleiben
eine unabhängige Freigabe nach #336. Rücknahme: Feature ausschalten, Daten erhalten;
keine destruktive Down-Migration als automatischer Rollback.

## Verbleibende Grenzen

Redaktionelle Ansichten einschließlich Belegdialogen sind in PR #349/#350 umgesetzt.
Fachliche Benutzerabnahme, vertrauenswürdige KI-Produzenten, OCR und vollständige
Erfassung aller RIS-Seitentypen bleiben offen. Die ursprünglichen Komponententests
simulieren HTTP/Auth und führen Handler unter Node aus. Der zusätzliche
[integrierte Prüfstand](u4-integrated-acceptance.md) verbindet die vollständige App,
echtes GoTrue/TOTP und tatsächliche Deno-Handler mit PostgreSQL unter dem Login
`fib_app`. Sein Ergebnis ist gesondert im Abnahmebericht ausgewiesen. Gehostete
Supabase-Laufzeit und Produktions-Smoke-Test sind damit nicht nachgewiesen.
Nachrichten-URL-Aliasse und Langzeitarchivabdeckung bleiben separate Nacharbeiten.

Die integrierte Prüfung deckte eine Treiberdifferenz auf: Bereits serialisierte
JSON-Werte müssen als SQL-Text gebunden und erst serverseitig nach JSONB gewandelt
werden (`::text::jsonb`). Andernfalls kodiert postgres.js den String erneut; ein
Snapshot wird zum JSON-String statt zum Objekt. Derselbe Übergabevertrag gilt für
Prüfvermerke, Vorschläge und Fundstellenmetadaten und funktioniert auch mit dem
node-postgres-Adapter. Keine Schema- oder Produktionsmigration ist hierfür nötig.

## Reguläre Oberflächenanbindung (31.10.2026)

Die API wird jetzt durch Fundstellen und Sitzungen innerhalb der bestehenden App bedient.
`_shared/source-editorial.ts` ergänzt Liste, Detail, Auswahl und explizite Übernahme/
Ereignisanlage. Beziehungsprüfung verwendet denselben Prüfservice für RIS- und
Gemeinde-Ereignisse. API-Vertrag, Freigabegrenze und Tests stehen im
[Bediennachweis](u4-editorial-ui-acceptance.md). Neue UI-Aktionen bleiben wie die
RIS-Struktur hinter `FIB_RIS_STRUCTURE_ENABLED`; keine zusätzliche Migration oder Rechteausweitung.

## Änderungshistorie

| Version | Änderung |
|---|---|
| 1.2 | Gesamtprüfstand, echte Deno-/Runtime-Anbindung und JSON-Parametervertrag dokumentiert |
| 1.1 | Reguläre Oberflächenanbindung und gemeinsamer Quellen-/Beziehungsweg aus PR #349 verknüpft |
| 1.0 | Persistente Fachstruktur, Scanner, API und isolierte Prüfung aus PR #348 |
