# U4 – Einrichtung für die persönliche Nutzerabnahme

| Version | Stand | Verantwortung |
|---|---|---|
| 1.1 | 31.10.2026 | Josef Walter – mit KI-Unterstützung |

## Verbindlicher Weg

Die persönliche Nutzerabnahme erfolgt auf **https://fib.pustivo.de/redaktion/** mit
Shared-Apps, Schema `fib`, bestehenden FIB-Benutzern und unveränderter MFA.
[ADR-011](../decisions/ADR-011-Shared-Apps-Schema-Isolation-und-pustivo-Betrieb.md) und
der bestätigte Auftrag vom 13.10.2026 sind hierfür verbindlich. **Keine neue lokale
Installation, kein neues Supabase-Projekt und kein zusätzlicher Hostingdienst.**

Die frühere lokale Empfehlung dieser Datei aus PR #355 ist ausdrücklich zurückgenommen.
Der lokale Launcher bleibt technischer Test-/Hilfscode. Isolierte Datenbanken und echte
lokale Auth-Dienste werden weiterhin für automatische Prüfungen verwendet und dürfen
nicht als bereits erreichbarer persönlicher Zugang ausgegeben werden.

## Führende Unterlagen

- [Lesender Istvergleich](u4-shared-apps-inventory-2026-10-31.md): tatsächlich bereitgestellte Migrationen, Funktionen, Rechte, Quellen und Frontend.
- [Bereitstellungs-, Sicherungs- und Rücknahmeplan](u4-shared-apps-release-plan.md): genaues Paket für eine einzige spätere Freigabe, Operatorbefehle und Stop-Kriterien.
- [Persönliche Abnahmeanleitung](u4-persoenliche-nutzerabnahme.md): vorhandene Anmeldung, drei Fälle, erwartete Ergebnisse und Beanstandungen.

## Aktueller Status

PR #358 bereitet die Umsetzung vor. Es wurden keine Shared-Apps-Migrationen,
Deployments, Feature-Aktivierungen, Quellenänderungen, Konten- oder Schlüsseländerungen
ausgeführt. Die bestehende Redaktion ist erreichbar, aber der neue RIS-Funktionsstand
ist dort noch nicht bereitgestellt. Die ausdrückliche Bereitstellungsfreigabe steht aus.

Ein Testkonto wird nicht neu erzeugt. Die Inventur fand einen aktiven Admin und einen
aktiven Editor, beide mit verifiziertem MFA-Faktor; Geheimnisse und Kontaktdaten wurden
nicht ausgelesen. Der tatsächliche persönliche Login-/UI-Smoke-Test folgt nach Freigabe.
#356 bleibt für die fachliche Nutzerabnahme offen, #281 für weitere Informationsgewinnung.

## Änderungshistorie

| Version | Änderung |
|---|---|
| 1.1 | Lokale Standardempfehlung durch verbindlichen Shared-Apps-Weg ersetzt; führende Ist-/Rollout-/Nutzerunterlagen verknüpft |
| 1.0 | Historische lokale technische Vorbereitung aus PR #355; bleibt in der Git-Historie nachvollziehbar |
