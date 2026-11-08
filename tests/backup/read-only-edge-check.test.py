"""Offline tests of the standalone source-readiness diagnosis; no credentials."""
import importlib.util
import pathlib
import subprocess
import tempfile
import unittest

SCRIPT = pathlib.Path(__file__).resolve().parents[2] / "scripts/backup/read-only-edge-check.py"
spec = importlib.util.spec_from_file_location("fib_readonly", SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def expected():
    return {
        slug: {"slug": slug, "version": 2, "verify_jwt": slug != "fib-editorial-write",
               "import_map": False, "ezbr_sha256": "a" * 64}
        for slug in ("fib-editorial-write", "fib-u4-ris-pilot", "fib-u4-pilot")
    }


def api(_, path):
    all_functions = expected()
    if not path:
        return list(all_functions.values())
    slug = path[1:]
    return {**all_functions[slug], "files": [
        {"name": slug + "/index.ts", "content": "export const ok = true;"}
    ]}


def downloaded(cmd, **kw):
    slug = cmd[3]
    folder = pathlib.Path(kw["cwd"]) / "supabase/functions" / slug
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "index.ts").write_text("export const ok = true;", encoding="utf-8")
    return subprocess.CompletedProcess(cmd, 0)


class ReadOnlyCheck(unittest.TestCase):
    def test_exact_deployed_source(self):
        self.assertEqual(module.check("mock-token", api=api, run=downloaded), (3, 3))

    def test_missing_type_dependency_blocks(self):
        def live(_, path):
            value = api(_, path)
            if path == "/fib-u4-pilot":
                value["files"][0]["content"] = 'import type { RisSql } from "../_shared/ris-structure.ts";'
            return value
        with self.assertRaises(ValueError):
            module.check("mock-token", api=live, run=downloaded)

    def test_changed_deployed_file_blocks(self):
        def changed(_, path):
            value = api(_, path)
            if path == "/fib-u4-ris-pilot":
                value["files"][0]["content"] = "export const changed = true;"
            return value
        with self.assertRaises(ValueError):
            module.check("mock-token", api=changed, run=downloaded)

    def test_drift_blocks(self):
        count = 0
        def drift(token, path):
            nonlocal count
            if not path:
                count += 1
            value = api(token, path)
            if count > 1 and not path:
                value[0]["version"] = 3
            return value
        with self.assertRaises(ValueError):
            module.check("mock-token", api=drift, run=downloaded)

    def test_shared_module_conflict_blocks(self):
        def source(_, path):
            value = api(_, path)
            if path:
                value["files"].append({
                    "name": "_shared/common.ts",
                    "content": "export const x = " + ("0" if path == "/fib-u4-ris-pilot" else "1") + ";",
                })
            return value
        with self.assertRaises(ValueError):
            module.check("mock-token", api=source, run=downloaded)

    def test_unsafe_paths_are_rejected(self):
        for path in ("../secret.ts", "_shared/../secret.ts", "/tmp/index.ts", "other/f.ts", "a\\b.ts"):
            with self.assertRaises(ValueError):
                module.canonical("fib-u4-pilot", path)

    def test_empty_or_missing_ris_inventory_rejected(self):
        with self.assertRaises(ValueError):
            module.inventory([])
        with self.assertRaises(ValueError):
            module.inventory([expected()["fib-u4-pilot"]])


if __name__ == "__main__":
    unittest.main()
