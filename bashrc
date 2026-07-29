#!/usr/bin/env bash

# ===== Base Shell Environment =====
# Keep PATH sane even when inherited from constrained environments.
export PATH="/usr/local/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${PATH}"

# $HOME/.local/bin (gem user-installs, incl. motd-forge below, are pinned
# there by ~/.gemrc) and ruby's own gem bindir (bundle, rspec, rake, etc.) —
# must run before the motd-forge invocation below, which needs it on PATH
# already.
export PATH="$HOME/.local/bin:$PATH"
command -v ruby >/dev/null 2>&1 && export PATH="$(ruby -e 'print Gem.user_dir')/bin:$PATH"

# Show system summary for interactive sessions when available.
# motd-forge has no built-in color/distro support (v0.1.0: title + uptime/disk/mem +
# quote only), so draw a boxed, icon'd distro header and gradient-tint the banner
# ourselves. Icons are Nerd Font glyphs (U+F303/F31B/F306/F30A/F179) — need a
# patched font in the terminal, which every terminal config in this repo sets up.
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

if [[ $- == *i* ]] && command -v motd-forge >/dev/null 2>&1; then
  _motd_distro_line
  motd-forge | _motd_gradient
fi

# ===== Shell Cosmetics and Aliases =====
# Dircolors
if [[ -f "$HOME/.dotfiles/dircolors" ]]; then
  eval "$(dircolors -b "$HOME/.dotfiles/dircolors")"
fi

# Shared aliases/functions across shells.
if [[ -f "$HOME/.aliases" ]]; then
  source "$HOME/.aliases"
fi

# Bash-specific aliases/functions.
if [[ -f "$HOME/.bash_aliases" ]]; then
  source "$HOME/.bash_aliases"
fi

# ===== PATH and Runtime Managers =====
# Helper: prepend a directory to PATH only when it exists.
add_path_if_dir() {
  local dir="$1"
  if [[ -d "$dir" ]]; then
    export PATH="$dir:$PATH"
  fi
}

# Environment roots and base PATH layering.
export PYENV_ROOT="$HOME/.pyenv"
export RBENV_ROOT="$HOME/.rbenv"
export BUN_INSTALL="$HOME/.bun"

export PATH="$HOME/scripts:$HOME/.config/composer/vendor/bin:$PATH"

# Optional runtime manager bins.
add_path_if_dir "$RBENV_ROOT/bin"
add_path_if_dir "$PYENV_ROOT/bin"
add_path_if_dir "$BUN_INSTALL/bin"

# Initialize language/version managers when installed.
if command -v pyenv >/dev/null 2>&1; then
  eval "$(pyenv init - bash)"
fi

if command -v rbenv >/dev/null 2>&1; then
  eval "$(rbenv init - bash)"
fi

# mise (only if installed and actually runnable — some prebuilt binaries
# exist but fail to exec on ABI-mismatched systems, e.g. armhf/armel Pi)
command -v mise >/dev/null 2>&1 && mise --version >/dev/null 2>&1 && eval "$(mise activate bash)"

if [[ -f "$HOME/.ghcup/env" ]]; then
  source "$HOME/.ghcup/env"
fi

# ===== Editor Defaults =====
# Choose the first available editor.
for _editor in nvim vim vi nano; do
  if command -v "$_editor" >/dev/null 2>&1; then
    export EDITOR="$_editor"
    export VISUAL="$_editor"
    export SYSTEMD_EDITOR="$_editor"
    break
  fi
done
unset _editor

# ===== Prompt =====
# Prompt backend selector.
# Bash supports Starship; set PROMPT_BACKEND=none to disable prompt init.
PROMPT_BACKEND="${PROMPT_BACKEND:-starship}"
if [[ "$PROMPT_BACKEND" == "starship" ]] && command -v starship >/dev/null 2>&1; then
  eval "$(starship init bash)"
fi

# ===== Optional Local Tools =====
# Optional user-local tool bins.
add_path_if_dir "$HOME/.opencode/bin"
add_path_if_dir "$HOME/.cargo/bin"
