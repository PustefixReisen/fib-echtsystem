"""Offline integration tests: composite RIS operator gate must fail closed."""
import importlib.util
import pathlib
import unittest
from datetime import datetime, timezone, timedelta
from unittest.mock import patch

p = pathlib.Path(__file__).with_name("operator-readiness.py")
spec = importlib.util.spec_from_file_location("operator_readiness", p)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

class ReadinessTests(unittest.TestCase):
    def evidence(self, age=0):
        return {"commit": mod.APPROVED, "verifiedEncryptedReadback": True,
                "createdAt": (datetime.now(timezone.utc)-timedelta(seconds=age)).isoformat()}

    def inventory(self):
        return {"status": "READ_ONLY_DB_INVENTORY_PASSED", "fib_tables": 29,
                "official_sources_inactive": 2, "ris_schema_not_installed": True}

    def test_success(self):
        self.assertLess(mod.validate_ready(self.evidence(), self.inventory()), 60)

    def test_expired(self):
        with self.assertRaisesRegex(ValueError, "expired"):
            mod.validate_ready(self.evidence(age=4000), self.inventory())

    def test_missing_readback(self):
        value=self.evidence()
        value["verifiedEncryptedReadback"]=False
        with self.assertRaisesRegex(ValueError, "not independently"):
            mod.validate_ready(value,self.inventory())

    def test_wrong_commit(self):
        value=self.evidence()
        value["commit"]="0"*40
        with self.assertRaisesRegex(ValueError, "not independently"):
            mod.validate_ready(value,self.inventory())

    def test_db_drift(self):
        value=self.inventory()
        value["fib_tables"]=30
        with self.assertRaisesRegex(ValueError, "drift"):
            mod.validate_ready(self.evidence(),value)

    def test_bad_db_result(self):
        with self.assertRaisesRegex(ValueError, "drift"):
            mod.validate_ready(self.evidence(),{"status":"NOT_RUN"})

if __name__=="__main__":
    unittest.main()
