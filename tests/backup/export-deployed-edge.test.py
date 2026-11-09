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

BUNDLE = b"ESZIP" + b"read-only-extracted-bundle"
DIGEST = hashlib.sha256(BUNDLE).hexdigest()


def data():
    return {
        name: {"slug": name, "version": 3, "verify_jwt": True,
               "ezbr_sha256": DIGEST, "import_map": False}
        for name in ("fib-editorial-write", "fib-u4-ris-pilot", "fib-u4-pilot")
    }


def source_digest(_, slug):
    assert slug in data()
    return BUNDLE


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
            self.assertTrue((path / "edge/_deployed_bundles/fib-editorial-write.eszip").is_file())
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

    def test_changed_live_eszip_blocks(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = pathlib.Path(tmp) / "new"
            count = 0
            def bad(_, slug):
                nonlocal count
                count += 1
                return BUNDLE + (b"changed" if count == 2 else b"")
            with self.assertRaisesRegex(ValueError, "ESZIP body changed"):
                module.export(path, "private", get_inventory=lambda _: data(),
                              run=downloaded, get_source=bad)
            self.assertFalse(path.exists())

    def test_unstable_body_cannot_bypass_snapshot_audit(self):
        calls = 0
        def changing(*_):
            nonlocal calls
            calls += 1
            return BUNDLE + (b"changed" if calls == 2 else b"")
        with self.assertRaisesRegex(ValueError, "ESZIP body changed"):
            module.verify_deployed_bundles(data(), changing, "private")

    def test_multipart_ezbr_digest_is_verified(self):
        payload = b"EZBR" + b"historic protected bundle"
        wrapper = (b"--bundle123\r\n"
                   b'Content-Disposition: form-data; name="file"; filename="edge.eszip"\r\n'
                   b"Content-Type: application/octet-stream\r\n\r\n"
                   + payload + b"\r\n--bundle123--\r\n")
        self.assertEqual(
            module.binary_digest(wrapper, "multipart/form-data; boundary=bundle123"),
            hashlib.sha256(payload).hexdigest()
        )

    def test_json_error_body_never_accepted_as_export(self):
        with self.assertRaises(module.SafeBodyError):
            module.binary_digest(b'{"token":"private"}', "application/json")

    def test_entrypoint_required(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = pathlib.Path(tmp) / "new"
            def missing(cmd, **kwargs):
                return subprocess.CompletedProcess(cmd, 0)
            with self.assertRaises(ValueError):
                module.export(path, "private", get_inventory=lambda _: data(),
                              run=missing, get_source=source_digest)
            self.assertFalse(path.exists())

    def test_cleanup_restores_readonly_directories_without_changing_files(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp) / "private"
            root.mkdir(mode=0o700)
            folder = root / "supabase/functions"
            folder.mkdir(parents=True)
            file = folder / "original.ts"
            file.write_text("real source stays unchanged")
            file.chmod(0o400)
            folder.chmod(0o500)
            module.cleanup_private_download_tree(root)
            self.assertEqual(folder.stat().st_mode & 0o777, 0o700)
            self.assertEqual(file.stat().st_mode & 0o777, 0o400)
            self.assertEqual(file.read_text(), "real source stays unchanged")

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
