#!/usr/bin/env python3
"""Read-only SFTP capture using existing deployment credentials; never prints lftp output."""
import os,pathlib,re,subprocess,sys
os.umask(0o077)
try:
 host=os.environ['IONOS_SFTP_HOST'];user=os.environ['IONOS_SFTP_USER'];password=os.environ['IONOS_SFTP_PASSWORD'];known=os.environ['FIB_SFTP_KNOWN_HOSTS']
 target=pathlib.Path(sys.argv[1]).resolve();repo=pathlib.Path(__file__).resolve().parents[2]
 if not re.fullmatch(r'[a-zA-Z0-9.-]+',host) or not re.fullmatch(r'[/a-zA-Z0-9_.-]+',known) or not pathlib.Path(known).is_file() or target==repo or repo in target.parents or target.exists():raise ValueError()
 def q(s):
  if '\n' in s or '\r' in s or '\x00' in s:raise ValueError()
  return '"'+s.replace('\\','\\\\').replace('"','\\"').replace('$','\\$').replace('`','\\`')+'"'
 keycheck=subprocess.run(['ssh-keygen','-F',host,'-f',known],stdout=subprocess.PIPE,stderr=subprocess.PIPE)
 if keycheck.returncode:raise ValueError()
 target.mkdir(parents=True,mode=0o700)
 commands='\n'.join(['set cmd:fail-exit yes','set net:max-retries 1','set net:timeout 30','set sftp:connect-program '+q('ssh -a -x -o StrictHostKeyChecking=yes -o UserKnownHostsFile='+known),'open -u '+q(user)+','+q(password)+' '+q('sftp://'+host),'mirror --no-perms redaktion '+q(str(target)),'bye'])
 r=subprocess.run(['lftp'],input=commands.encode(),stdout=subprocess.PIPE,stderr=subprocess.PIPE,timeout=300)
 if r.returncode or not (target/'index.html').is_file():raise RuntimeError()
 for p in target.rglob('*'):
  if p.is_symlink():raise RuntimeError()
  p.chmod(0o700 if p.is_dir() else 0o600)
 print('Private frontend capture complete; verify inventory before sealing.')
except Exception:
 print('Frontend capture failed; no deployment permitted. Check existing credentials/verified host key privately.',file=sys.stderr);sys.exit(1)
