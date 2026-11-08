# RIS-Abnahmenacharbeit #403 – technischer Stand und Nachabnahme

Stand: 08.11.2026. Bezug: #403, Befunde #377, persönliche Abnahme #356.
Keine Bereitstellung, produktive Migration, Datenkorrektur oder Automation mit diesem PR.

## Ursachen und Änderungen

| Befund | Nachgewiesene Ursache / Änderung |
|---|---|
| Drei statt 19 TOPs am 15.10. | Der bewusst reduzierte Referenzimport enthält TOP 2/3/6. Lesender Shared-Apps-Abgleich am 08.11.: Sitzung 1031, Revision 1, drei TOPs, Beobachtung vom 01.11.; RIS-Quelle aktiv, Scopes candidate, Cursor ohne structureState. Das beweist keine vollständige reguläre Erfassung. Die tatsächliche aktuelle Edge-Konfiguration wurde nicht ausgelesen. |
| Titel enthält Status | Parser übernahm die ganze Titelzelle einschließlich Beschlussblock. Jetzt nur TOP-Ankertitel; beobachteter Status separat im vorhandenen Snapshot-JSON, ohne Schemaänderung oder automatische fachliche Bestätigung. Legacy-Titel werden nur bei der Anzeige aufgeteilt. |
| Niederschriftkarte ohne TOP-Ergebnis | Bestehende strukturierte Beschluss-/Abstimmungsangaben werden als Absätze je Beschlusspunkt gemeinsam mit dem Original-Link angezeigt. Keine isolierten Zahlenfelder, keine wörtlichen Niederschrifttexte, keine Ableitung aus Vorschlägen. Fehlende Angaben bleiben ausdrücklich unbekannt. |
| Pflichtbegründung / fehlende automatische Belege | Der bisherige Weg setzte eine Dokumentversion voraus und setzte keine Standardbegründung. Nun Metadaten-Fundstellen im bestehenden Import-/Zuordnungsweg, atomar und idempotent mit TOP-/Sitzungsbegründung. Nur physisch dem TOP zugehörige Vorlagen/Anlagen/Beschlussdokumente; keine sitzungsweite Niederschrift und keine Fremdfundstellen. |
| Nachträge | ensureRisFinding ergänzt die Dokumentbeziehung auch für bestehende manuelle TOP-Hauptereignisse. Mehrere TOPs aggregieren ihre Belege; keine automatische TOP-Ereignis-Entscheidung. Aufhebung löscht nur den gewählten TOP-Bezug. |
| Mobile Suche | Vorhandene Desktop-Suche bleibt bestehen. Generation wird bereits beim Tastendruck invalidiert, statt erst beim nächsten verzögerten Request; Suchkontextwechsel löst neue Abfrage aus. Der konkrete persönliche Smartphonefehler ist damit noch nicht live reproduziert. |
| Zuordnung direkt speichern | Im aktuellen main bereits vorhanden; erhalten und in Komponenten-/DB-Tests geprüft. Nur Ereignisneuanlage und Freitextbearbeitung behalten Speichern/Abbrechen. |
| Wirkungsloses Bearbeiten | Fehlgeschlagener Sperrerwerb wird unmittelbar an der Ereigniskarte erklärt; fremde Sperre und offene Fundstellenbearbeitung erhalten lokale Hinweise. Der genaue Handy-Auslöser wurde nicht bewiesen. |
| Pessimistische Sperre | Fundstellenbegründung erwirbt die vorhandene Ereignissperre bereits vor Texteingabe, erneuert sie während der Bearbeitung und gibt sie nach Speichern/Abbrechen/Navigation frei. Dirty-Guard umfasst diese Eingaben. Koordinationsanzeige wird während Ereignisansicht regelmäßig neu gelesen. Federführung bleibt unabhängig. |
| Historie | Manuelle RIS-Ereignisbeziehungen aktualisieren nun die vorhandenen Letzte-Bearbeitung-Metadaten neben dem RIS-Audit. Vorhandenes edit_event schreibt bereits updated_at und object_last_edits; keine neue Historienlösung. |
| GEÄNDERT 14.10. | Im aktuellen Repository kein solcher Generator gefunden; lesend genau ein Ereignis mit diesem gespeicherten Freitext nachgewiesen. Kein automatischer Zeitstempel. Ursprung der persönlichen Texteingabe nicht nachgewiesen; keine produktive Textbereinigung. |
| Sammellinks | do*.asp und Sitzungsnavigation ohne konkrete Sitzungs-ID werden als allgemeine RIS-Navigation getrennt angezeigt; gespeicherte Beziehungen bleiben erhalten. Konkrete Dokument-/Sitzungslinks bleiben erhalten. |

## Recht und Vollständigkeitsgrenze

Die öffentliche RIS-Sitzungsseite lieferte im Arbeitskontext HTTP 403. Die reale
Liste aller 19 TOPs konnte daher nicht neu abgerufen und geprüft werden. Der
vorhandene reale reduzierte Ausschnitt prüft TOP 2 abgesetzt, TOP 3 abgelehnt
und TOP 6 einstimmig angenommen. Ein zusätzliches **synthetisches** 19-TOP-Beispiel
prüft Parser und tatsächlichen Datenbankimport einschließlich TOPs ohne Vorlagen;
es ist ausdrücklich kein Nachweis aller 19 realen Titel oder historischer Abdeckung.
Ein genehmigter regulärer Quellenlauf mit Zählprobe bleibt erforderlich. Keine
Aktivierung des Monitors oder nachträgliche produktive Datenübernahme im PR.

Für die wörtliche Übernahme von Niederschriftabschnitten fehlen belastbare
Rechtebelege. Die öffentliche Abrufbarkeit allein ist keine Speichererlaubnis;
auch eine pauschale Einordnung als amtliches Werk nach §5 UrhG wird hier nicht
vorausgesetzt. Zu klären sind konkrete Urheberschaft, Veröffentlichungsbedingungen,
Drittinhalte und zulässiger Nutzungsumfang. Bis dahin nur strukturierte sachliche
Ergebnisangaben und Original-Link. Keine neuen PDF-/Volltextspeicherwege und keine
Rechtebestätigung für reale Unterlagen. Vorhandene Speicherfunktionen werden mit
diesem Paket weder aktiviert noch erweitert. Rechtliche Klärung blockiert die
gewünschte wörtliche Anzeige, nicht die übrigen Korrekturen.

## Prüfungen

Lokal erfolgreich: TypeScript Core und Frontend, regulärer Vite-Build, 28 Fachservicefälle,
vollständige test:u4-Suite, Chromium-Komponenten-Browsertests auf Desktop und Mobile
mit simulierten APIs. Erweitert: mehrere Beschlusspunkte, Inline-Stimmendaten,
Original-Link und keine Wiedergabe ungeklärter Wortlaute.

Echter isolierter PostgreSQL 17: Metadatenimport, RLS/MFA-Abgrenzung, doppelte
Aufrufe, mehrere TOPs für ein Ereignis, spätes Dokument ohne Dokumentversion,
Standardbegründung, Audit, Aufhebung ohne Datenverlust und 19 synthetische TOPs.
Bestehende Tests verwenden ausschließlich synthetische Storage-Erlaubnisse;
sie bestätigen keine Rechte für echte Dokumente. Keine persönliche Live-MFA- oder
Smartphone-Gesamtabnahme und kein Nachweis authentifizierter mobiler App-Sperren
allein durch diese Komponentenprüfungen. CI am PR bleibt zusätzlicher Nachweis.

## Gezielte persönliche Nachabnahme nach gesondertem Release

1. Sitzung 15.10. öffnen: Bestandskennzeichnung, getrennte Titel-/Statuszeile,
   TOP 2 abgesetzt und TOP 3 anhand des Original-RIS prüfen. Nach kontrolliertem
   vollständigem Import 19 öffentliche TOPs und deren Identitäten zählen.
2. Niederschriftkarte: Beschlusspunkte und mehrere Abstimmungen in getrennten
   Absätzen, keine erfundenen Stimmen, vollständiger Original-Link. Keine Volltexte.
3. Smartphone und PC im selben Bestand: Titel, deutsches Datum, ISO-Datum und
   Kurzbeschreibung suchen, schnell tippen/löschen, Treffer auswählen; keine
   Sitzungsereignisse in Weitere Ereignisse. Zurück zum aufrufenden TOP.
4. Bestehendes Ereignis bewusst zuordnen, Seite neu laden: Beziehung sofort
   persistent, kein globaler Speicherauftrag. Zwei TOPs demselben Ereignis zuordnen,
   zugehörige Dokumente ohne Begründungseingabe und ohne Dubletten prüfen.
5. Späten Dokumentnachtrag in isolierter/gesondert genehmigter Erfassung prüfen.
   TOP-Verknüpfung aufheben: Ereignis, Fundstellen und andere Bezüge bleiben erhalten.
6. Ereignis- und Fundstellenbegründung bearbeiten: konkurrierende zweite Sitzung
   erhält Sperrhinweis; Speichern/Abbrechen/Zurück gibt Sperre frei. Federführung,
   aktive Sperre und letzte Änderung separat kontrollieren. Freitextmarker wird
   nicht als automatische Historie ausgegeben.

#377/#356 bleiben bis zur persönlichen Nachabnahme offen. Der PR schließt #403
nicht automatisch: reale Vollständigkeitsprüfung und mobiler Gesamtpfad sind
vor einer uneingeschränkten Bereitstellungsbereitschaft noch nachzuweisen.
