"""Offline guard tests; no Supabase read or writes."""
import importlib.util
import pathlib
import unittest

file=pathlib.Path(__file__).resolve().parents[2]/"scripts/backup/check-ris-deploy-drift.py"
spec=importlib.util.spec_from_file_location("ris_drift",file)
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class DriftTests(unittest.TestCase):
    def live(self):
        return [{"slug":slug, **value} for slug,value in module.BASELINE.items()]

    def test_exact_match(self):
        self.assertTrue(module.check(self.live()))
        self.assertTrue(module.check({"functions":self.live()}))

    def test_version_drift(self):
        rows=self.live()
        rows[0]["version"]+=1
        with self.assertRaises(ValueError):
            module.check(rows)

    def test_bundle_drift(self):
        rows=self.live()
        rows[1]["ezbr_sha256"]="0"*64
        with self.assertRaises(ValueError):
            module.check(rows)

    def test_jwt_drift(self):
        rows=self.live()
        rows[1]["verify_jwt"]=False
        with self.assertRaises(ValueError):
            module.check(rows)

    def test_missing_and_duplicate(self):
        with self.assertRaises(ValueError):
            module.check(self.live()[:1])
        with self.assertRaises(ValueError):
            module.check(self.live()+self.live()[:1])

    def test_other_app_does_not_override(self):
        self.assertTrue(module.check(self.live()+[{"slug":"memorix-elsewhere","version":3}]))

if __name__ == "__main__":
    unittest.main()
