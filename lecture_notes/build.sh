#!/usr/bin/env bash
# Build lecture notes: notes_NN.md -> notes_NN.html (self-contained) + notes_NN.pdf
# Usage: ./build.sh          # build all notes_*.md
#        ./build.sh 01 03    # build only the given sessions
set -euo pipefail

cd "$(dirname "$0")"

PANDOC="${PANDOC:-pandoc}"
CHROME="${CHROME:-google-chrome}"

if [ "$#" -eq 0 ]; then
  sources=(notes_*.md)
else
  sources=()
  for n in "$@"; do sources+=("notes_${n}.md"); done
fi

for src in "${sources[@]}"; do
  name="${src%.md}"
  html="$PWD/${name}.html"
  echo "Building ${name}.html and ${name}.pdf"
  "$PANDOC" "$src" \
    --standalone \
    --embed-resources \
    --css style.css \
    --syntax-highlighting=website.theme \
    --lua-filter=pairs.lua \
    --resource-path=.:.. \
    -o "$html"
  "$CHROME" --headless --disable-gpu --no-pdf-header-footer \
    --print-to-pdf="$PWD/${name}.pdf" "file://$html" 2>/dev/null
done
