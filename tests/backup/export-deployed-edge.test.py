"""Offline contracts for protected Supabase CLI downloads and EZBR body digests."""
import hashlib
import importlib.util
import json
import pathlib
import subprocess
import sys
import tempfile
import unittest

MODULE = pathlib.Path(__file__).resolve().parents[2] / "scripts/backup/export-deployed-edge.py"
sys.path.insert(0, str(MODULE.parent))
spec = importlib.util.spec_from_file_location("fib_edge_export", MODULE)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

BUNDLE = b"EZBR" + b"read-only-extracted-bundle"
DIGEST = hashlib.sha256(BUNDLE).hexdigest()


def data():
    return {
        name: {"slug": name, "version": 3, "verify_jwt": True,
               "ezbr_sha256": DIGEST, "import_map": False}
        for name in ("fib-editorial-write", "fib-u4-ris-pilot", "fib-u4-pilot")
    }


def source_digest(_, slug):
    assert slug in data()
    return DIGEST


def downloaded(cmd, **kwargs):
    slug = cmd[3]
    folder = pathlib.Path(kwargs["cwd"]) / "supabase/functions" / slug
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "index.ts").write_text("export const ok = true;")
    return subprocess.CompletedProcess(cmd, 0)


class ExportTests(unittest.TestCase):
    def test_success_and_no_synthetic_review_flag(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = pathlib.Path(tmp) / "new"
            self.assertEqual(module.export(
                path, "private", get_inventory=lambda _: data(),
                run=downloaded, get_source=source_digest), 3)
            self.assertTrue((path / "edge/inventory.json").is_file())
            self.assertFalse((path / "configuration/evidence.json").exists())
            self.assertFalse((path / "release.json").exists())

    def test_inventory_drift_fails_before_output(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = pathlib.Path(tmp) / "new"
            count = 0
            def inventory(_):
                nonlocal count
                count += 1
                rows = data()
                if count == 2:
                    rows["fib-u4-ris-pilot"]["version"] = 4
                return rows
            with self.assertRaises(ValueError):
                module.export(path, "private", get_inventory=inventory,
                              run=downloaded, get_source=source_digest)
            self.assertFalse(path.exists())

    def test_missing_relative_dependency_blocks(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = pathlib.Path(tmp) / "new"
            def missing(cmd, **kwargs):
                result = downloaded(cmd, **kwargs)
                if cmd[3] == "fib-u4-pilot":
                    (pathlib.Path(kwargs["cwd"]) / "supabase/functions/fib-u4-pilot/index.ts").write_text(
                        'import type { RisSql } from "../_shared/ris-structure.ts";'
                    )
                return result
            with self.assertRaisesRegex(ValueError, "missing relative module"):
                module.export(path, "private", get_inventory=lambda _: data(),
                              run=missing, get_source=source_digest)
            self.assertFalse(path.exists())

    def test_bad_ezbr_digest_blocks(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = pathlib.Path(tmp) / "new"
            def bad(_, slug):
                return ("0" * 64) if slug == "fib-u4-pilot" else DIGEST
            with self.assertRaisesRegex(ValueError, "EZBR digest mismatch"):
                module.export(path, "private", get_inventory=lambda _: data(),
                              run=downloaded, get_source=bad)
            self.assertFalse(path.exists())

    def test_private_inventory_cannot_bypass_hash_audit(self):
        with self.assertRaisesRegex(ValueError, "EZBR digest mismatch"):
            module.verify_deployed_bundles(data(), lambda *_: "0"*64, "private")

    def test_entrypoint_required(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = pathlib.Path(tmp) / "new"
            def missing(cmd, **kwargs):
                return subprocess.CompletedProcess(cmd, 0)
            with self.assertRaises(ValueError):
                module.export(path, "private", get_inventory=lambda _: data(),
                              run=missing, get_source=source_digest)
            self.assertFalse(path.exists())

    def test_existing_destination_untouched(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = pathlib.Path(tmp) / "existing"
            path.mkdir()
            sentinel = path / "keep"
            sentinel.write_text("safe")
            with self.assertRaises(ValueError):
                module.export(path, "private", get_inventory=lambda _: data())
            self.assertEqual(sentinel.read_text(), "safe")


if __name__ == "__main__":
    unittest.main()
