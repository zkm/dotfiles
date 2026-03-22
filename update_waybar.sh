#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="${REPO_DIR}/config/waybar"
DST_DIR="${HOME}/.config/waybar"

if [[ ! -d "${SRC_DIR}" ]]; then
  echo "Error: ${SRC_DIR} not found"
  exit 1
fi

mkdir -p "${DST_DIR}/scripts"

cp -f "${SRC_DIR}/config" "${DST_DIR}/config"
cp -f "${SRC_DIR}/style.css" "${DST_DIR}/style.css"

if compgen -G "${SRC_DIR}/scripts/*.sh" > /dev/null; then
  cp -f "${SRC_DIR}/scripts/"*.sh "${DST_DIR}/scripts/"
  chmod +x "${DST_DIR}/scripts/"*.sh
fi

pkill waybar >/dev/null 2>&1 || true
nohup waybar >/tmp/waybar.log 2>&1 &

echo "Waybar synced and reloaded."
echo "Log: /tmp/waybar.log"
