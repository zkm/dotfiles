# ==============================
# 🌟 Powerlevel10k Prompt Setup
# ==============================
# Enable instant prompt for faster shell startup
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# Load Powerlevel10k theme and config
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

# Load NVM if available
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
# Show [NORMAL] or [INSERT] in the prompt based on current Vi mode.
# Requires setting $ORIGINAL_PROMPT (can be integrated with P10K).

ORIGINAL_PROMPT=$PROMPT

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

# Initialize correct prompt state on shell startup
function zle-line-init {
  zle-keymap-select
}
zle -N zle-line-init
