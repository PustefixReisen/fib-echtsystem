# PR #259 – Quellenabgleich: Konsolidierte Geltungs- und Konfliktauflösung

**Stand 28.10.2026 – nach fachlicher Durchsicht aller elf Kapitel.** Dieses Dokument trennt (A) beschlossene Normänderungen, (B) unverändert fortgeltende Detailregeln und (C) gesonderte technische bzw. administrative Konkretisierungen. Quellen werden durch neue Lesefassung nicht stillschweigend aufgehoben.

## Verbindliche Vorrangregel für die Migration

1. Bei tatsächlichem Normwiderspruch gilt die **jüngste ausdrücklich fachlich bestätigte Entscheidung** im neuen Fachhandbuch. Eine bloße Umformulierung in einem Entwurf schafft **keinen** Vorrang. Im Zweifelsfall gilt der ältere eindeutige Fachwortlaut weiter, bis die Abweichung ausdrücklich geklärt ist.
2. Alle **nicht widersprechenden Detailregeln** der alten Primärquellen (einschließlich Ausnahmen, Statuswerten, Rechtevorbehalten und Qualitätsprüfungen) bleiben **durch Verweis Bestandteil des fachlichen Regelbestands**. Die Migration darf deren Geltung nicht durch Nichtnennung im Lesetext beseitigen.
3. Normative Fachregeln, technische Implementierungsverträge, redaktioneller Sprachleitfaden und Gestaltungsregeln sind als unterschiedliche Geltungsebenen ausgewiesen, ohne unbelegte Normänderung.
4. Die vorliegende **Quellenkonsolidierung** ist abgeschlossen, sobald Konfliktfälle ausdrücklich entschieden sind; die **physische Ablösung aller einzelnen Altdateien** ist ein eigener dokumentarischer Schritt. Diese Datei behauptet **nicht**, dass jeder unnummerierte Satz gegen einen Zielabschnitt getestet wurde.

## Belegbare Entscheidungen über ältere Aussagen

| Sachgebiet | Alte Quelle | Jüngere bestätigte Regel | Konsequenz |
|---|---|---|---|
| „Mehr wissen?“ | `Mehr-wissen-Modell.md` §2, §8: nur Meldung/Thema, Vorgang als Primärkontext im MVP ausgeschlossen | Kapitel 09: Meldung, Vorgang **oder** Thema; genau ein Primärkontext je Frage | Einschränkung aufgehoben; alte Versions-/Belegpflicht bleibt |
| Terminierte Veröffentlichung | `Rollen-Rechte-und-Workflow.md` §6.4: S3-Bestätigung stets unmittelbar vor Ausführung | Kapitel 08/11: ausdrücklich bestätigte **Fassung und Termin** bei Planung, serverseitige Revalidierung vor Ausführung | Eng begrenzte Ausnahme; keine zweite manuelle Freigabe beim Termin |
| Themenprozess | `Themen-und-Vorgangslogik.md` und ältere Kapitel 06: frühere Editorfolge und Beobachtungsbedingung | Kapitel 06: vier Arbeitsbereiche; Beobachtungsauftrag keine formale Freigabevoraussetzung; Beitragsfreigabe aktiviert Erstentwurf | Neuer Prozess gilt, historische Details bleiben bei Vereinbarkeit |
| Analyse-Teilfreigabe | Ältere Gesamtstand-/Freigabelogik | F-03 in Kapitel 05/06/08: neuer bestätigter Gesamtstand aus Altstand plus nur angenommene Änderungen | Offene Änderungen nie stillschweigend bestätigt |
| Vorläufiger Vorgang | `Datenmodell.md`: mindestens ein Ereignis, neue vorläufige Anlage | F-02 in Kapitel 05: auch vorläufig mindestens ein identifiziertes (ggf. vorläufiges) Ereignis | Kein Konflikt nach Präzisierung |
| Presse und RIS | `Sitzungs-und-Beschlussmodell.md`: amtlicher TOP-Beschluss aus Niederschrift | Kapitel 07 (28.10.): **Presse nur als externe Berichterstattung zur Sitzung**, nie als TOP-Fundstelle; TOP-Fassung/Abstimmung ausschließlich aus RIS | Amtliche TOP-Regel bleibt, frühere vorläufige TOP-Ableitung aus Presse wird ausdrücklich verworfen |
| RIS-Vorlagen | Ältere Recherche ließ auch frei veröffentlichte Vorlagen ohne TOP im allgemeinen Fundbestand zu | Kapitel 07: Sitzungsübernahme von Beschlussvorlagen **nur bei TOP-Zuordnung** | Allgemeiner Quellenfund und Sitzungsobjekt nicht verwechseln |
| Fundstellensichtung | Ältere Pflicht zur Einzelprüfung | Kapitel 03/04: alle Funde KI-sichten; Menschen nur bei erforderlicher Entscheidung | Obligatorische menschliche Einzelabnahme entfällt |
| Handlungsnamen | `Rollen-Rechte-und-Workflow.md`: technische S0–S3 | Kapitel 11: Einsehen/Vorbereiten/Bestätigen/Freigeben | Rechteinhalt gleich; technische Codes bleiben |

## Ausdrücklich **keine** Konflikte

- **30-%-Warnschwelle:** FIB-RECH-RELEVANZ-003 gilt unverändert: ausschließlich mittelbare/vergleichende/zukünftige Beiträge der zurückliegenden **90 Tage**, Anteil **über 30 %** warnt; jeder neu veröffentlichte Beitrag zählt einmal, keine Suchbegrenzung.
- **Lokale Themenbezüge:** `FIB-THEMA-BEZUG-002` und Kapitel 06 verwenden einheitlich **Kandidat, Zugeordnet, Zurückgestellt, Fachlich unpassend**. Frühere beiläufige alternative Begriffe begründen keinen neuen Statuskonflikt.
- **Sperren:** Federführung ist organisatorische Verantwortung und keine zusätzliche Rolle; exklusives Bearbeiten gilt fachobjektübergreifend.
- **Rechte, Bilder und Dokumente:** Ohne positive öffentliche Nutzungsbefugnis keine öffentliche Volltext-/Datei- bzw. Bildbereitstellung; klassenweise Vereinfachung für amtliche RIS-Texte benötigt Rechtsprüfung und ist keine automatische Pauschalfreigabe.

## Zuordnung der 18 eigenständigen Altquellen

| Primärdokument | Hauptziel im neuen Fachkonzept | Dokumentierte Einordnung |
|---|---|---|
| [Mehr-wissen-Modell](../Mehr-wissen-Modell.md) | 09.7 | Vorgang als dritter Primärkontext; bisherige Negation in §8 überholt |
| [Rollen-Rechte-und-Workflow](../Rollen-Rechte-und-Workflow.md) | 08.6, 11.5 | Nur bei fassungs- und termingebundener Veröffentlichung Ausnahme zur unmittelbaren S3-Bestätigung |
| [Sitzungs-und-Beschlussmodell](../Sitzungs-und-Beschlussmodell.md) | 07.2–07.4 | Externe Presse nur Sitzung; TOP-Details nur RIS; ursprüngliche RIS-Abstimmungsregel bleibt |
| [Recherche-und-Quellenmonitor](../Recherche-und-Quellenmonitor.md) | 03.3–03.6 | Breiter Quellenhorizont, Direktprüfung und Quellenentdeckung bleiben; keine automatische menschliche Pflichtprüfung jedes Funds |
| [Fachliche-Plausibilitaets-und-Freigaberegeln](../Fachliche-Plausibilitaets-und-Freigaberegeln.md) | 10.7, 08.6 | Harte Blocker vs semantische Hinweise; Medienrechte unverändert |
| [Themen-und-Vorgangslogik](../Themen-und-Vorgangslogik.md) | 05, 06 | Vier Arbeitsbereiche; fachliche Analysebestätigung, Beitragsfreigabe und Publikation getrennt |
| [Wirkungsmodell](../Wirkungsmodell.md) | 02, 05, 06 | Ereignisanker für Wirkung und quellenbelegte übergreifende Analyseerkenntnis getrennt |
| [KI-Qualitaet-und-Modellunabhaengigkeit](../KI-Qualitaet-und-Modellunabhaengigkeit.md) | 10.9 | Qualität vor Kosten, 5-%-Review, spätere Adminberichte |
| [Persistenz-und-Lebenszyklusmodell](../Persistenz-und-Lebenszyklusmodell.md) | 02, 05, 06 | Identität, Historie und bestätigter Gesamtstand unverändert |
| [Sprachleitfaden](../Sprachleitfaden.md) | 09, 10 | Öffentlich klare und belegte Sprache, interne Profile bleiben ergänzende Details |
| [Redaktionsworkflow](../Redaktionsworkflow.md) | 05, 06, 08 | KI-Vorschläge, Wirkungsprüfkriterien, fachliche Freigabe getrennt |
| [Fachkonzept](../Fachkonzept.md) | 01–11 | Ziel und Prozesse in neue Kapitel; ältere Details ergänzend |
| [Datenmodell](../Datenmodell.md) | 02–11 | Invarianten bestehen fort; F-02 vorläufiger Vorgang mindestens ein Ereignis |
| [Begriffe](../Begriffe.md) | 02–11 | Definitionen weiter als ergänzende Quelle; keine neuen Normbegriffe ohne Beschluss |
| [UX-und-Informationsarchitektur](../UX-und-Informationsarchitektur.md) | 09 | Grundsätze übernommen; konkrete spätere UI-Details nicht als fertige Implementierung |
| [KI-Leitfaden](../KI-Leitfaden.md) | 03–11 | KI nur vorbereitend, keine verbindliche Bestätigung |
| [Navigation-Inhalte-Redaktion-Recherche](../Navigation-Inhalte-Redaktion-Recherche.md) | 08–09 | Navigation/Redaktion getrennt, Detail-UI später |
| [Visuelle-Identitaet-und-Bildkonzept](../Visuelle-Identitaet-und-Bildkonzept.md) | 08–10 | Gestaltungsdetails bleiben separate Designquelle, Rechte für Bilder gewahrt |

## Vollständigkeitsnachweise und verbleibender Abschluss

- [Regelkennungen: 86 Originalregeln](PR259-Regelmigration-Kennungsregister-2026-10-28.md) und [Quellabschnitte: 18 Dokumente, 260 Hauptabschnitte](PR259-Regelmigration-Abschnittsregister-2026-10-28.md).
- **Noch nicht belegt:** Satzweise Äquivalenz der nicht nummerierten Detailregeln sowie vollständige Regression gegen Berechtigungs-, Medien-, RIS- und Quellenmonitor-Sonderfälle. Diese Arbeiten können nicht allein durch Quellverweise als erledigt bescheinigt werden.
- **Separater fachlicher Entscheidungsbedarf, kein Alt-/Neuwiderspruch:** demokratisch-gesellschaftlicher Referenzmaßstab. Kein Aktivieren unbelegter Kriterien.
- **Separat vor Implementierung:** RIS-Volltext-Rechtsprüfung, Besucherauswertung, KI-Betriebsvergleich und technische Durchsetzung der Fachregeln.

**Ergebnis:** Die nachgewiesenen fachlichen Normkollisionen sind mit einer ausdrücklichen Vorrangregel und den konkreten neuen Beschlüssen aufgelöst. Der Quellbestand bleibt vollständig referenziert. Die endgültige normative Stilllegung alter Primärdateien erfordert den noch nicht abschließend nachgewiesenen vollständigen Einzelvergleich; eine Gesamtfreigabe oder ein Merge sind damit nicht automatisch erteilt.
