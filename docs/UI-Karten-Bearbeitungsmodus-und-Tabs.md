# FIB: Bearbeitungsmodus und Tabs

Stand: 14.10.2026; fachlich freigegeben.

## Begriffe und Unterscheidung

- **Karte / Kartenkopf:** abgegrenzter Funktionsbereich / farblich hervorgehobene Titelzeile.
- **Bearbeitungsmodus:** zum Verändern von Fachinformationen oder Zuordnungen. Der Kartenkopf bietet im Anzeigemodus die konkrete Aktion (z. B. „Bearbeiten“ oder „Fundstelle hinzufügen“). Im Bearbeitungsmodus verschwindet diese Aktion; innerhalb der Karte steht „Zurück“ oder – bei nicht sofort übernommenen Änderungen – „Speichern“ und „Abbrechen“.
- **Tabs:** ausschließlich zum Wechsel zwischen gleichrangigen Ansichten; Tabtexte bezeichnen Ansichten, keine Handlungen. Der aktive Tab muss klar hervorgehoben sein.
- **Filter:** begrenzt Treffer innerhalb der aktuellen Ansicht; standardmäßig mit Live-Suche und expliziter Löschfunktion.

## Quellen und Fundstellen im Ereignisdetail

Im Anzeigemodus zeigt die Karte die zugeordneten Fundstellen und im Kartenkopf „Fundstelle hinzufügen“. Im Zuordnungsmodus bleiben die bereits zugeordneten Fundstellen sichtbar; ihre Zuordnung kann nach Bestätigung aufgehoben werden. Darunter werden weitere Fundstellen mit Live-Filter zur unmittelbaren Zuordnung angeboten.

**Persistenzregel:** Jede Zuordnen-/Aufheben-Aktion wird einzeln bestätigt und unmittelbar serverseitig gespeichert. „Zurück“ beendet lediglich den Modus und verwirft keine bereits übernommenen Zuordnungen. Eine Bearbeitungssperre wird erst für eine tatsächliche Veränderung angefordert, nicht für die Anzeige oder Suche. Für noch nicht gespeicherte Formulareingaben gilt der FIB-weite Änderungs- und Verlassenschutz.

Bei mobilen Layouts bleibt die fachliche Kartenreihenfolge unverändert.

## Allgemeiner Buttonstandard

Buttons mit Symbol und Beschriftung benötigen immer einen sichtbaren Abstand (mindestens etwa 0,4 rem) zwischen Icon und Text. Dies gilt auch für deaktivierte Buttons und gilt FIB-weit. Komponenten müssen konsistente Icon-/Text-Anordnung aus dem Styleguide nutzen; neue Buttons dürfen den Abstand nicht durch direkten Textanschluss verlieren.

## Aufgehobene Zuordnungen

Beim erneuten Zuordnen darf optional die letzte gespeicherte Begründung der identischen Beziehung Fundstelle ↔ Ereignis übernommen werden. Alternativ wird die Beziehung ohne Begründung neu angelegt. Die Herkunfts- und Auditdaten bleiben unberührt; eine vollständige Versionsauswahl wird nicht angezeigt.
