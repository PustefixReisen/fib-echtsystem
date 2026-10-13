# Navigation – Inhalte und Redaktion

Stand: 13.10.2026. Fachlich abgestimmt mit dem Projektverantwortlichen.

## Grundsatz

**Inhalte** sind die eigenständigen Informationsobjekte des öffentlichen FIB-Angebots und diejenigen, die zur Veröffentlichung vorbereitet werden. Ein noch nicht freigegebener Meldungsentwurf gehört bereits zu „Inhalte“.

**Redaktion** umfasst die Hintergrund-, Zuliefer-, Aufbereitungs-, Steuerungs-, Freigabe- und Auswertungsprozesse sowie deren Arbeitsergebnisse, soweit diese nicht selbst als Informationsobjekt veröffentlicht werden.

Die Navigation zeigt den **bevorzugten Arbeits- und Zugangskontext**, nicht sämtliche Beziehungen oder die vollständige Fachobjektstruktur.

## Vereinbarte Gliederung

- Dashboard; Arbeitskorb.
- **Inhalte**: Meldungen, Vorgänge, Themen, Sitzungen.
- **Redaktion → Recherche**: Rechercheaufträge, Funde, Ereignisse, Quellen.
- **Redaktion → Veröffentlichung** und **Redaktion → Auswertung**: bestehende Unterpunkte zunächst unverändert.
- FIB-Assistent; vorhandene Administration und Profilnavigation bleiben bestehen.

Sitzungen sind eigenständige öffentliche Informationsobjekte, aus denen im Einzelfall Meldungen entstehen können.

Recherche umfasst den gesamten **iterativen Prozess** der Informationssuche, Bewertung und Erschließung bis zur Erfassung und fortlaufenden Pflege geprüfter Ereignisse. Exemplarisch: Rechercheauftrag → Fund → Ereignis → weitere Recherche/Präzisierung → ggf. Meldung. Die Reihenfolge ist nicht zwingend; Ereignisse können manuell angelegt und unabhängig von einem Rechercheauftrag gepflegt werden.

**Ereignisse** bleiben eigenständige, dauerhaft gespeicherte Fachobjekte. Ihre Einordnung unter Recherche schränkt die Navigation aus Vorgängen, Themen und Meldungen zu zugehörigen Ereignissen nicht ein.

## Implementierungsstand

Der gegenwärtige UI-Slice ergänzt und ordnet die Navigationsbezeichnungen, ohne fachlich noch nicht implementierte Listen und Bearbeitungsansichten vorzutäuschen. Die neuen Unterpunkte bleiben deshalb bis zur tatsächlichen Anbindung deaktiviert; der bestehende einzelne Testereignis-Editor bleibt über den Dashboard-Einstieg erreichbar.

Die geplante Anbindung „Recherche → Ereignisse“ benötigt eine fachlich passende Ereignisliste und Detailnavigation; sie ist ein **separater Folge-Slice**, kein geheimer Direktlink auf ein einzelnes Testereignis.

**Begriffsklärung:** „Rechercheaufträge“ ist hier die Navigation für die Recherche-Steuerung. Ob bereits vorhandene „Beobachtungsaufträge“ eine spezifische Unterart sind, wird vor Implementierung ihrer Detailansicht am bestehenden Fachkonzept geprüft; die Fachobjekte werden durch die UI-Umbenennung nicht umdefiniert.
