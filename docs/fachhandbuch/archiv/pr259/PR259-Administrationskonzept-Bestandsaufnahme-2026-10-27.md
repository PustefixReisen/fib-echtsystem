# Administrationskonzept – Bestandsaufnahme bestehender FIB-Vereinbarungen

**Stand:** 27.10.2026 · **Arbeitsstatus:** Quelleninventur für ein eigenständiges Administrationskonzept; keine neue fachliche Entscheidung und kein Ersatz der Primärdokumente.

## Ziel und Abgrenzung

FIB benötigt ein eigenes Administrationskonzept als aus bestehenden Vereinbarungen abgeleitete, prozessorientierte Beschreibung. Es soll keine parallele Regelsammlung mit konkurrierenden Aussagen werden. Das Fachhandbuch regelt das redaktionelle Fachgeschehen; die Administration verwaltet dessen Rahmenbedingungen. Technische Betriebskonzepte spezifizieren anschließend die Implementierung.

## Vorhandene Vereinbarungen und Quellen

| Administrationsbereich | Bisherige Quelle | Bereits erkennbare Anforderungen |
|---|---|---|
| KI-Leitfaden und fachliche Regelverwaltung | `docs/KI-Leitfaden.md`; `docs/Recherche-und-Quellenmonitor.md` (Regelverwaltung und Regeltests) | Versionierter operativer Regelbestand; Entwürfe im KI-Dialog; Widerspruchsprüfung, Wirkungsproben, menschliche Bestätigung und kontrollierte Aktivierung |
| Quellenverwaltung | `docs/Recherche-und-Quellenmonitor.md` §§4–13 | Quellenklassen, Pflicht- und weitere Quellen, regelmäßige Direktprüfung, Quellenentdeckung, Fehlerbehandlung, regionale Suchabdeckung |
| Bewertung von Recherche-Regeländerungen | `docs/Recherche-und-Quellenmonitor.md` (Regelverwaltung und Regeltests) | Bewertungswirkung auf bestehende Fundstellen und Entdeckungswirkung bei Probe-Recherche unterscheiden; Test nicht in regulären Arbeitsbestand übernehmen |
| KI-Modelle und Anbieter | `docs/KI-Betrieb-und-Kosten.md` §§10–14; `docs/KI-Qualitaet-und-Modellunabhaengigkeit.md` | Vergleich zuerst nach aufgabenspezifischer Qualität, dann nach Kosten, Datenschutz, Integration, Stabilität und tatsächlichen FIB-Testergebnissen |
| KI-Routing und Qualitätssicherung | `docs/KI-Betrieb-und-Kosten.md` §12 | Konfigurierbare Routing-Matrix; Primär- und Review-Modell; gezielte Eskalation/Fallback; zunächst 5 % Stichprobe nicht eskalierter Fälle zur Nachprüfung im Pilotbetrieb |
| Kosten und Budget | `docs/KI-Betrieb-und-Kosten.md` §§3–9 | Kostenprotokollierung, Begrenzung, Budgetsteuerung, Wiederverwendung persistierter KI-Ergebnisse |
| Benutzer, Rollen und Sicherheit | `docs/Rollen-Rechte-und-Workflow.md` §§2–13; Kapitel 11 des Fachhandbuchs | Interne Einladung, Rollen, MFA, Deaktivierung, Administrationsvorbehalte, Audit, kurzfristig wirksamer Rechteentzug und Sperren |
| Öffentliche Nutzung und Besucheranalyse | `docs/UX-und-Informationsarchitektur.md`; **weitere Primärquellen noch zu ermitteln** | Bereits dokumentiert: lokale, anmeldefreie Anzeige „Neu seit letztem Besuch“ und freiwillige Push-Funktion. Eine belastbare Regelbasis zur aggregierten Besuchsanalyse ist mit den bislang überprüften Abschnitten **noch nicht belegt**. |
| Betrieb, Fehler und Datenpflege | `docs/Persistenz-und-Lebenszyklusmodell.md`; `docs/Recherche-und-Quellenmonitor.md` §13 | Fachhistorie erhalten, Betriebsdaten abgrenzen, Quellenfehler nachvollziehen; Details der Betriebsüberwachung und Verwaltung separat inventarisieren |

## Ergänzung 28.10.2026 – Besucheranalyse und KI-Prüfbericht

Die **aggregierte, datensparsame Besucheranalyse** des öffentlichen FIB-Angebots gehört in das eigenständige **Administrationskonzept**; fachliche Zweckbestimmung und Transparenz werden im öffentlichen Fachkapitel 09 berücksichtigt. Als Planungsfragen werden vorgemerkt: Aufrufe von Meldungen, Vorgängen und Themen, Nutzungswege und Suchanfragen, Nutzung von „Mehr wissen?“, RSS und Newslettern. **Konkrete Messverfahren, Rechtsgrundlagen, Einwilligungserfordernisse, Löschfristen und Darstellung der Auswertungen sind noch nicht festgelegt.** Es wird weder ein persönliches Besucherprofil noch Tracking ohne rechtliche Prüfung als beschlossen vorausgesetzt.

Der administrative **KI-Qualitäts- und Kostenbericht** soll Qualitätswerte je FIB-Aufgabe, Kontrollstichproben, Fehlerarten, Modell-/Routingentscheidungen, Kosten und zeitliche Entwicklung enthalten. Zur Planung stehen monatliche Auswertungen im Pilotbetrieb und mindestens vierteljährliche im Regelbetrieb sowie anlassbezogene Prüfungen; die endgültige Taktung ist bei Implementierungsbeginn festzulegen.

## Empfohlene Gliederung des späteren Administrationskonzepts

1. Ziel, Rollen und administrative Verantwortlichkeiten
2. Administration von Benutzern, Zugängen und Berechtigungen
3. Quellenbestand und Quellenmonitor
4. Pflege des KI-Leitfadens und versionierter Fachregeln
5. Regeltests und kontrollierte Aktivierung neuer Fassungen
6. KI-Anbieter, Modelle, Qualitätsvergleich und Routing
7. Kosten, Budgets und Ressourcenkontrolle
8. Besucheranalyse, Datenschutz und öffentliche Nutzungskennzahlen
9. Betriebsüberwachung, Fehlerbearbeitung und Wartung
10. Datenpflege, Historie, Archivierung und Wiederherstellung
11. Administrative Bedienoberfläche und Abnahmefälle

## Prüf- und Migrationsvorgehen

Für jeden Abschnitt: bestehende Quelle finden, exakte Festlegung übernehmen, mögliche konkurrierende Aussagen sichtbar machen und nur echte fachliche Lücken zur gemeinsamen Entscheidung vorlegen. Die fachlichen Regeltexte bleiben in ihrer maßgeblichen Quelle nachverfolgbar. Keine technischen Festlegungen oder Datenschutzannahmen aus bloßen Konzeptüberschriften ableiten.

**Offen:** Spezifische bestehende Dokumentation zur Besucheranalyse lokalisieren; weitere Administrations- und Governance-Quellen vollständig inventarisieren. Das Fachkonzept PR #259 hat weiterhin Vorrang bei der Fertigstellung.
