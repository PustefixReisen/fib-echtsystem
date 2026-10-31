#!/usr/bin/env python3
"""Private component capture, crypt upload and byte-verified readback. No deployment."""
import datetime,configparser,hashlib,json,os,pathlib,subprocess,tempfile,uuid,sys
from urllib.parse import urlparse

def configuration(text):
 c=configparser.ConfigParser(interpolation=None);c.read_string(text)
 if set(c.sections())!={'fib-nextcloud','fib-backup-crypt'}:raise ValueError('Only two dedicated backup remotes allowed')
 base=c['fib-nextcloud'];crypt=c['fib-backup-crypt'];u=urlparse(base.get('url',''))
 if set(base)-{'type','url','user','pass','vendor'} or set(crypt)-{'type','remote','password','password2','filename_encryption','directory_name_encryption'}:raise ValueError('Unexpected remote configuration option')
 if base.get('type')!='webdav' or u.scheme!='https' or u.username or u.password or u.query or u.fragment or not u.path.rstrip('/').endswith('/FIB-Backups'):raise ValueError('Dedicated HTTPS FIB-Backups directory required')
 if crypt.get('type')!='crypt' or crypt.get('remote')!='fib-nextcloud:' or not crypt.get('password') or crypt.get('filename_encryption','standard')!='standard' or crypt.get('directory_name_encryption','true')!='true':raise ValueError('Encrypted backup remote required')
 if not base.get('user') or not base.get('pass'):raise ValueError('Existing private WebDAV credentials required')
 return c

def inventory(root):
 result={}
 for p in sorted(root.rglob('*')):
  if p.is_symlink() or not (p.is_file() or p.is_dir()):raise ValueError('Unsupported file')
  if p.is_file():result[p.relative_to(root).as_posix()]=hashlib.sha256(p.read_bytes()).hexdigest()
 return result

def command(args,**kwargs):
 r=subprocess.run(args,stdout=subprocess.PIPE,stderr=subprocess.PIPE,timeout=600,**kwargs)
 if r.returncode:raise RuntimeError('Private transfer failed')
 return r

def backup(env,run=command):
 configuration(env.get('FIB_BACKUP_RCLONE_CONFIG',''))
 if not env.get('FIB_SFTP_KNOWN_HOSTS_TEXT','').strip():raise ValueError('Verified host key required')
 # Context cleanup covers successful runs and every exception; Actions adds an always() guard.
 with tempfile.TemporaryDirectory(prefix='fib-frontend-',dir=env.get('FIB_BACKUP_TEMP_PARENT')) as temp:
  root=pathlib.Path(temp);root.chmod(0o700)
  conf=root/'rclone.conf';conf.write_text(env['FIB_BACKUP_RCLONE_CONFIG']);conf.chmod(0o600)
  known=root/'known_hosts';known.write_text(env['FIB_SFTP_KNOWN_HOSTS_TEXT']);known.chmod(0o600)
  bundle=root/'bundle';bundle.mkdir(mode=0o700)
  child={**env,'FIB_SFTP_KNOWN_HOSTS':str(known)}
  run([sys.executable,str(pathlib.Path(__file__).with_name('frontend.py')),str(bundle/'frontend')],env=child)
  if not (bundle/'frontend/index.html').is_file():raise ValueError('Incomplete frontend capture')
  files=inventory(bundle/'frontend')
  manifest={'format':'fib-frontend-backup-v1','createdAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'component':'frontend','target':'fib.pustivo.de/redaktion/','releaseCommit':env.get('GITHUB_SHA'),'files':files}
  (bundle/'frontend-manifest.json').write_text(json.dumps(manifest,sort_keys=True,indent=2))
  expected=inventory(bundle)
  backup_id='frontend-'+uuid.uuid4().hex
  remote='fib-backup-crypt:Frontend/'+backup_id
  rc=['rclone','--config',str(conf)]
  run(rc+['copy',str(bundle),remote],env=env)
  returned=root/'returned';returned.mkdir(mode=0o700)
  run(rc+['copy',remote,str(returned)],env=env)
  if inventory(returned)!=expected:raise ValueError('Readback checksum mismatch')
  receipt={'format':'fib-frontend-receipt-v1','backupId':backup_id,'releaseCommit':env.get('GITHUB_SHA'),'manifestSha256':expected['frontend-manifest.json'],'fileCount':len(files),'readback':'passed','scope':'frontend-only; not a complete release backup'}
  proof=root/'receipt.json';proof.write_text(json.dumps(receipt,sort_keys=True));proof.chmod(0o600)
  run(rc+['copyto',str(proof),remote+'/receipt.json'],env=env)
  verify=root/'receipt-returned.json';run(rc+['copyto',remote+'/receipt.json',str(verify)],env=env)
  if verify.read_bytes()!=proof.read_bytes():raise ValueError('Receipt readback mismatch')
  return receipt
if __name__=='__main__':
 os.umask(0o077)
 try:
  receipt=backup(dict(os.environ));print('PASS encrypted frontend backup and readback: '+receipt['backupId'])
 except Exception:
  print('Frontend backup failed; private configuration/transfer verification required. No deployment performed.',file=sys.stderr);sys.exit(1)
