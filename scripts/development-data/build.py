#!/usr/bin/env python3
"""Build the reviewed, append-only demonstration sample. Never connects to a DB."""
import hashlib
import json
from pathlib import Path
import uuid
from datetime import datetime
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'data/development/demo-20261013'
BATCH = 'demo-20261013'
PREFIX = '[ENTWICKLUNG demo-20261013] '
NS = uuid.UUID('e833c15c-a9b7-4917-a737-714c571d87ed')

def uid(kind, key):
    return str(uuid.uuid5(NS, BATCH + ':' + kind + ':' + key))

def literal(value):
    return "'" + str(value).replace("'", "''") + "'"

def day(value):
    return datetime.fromisoformat(value).replace(tzinfo=ZoneInfo('Europe/Berlin')).isoformat()

def build():
    snapshot = json.loads((OUT / 'source-snapshot.json').read_text())
    rows = {t: [] for t in ['sources', 'findings', 'processes', 'events', 'messages', 'event_processes', 'event_findings']}
    processes = {
        'hundewiese': ('Hundewiese östlich des Friedhofs', 'Vorlage und angekündigte Beratung; kein neuer Beschluss nachgewiesen.'),
        'parkraum': ('Parkraumkonzept Feldkirchen', 'Entwurf, Ergänzungsbedarf und spätere Veröffentlichung des Konzepts.'),
        'kreuz-ost': ('Ausbau Autobahnkreuz München-Ost mit A99/A94 und M18/EBE4', 'Großvorgang mit verbundener Kreisstraßenplanung; keine Gleichsetzung mit dem separaten B304-Brückenersatz bei Haar.'),
        'tempo30': ('Tempo 30 an der B471 / Aschheimer Straße', 'Bürgerantrag und dokumentierte Stellungnahme; Vorlage ist kein zusätzlicher Ratsbeschluss.'),
    }
    for key, (title, description) in processes.items():
        rows['processes'].append(dict(id=uid('process', key), slug=BATCH+'-'+key, title=PREFIX+title,
            description=description, current_state='Entwicklungsdaten aus Demonstrator; fachliche Prüfung vor Echtübernahme erforderlich.', status='active'))
    records = list(snapshot['contributions'])
    records.append(dict(id='R069-update-20261007', date='2026-10-07',
        title='Hundewiese: Beratung für den 15. Oktober angekündigt',
        subtitle='Öffentliche Tagesordnung, noch keine neue Sachentscheidung.',
        sachinformation='Die öffentliche Tagesordnung des Gemeinderats vom 15. Oktober führt die Hundewiese unter TOP 2 erneut auf. Damit ist der zuvor noch offene Sitzungstermin nun bestätigt; eine neue Sachentscheidung liegt noch nicht vor.',
        sources=[dict(name='RIS Feldkirchen – Gemeinderat 15.10.2026, TOP 2 / Vorlage 5283/2026',
            url='https://buergerinfo-feldkirchen.digitalfabrix.de/si0057.asp?__ksinr=1031', date='2026-10-07',
            date_basis='public_agenda_release_from_addendum', date_status='demonstrator_addendum', type='primary_official')]))
    groups = dict(R069='hundewiese', R068='parkraum', R026='parkraum', R008='kreuz-ost', R052='kreuz-ost', R094='tempo30')
    groups['R069-update-20261007'] = 'hundewiese'
    source_names = {
        'buergerinfo-feldkirchen.digitalfabrix.de': ('RIS Feldkirchen', 'official'),
        'www.feldkirchen.de': ('Gemeinde Feldkirchen', 'official'),
        'www.merkur.de': ('Münchner Merkur', 'press'),
    }
    from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode
    def canonical(url):
        p = urlsplit(url)
        return urlunsplit((p.scheme.lower(), p.netloc.lower(), p.path, urlencode(sorted(parse_qsl(p.query))), ''))
    sources, findings, mappings = {}, {}, []
    for b in records:
        key = b['id']; eid = uid('event', key); mid = uid('message', key)
        # Dates are calendar dates in the source, not verified instants.
        occurred = day(b['date'])
        note = f'Entwicklungsdaten; Import {BATCH}; Demonstrator {key}; Quelle {snapshot["commit"]}. Tagesgenau, Uhrzeit unbekannt. Keine neue redaktionelle Freigabe.'
        if key == 'R069':
            note += ' Ursprungsstand der Vorlage; Terminstatus durch separates Ereignis R069-update-20261007 fortgeschrieben. Datumsangabe 15.09. aus aktuellem Quellbestand, frühere 17.09.-Korrektur vor Echtübernahme prüfen.'
        rows['events'].append(dict(id=eid,title=PREFIX+b['title'],summary=note+'\n\n'+b['subtitle'],status='confirmed',occurred_at=occurred,confirmed_at=None))
        rows['messages'].append(dict(id=mid,event_id=eid,slug=BATCH+'-'+key.lower(),title=PREFIX+b['title'],
            teaser=b['subtitle'],body=b['sachinformation'],editorial_assessment=b.get('unsere_einordnung'),
            status='draft',approved_at=None,published_at=None,withdrawn_at=None))
        rows['event_processes'].append(dict(event_id=eid,process_id=uid('process',groups[key]),is_primary=True))
        mappings.append(dict(demonstrator_id=key,event_id=eid,message_id=mid,process_id=uid('process',groups[key]),
            original_date=b['date'],publication_date=b.get('publication_date'),date_precision='day',
            editorial_update=b.get('stage_update_meta',b.get('stage_E_meta')),history=b.get('bisheriger_verlauf',[])))
        for s in b['sources']:
            url = canonical(s['url']); host = urlsplit(url).netloc
            name,typ = source_names[host]; sid = uid('source',host); fid=uid('finding',url)
            sources[host] = dict(id=sid,name=PREFIX+name,source_type=typ,homepage_url='https://'+host,
                description=f'Entwicklungsquelle {BATCH}; kein aktivierter Quellenmonitor.',active=False)
            # Migrated fallback and context/session dates must not become publication dates.
            known = s.get('date_status') in ('verified','demonstrator_addendum') and s.get('date_basis') not in ('event_or_session_date','publication_context')
            published = day(s['date']) if known else None
            finding=dict(id=fid,source_id=sid,title=PREFIX+s['name'],original_url=s['url'],published_at=published,
                storage_ref=f'https://github.com/PustefixReisen/fib-echtsystem/blob/data/demonstrator-development-sample/data/development/{BATCH}/source-snapshot.json',
                public_via_fib=False,publication_rights_confirmed=False,currently_reachable=None,publicly_available=None)
            if url in findings and findings[url] != finding:
                raise ValueError('Conflicting shared finding: '+url)
            findings[url]=finding
            rows['event_findings'].append(dict(event_id=eid,finding_id=fid,evidence_role=s['type'],
                note=json.dumps(dict(batch=BATCH,demonstrator_id=key,original_source=s,date_precision='day',
                    imported_as='development_only',live_source_revalidated=False),ensure_ascii=False,sort_keys=True)))
    rows['sources']=list(sources.values()); rows['findings']=list(findings.values())
    payload=dict(batch=BATCH,development_only=True,source_commit=snapshot['commit'],
        source_snapshot_sha256=hashlib.sha256((OUT/'source-snapshot.json').read_bytes()).hexdigest(),
        rows=rows,mappings=mappings,
        deferred=['Sitzungen/TOPs/Beschlusspunkte: noch keine Tabellen; Originalkontext im Snapshot.',
            'Themen und Bedeutung für das Thema: keine automatische Bestätigung. T006/T012 sind nach Echtsystem-Regeln primär Vorgänge.',
            'Referenzobjekte, Bilder, offene Fragen und Mehr wissen: Originaldaten gesichert; kein vorgetäuschter operativer Import.'])
    (OUT/'manifest.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
    sql=['-- Generated by scripts/development-data/build.py; append-only technical import.',
         'begin;', "set local lock_timeout = '5s';", "set local statement_timeout = '30s';",
         'lock table '+', '.join('fib.'+t for t in rows)+' in share row exclusive mode;']
    for table, records in rows.items():
        keys = ['id'] if table not in ('event_processes','event_findings') else ['event_id','process_id' if table=='event_processes' else 'finding_id']
        for row in records:
            js=json.dumps(row,ensure_ascii=False,separators=(',',':'))
            # Typed comparison handles timestamptz canonicalization and SQL nulls.
            match=' and '.join('t.'+k+' = r.'+k for k in keys)
            fields=', '.join(row)
            equal=' and '.join('t.'+k+' is not distinct from r.'+k for k in row)
            collision = None
            if table=='findings': collision="t.original_url = r.original_url"
            elif table=='sources': collision="t.homepage_url = r.homepage_url or t.name = replace(r.name, "+literal(PREFIX)+", '')"
            elif table in ('events','messages','processes'): collision="t.title = r.title or t.title = replace(r.title, "+literal(PREFIX)+", '')"
            sql += ['do $fib_import$', 'declare r fib.'+table+'%rowtype;', 'begin',
                'select * into r from jsonb_populate_record(null::fib.'+table+', '+literal(js)+'::jsonb);',
                'if exists(select 1 from fib.'+table+' t where '+match+') then',
                '  if not exists(select 1 from fib.'+table+' t where '+match+' and '+equal+') then',
                "    raise exception 'Import conflict: "+table+' '+str(row[keys[0]])+"';",'  end if;', 'else']
            if collision:
                sql += ['  if exists(select 1 from fib.'+table+' t where '+collision+") then raise exception 'Natural-key collision: "+table+"'; end if;"]
            sql += ['  insert into fib.'+table+' ('+fields+') values ('+', '.join('r.'+k for k in row)+');',
                'end if;', 'end $fib_import$;']
    sql += ['commit;']
    (OUT/'import.sql').write_text('\n'.join(sql)+'\n')
    (OUT/'dry-run.sql').write_text('\n'.join(sql[:-1]+['rollback;'])+'\n')
    print(json.dumps({t:len(v) for t,v in rows.items()}))

if __name__ == '__main__':
    build()
