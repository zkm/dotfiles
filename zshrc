# ==============================
# 🛠 Custom Environment Variables
# ==============================
export HSA_OVERRIDE_GFX_VERSION=10.3.0
export DRUSH_LAUNCHER_FALLBACK="/srv/http/drupal"
export PIP_REQUIRE_VIRTUALENV=false

# ==============================
# 🚀 PATH Configuration
# ==============================
# Keep PATH unique and stable across repeated shell loads.
typeset -U path PATH
export PYENV_ROOT="$HOME/.pyenv"
export RBENV_ROOT="$HOME/.rbenv"
export BUN_INSTALL="$HOME/.bun"

path=(
  "$HOME/.local/bin"
  "$HOME/scripts"
  "$HOME/.config/composer/vendor/bin"
  "$RBENV_ROOT/bin"
  "$PYENV_ROOT/bin"
  "$BUN_INSTALL/bin"
  $path
)

# Print system summary before instant prompt to avoid p10k console I/O warnings.
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

if [[ -o interactive ]] && command -v motd-forge >/dev/null 2>&1; then
  _motd_distro_line
  motd-forge | _motd_gradient
fi

# ==============================
# Shell Prompt Setup
# ==============================
# Prompt backend selector.
# Set PROMPT_BACKEND=p10k to opt into Powerlevel10k.
PROMPT_BACKEND="${PROMPT_BACKEND:-starship}"

if [[ "$PROMPT_BACKEND" == "p10k" ]]; then
  [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]] && source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
  [[ -f ~/.powerlevel10k/powerlevel10k.zsh-theme ]] && source ~/.powerlevel10k/powerlevel10k.zsh-theme
  if [[ -f ~/.p10k.zsh ]]; then
    source ~/.p10k.zsh
  elif [[ -f ~/.dotfiles/p10k.zsh ]]; then
    source ~/.dotfiles/p10k.zsh
  fi
elif command -v starship >/dev/null 2>&1; then
  eval "$(starship init zsh)"
elif [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
  [[ -f ~/.powerlevel10k/powerlevel10k.zsh-theme ]] && source ~/.powerlevel10k/powerlevel10k.zsh-theme
  if [[ -f ~/.p10k.zsh ]]; then
    source ~/.p10k.zsh
  elif [[ -f ~/.dotfiles/p10k.zsh ]]; then
    source ~/.dotfiles/p10k.zsh
  fi
fi

# ==============================
# 🎨 Dircolors (ls colors)
# ==============================
eval "$(dircolors -b ~/.dotfiles/dircolors)"

# ==============================
# 🔹 Load Custom Aliases
# ==============================
[[ -f ~/.aliases ]] && source ~/.aliases


alias icat='kitten icat'
alias icat-clear='kitten icat --clear'

# Initialize version managers once per shell to avoid duplicate hook setup on re-source.
if [[ -z "${__PYENV_INIT_DONE:-}" ]] && command -v pyenv >/dev/null 2>&1; then
  eval "$(pyenv init - zsh)"
  __PYENV_INIT_DONE=1
fi

if [[ -z "${__RBENV_INIT_DONE:-}" ]] && command -v rbenv >/dev/null 2>&1; then
  eval "$(rbenv init - zsh)"
  __RBENV_INIT_DONE=1
fi

# ==============================
# ⚙️ Zsh Behavior & Input Settings
# ==============================
# Shell history settings
HISTSIZE=10000
SAVEHIST=10000
HISTFILE=~/.zsh_history

# Shell options
setopt correct         # Auto-correct minor typos in commands
setopt nocaseglob      # Enable case-insensitive globbing

# If the system does not have `less`, make git use a non-interactive pager.
if ! command -v less >/dev/null 2>&1; then
  export GIT_PAGER=cat
fi

autoload -Uz compinit
zcompdump_file="${XDG_CACHE_HOME:-$HOME/.cache}/zcompdump-$ZSH_VERSION"
zcompdump_mtime="$(stat -c %Y "$zcompdump_file" 2>/dev/null || echo 0)"
# Use cached completions for fast startup; refresh once per day.
if [[ -f "$zcompdump_file" ]] && (( EPOCHSECONDS - zcompdump_mtime < 86400 )); then
  compinit -C -d "$zcompdump_file"
else
  compinit -d "$zcompdump_file"
fi

# Keybindings (Vi-style editing)
bindkey -v
bindkey "^[[H" beginning-of-line
bindkey "^[[F" end-of-line

# ==============================
# 🎯 Vi Mode Prompt Indicator
# ==============================
# Keep this lightweight indicator only for Starship.
# p10k has native vi mode support in its own config.
if [[ "$PROMPT_BACKEND" == "starship" ]]; then
  : "${ORIGINAL_PROMPT:=$PROMPT}"
  function zle-keymap-select {
    case $KEYMAP in
      vicmd)
        PROMPT="%F{green}[NORMAL]%f $ORIGINAL_PROMPT"
        ;;
      main|viins)
        PROMPT="%F{blue}[INSERT]%f $ORIGINAL_PROMPT"
        ;;
    esac
    zle reset-prompt
  }

  zle -N zle-keymap-select
fi

[ -f "$HOME/.ghcup/env" ] && . "$HOME/.ghcup/env" # ghcup-env
export EDITOR=nvim
export VISUAL=nvim
export SYSTEMD_EDITOR=nvim

# bun completions
[ -s "$HOME/.bun/_bun" ] && source "$HOME/.bun/_bun"

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

# SDKMAN is lazy-loaded on first use to keep startup fast and avoid reload edge cases.
export SDKMAN_DIR="$HOME/.sdkman"
_sdkman_lazy_load() {
  if [[ -n "${__SDKMAN_INIT_DONE:-}" ]]; then
    return 0
  fi

  if [[ -s "$SDKMAN_DIR/bin/sdkman-init.sh" ]]; then
    source "$SDKMAN_DIR/bin/sdkman-init.sh"
    __SDKMAN_INIT_DONE=1
    return 0
  fi

  echo "SDKMAN init script not found: $SDKMAN_DIR/bin/sdkman-init.sh" >&2
  return 1
}

sdk() {
  local -a _sdk_args=("$@")
  _sdkman_lazy_load || return 1

  if [[ -n "${__SDKMAN_WRAPPER_BYPASS:-}" ]]; then
    echo "SDKMAN failed to initialize correctly." >&2
    return 1
  fi

  __SDKMAN_WRAPPER_BYPASS=1
  sdk "${_sdk_args[@]}"
  local _sdk_rc=$?
  unset __SDKMAN_WRAPPER_BYPASS
  return $_sdk_rc
}

# opencode
export PATH=$HOME/.opencode/bin:$PATH
export PATH="$HOME/.local/bin:$PATH"

# ruby user-installed gems (bundle, rspec, rake, etc.)
command -v ruby >/dev/null 2>&1 && export PATH="$(ruby -e 'print Gem.user_dir')/bin:$PATH"

# mise (only if installed)
command -v mise >/dev/null 2>&1 && eval "$(mise activate zsh)"
