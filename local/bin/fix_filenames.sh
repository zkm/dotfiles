#!/bin/bash
# Usage: ./fix_filenames.sh <directory>

if [[ -z "$1" || ! -d "$1" ]]; then
  echo "Usage: $0 <directory>"
  exit 1
fi

find "$1" -depth | while IFS= read -r fname; do
  base="$(basename "$fname")"
  dir="$(dirname "$fname")"

  # Replace unicode punctuation with ASCII-safe equivalents and remove illegal chars
  safe_name="$(echo "$base" \
    | tr '[:cntrl:]' ' ' \
    | sed -e 's/[<>:"\/\\|?*\x27]/_/g' \
          -e 's/’/'\''/g' \
          -e 's/“/"/g' \
          -e 's/”/"/g' \
          -e 's/—/-/g' \
          -e 's/…/.../g' \
          -e 's/^ *//;s/ *$//;s/  */ /g')"

  if [[ "$base" != "$safe_name" ]]; then
    echo "Renaming: $base → $safe_name"
    mv -vn "$fname" "$dir/$safe_name"
  fi
done

