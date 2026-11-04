# FIB – Fach- und Umsetzungsabgleich Administration / Informationsgewinnung

**Stand:** 04.11.2026 · **Status:** Arbeitsentwurf zu [Issue #394](https://github.com/PustefixReisen/fib-echtsystem/issues/394); kein neuer fachlicher Abnahmebeschluss, keine technische Implementierung.

## Ziel und Dokumentationszuständigkeit

Das **verbindliche Fachkonzept** für Informationsgewinnung bleibt [Fachhandbuch 03](fachhandbuch/03-Recherche.md). Das [logische Datenmodell](Datenmodell.md) integriert die Fachobjekte. Hier werden **existierende Anforderungen, echte Lücken und Umsetzungsreihenfolge** nachvollziehbar abgeglichen. Weder Suchparameter noch Relevanzregeln sollen dauerhaft ein zweites Mal in Markdown als aktiver operativer Regelbestand gepflegt werden.

Nach der kontrollierten Einführung bestimmt der **aktivierte versionierte FIB-Datenbestand**, welche operative Such-/Relevanzkonfiguration gilt; das Fachhandbuch definiert Ziele, Grenzen, Rechte und Verfahren. Einführung durch überprüften Ausgangsimport, Test, Aktivierung und Audit, nicht durch stillen Austausch von Dateien.

## Bestandsabgleich – belegte Fachstruktur

| Bereich | Verbindliche vorhandene Grundlage | Offene Ergänzung/Prüfung |
|---|---|---|
| Dynamischer Recherchehorizont | FH03 §03.1, HORIZONT-001/002: Orte, funktionale Beziehungen, allgemeine Recherchefelder, Quellen, FIB-Wissen und Regeln; sichtbar und pflegbar | Zusammensetzung/Versionierung/Provenienz des jeweils aktiven Horizonts und UI |
| Quelle/Quellenmonitor | FH03 §03.1b, §03.5b; Datenmodell §5; RIS mit eigener objektgetreuer Struktur | Quellenregister, Scopes/Adapter, Prüfabruf, Aktivierung, Fehler-/Nachholfenster nachweisen |
| Referenzobjekte | Datenmodell §9: Referenzobjekt, Referenzbezeichnung und Referenzbeziehung, Status vorgeschlagen/bestätigt/zurückgenommen | Orts-, Infrastruktur-, Akteurs- **und thematisch-funktionale** Verbindungen modellieren und benutzbar machen |
| Referenzmaßstab | Datenmodell §10: versionierter Maßstab mit drei Ebenen – allgemein, demokratisch-gesellschaftlich, grün-politisch | Abgrenzung zu Quellen-/Hintergrunddokumenten, Leitlinien, Regeln und Referenzfällen in UI/Datenmodell explizit machen |
| Perspektive | Datenmodell §4 und FH03 §03.2.2: wertungsfreier Betrachtungsaspekt von Analysen | Wiederverwendung ohne verpflichtende starre Suchfilter; keine unbeabsichtigte politische Verzerrung |
| Beobachtungsauftrag | Datenmodell §6.1, FH03 §03.3: ein Primärbezug (Vorgang/Thema/offene Frage), aktiv/pausiert/beendet | Admin-/Redaktionsworkflow und Auslöser der Suchläufe |
| Recherchelauf | Datenmodell §6.2 und FH03 §03.3: einzelne protokollierte Ausführung, auch ohne Auftrag | Kontext-/Regelversion, Suchwege, Kosten, Treffer/Fehler und Vergleich sichtbar machen |
| Recherche-/Relevanzregel | Datenmodell „Recherche- und Relevanzregeln als operativer Regelbestand“, FH03 REGEL-001/002 | [#393](https://github.com/PustefixReisen/fib-echtsystem/issues/393): zentraler Adminworkflow Entwurf → Vergleich/Test → Aktivierung → Audit/Rücknahme |
| Fachliche Schwellenwert-/Statusregel | Datenmodell §17: zentral pflegbare Parameter, **kein beliebig ausführbarer Code** | Überschneidung und Grenzen gegenüber allgemeinen Relevanzregeln vor physischer Modellierung klären |
| Fach-/Referenzfälle | FH03 §03.6, bekannte Demonstrator-Lücken und #265 | Falltypen trennen: veranschaulichende KI-Einordnung vs. **unabhängige** Regression/Blindprüfung; fachlich bestätigte erwartete Ergebnisse und Versionen |

### Begriffsklärung

- **Hintergrunddokument / Referenzwissen im weiteren Sprachgebrauch:** z. B. Parteiprogramm der Grünen; als Quelle mit Herkunft/Gültigkeit führen. Ein solches Dokument ist **keine automatisch geltende Nachrichtenselektionsregel**. Explizit ausgewählte Aussagen können als *Referenzmaßstab* versioniert werden.
- **Referenzobjekt:** stabile Identität eines Ortes, Akteurs, einer Infrastruktur oder einer geeigneten fachlichen Einrichtung; Aliasnamen und quellenbelegte räumliche/thematisch-funktionale Beziehungen. Änderungen eines aktuellen Planungsstands sind dagegen Ereignisse, nicht neue unveränderliche Referenzidentitäten.
- **Referenzmaßstab:** deklarierter normativer/fachlicher Bewertungsmaßstab nach Datenmodell §10, getrennt von Tatsachen- und Quellenlage. Die gesellschaftlich-demokratischen Bewertungskriterien sind nach FH03 §03.5c noch **nicht verabschiedet** und bleiben bis dahin inaktiv.
- **Rechercheleitlinie:** fachliches Suchziel/Suchraumprinzip, z. B. direkter oder begründeter funktionaler Bezug zu Feldkirchen; im Fachhandbuch verankert.
- **Referenzfall:** konkreter begründeter Fall, der eine Entscheidung erklärt und ggf. als Testfall dient. Unabhängige Blindtests nicht vollständig an den KI-Kontext ausliefern.
- **Perspektive:** wertungsfreier Analyseaspekt (z. B. Verkehrssicherheit, Lärm); keine verpflichtende Suchwortliste und keine Akteursposition.
- **Operative Regel:** aktive, strukturierte und versionierte Bedingung/Auswirkung; mit Audit, Test, Berechtigungen und nachvollziehbarer Anwendungsfassung.

## Konzeption Administration → Informationsgewinnung

**Einstieg / Kontrollübersicht:** aktive Quellen/Scopes und letzte erfolgreiche Überwachung, Probleme/Nachholfenster; aktiver Suchhorizont und verwendete Version; offene Regel-/Referenzvorschläge; Recherchequalität und letzte Läufe. Automatisierte erfolgreiche Routinen erzeugen nicht unnötig menschliche Aufgaben.

**Fachliche Arbeitsbereiche (eine konsistente Oberfläche, keine zwingend separaten Menüpunkte/Tabellen):**

1. **Recherchehorizont:** fachliche Leitlinien (verbindlicher Rahmen), pflegbare Recherchefelder, Orte, Bezüge, Quellen und gültiger Regelkontext; anzeigen, welche Bestandteile redaktionell bestätigt und welche automatisch vorgeschlagen sind.
2. **Referenzverwaltung:** Referenzobjekte/-bezeichnungen/-beziehungen, Hintergrunddokumente, Maßstäbe, Perspektiven, Referenzfälle; getrennte fachliche Rollen und gezielte Beziehungen, nicht zusammenhangloser Wissensspeicher.
3. **Quellenregister:** Quelle, URLs/Feeds, Scopes, Kern-/Ergänzungsstufe, Pflichtstatus, Zugangsadapter, Prüf- und Nachholhistorie; RIS als spezialisierter Monitor innerhalb derselben Quellenverwaltung, strukturgetreue RIS-Objekte zusätzlich zu Dokumentfundstellen.
4. **Suchsteuerung und Rechercheaufträge:** generierte Suchwege nach aktuellem Horizont statt obligatorischer Stichwortliste; systematische Standardsuche, KI-Erweiterung und bedarfsweise Nachrecherche. Suchläufe einschließlich Fehler/Lücken protokollieren.
5. **Relevanzregeln/Qualität:** gemeinsamer operativer Regelbestand für Fundstellen sowie Ereignisbezüge zu Meldungen/Vorgängen/Themen; Vorher-/Nachher-Vergleich von **Entdeckungsquote und Einordnungsqualität**, Kosten; Aktivierung durch Berechtigte. Umsetzung im Paket #393.

**Einheitlicher Veränderungsweg:** Vorschlag → fachliche Prüfung → angemessener Test/Simulation → kontrollierte Aktivierung. Beim Erweitern des Referenzwissens sind Belege/Bestätigung zentral; bei Quellen ein tatsächlicher Adapter-/Scope-Test; bei Regeln Blindfall-/Regressionstests. Alle effektiven Änderungen mit Autor, Begründung, Gültigkeit und Historie protokollieren.

### Wie wird Trefferqualität steuerbar?

Die tatsächliche Fundquote hängt **nicht nur** vom KI-Modell ab. Steuerbar sind Quellenabdeckung, Recherchefelder und räumliche/thematische Beziehungen, Suchrichtungen, Wiedervorlagen, Nachrecherche, Referenzfälle und Regelversionen. Testumgebung vergleicht sowohl **Recall** (Anteil relevanter veröffentlichter Objekte gefunden) als auch **Precision** (Anteil der Funde tatsächlich relevant), zusätzlich Aufwände und Fehler. Ergebnisvarianten mit bekannten Demonstrator-Fehlfällen und zunächst nicht in den KI-Kontext aufgenommenen Blindfällen prüfen.

## Durchführung ohne Wasserfall

1. **Technische Bestandsaufnahme** der existierenden Tabellen/Migrationen, Fachservices, UI, Rollen und Tests – weder aus konzeptioneller Dokumentation noch aus Dateinamen auf eine produktive Implementierung schließen. Noch **nicht vollständig ausgeführt**, daher keine Produktivstände als gesichert behaupten.
2. **Fachliche Begriffe konsolidieren** (Hintergrunddokument, Referenzmaßstab, Referenzobjekt, Perspektive, Referenzfall, Leitlinie, Regel), Unterschiede gezielt in FH03 und Datenmodell verankern; bestehende Fachbeschlüsse nicht überschreiben.
3. **Vertikaler Minimal-Slice:** zunächst Horizont und Referenzobjekte ansehen, Vorschlag mit Beleg erfassen, bestätigen/ablehnen und aktive Version im nächsten Recherchelauf tatsächlich verwenden.
4. **Quellenregister und Suchlauf-Kontrolle** integrieren, RIS-Wiederverwendung erhalten; keine separate zweite Quelleninfrastruktur.
5. **Regelpflege #393 und Prüfstand #265** verzahnen; kontrollierte Startdatenmigration und Aktivierung als operative Quelle der Wahrheit.
6. E2E-Nachweise mit Direktfund, funktional indirektem Fund (Radschnellweg), relevanter Meldung ohne Ortsnamen, RIS-Objekt und irrelevanten Kontrollfällen; Rechte, Audit, Wiederanlauf und Nichtbeeinträchtigung von Memorix prüfen.

**Roadmap:** U1 Daten/Services und sichere Tests, U2 Administration/UI, U4 Recherche und operative Engine, U6 E2E-Qualität; U5 Bereitstellung als paralleles querschnittliches Paket. Strategische U1–U6-Phasen bleiben stabil; operative Reihenfolge nach Testerkenntnissen fortschreiben.

## Noch offene fachliche Entscheidungen

- **Katalog der Hintergrunddokumenttypen:** Wann genügt Quellen-/Dokumentablage, wann entsteht daraus ausdrücklich ein Referenzmaßstab?
- **Referenzfälle:** Welche Mindestfelder braucht ein Fall (Sachverhalt, Belege, erwartetes Ergebnis, betroffene Leitlinie, Version) und wie trennen wir Trainings-/Einordnungsfälle von Blindtests?
- **Horizontaktivierung:** Versionieren wir eine gemeinsame Horizontzusammenstellung oder einzelne Bausteine mit reproduzierbarem Snapshot je Recherchelauf? Vorschlag: Bausteine mit Versionen, dazu unveränderlicher Lauf-Snapshot.
- **Perspektiven:** Nur Analysebibliothek oder optionaler Kontext für Suchaufträge? Keine stillschweigende globale Suchbeschränkung.
- **Regelgrenzen:** Abgrenzung frei formulierbarer fachlicher Leitlinien von systemseitig zulässigen ausführbaren Regeltypen (Datenmodell §17).

**Nächster fachlicher Meilenstein:** Bestandsabgleich der vorhandenen technischen Tabellen/Fachservices und ein kleiner klickbarer Administrations-Slice. Dieses Dokument ist kein Produktivauftrag und ersetzt nicht die Fachabnahme.
