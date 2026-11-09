#!/usr/bin/env python3
"""Collect actual FIB live backup inputs privately; never approve or deploy.

Runs the existing read-only Edge, DB source and allowlisted feature exporters
once in a new mode-0700 workspace. The result is UNREVIEWED and cannot be
staged until an operator has verified the real configuration and created the
separate positive review evidence. Never store credentials in the output.
"""
import argparse
import os
from pathlib import Path
import shutil
import subprocess
import sys

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent


def collect(root, env, *, run=subprocess.run):
    root = Path(root).expanduser().absolute()
    if root.exists() or root.is_symlink():
        raise ValueError("Private review destination already exists")
    parent = root.parent.resolve(strict=True)
    if not parent.is_dir() or parent.stat().st_mode & 0o077:
        raise ValueError("Private destination parent must be 0700")
    if parent == REPO or REPO in parent.parents:
        raise ValueError("Private destination must be outside the repository")
    if not env.get("SUPABASE_ACCESS_TOKEN") or not env.get("FIB_MAINTENANCE_DATABASE_URL"):
        raise ValueError("Protected Supabase token and FIB maintenance connection required")
    root.mkdir(mode=0o700)
    try:
        review = root / "review"
        review.mkdir(mode=0o700)
        output = root / "input"   # Exporter creates this itself with mode 0700.
        commands = [
            [sys.executable, str(HERE / "export-deployed-edge.py"),
             "--private-output", str(output)],
            ["node", str(HERE / "capture-source-state.mjs"),
             "--out=" + str(review / "source.json")],
            [sys.executable, str(HERE / "capture-feature-flags.py"),
             "--source-capture", str(review / "source.json"),
             "--out", str(review / "features.json")],
        ]
        for cmd in commands:
            result = run(cmd, env=env, cwd=str(REPO), capture_output=True,
                         check=False, timeout=600)
            if result.returncode:
                # Source, connection strings or sensitive API output are private.
                raise ValueError("Private unreviewed capture step failed")
        for filename in ("input/edge/inventory.json", "review/source.json",
                         "review/features.json"):
            if not (root / filename).is_file():
                raise ValueError("Private export incomplete")
        (output / "configuration").mkdir(mode=0o700)
        # No state.json or capture.json: review MUST be performed independently.
        return root
    except Exception:
        # Only the exclusively new, private directory may be removed.
        shutil.rmtree(root)
        raise


def main():
    parser = argparse.ArgumentParser(description="Prepare UNREVIEWED private FIB backup input")
    parser.add_argument("--private-root", required=True)
    args = parser.parse_args()
    os.umask(0o077)
    try:
        root = collect(args.private_root, dict(os.environ))
        print("UNREVIEWED FIB input prepared privately at " + str(root))
        print("No review, encrypted staging, backup receipt or deployment performed.")
    except Exception:
        print("Private input preparation blocked; no review or release granted.",
              file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
