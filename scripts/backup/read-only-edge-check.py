#!/usr/bin/env python3
"""Read-only diagnostic: verify exact deployed FIB source files in a private CLI download.

Never writes to Supabase, never emits live source contents, never claims restore
success or release approval. All outputs are inside a private temporary folder.
"""
import hashlib
import importlib.util
from email.parser import BytesParser
from email.policy import default as email_policy
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


class SafeBodyError(ValueError):
    """An allowlisted phase detail only; no remote content or headers."""


def binary_digest(payload, content_type=""):
    """Hash only a clearly identified deployed ESZIP/EZBR file payload.

    The Management API may wrap the file in multipart/form-data. Never hash
    an entire multipart envelope or treat arbitrary JSON/errors as a bundle.
    """
    if not payload:
        raise SafeBodyError("EMPTY")
    if len(payload) > 32 * 1024 * 1024:
        raise SafeBodyError("TOO_LARGE")
    mime = (content_type or "").split(";", 1)[0].strip().lower()
    if mime in ("multipart/form-data", "multipart/mixed"):
        if not isinstance(content_type, str) or "boundary=" not in content_type.lower():
            raise SafeBodyError("UNEXPECTED_FORMAT")
        # Only parse in-memory, with a bound above; never print parser exceptions.
        try:
            prefix = ("MIME-Version: 1.0\r\nContent-Type: " + content_type + "\r\n\r\n").encode("ascii")
            envelope = BytesParser(policy=email_policy).parsebytes(prefix + payload)
        except Exception:
            raise SafeBodyError("UNEXPECTED_FORMAT") from None
        if not envelope.is_multipart():
            raise SafeBodyError("UNEXPECTED_FORMAT")
        candidates = []
        for part in envelope.iter_parts():
            disposition = part.get_content_disposition()
            if disposition not in ("form-data", "attachment"):
                continue
            name = part.get_param("name", header="content-disposition")
            if name not in ("file", "body", None):
                continue
            value = part.get_payload(decode=True)
            if isinstance(value, bytes) and (value.startswith(b"EZBR") or value.startswith(b"ESZIP")):
                candidates.append(value)
        if len(candidates) != 1:
            raise SafeBodyError("UNEXPECTED_FORMAT")
        payload = candidates[0]
    if not (payload.startswith(b"EZBR") or payload.startswith(b"ESZIP")):
        raise SafeBodyError("UNEXPECTED_FORMAT")
    return hashlib.sha256(payload).hexdigest()


def read_body(token, slug, *, opener=urlopen):
    """Read the deployed function bundle via documented API, without logs."""
    req = Request(BASE + "/" + slug + "/body", headers={
        "Authorization": "Bearer " + token
    })
    try:
        with opener(req, timeout=30) as response:
            binary = response.read(32 * 1024 * 1024 + 1)
            content_type = response.headers.get("Content-Type", "")
    except Exception as exc:
        from urllib.error import HTTPError
        if isinstance(exc, HTTPError):
            code = exc.code
            if code in (401, 403):
                raise SafeBodyError("AUTH_DENIED") from None
            if code == 404:
                raise SafeBodyError("BODY_NOT_FOUND") from None
            if code == 429:
                raise SafeBodyError("RATE_LIMIT") from None
            raise SafeBodyError("HTTP_OTHER") from None
        raise SafeBodyError("TRANSPORT") from None
    return binary_digest(binary, content_type)



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


def verify_local_sources(source, function_slugs):
    """Inspect CLI-extracted sources; no unsubstantiated file-byte equality claim."""
    if not source.is_dir():
        raise ValueError("Supabase CLI did not create a source tree")
    sources = {}
    for file in source.rglob("*"):
        if file.is_symlink():
            raise ValueError("Symlink in downloaded sources")
        if file.is_file():
            sources[file.relative_to(source).as_posix()] = file.read_bytes()
        elif not file.is_dir():
            raise ValueError("Untrusted downloaded file type")
    for slug in function_slugs:
        if slug + "/index.ts" not in sources:
            raise ValueError("Missing downloaded function entrypoint")
    for path, content in sources.items():
        if not path.endswith((".ts", ".js", ".mjs", ".json")):
            continue
        for relative in RELATIVE.findall(content.decode("utf-8")):
            parts = list(PurePosixPath(path).parent.parts)
            for part in PurePosixPath(relative).parts:
                if part == "..":
                    if not parts:
                        raise ValueError("Dependency escapes source tree")
                    parts.pop()
                elif part != ".":
                    parts.append(part)
            if "/".join(parts) not in sources:
                raise ValueError("Incomplete downloaded source dependency")
    return len(sources)


def check_exported_types(root, slugs):
    """Use isolated Deno typecheck; no production secrets forwarded to Deno."""
    path = Path(__file__).with_name("check-edge-isolated.py")
    spec = importlib.util.spec_from_file_location("fib_isolated_deno", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.check(root, slugs)


class SafeDiagnostic(ValueError):
    """Fixed, non-sensitive failure category. Never include remote exception text."""


def check(token, *, api=read_api, body=read_body, run=subprocess.run):
    stage = "INITIAL_INVENTORY"
    try:
        first = inventory(api(token, ""))
        with tempfile.TemporaryDirectory(prefix="fib-readonly-edge-") as temp:
            root = Path(temp)
            root.chmod(0o700)
            for slug in sorted(first):
                stage = "CLI_DOWNLOAD_" + slug
                result = run(
                    ["supabase", "functions", "download", slug, "--project-ref", PROJECT],
                    cwd=root, capture_output=True, timeout=180, check=False,
                )
                if result.returncode != 0:
                    raise ValueError("Supabase CLI download failed")
            stage = "CLI_SOURCE_DEPENDENCIES"
            file_count = verify_local_sources(root / "supabase" / "functions", first)
            stage = "ISOLATED_DENO_TYPECHECK"
            check_exported_types(root / "supabase" / "functions", first)
            # GET /functions/{slug} returns metadata only: it has no 'files'.
            # The documented /body endpoint returns the deployed EZBR bundle.
            # Check its own declared digest; this does NOT prove that CLI
            # extraction is byte-for-byte identical to all original sources.
            for slug in sorted(first):
                stage = "DEPLOYED_BUNDLE_" + slug
                try:
                    digest = body(token, slug)
                except SafeBodyError as error:
                    stage += "_" + str(error)
                    raise
                if digest != first[slug]["ezbr_sha256"]:
                    stage += "_DIGEST_MISMATCH"
                    raise ValueError("Deployed EZBR digest mismatch")
            stage = "FINAL_INVENTORY"
            if inventory(api(token, "")) != first:
                raise ValueError("Function inventory changed during source export")
            return len(first), file_count
    except Exception:
        # Print phase only; never leak API exceptions or downloaded source.
        raise SafeDiagnostic(stage) from None


if __name__ == "__main__":
    os.umask(0o077)
    try:
        token = os.environ.get("SUPABASE_ACCESS_TOKEN", "")
        if not token:
            raise ValueError("Protected Supabase management token required")
        functions, files = check(token)
        print(f"Read-only FIB Edge check passed: {functions} functions, {files} CLI-extracted source files and verified deployed bundle digests. No restore or backup performed.")
    except SafeDiagnostic as error:
        # Only whitelisted phase names are allowed in the log, no API details.
        print("Read-only FIB Edge check BLOCKED at " + str(error) + ". No changes performed.", file=sys.stderr)
        sys.exit(1)
    except Exception:
        print("Read-only FIB Edge check BLOCKED at INITIAL_SETUP. No changes performed.", file=sys.stderr)
        sys.exit(1)
