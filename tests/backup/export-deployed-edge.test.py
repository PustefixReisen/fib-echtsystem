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



def live_source(_, slug):
    row = data()[slug]
    return {**row, "files": [{"name": slug + "/index.ts", "content": "export const ok = true;"}]}


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
            self.assertEqual(module.export(path, "private", get_inventory=lambda _: data(), run=download, get_source=live_source), 3)
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
                module.export(path, "private", get_inventory=inventory, run=download, get_source=live_source)
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
                module.export(path, "private", get_inventory=lambda _: data(), run=download, get_source=live_source)
            self.assertFalse(path.exists())

    def test_detects_same_path_with_different_live_bytes(self):
        with tempfile.TemporaryDirectory() as base:
            path = pathlib.Path(base) / "new"
            def download(cmd, **kwargs):
                slug = cmd[3]
                folder = pathlib.Path(kwargs["cwd"]) / "supabase/functions" / slug
                folder.mkdir(parents=True, exist_ok=True)
                (folder / "index.ts").write_text("export const ok = true;")
                return subprocess.CompletedProcess(cmd, 0)
            def changed(_, slug):
                live = live_source(_, slug)
                if slug == "fib-u4-ris-pilot":
                    live["files"][0]["content"] = "export const tampered = true;"
                return live
            with self.assertRaises(ValueError):
                module.export(path, "private", get_inventory=lambda _: data(),
                              run=download, get_source=changed)
            self.assertFalse(path.exists())

    def test_live_file_aliases_and_traversal(self):
        meta = data()["fib-u4-pilot"]
        doc = {**meta, "files": [
            {"name": "index.ts", "content": "export const ok = true;"},
            {"name": "_shared/u4-news.ts", "content": "export const shared = true;"},
        ]}
        normalized = module.normalized_live_files(doc, "fib-u4-pilot")
        self.assertEqual(set(normalized), {"fib-u4-pilot/index.ts", "_shared/u4-news.ts"})
        doc["files"].append({"name": "../leak.ts", "content": "should not pass"})
        with self.assertRaises(ValueError):
            module.normalized_live_files(doc, "fib-u4-pilot")

    def test_shared_module_source_drift_aborts(self):
        with tempfile.TemporaryDirectory() as base:
            path = pathlib.Path(base) / "new"
            def download(cmd, **kwargs):
                root = pathlib.Path(kwargs["cwd"]) / "supabase/functions"
                folder = root / cmd[3]
                folder.mkdir(parents=True, exist_ok=True)
                (folder / "index.ts").write_text("export const ok = true;")
                shared = root / "_shared"
                shared.mkdir(exist_ok=True)
                (shared / "lib.ts").write_text("export const shared = true;")
                return subprocess.CompletedProcess(cmd, 0)
            def divergent(_, slug):
                doc = live_source(_, slug)
                doc["files"].append({
                    "name": "_shared/lib.ts",
                    "content": "export const shared = " + ("false" if slug == "fib-u4-pilot" else "true") + ";",
                })
                return doc
            with self.assertRaises(ValueError):
                module.export(path, "private", get_inventory=lambda _: data(),
                              run=download, get_source=divergent)
            self.assertFalse(path.exists())

    def test_private_inventory_is_excluded_but_real_source_must_match(self):
        with tempfile.TemporaryDirectory() as base:
            edge = pathlib.Path(base)
            for slug in data():
                folder = edge / slug
                folder.mkdir()
                (folder / "index.ts").write_text("export const ok = true;")
            (edge / "inventory.json").write_text(json.dumps(list(data().values())))
            self.assertEqual(module.compare_to_live_source(
                edge, data(), live_source, "private", allow_private_inventory=True), 3)
            (edge / "fib-u4-ris-pilot/index.ts").write_text("CHANGED")
            with self.assertRaises(ValueError):
                module.compare_to_live_source(
                    edge, data(), live_source, "private", allow_private_inventory=True)

    def test_private_inventory_does_not_whitelist_extra_source_file(self):
        with tempfile.TemporaryDirectory() as base:
            edge = pathlib.Path(base)
            for slug in data():
                folder = edge / slug
                folder.mkdir()
                (folder / "index.ts").write_text("export const ok = true;")
            (edge / "inventory.json").write_text(json.dumps(list(data().values())))
            (edge / "fib-u4-ris-pilot/unexpected.ts").write_text("export const leaked = true;")
            with self.assertRaises(ValueError):
                module.compare_to_live_source(
                    edge, data(), live_source, "private", allow_private_inventory=True)

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
