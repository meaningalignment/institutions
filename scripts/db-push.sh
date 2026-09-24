#!/usr/bin/env bash
# Push the shared Prisma schema (owned by ../ecosystem) to the ecosystem DB.
# Prints the SQL diff first and asks before applying; pass --yes to skip the prompt.
# Stop if the diff contains a DROP you didn't intend: this DB is shared.
set -euo pipefail
cd "$(dirname "$0")/../../ecosystem"

diff=$(bunx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script 2>/dev/null)
echo "$diff"
if grep -q "This is an empty migration" <<<"$diff"; then
  echo "Schema already in sync."
  exit 0
fi
if grep -qi "DROP" <<<"$diff"; then
  echo "⚠ The diff drops something. Check it carefully."
fi
if [[ "${1:-}" != "--yes" ]]; then
  read -r -p "Apply these changes to the database? [y/N] " ok
  [[ "$ok" == "y" ]] || { echo "Aborted."; exit 1; }
fi
bunx prisma db push
bunx prisma generate
