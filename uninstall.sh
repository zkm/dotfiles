#!/bin/bash

set -e

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"

log() {
    echo "$1"
}

remove_if_symlink_to_repo() {
    local path="$1"
    local target
    local abs_target

    if [[ ! -L "$path" ]]; then
        if [[ -e "$path" ]]; then
            log "Skipping non-symlink: $path"
        fi
        return
    fi

    target="$(readlink "$path")"
    if [[ "$target" == /* ]]; then
        abs_target="$target"
    else
        abs_target="$(cd "$(dirname "$path")" && cd "$(dirname "$target")" && pwd -P)/$(basename "$target")"
    fi

    case "$abs_target" in
        "$repo_root"/*)
            rm -f "$path"
            log "Removed symlink: $path"
            ;;
        *)
            log "Skipping symlink not managed by this repo: $path -> $abs_target"
            ;;
    esac
}

remove_exact_line() {
    local file="$1"
    local line="$2"
    local tmp_file

    if [[ ! -f "$file" ]]; then
        return
    fi

    tmp_file="${file}.tmp.$$"
    awk -v bad="$line" '$0 != bad' "$file" > "$tmp_file"
    mv "$tmp_file" "$file"
}

cleanup_zshrc_entries() {
    local zshrc="$HOME/.zshrc"

    remove_exact_line "$zshrc" 'export PYENV_ROOT="$HOME/.pyenv"'
    remove_exact_line "$zshrc" '[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"'
    remove_exact_line "$zshrc" 'eval "$(pyenv init - zsh)"'

    remove_exact_line "$zshrc" 'export RBENV_ROOT="$HOME/.rbenv"'
    remove_exact_line "$zshrc" '[[ -d $RBENV_ROOT/bin ]] && export PATH="$RBENV_ROOT/bin:$PATH"'
    remove_exact_line "$zshrc" 'eval "$(rbenv init - zsh)"'

    remove_exact_line "$zshrc" 'export NVM_DIR="$HOME/.nvm"'
    remove_exact_line "$zshrc" '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"'
    remove_exact_line "$zshrc" '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"'

    remove_exact_line "$zshrc" 'source ~/.powerlevel10k/powerlevel10k.zsh-theme'
}

uninstall_homebrew_packages() {
    if ! command -v brew >/dev/null 2>&1; then
        log "Homebrew not found. Skipping."
        return
    fi

    local formulae
    local casks
    formulae="$(brew list --formula 2>/dev/null)"
    casks="$(brew list --cask 2>/dev/null)"

    if [[ -z "$formulae" && -z "$casks" ]]; then
        log "No Homebrew packages installed. Skipping."
        return
    fi

    log "The following Homebrew formulae will be removed:"
    echo "${formulae:-  (none)}"
    log "The following Homebrew casks will be removed:"
    echo "${casks:-  (none)}"

    read -r -p "Uninstall all Homebrew packages listed above? [y/N] " answer
    case "$answer" in
        [yY]|[yY][eE][sS]) ;;
        *) log "Skipping Homebrew package removal."; return ;;
    esac

    if [[ -n "$formulae" ]]; then
        # shellcheck disable=SC2086
        brew uninstall --force $formulae 2>/dev/null || true
    fi
    if [[ -n "$casks" ]]; then
        # shellcheck disable=SC2086
        brew uninstall --cask --force $casks 2>/dev/null || true
    fi

    log "Homebrew packages removed."
}

cleanup_optional_components() {
    rm -rf "$HOME/.powerlevel10k"
    rm -rf "$HOME/.nvm"

    if [[ "$(uname)" == "Darwin" ]]; then
        rm -f "$HOME"/Library/Fonts/MesloLGS* "$HOME"/Library/Fonts/FiraCode* "$HOME"/Library/Fonts/Fira\ Code* 2>/dev/null || true
    else
        rm -rf "$HOME/.local/share/fonts/Fira_Code"
        rm -rf "$HOME/.local/share/fonts/MesloLGS_NF"
        if command -v fc-cache >/dev/null 2>&1; then
            fc-cache -f >/dev/null 2>&1 || true
        fi
    fi
}

main() {
    log "Uninstalling dotfiles setup managed by this repo..."
    local kde_config

    remove_if_symlink_to_repo "$HOME/.aliases"
    remove_if_symlink_to_repo "$HOME/.gitconfig"
    remove_if_symlink_to_repo "$HOME/.dircolors"
    remove_if_symlink_to_repo "$HOME/.zsh"
    remove_if_symlink_to_repo "$HOME/.bin"
    if [[ -d "$repo_root/local/share/applications" ]]; then
        mkdir -p "$HOME/.local/share/applications"
        local desktop_entry
        for desktop_entry in "$repo_root"/local/share/applications/*.desktop; do
            [[ -e "$desktop_entry" ]] || continue
            remove_if_symlink_to_repo "$HOME/.local/share/applications/$(basename "$desktop_entry")"
        done
        if command -v update-desktop-database >/dev/null 2>&1; then
            update-desktop-database "$HOME/.local/share/applications" >/dev/null 2>&1 || true
        fi
    fi
    remove_if_symlink_to_repo "$HOME/.zshrc"
    remove_if_symlink_to_repo "$HOME/.tmux.conf"
    remove_if_symlink_to_repo "$HOME/.p10k.zsh"
    remove_if_symlink_to_repo "$HOME/.zprofile"
    remove_if_symlink_to_repo "$HOME/.zlogin"
    remove_if_symlink_to_repo "$HOME/.config/hypr"
    remove_if_symlink_to_repo "$HOME/.config/kitty"
    for kde_config in \
        dolphinrc \
        kcminputrc \
        kdeglobals \
        kwinrc \
        mimeapps.list \
        plasma-org.kde.plasma.desktop-appletsrc \
        plasmarc; do
        remove_if_symlink_to_repo "$HOME/.config/$kde_config"
    done

    cleanup_zshrc_entries
    cleanup_optional_components

    if [[ "$(uname)" == "Darwin" ]]; then
        uninstall_homebrew_packages
    fi

    log "Uninstall complete."
}

main
