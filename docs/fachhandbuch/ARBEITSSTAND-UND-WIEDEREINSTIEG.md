# FIB-Fachhandbuch – Arbeitsstand und Wiedereinstieg

Stand: 23.10.2026. Dieses Blatt dient der **Projektkoordination**, nicht als zweite fachliche Primärquelle. Die verbindlichen Regeln stehen in den jeweiligen Fachhandbuch-Kapiteln und bis zur Migration in den bisherigen Primärquellen.

## Verbindlicher Standard

[Pustivo-Governance: Fachliches Dokumentationsmodell v1.3](https://github.com/PustefixReisen/pustivo/blob/main/docs/governance/Fachliches-Dokumentationsmodell.md), insbesondere §10: **fachliche Aufgaben und Prozesse zuerst**, vollständige Fachobjektdefinitionen an genau einer Primärstelle; je Prozess Ziel, Auslöser, beteiligte Rollen, Haupt-/Alternativablauf, Daten/Regeln, UI, Ergebnis, Abnahme, Reifegrad. Fachliche und technische Umsetzung getrennt kenntlich machen; neue Fachentscheidungen gemeinsam treffen.

## Aktueller Stand

- [Kapitel 03 – Recherche](03-Recherche.md): Bestand und Quelleninventur aus v0.1–0.6 erhalten; **v0.7** beginnt die prozessorientierte Neugliederung mit P1 Quellenmonitor (Beobachtung/Entdeckung/redaktionelle Einbringung).
- [Kapitel 06 – Themen](06-Themen.md): v2.5 Konsolidierungsentwurf, bereits beschlossene Status-/Rechte-/Freigabe-/Sperrregeln; noch keine endgültige Ablösung der Altquellen.
- Implementierter Bestand (letzter lesender Nachweis 22.10.): **Shared-Apps**, Schema `fib`, Quellen und Fundstellen sowie redaktionelle Fundstellenzuordnung; aktive Edge Functions `fib-get-event`, `fib-editorial-write`, `fib-topic-editor` u. a.
- **Nicht nachgewiesen:** automatischer Quellenmonitor, durchgängige KI-Quellenentdeckung, persistente Beobachtungsaufträge und Rechercheläufe; externe Scheduler/Jobeinrichtungen noch zu prüfen.
- Bereits implementierte **Ereigniserfassung** ist fachlich im zukünftigen Kapitel 04 zu beschreiben und auf Code/DB/UI abzugleichen; Kapitel 03 beschreibt nur ihren Eingang und Übergang.

## Nächster fachlicher Arbeitsblock – erst Fachkonzept, dann Implementierung

1. In Kapitel 03 Prozess **P1** mit der Projektverantwortung fachlich abstimmen (insbesondere Frequenz, Fehlernachlauf, UI-Eingänge, Freigabe einer neuen Quelle); bisherige Festlegungen nicht ohne Anlass ändern.
2. Prozesse **P2–P5** als lesbare vollständige Abläufe mit Ausnahmen, Ergebnissen und Akzeptanzfällen ausarbeiten.
3. Fachobjekte (Quelle, Fundstelle, Beobachtungsauftrag, Recherchelauf, Referenzobjekt, operative Regel) vollständig und **jeweils einmal** fachlich spezifizieren: Attribute/Bedeutung, Beziehungen/Kardinalitäten, Status, Invarianten, Rechte.
4. Bereits implementierte Ereigniserfassung in Kapitel 04 aus Code, Datenbank, UI und Altdokumentation rekonstruieren; mit der Fachverantwortung die tatsächlichen Workflows abstimmen.
5. Dokumentierte Soll-/Ist-Abweichungen nach fachlicher Zustimmung in konkrete GitHub-Issues umsetzen (zuerst Dublettprüfung), pro Arbeitspaket mit Fachregel, Ziel, betroffenem Prozess, UI-Prototyp, Abnahme und Priorität.
6. Technische Implementierung in getrennten PRs; jeder PR prüft die Fachhandbuch-Folgen und bewahrt bestehende Daten, Rollen und andere Apps in Shared-Apps. Nach Tests zurück zum fachlichen Review.

**Wiedereinstiegssatz:** „FIB fortsetzen: Fachhandbuch 03 nach Pustivo-Standard 1.3, P1 Quellenmonitor abstimmen, anschließend P2–P5 und Kapitel 04 Ereigniserfassung. Nutze `docs/fachhandbuch/ARBEITSSTAND-UND-WIEDEREINSTIEG.md` als Arbeitsplan.“

## Freigabegrenzen

Kapitel 03 und 06 sind weiterhin Konsolidierungsentwürfe; alte Primärquellen werden erst nach vollständiger Zuordnung und gemeinsamem Fachreview abgelöst. Ein Codebefund ist kein eigenständig gefasster Fachbeschluss. Diese Koordinationsdatei begründet keine neuen Fachregeln.
