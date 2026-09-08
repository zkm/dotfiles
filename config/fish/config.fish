# ==============================
# Custom Environment Variables
# ==============================
set -gx HSA_OVERRIDE_GFX_VERSION 10.3.0
set -gx DRUSH_LAUNCHER_FALLBACK /srv/http/drupal
set -gx PIP_REQUIRE_VIRTUALENV false

# ==============================
# PATH Configuration
# ==============================
set -gx PYENV_ROOT $HOME/.pyenv
set -gx RBENV_ROOT $HOME/.rbenv
set -gx BUN_INSTALL $HOME/.bun

# fish_add_path de-dupes and prepends; order here mirrors zshrc's path array.
fish_add_path -p $BUN_INSTALL/bin
fish_add_path -p $PYENV_ROOT/bin
fish_add_path -p $RBENV_ROOT/bin
fish_add_path -p $HOME/.config/composer/vendor/bin
fish_add_path -p $HOME/scripts
fish_add_path -p $HOME/.local/bin

# Ruby's own gem bindir (bundle, rspec, rake, etc.) — gem user-installs are
# pinned to ~/.local/bin by ~/.gemrc rather than the distro-default bindir.
if command -v ruby >/dev/null 2>&1
    fish_add_path -p (ruby -e 'print Gem.user_dir')/bin
end

# CachyOS ships its own fish greeting/config in some builds; nothing to
# re-source here the way zshrc does for cachyos-config.zsh — CachyOS's fish
# integration (if any) lives in /etc/fish/conf.d, which fish already sources
# on its own before this file.

# ==============================
# System summary banner (motd-forge)
# ==============================
# Shells out to local/bin/motd-banner.sh (a verbatim extraction of zshrc's
# _motd_distro_line/_motd_gradient) instead of re-implementing the same
# ANSI-escape/Nerd-Font-glyph logic natively in fish, since fish's quoted
# strings don't interpret \033 escapes the way bash's $'...' does — see that
# script's header comment.
if status is-interactive && command -v motd-forge >/dev/null 2>&1
    bash ~/.dotfiles/local/bin/motd-banner.sh
end

# ==============================
# Shell Prompt Setup
# ==============================
# Powerlevel10k is zsh-only, so PROMPT_BACKEND=p10k has no fish equivalent —
# starship is the only supported backend here.
if command -v starship >/dev/null 2>&1
    starship init fish | source
end

# ==============================
# Dircolors (ls colors)
# ==============================
# dircolors has no native fish output format; extract the LS_COLORS value
# from its Bourne-shell output instead of trying to `eval` POSIX syntax.
if command -v dircolors >/dev/null 2>&1
    set -l ls_colors (dircolors -b ~/.dotfiles/dircolors | string match -r "LS_COLORS='(.*)';" --groups-only)
    if test -n "$ls_colors"
        set -gx LS_COLORS $ls_colors
    end
end

# ==============================
# Load Custom Aliases
# ==============================
# Simple aliases/env live in conf.d/10-aliases.fish (auto-sourced by fish);
# the more involved functions live one-per-file in functions/ (autoloaded
# on first call, matching fish's normal lazy-load convention).

# Initialize version managers once per shell to avoid duplicate hook setup on re-source.
if not set -q __PYENV_INIT_DONE and command -v pyenv >/dev/null 2>&1
    pyenv init - fish | source
    set -g __PYENV_INIT_DONE 1
end

if not set -q __RBENV_INIT_DONE and command -v rbenv >/dev/null 2>&1
    rbenv init - fish | source
    set -g __RBENV_INIT_DONE 1
end

# ==============================
# Shell History & Behavior
# ==============================
# Fish's history is per-command and persists to ~/.local/share/fish/fish_history
# automatically — there's no HISTSIZE/SAVEHIST/HISTFILE equivalent to set.

# If the system does not have `less`, make git use a non-interactive pager.
if not command -v less >/dev/null 2>&1
    set -gx GIT_PAGER cat
end

# Keybindings: fish defaults to emacs-style; switch to vi-style to match
# the zsh/bash config (`bindkey -v`).
fish_vi_key_bindings

set -gx EDITOR nvim
set -gx VISUAL nvim
set -gx SYSTEMD_EDITOR nvim

# ghcup, bun completions (~/.bun/_bun), and SDKMAN all ship only bash/zsh
# init scripts upstream — there's no fish-native equivalent to source here,
# unlike pyenv/rbenv/mise which support `... init - fish` directly. If any
# of those tools get fish support later, add their init here.

# opencode
fish_add_path -p $HOME/.opencode/bin
fish_add_path -p $HOME/.local/bin

# mise (only if installed and actually runnable — some prebuilt binaries
# exist but fail to exec on ABI-mismatched systems, e.g. armhf/armel Pi)
if command -v mise >/dev/null 2>&1 && mise --version >/dev/null 2>&1
    mise activate fish | source
end

# Machine-specific aliases that won't be tracked in git.
if test -f $HOME/.config/fish/aliases.local.fish
    source $HOME/.config/fish/aliases.local.fish
end
