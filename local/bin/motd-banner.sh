#!/usr/bin/env bash
# Extracted verbatim from zshrc's motd banner block so fish (which has no
# native way to reuse a bash function without re-deriving its escape-sequence
# and Nerd Font glyph handling) can shell out to it instead of re-implementing
# the same ANSI art in fish syntax, where quoted strings don't interpret 
# escapes the way bash's $'...' does. Keep this in sync with zshrc/bashrc's
# copies if you change the banner.

_motd_distro_line() {
  local icon name id info color reset=$'\033[0m' bold=$'\033[1m' label width border
  if [[ "$(uname)" == "Darwin" ]]; then
    name="$(sw_vers -productName) $(sw_vers -productVersion)"
    icon=$''; color=$'\033[38;5;253m'
  elif [[ -r /etc/os-release ]]; then
    info="$(. /etc/os-release 2>/dev/null && printf '%s|%s' "${PRETTY_NAME:-$NAME}" "$ID")"
    name="${info%%|*}"
    id="${info##*|}"
    case "$id" in
      arch) icon=$''; color=$'\033[38;5;39m' ;;
      ubuntu) icon=$''; color=$'\033[38;5;208m' ;;
      debian) icon=$''; color=$'\033[38;5;196m' ;;
      fedora) icon=$''; color=$'\033[38;5;27m' ;;
      *) icon=$''; color=$'\033[38;5;83m' ;;
    esac
  else
    return
  fi
  label=" ${icon}  ${name} "
  width=${#label}
  border=$(printf '─%.0s' $(seq 1 "$width"))
  printf '%s%s╭%s╮\n│%s│\n╰%s╯%s\n' "$bold" "$color" "$border" "$label" "$border" "$reset"
}

# Cycles a blue->cyan palette per line so the banner reads as a gradient
# instead of a flat tint (color persists across newlines until the reset),
# and turns motd-forge's "Disk: NN% used | Mem: A/B (NN%)" stats line into
# mini bar graphs since the gem only prints bare numbers.
_motd_gradient() {
  awk '
    function bar(pct,    filled, i, s) {
      filled = int((pct + 5) / 10)
      if (filled > 10) filled = 10
      if (filled < 0) filled = 0
      s = ""
      for (i = 0; i < filled; i++) s = s "█"
      for (i = filled; i < 10; i++) s = s "░"
      return s
    }
    function paint(s) { printf "\033[1;38;5;%sm%s\033[0m\n", c[n % 4], s; n++ }
    BEGIN { c[0] = 39; c[1] = 45; c[2] = 51; c[3] = 87; n = 0 }
    /^Uptime: / {
      split($0, parts, /\|/)
      for (i in parts) gsub(/^ +| +$/, "", parts[i])
      uptime = parts[1]; sub(/^Uptime: */, "", uptime)
      split(parts[2], dparts, " ")
      split(parts[3], mparts, " ")
      dpct = dparts[2]; mpctraw = mparts[3]
      if (dpct ~ /^[0-9]+%$/ && mpctraw ~ /^\([0-9]+%\)$/) {
        sub(/%/, "", dpct); dpct += 0
        gsub(/[()%]/, "", mpctraw); mpct = mpctraw + 0
        paint(sprintf("%-8s%s", "Uptime", uptime))
        paint(sprintf("%-8s[%s] %d%%", "Disk", bar(dpct), dpct))
        paint(sprintf("%-8s[%s] %d%% (%s)", "Mem", bar(mpct), mpct, mparts[2]))
        next
      }
    }
    { paint($0) }
  '
}

_motd_distro_line
motd-forge | _motd_gradient
