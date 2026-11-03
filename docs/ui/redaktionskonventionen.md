# Verbindliche UI-Konventionen – FIB-Redaktion

Stand 03.11.2026; Nutzerabnahme Issue #379. Diese Regeln gelten für neue und überarbeitete Redaktionsseiten; bestehende Ansichten sind bei Bearbeitung schrittweise anzupassen.

## Karten und Navigation
- Eigenständige Karten haben konsistente Überschriften und einen kleinen, einheitlichen vertikalen Abstand (CSS, nicht leere Elemente).
- Eine Karten-Hauptaktion gehört als klar beschrifteter Button in die Kopfzeile.
- Aktionssymbole stehen unmittelbar beim bezeichneten Objekt in derselben Zeile und haben verständliche zugängliche Namen; bei externen Links steht das Symbol **vor** dem erklärenden Text. Externe Quelle nicht mehrfach identisch auf einer Seite verlinken.
- Rücknavigation steht in der Hauptnavigation/Seitentoolbar und bewahrt den jeweiligen Ausgangskontext. Redundante Kontextzeilen vor Karten entfallen.
- Wo ein Hilfetext existiert: rechtsbündiges Info-Symbol in der Breadcrumb-Zeile; mit Tastatur bedienbar, Hilfetext erst bei Aufruf sichtbar. Ohne Hilfetext kein Symbol.
- Technische Identifikatoren, doppelte Herkunftsbezeichnungen und tautologische Speicher-/Rechtehinweise gehören nicht in die redaktionelle Standardansicht.

## Dialoge und Formularabläufe
- Such-/Zuordnungs- und Neuanlage-Dialoge haben eine höhenbegrenzte Fläche, einen **eigenen** scrollbaren Inhaltsbereich und eine immer sichtbare Fußleiste mit Bestätigen/Abbrechen sowie kontextabhängigen Hauptaktionen.
- Innerhalb eines mehrstufigen Dialogs führt `Abbrechen` zuerst zur vorherigen Dialogstufe (bei Neuanlage zurück zur Suche). Erst auf der ersten Stufe führt es zurück zur aufrufenden Seite; ungespeicherte Änderungen sind zu schützen.
- Tastatur, Escape, Fokusführung und Darstellung bei schmalem Bildschirm sind bei jeder Dialogänderung zu testen.

## RIS-spezifisch
- TOP `Lokale Bezüge` ist die Oberfläche für die TOP–Ereignis-Zuordnung.
- Ein im TOP geöffnetes RIS-Dokument zeigt nur Quelle und Original-Link, keine zweite Ereigniszuordnungskarte. Allgemeine redaktionelle Fundstellen behalten ihre fachlich eigenständigen Ereignisbezüge.
- Gemäß Issue #380 derzeit keine lokale PDF-Anzeige, Versions- oder Speicherrechtsaktionen in der Redaktion; technische Vorarbeit bleibt deaktiviert.

## Abnahme
Mindestens Frontend-Build, Komponenten-/Browserprüfung, responsive Ansicht, Navigation/Rückwege und keine unbeabsichtigte Veränderung an Daten/Backend prüfen. Persönliche UI-Abnahme bleibt getrennt von CI-Erfolg.
