# ==============================
# 🌟 Powerlevel10k Prompt
# ==============================
# Enable instant prompt (should be at the top)
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# Load Powerlevel10k Theme
# source /usr/share/zsh-theme-powerlevel10k/powerlevel10k.zsh-theme
source ~/.powerlevel10k/powerlevel10k.zsh-theme

# Load P10K Config (if exists)
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

# ==============================
# 🔹 Aliases
# ==============================
# Load custom aliases if file exists
if [[ -f ~/.aliases ]]; then
  source ~/.aliases
fi

# ==============================
# 🛠 Environment Variables
# ==============================
export HSA_OVERRIDE_GFX_VERSION=10.3.0


# ==============================
# 🚀 PATH Configuration
# ==============================
# rbenv (Ruby Version Manager)
export PATH="$HOME/.rbenv/bin:$PATH"

# Node Version Manager (NVM)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Composer Global Bin (for Drush & PHP tools)
export PATH="$HOME/.config/composer/vendor/bin:$PATH"

# Add User Binaries (if exists)
[[ -d "$HOME/.local/bin" ]] && export PATH="$HOME/.local/bin:$PATH"


# ==============================
# 🛠 Utility Settings & Fixes
# ==============================
# Fix for Arch Linux Python package management (PEP 668)
export PIP_REQUIRE_VIRTUALENV=false

# Improve history behavior
HISTSIZE=10000
SAVEHIST=10000
HISTFILE=~/.zsh_history

# Auto-correct minor typos in commands
setopt correct

# Enable tab completion menu
autoload -Uz compinit && compinit

# Enable case-insensitive globbing (useful for ls, cd, etc.)
setopt nocaseglob

# ==============================
# ✅ Load NVM (last to avoid slow shell startup)
# ==============================
if command -v nvm &> /dev/null; then
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

export DRUSH_LAUNCHER_FALLBACK="/srv/http/drupal"

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
