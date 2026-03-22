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
# Prepend user and dev tools to PATH
export PATH="$HOME/.local/bin:$HOME/scripts:$HOME/.rbenv/bin:$HOME/.pyenv/bin:$HOME/.config/composer/vendor/bin:$PATH"

# Initialize rbenv
eval "$(rbenv init -)"

# Initialize pyenv
export PYENV_ROOT="$HOME/.pyenv"
eval "$(pyenv init --path)"

# Load NVM
export NVM_DIR="$HOME/.nvm"
[[ -s "$NVM_DIR/nvm.sh" ]] && source "$NVM_DIR/nvm.sh"
[[ -s "$NVM_DIR/bash_completion" ]] && source "$NVM_DIR/bash_completion"

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
autoload -Uz compinit && compinit  # Enable tab completion

# Keybindings (Vi-style editing)
bindkey -v
bindkey "^[[H" beginning-of-line
bindkey "^[[F" end-of-line

# ==============================
# 🎯 Vi Mode Prompt Indicator
# ==============================
# Save the original prompt and dynamically update it
# to show [NORMAL] or [INSERT] based on Vi key mode.
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
#THIS MUST BE AT THE END OF THE FILE FOR SDKMAN TO WORK!!!
export SDKMAN_DIR="$HOME/.sdkman"
[[ -s "$HOME/.sdkman/bin/sdkman-init.sh" ]] && source "$HOME/.sdkman/bin/sdkman-init.sh"
export SYSTEMD_EDITOR=vim

# bun completions
[ -s "$HOME/.bun/_bun" ] && source "$HOME/.bun/_bun"

# bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init - zsh)"
export RBENV_ROOT="$HOME/.rbenv"
[[ -d $RBENV_ROOT/bin ]] && export PATH="$RBENV_ROOT/bin:$PATH"
eval "$(rbenv init - zsh)"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
