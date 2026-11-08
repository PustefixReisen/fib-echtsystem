#!/usr/bin/env python3
"""Read-only diagnostic: verify exact deployed FIB source files in a private CLI download.

Never writes to Supabase, never emits live source contents, never claims restore
success or release approval. All outputs are inside a private temporary folder.
"""
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import subprocess
import sys
import tempfile
from urllib.request import Request, urlopen

PROJECT = "apaubomxffcwtzjimori"
BASE = f"https://api.supabase.com/v1/projects/{PROJECT}/functions"
SLUG = re.compile(r"^fib-[a-z0-9-]+$")
RELATIVE = re.compile(r"""(?:\bfrom\s*|\bimport\s*\(?\s*)["'](\.{1,2}/[^"'\r\n]+)["']""")


def read_api(token, path):
    req = Request(BASE + path, headers={"Authorization": "Bearer " + token})
    with urlopen(req, timeout=30) as response:
        return json.load(response)


def inventory(rows):
    rows = rows.get("functions") if isinstance(rows, dict) else rows
    if not isinstance(rows, list):
        raise ValueError("Invalid deployed function inventory")
    result = {}
    for row in rows:
        if not isinstance(row, dict):
            raise ValueError("Invalid deployed function entry")
        slug = row.get("slug")
        if not isinstance(slug, str) or not SLUG.fullmatch(slug):
            continue
        if slug in result or not isinstance(row.get("version"), int) or isinstance(row.get("version"), bool):
            raise ValueError("Duplicate or invalid FIB function version")
        if type(row.get("verify_jwt")) is not bool or type(row.get("import_map")) is not bool:
            raise ValueError("Invalid FIB gateway or import-map status")
        if not re.fullmatch(r"[0-9a-f]{64}", str(row.get("ezbr_sha256", ""))):
            raise ValueError("Invalid deployed FIB bundle digest")
        result[slug] = {k: row[k] for k in ("slug", "version", "verify_jwt", "import_map", "ezbr_sha256")}
    if not {"fib-editorial-write", "fib-u4-ris-pilot", "fib-u4-pilot"} <= result.keys():
        raise ValueError("Required RIS functions missing")
    return result


def canonical(slug, name):
    if not isinstance(name, str) or "\\" in name:
        raise ValueError("Unsafe deployed file path")
    value = PurePosixPath(name)
    if value.is_absolute() or any(p in ("", ".", "..") for p in name.split("/")):
        raise ValueError("Unsafe deployed file path")
    if name.startswith("_shared/") or name.startswith(slug + "/"):
        return name
    if len(value.parts) != 1:
        raise ValueError("Unrecognized function file path")
    return slug + "/" + name


def live_files(detail, slug, expected):
    if not isinstance(detail, dict) or detail.get("slug") != slug:
        raise ValueError("Unexpected deployed source response")
    for field, want in expected.items():
        if detail.get(field) != want:
            raise ValueError("Source metadata drift")
    if not isinstance(detail.get("files"), list):
        raise ValueError("Deployed source files unavailable")
    found = {}
    for file in detail["files"]:
        if not isinstance(file, dict) or not isinstance(file.get("content"), str):
            raise ValueError("Unavailable source body")
        path = canonical(slug, file.get("name"))
        if path in found:
            raise ValueError("Duplicate function file")
        found[path] = file["content"]
    if slug + "/index.ts" not in found:
        raise ValueError("Missing deployed entrypoint")
    return found


def compare_downloads(source, live_union):
    actual = {}
    for file in source.rglob("*"):
        if file.is_symlink():
            raise ValueError("Symlink in downloaded sources")
        if file.is_file():
            key = file.relative_to(source).as_posix()
            actual[key] = hashlib.sha256(file.read_bytes()).hexdigest()
        elif not file.is_dir():
            raise ValueError("Unexpected downloaded file type")
    expected = {p: hashlib.sha256(c.encode("utf-8")).hexdigest() for p, c in live_union.items()}
    if actual != expected:
        raise ValueError("CLI file bytes differ from deployed Management API")
    for path, content in live_union.items():
        base = PurePosixPath(path).parent
        for match in RELATIVE.findall(content):
            dest = base.joinpath(match)
            parts = []
            for part in dest.parts:
                if part == "..":
                    if not parts:
                        raise ValueError("Dependency escapes function source tree")
                    parts.pop()
                elif part != ".":
                    parts.append(part)
            if "/".join(parts) not in live_union:
                raise ValueError("Incomplete deployed source dependency")
    return len(actual)


class SafeDiagnostic(ValueError):
    """Fixed, non-sensitive failure category. Never include remote exception text."""


def check(token, *, api=read_api, run=subprocess.run):
    stage = "INITIAL_INVENTORY"
    try:
        first = inventory(api(token, ""))
        with tempfile.TemporaryDirectory(prefix="fib-readonly-edge-") as temp:
            root = Path(temp)
            root.chmod(0o700)
            for slug in sorted(first):
                stage = "CLI_DOWNLOAD_" + slug
                p = run(
                    ["supabase", "functions", "download", slug, "--project-ref", PROJECT],
                    cwd=root, capture_output=True, timeout=180, check=False,
                )
                if p.returncode != 0:
                    raise ValueError("Official Supabase CLI function download failed")
            stage = "CLI_OUTPUT_LAYOUT"
            source = root / "supabase" / "functions"
            if not source.is_dir():
                raise ValueError("Supabase CLI did not create a source tree")
            union = {}
            for slug in sorted(first):
                stage = "LIVE_SOURCE_" + slug
                files = live_files(api(token, "/" + slug), slug, first[slug])
                for path, body in files.items():
                    if path in union and union[path] != body:
                        raise ValueError("Conflicting deployed shared module versions")
                    union[path] = body
            stage = "FILE_AND_DEPENDENCY_COMPARISON"
            count = compare_downloads(source, union)
            stage = "FINAL_INVENTORY"
            if inventory(api(token, "")) != first:
                raise ValueError("Deployed function inventory changed during download")
            return len(first), count
    except Exception:
        # Prevent exception text, API response bodies, paths, tokens or source
        # content from escaping to public GitHub job logs.
        raise SafeDiagnostic(stage) from None


if __name__ == "__main__":
    os.umask(0o077)
    try:
        token = os.environ.get("SUPABASE_ACCESS_TOKEN", "")
        if not token:
            raise ValueError("Protected Supabase management token required")
        functions, files = check(token)
        print(f"Read-only FIB Edge check passed: {functions} functions, {files} exact source files. No restore or backup performed.")
    except SafeDiagnostic as error:
        # Only whitelisted phase names are allowed in the log, no API details.
        print("Read-only FIB Edge check BLOCKED at " + str(error) + ". No changes performed.", file=sys.stderr)
        sys.exit(1)
    except Exception:
        print("Read-only FIB Edge check BLOCKED at INITIAL_SETUP. No changes performed.", file=sys.stderr)
        sys.exit(1)
