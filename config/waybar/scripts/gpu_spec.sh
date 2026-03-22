#!/usr/bin/env sh
set -eu

gpu_line=""
if command -v lspci >/dev/null 2>&1; then
  gpu_line=$(lspci 2>/dev/null | grep -E 'VGA compatible controller|3D controller|Display controller' | head -n 1 || true)
fi

if [ -z "${gpu_line}" ]; then
  gpu_model="Unknown GPU"
else
  gpu_model=$(printf '%s' "${gpu_line}" \
    | sed -E 's/^[0-9a-fA-F:.]+[[:space:]]+//; s/VGA compatible controller:[[:space:]]*//; s/3D controller:[[:space:]]*//; s/Display controller:[[:space:]]*//; s/Corporation//; s/[[:space:]]+/ /g; s/^ //; s/ $//')
fi

short_gpu=$(printf '%s' "${gpu_model}" | grep -oE 'RTX[[:space:]]*[0-9]{3,4}([[:space:]]*Ti)?|GTX[[:space:]]*[0-9]{3,4}([[:space:]]*Ti)?|RX[[:space:]]*[0-9]{3,4}[A-Z]*' | head -n 1 || true)
if [ -z "${short_gpu}" ]; then
  short_gpu=$(printf '%s' "${gpu_model}" | awk '{print $1" "$2" "$3}' || true)
fi
if [ -z "${short_gpu}" ]; then
  short_gpu="GPU"
fi

gpu_temp=""
for temp_file in /sys/class/drm/card*/device/hwmon/hwmon*/temp*_input; do
  [ -r "${temp_file}" ] || continue
  raw_temp=$(cat "${temp_file}" 2>/dev/null || true)
  case "${raw_temp}" in
    ''|*[!0-9]*) continue ;;
  esac
  if [ "${raw_temp}" -gt 1000 ]; then
    gpu_temp=$((raw_temp / 1000))
  else
    gpu_temp=${raw_temp}
  fi
  [ "${gpu_temp}" -gt 0 ] && break
done

if [ -z "${gpu_temp}" ] && command -v sensors >/dev/null 2>&1; then
  gpu_temp=$(sensors 2>/dev/null \
    | awk '/edge:|junction:|amdgpu-pci|GPU/ {for(i=1;i<=NF;i++){if($i ~ /\+[0-9]+(\.[0-9]+)?/){gsub(/[^0-9.]/, "", $i); print int($i); exit}}}' || true)
fi

if [ -z "${gpu_temp}" ]; then
  text_label="󰢮 --C"
  temp_class="unknown"
else
  text_label=$(printf '󰢮 %sC' "${gpu_temp}")
  if [ "${gpu_temp}" -ge 85 ]; then
    temp_class="hot"
  elif [ "${gpu_temp}" -ge 70 ]; then
    temp_class="warm"
  else
    temp_class="cool"
  fi
fi

esc_text=$(printf '%s' "${text_label}" | sed 's/\\/\\\\/g; s/"/\\"/g')
full_tooltip=$(printf '%s (%s)' "${gpu_model}" "${text_label}" | sed 's/\\/\\\\/g; s/"/\\"/g')
printf '{"text":"%s","tooltip":"%s","class":"%s"}\n' "${esc_text}" "${full_tooltip}" "${temp_class}"
