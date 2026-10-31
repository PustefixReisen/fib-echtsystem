# U4 – Redaktionelle Prüfung der Referenzquellen

| Version | Stand | Bearbeitung |
|---|---|---|
| 1.3 | 31.10.2026 | Entwicklung mit KI-Unterstützung, Auftrag Josef Walter |

## Geltung und Bereitstellung

Dieses Dokument beschreibt den technischen Bediennachweis zu #281. Fachregeln bleiben
in den Kapiteln 03, 06 und 07 verbindlich; es entstehen keine neuen Freigabestufen.
Gesamturteil und verbleibende Lücken: [Abnahmebericht](u4-reference-sources-acceptance.md).
Physisches Modell: [RIS-Persistenz](u4-ris-persistence.md).

**Implementiert, noch nicht produktiv bereitgestellt.** Datenbankmigration aus PR #348,
Edge-Bereitstellung und Web-Deployment benötigen gesonderte Freigabe. Der bestehende
Schalter `FIB_RIS_STRUCTURE_ENABLED` sperrt auch die neuen internen Quellenaktionen.
Die Oberfläche kennzeichnet diesen Bereitstellungsstand und eine fehlende KI-Anbindung.
Keine Änderung an Memorix, produktiven Daten, Zugangsschlüsseln oder Cron.

Der bisherige Push-Auslöser von `editorial-web-deploy.yml` ist entfernt: Ein Merge
veröffentlicht diese Funktionen nicht. Erst nach gesonderter Produktivfreigabe darf
`workflow_dispatch` mit `confirmation=DEPLOY` ausgelöst werden. Der Parameter hält die
Absicht fest; er ersetzt keine organisatorische Freigabe. Dieser Workflow wurde für
das Arbeitspaket nicht ausgeführt. Die bestehenden CI-Builds bleiben automatisch.

## Reguläre Arbeitswege

- **Recherche → Fundstellen:** gemeinsame Liste übernommener Fundstellen, noch nicht
  übernommener Quellenbeobachtungen und neuer RIS-Dokumentfassungen. Suche/Statusfilter,
  Quellenadresse, Hash, Beobachtungszeit, Versionen und Ereignisbezüge bleiben sichtbar.
  Kein zweiter RIS-Fundstellenbestand. Ab 100 Treffern je Kategorie muss die Suche
  eingegrenzt werden; keine stillschweigende Vollständigkeitsbehauptung.
- **Sitzungen:** Gremium, Sitzung, TOP, Vorlagen und belegte Vorschlagstexte; getrennte
  Beschlusspunkte mit Fassungen, Ergebnis, unbekannten Stimmen und Originalbeleg.
  Sitzungsweite Niederschriften/Anlagen und TOP-Dokumente behalten ihren Kontext.
  Nicht mehr im aktuellen Snapshot beobachtete TOPs und geänderte Beschlussbelege
  werden markiert. Snapshot-Hinweise zeigen mehrdeutige Vorlagen und abgeleitete Identität.
- **Fundstelle → Ereignis:** zuerst bestehendes Ereignis suchen. Zuordnung benötigt
  Begründung und die bestehende Ereignissperre. Ein neues bestätigtes Ereignis ist eine
  eigene ausdrückliche Aktion mit Titel/Begründung; Request-ID verhindert Doppelanlage
  bei Wiederholung. Federführung und letzter Bearbeiter werden gesetzt. Der vorhandene
  Ereigniseditor wird aus den Beziehungen geöffnet; dort führt „Fundstelle öffnen“ zurück.
- **Ereignis → Vorgang/Thema:** nur bestehende Ziele wählen. Der Vorschlag enthält
  Herkunft und Begründung, beim Thema auch Bedeutung. Erst separate Bestätigung mit
  Ereignissperre setzt die Beziehung. Bestehende andere Bedeutung wird nicht überschrieben.
  Zurückgestellte/abgelehnte Vorschläge bleiben sichtbar; neue Bewertung braucht einen
  neuen Vorschlag. Weder Themen noch Vorgänge oder Meldungen entstehen automatisch.
- **Textprüfung:** exakten Wortlaut und Beleg aus aktueller Dokumentfassung eingeben.
  Vorschlag und tatsächlicher Beschluss sind verschiedene Vorgangsarten. Ein tatsächlicher
  Beschluss benötigt bestätigte Niederschrift oder TOP-Beschlussdokument sowie zugeordnetes
  Ereignis; ein Vorlagen-PDF reicht nicht. Fehlende Abstimmung bleibt unbekannt.

Kartenköpfe, Breadcrumbs, zwei Spalten, Statusanzeigen und Aktionen nutzen die bestehenden
UI-Konventionen. Fehlgeschlagene Aktionen behalten Eingaben; Navigation schützt ungespeicherte
Änderungen. Sperren werden über `fib-coordination` erworben und nur bei eigener neuer
Anforderung wieder freigegeben. Authentifizierung/MFA werden nicht im Browser ersetzt.

## Technischer Vertrag

`fib-editorial-write` verwendet `_shared/source-editorial.ts` für `ris_sessions`,
`source_list`, `source_read`, `source_choices`, `source_accept`, `source_create_event`,
`source_propose_relation` und `source_review_relation`. Der Server prüft aktive
Redakteur-/Admin-Mitgliedschaft und menschliche AAL2-Sitzung; Akteur und KI-Herkunft
können nicht durch Request-Felder vorgetäuscht werden. Jede Aktion ist transaktional.

Die Beobachtungsübernahme nutzt denselben extrahierten Kern `reviewed-observation.ts`
wie `acceptReviewedObservation`; Revision, Hash, Scope, Quelle und konkurrierende
Übernahmen werden dort geprüft. Ereignisanlage bildet den bestehenden bestätigten
Fachserviceweg mit Fundstelle, Federführung und Änderungsvermerk als HTTP-Adapter ab;
Begründung und idempotente Request-ID kommen hinzu. Beziehungsprüfung verwendet den
bestehenden RIS-Prüfservice auch für reguläre Gemeinde-Ereignisse. Der technische
Tabellenname `ris_relation_suggestions` begründet keinen RIS-Sondertyp für Ereignisse.

`source_read` liefert Versionen, Ereignisse und Beziehungen; `ris_read` zusätzlich
Gremium, beobachtete Revision, letzte 50 Snapshots und 100 unveränderliche Prüfvermerke.
Es werden keine neuen DB-Rechte, Tabellen, RPCs oder Browserdirektzugriffe eingerichtet.

## Persönliche Nutzerabnahme

Die [Anwenderanleitung](u4-persoenliche-nutzerabnahme.md) beschreibt Zugang, Anmeldung,
die drei Fälle und Rückmeldungen ohne interne Implementierungskenntnisse.
[Einrichtung](u4-user-acceptance-setup.md) ist getrennt dokumentiert.
Die persönliche Abnahme verwendet die bestehende Shared-Apps-Redaktion; die lokale
Standardempfehlung aus #355 ist zurückgenommen. Noch keine neuen RIS-Funktionen
bereitgestellt: [Ist-/Freigabeplan](u4-shared-apps-release-plan.md).

## Reproduzierbarer redaktioneller Prüfdurchgang

Die folgende automatisierte Komponentenprobe läuft nur isoliert. Die persönliche
Abnahme erfolgt nach Freigabe in der bestehenden Shared-Apps-Redaktion.
Die technische Browserfixture ist eine zweite, datenbankfreie Bedienprobe:

```bash
npm install --no-save --no-package-lock playwright@1.56.1
npx playwright install chromium
node tests/ui-source/browser.mjs
```

Sie startet Vite und Chromium selbst, verwendet die echte `SourceWorkspace`-Komponente,
simuliert API/Koordination und blockiert externe Browseranfragen. Reale Bezeichnungen
stammen aus den dokumentierten Referenzen; Bearbeitungstexte sind ausdrücklich synthetisch.
Zusätzliche ausdrücklich synthetische Darstellungsfälle prüfen mehrere Beschlusspunkte,
unbekannte Stimmen statt Null, geänderte Belege, escaped Quelltext und das Abbrechen
einer Navigation bei ungespeicherten Eingaben. Sie verändert keine Produktion. Screenshots: `/tmp/fib-source-ui/` bzw. CI-Artefakt.
Der Test prüft die Übergabe an den Ereigniseditor als Callback; die authentifizierte
Navigation der gesamten App wird zusätzlich im [integrierten Prüfstand](u4-integrated-acceptance.md)
mit tatsächlichem GoTrue/TOTP, Deno-Handlern und PostgreSQL geprüft. Der dortige CI-Status
ist gesondert zu beachten; dieser Komponententest allein belegt den Gesamtpfad nicht.

1. Sitzungen → **GR/440/2026, 29.10.2026**, TOP 2 und TOP 3. Gremium/Datum/Titel mit
   [Original](https://buergerinfo-feldkirchen.digitalfabrix.de/si0057.asp?__ksinr=1032)
   vergleichen. TOP 2: Vorlage 5395/2026, Dokument 75714; TOP 3: Vorlage 5397/2026,
   Dokument 75790. Die gespeicherten HTML-Ausschnitte sind keine vollständige Tagesordnung.
2. Unsichere Dokumentbeziehung und noch nicht belegten Beschluss erkennen. Original
   öffnen; Dokumentfassung über „In Fundstellenverwaltung öffnen“ prüfen. Titel bewusst
   vergeben und Fundstelle ausdrücklich übernehmen. Es entsteht noch kein Ereignis.
3. Bestehendes Ereignis suchen oder die Veröffentlichung/Behandlung als neues Ereignis
   ausdrücklich bestätigen. Nicht die Vorlage als Beschluss bezeichnen. Ereignis öffnen,
   Fundstellenbezug mit Begründung prüfen, über „Fundstelle öffnen“ zurückkehren.
4. RIS-Kontext öffnen, Dokumentart/Beziehung begründet bestätigen und denselben TOP mit
   dem Ereignis in der passenden Rolle verbinden. Vorschlagstext mit exaktem Beleg
   speichern, anschließend ausdrücklich bestätigen. Er erscheint nicht als Beschluss.
5. Bestehenden Vorgang oder Thema auswählen, Bedeutung/Begründung prüfen. Vorschlag
   zunächst offen sehen; erst Bestätigung setzt den Bezug. Ablehnen/Zurückstellen mit
   einem gesonderten Vorschlag testen, Prüfverlauf kontrollieren.
6. Tatsächliche Beschlüsse nur mit verifizierter Niederschrift prüfen. Der reale
   Vergleichsfall 15.10.2026 (Sitzung 1031, Dokument 75785) enthält TOP 2 ohne Abstimmung,
   TOP 3 abgelehnt und TOP 6 mit mehreren Punkten. Die Sitzung 29.10.2026 wird nicht durch
   erfundene Beschlussdaten ergänzt. Genehmigung und Dokumentverfügbarkeit unterscheiden.
7. Fundstellen → Gemeinde Feldkirchen → Nachricht „Neues Parkraumkonzept in Feldkirchen“:
   dieselbe Übernahme, Ereigniszuordnung und Themenprüfung durchführen. Der gespeicherte
   Nachrichtenbestand enthält technische Beobachtungen; vollständigen Text am Original
   prüfen. Änderungen erzeugen eine neue übernehmbare Revision, keine zweite Identität.
8. Veraltete Revision, fremde Ereignissperre, fehlende MFA, Wiederholung nach Fehler und
   unbekannte Informationen prüfen. Keine Nachricht darf allein durch Übernahme entstehen.

## Grenzen dieser Ausbaustufe

- Produktions-Migration/Deployment und fachliche Nutzerabnahme bleiben offen. Kein grüner Test ersetzt die inhaltliche Redaktionsentscheidung.
- KI-Produzent, vorläufige Ereignisse (#260), automatische Relevanzbewertung und vollständige
  redaktionelle Status-/Massenbearbeitung der Recherche sind nicht Bestandteil dieses Wegs.
- Verfahrensstand und Niederschriftsgenehmigung haben seit PR #350 eigene Belegdialoge.
  Die Genehmigung bleibt von der bloßen Dokumentverfügbarkeit getrennt; ohne späteren
  Quellenbeleg kann sie nicht bestätigt werden. Beide Dialoge sind im integrierten
  Prüfablauf enthalten; das positive Genehmigungsbeispiel ist ausdrücklich synthetisch.
- Vollständige Artikeltexte, OCR, historische Quellenabdeckung, Identitätswechsel und
  vollständige ältere Prüfchronik bleiben im Abnahmebericht als Restarbeit erfasst.

## Änderungshistorie

| Version | Änderung |
|---|---|
| 1.3 | Verbindlichen Shared-Apps-Weg und noch ausstehende Bereitstellung korrigiert |
| 1.2 | Persönliche Anwenderanleitung und getrennten Einrichtungsweg #354/#355 ergänzt |
| 1.1 | Dialoge aus PR #350 und getrennten Gesamtprüfstand aus PR #353 verknüpft |
| 1.0 | Reguläre Quellen-/Sitzungsansichten, Prüfdurchgang, API-/Testgrenzen und manuelle Bereitstellungsgrenze dokumentiert |
