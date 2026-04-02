#!/bin/bash
# Generates data/manifest.json from the .md files in data/{human,agi,fidelity}/
set -e
cd "$(dirname "$0")"

echo '{' > data/manifest.json
first_tab=true
for tab in human agi fidelity; do
  if [ "$first_tab" = true ]; then first_tab=false; else echo ',' >> data/manifest.json; fi
  printf '  "%s": [' "$tab" >> data/manifest.json
  first_cell=true
  for f in data/$tab/*.md; do
    [ -f "$f" ] || continue
    name=$(basename "$f" .md)
    if [ "$first_cell" = true ]; then first_cell=false; else printf ',' >> data/manifest.json; fi
    printf '"%s"' "$name" >> data/manifest.json
  done
  printf ']' >> data/manifest.json
done
echo '' >> data/manifest.json
echo '}' >> data/manifest.json

echo "Generated data/manifest.json"
