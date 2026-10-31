#!/usr/bin/env bash
set -euo pipefail
umask 077
# Existing schema capture is reused. Remaining exports are reviewed private inputs.
: "${FIB_BACKUP_ROOT:?Private empty bundle directory required}"
: "${FIB_RELEASE_COMMIT:?Full approved release commit required}"
: "${FIB_MAINTENANCE_DATABASE_URL:?Existing maintenance connection required}"
node scripts/ris-shared-apps/backup.mjs --out="$FIB_BACKUP_ROOT/database"
# seal refuses incomplete edge/frontend/configuration inputs and unverified restore evidence.
node scripts/backup/bundle.mjs seal "$FIB_BACKUP_ROOT" "$FIB_RELEASE_COMMIT"
