#!/usr/bin/env bash
# Push the shared Prisma schema (owned by ../ecosystem) to the ecosystem DB,
# then commit the schema in ../ecosystem and push it to main.
# Prints the SQL diff first and asks before applying; pass --yes to skip the prompt.
# Pass -m "message" for the ecosystem commit message.
# Stop if the diff contains a DROP you didn't intend: this DB is shared.
set -euo pipefail
cd "$(dirname "$0")/../../ecosystem"

yes=""
msg="Update schema from institutions"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --yes) yes=1; shift ;;
    -m) msg="$2"; shift 2 ;;
    *) echo "Unknown argument: $1"; exit 1 ;;
  esac
done

diff=$(bunx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script 2>/dev/null)
echo "$diff"
if grep -q "This is an empty migration" <<<"$diff"; then
  echo "Schema already in sync."
else
  if grep -qi "DROP" <<<"$diff"; then
    echo "⚠ The diff drops something. Check it carefully."
  fi
  if [[ -z "$yes" ]]; then
    read -r -p "Apply these changes to the database? [y/N] " ok
    [[ "$ok" == "y" ]] || { echo "Aborted."; exit 1; }
  fi
  bunx prisma db push
  bunx prisma generate
fi

# Commit only the schema, so unrelated work in ../ecosystem stays uncommitted.
if git diff --quiet HEAD -- prisma/schema.prisma; then
  echo "ecosystem: schema already committed."
  exit 0
fi
branch=$(git branch --show-current)
if [[ "$branch" != "main" ]]; then
  echo "ecosystem is on '$branch', not main; commit and push the schema yourself."
  exit 1
fi
git add prisma/schema.prisma
git commit -m "$msg" -- prisma/schema.prisma
git pull --rebase --autostash origin main
git push origin main
