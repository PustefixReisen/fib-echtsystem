import datetime,importlib.util,json,pathlib,sys,tempfile,unittest
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[2]/'scripts/backup'))
from components import exports,fresh,retention
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
   (root/'edge/inventory.json').write_text(json.dumps(live))
   (root/'edge/fib-example/index.ts').write_text('export const x=1;')
   (root/'configuration/capture.json').write_text(json.dumps(dict(capturedAt=now.isoformat(),featureStatesReviewed=True,completeFunctionExportsReviewed=True)))
   self.assertEqual(exports(root,live,now),['fib-example'])
   with self.assertRaises(ValueError):exports(root,live+[dict(slug='fib-other')],now)
   with self.assertRaises(ValueError):exports(root,[dict(live[0],version=2)],now)
   (root/'edge/fib-example/index.ts').write_text("import '../_shared/missing.ts';")
   with self.assertRaises(ValueError):exports(root,live,now)
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
