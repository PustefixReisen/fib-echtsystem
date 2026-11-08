"""Offline tests for encrypted reviewed input staging; no live cloud access."""
import datetime
import importlib.util
import json
import pathlib
import subprocess
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts/backup"))
p = ROOT / "scripts/backup/stage-reviewed-input.py"
spec = importlib.util.spec_from_file_location("fib_stage_input", p)
stage = importlib.util.module_from_spec(spec)
spec.loader.exec_module(stage)
NOW = datetime.datetime.now(datetime.timezone.utc)
CONFIG = ("[fib-nextcloud]\ntype=webdav\n"
          "url=https://example.invalid/FIB-Backups\nuser=test\npass=synthetic\n"
          "[fib-backup-crypt]\ntype=crypt\nremote=fib-nextcloud:\n"
          "password=synthetic\n")
LIVE = [{"slug": "fib-example", "version": 1, "verify_jwt": False,
         "ezbr_sha256": "a"*64, "import_map": False}]


def prepare(root, reviewed=True):
    (root / "edge/fib-example").mkdir(parents=True)
    (root / "edge/fib-example/index.ts").write_text("export const ok=true")
    (root / "edge/inventory.json").write_text(json.dumps(LIVE))
    (root / "configuration").mkdir()
    (root / "configuration/state.json").write_text(json.dumps({"flags": {"enabled": False}}))
    (root / "configuration/capture.json").write_text(json.dumps({
        "capturedAt": NOW.isoformat(), "featureStatesReviewed": reviewed,
        "completeFunctionExportsReviewed": reviewed,
    }))


class StageTests(unittest.TestCase):
    def test_success_returns_generated_id_only_after_readback(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp) / "capture"
            root.mkdir()
            prepare(root)
            calls = []
            def cmd(args, **kw):
                calls.append(args)
                if "copy" in args and "readback" in args[-1]:
                    import shutil
                    shutil.copytree(root, pathlib.Path(args[-1]), dirs_exist_ok=True)
                return subprocess.CompletedProcess(args, 0)
            result = stage.prepare_input(
                root, {"FIB_BACKUP_MANAGEMENT_TOKEN": "synthetic",
                       "FIB_BACKUP_RCLONE_CONFIG": CONFIG},
                inventory_reader=lambda t: LIVE, run=cmd, now=NOW,
                id_factory=lambda: "b"*32,
            )
            self.assertEqual(result, "input-" + "b"*32)
            self.assertEqual(len(calls), 2)

    def test_no_export_if_unreviewed(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp) / "capture"
            root.mkdir()
            prepare(root, reviewed=False)
            with self.assertRaises(ValueError):
                stage.prepare_input(root, {
                    "FIB_BACKUP_MANAGEMENT_TOKEN": "synthetic",
                    "FIB_BACKUP_RCLONE_CONFIG": CONFIG},
                    inventory_reader=lambda t: LIVE, now=NOW)

    def test_no_export_if_drift(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp) / "capture"
            root.mkdir()
            prepare(root)
            count = 0
            def changed(_):
                nonlocal count
                count += 1
                return LIVE if count == 1 else [dict(LIVE[0], version=2)]
            with self.assertRaises(ValueError):
                stage.prepare_input(root, {
                    "FIB_BACKUP_MANAGEMENT_TOKEN": "synthetic",
                    "FIB_BACKUP_RCLONE_CONFIG": CONFIG},
                    inventory_reader=changed, now=NOW)

    def test_readback_mismatch_fails_closed(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp) / "capture"
            root.mkdir()
            prepare(root)
            def cmd(args, **kw):
                return subprocess.CompletedProcess(args, 0)
            with self.assertRaises(ValueError):
                stage.prepare_input(
                    root, {"FIB_BACKUP_MANAGEMENT_TOKEN": "synthetic",
                           "FIB_BACKUP_RCLONE_CONFIG": CONFIG},
                    inventory_reader=lambda t: LIVE, run=cmd, now=NOW,
                    id_factory=lambda: "c"*32)

    def test_missing_configuration_fails_before_transfer(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp) / "capture"
            root.mkdir()
            prepare(root)
            (root / "configuration/state.json").unlink()
            with self.assertRaises(ValueError):
                stage.verify_input(root, LIVE, NOW)


if __name__ == "__main__":
    unittest.main()
