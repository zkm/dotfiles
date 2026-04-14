#!/usr/bin/env bash

alias c="clear"
alias l="ls -la"
alias ll="ls -l"
alias la="ls -A"

unalias ls ll la l 2>/dev/null

if command -v eza >/dev/null 2>&1; then
  ls() {
    local arg
    for arg in "$@"; do
      if [[ "$arg" == -*s* ]] || [[ "$arg" == *--sort* ]]; then
        command ls --color=auto "$@"
        return
      fi
    done
    eza --icons --group-directories-first "$@"
  }
  alias l='eza --icons --group-directories-first --all'
  alias ll='eza -lh --icons --group-directories-first'
  alias la='eza -la --icons --group-directories-first'
  alias lt='eza -la --icons --group-directories-first --sort=modified'
  alias lat='eza -la --icons --group-directories-first --sort=modified'
  alias tree='eza --tree --icons --group-directories-first'
else
  alias ls='ls --color=auto'
  alias ll='ls --color=auto -l'
  alias la='ls --color=auto -la'
  alias lt='ls --sort=time'
  alias lat='ls --color=auto -la --sort=time'
fi

alias work="cd ~/Documents/work/"
alias dev="cd ~/Developer/"
alias ..="cd .."
alias ...="cd ../.."

if command -v zoxide >/dev/null 2>&1; then
  eval "$(zoxide init bash --cmd j)"
fi

vim() {
  if command -v nvim >/dev/null 2>&1; then
    command nvim "$@"
  elif command -v vim >/dev/null 2>&1; then
    command vim "$@"
  else
    echo "No nvim or vim installed." >&2
    return 1
  fi
}

vi() {
  if command -v nvim >/dev/null 2>&1; then
    command nvim "$@"
  else
    vim "$@"
  fi
}

alias v='nvim'

if command -v bat >/dev/null 2>&1; then
  alias catp='bat --style=plain --paging=never'
  alias preview='bat --style=numbers --color=always --paging=never'
else
  alias catp='cat'
  alias preview='cat -n'
fi

if command -v rg >/dev/null 2>&1; then
  alias search='rg --smart-case --hidden --glob "!.git"'
fi

if ! command -v fd >/dev/null 2>&1 && command -v fdfind >/dev/null 2>&1; then
  fd() {
    command fdfind "$@"
  }
fi

if command -v fd >/dev/null 2>&1; then
  alias ff='fd --hidden --follow --exclude .git'
fi

if command -v jq >/dev/null 2>&1; then
  alias json='jq .'
fi

if command -v btop >/dev/null 2>&1; then
  alias bt='btop'
fi

neofetch() {
  if command -v fastfetch >/dev/null 2>&1; then
    fastfetch "$@"
  elif command -v neofetch >/dev/null 2>&1; then
    command neofetch "$@"
  else
    echo "Neither fastfetch nor neofetch is installed." >&2
    return 1
  fi
}

alias reload='exec "$SHELL" -l'
