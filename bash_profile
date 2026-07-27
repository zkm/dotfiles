#!/usr/bin/env bash

# Restore the ~/bin and ~/.local/bin PATH entries that distro-stock
# .bash_profile/.profile files (Fedora/RHEL skel, Debian/Ubuntu skel) provide,
# since this file replaces those on setup.
if [ -d "$HOME/bin" ]; then
  PATH="$HOME/bin:$PATH"
fi

if [ -d "$HOME/.local/bin" ]; then
  PATH="$HOME/.local/bin:$PATH"
fi

export PATH

# Load interactive shell config for login shells.
if [[ -f "$HOME/.bashrc" ]]; then
  source "$HOME/.bashrc"
fi
