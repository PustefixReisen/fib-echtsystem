# Redaktions-App: Auslieferung und Cache-Prüfung

Stand: 15.10.2026. Anlass: weißer Bildschirm am 15.10. nach Update; Firefox meldete `SyntaxError: expected expression, got end of script`; Neustart mit deaktiviertem Cache stellte Funktion wieder her. Der genaue Ort einer möglichen Dateibeschädigung ist nicht nachgewiesen.

## Bereits automatisiert
`Editorial Web CI` baut die App und prüft danach das Ergebnis: vorhandene referenzierte JS/CSS-Dateien und syntaktische Gültigkeit jedes JS-Bundles. Dies sichert das lokale Buildartefakt ab, **nicht** die tatsächlich auf dem Zielserver liegende Kopie.

## Verbindliche Anforderungen an den noch einzurichtenden IONOS-Deploymentpfad
1. Exakt das erfolgreich geprüfte Artefakt ausrollen.
2. Neue gehashte JS/CSS-Dateien vollständig hochladen und Größe oder Hash verifizieren, **bevor** `index.html` aktualisiert wird.
3. `index.html` kurz/revalidierbar cachen, Hash-Assets langfristig und unveränderlich; alte Assets nicht vorschnell löschen.
4. Nach Umschaltung `index.html` und referenzierte Assets vom **Zielhost** laden, auf HTTP 200, vollständige Dateigröße/Hash und JS-Syntax prüfen; zusätzlich einen Browser-Smoke-Test ausführen.
5. Bei Fehler nicht freigeben bzw. auf das vorige geprüfte Artefakt zurückschalten; protokollieren.

Die konkreten Serverregeln und Upload-Mechanismen sind vor einer produktiven Änderung gegen die tatsächlich verwendete IONOS-Konfiguration zu prüfen. Keine blinde `.htaccess`-Änderung. Das FIB-Echtsystem ist vor öffentlichem Echtbetrieb weiterhin in der Aufbauphase.

Gilt für die **Redaktions-App** unter `/redaktion/`, getrennt vom K0-Publikationspfad. Siehe ADR-008 und ADR-003.
