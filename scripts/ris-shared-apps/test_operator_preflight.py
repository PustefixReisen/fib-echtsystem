"""Offline, no-network failure tests for RIS operator preflight (#368)."""
import importlib.util
import io
import json
import pathlib
import sys
import unittest
from contextlib import redirect_stdout
from datetime import datetime, timezone
from unittest.mock import patch

PATH = pathlib.Path(__file__).resolve().with_name("operator-preflight.py")
SPEC = importlib.util.spec_from_file_location("ris_operator_preflight", PATH)
app = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(app)

def fake_command(*args):
    if args[0] == "git":
        if "cat-file" in args:
            return "commit"
        if "status" in args:
            return ""
        return app.APPROVED_SHA
    if args[1:3] == ("functions", "list"):
        out = [
            {"slug": slug, "version": version, "verify_jwt": jwt, "ezbr_sha256": digest}
            for slug, (version, jwt, digest) in app.FUNCTIONS.items()
        ]
        return json.dumps(out)
    if args[1:3] == ("migration", "list"):
        return "20261030161632 | old"
    if args[1:3] == ("secrets", "list"):
        return "NAME | DIGEST"
    raise AssertionError(args)

class PreflightTests(unittest.TestCase):
    def invoke(self, *, sha=None, age=0, command=fake_command):
        timestamp = datetime.fromtimestamp(datetime.now(timezone.utc).timestamp() - age,
                                          timezone.utc).isoformat()
        argv = ["operator-preflight.py", "--backup-id", "release-" + "a" * 32,
                "--backup-manifest-sha256", "b" * 64,
                "--backup-created-at", timestamp,
                "--backup-commit", sha or app.APPROVED_SHA]
        with patch.object(sys, "argv", argv), patch.object(app, "command", side_effect=command):
            with redirect_stdout(io.StringIO()):
                app.main()

    def test_read_only_happy_path(self):
        self.invoke()

    def test_reject_wrong_release_commit(self):
        with self.assertRaisesRegex(RuntimeError, "Backup commit"):
            self.invoke(sha="c" * 40)

    def test_reject_old_backup(self):
        with self.assertRaisesRegex(RuntimeError, "not fresh"):
            self.invoke(age=3700)

    def test_reject_existing_ris_migration(self):
        def drift(*args):
            if args[1:3] == ("migration", "list"):
                return "20261031081340 | fib_ris_editorial_structure"
            return fake_command(*args)
        with self.assertRaisesRegex(RuntimeError, "already registered"):
            self.invoke(command=drift)

    def test_reject_feature_drift(self):
        def drift(*args):
            if args[1:3] == ("secrets", "list"):
                return "FIB_RIS_STRUCTURE_ENABLED | hash-not-a-secret"
            return fake_command(*args)
        with self.assertRaisesRegex(RuntimeError, "already exists"):
            self.invoke(command=drift)

    def test_reject_function_digest_drift(self):
        def drift(*args):
            value = fake_command(*args)
            if args[1:3] == ("functions", "list"):
                functions = json.loads(value)
                functions[0]["ezbr_sha256"] = "0" * 64
                return json.dumps(functions)
            return value
        with self.assertRaisesRegex(RuntimeError, "deployment drift"):
            self.invoke(command=drift)

    def test_reject_unexpected_function(self):
        def drift(*args):
            value = fake_command(*args)
            if args[1:3] == ("functions", "list"):
                functions = json.loads(value)
                functions.append({"slug": "fib-unexpected", "version": 1})
                return json.dumps(functions)
            return value
        with self.assertRaisesRegex(RuntimeError, "Unexpected FIB function set"):
            self.invoke(command=drift)

    def test_reject_jwt_drift(self):
        def drift(*args):
            value = fake_command(*args)
            if args[1:3] == ("functions", "list"):
                functions = json.loads(value)
                functions[0]["verify_jwt"] = not functions[0]["verify_jwt"]
                return json.dumps(functions)
            return value
        with self.assertRaisesRegex(RuntimeError, "deployment drift"):
            self.invoke(command=drift)

    def test_reject_unapproved_main(self):
        def drift(*args):
            if args[0] == "git" and "rev-parse" in args and "origin/main" in args:
                return "f" * 40
            return fake_command(*args)
        with self.assertRaisesRegex(RuntimeError, "origin/main differs"):
            self.invoke(command=drift)

    def test_reject_dirty_tree(self):
        def drift(*args):
            if args[0] == "git" and "status" in args:
                return " M file"
            return fake_command(*args)
        with self.assertRaisesRegex(RuntimeError, "dirty"):
            self.invoke(command=drift)

    def test_reject_function_version_drift(self):
        def drift(*args):
            value = fake_command(*args)
            if args[1:3] == ("functions", "list"):
                functions = json.loads(value)
                functions[0]["version"] += 1
                return json.dumps(functions)
            return value
        with self.assertRaisesRegex(RuntimeError, "deployment drift"):
            self.invoke(command=drift)

if __name__ == "__main__":
    unittest.main()
