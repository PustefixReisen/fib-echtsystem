#!/usr/bin/env python3
"""Read-only FIB Shared-Apps PostgreSQL inventory. Never changes data."""
import json
import os
import pathlib
import subprocess
import sys
from urllib.parse import urlsplit, unquote, parse_qs

PROJECT = "apaubomxffcwtzjimori"
SOURCES = {
    "https://buergerinfo-feldkirchen.digitalfabrix.de",
    "https://www.feldkirchen.de",
}
SQL = """
begin read only;
select json_build_object(
  'fib_tables', (select count(*) from pg_catalog.pg_tables where schemaname='fib'),
  'ris_present', to_regclass('fib.ris_committees') is not null,
  'manifest_present', to_regclass('fib.development_batches') is not null,
  'sources', (select coalesce(json_agg(json_build_object('url', homepage_url, 'active', active)), '[]'::json)
              from fib.sources where homepage_url in
              ('https://buergerinfo-feldkirchen.digitalfabrix.de', 'https://www.feldkirchen.de'))
);
rollback;
"""

def validate_url(raw):
    if not raw:
        raise ValueError("Missing FIB_MAINTENANCE_DATABASE_URL")
    u = urlsplit(raw)
    if u.scheme not in ("postgres", "postgresql") or u.hostname is None:
        raise ValueError("Invalid maintenance URL")
    if (u.hostname != "db." + PROJECT + ".supabase.co"
            and not u.hostname.endswith(".pooler.supabase.com")):
        raise ValueError("Database host is not allowed")
    expected_user = ("postgres" if u.hostname.startswith("db.") else "postgres." + PROJECT)
    if unquote(u.username or "") != expected_user or u.path != "/postgres" or u.port != 5432:
        raise ValueError("Unexpected database target or account")
    params = parse_qs(u.query, keep_blank_values=True)
    if (not u.password or set(params) != {"sslmode"}
            or params["sslmode"] != ["verify-full"]):
        raise ValueError("Verified TLS and existing database password required")

def validate_inventory(result):
    if result.get("fib_tables") != 29 or result.get("ris_present") is not False or result.get("manifest_present") is not False:
        raise ValueError("FIB schema drift")
    rows = result.get("sources")
    if not isinstance(rows, list) or len(rows) != 2:
        raise ValueError("Expected exactly two official sources")
    if {r.get("url") for r in rows} != SOURCES or any(r.get("active") is not False for r in rows):
        raise ValueError("Official source identity/status drift")
    return True

def capture():
    raw = os.environ.get("FIB_MAINTENANCE_DATABASE_URL")
    validate_url(raw)
    cert = os.environ.get("PGSSLROOTCERT")
    if not cert or not pathlib.Path(cert).is_file():
        raise ValueError("Explicit trusted Supabase CA file required")
    env = {k: v for k, v in os.environ.items() if not k.startswith("PG")}
    env.update(PGDATABASE=raw, PGSSLROOTCERT=cert, PGSSLMODE="verify-full")
    result = subprocess.run(
        ["psql", "-X", "-A", "-t", "-v", "ON_ERROR_STOP=1"],
        input=SQL, text=True, capture_output=True, env=env, check=False, timeout=30,
    )
    if result.returncode:
        raise RuntimeError("Read-only database inventory failed (details withheld)")
    lines = [s for s in result.stdout.splitlines() if s.startswith("{")]
    if len(lines) != 1:
        raise RuntimeError("Unexpected read-only inventory output")
    inventory = json.loads(lines[0])
    validate_inventory(inventory)
    return {"status": "READ_ONLY_DB_INVENTORY_PASSED", "fib_tables": 29,
            "official_sources_inactive": 2, "ris_schema_not_installed": True}

if __name__ == "__main__":
    try:
        print(json.dumps(capture(), sort_keys=True))
    except (ValueError, RuntimeError, OSError, subprocess.TimeoutExpired) as exc:
        print("RIS inventory STOP: " + str(exc), file=sys.stderr)
        sys.exit(1)
