#!/usr/bin/env python3
"""Restore a trusted fib Custom Archive only into an ephemeral, networkless PG17 container."""
import argparse, hashlib, json, os, pathlib, re, subprocess, tempfile, time
p=argparse.ArgumentParser();p.add_argument('dump');p.add_argument('--sha256',required=True);p.add_argument('--report',required=True);a=p.parse_args()
os.umask(0o077)
data=pathlib.Path(a.dump).read_bytes()
if hashlib.sha256(data).hexdigest()!=a.sha256 or data[:5]!=b'PGDMP':raise SystemExit('Dump/hash mismatch')
report=pathlib.Path(a.report).resolve()
if report.exists():raise SystemExit('Report must be new')
name='fib-restore-'+os.urandom(8).hex()
def run(args,body=None):
 r=subprocess.run(args,input=body,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
 if r.returncode:raise RuntimeError('Private restore step failed; no database contents printed')
 return r.stdout
def sql(q):return run(['docker','exec','-i',name,'psql','-U','postgres','-d','postgres','-v','ON_ERROR_STOP=1','-At'],q.encode()).decode()
try:
 run(['docker','run','--detach','--name',name,'--network=none','-e','POSTGRES_HOST_AUTH_METHOD=trust','postgres:17'])
 for i in range(60):
  r=subprocess.run(['docker','exec',name,'pg_isready','-U','postgres'],capture_output=True)
  if r.returncode==0:break
  time.sleep(1)
 else:raise RuntimeError('Isolated PostgreSQL unavailable')
 sql('CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY);'+''.join('CREATE ROLE '+r+' NOLOGIN;' for r in ['fib_runtime','fib_app','anon','authenticated','service_role']))
 base=['docker','exec','-i',name,'pg_restore','-U','postgres','--no-owner','--exit-on-error']
 toc=run(base+['--list'],data).decode()
 # Refuse archives containing data/objects from another application schema.
 for line in toc.splitlines():
  if line.startswith(';'):continue
  if re.search(r' (TABLE|TABLE DATA|SCHEMA|FUNCTION|SEQUENCE|VIEW) (public|auth) ',line):raise RuntimeError('Non-FIB archive refused')
 for section in ['pre-data','data']:
  run(base+['--dbname=postgres','--section='+section],data)
 post=run(base+['--section=post-data','--file=-'],data).decode()
 # Populate only isolated FK placeholders from restored FIB rows before constraint validation.
 pattern=r'ALTER TABLE ONLY fib\.([a-z_]+)\s+ADD CONSTRAINT [^;]+?FOREIGN KEY \(([a-z_]+)\) REFERENCES auth\.users\(id\)'
 for table,col in re.findall(pattern,post,re.S):
  sql(f'INSERT INTO auth.users SELECT DISTINCT "{col}" FROM fib."{table}" WHERE "{col}" IS NOT NULL ON CONFLICT DO NOTHING;')
 run(base+['--dbname=postgres','--section=post-data'],data)
 tables=sql("SELECT tablename FROM pg_tables WHERE schemaname='fib' ORDER BY tablename;").splitlines()
 counts={t:int(sql('SELECT count(*) FROM fib."'+t.replace('"','""')+'";')) for t in tables}
 rls=int(sql("SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='fib' AND c.relkind='r' AND c.relrowsecurity;"))
 if not tables or rls!=len(tables):raise RuntimeError('Missing tables or RLS')
 if sql("SELECT has_table_privilege('fib_runtime','fib.events','SELECT');").strip()!='t':raise RuntimeError('Runtime ACL missing')
 report.parent.mkdir(parents=True,exist_ok=True)
 with report.open('x') as f:json.dump({'dumpSha256':a.sha256,'postgresMajor':17,'restore':'passed','tableCounts':counts,'rlsTables':rls,'runtimeSelectEvents':True,'auth':'isolated FK placeholders only','target':'ephemeral networkless container'},f,indent=2)
 print('PASS isolated PostgreSQL17 restore; private report written. No Shared-Apps connection.')
finally:
 subprocess.run(['docker','rm','--force','--volumes',name],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
