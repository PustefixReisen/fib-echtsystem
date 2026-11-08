"""Offline tests for the read-only CLI + deployed EZBR digest diagnostic."""
import hashlib
import importlib.util
import pathlib
import subprocess
import tempfile
import unittest

SCRIPT = pathlib.Path(__file__).resolve().parents[2] / "scripts/backup/read-only-edge-check.py"
spec = importlib.util.spec_from_file_location("fib_readonly", SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
BUNDLE = b"EZBR" + b"example readonly compiled bundle"
DIGEST = hashlib.sha256(BUNDLE).hexdigest()


def expected():
    return {
        slug: {"slug": slug, "version": 2, "verify_jwt": slug != "fib-editorial-write",
               "import_map": False, "ezbr_sha256": DIGEST}
        for slug in ("fib-editorial-write", "fib-u4-ris-pilot", "fib-u4-pilot")
    }


def api(_, path):
    if path:
        raise AssertionError("Metadata API per-function files are not supported")
    return list(expected().values())


def body(_, slug):
    assert slug in expected()
    return DIGEST


def downloaded(cmd, **kw):
    slug = cmd[3]
    folder = pathlib.Path(kw["cwd"]) / "supabase/functions" / slug
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "index.ts").write_text("export const ok = true;", encoding="utf-8")
    return subprocess.CompletedProcess(cmd, 0)


class ReadOnlyCheck(unittest.TestCase):
    def test_successful_cli_and_bundle_audit(self):
        self.assertEqual(module.check("mock-token", api=api, body=body, run=downloaded), (3, 3))

    def test_missing_nested_type_import_blocks(self):
        def missing(cmd, **kw):
            result = downloaded(cmd, **kw)
            if cmd[3] == "fib-u4-pilot":
                (pathlib.Path(kw["cwd"]) / "supabase/functions/fib-u4-pilot/index.ts").write_text(
                    'import type { RisSql } from "../_shared/ris-structure.ts";'
                )
            return result
        with self.assertRaises(module.SafeDiagnostic) as e:
            module.check("mock-token", api=api, body=body, run=missing)
        self.assertEqual(str(e.exception), "CLI_SOURCE_DEPENDENCIES")

    def test_bundle_digest_mismatch_blocks(self):
        def changed(_, slug):
            if slug == "fib-u4-ris-pilot":
                return "0" * 64
            return DIGEST
        with self.assertRaises(module.SafeDiagnostic) as e:
            module.check("mock-token", api=api, body=changed, run=downloaded)
        self.assertEqual(str(e.exception), "DEPLOYED_BUNDLE_fib-u4-ris-pilot")

    def test_metadata_drift_blocks(self):
        count = 0
        def drift(_, path):
            nonlocal count
            if not path:
                count += 1
            result = api(_, path)
            if count > 1:
                result[0]["version"] = 3
            return result
        with self.assertRaises(module.SafeDiagnostic) as e:
            module.check("mock-token", api=drift, body=body, run=downloaded)
        self.assertEqual(str(e.exception), "FINAL_INVENTORY")

    def test_download_failure_does_not_leak_raw_cli_output(self):
        def failed(cmd, **kwargs):
            return subprocess.CompletedProcess(cmd, 1, stdout=b"SENSITIVE_PATH",
                                               stderr=b"PRIVATE_KEY_MUST_NOT_APPEAR")
        with self.assertRaises(module.SafeDiagnostic) as e:
            module.check("mock-token", api=api, body=body, run=failed)
        self.assertEqual(str(e.exception), "CLI_DOWNLOAD_fib-editorial-write")
        self.assertNotIn("PRIVATE_KEY", str(e.exception))

    def test_broken_body_does_not_leak_api_exception(self):
        def broken(_, slug):
            if slug == "fib-u4-pilot":
                raise ValueError("PRIVATE_SECRET_MUST_NOT_APPEAR")
            return DIGEST
        with self.assertRaises(module.SafeDiagnostic) as e:
            module.check("mock-token", api=api, body=broken, run=downloaded)
        self.assertEqual(str(e.exception), "DEPLOYED_BUNDLE_fib-u4-pilot")
        self.assertNotIn("PRIVATE_SECRET", str(e.exception))

    def test_body_requires_ezbr_header(self):
        class Resp:
            def __enter__(self): return self
            def __exit__(self, *args): return None
            def read(self, n): return b"INVALID_CONTENT"
        with self.assertRaises(ValueError):
            module.read_body("private", "fib-editorial-write", opener=lambda *a, **kw: Resp())

    def test_duplicate_or_missing_ris_inventory_rejected(self):
        with self.assertRaises(ValueError):
            module.inventory([])
        with self.assertRaises(ValueError):
            module.inventory([expected()["fib-u4-pilot"]])
        with self.assertRaises(ValueError):
            module.inventory(list(expected().values()) * 2)


if __name__ == "__main__":
    unittest.main()
