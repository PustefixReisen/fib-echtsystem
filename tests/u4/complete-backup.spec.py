import datetime,importlib.util,json,pathlib,sys,tempfile,unittest,hashlib
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[2]/'scripts/backup'))
from components import exports,fresh,retention
def fixture_snapshots(root,live):
 snapshots=root/'edge'/'_deployed_bundles'
 snapshots.mkdir()
 inventory=[]
 for row in live:
  slug=row['slug']
  body=b'ESZIP' + slug.encode('ascii')
  (snapshots/(slug+'.eszip')).write_bytes(body)
  inventory.append({**row,'download_eszip_sha256':hashlib.sha256(body).hexdigest()})
 (root/'edge/inventory.json').write_text(json.dumps(inventory))
class Contracts(unittest.TestCase):
 def test_age(self):
  now=datetime.datetime.now(datetime.timezone.utc)
  fresh(now.isoformat(),now)
  for hours in [-2,2]:
   with self.assertRaises(ValueError):fresh((now+datetime.timedelta(hours=hours)).isoformat(),now)
 def test_inventory(self):
  now=datetime.datetime.now(datetime.timezone.utc)
  live=[dict(slug='fib-example',version=1,verify_jwt=False,ezbr_sha256='hash')]
  with tempfile.TemporaryDirectory() as tmp:
   root=pathlib.Path(tmp);(root/'edge/fib-example').mkdir(parents=True);(root/'configuration').mkdir()
   fixture_snapshots(root,live)
   (root/'edge/fib-example/index.ts').write_text('export const x=1;')
   (root/'configuration/capture.json').write_text(json.dumps(dict(capturedAt=now.isoformat(),featureStatesReviewed=True,completeFunctionExportsReviewed=True)))
   self.assertEqual(exports(root,live,now),['fib-example'])
   snapshot=root/'edge/_deployed_bundles/fib-example.eszip'
   snapshot.write_bytes(b'ESZIPtampered')
   with self.assertRaisesRegex(ValueError,'readback mismatch'):exports(root,live,now)
   fixture_bytes=b'ESZIPfib-example'
   snapshot.write_bytes(fixture_bytes)
   with self.assertRaises(ValueError):exports(root,live+[dict(slug='fib-other')],now)
   with self.assertRaises(ValueError):exports(root,[dict(live[0],version=2)],now)
   (root/'edge/fib-example/index.ts').write_text('const padded = "=".repeat(4); const header = req.headers.get("Authorization");')
   self.assertEqual(exports(root,live,now),['fib-example'])
   (root/'edge/fib-example/index.ts').write_text("import './present.ts';")
   (root/'edge/fib-example/present.ts').write_text('export const present=true;')
   self.assertEqual(exports(root,live,now),['fib-example'])
   (root/'edge/fib-example/index.ts').write_text("import '../_shared/missing.ts';")
   with self.assertRaises(ValueError):exports(root,live,now)
   (root/'edge/fib-example/index.ts').write_text("export * from './missing-reexport.ts';")
   with self.assertRaises(ValueError):exports(root,live,now)
   (root/'edge/fib-example/index.ts').write_text("import './missing-sideeffect.ts';")
   with self.assertRaises(ValueError):exports(root,live,now)
   (root/'edge/fib-example/index.ts').write_text("const x = import('./missing-dynamic.ts');")
   with self.assertRaises(ValueError):exports(root,live,now)
 def test_nested_shared_type_dependency_in_complete_export(self):
  now=datetime.datetime.now(datetime.timezone.utc)
  live=[dict(slug='fib-u4-pilot',version=11,verify_jwt=True,ezbr_sha256='a'*64)]
  with tempfile.TemporaryDirectory() as tmp:
   root=pathlib.Path(tmp);(root/'edge/fib-u4-pilot').mkdir(parents=True)
   (root/'edge/_shared').mkdir();(root/'configuration').mkdir()
   fixture_snapshots(root,live)
   (root/'edge/fib-u4-pilot/index.ts').write_text('import "../_shared/development-datasets.ts";')
   (root/'edge/_shared/development-datasets.ts').write_text(
    'import type { RisSql } from "./ris-structure.ts";')
   (root/'configuration/capture.json').write_text(json.dumps({
    'capturedAt':now.isoformat(),
    'featureStatesReviewed':True,
    'completeFunctionExportsReviewed':True}))
   with self.assertRaises(ValueError):
    exports(root,live,now)
   # The missing historical type can be provided by the combined FIB
   # source set, but only if its actual deployed bytes were checked
   # independently by export-deployed-edge and final run.py.
   (root/'edge/_shared/ris-structure.ts').write_text('export type RisSql = object;')
   self.assertEqual(exports(root,live,now),['fib-u4-pilot'])
   (root/'edge/_shared/ris-structure.ts').unlink()
   with self.assertRaises(ValueError):
    exports(root,live,now)

 def test_live_eszip_matches_reviewed_snapshot(self):
  spec=importlib.util.spec_from_file_location('runner',pathlib.Path(__file__).resolve().parents[2]/'scripts/backup/run.py')
  m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
  body=b'ESZIPrestorable-snapshot'
  good={'fib-example':dict(download_eszip_sha256=hashlib.sha256(body).hexdigest())}
  m.verify_live_snapshot(good,{'fib-example':body})
  with self.assertRaises(ValueError):m.verify_live_snapshot(good,{'fib-example':b'ESZIPchanged'})
  with self.assertRaises(ValueError):m.verify_live_snapshot(good,{})
  with self.assertRaises(ValueError):m.verify_live_snapshot(good,{'fib-example':b'not-eszip'})
 def test_retention_never_deletes(self):
  now=datetime.datetime.now(datetime.timezone.utc)
  records=[dict(backupId=str(i),createdAt=(now-datetime.timedelta(days=i*10)).isoformat(),readback='passed') for i in range(4)]
  self.assertEqual(retention(records,now,15,2),['2','3'])
  with self.assertRaises(ValueError):retention(records,now,0,0)
 def test_missing_access_is_fail_closed(self):
  spec=importlib.util.spec_from_file_location('runner',pathlib.Path(__file__).resolve().parents[2]/'scripts/backup/run.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
  with self.assertRaises(ValueError):m.backup({'GITHUB_SHA':'a'*40},lambda *a,**k:self.fail('No transfer without prerequisites'))
 def test_failed_input_download_cleans_private_files(self):
  spec=importlib.util.spec_from_file_location('runner',pathlib.Path(__file__).resolve().parents[2]/'scripts/backup/run.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
  config='[fib-nextcloud]\ntype=webdav\nurl=https://example.invalid/FIB-Backups\nuser=test\npass=synthetic\n[fib-backup-crypt]\ntype=crypt\nremote=fib-nextcloud:\npassword=synthetic\n'
  with tempfile.TemporaryDirectory() as tmp:
   env=dict(GITHUB_SHA='a'*40,FIB_MAINTENANCE_DATABASE_URL='synthetic',FIB_BACKUP_MANAGEMENT_TOKEN='synthetic',FIB_SFTP_KNOWN_HOSTS_TEXT='synthetic',FIB_BACKUP_INPUT_ID='test',FIB_BACKUP_RCLONE_CONFIG=config,FIB_BACKUP_TEMP_PARENT=tmp)
   def fail(*args,**kw):raise RuntimeError('simulated denied/aborted transfer')
   with self.assertRaises(RuntimeError):m.backup(env,fail)
   self.assertEqual(list(pathlib.Path(tmp).iterdir()),[])
unittest.main()
