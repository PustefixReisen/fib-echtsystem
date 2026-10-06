# KI-Provider und DSFA-Prüfrahmen – FIB Echtsystem

## Dokumentstand

| Version | Stand | Verantwortlich |
|---|---|---|
| 1.0 | 06.10.2026 | Josef Walter – erstellt mit KI-Unterstützung |

## 1. Zweck und Geltung

Dieses Dokument ist die verbindliche G4-Detailquelle für:

- die datenschutzbezogene Freigabe von KI-/Cloud-Betriebswegen,
- die Zuordnung zulässiger Schutzklassen zu Providern,
- die Prüfung, ob für eine konkrete Verarbeitung eine Datenschutz-Folgenabschätzung (DSFA) erforderlich ist.

Konkrete Anbieter- und Modellentscheidungen werden erst in G5/G7 getroffen. Dieses Dokument legt die dafür geltenden Prüfkriterien fest.

## 2. Schutzklasse und Personenbezug sind getrennte Achsen

Verbindlicher Grundsatz:

> **K0 bedeutet öffentlich, nicht personenbezogen-frei.**

Auch öffentliche Inhalte können personenbezogene Daten enthalten, etwa Namen und öffentliche Funktionen von Mandatsträgern oder öffentlich auftretenden Akteuren.

Für einen externen Betriebsweg sind deshalb mindestens zwei Fragen getrennt zu beantworten:

1. Welche FIB-Schutzklasse hat der übermittelte Inhalt: K0, K1, K2 oder K3?
2. Enthält der konkrete Kontext personenbezogene Daten, besondere Kategorien nach Art. 9 DSGVO oder keine personenbezogenen Daten?

Die öffentliche Verfügbarkeit personenbezogener Daten beseitigt die datenschutzrechtliche Verantwortung für ihre weitere Verarbeitung nicht.

## 3. Grundmatrix für externe KI-/Cloud-Dienste

### 3.1 K0

K0-Inhalte dürfen an einen produktiv freigegebenen Dienst übermittelt werden, wenn dies für die konkrete FIB-Funktion erforderlich ist.

Enthält K0 personenbezogene Daten, gelten trotzdem die datenschutzrechtlichen Anforderungen für diese Verarbeitung, insbesondere Rechtsgrundlage, Transparenz, erforderliche Verträge und gegebenenfalls Drittlandregeln.

### 3.2 K1

K1 darf nur über einen ausdrücklich für interne FIB-Daten freigegebenen Betriebsweg verarbeitet werden.

Vor Freigabe sind insbesondere zu prüfen:

- Rolle des Dienstleisters und gegebenenfalls Auftragsverarbeitung nach Art. 28 DSGVO,
- ausreichende technische und organisatorische Garantien,
- Datenstandort und Unterauftragnehmer,
- Drittlandbezug,
- Provider-Retention und Logging,
- Nutzung von Eingaben/Ausgaben für Training oder eigene Zwecke,
- Lösch- und Kontrollmöglichkeiten,
- Zugriffsschutz,
- Eignung für den konkreten FIB-Nutzungsfall.

### 3.3 K2

K2 benötigt eine eigenständige, strengere Freigabe. Eine Freigabe für K1 reicht nicht aus.

Zusätzlich ist mindestens zu prüfen:

- ob die Verarbeitung des K2-Inhalts überhaupt erforderlich ist,
- ob personenbezogene Angaben vor Übermittlung reduziert, pseudonymisiert oder redigiert werden können,
- ob besondere Kategorien personenbezogener Daten betroffen sind,
- ob der Provider/Betriebsweg vertraglich und technisch ausdrücklich für diese Verarbeitung geeignet ist,
- ob Drittlandrisiken ausreichend beherrscht sind,
- ob eine DSFA-Prüfung ausgelöst wird.

K2 soll im Zweifel lokal bzw. innerhalb des kontrollierten FIB-Systems verarbeitet werden, wenn die externe Übermittlung keinen klaren zusätzlichen Nutzen hat.

### 3.4 K3

K3 wird nicht an Sprachmodelle, Recherche-KI oder vergleichbare externe KI-Dienste übermittelt.

## 4. Auftragsverarbeitung und Drittlandtransfers

Soweit ein externer Dienst personenbezogene Daten im Auftrag von FIB verarbeitet, darf nur ein Auftragsverarbeiter eingesetzt werden, der ausreichende Garantien für geeignete technische und organisatorische Maßnahmen bietet.

Bei Verarbeitung bzw. Übermittlung in Drittländer sind zusätzlich die Anforderungen der Art. 44 ff. DSGVO zu erfüllen.

Für die spätere Providerfreigabe muss deshalb dokumentiert sein:

- wer Verantwortlicher, Auftragsverarbeiter oder gegebenenfalls eigener Verantwortlicher ist,
- ob ein erforderlicher Auftragsverarbeitungsvertrag besteht,
- welche Unterauftragnehmer beteiligt sind,
- in welchen Ländern die Verarbeitung erfolgt,
- auf welcher Grundlage ein Drittlandtransfer zulässig ist,
- ob zusätzliche Transfer-/Risikoprüfungen notwendig sind.

Ein bloß technisch erreichbarer API-Dienst gilt nicht als freigegebener FIB-Provider.

## 5. FIB-Providerfreigabe als Konfiguration

Die Freigabe eines Providers/Betriebswegs wird später als kontrollierte Konfiguration geführt und muss mindestens erkennen lassen:

- zulässige Schutzklassen,
- zulässige FIB-Aufgaben,
- Zulässigkeit personenbezogener Daten,
- Zulässigkeit von Art.-9-Daten, falls überhaupt vorgesehen,
- Datenregion/Drittlandstatus,
- Retention-/Trainingseigenschaften,
- relevante Vertrags-/Prüfstände,
- Freigabestatus und Prüfdatum.

Der KI-Router darf nur Kombinationen aus Aufgabe, Schutzklasse und Provider auswählen, die ausdrücklich freigegeben sind.

## 6. DSFA-Grundregel

Nach Art. 35 DSGVO ist eine Datenschutz-Folgenabschätzung erforderlich, wenn eine geplante Verarbeitung voraussichtlich ein hohes Risiko für Rechte und Freiheiten natürlicher Personen zur Folge hat.

Eine DSFA wird nicht pauschal allein deshalb erforderlich, weil FIB KI verwendet.

Vor Go-live wird jedoch für jede relevante personenbezogene Verarbeitung eine dokumentierte DSFA-Vorprüfung durchgeführt.

## 7. DSFA-Screening für FIB

Bei der Vorprüfung werden insbesondere folgende Risikokriterien berücksichtigt:

- Bewertung oder Scoring von Personen,
- automatisierte Entscheidungen mit rechtlicher oder ähnlich erheblicher Wirkung,
- systematische Überwachung,
- besondere Kategorien oder höchst persönliche Daten,
- Verarbeitung in großem Umfang,
- Zusammenführung verschiedener personenbezogener Datensätze,
- Daten schutzbedürftiger Personen,
- innovative neue technische oder organisatorische Lösungen,
- Verarbeitung, die Betroffene faktisch an der Ausübung von Rechten oder Nutzung eines Dienstes hindert.

Mehrere gleichzeitig erfüllte Kriterien erhöhen die Wahrscheinlichkeit, dass eine DSFA erforderlich ist.

## 8. Vorläufige FIB-Bewertung

Auf Basis des MVP-Konzepts sind wesentliche Hochrisikotreiber bewusst ausgeschlossen oder stark begrenzt:

- keine Besucherprofile,
- keine personenbezogene Lese-/Interessenhistorie,
- kein Personen-Scoring,
- keine automatisierte Entscheidung über Personen mit rechtlicher oder ähnlich erheblicher Wirkung,
- keine systematische großflächige Personenüberwachung,
- kein großer zentraler Art.-9-Datenbestand,
- K2-Minimierung,
- redaktionelle Entscheidung statt autonomer KI-Entscheidung.

Deshalb ist derzeit **keine generelle DSFA-Pflicht für FIB als Gesamtsystem festgestellt**.

Eine DSFA kann dennoch für eine einzelne spätere Verarbeitung erforderlich werden, insbesondere wenn der Funktionsumfang erweitert wird oder mehrere Hochrisikokriterien zusammentreffen.

## 9. Verbindliche DSFA-Trigger für eine erneute Prüfung

Eine erneute DSFA-Vorprüfung ist mindestens erforderlich, wenn FIB später einführt oder wesentlich erweitert:

- personenbezogene Besucherprofile oder personalisierte Interessenmodelle,
- freie öffentliche Nutzerkonten mit Verhaltenshistorie,
- systematische Zusammenführung personenbezogener Daten aus mehreren Quellen,
- umfangreiche Verarbeitung interner politischer Mitgliedschafts-/Meinungsdaten,
- automatisiertes Scoring oder Ranking von Personen,
- automatisierte Entscheidungen mit erheblicher Wirkung für Betroffene,
- großflächige Verarbeitung von Gesichts-/biometrischen oder anderen hochsensiblen Daten,
- deutlich ausgeweitete K2-Verarbeitung durch externe KI,
- neue innovative Verarbeitung, deren Risiken mit Standardmaßnahmen nicht ausreichend beherrschbar erscheinen.

## 10. Go-live-Anforderung

Vor produktivem Go-live müssen mindestens vorliegen:

1. Verzeichnis der tatsächlich eingesetzten externen Dienste und Empfänger,
2. Freigabe je Provider/Betriebsweg nach zulässiger Schutzklasse und Personenbezug,
3. dokumentierte Rechtsgrundlage für jede relevante personenbezogene Verarbeitung,
4. erforderliche Auftragsverarbeitungs-/Drittlandunterlagen,
5. DSFA-Vorprüfung für die tatsächlich umgesetzten Verarbeitungsvorgänge,
6. falls die Vorprüfung ein hohes Risiko ergibt: vollständige DSFA vor Beginn der betreffenden Verarbeitung.

## Änderungshistorie

| Version | Datum | Änderung |
|---|---|---|
| 1.0 | 06.10.2026 | G4-Provider- und DSFA-Prüfrahmen festgelegt; Schutzklasse und Personenbezug als getrennte Prüfachsen definiert; K0–K3-Providerregeln, Auftragsverarbeitung/Drittlandprüfung, Providerfreigabekonfiguration, DSFA-Screening und erneute Prüftrigger dokumentiert. |
