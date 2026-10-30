# U4 – Relevanzmodell und Adminverwaltung

**Fachentscheidung vom 30.10.2026.** Ergänzung zu Fachhandbuch 03 und U4-Umsetzungsauftrag. Technische Implementierung steht aus.

## Relevanzmodell
Drei getrennte Wissensschichten: (1) wenige verbindliche, versionierte Grundregeln, (2) geprüfte Referenzfälle mit Ähnlichkeiten und wesentlichen Unterschieden, (3) belegtes räumliches und funktionales Kontextwissen mit Prüfstatus. Referenzfälle und Einzelfallentscheidungen ändern Grundregeln nicht automatisch.

Das KI-Modell liefert eine strukturierte Einschätzung mit Belegen, Bezugstyp, Unsicherheiten und Vorschlag. Der modellunabhängige Fachservice prüft Nachweise, führt nötigenfalls Nachrecherche aus und erstellt bei ungeklärten relevanten Fällen eine möglichst gebündelte Redaktionsfrage. Eine Modell-Selbsteinschätzung zur Sicherheit ist kein Qualitätsnachweis.

Die KI kann neue Beziehungen, Referenzfälle und Regeländerungen vorschlagen. Verbindliche Grundregeln werden ausschließlich nach administrativer Freigabe aktiviert, versioniert und begründet. Vor der Freigabe werden Überschneidungen, Ausnahmen und Widersprüche geprüft sowie bekannte Positiv-, Negativ- und Grenzfälle erneut getestet. Semantische Konsistenz kann nicht vollständig automatisch garantiert werden.

## Adminbereich vormerken
- Quellenregister: Kern-/Ergänzungsstufe, Pflichtkennzeichen, konkrete Scopes, Adapterwahl, Testabruf, Aktivierung, Fehler- und Abdeckungsstatus.
- Regelpflege: gültige Grundregeln, Versionen, KI-Vorschläge, Konfliktanzeige, Freigabeworkflow, Historie.
- Referenzfälle: geprüfte Beispiele mit Sollbewertung, Begründung, Abgrenzung und Regressionsergebnis.
- Kontextwissen: räumliche und funktionale Referenzobjekte, Belege, Prüfstatus, redaktionelle Bestätigung.
- Qualität: technische Quellenabdeckung, übersehene relevante Fundstellen, Fehlbewertungen, Rückfragequote und redundante Rückfragen.

## Umsetzung nach dem jetzigen Konzeptstand
1. **Wiederaufnahme des bestehenden U4-Implementierungsstrangs:** Quellenadapter für Gemeinde/RIS an persistente Speicherung anschließen und echten, protokollierten Testabruf ausführen.
2. RIS-Objektbeziehungen, nachträglich veröffentlichte Dokumente und Änderungskontrolle validieren; dann Kern- und Ergänzungsquellen erweitern.
3. Modellunabhängigen Relevanzservice mit einheitlicher Ein-/Ausgabe und Belegprüfung implementieren; geprüfte räumliche Referenzfälle integrieren.
4. Adminverwaltung stufenweise implementieren, zuerst Quellen/Scopes/Testabrufe, danach Versionierung der Relevanzregeln und Referenzfälle.
5. Abschließend Regression, Erfassungsqualität und Relevanzqualität prüfen. U4 bis dahin als *in Arbeit* kennzeichnen.

## Wichtig
Die technische Quellenliste zu erfassen ist deterministisch. Räumliche/funktionale Relevanz ist eine nachgelagerte fachliche KI-Prüfung; Ortsnamenssuche allein genügt nicht (Radschnellweg München–Markt Schwaben, mögliche Wirkungen von Windkraftanlagen in Aschheim). Routinemäßige Detail-Änderungsprüfung älterer Fundstellen nur bei als relevant übernommenen Inhalten; RIS-Nachträge und neue Archivveröffentlichungen müssen trotzdem entdeckt werden.
