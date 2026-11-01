#!/usr/bin/env python3
"""Independently verify the encrypted private release backup and its receipt.

Read-only: never changes production state or remote objects. No credentials printed.
"""
import argparse
import json
import os
import pathlib
import re
import subprocess
import sys
import tempfile

APPROVED = "7a73db6178f17103c6802bd78ee6392e690b88da"

def require(value, reason):
    if not value:
        raise ValueError(reason)

def validate_receipt(receipt, backup_id, digest):
    require(receipt.get("backupId") == backup_id, "Wrong receipt backup ID")
    require(receipt.get("commit") == APPROVED, "Wrong receipt release commit")
    require(receipt.get("mode") == "release", "Release-mode backup required")
    require(receipt.get("readback") == "passed", "Backup readback not certified")
    require(receipt.get("manifestSha256") == digest, "Receipt manifest digest mismatch")
    require(isinstance(receipt.get("createdAt"), str), "Receipt timestamp missing")
    return True

def run(cmd, env):
    result = subprocess.run(cmd, env=env, capture_output=True, text=True, check=False, timeout=180)
    require(result.returncode == 0, "Private encrypted backup validation command failed")
    return result.stdout

def verify(backup_id, manifest_digest):
    require(re.fullmatch(r"release-[a-f0-9]{32}", backup_id), "Bad release ID")
    require(re.fullmatch(r"[a-f0-9]{64}", manifest_digest), "Bad manifest digest")
    config = os.environ.get("FIB_BACKUP_RCLONE_CONFIG", "")
    require(bool(config), "Protected FIB_BACKUP_RCLONE_CONFIG required")
    root = pathlib.Path(__file__).resolve().parents[2]
    with tempfile.TemporaryDirectory(prefix="fib-readback-") as folder:
        tmp = pathlib.Path(folder)
        os.chmod(tmp, 0o700)
        cfg = tmp / "rclone.conf"
        cfg.write_text(config)
        os.chmod(cfg, 0o600)
        rc = ["rclone", "--config", str(cfg)]
        env = {**os.environ, "FIB_BACKUP_MANIFEST_SHA256": manifest_digest}
        receipt_file = tmp / "receipt.json"
        run(rc + ["copyto", "fib-backup-crypt:Receipts/" + backup_id + ".json", str(receipt_file)], env)
        receipt = json.loads(receipt_file.read_text())
        validate_receipt(receipt, backup_id, manifest_digest)
        bundle = tmp / "bundle"
        bundle.mkdir(mode=0o700)
        run(rc + ["copy", "fib-backup-crypt:" + backup_id, str(bundle)], env)
        run(["node", str(root / "scripts/backup/bundle.mjs"),
             "verify", str(bundle), APPROVED], env)
        return {"backupId": backup_id, "commit": APPROVED, "createdAt": receipt["createdAt"],
                "manifestSha256": manifest_digest, "verifiedEncryptedReadback": True}

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--backup-id", required=True)
    p.add_argument("--manifest-sha256", required=True)
    args = p.parse_args()
    result = verify(args.backup_id, args.manifest_sha256)
    print(json.dumps(result, sort_keys=True))

if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, RuntimeError, json.JSONDecodeError, subprocess.TimeoutExpired):
        print("RIS backup verifier STOP: protected receipt or bundle failed verification", file=sys.stderr)
        sys.exit(1)
