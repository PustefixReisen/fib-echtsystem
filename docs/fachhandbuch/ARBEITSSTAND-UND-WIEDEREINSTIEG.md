# FIB-Fachhandbuch – Arbeitsstand und Wiedereinstieg

**Stand 11.11.2026.** Dieses Blatt dient der Projektkoordination. Fachliche Regeln stehen in den elf [Handbuchkapiteln](README.md).

## Erreichter Stand

Das Fachhandbuch wurde am 29.10.2026 abgenommen. Am 11.11.2026 folgte die persönliche RIS-Fachabnahme für die Umsetzung aus PR #422, #424 und #426. [Kapitel 07](07-Sitzungen-und-Beschluesse-Entwurf-2026-10-26.md) beschreibt den aktuellen Import, seine Fundstellen und TOP-Ereignisse, die Ergebnisse und die abgenommene Redaktionsansicht. Kapitel 02–06 und 08–11 sind dazu konsistent fortgeschrieben. Der [Änderungsnachweis](../tests/ris-fachabnahme-2026-11-11.md) dokumentiert Paket C aus #427.

## Nächster fachlicher Arbeitsblock

Paket B aus #428 implementiert eine getrennte regelbasierte Erkenntnisbildung. Der [Fach-/Technikbericht](../operations/ris-analysis-428.md) beschreibt Umfang, Grenzen, Tests und den kontrollierten Bereitstellungsweg. Die Installation und die zulässige temporäre Dokumentauswertung sind von der Umsetzung zu unterscheiden. Eine manuelle RIS-Analysefreigabe ist nicht vorgesehen.

Der nächste fachliche Ausbau betrifft die Verwendung dieser Erkenntnisse in Meldungen, Vorgängen und Themen nach deren bestehenden Regeln. Die optionale Mistral-Anbindung benötigt eine eigene ausdrückliche Freigabe und Budgetabsicherung. Die übrigen Arbeitspakete der [Roadmap](../Roadmap.md) behalten ihre Abgrenzung.

## Freigabegrenzen

Die Fachabnahme des geprüften RIS-Umfangs ersetzt keine allgemeine Betriebs-/Sicherheitsfreigabe. Technische Wiederherstellbarkeit sowie der Schutz von Authentifizierung, Zugangsdaten und anderen Shared-Apps-Anwendungen bleiben maßgeblich. Fachliche Testdaten werden nach [Entwicklungs-, Referenz- und Echtdaten](../Entwicklungs-Referenz-und-Echtdaten.md) behandelt.
