#!/usr/bin/env python3
"""Read-only operator gate for the approved FIB RIS release (#368).

This command NEVER performs deployment, migration, secret changes, or backup.
"""
import argparse
import json
import os
import pathlib
import re
import subprocess
import sys
from datetime import datetime, timezone

APPROVED_SHA = "7a73db6178f17103c6802bd78ee6392e690b88da"
PROJECT = "apaubomxffcwtzjimori"
MIGRATIONS = (
    "20261031081340_fib_ris_editorial_structure",
    "20261031132655_fib_development_dataset_manifest",
)
FUNCTIONS = {
    "fib-editorial-write": (8, False),
    "fib-u4-pilot": (2, True),
    "fib-u4-ris-pilot": (12, True),
}

def command(*args):
    result = subprocess.run(args, capture_output=True, text=True, check=False)
    if result.returncode:
        raise RuntimeError("Preflight command failed: " + args[0])
    return result.stdout.strip()

def require(condition, message):
    if not condition:
        raise RuntimeError(message)

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--backup-id", required=True)
    p.add_argument("--backup-manifest-sha256", required=True)
    p.add_argument("--backup-created-at", required=True, help="ISO 8601 UTC from verified receipt")
    p.add_argument("--backup-commit", required=True, help="Commit recorded in verified receipt")
    p.add_argument("--output", help="Private JSON report outside repository")
    a = p.parse_args()
    root = pathlib.Path(__file__).resolve().parents[2]
    require(re.fullmatch(r"release-[0-9a-f]{32}", a.backup_id) is not None, "Invalid backup ID")
    require(re.fullmatch(r"[0-9a-f]{64}", a.backup_manifest_sha256) is not None,
            "Invalid manifest digest")
    require(a.backup_commit == APPROVED_SHA, "Backup commit does not match approved release")
    recorded = datetime.fromisoformat(a.backup_created_at.replace("Z", "+00:00"))
    require(recorded.tzinfo is not None, "Backup timestamp needs timezone")
    age = (datetime.now(timezone.utc) - recorded).total_seconds()
    require(-60 <= age <= 3600, "Backup is not fresh (maximum one hour)")
    # The operator tool may live on a separate development branch. Only origin/main\n    # identifies the approved release; do not mistake the tool branch for payload.\n    require(command("git", "-C", str(root), "cat-file", "-t", APPROVED_SHA) == "commit",\n            "Approved release commit is unavailable locally")
    require(not command("git", "-C", str(root), "status", "--porcelain"),
            "Local checkout is dirty")
    require(command("git", "-C", str(root), "rev-parse", "origin/main") == APPROVED_SHA,
            "Local origin/main differs from approved release; fetch/review first")

    # The Supabase management CLI is read only here. No secret values are retrieved.
    live = json.loads(command("supabase", "functions", "list",
                              "--project-ref", PROJECT, "--output", "json"))
    deployed = {f["slug"]: f for f in live if f.get("slug", "").startswith("fib-")}
    require(len(deployed) == 9, "Unexpected total number of FIB functions")
    for slug, (version, jwt) in FUNCTIONS.items():
        f = deployed.get(slug)
        require(f is not None and f.get("version") == version and f.get("verify_jwt") is jwt,
                "FIB function deployment drift: " + slug)

    migrations = command("supabase", "migration", "list", "--linked")
    for migration in MIGRATIONS:
        require(migration.split("_", 1)[0] not in migrations,
                "RIS migration already registered: " + migration)

    # Presence only; CLI must never print actual secret values in the report.
    secrets = command("supabase", "secrets", "list", "--project-ref", PROJECT)
    require("FIB_RIS_STRUCTURE_ENABLED" not in secrets,
            "Feature switch already exists; inspect privately before continuing")

    checks = {
        "approvedCommit": APPROVED_SHA,\n        "operatorCodeIsNotReleasePayload": True,
        "backupId": a.backup_id,
        "backupManifestSha256": a.backup_manifest_sha256,
        "backupAgeSeconds": int(age),
        "functions": sorted(deployed),
        "risMigrationsUnregistered": True,
        "featureSwitchAbsent": True,
        "status": "READ_ONLY_PARTIAL_PREFLIGHT",
        "pending": [
            "Verify backup receipt and encrypted readback independently",
            "Verify 29 FIB tables and exact source identities using private PostgreSQL connection",
            "Confirm FIB maintenance window and AAL2 session",
            "Recheck backup age immediately before first write",
        ],
    }
    if a.output:
        target = pathlib.Path(a.output).expanduser().resolve()
        require(not target.is_relative_to(root), "Report must be outside Git repository")
        require(not target.exists(), "Do not overwrite private report")
        target.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
        fd = os.open(target, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, "w") as out:
            json.dump(checks, out, ensure_ascii=False, indent=2)
            out.write("\n")
    print("Read-only partial preflight passed; no database or deployment changes made.")
    print("STOP: Remaining gates in report must pass before any RIS write.")

if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, RuntimeError) as exc:
        print("RIS preflight STOP: " + str(exc), file=sys.stderr)
        sys.exit(1)
