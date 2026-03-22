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

cleanup_neovim_bootstrap() {
    local init_vim="$HOME/.config/nvim/init.vim"

    if [[ -f "$init_vim" ]] && \
       grep -qxF 'set runtimepath^=~/.vim runtimepath+=~/.vim/after' "$init_vim" && \
       grep -qxF 'let &packpath = &runtimepath' "$init_vim" && \
       grep -qxF 'source ~/.vimrc' "$init_vim"; then
        rm -f "$init_vim"
        log "Removed generated Neovim bootstrap: $init_vim"
    fi
}

cleanup_optional_components() {
    rm -rf "$HOME/.powerlevel10k"
    rm -rf "$HOME/.config/nvim/pack/github/start/copilot.vim"
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

    remove_if_symlink_to_repo "$HOME/.aliases"
    remove_if_symlink_to_repo "$HOME/.gitconfig"
    remove_if_symlink_to_repo "$HOME/.dircolors"
    remove_if_symlink_to_repo "$HOME/.vimrc"
    remove_if_symlink_to_repo "$HOME/.vimrc.plugs"
    remove_if_symlink_to_repo "$HOME/.zsh"
    remove_if_symlink_to_repo "$HOME/.bin"
    remove_if_symlink_to_repo "$HOME/.zshrc"
    remove_if_symlink_to_repo "$HOME/.tmux.conf"
    remove_if_symlink_to_repo "$HOME/.p10k.zsh"
    remove_if_symlink_to_repo "$HOME/.zprofile"

    cleanup_zshrc_entries
    cleanup_neovim_bootstrap
    cleanup_optional_components

    log "Uninstall complete."
}

main
