#!/usr/bin/env sh
set -eu

location="${WEATHER_LOCATION:-}"
if [ -n "${location}" ]; then
  location_enc=$(printf '%s' "${location}" | sed 's/ /%20/g')
  url="https://wttr.in/${location_enc}?u&format=%l|%C|%t"
else
  url="https://wttr.in/?u&format=%l|%C|%t"
fi

raw=""
if command -v curl >/dev/null 2>&1; then
  raw=$(curl -A "waybar-weather/1.0" -fsS --max-time 6 "${url}" || true)
elif command -v wget >/dev/null 2>&1; then
  raw=$(wget -qO- --timeout=6 "${url}" || true)
fi

if [ -z "${raw}" ]; then
  printf '{"text":"WX --","tooltip":"Weather unavailable"}\n'
  exit 0
fi

loc=$(printf '%s' "${raw}" | cut -d'|' -f1)
cond=$(printf '%s' "${raw}" | cut -d'|' -f2)
temp=$(printf '%s' "${raw}" | cut -d'|' -f3)

temp_clean=$(printf '%s' "${temp}" | sed -E 's/\+//g; s/°C/C/g; s/°F/F/g; s/[[:space:]]+/ /g; s/^ //; s/ $//')
cond_clean=$(printf '%s' "${cond}" | sed -E 's/[[:space:]]+/ /g; s/^ //; s/ $//')
loc_clean=$(printf '%s' "${loc}" | sed -E 's/[[:space:]]+/ /g; s/^ //; s/ $//')

cond_lc=$(printf '%s' "${cond_clean}" | tr '[:upper:]' '[:lower:]')
weather_icon="󰖐"
case "${cond_lc}" in
  *sun*|*clear*) weather_icon="󰖙" ;;
  *partly*cloud*|*few*cloud*) weather_icon="󰖕" ;;
  *cloud*|*overcast*) weather_icon="󰖐" ;;
  *rain*|*drizzle*|*shower*) weather_icon="󰖗" ;;
  *thunder*|*storm*) weather_icon="󰖓" ;;
  *snow*|*sleet*|*blizzard*) weather_icon="󰖘" ;;
  *fog*|*mist*|*haze*) weather_icon="󰖑" ;;
  *wind*) weather_icon="󰖝" ;;
esac

if [ -z "${temp_clean}" ]; then
  text_label="${weather_icon} --"
  weather_class="unknown"
else
  text_label=$(printf '%s %s' "${weather_icon}" "${temp_clean}")
  temp_num=$(printf '%s' "${temp_clean}" | sed -E 's/[^0-9-]//g')
  if [ -n "${temp_num}" ] && [ "${temp_num}" -ge 85 ] 2>/dev/null; then
    weather_class="hot"
  elif [ -n "${temp_num}" ] && [ "${temp_num}" -le 35 ] 2>/dev/null; then
    weather_class="cold"
  else
    weather_class="mild"
  fi
fi

tooltip_label=$(printf '%s: %s %s' "${loc_clean}" "${cond_clean}" "${temp_clean}" | sed -E 's/[[:space:]]+/ /g; s/^ //; s/ $//')

esc_text=$(printf '%s' "${text_label}" | sed 's/\\/\\\\/g; s/"/\\"/g')
esc_tooltip=$(printf '%s' "${tooltip_label}" | sed 's/\\/\\\\/g; s/"/\\"/g')
printf '{"text":"%s","tooltip":"%s","class":"%s"}\n' "${esc_text}" "${esc_tooltip}" "${weather_class}"
