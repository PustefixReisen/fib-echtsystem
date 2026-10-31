import importlib.util,pathlib,tempfile,unittest,shutil,os,subprocess,sys
spec=importlib.util.spec_from_file_location('backup','scripts/backup/frontend-run.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
CONFIG='[fib-nextcloud]\ntype=webdav\nurl=https://example.invalid/remote.php/dav/files/test/FIB-Backups\nuser=test\npass=synthetic\n[fib-backup-crypt]\ntype=crypt\nremote=fib-nextcloud:\npassword=synthetic\n'
class Tests(unittest.TestCase):
 def test_config(self):
  for v in ['',CONFIG.replace('type=crypt','type=local'),CONFIG.replace('/FIB-Backups','/private'),CONFIG+'[private]\ntype=local\n']:
   with self.assertRaises(Exception):m.configuration(v)
 def test_invalid_hostkey(self):
  with tempfile.TemporaryDirectory() as tmp:
   key=pathlib.Path(tmp)/'known_hosts';key.write_text('not a host key')
   result=subprocess.run([sys.executable,'scripts/backup/frontend.py',tmp+'/capture'],env={**os.environ,'IONOS_SFTP_HOST':'example.invalid','IONOS_SFTP_USER':'test','IONOS_SFTP_PASSWORD':'synthetic-private-value','FIB_SFTP_KNOWN_HOSTS':str(key)},capture_output=True)
   self.assertNotEqual(result.returncode,0);self.assertNotIn(b'synthetic-private-value',result.stdout+result.stderr);self.assertFalse((pathlib.Path(tmp)/'capture').exists())
 def test_transfers(self):
  for failure in ['none','sftp','incomplete','upload','tamper','receipt']:
   with self.subTest(failure=failure),tempfile.TemporaryDirectory() as tmp:
    remote=pathlib.Path(tmp)/'remote';parent=pathlib.Path(tmp)/'private';parent.mkdir()
    env={'FIB_BACKUP_RCLONE_CONFIG':CONFIG,'FIB_SFTP_KNOWN_HOSTS_TEXT':'synthetic test key','FIB_BACKUP_TEMP_PARENT':str(parent),'GITHUB_SHA':'a'*40}
    def run(args,**kw):
     if args[0]!='rclone':
      if failure=='sftp':raise RuntimeError('synthetic')
      p=pathlib.Path(args[-1]);p.mkdir();
      if failure!='incomplete':(p/'index.html').write_text('synthetic frontend')
     elif 'copy' in args:
      a,b=args[-2:]
      if a.startswith('fib-backup-crypt:'):
       shutil.copytree(remote,b,dirs_exist_ok=True)
       if failure=='tamper':(pathlib.Path(b)/'frontend/index.html').write_text('changed')
      else:
       if failure=='upload':raise RuntimeError('synthetic')
       shutil.copytree(a,remote)
     else:
      a,b=args[-2:]
      if a.startswith('fib-backup-crypt:'):
       shutil.copyfile(remote/'receipt.json',b)
       if failure=='receipt':pathlib.Path(b).write_text('changed')
      else:shutil.copyfile(a,remote/'receipt.json')
    if failure=='none':self.assertEqual(m.backup(env,run)['readback'],'passed')
    else:
     with self.assertRaises(Exception):m.backup(env,run)
    self.assertEqual(list(parent.iterdir()),[])
if __name__=='__main__':unittest.main()
