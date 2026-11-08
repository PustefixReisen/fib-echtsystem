"""Prove release receipt is exported to Actions only after a valid readback receipt."""
import importlib.util
import pathlib
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts/backup"))
path = ROOT / "scripts/backup/run.py"
spec = importlib.util.spec_from_file_location("fib_full_backup", path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class ReceiptTests(unittest.TestCase):
    def test_valid_receipt_becomes_separate_actions_outputs(self):
        with tempfile.TemporaryDirectory() as temp:
            target = pathlib.Path(temp) / "github-output"
            target.touch()
            valid = {
                "backupId": "release-" + "a"*32,
                "manifestSha256": "b"*64,
                "commit": "c"*40,
                "readback": "passed",
            }
            module.emit_verified_receipt(valid, {"GITHUB_OUTPUT": str(target)})
            self.assertEqual(target.read_text().splitlines(), [
                "backup_id=release-" + "a"*32,
                "manifest_sha256=" + "b"*64,
                "verified_commit=" + "c"*40,
            ])

    def test_no_output_for_invalid_readback_or_identifiers(self):
        with tempfile.TemporaryDirectory() as temp:
            target = pathlib.Path(temp) / "github-output"
            target.touch()
            valid = {
                "backupId": "release-" + "a"*32,
                "manifestSha256": "b"*64,
                "commit": "c"*40,
                "readback": "passed",
            }
            for override in (
                {"readback": "failed"},
                {"backupId": "malformed"},
                {"manifestSha256": "invalid"},
                {"commit": "invalid"},
                {"backupId": "release-" + "a"*32 + "\nunauthorized=yes"},
            ):
                with self.assertRaises(ValueError):
                    module.emit_verified_receipt({**valid, **override}, {"GITHUB_OUTPUT": str(target)})
                self.assertEqual(target.read_text(), "")

    def test_missing_github_output_path_fails_closed(self):
        with self.assertRaises(ValueError):
            module.emit_verified_receipt({
                "backupId": "release-" + "a"*32,
                "manifestSha256": "b"*64,
                "commit": "c"*40,
                "readback": "passed",
            }, {})

    def test_orchestration_is_manual_and_ordered(self):
        text = (ROOT / ".github/workflows/ris-correction-release.yml").read_text()
        assert "workflow_dispatch:" in text
        assert "workflow_call:" not in text
        assert "schedule:" not in text
        assert "needs: preflight" in text
        assert "needs: [preflight, backup]" in text
        assert "needs: [backup, deploy-edge]" in text
        assert "uses: ./.github/workflows/complete-backup.yml" in text
        assert "secrets: inherit" in text
        assert "mirror --reverse --no-perms" in text
        assert "mirror --reverse --delete" not in text
        assert "fib-u4-ris-pilot" in text
        assert "fib-editorial-write" in text


if __name__ == "__main__":
    unittest.main()
