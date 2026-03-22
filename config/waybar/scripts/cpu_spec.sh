#!/usr/bin/env sh
set -eu

cpu_model=$(awk -F': ' '/model name/ {print $2; exit}' /proc/cpuinfo 2>/dev/null || true)
if [ -z "${cpu_model}" ]; then
  cpu_model="Unknown CPU"
fi

clean_cpu=$(printf '%s' "${cpu_model}" \
  | sed -E 's/\(R\)|\(TM\)| CPU| Processor//g; s/@.*$//; s/[[:space:]]+/ /g; s/^ //; s/ $//')

short_cpu=$(printf '%s' "${clean_cpu}" | grep -oE 'i[3579]-[0-9A-Za-z]+' | head -n 1 || true)
if [ -z "${short_cpu}" ]; then
  short_cpu=$(printf '%s' "${clean_cpu}" | grep -oE 'Ryzen [0-9] [0-9A-Za-z]+' | head -n 1 || true)
fi
if [ -z "${short_cpu}" ]; then
  short_cpu=$(printf '%s' "${clean_cpu}" | awk '{print $1" "$2}' || true)
fi
if [ -z "${short_cpu}" ]; then
  short_cpu="CPU"
fi

cpu_temp=""
if command -v sensors >/dev/null 2>&1; then
  cpu_temp=$(sensors 2>/dev/null \
    | awk '/Tctl:|Tdie:|Package id 0:|temp1:/ {gsub(/[^0-9.]/, "", $2); if ($2 != "") {print int($2); exit}}' || true)
fi

if [ -z "${cpu_temp}" ]; then
  for zone in /sys/class/thermal/thermal_zone*/temp; do
    [ -r "${zone}" ] || continue
    raw_temp=$(cat "${zone}" 2>/dev/null || true)
    case "${raw_temp}" in
      ''|*[!0-9]*) continue ;;
    esac
    if [ "${raw_temp}" -gt 1000 ]; then
      cpu_temp=$((raw_temp / 1000))
    else
      cpu_temp=${raw_temp}
    fi
    [ "${cpu_temp}" -gt 0 ] && break
  done
fi

if [ -z "${cpu_temp}" ]; then
  text_label=" --C"
  temp_class="unknown"
else
  text_label=$(printf ' %sC' "${cpu_temp}")
  if [ "${cpu_temp}" -ge 85 ]; then
    temp_class="hot"
  elif [ "${cpu_temp}" -ge 70 ]; then
    temp_class="warm"
  else
    temp_class="cool"
  fi
fi

esc_tooltip=$(printf '%s' "${clean_cpu}" | sed 's/\\/\\\\/g; s/"/\\"/g')
esc_text=$(printf '%s' "${text_label}" | sed 's/\\/\\\\/g; s/"/\\"/g')
full_tooltip=$(printf '%s (%s)' "${clean_cpu}" "${text_label}" | sed 's/\\/\\\\/g; s/"/\\"/g')
printf '{"text":"%s","tooltip":"%s","class":"%s"}\n' "${esc_text}" "${full_tooltip}" "${temp_class}"
