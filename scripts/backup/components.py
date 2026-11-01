"""Application-neutral private inventory, freshness and retention planning contracts."""
import datetime,json,pathlib,re

def fresh(value, now, hours=1):
 t=datetime.datetime.fromisoformat(value.replace('Z','+00:00'))
 if t.tzinfo is None or not -60 <= (now-t).total_seconds() <= hours*3600:
  raise ValueError('Stale component evidence')

def exports(root, live, now):
 inventory=json.loads((root/'edge/inventory.json').read_text())
 expected={f['slug']:f for f in live if f['slug'].startswith('fib-')}
 if not expected or len(inventory)!=len(expected):raise ValueError('Incomplete deployed function set')
 seen=set()
 for f in inventory:
  slug=f['slug']
  if slug in seen or slug not in expected:raise ValueError('Unexpected function')
  seen.add(slug)
  if expected[slug].get('import_map'):raise ValueError('Import-map export requires explicit adapter review')
  for key in ['version','verify_jwt','ezbr_sha256']:
   if f.get(key)!=expected[slug].get(key) or f.get(key) is None:raise ValueError('Deployment drift')
  folder=root/'edge'/slug
  if not (folder/'index.ts').is_file():raise ValueError('Missing entrypoint')
  # Every relative code dependency must be present within the exported edge tree.
  for file in folder.rglob('*'):
   if file.is_file() and file.suffix in ['.ts','.js','.mjs','.json']:
    for dep in re.findall(r'''(?:from\s*|import\s*\()?["'](\.{1,2}/[^"'\r\n]+)["']''',file.read_text()):
     target=(file.parent/dep).resolve()
     if not target.is_relative_to((root/'edge').resolve()) or not target.is_file():raise ValueError('Missing relative dependency')
 evidence=json.loads((root/'configuration/capture.json').read_text())
 fresh(evidence['capturedAt'],now)
 if evidence.get('featureStatesReviewed') is not True or evidence.get('completeFunctionExportsReviewed') is not True:
  raise ValueError('Private operator review required')
 return sorted(expected)

def retention(records,now,days,keep):
 if days<1 or keep<1:raise ValueError('Retention requires positive limits')
 valid=sorted((r for r in records if r.get('readback')=='passed'),key=lambda r:r['createdAt'],reverse=True)
 return [r['backupId'] for r in valid[keep:] if (now-datetime.datetime.fromisoformat(r['createdAt'])).total_seconds()>days*86400]
