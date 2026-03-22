# ==============================
# 🌟 Powerlevel10k Prompt Setup
# ==============================
# Enable instant prompt for faster shell startup
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
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

# Initialize version managers once.
if command -v pyenv >/dev/null 2>&1; then
  eval "$(pyenv init - zsh)"
fi

if command -v rbenv >/dev/null 2>&1; then
  eval "$(rbenv init - zsh)"
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
export SYSTEMD_EDITOR=vim

# bun completions
[ -s "$HOME/.bun/_bun" ] && source "$HOME/.bun/_bun"

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

# THIS MUST BE AT THE END OF THE FILE FOR SDKMAN TO WORK!!!
export SDKMAN_DIR="$HOME/.sdkman"
[[ -s "$HOME/.sdkman/bin/sdkman-init.sh" ]] && source "$HOME/.sdkman/bin/sdkman-init.sh"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
if command -v pyenv >/dev/null 2>&1; then eval "$(pyenv init - zsh)"; fi
[[ -d $RBENV_ROOT/bin ]] && export PATH="$RBENV_ROOT/bin:$PATH"
if command -v rbenv >/dev/null 2>&1; then eval "$(rbenv init - zsh)"; fi
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
