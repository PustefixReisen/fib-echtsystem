"""No-network tests: Supabase's API may return sensitive secret values."""
import datetime
import importlib.util
import json
import pathlib
import tempfile
import unittest

SOURCE = pathlib.Path(__file__).resolve().parents[2] / "scripts/backup/capture-feature-flags.py"
spec = importlib.util.spec_from_file_location("fib_feature_capture", SOURCE)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

NOW = datetime.datetime.now(datetime.timezone.utc).isoformat()


def source():
    return {
        "format": "fib-db-source-state-v1", "scope": "fib-only-read-only",
        "capturedAt": NOW,
        "sourceFlags": [{"id": "example", "active": True}],
        "scopeFlags": [], "projectFeatures": {"status": "not_captured"},
        "operatorReview": False,
    }


class FeatureCaptureTests(unittest.TestCase):
    def test_only_allowlisted_boolean_values_survive(self):
        original = [
            {"name": "FIB_RIS_STRUCTURE_ENABLED", "value": "true"},
            {"name": "FIB_RIS_AUTOMATION_ENABLED", "value": "false"},
            {"name": "FIB_RIS_INTEGRATION_TEST_ENABLED", "value": "FALSE"},
            {"name": "SUPABASE_SERVICE_ROLE_KEY", "value": "SECRET_VALUE_MUST_NOT_APPEAR"},
            {"name": "MEMORIX_API_TOKEN", "value": "ANOTHER_SECRET_MUST_NOT_APPEAR"},
        ]
        state = module.build_state(source(), original)
        self.assertEqual(state["projectFeatures"]["status"], "captured")
        self.assertEqual(state["projectFeatures"]["values"]["FIB_RIS_STRUCTURE_ENABLED"], True)
        self.assertEqual(state["projectFeatures"]["values"]["FIB_RIS_AUTOMATION_ENABLED"], False)
        self.assertEqual(state["projectFeatures"]["missing"], [])
        self.assertFalse(state["operatorReview"])
        self.assertTrue(state["reviewRequired"])
        self.assertNotIn("SECRET_VALUE", json.dumps(state))
        self.assertNotIn("MEMORIX", json.dumps(state))

    def test_absence_is_not_false(self):
        state = module.build_state(source(), [{"name": "FIB_RIS_STRUCTURE_ENABLED", "value": "false"}])
        self.assertEqual(state["projectFeatures"]["status"], "incomplete")
        self.assertNotIn("FIB_RIS_AUTOMATION_ENABLED", state["projectFeatures"]["values"])
        self.assertIn("FIB_RIS_AUTOMATION_ENABLED", state["projectFeatures"]["missing"])

    def test_invalid_or_duplicate_allowed_value_rejected(self):
        for rows in (
            [{"name": "FIB_RIS_STRUCTURE_ENABLED", "value": "SUPER_SECRET"}],
            [{"name": "FIB_RIS_STRUCTURE_ENABLED", "value": "true"},
             {"name": "FIB_RIS_STRUCTURE_ENABLED", "value": "false"}],
            {"name": "FIB_RIS_STRUCTURE_ENABLED", "value": "true"},
        ):
            with self.assertRaises(ValueError):
                module.redact_to_flags(rows)

    def test_stale_source_or_prior_review_not_accepted(self):
        stale = source()
        stale["capturedAt"] = "2026-01-01T00:00:00Z"
        with self.assertRaises(ValueError):
            module.build_state(stale, [])
        claimed = source()
        claimed["operatorReview"] = True
        with self.assertRaises(ValueError):
            module.build_state(claimed, [])

    def test_private_destination_outside_repo_only(self):
        with tempfile.TemporaryDirectory() as folder:
            with self.assertRaises(ValueError):
                module.private_destination(pathlib.Path(folder) / "flags.json")
            parent = pathlib.Path(folder) / "private"
            parent.mkdir(mode=0o700)
            out = module.private_destination(parent / "flags.json")
            self.assertEqual(out, parent / "flags.json")
            out.write_text("sentinel")
            with self.assertRaises(ValueError):
                module.private_destination(out)


if __name__ == "__main__":
    unittest.main()
