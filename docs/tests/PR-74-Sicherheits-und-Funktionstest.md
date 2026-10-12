# PR #74 – Sicherheits- und Funktionstest

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 0.1 | 12.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## Ergebnis und Prüfgrenze

**Status: Blockiert für Merge und produktive Freigabe.** Die isolierte Handler-Prüfung ist abgeschlossen; reale Vorschau, Auth-Konfiguration, Bestätigungs- und Recovery-Verhalten sind noch nicht abgenommen. Die technische Prüfung ersetzt diese Nachweise nicht.

Geprüfte Ausgangsversion: `57f4def278aaff461bdedce1699b18b0f8c5cbef`. Editorial Web CI Run 38261975897 war erfolgreich, enthielt aber nur Installation und Build. Die Nachbesserung in diesem PR ergänzt Fehlerbehandlung und reproduzierbare Handler-Tests im CI. Die CI des neuen Commits muss separat grün sein.

## Befunde und Nachbesserungen

- Auth-Anfrage-Ausnahmen ließen zuvor `securitySaving` gesetzt; beim Passwortwechsel verblieben außerdem beide Passworteingaben. Beide Fehler wurden reproduziert und durch `try/catch/finally` behoben.
- AAL1 und Fehler bei der MFA-Prüfung verhindern die Credential-Anfrage. Bei abgefangenen Netzwerkfehlern wird kein Erfolg behauptet.
- Passworteingaben werden nach dem gültigen Änderungsversuch (auch MFA-Abweisung/Fehler), beim Verlassen des Profils und beim Verlust des AAL2-Zustands geleert.
- E-Mail wird getrimmt; eine unveränderte Adresse wird nicht erneut angefordert. Die aktuelle Adresse wird nicht vor Bestätigung durch die gewünschte ersetzt.
- Passwort-Mindestlänge und identische Wiederholung werden im Handler geprüft. Das ist eine UI-Prüfung, kein Nachweis der serverseitigen Passwortpolicy.
- Die neuen Handler schreiben nur über Supabase Auth; keine Passwortspeicherung in FIB, kein Service-Role-Key und keine neue Rollenvergabe im Diff.
- `securitySaving` verhindert Aktionen aus einem bereits als beschäftigt gerenderten Zustand; vollständige Gleichzeitigkeit und React-Lifecycle sind nicht durch den isolierten Test abgedeckt.

## Reproduzierbare Prüfung

`node --test tests/profile-security.test.mjs`

12 Handler-Tests mit simuliertem Supabase Auth: AAL1; MFA-Fehler; getrimmte E-Mail; unveränderte E-Mail; zu kurzes/abweichendes Passwort; Passworterfolg; API-Ablehnung; geworfene Passwort- und E-Mail-Anfragen; bereits beschäftigter Zustand; geworfene MFA-Abfrage; Passwortbereinigung nach MFA-Abweisung.

Ausgangsstand: 7/9 erfolgreich, zwei reproduzierte Fehler. Nachbesserung: 12/12 erfolgreich. Das Skript führt die originalen Handler aus App.tsx isoliert mit Node VM aus (nur die lokalen TypeScript-Annotationen werden entfernt). Es prüft keine Browserdarstellung, React-Effects oder echten Supabase-Aufrufe.

## Offene Abnahme vor Merge

1. Separates Testkonto und kontrollierbare alte/neue Test-Mailboxen bereitstellen; Auth-Vorschau und Callback-Ziele prüfen. Hauptkonto bleibt unverändert.
2. Tatsächliche Shared-Apps-Auth-Einstellungen nachweisen: E-Mail-Bestätigung, Secure Email Change, Redirect-Allowlist, Passwortpolicy und Reauthentifizierung. Verfügbare MCP-Werkzeuge liefern hier keine Auth-Konfiguration und keinen Testkonto-/Mailboxzugang.
3. E-Mail-Wechsel inklusive erforderlicher Bestätigung(en), ungültiger/abgelaufener Links und erneuter Anmeldung mit alter/neuer Adresse testen.
4. Passwortwechsel inklusive neuem/alten Passwort, MFA, anderer Gerätesitzungen und ggf. Nonce/current_password-Anforderung testen. Der PR implementiert keinen Nonce- oder current_password-Dialog; die reale Konfiguration kann diesen erfordern.
5. Passwort-Recovery mit Testkonto, Rückkehr in die App und anschließender MFA testen. Der PR enthält keinen eigenen Recovery-Anforderungsablauf; vorhandener betrieblicher Recovery-Weg muss nachgewiesen werden.
6. Direkte Auth-API-Aufrufe mit AAL1/AAL2 prüfen. Der lokale AAL2-Check ist keine serverseitige Sicherheitsgrenze; FIB-RLS schützt den separaten Auth-Endpunkt nicht.
7. Shared-Apps verwendet gemeinsames Supabase Auth: Kontozugangsdatenänderung kann andere Apps desselben Auth-Kontos betreffen. Auswirkungen und Wiederherstellungsweg müssen vor Freigabe feststehen; projektweite Auth-Einstellungen nicht ungeprüft verändern.
8. Browser-/Mobilprüfung: Bedienelemente, Statusmeldungen, Profil verlassen, Abmelden, Netzwerkunterbrechung und Auth-Zustandswechsel.
9. Neue CI erfolgreich und ausdrückliche Nutzerfreigabe für Sicherheits-/UI-Änderung.

## Einordnung in die Planung

Dies ist persönlicher Kontoselbstservice innerhalb U2 Redaktions-App; der PR-Titel „U5“ ist keine Änderung der Roadmap-Phase U5 Veröffentlichung/Deployment/Betrieb. Maßgeblich bleiben Rollen-/Sicherheitskonzept und gemeinsames Auth gemäß bestehender Architektur. Nächster Schritt ist die isolierte Auth-Live-Abnahme, anschließend die Merge-Freigabe. MFA-Faktorwechsel bleibt separat.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 0.1 | 12.10.2026 | Review, reproduzierte Fehler, Nachbesserung, Handler-Tests und konkrete offene Live-Abnahme dokumentiert. |
