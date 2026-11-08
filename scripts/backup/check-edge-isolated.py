#!/usr/bin/env python3
"""Typecheck restored Edge sources without executing functions or exposing secrets.

This is a reconstruction/typecheck preflight, NOT a restore or deploy receipt.
The Deno process receives an intentionally empty environment allowlist.
"""
import argparse
import os
import pathlib
import re
import subprocess
import sys
import tempfile

SLUG = re.compile(r"^fib-[a-z0-9-]+$")


def check(root, slugs, *, executable="deno", run=subprocess.run):
    root = pathlib.Path(root)
    if not root.is_dir() or root.is_symlink():
        raise ValueError("Private Edge source directory unavailable")
    names = tuple(sorted(slugs))
    if not names or len(set(names)) != len(names) or any(not SLUG.fullmatch(s) for s in names):
        raise ValueError("Invalid source inventory")
    with tempfile.TemporaryDirectory(prefix="fib-restore-check-") as workspace:
        sandbox = pathlib.Path(workspace)
        sandbox.chmod(0o700)
        (sandbox / "deno-cache").mkdir(mode=0o700)
        (sandbox / "home").mkdir(mode=0o700)
        # No SUPABASE, FIB, database, Nextcloud, GitHub or service-role secrets.
        # No token or auth variables are inherited, even if parent has them.
        env = {
            "PATH": os.environ.get("PATH", "/usr/local/bin:/usr/bin:/bin"),
            "HOME": str(sandbox / "home"),
            "DENO_DIR": str(sandbox / "deno-cache"),
            "DENO_NO_PROMPT": "1",
            "NO_COLOR": "1",
        }
        for slug in names:
            entry = root / slug / "index.ts"
            if entry.is_symlink() or not entry.is_file() or not entry.resolve().is_relative_to(root.resolve()):
                raise ValueError("Missing or unsafe restored entrypoint")
            result = run(
                [executable, "check", "--no-config", "--no-lock", str(entry)],
                cwd=str(root), env=env, capture_output=True, check=False, timeout=180
            )
            if result.returncode != 0:
                # Do not print TypeScript paths or compiler text: source is private.
                raise ValueError("Isolated Deno check failed for a restored function")
    return len(names)


def main():
    parser = argparse.ArgumentParser(description="Isolated, zero-secret restored FIB source typecheck")
    parser.add_argument("edge_dir")
    parser.add_argument("slugs", nargs="+")
    args = parser.parse_args()
    try:
        n = check(args.edge_dir, args.slugs)
        print(f"Isolated Deno preflight passed for {n} exported function entrypoints; no code executed or deployed.")
    except Exception:
        print("Isolated Deno preflight blocked: restore/typecheck evidence incomplete.", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
