#!/usr/bin/env python3
"""One-command, strictly read-only operator gate for the approved FIB RIS release.

All three existing checks must succeed in the same session. This NEVER deploys.
"""
import argparse
import importlib.util
import json
import os
import pathlib
import re
import subprocess
import sys
from datetime import datetime, timezone

APPROVED = "7a73db6178f17103c6802bd78ee6392e690b88da"

def load(name, filename):
    path = pathlib.Path(__file__).with_name(filename)
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

def validate_ready(backup, db, approved=APPROVED):
    if (backup.get("commit") != approved
            or backup.get("verifiedEncryptedReadback") is not True):
        raise ValueError("Encrypted release backup not independently verified")
    if (db.get("status") != "READ_ONLY_DB_INVENTORY_PASSED"
            or db.get("fib_tables") != 29
            or db.get("official_sources_inactive") != 2
            or db.get("ris_schema_not_installed") is not True):
        raise ValueError("Live database drift or missing database verification")
    recorded = datetime.fromisoformat(backup["createdAt"].replace("Z", "+00:00"))
    if recorded.tzinfo is None:
        raise ValueError("Naive release-backup timestamp")
    age = (datetime.now(timezone.utc) - recorded).total_seconds()
    if not -60 <= age <= 3600:
        raise ValueError("Release backup expired; fresh full backup required")
    return int(age)

def run_checks(backup_id, manifest_digest):
    pre = load("ris_preflight", "operator-preflight.py")
    backup_mod = load("ris_backup", "operator-backup-verify.py")
    db_mod = load("ris_db", "operator-db-inventory.py")
    backup = backup_mod.verify(backup_id, manifest_digest)
    db = db_mod.capture()
    age = validate_ready(backup, db)
    # preflight.main includes a separate, time-bound check against the
    # independently verified receipt, and checks live CLI inventory.
    old = sys.argv
    try:
        sys.argv = ["operator-preflight.py", "--backup-id", backup_id,
                    "--backup-manifest-sha256", manifest_digest,
                    "--backup-created-at", backup["createdAt"],
                    "--backup-commit", backup["commit"]]
        pre.main()
    finally:
        sys.argv = old
    return {"status": "READ_ONLY_OPERATOR_PREFLIGHT_PASSED",
            "approvedCommit": APPROVED, "backupId": backup_id,
            "manifestSha256": manifest_digest, "backupAgeSeconds": age,
            "independentEncryptedReadback": True,
            "liveDatabaseInventory": db["status"],
            "deploymentExecuted": False,
            "remainingBeforeWrite": [
                "Check release backup freshness again immediately before first write",
                "Confirm protected maintenance window and human AAL2 readiness",
                "Apply only the approved RIS rollout plan in a separate operator action",
            ]}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--backup-id", required=True)
    parser.add_argument("--manifest-sha256", required=True)
    parser.add_argument("--output", required=True, help="New private result file outside Git")
    args = parser.parse_args()
    if not re.fullmatch(r"release-[a-f0-9]{32}", args.backup_id):
        raise ValueError("Invalid release backup ID")
    if not re.fullmatch(r"[a-f0-9]{64}", args.manifest_sha256):
        raise ValueError("Invalid manifest SHA-256")
    result = run_checks(args.backup_id, args.manifest_sha256)
    root = pathlib.Path(__file__).resolve().parents[2]
    dest = pathlib.Path(args.output).expanduser().resolve()
    if dest.is_relative_to(root) or dest.exists():
        raise ValueError("Private result must be new and outside Git")
    dest.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    fd = os.open(dest, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, "w") as handle:
        json.dump(result, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
    print("RIS operator preflight PASSED (read-only); private receipt stored.")
    print("No deployment was executed. Freshness/AAL2/writes need separate review.")

if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, RuntimeError, KeyError, subprocess.TimeoutExpired):
        print("RIS operator preflight STOP; no deployment performed", file=sys.stderr)
        sys.exit(1)
