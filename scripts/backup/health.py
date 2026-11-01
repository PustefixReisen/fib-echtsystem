#!/usr/bin/env python3
"""Offline receipt audit: failure for missed backups; retention is a plan, never deletion."""
import argparse,datetime,json,pathlib,sys
from components import retention
p=argparse.ArgumentParser();p.add_argument('receipts');p.add_argument('--max-age-hours',type=int,default=24);p.add_argument('--retention-days',type=int,default=30);p.add_argument('--keep',type=int,default=7);a=p.parse_args()
try:
 now=datetime.datetime.now(datetime.timezone.utc)
 records=[json.loads(f.read_text()) for f in pathlib.Path(a.receipts).glob('*.json')]
 valid=[r for r in records if r.get('readback')=='passed']
 latest=max(datetime.datetime.fromisoformat(r['createdAt']) for r in valid)
 if a.max_age_hours<1 or not 0 <= (now-latest).total_seconds() <= a.max_age_hours*3600:raise ValueError('Backup overdue')
 print(json.dumps({'health':'passed','retentionCandidates':retention(valid,now,a.retention_days,a.keep),'deletionPerformed':False}))
except Exception:
 print('Backup audit failed: missing, invalid or overdue receipt.',file=sys.stderr);sys.exit(1)
