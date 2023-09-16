# Enable Powerlevel10k instant prompt
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# History Configuration
HISTSIZE=10000
SAVEHIST=10000
HISTFILE=~/.cache/zsh/history

# Source aliases
[[ -f ~/.aliases ]] && source ~/.aliases

# Enable colored output from ls on FreeBSD-based systems
export CLICOLOR=1

# FZF Configuration
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
export PATH="/opt/homebrew/opt/openjdk/bin:$PATH"

# Powerlevel10k Theme
source ~/powerlevel10k/powerlevel10k.zsh-theme
source ~/.p10k.zsh

# Load NVM
export NVM_DIR="$HOME/.nvm"

# Load nvm.sh and nvm bash_completion
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Enable Zsh autocompletion
autoload -U compinit && compinit
zstyle ':completion:*' matcher-list 'r:|=*' 'm:{a-zA-Z}={A-Za-z}'

# 1Password (op) Command-Line Completion
eval "$(op completion zsh)"
compdef _op op

# Add RVM to PATH for scripting
export PATH="$PATH:$HOME/.rvm/bin"
