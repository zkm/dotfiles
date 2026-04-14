#!/usr/bin/env bash

# Keep PATH sane even when inherited from constrained environments.
export PATH="/usr/local/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${PATH}"

# Show system summary for interactive sessions when available.
if [[ $- == *i* ]] && command -v fastfetch >/dev/null 2>&1; then
  fastfetch
fi

# Dircolors
if [[ -f "$HOME/.dotfiles/dircolors" ]]; then
  eval "$(dircolors -b "$HOME/.dotfiles/dircolors")"
fi

# Shared aliases/functions for bash.
if [[ -f "$HOME/.bash_aliases" ]]; then
  source "$HOME/.bash_aliases"
fi

# Environment and PATH layering
export PYENV_ROOT="$HOME/.pyenv"
export RBENV_ROOT="$HOME/.rbenv"
export BUN_INSTALL="$HOME/.bun"
export NVM_DIR="$HOME/.nvm"

export PATH="$HOME/.local/bin:$HOME/scripts:$HOME/.config/composer/vendor/bin:$RBENV_ROOT/bin:$PYENV_ROOT/bin:$BUN_INSTALL/bin:$PATH"

# Initialize language/version managers when installed.
if command -v pyenv >/dev/null 2>&1; then
  eval "$(pyenv init - bash)"
fi

if command -v rbenv >/dev/null 2>&1; then
  eval "$(rbenv init - bash)"
fi

if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  source "$NVM_DIR/nvm.sh"
fi

if [[ -s "$NVM_DIR/bash_completion" ]]; then
  source "$NVM_DIR/bash_completion"
fi

if [[ -f "$HOME/.ghcup/env" ]]; then
  source "$HOME/.ghcup/env"
fi

export EDITOR=nvim
export VISUAL=nvim
export SYSTEMD_EDITOR=nvim

# Starship prompt (preferred cross-shell prompt backend).
if command -v starship >/dev/null 2>&1; then
  eval "$(starship init bash)"
fi
