"""Offline fail-closed tests for deployed Edge export staging; no network or secrets."""
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


def data():
    return {
        name: {"slug": name, "version": 3, "verify_jwt": True,
               "ezbr_sha256": "a" * 64, "import_map": False}
        for name in ("fib-editorial-write", "fib-u4-ris-pilot", "fib-u4-pilot")
    }


class ExportTests(unittest.TestCase):
    def test_success_and_no_synthetic_review_flag(self):
        with tempfile.TemporaryDirectory() as base:
            path = pathlib.Path(base) / "new"
            def download(cmd, **kwargs):
                slug = cmd[3]
                folder = pathlib.Path(kwargs["cwd"]) / "supabase/functions" / slug
                folder.mkdir(parents=True, exist_ok=True)
                (folder / "index.ts").write_text("export const ok = true;")
                return subprocess.CompletedProcess(cmd, 0)
            self.assertEqual(module.export(path, "private", get_inventory=lambda _: data(), run=download), 3)
            self.assertTrue((path / "edge/inventory.json").is_file())
            self.assertFalse((path / "configuration/evidence.json").exists())
            self.assertFalse((path / "release.json").exists())

    def test_inventory_drift_fails_before_output(self):
        with tempfile.TemporaryDirectory() as base:
            path = pathlib.Path(base) / "new"
            calls = 0
            def inventory(_):
                nonlocal calls
                calls += 1
                result = data()
                if calls == 2:
                    result["fib-u4-ris-pilot"]["version"] = 4
                return result
            def download(cmd, **kwargs):
                folder = pathlib.Path(kwargs["cwd"]) / "supabase/functions" / cmd[3]
                folder.mkdir(parents=True, exist_ok=True)
                (folder / "index.ts").write_text("export const ok = true;")
                return subprocess.CompletedProcess(cmd, 0)
            with self.assertRaises(ValueError):
                module.export(path, "private", get_inventory=inventory, run=download)
            self.assertFalse(path.exists())

    def test_relative_import_missing_fails_closed(self):
        with tempfile.TemporaryDirectory() as base:
            path = pathlib.Path(base) / "new"
            def download(cmd, **kwargs):
                folder = pathlib.Path(kwargs["cwd"]) / "supabase/functions" / cmd[3]
                folder.mkdir(parents=True, exist_ok=True)
                (folder / "index.ts").write_text("import '../_shared/missing.ts';")
                return subprocess.CompletedProcess(cmd, 0)
            with self.assertRaises(ValueError):
                module.export(path, "private", get_inventory=lambda _: data(), run=download)
            self.assertFalse(path.exists())

    def test_existing_destination_untouched(self):
        with tempfile.TemporaryDirectory() as base:
            path = pathlib.Path(base) / "existing"
            path.mkdir()
            sentinel = path / "keep"
            sentinel.write_text("safe")
            with self.assertRaises(ValueError):
                module.export(path, "private", get_inventory=lambda _: data())
            self.assertEqual(sentinel.read_text(), "safe")


if __name__ == "__main__":
    unittest.main()
