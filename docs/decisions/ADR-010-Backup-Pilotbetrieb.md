# ADR-010 – Backup im Pilot-/Entwicklungsbetrieb

## Status

Verbindlich – 06.10.2026

## Kontext

FIB soll im Pilot-/Entwicklungsbetrieb möglichst ohne zusätzliche laufende Backup-Kosten betrieben werden. Supabase Free wird als Backend verwendet; automatische Plattform-Backups werden dabei nicht als alleinige Sicherung vorausgesetzt.

Der vorhandene Nextcloud-Speicher wird bereits auf einen lokalen PC synchronisiert. Dieser lokale Datenbestand wird zusätzlich mit Back In Time gesichert.

## Entscheidung

Für den Pilot-/Entwicklungsbetrieb gilt folgende Sicherungskette:

```text
Supabase PostgreSQL
   ↓ täglich automatisierter logischer Datenbank-Dump
Nextcloud
   ↓ Synchronisation über Nextcloud-Client
lokaler PC
   ↓ Back In Time
lokale versionierte Sicherung
```

Verbindliche Regeln:

1. Die FIB-Datenbank wird mindestens einmal täglich automatisiert als wiederherstellbarer logischer Dump exportiert.
2. Der Dump wird in einem dafür vorgesehenen FIB-Backup-Verzeichnis der Nextcloud abgelegt.
3. Der Nextcloud-Client synchronisiert dieses Verzeichnis auf den lokalen PC.
4. Das synchronisierte Backup-Verzeichnis wird durch die bestehende Back-In-Time-Sicherung des PCs erfasst.
5. Ein fehlgeschlagener täglicher Dump muss als Betriebswarnung sichtbar werden.
6. Ein erfolgreicher Datei-Upload nach Nextcloud gilt noch nicht als Nachweis der Wiederherstellbarkeit; Restore-Tests bleiben verpflichtend.
7. Secrets dürfen nicht unverschlüsselt Bestandteil des Datenbank-Dumps oder des Backup-Verzeichnisses sein.
8. Die Sicherungskette ist eine Pilot-/Entwicklungslösung. Vor Migration auf die GRÜNEN-Infrastruktur wird in G9 festgelegt, welche organisationskontrollierte Ziel-Backupablage die persönliche Nextcloud/PC-Stufe ersetzt.

## Kosten

Für diese Backup-Lösung entstehen im Pilot-/Entwicklungsbetrieb voraussichtlich keine zusätzlichen laufenden Kosten, solange vorhandener Nextcloud-Speicher und lokaler Back-In-Time-Speicher ausreichen.

## Wiederherstellung

Mindestens vor Produktivstart und danach regelmäßig wird ein Restore-Test durchgeführt. Dabei muss gezeigt werden, dass aus Repository/Migrationen, einem gesicherten Dump und dem Datei-/Bildspeicher ein funktionsfähiger FIB-Stand wiederhergestellt werden kann.

## Abgrenzung

- Ein Keepalive gegen Supabase-Pausierung ist kein Backup.
- Die Nextcloud-Synchronisation allein ist kein Backup, da Synchronisationsfehler oder Löschungen weitergegeben werden können; die zusätzliche Back-In-Time-Versionierung bildet die unabhängige lokale Sicherungsebene.
- Der statische öffentliche FIB-Release ist ebenfalls kein Ersatz für das Datenbank-Backup.
