#!/usr/bin/env python3
"""Upload an independently reviewed private FIB input to existing rclone-crypt.

Creates a random input_id only after validated encrypted upload and SHA-256
readback. Does NOT create a release backup or bypass operator review.
"""
import datetime
import importlib.util
import json
import os
import pathlib
import re
import sys
import tempfile
import uuid

from components import exports, fresh

spec = importlib.util.spec_from_file_location(
    "fib_frontend_backup", pathlib.Path(__file__).with_name("frontend-run.py")
)
frontend = importlib.util.module_from_spec(spec)
spec.loader.exec_module(frontend)

MANAGEMENT_URL = "https://api.supabase.com/v1/projects/apaubomxffcwtzjimori/functions"


def live_functions(token):
    import urllib.request
    req = urllib.request.Request(
        MANAGEMENT_URL, headers={"Authorization": "Bearer " + token}
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        result = json.load(response)
    rows = result.get("functions") if isinstance(result, dict) else result
    if not isinstance(rows, list):
        raise ValueError("Invalid live Edge inventory")
    return rows


def verify_input(root, live, now):
    if root.is_symlink() or not root.is_dir():
        raise ValueError("Private reviewed directory required")
    if {p.name for p in root.iterdir()} != {"edge", "configuration"}:
        raise ValueError("Unexpected private input components")
    frontend.inventory(root)  # rejects symlinks and unsafe special files
    for name in ("configuration/state.json", "configuration/capture.json"):
        path = root / name
        if not path.is_file():
            raise ValueError("Missing reviewed configuration")
        value = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(value, dict):
            raise ValueError("Reviewed configuration must be a JSON object")
    exports(root, live, now)  # live version/hash, all functions, dependencies, reviewer evidence
    return frontend.inventory(root)


def prepare_input(root, env, *, inventory_reader=live_functions, run=frontend.command,
                  now=None, id_factory=None):
    now = now or datetime.datetime.now(datetime.timezone.utc)
    token = env.get("FIB_BACKUP_MANAGEMENT_TOKEN", "")
    if not token:
        raise ValueError("Protected management token required")
    frontend.configuration(env.get("FIB_BACKUP_RCLONE_CONFIG", ""))
    before = inventory_reader(token)
    expected = verify_input(root, before, now)
    # Repeat live inventory immediately before transfer, stop on any code/config drift.
    if inventory_reader(token) != before:
        raise ValueError("Deployed Edge inventory changed before transfer")
    input_id = "input-" + (id_factory or (lambda: uuid.uuid4().hex))()
    if not re.fullmatch(r"input-[a-f0-9]{32}", input_id):
        raise ValueError("Invalid random input ID")
    with tempfile.TemporaryDirectory(prefix="fib-private-input-") as work:
        private = pathlib.Path(work)
        private.chmod(0o700)
        config = private / "rclone.conf"
        config.write_text(env["FIB_BACKUP_RCLONE_CONFIG"], encoding="utf-8")
        config.chmod(0o600)
        cli = ["rclone", "--config", str(config)]
        remote = "fib-backup-crypt:Inputs/" + input_id
        # Random destination, no overwrite of a named existing backup.
        run(cli + ["copy", str(root), remote], env=env)
        returned = private / "readback"
        returned.mkdir(mode=0o700)
        run(cli + ["copy", remote, str(returned)], env=env)
        if frontend.inventory(returned) != expected:
            raise ValueError("Encrypted input readback checksum mismatch")
        # A readback hash check is not independent content/rights review.
        # The existing Complete FIB backup workflow repeats live export checks.
    return input_id


if __name__ == "__main__":
    os.umask(0o077)
    if len(sys.argv) != 2:
        sys.exit("Usage: stage-reviewed-input.py PRIVATE_REVIEWED_DIRECTORY")
    try:
        result = prepare_input(pathlib.Path(sys.argv[1]).expanduser().resolve(),
                               dict(os.environ))
        print("Reviewed encrypted input staged; input_id=" + result)
    except Exception:
        print("FIB private input staging failed; no release backup or deployment approved.",
              file=sys.stderr)
        sys.exit(1)
