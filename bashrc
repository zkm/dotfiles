#!/usr/bin/env bash

# ===== Base Shell Environment =====
# Keep PATH sane even when inherited from constrained environments.
export PATH="/usr/local/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${PATH}"

# Show system summary for interactive sessions when available.
if [[ $- == *i* ]] && command -v fastfetch >/dev/null 2>&1; then
  fastfetch
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
export NVM_DIR="$HOME/.nvm"

export PATH="$HOME/.local/bin:$HOME/scripts:$HOME/.config/composer/vendor/bin:$PATH"

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

if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  source "$NVM_DIR/nvm.sh"
fi

if [[ -s "$NVM_DIR/bash_completion" ]]; then
  source "$NVM_DIR/bash_completion"
fi

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
