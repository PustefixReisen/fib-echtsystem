"""Offline validation tests for encrypted backup receipt gate."""
import importlib.util
import pathlib
import unittest

path = pathlib.Path(__file__).with_name("operator-backup-verify.py")
spec = importlib.util.spec_from_file_location("operator_backup_verify", path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

class BackupReceiptTests(unittest.TestCase):
    def setUp(self):
        self.ident = "release-" + "a" * 32
        self.digest = "b" * 64
        self.proof = {
            "backupId": self.ident, "commit": mod.APPROVED,
            "mode": "release", "readback": "passed",
            "manifestSha256": self.digest,
            "createdAt": "2026-11-01T11:35:22.024548+00:00",
        }

    def test_valid_receipt(self):
        self.assertTrue(mod.validate_receipt(self.proof, self.ident, self.digest))

    def test_wrong_id(self):
        self.proof["backupId"] = "release-" + "c" * 32
        with self.assertRaisesRegex(ValueError, "Wrong receipt backup ID"):
            mod.validate_receipt(self.proof, self.ident, self.digest)

    def test_wrong_commit(self):
        self.proof["commit"] = "f" * 40
        with self.assertRaisesRegex(ValueError, "Wrong receipt release commit"):
            mod.validate_receipt(self.proof, self.ident, self.digest)

    def test_wrong_mode(self):
        self.proof["mode"] = "manual"
        with self.assertRaisesRegex(ValueError, "Release-mode backup required"):
            mod.validate_receipt(self.proof, self.ident, self.digest)

    def test_readback_missing(self):
        self.proof["readback"] = "failed"
        with self.assertRaisesRegex(ValueError, "readback not certified"):
            mod.validate_receipt(self.proof, self.ident, self.digest)

    def test_wrong_manifest(self):
        self.proof["manifestSha256"] = "0" * 64
        with self.assertRaisesRegex(ValueError, "Receipt manifest digest mismatch"):
            mod.validate_receipt(self.proof, self.ident, self.digest)

if __name__ == "__main__":
    unittest.main()
