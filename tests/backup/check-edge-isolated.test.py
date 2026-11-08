"""Unit tests for the zero-secret isolated TypeScript reconstruction preflight."""
import importlib.util
import pathlib
import subprocess
import tempfile
import unittest
from unittest.mock import patch

P = pathlib.Path(__file__).resolve().parents[2] / "scripts/backup/check-edge-isolated.py"
spec = importlib.util.spec_from_file_location("edge_isolation", P)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


class DenoIsolation(unittest.TestCase):
    def test_two_entrypoints_and_zero_secret_environment(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            for slug in ("fib-editorial-write", "fib-u4-ris-pilot"):
                entry = root / slug
                entry.mkdir()
                (entry / "index.ts").write_text("export const ok = 1;")
            seen = []
            def fake_run(cmd, **kw):
                seen.append((cmd, kw))
                self.assertTrue(kw["capture_output"])
                self.assertEqual(kw["timeout"], 180)
                self.assertFalse(kw["check"])
                self.assertEqual(kw["env"]["DENO_NO_PROMPT"], "1")
                self.assertEqual(set(kw["env"]), {"PATH", "HOME", "DENO_DIR", "DENO_NO_PROMPT", "NO_COLOR"})
                self.assertNotIn("SUPABASE_ACCESS_TOKEN", kw["env"])
                self.assertNotIn("FIB_DATABASE_URL", kw["env"])
                return subprocess.CompletedProcess(cmd, 0)
            with patch.dict("os.environ", {"SUPABASE_ACCESS_TOKEN": "DO_NOT_LEAK", "FIB_DATABASE_URL": "PRIVATE"}):
                n = m.check(root, ("fib-u4-ris-pilot", "fib-editorial-write"), run=fake_run)
            self.assertEqual(n, 2)
            self.assertEqual(len(seen), 2)
            self.assertEqual(seen[0][0][1:4], ["check", "--no-config", "--no-lock"])

    def test_typecheck_failure_blocks(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            (root / "fib-u4-pilot").mkdir()
            (root / "fib-u4-pilot/index.ts").write_text("BAD")
            def fail(cmd, **kw):
                return subprocess.CompletedProcess(cmd, 1, stderr=b"PRIVATE_BUILD_OUTPUT")
            with self.assertRaisesRegex(ValueError, "Deno check failed"):
                m.check(root, ["fib-u4-pilot"], run=fail)

    def test_untrusted_slug_and_missing_entrypoint_block(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            for slug in ("../auth", "fib-u4-pilot", "fib-u4-pilot/../../secret"):
                with self.assertRaises(ValueError):
                    m.check(root, [slug])
            with self.assertRaises(ValueError):
                m.check(root, [])

    def test_symlink_entrypoint_block(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            (root / "fib-u4-pilot").mkdir()
            outside = root / "outside.ts"
            outside.write_text("export const x=1;")
            (root / "fib-u4-pilot/index.ts").symlink_to(outside)
            with self.assertRaises(ValueError):
                m.check(root, ["fib-u4-pilot"])


if __name__ == "__main__":
    unittest.main()
