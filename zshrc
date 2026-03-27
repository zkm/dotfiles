# ==============================
# 🌟 Powerlevel10k Prompt Setup
# ==============================
# Ensure core system binaries are always available, even if PATH was inherited in a bad state.
export PATH="/usr/local/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${PATH}"

# Enable instant prompt for faster shell startup
if [[ -z "${ZSH_RELOADING:-}" ]] && [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# Load Powerlevel10k Theme & Config
source ~/.powerlevel10k/powerlevel10k.zsh-theme
[[ -f ~/.p10k.zsh ]] && source ~/.p10k.zsh

# ==============================
# 🔹 Load Custom Aliases
# ==============================
[[ -f ~/.aliases ]] && source ~/.aliases

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
export NVM_DIR="$HOME/.nvm"

path=(
  "$HOME/.local/bin"
  "$HOME/scripts"
  "$HOME/.config/composer/vendor/bin"
  "$RBENV_ROOT/bin"
  "$PYENV_ROOT/bin"
  "$BUN_INSTALL/bin"
  $path
)

# Initialize version managers once per shell to avoid duplicate hook setup on re-source.
if [[ -z "${__PYENV_INIT_DONE:-}" ]] && command -v pyenv >/dev/null 2>&1; then
  eval "$(pyenv init - zsh)"
  __PYENV_INIT_DONE=1
fi

if [[ -z "${__RBENV_INIT_DONE:-}" ]] && command -v rbenv >/dev/null 2>&1; then
  eval "$(rbenv init - zsh)"
  __RBENV_INIT_DONE=1
fi

# Lazy-load NVM on first use to keep shell startup fast.
_nvm_lazy_load() {
  unset -f nvm node npm npx corepack yarn pnpm
  [[ -s "$NVM_DIR/nvm.sh" ]] && source "$NVM_DIR/nvm.sh"
  [[ -s "$NVM_DIR/bash_completion" ]] && source "$NVM_DIR/bash_completion"
}

nvm() { _nvm_lazy_load; nvm "$@"; }
node() { _nvm_lazy_load; command node "$@"; }
npm() { _nvm_lazy_load; command npm "$@"; }
npx() { _nvm_lazy_load; command npx "$@"; }
corepack() { _nvm_lazy_load; command corepack "$@"; }
yarn() { _nvm_lazy_load; command yarn "$@"; }
pnpm() { _nvm_lazy_load; command pnpm "$@"; }

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
# Save the original prompt and dynamically update it
# to show [NORMAL] or [INSERT] based on Vi key mode.
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
