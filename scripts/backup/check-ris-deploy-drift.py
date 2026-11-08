#!/usr/bin/env python3
"""Prevent overwriting unexpected Supabase Edge deployments during RIS #404 release.

Read-only Management API inventory; refuses changed versions, runtime JWT
configuration and deployed bundle digests before any deploy command is run.
All expected hashes are the read-only independently inventoried live baseline.
"""
import json
import os
import sys
import urllib.request

API = "https://api.supabase.com/v1/projects/apaubomxffcwtzjimori/functions"
BASELINE = {
    "fib-editorial-write": {
        "version": 20,
        "verify_jwt": False,
        "ezbr_sha256": "849ee0668cef37aa4ac56c0d08cddd4dc1693a710968595e827104c345f683c6",
    },
    "fib-u4-ris-pilot": {
        "version": 21,
        "verify_jwt": True,
        "ezbr_sha256": "b7e3478b4c70b3bc607d3008e664504203f487d943e0bd3583588fa2223d9c20",
    },
}


def check(rows, expected=BASELINE):
    if isinstance(rows, dict):
        rows = rows.get("functions")
    if not isinstance(rows, list):
        raise ValueError("Unexpected Edge inventory")
    counts = {}
    for row in rows:
        if not isinstance(row, dict):
            raise ValueError("Unexpected Edge function entry")
        slug = row.get("slug")
        if slug in expected:
            counts[slug] = counts.get(slug, 0) + 1
            if any(row.get(key) != value for key, value in expected[slug].items()):
                raise ValueError("Deployed RIS function drift")
    if set(counts) != set(expected) or any(n != 1 for n in counts.values()):
        raise ValueError("Expected RIS functions not uniquely present")
    return True


def main():
    token = os.environ.get("SUPABASE_ACCESS_TOKEN", "")
    if not token:
        raise ValueError("Missing protected Supabase management token")
    req = urllib.request.Request(API, headers={"Authorization": "Bearer " + token})
    with urllib.request.urlopen(req, timeout=30) as response:
        rows = json.load(response)
    check(rows)
    print("RIS function baseline matches approved release precondition.")


if __name__ == "__main__":
    try:
        main()
    except Exception:
        print("RIS release blocked: deployed function versions/JWT/bundles differ from approved baseline.", file=sys.stderr)
        sys.exit(1)
