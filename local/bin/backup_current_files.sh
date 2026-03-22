#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: backup_current_files.sh [source_dir] [backup_dir]

Creates a timestamped snapshot of all current files from source_dir.
Files are copied into backup_dir/<timestamp>/ preserving directory structure.

Defaults:
  source_dir: current directory
  backup_dir: ./backups

Examples:
  backup_current_files.sh
  backup_current_files.sh "$HOME/.config" "$HOME/Backups/config-snapshots"
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

SOURCE_DIR="${1:-$PWD}"
BACKUP_DIR="${2:-$PWD/backups}"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Source directory does not exist: $SOURCE_DIR" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"

SOURCE_DIR_ABS="$(cd "$SOURCE_DIR" && pwd -P)"
BACKUP_DIR_ABS="$(cd "$BACKUP_DIR" && pwd -P)"
run_stamp="$(date +%Y%m%d_%H%M%S)"
SNAPSHOT_DIR="$BACKUP_DIR_ABS/$run_stamp"
mkdir -p "$SNAPSHOT_DIR"

copied=0

copy_file() {
  local file="$1"
  local rel_path target_path

  rel_path="${file#"$SOURCE_DIR_ABS"/}"

  # Guard in case find returns the root path itself.
  if [[ "$rel_path" == "$file" ]]; then
    rel_path="$(basename "$file")"
  fi

  target_path="$SNAPSHOT_DIR/$rel_path"
  mkdir -p "$(dirname "$target_path")"
  cp -a -- "$file" "$target_path"
  copied=$((copied + 1))
  echo "Backed up: $rel_path"
}

if [[ "$BACKUP_DIR_ABS" == "$SOURCE_DIR_ABS"* ]]; then
  while IFS= read -r -d '' file; do
    copy_file "$file"
  done < <(find "$SOURCE_DIR_ABS" \
    -path "$BACKUP_DIR_ABS" -prune -o \
    -type f -print0)
else
  while IFS= read -r -d '' file; do
    copy_file "$file"
  done < <(find "$SOURCE_DIR_ABS" -type f -print0)
fi

echo "Completed. Backed up $copied file(s) into $SNAPSHOT_DIR"
