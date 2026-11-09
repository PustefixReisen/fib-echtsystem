"""Offline tests: one operator command collects only UNREVIEWED inputs."""
import importlib.util
from pathlib import Path
import json
import os
import subprocess
import tempfile
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[2] / "scripts/backup/prepare-private-review.py"
spec = importlib.util.spec_from_file_location("private_review", SCRIPT)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

ENV = {"SUPABASE_ACCESS_TOKEN": "SECRET_SHOULD_NOT_BE_LOGGED",
       "FIB_MAINTENANCE_DATABASE_URL": "DATABASE_SECRET"}


class OperatorPreparation(unittest.TestCase):
    def parent(self, parent):
        parent.chmod(0o700)
        return parent / "new-workspace"

    def test_read_only_collection_never_auto_reviews(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = self.parent(Path(tmp))
            commands = []
            def fake(cmd, **kw):
                commands.append(cmd)
                self.assertEqual(kw["env"], ENV)
                self.assertTrue(kw["capture_output"])
                self.assertFalse(kw["check"])
                self.assertEqual(kw["timeout"], 600)
                if "export-deployed-edge.py" in cmd[1]:
                    p = root / "input/edge"
                    p.mkdir(parents=True)
                    (p / "inventory.json").write_text("[]")
                if "capture-source-state.mjs" in cmd[1]:
                    (root / "review/source.json").write_text("{}")
                if "capture-feature-flags.py" in cmd[1]:
                    (root / "review/features.json").write_text("{}")
                return subprocess.CompletedProcess(cmd, 0)
            self.assertEqual(m.collect(root, ENV, run=fake), root)
            self.assertEqual(len(commands), 3)
            self.assertTrue((root / "input/edge/inventory.json").is_file())
            self.assertTrue((root / "input/configuration").is_dir())
            self.assertFalse((root / "input/configuration/capture.json").exists())
            self.assertFalse((root / "input/configuration/state.json").exists())
            self.assertFalse((root / "input/release.json").exists())

    def test_failed_capture_cleans_only_new_private_root(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = self.parent(Path(tmp))
            marker = root.parent / "preserve"
            marker.write_text("keep")
            def fail(cmd, **kw):
                return subprocess.CompletedProcess(cmd, 1, stderr=b"VERY_SENSITIVE")
            with self.assertRaisesRegex(ValueError, "capture step failed") as e:
                m.collect(root, ENV, run=fail)
            self.assertNotIn("VERY_SENSITIVE", str(e.exception))
            self.assertFalse(root.exists())
            self.assertEqual(marker.read_text(), "keep")

    def test_existing_and_insecure_destinations_refused(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = self.parent(Path(tmp))
            root.mkdir()
            with self.assertRaises(ValueError):
                m.collect(root, ENV)
            root.rmdir()
            root.parent.chmod(0o755)
            with self.assertRaises(ValueError):
                m.collect(root, ENV)
            self.assertFalse(root.exists())

    def test_missing_credentials_prevents_all_work(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = self.parent(Path(tmp))
            with self.assertRaises(ValueError):
                m.collect(root, {"SUPABASE_ACCESS_TOKEN": "x"})
            self.assertFalse(root.exists())


if __name__ == "__main__":
    unittest.main()
