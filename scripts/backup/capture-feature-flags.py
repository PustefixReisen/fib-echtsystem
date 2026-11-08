#!/usr/bin/env python3
"""Privately read only approved FIB RIS *boolean* feature flags from Supabase.

The Management API returns ALL project secret values. This program discards
every non-allowlisted value in memory, does not print API bodies, never writes
credentials, and does not grant a release review/restore guarantee.
"""
import argparse
import datetime
import json
import os
import pathlib
import re
import sys
import urllib.request

PROJECT = "apaubomxffcwtzjimori"
URL = f"https://api.supabase.com/v1/projects/{PROJECT}/secrets"
ALLOWED = (
    "FIB_RIS_STRUCTURE_ENABLED",
    "FIB_RIS_AUTOMATION_ENABLED",
    "FIB_RIS_INTEGRATION_TEST_ENABLED",
)
BOOLEAN = {"true": True, "false": False}


def fetch_secrets(token):
    request = urllib.request.Request(URL, headers={"Authorization": "Bearer " + token})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def redact_to_flags(rows):
    """Minimize raw Management API response. Never retain other values."""
    if not isinstance(rows, list):
        raise ValueError("Unexpected secret metadata structure")
    flags = {}
    for row in rows:
        if not isinstance(row, dict):
            raise ValueError("Unexpected secret entry")
        name = row.get("name")
        if name not in ALLOWED:
            continue
        if name in flags:
            raise ValueError("Duplicate FIB feature flag")
        raw = row.get("value")
        if not isinstance(raw, str) or raw.strip().lower() not in BOOLEAN:
            raise ValueError("FIB feature flag is not an explicit boolean")
        flags[name] = BOOLEAN[raw.strip().lower()]
    missing = [name for name in ALLOWED if name not in flags]
    return {
        "status": "captured" if not missing else "incomplete",
        "values": flags,
        "missing": missing,
    }


def validate_source_state(value):
    if not isinstance(value, dict) or value.get("format") != "fib-db-source-state-v1":
        raise ValueError("Expected verified FIB-only read-only source capture")
    if value.get("scope") != "fib-only-read-only" or value.get("operatorReview") is not False:
        raise ValueError("Invalid source review state")
    if not isinstance(value.get("sourceFlags"), list) or not isinstance(value.get("scopeFlags"), list):
        raise ValueError("Missing source arrays")
    created = datetime.datetime.fromisoformat(value["capturedAt"].replace("Z", "+00:00"))
    now = datetime.datetime.now(datetime.timezone.utc)
    if created.tzinfo is None or not -60 <= (now - created).total_seconds() <= 3600:
        raise ValueError("Stale source capture")
    return {
        "format": value["format"],
        "capturedAt": value["capturedAt"],
        "scope": value["scope"],
        "sourceFlags": value["sourceFlags"],
        "scopeFlags": value["scopeFlags"],
    }


def build_state(source, raw):
    clean = validate_source_state(source)
    project = redact_to_flags(raw)
    clean.update({
        "format": "fib-feature-state-v1",
        "projectFeatures": project,
        "project": PROJECT,
        "operatorReview": False,
        "reviewRequired": True,
        "secretValuesIncluded": False,
    })
    return clean


def private_destination(path):
    """Reject symlink targets, source-tree paths and world-readable folders."""
    path = path.expanduser().absolute()
    if path.exists() or path.is_symlink():
        raise ValueError("New private output file required")
    real_parent = path.parent.resolve(strict=True)
    if not real_parent.is_dir() or real_parent.stat().st_mode & 0o077:
        raise ValueError("Private parent permissions 0700 required")
    here = pathlib.Path(__file__).resolve()
    # Never write within the checked-out repository.
    if real_parent == here.parents[2] or here.parents[2] in real_parent.parents:
        raise ValueError("Output must be outside repository")
    return real_parent / path.name


def main():
    os.umask(0o077)
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-capture", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    try:
        token = os.environ.get("SUPABASE_ACCESS_TOKEN")
        if not token:
            raise ValueError("Protected Supabase management token required")
        source = json.loads(pathlib.Path(args.source_capture).read_text(encoding="utf-8"))
        output = private_destination(pathlib.Path(args.out))
        state = build_state(source, fetch_secrets(token))
        with output.open("x", encoding="utf-8") as handle:
            json.dump(state, handle, sort_keys=True, indent=2)
            handle.write("\n")
        output.chmod(0o600)
        missing = len(state["projectFeatures"]["missing"])
        print(f"FIB allowlisted flag snapshot captured privately; missing={missing}; operator review still required.")
    except Exception:
        print("FIB feature snapshot blocked; secret values and API bodies withheld. No release approved.", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
