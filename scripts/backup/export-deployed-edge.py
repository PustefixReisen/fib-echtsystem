#!/usr/bin/env python3
"""Read-only capture of deployed FIB Edge source into a private, UNREVIEWED input.

This does not create a release backup or set review evidence. It deliberately
fails closed when Supabase CLI cannot reconstruct an import dependency.
"""
import argparse
import hashlib
from email.parser import BytesParser
from email.policy import default as email_policy
import json
import os
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.request

from components import RELATIVE_IMPORT_RE

PROJECT = "apaubomxffcwtzjimori"
SLUG = re.compile(r"^fib-[a-z0-9-]+$")
API = f"https://api.supabase.com/v1/projects/{PROJECT}/functions"


def inventory(token):
    req = urllib.request.Request(API, headers={"Authorization": "Bearer " + token})
    with urllib.request.urlopen(req, timeout=30) as response:
        value = json.load(response)
    rows = value["functions"] if isinstance(value, dict) else value
    if not isinstance(rows, list):
        raise ValueError("Unexpected management inventory")
    result = {}
    for row in rows:
        slug = row.get("slug")
        if not isinstance(slug, str) or not SLUG.fullmatch(slug):
            continue
        if slug in result:
            raise ValueError("Duplicate function name")
        for field in ("version", "verify_jwt", "ezbr_sha256", "import_map"):
            if field not in row:
                raise ValueError("Missing function metadata")
        if not isinstance(row["version"], int) or not isinstance(row["verify_jwt"], bool):
            raise ValueError("Invalid function metadata")
        if not re.fullmatch(r"[a-f0-9]{64}", str(row["ezbr_sha256"])):
            raise ValueError("Invalid bundle hash")
        if row["import_map"]:
            raise ValueError("Import-map function needs explicitly reviewed export")
        result[slug] = {key: row[key] for key in ("slug", "version", "verify_jwt", "ezbr_sha256", "import_map")}
    if not result or not {"fib-editorial-write", "fib-u4-ris-pilot", "fib-u4-pilot"} <= result.keys():
        raise ValueError("Incomplete deployed FIB inventory")
    return result


def safe_tree(root):
    for path in root.rglob("*"):
        if path.is_symlink() or not (path.is_file() or path.is_dir()):
            raise ValueError("Untrusted downloaded file type")


def dependency_check(edge):
    base = edge.resolve()
    for source in edge.rglob("*"):
        if not source.is_file() or source.suffix not in (".ts", ".js", ".mjs", ".json"):
            continue
        for dep in RELATIVE_IMPORT_RE.findall(source.read_text(encoding="utf-8")):
            target = (source.parent / dep).resolve()
            if not target.is_relative_to(base) or not target.is_file():
                raise ValueError("Downloaded bundle missing relative module")


class SafeBodyError(ValueError):
    pass


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


def deployed_bundle_digest(token, slug):
    """Read the documented EZBR function body, never log/persist its bytes."""
    req = urllib.request.Request(
        API + "/" + slug + "/body",
        headers={"Authorization": "Bearer " + token},
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        binary = response.read(32 * 1024 * 1024 + 1)
        content_type = response.headers.get("Content-Type", "")
    return binary_digest(binary, content_type)


def verify_deployed_bundles(metadata, fetcher, token):
    """Independently check live deployed EZBR digests, not imaginary file JSON.

    This does NOT prove individual CLI-extracted bytes equal original
    source bytes. Complete source/restore review remains mandatory.
    """
    for slug in sorted(metadata):
        if fetcher(token, slug) != metadata[slug]["ezbr_sha256"]:
            raise ValueError("Deployed EZBR digest mismatch")
    return len(metadata)


def export(target, token, cli="supabase", get_inventory=inventory, run=subprocess.run, get_source=deployed_bundle_digest):
    if target.exists():
        raise ValueError("Private destination must not exist")
    before = get_inventory(token)
    with tempfile.TemporaryDirectory(prefix="fib-remote-export-") as work:
        root = pathlib.Path(work)
        os.chmod(root, 0o700)
        for slug in sorted(before):
            # Supabase's supported download command runs in a clean, private workspace.
            # Never forward CLI output: upstream output could contain sensitive paths.
            completed = run(
                [cli, "functions", "download", slug, "--project-ref", PROJECT],
                cwd=root, capture_output=True, timeout=180, check=False,
            )
            if completed.returncode:
                raise ValueError("Official Edge download failed")
        source = root / "supabase" / "functions"
        if not source.is_dir():
            raise ValueError("CLI did not create a function source tree")
        safe_tree(source)
        for slug in before:
            if not (source / slug / "index.ts").is_file():
                raise ValueError("Missing deployed function entrypoint")
        dependency_check(source)
        verify_deployed_bundles(before, get_source, token)
        after = get_inventory(token)
        if before != after:
            raise ValueError("Deployed function inventory changed during export")
        # Publish to the private path only after the complete drift and import check.
        # The generated output is NOT a reviewed release input_id.
        target.mkdir(mode=0o700, parents=False)
        try:
            shutil.copytree(source, target / "edge", symlinks=False)
            (target / "edge" / "inventory.json").write_text(
                json.dumps([before[s] for s in sorted(before)], indent=2),
                encoding="utf-8",
            )
            for file in target.rglob("*"):
                if file.is_file():
                    file.chmod(0o600)
            safe_tree(target)
            dependency_check(target / "edge")
        except Exception:
            shutil.rmtree(target)
            raise
    return len(before)


if __name__ == "__main__":
    os.umask(0o077)
    parser = argparse.ArgumentParser(description="Capture UNREVIEWED deployed FIB Edge source privately")
    parser.add_argument("--private-output", required=True, help="New non-existing protected folder")
    args = parser.parse_args()
    token = os.getenv("SUPABASE_ACCESS_TOKEN", "")
    try:
        if not token:
            raise ValueError("Missing protected Supabase management token")
        count = export(pathlib.Path(args.private_output).expanduser().resolve(), token)
        print(f"Prepared {count} FIB function exports for private OPERATOR REVIEW; no backup ID created.")
    except Exception:
        print("FIB export blocked: complete source or access could not be verified. No deployment permitted.", file=sys.stderr)
        sys.exit(1)
