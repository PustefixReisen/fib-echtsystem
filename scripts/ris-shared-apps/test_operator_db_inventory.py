"""Offline unit tests for strictly read-only Shared-Apps inventory."""
import importlib.util
import pathlib
import unittest

path = pathlib.Path(__file__).with_name("operator-db-inventory.py")
spec = importlib.util.spec_from_file_location("operator_db_inventory", path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

def valid():
    return {"fib_tables": 29, "ris_present": False, "manifest_present": False,
            "sources": [{"url": url, "active": False} for url in mod.SOURCES]}

class DatabaseInventoryTests(unittest.TestCase):
    def test_expected_state(self):
        self.assertTrue(mod.validate_inventory(valid()))

    def test_fib_table_drift(self):
        value = valid()
        value["fib_tables"] = 30
        with self.assertRaisesRegex(ValueError, "schema drift"):
            mod.validate_inventory(value)

    def test_ris_migration_present(self):
        value = valid()
        value["ris_present"] = True
        with self.assertRaisesRegex(ValueError, "schema drift"):
            mod.validate_inventory(value)

    def test_manifest_present(self):
        value = valid()
        value["manifest_present"] = True
        with self.assertRaisesRegex(ValueError, "schema drift"):
            mod.validate_inventory(value)

    def test_source_drift(self):
        value = valid()
        value["sources"][0]["active"] = True
        with self.assertRaisesRegex(ValueError, "drift"):
            mod.validate_inventory(value)

    def test_missing_source(self):
        value = valid()
        value["sources"].pop()
        with self.assertRaisesRegex(ValueError, "exactly two"):
            mod.validate_inventory(value)

    def test_reject_non_shared_apps_target(self):
        with self.assertRaisesRegex(ValueError, "not allowed"):
            mod.validate_url("postgresql://postgres:password@not-supabase.example:5432/postgres?sslmode=verify-full")

    def test_reject_tls_downgrade(self):
        with self.assertRaisesRegex(ValueError, "Verified TLS"):
            mod.validate_url("postgresql://postgres.apaubomxffcwtzjimori:pass@aws-0-eu-west-3.pooler.supabase.com:5432/postgres?sslmode=disable")

if __name__ == "__main__":
    unittest.main()
