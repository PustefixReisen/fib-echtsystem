#!/usr/bin/env python3
"""Complete FIB capture. Only private reviewed exports remain operator inputs."""
import datetime,hashlib,importlib.util,json,os,pathlib,re,sys,tempfile,urllib.request,uuid
from components import exports
spec=importlib.util.spec_from_file_location('frontend',pathlib.Path(__file__).with_name('frontend-run.py'))
f=importlib.util.module_from_spec(spec);spec.loader.exec_module(f)

def backup(env,run=f.command):
 print('Backup phase: prerequisites',flush=True)
 mode=env.get('FIB_BACKUP_MODE','manual');commit=env.get('GITHUB_SHA','')
 if mode not in ['release','manual','regular'] or not re.fullmatch('[a-f0-9]{40}',commit):raise ValueError('Invalid mode/commit')
 for key in ['FIB_MAINTENANCE_DATABASE_URL','FIB_BACKUP_MANAGEMENT_TOKEN','FIB_SFTP_KNOWN_HOSTS_TEXT','FIB_BACKUP_INPUT_ID']:
  if not env.get(key):raise ValueError('Missing protected prerequisite')
 if not re.fullmatch('[a-zA-Z0-9_-]{1,80}',env['FIB_BACKUP_INPUT_ID']):raise ValueError('Invalid reviewed input ID')
 f.configuration(env.get('FIB_BACKUP_RCLONE_CONFIG',''))
 with tempfile.TemporaryDirectory(prefix='fib-complete-',dir=env.get('FIB_BACKUP_TEMP_PARENT')) as tmp:
  root=pathlib.Path(tmp);root.chmod(0o700);bundle=root/'bundle';bundle.mkdir(mode=0o700)
  conf=root/'rclone.conf';conf.write_text(env['FIB_BACKUP_RCLONE_CONFIG']);conf.chmod(0o600)
  rc=['rclone','--config',str(conf)]
  print('Backup phase: download-private-input',flush=True)
  run(rc+['copy','fib-backup-crypt:Inputs/'+env['FIB_BACKUP_INPUT_ID'],str(bundle)],env=env)
  if not {'edge','configuration'} <= set(p.name for p in bundle.iterdir()) or set(p.name for p in bundle.iterdir())-{'edge','configuration','originals'}:raise ValueError('Unexpected private input components')
  print('Backup phase: validate-input-layout',flush=True)
  f.inventory(bundle) # reject symlinks before reading exports
  print('Backup phase: fetch-live-function-inventory',flush=True)
  req=urllib.request.Request('https://api.supabase.com/v1/projects/apaubomxffcwtzjimori/functions',headers={'Authorization':'Bearer '+env['FIB_BACKUP_MANAGEMENT_TOKEN']})
  with urllib.request.urlopen(req,timeout=30) as response:live=json.load(response)
  if isinstance(live,dict):live=live['functions']
  print('Backup phase: validate-function-exports',flush=True)
  now=datetime.datetime.now(datetime.timezone.utc);slugs=exports(bundle,live,now)
  print('Backup phase: database-capture',flush=True)
  run(['node','scripts/ris-shared-apps/backup.mjs','--out='+str(bundle/'database')],env=env)
  dump=bundle/'database/fib.dump';digest=hashlib.sha256(dump.read_bytes()).hexdigest()
  print('Backup phase: isolated-database-restore',flush=True)
  run([sys.executable,'scripts/backup/restore-local.py',str(dump),'--sha256',digest,'--report',str(bundle/'database/restore.json')],env=env)
  restored=json.loads((bundle/'database/restore.json').read_text())
  captured=json.loads((bundle/'database/manifest.json').read_text())
  if restored.get('restore')!='passed' or restored.get('tableCounts')!=captured.get('tableCounts') or restored.get('dumpSha256')!=digest:raise ValueError('Restore evidence mismatch')
  known=root/'known_hosts';known.write_text(env['FIB_SFTP_KNOWN_HOSTS_TEXT']);known.chmod(0o600)
  print('Backup phase: frontend-capture',flush=True)
  run([sys.executable,'scripts/backup/frontend.py',str(bundle/'frontend')],env={**env,'FIB_SFTP_KNOWN_HOSTS':str(known)})
  evidence={'commit':commit,'databaseRestore':True,'edgeExport':True,'frontendExport':True,'configurationCapture':True}
  (bundle/'configuration/evidence.json').write_text(json.dumps(evidence))
  (bundle/'capture.json').write_text(json.dumps({'mode':mode,'createdAt':now.isoformat(),'functions':slugs,'source':'live metadata; reviewed private code/config exports'}))
  print('Backup phase: seal-bundle',flush=True)
  run(['node','scripts/backup/bundle.mjs','seal',str(bundle),commit],env=env)
  expected=f.inventory(bundle);backup_id='release-'+uuid.uuid4().hex;remote='fib-backup-crypt:'+backup_id
  print('Backup phase: upload-bundle',flush=True)
  run(rc+['copy',str(bundle),remote],env=env)
  returned=root/'returned';returned.mkdir(mode=0o700)
  print('Backup phase: readback-bundle',flush=True)
  run(rc+['copy',remote,str(returned)],env=env)
  if f.inventory(returned)!=expected:raise ValueError('Complete readback mismatch')
  manifest=expected['release.json']
  print('Backup phase: verify-bundle',flush=True)
  run(['node','scripts/backup/bundle.mjs','verify',str(returned),commit],env={**env,'FIB_BACKUP_MANIFEST_SHA256':manifest})
  receipt={'backupId':backup_id,'createdAt':now.isoformat(),'commit':commit,'mode':mode,'readback':'passed','manifestSha256':manifest,'bytes':sum(p.stat().st_size for p in bundle.rglob('*') if p.is_file())}
  proof=root/'receipt.json';proof.write_text(json.dumps(receipt));proof.chmod(0o600)
  print('Backup phase: upload-receipt',flush=True)
  run(rc+['copyto',str(proof),'fib-backup-crypt:Receipts/'+backup_id+'.json'],env=env)
  print('Backup phase: verify-receipt',flush=True)
  check=root/'proof.json';run(rc+['copyto','fib-backup-crypt:Receipts/'+backup_id+'.json',str(check)],env=env)
  if check.read_bytes()!=proof.read_bytes():raise ValueError('Receipt mismatch')
  return receipt
def emit_verified_receipt(receipt,env):
 """Action outputs only after readback/receipt verification is complete."""
 if receipt.get('readback')!='passed' or not re.fullmatch(r'release-[a-f0-9]{32}',receipt.get('backupId','')) or not re.fullmatch(r'[a-f0-9]{64}',receipt.get('manifestSha256','')) or not re.fullmatch(r'[a-f0-9]{40}',receipt.get('commit','')):
  raise ValueError('Invalid release receipt')
 output=env.get('GITHUB_OUTPUT','')
 if not output:raise ValueError('GitHub Actions output channel unavailable')
 with open(output,'a',encoding='utf-8') as stream:
  stream.write('backup_id='+receipt['backupId']+'\n')
  stream.write('manifest_sha256='+receipt['manifestSha256']+'\n')
  stream.write('verified_commit='+receipt['commit']+'\n')

if __name__=='__main__':
 os.umask(0o077)
 try:
  env=dict(os.environ);receipt=backup(env)
  if env.get('FIB_BACKUP_EMIT_GITHUB_OUTPUT')=='true':
   emit_verified_receipt(receipt,env)
   print('Complete FIB release backup verified and sealed; private receipt passed to protected workflow.')
  else:print(json.dumps(receipt))
 except Exception:
  print('Complete backup failed; inspect protected prerequisites. No deployment permitted.',file=sys.stderr);sys.exit(1)
