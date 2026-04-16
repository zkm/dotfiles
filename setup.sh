#!/bin/bash

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SHELL_MODE_RESOLVED=""
HYPRLAND_SETUP_DECIDED=""
HYPRLAND_SETUP_ENABLED="0"

run_nonfatal() {
    local step_name="$1"
    shift

    if ! "$@"; then
        echo "Warning: ${step_name} failed. Continuing setup..."
    fi
}

is_interactive_tty() {
    [[ -t 0 && -t 1 ]]
}

bool_is_true() {
    case "${1:-}" in
        1|true|TRUE|yes|YES|y|Y|on|ON)
            return 0
            ;;
    esac

    return 1
}

bool_is_false() {
    case "${1:-}" in
        0|false|FALSE|no|NO|n|N|off|OFF)
            return 0
            ;;
    esac

    return 1
}

detect_current_shell_mode() {
    case "$SHELL" in
        */zsh)
            echo "zsh"
            ;;
        */fish)
            echo "fish"
            ;;
        *)
            echo "bash"
            ;;
    esac
}

shell_mode_prompt_decision() {
    local default_shell answer
    default_shell="$(detect_current_shell_mode)"

    while true; do
        echo "Choose your default shell:"
        echo "  1) bash"
        echo "  2) zsh"
        echo "  3) fish"
        echo "Press Enter to keep the current shell (${default_shell})."
        read -r answer

        case "${answer:-}" in
            "")
                SHELL_MODE_RESOLVED="$default_shell"
                return 0
                ;;
            1|bash|BASH)
                SHELL_MODE_RESOLVED="bash"
                return 0
                ;;
            2|zsh|ZSH)
                SHELL_MODE_RESOLVED="zsh"
                return 0
                ;;
            3|fish|FISH)
                SHELL_MODE_RESOLVED="fish"
                return 0
                ;;
            *)
                echo "Invalid selection '$answer'. Choose bash, zsh, or fish."
                ;;
        esac
    done
}

resolve_shell_mode() {
    if [[ -n "$SHELL_MODE_RESOLVED" ]]; then
        return 0
    fi

    local requested
    requested="${SHELL_MODE:-auto}"

    case "$requested" in
        zsh|ZSH)
            SHELL_MODE_RESOLVED="zsh"
            ;;
        bash|BASH)
            SHELL_MODE_RESOLVED="bash"
            ;;
        fish|FISH)
            SHELL_MODE_RESOLVED="fish"
            ;;
        auto|AUTO|"")
            if is_interactive_tty; then
                shell_mode_prompt_decision
            else
                SHELL_MODE_RESOLVED="$(detect_current_shell_mode)"
            fi
            ;;
        *)
            echo "Unknown SHELL_MODE='$requested'. Falling back to auto detection."
            if is_interactive_tty; then
                shell_mode_prompt_decision
            else
                SHELL_MODE_RESOLVED="$(detect_current_shell_mode)"
            fi
            ;;
    esac
}

shell_mode_is() {
    local expected="$1"
    resolve_shell_mode
    [[ "$SHELL_MODE_RESOLVED" == "$expected" ]]
}

should_use_zsh() {
    shell_mode_is "zsh"
}

should_use_fish() {
    shell_mode_is "fish"
}

hyprland_prompt_decision() {
    local answer
    echo "Would you like to install/setup Hyprland? [y/N]"
    read -r answer

    if bool_is_true "$answer"; then
        return 0
    fi

    return 1
}

decide_hyprland_setup() {
    if [[ -n "$HYPRLAND_SETUP_DECIDED" ]]; then
        [[ "$HYPRLAND_SETUP_ENABLED" == "1" ]]
        return $?
    fi

    HYPRLAND_SETUP_DECIDED="1"

    if [[ "$(uname)" == "Darwin" ]]; then
        HYPRLAND_SETUP_ENABLED="0"
        return 1
    fi

    if bool_is_true "${INSTALL_HYPRLAND:-}"; then
        HYPRLAND_SETUP_ENABLED="1"
        return 0
    fi

    if bool_is_false "${INSTALL_HYPRLAND:-}"; then
        HYPRLAND_SETUP_ENABLED="0"
        return 1
    fi

    case "${INSTALL_HYPRLAND:-auto}" in
        auto|AUTO|"")
            ;;
        *)
            echo "Unrecognized INSTALL_HYPRLAND value '${INSTALL_HYPRLAND}'. Use auto, 1, or 0."
            HYPRLAND_SETUP_ENABLED="0"
            return 1
            ;;
    esac

    if is_interactive_tty; then
        if hyprland_prompt_decision; then
            HYPRLAND_SETUP_ENABLED="1"
            return 0
        fi

        HYPRLAND_SETUP_ENABLED="0"
        return 1
    fi

    echo "Skipping Hyprland setup (non-interactive mode)."
    echo "To force install, run: INSTALL_HYPRLAND=1 ./setup.sh"
    HYPRLAND_SETUP_ENABLED="0"
    return 1
}

set_default_shell() {
    local shell_name="$1"
    local shell_path

    echo "Setting shell to ${shell_name}..."

    shell_path="$(command -v "$shell_name" 2>/dev/null || true)"
    if [[ -z "$shell_path" ]]; then
        echo "${shell_name} is not installed or not in PATH. Skipping shell change."
        return 0
    fi

    if ! chsh -s "$shell_path"; then
        echo "Could not change shell automatically."
        echo "Run this manually after setup: chsh -s $shell_path"
    fi
}

function setup_shell() {
    resolve_shell_mode

    case "$SHELL_MODE_RESOLVED" in
        bash)
            case "$SHELL" in
                */bash|*/sh)
                    echo "Default shell already bash-compatible. Skipping shell change."
                    ;;
                *)
                    set_default_shell "bash"
                    ;;
            esac
            ;;
        zsh)
            case "$SHELL" in
                */zsh)
                    echo "Default shell already zsh. Skipping shell change."
                    ;;
                *)
                    set_default_shell "zsh"
                    ;;
            esac
            ;;
        fish)
            case "$SHELL" in
                */fish)
                    echo "Default shell already fish. Skipping shell change."
                    ;;
                *)
                    set_default_shell "fish"
                    ;;
            esac
            ;;
    esac
}

function clear_old_dotfiles() {
    echo "Removing previous dotfiles..."
    rm -f ~/.aliases ~/.gitconfig ~/.zshrc ~/.tmux.conf ~/.p10k.zsh ~/.zprofile ~/.zlogin ~/.dircolors
    rm -f ~/.bashrc ~/.bash_profile ~/.bash_aliases ~/.config/fish/config.fish
    rm -rf ~/.zsh ~/.bin
}

is_kde_plasma_session() {
    [[ "$(uname)" == "Linux" ]] || return 1

    local current_desktop desktop_session
    current_desktop="${XDG_CURRENT_DESKTOP:-}"
    desktop_session="${DESKTOP_SESSION:-}"

    [[ "$current_desktop" == *KDE* ]] \
        || [[ "$current_desktop" == *Plasma* ]] \
        || [[ "$desktop_session" == *kde* ]] \
        || [[ "$desktop_session" == *plasma* ]] \
        || [[ "${KDE_FULL_SESSION:-}" == "true" ]] \
        || [[ -n "${KDE_SESSION_VERSION:-}" ]]
}

should_install_kde_config() {
    case "${INSTALL_KDE_CONFIG:-auto}" in
        1|true|TRUE|yes|YES)
            return 0
            ;;
        0|false|FALSE|no|NO)
            return 1
            ;;
    esac

    is_kde_plasma_session
}

link_repo_config_path() {
    local repo_root="$1"
    local config_path="$2"
    local target_path="$HOME/.config/$config_path"

    [[ -e "$repo_root/config/$config_path" ]] || return 0

    mkdir -p "$HOME/.config"
    rm -rf "$target_path"
    ln -sfn "$repo_root/config/$config_path" "$target_path"
}

function install_homebrew() {
    echo "Installing Homebrew..."
    which -s brew
    if [[ $? != 0 ]] ; then
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
}

function install_homebrew_packages() {
    echo "Installing Homebrew packages..."
    local brew_packages=(tmux neovim ripgrep node fastfetch pyenv rbenv ruby-build eza starship)
    if should_use_zsh; then
        brew_packages+=(zsh)
    elif should_use_fish; then
        brew_packages+=(fish)
    fi

    brew install "${brew_packages[@]}" \
      bat fd fzf jq zoxide btop
    brew install opencodeai/tap/opencode
}

install_with_pacman() {
    echo "Installing packages with Pacman..."
    local core_packages=(curl git tmux neovim ripgrep nodejs fastfetch pyenv rbenv ruby-build eza starship)
    if should_use_zsh; then
        core_packages+=(zsh)
    elif should_use_fish; then
        core_packages+=(fish)
    fi

    sudo pacman -S --needed "${core_packages[@]}" \
      bat fd fzf jq zoxide btop
    install_opencode
}

install_yay() {
    if [[ ! -x "$(command -v pacman)" ]]; then
        return 0
    fi

    if [[ -x "$(command -v yay)" ]]; then
        return 0
    fi

    echo "Installing yay..."
    sudo pacman -S --needed base-devel git

    local aur_user build_root yay_dir install_cmd
    aur_user="${SUDO_USER:-$(id -un)}"
    build_root="/tmp/yay-build-$aur_user-$$"
    yay_dir="$build_root/yay"
    install_cmd="cd '$build_root' && git clone https://aur.archlinux.org/yay.git '$yay_dir' && cd '$yay_dir' && makepkg -si --noconfirm"

    rm -rf "$build_root"
    mkdir -p "$build_root"

    if [[ "$(id -u)" -eq 0 ]]; then
        chown "$aur_user:$aur_user" "$build_root"
        if command -v runuser >/dev/null 2>&1; then
            if ! runuser -u "$aur_user" -- bash -lc "$install_cmd"; then
                echo "Could not install yay automatically."
                rm -rf "$build_root"
                return 0
            fi
        else
            if ! su - "$aur_user" -c "$install_cmd"; then
                echo "Could not install yay automatically."
                rm -rf "$build_root"
                return 0
            fi
        fi
    else
        if ! bash -lc "$install_cmd"; then
            echo "Could not install yay automatically."
            rm -rf "$build_root"
            return 0
        fi
    fi

    rm -rf "$build_root"
}

install_pyenv_from_upstream() {
    if command -v pyenv >/dev/null 2>&1; then
        return 0
    fi

    echo "pyenv package is unavailable in configured repositories."
    echo "Installing pyenv from upstream..."

    if [[ -d "$HOME/.pyenv" ]]; then
        echo "~/.pyenv already exists. Skipping upstream installer."
        return 0
    fi

    if ! curl -fsSL https://pyenv.run | bash; then
        echo "Could not install pyenv from upstream automatically."
        echo "Run this manually: curl https://pyenv.run | bash"
        return 0
    fi
}

# Function to install packages using APT (Debian/Ubuntu)
install_with_apt() {
    echo "Installing packages with APT..."
    sudo apt-get update

    # Install core packages first so setup remains usable even if optional
    # packages are unavailable on the current Debian/Ubuntu release.
    local core_packages=(curl git tmux neovim ripgrep nodejs eza)
    if should_use_zsh; then
        core_packages+=(zsh)
    elif should_use_fish; then
        core_packages+=(fish)
    fi

    sudo apt-get install -y "${core_packages[@]}"
    install_opencode

    local tool_pkg
    for tool_pkg in bat fd-find fzf jq zoxide btop; do
        if ! sudo apt-get install -y "$tool_pkg"; then
            echo "Skipping unavailable alias productivity package: $tool_pkg"
        fi
    done

    local optional_pkg
    for optional_pkg in fastfetch pyenv rbenv starship; do
        if ! sudo apt-get install -y "$optional_pkg"; then
            echo "Skipping unavailable optional package: $optional_pkg"
        fi
    done
}

# Function to install packages using DNF (Fedora)
install_with_dnf() {
    echo "Installing packages with DNF..."
    local core_packages=(curl git tmux neovim ripgrep nodejs fastfetch eza)
    if should_use_zsh; then
        core_packages+=(zsh)
    elif should_use_fish; then
        core_packages+=(fish)
    fi

    sudo dnf install -y "${core_packages[@]}"
    install_opencode

    local tool_pkg
    for tool_pkg in bat fd-find fzf jq zoxide btop; do
        if ! sudo dnf install -y "$tool_pkg"; then
            echo "Skipping unavailable alias productivity package: $tool_pkg"
        fi
    done

    # Required for building CPython versions via pyenv.
    if ! sudo dnf groupinstall -y "Development Tools"; then
        echo "Warning: Could not install DNF group 'Development Tools'. Continuing."
    fi
    sudo dnf install -y \
      openssl-devel bzip2-devel libffi-devel zlib-devel \
      readline-devel sqlite-devel tk-devel xz-devel \
      ncurses-devel gdbm-devel libuuid-devel

    # Some Fedora derivatives do not ship pyenv/rbenv in enabled repos.
    if ! sudo dnf install -y --skip-unavailable pyenv rbenv starship; then
        echo "Skipping unavailable optional packages: pyenv, rbenv, and/or starship"
    fi

    install_pyenv_from_upstream
}

# Function to install packages using YUM (RHEL/CentOS)
install_with_yum() {
    echo "Installing packages with YUM..."
    local core_packages=(curl git tmux neovim ripgrep nodejs fastfetch eza)
    if should_use_zsh; then
        core_packages+=(zsh)
    elif should_use_fish; then
        core_packages+=(fish)
    fi

    sudo yum install -y "${core_packages[@]}"
    install_opencode

    local tool_pkg
    for tool_pkg in bat fd-find fzf jq zoxide btop; do
        if ! sudo yum install -y "$tool_pkg"; then
            echo "Skipping unavailable alias productivity package: $tool_pkg"
        fi
    done

    if ! sudo yum install -y starship; then
        echo "Skipping unavailable optional package: starship"
    fi

    # Required for building CPython versions via pyenv.
    if ! sudo yum groupinstall -y "Development Tools"; then
        echo "Warning: Could not install YUM group 'Development Tools'. Continuing."
    fi
    sudo yum install -y \
      openssl-devel bzip2-devel libffi-devel zlib-devel \
      readline-devel sqlite-devel tk-devel xz-devel \
      ncurses-devel gdbm-devel libuuid-devel

    # Some repos do not provide pyenv/rbenv; keep setup non-fatal.
    if ! sudo yum install -y pyenv rbenv; then
        echo "Skipping unavailable optional packages: pyenv and/or rbenv"
    fi

    install_pyenv_from_upstream
}

# Function to install packages using Portage (Gentoo)
install_with_emerge() {
    echo "Installing packages with Portage (emerge)..."

    sudo emerge --sync

    if ! grep -q "guru" /etc/portage/repos.conf/* 2>/dev/null; then
        echo "Adding GURU overlay for eza..."
        sudo mkdir -p /etc/portage/repos.conf
        sudo tee /etc/portage/repos.conf/guru.conf > /dev/null << EOF
[guru]
location = /var/db/repos/guru
sync-type = git
sync-uri = https://github.com/gentoo-mirror/guru.git
auto-sync = yes
EOF
        sudo emerge --sync guru
    fi

        local core_packages=(
            net-misc/curl dev-vcs/git app-misc/tmux app-editors/neovim
            sys-apps/ripgrep net-libs/nodejs app-misc/fastfetch app-misc/eza
            app-shells/starship
        )
        if should_use_zsh; then
                core_packages+=(app-shells/zsh)
        elif should_use_fish; then
            core_packages+=(app-shells/fish)
        fi

        sudo emerge --noreplace "${core_packages[@]}"
    install_opencode

    local tool_pkg
    for tool_pkg in app-text/bat sys-apps/fd app-shells/fzf app-misc/jq app-shells/zoxide sys-process/btop; do
        if ! sudo emerge --noreplace "$tool_pkg"; then
            echo "Skipping unavailable alias productivity package: $tool_pkg"
        fi
    done

    # These may require additional overlays depending on Gentoo profile.
    if ! sudo emerge --noreplace dev-python/pyenv dev-util/rbenv; then
        echo "Skipping unavailable optional packages: pyenv and/or rbenv"
    fi

    install_pyenv_from_upstream
}

install_opencode() {
    if command -v opencode >/dev/null 2>&1; then
        return 0
    fi

    echo "Installing OpenCode..."
    if [[ "$(uname)" == "Darwin" ]]; then
        return 0
    fi

    local install_dir="$HOME/.local/bin"
    mkdir -p "$install_dir"

    if curl -fsSL https://opencode.ai/install.sh | sh -s -- -p "$install_dir"; then
        echo "OpenCode installed to $install_dir"
    else
        echo "Failed to install OpenCode. Install manually from https://opencode.ai"
    fi
}

install_starship() {
    if command -v starship >/dev/null 2>&1; then
        echo "Starship is already installed. Skipping."
        return 0
    fi

    echo "Installing Starship..."

    local install_dir="$HOME/.local/bin"
    mkdir -p "$install_dir"

    if curl -fsSL https://starship.rs/install.sh | sh -s -- -y -b "$install_dir"; then
        echo "Starship installed to $install_dir"
    else
        echo "Failed to install Starship automatically."
        echo "Install manually: curl -fsSL https://starship.rs/install.sh | sh"
    fi
}

install_wezterm() {
    if command -v wezterm >/dev/null 2>&1; then
        echo "WezTerm is already installed. Skipping."
        return 0
    fi

    echo "Installing WezTerm..."

    if [[ "$(uname)" == "Darwin" ]]; then
        if command -v brew >/dev/null 2>&1; then
            brew install wezterm || true
        else
            echo "WezTerm not in PATH and Homebrew not found. Install manually from https://wezfurlong.org/wezterm/"
        fi
        return
    fi

    if [[ -x "$(command -v pacman)" ]]; then
        sudo pacman -S --needed wezterm || true
    elif [[ -x "$(command -v apt-get)" ]]; then
        sudo apt-get update
        sudo apt-get install -y wezterm || {
            echo "WezTerm not available in APT. Download from https://wezfurlong.org/wezterm/install/linux.html"
        }
    elif [[ -x "$(command -v dnf)" ]]; then
        sudo dnf install -y wezterm || true
    elif [[ -x "$(command -v yum)" ]]; then
        sudo yum install -y wezterm || true
    elif [[ -x "$(command -v emerge)" ]]; then
        sudo emerge --noreplace app-misc/wezterm || true
    else
        echo "Unsupported Linux distribution for WezTerm auto-install."
        echo "Install manually from https://wezfurlong.org/wezterm/install/linux.html"
    fi
}

install_papirus_icon_theme() {
    # Papirus is only relevant for Linux desktop environments.
    if [[ "$(uname)" == "Darwin" ]]; then
        return 0
    fi

    echo "Installing Papirus icon theme (best effort)..."

    if [[ -x "$(command -v pacman)" ]]; then
        if ! sudo pacman -S --needed papirus-icon-theme; then
            echo "Skipping unavailable package: papirus-icon-theme"
        fi
    elif [[ -x "$(command -v apt-get)" ]]; then
        if ! sudo apt-get install -y papirus-icon-theme; then
            echo "Skipping unavailable package: papirus-icon-theme"
        fi
    elif [[ -x "$(command -v dnf)" ]]; then
        if ! sudo dnf install -y papirus-icon-theme; then
            echo "Skipping unavailable package: papirus-icon-theme"
        fi
    elif [[ -x "$(command -v yum)" ]]; then
        if ! sudo yum install -y papirus-icon-theme; then
            echo "Skipping unavailable package: papirus-icon-theme"
        fi
    elif [[ -x "$(command -v emerge)" ]]; then
        if ! sudo emerge --noreplace x11-themes/papirus-icon-theme; then
            echo "Skipping unavailable package: x11-themes/papirus-icon-theme"
        fi
    else
        echo "Unsupported Linux distribution for Papirus auto-install."
    fi
}

install_hypr_stack() {
    # Hyprland stack is Linux-only.
    if [[ "$(uname)" == "Darwin" ]]; then
        return 0
    fi

    echo "Installing Hyprland stack packages..."

    if [[ -x "$(command -v pacman)" ]]; then
        local pacman_packages=(
            hyprland hyprpaper hyprlock waybar mako rofi-wayland kitty
            wl-clipboard grim slurp swappy brightnessctl playerctl
            pavucontrol network-manager-applet
        )
        local pkg
        for pkg in "${pacman_packages[@]}"; do
            sudo pacman -S --needed "$pkg" || echo "Skipping unavailable package: $pkg"
        done
    elif [[ -x "$(command -v apt-get)" ]]; then
        # Package availability differs by distro release, so install best-effort.
        local apt_packages=(
            hyprland hyprpaper hyprlock waybar mako-notifier rofi-wayland kitty
            wl-clipboard grim slurp swappy brightnessctl playerctl pavucontrol
            network-manager-gnome
        )
        local pkg
        sudo apt-get update
        for pkg in "${apt_packages[@]}"; do
            sudo apt-get install -y "$pkg" || echo "Skipping unavailable package: $pkg"
        done
    elif [[ -x "$(command -v dnf)" ]]; then
        local dnf_packages=(
            hyprland hyprpaper hyprlock waybar mako rofi-wayland kitty
            wl-clipboard grim slurp swappy brightnessctl playerctl pavucontrol
            network-manager-applet
        )
        local pkg
        for pkg in "${dnf_packages[@]}"; do
            sudo dnf install -y "$pkg" || echo "Skipping unavailable package: $pkg"
        done
    elif [[ -x "$(command -v yum)" ]]; then
        local yum_packages=(
            hyprland hyprpaper hyprlock waybar mako rofi-wayland kitty
            wl-clipboard grim slurp swappy brightnessctl playerctl pavucontrol
            network-manager-applet
        )
        local pkg
        for pkg in "${yum_packages[@]}"; do
            sudo yum install -y "$pkg" || echo "Skipping unavailable package: $pkg"
        done
    elif [[ -x "$(command -v emerge)" ]]; then
        local emerge_packages=(
            gui-wm/hyprland gui-apps/hyprpaper gui-apps/hyprlock gui-apps/waybar
            x11-misc/mako x11-misc/rofi x11-terms/kitty gui-apps/wl-clipboard
            media-gfx/grim media-gfx/slurp media-gfx/swappy app-misc/brightnessctl
            media-sound/playerctl media-sound/pavucontrol gnome-extra/nm-applet
        )
        local pkg
        for pkg in "${emerge_packages[@]}"; do
            sudo emerge --noreplace "$pkg" || echo "Skipping unavailable package: $pkg"
        done
    else
        echo "Unsupported Linux distribution for Hyprland auto-install."
    fi
}

function setup_lang_envs() {
    echo "Shell language env init is managed by repo shell configs. Skipping direct rc file edits."
}

function install_nvm() {
    echo "Installing nvm..."

    if [[ ! -d "$HOME/.nvm" ]]; then
        if ! curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash; then
            echo "Warning: Failed to install nvm. Skipping."
            return 0
        fi
    else
        echo "nvm directory already exists. Skipping installer."
    fi

    echo "nvm init is managed by repo shell configs. Skipping direct rc file edits."
}

function create_alias_directories() {
    echo "Creating directories used by aliases..."

    mkdir -p "$HOME/Documents/work"
    mkdir -p "$HOME/Developer"
    mkdir -p "${XDG_CONFIG_HOME:-$HOME/.config}/OpenRGB"
    mkdir -p "${XDG_STATE_HOME:-$HOME/.local/state}/openrgb"
}

sync_custom_desktop_assets() {
    local repo_root="$REPO_ROOT"
    local source_icons="$repo_root/Icons/dark-side"
    local target_icons="$HOME/.local/share/icons/dark-side"
    local source_wallpapers="$repo_root/Wallpapers"
    local target_wallpapers="$HOME/Pictures/Wallpapers"

    if [[ -d "$source_icons" ]]; then
        echo "Syncing custom icons to $target_icons..."
        mkdir -p "$target_icons"
        cp -a "$source_icons"/. "$target_icons"/
    fi

    if [[ -d "$source_wallpapers" ]]; then
        echo "Syncing wallpapers to $target_wallpapers..."
        mkdir -p "$target_wallpapers"
        cp -a "$source_wallpapers"/. "$target_wallpapers"/
    fi
}

function create_dotfiles() {
    echo "Creating dotfiles..."
    local repo_root
    local kde_config
    repo_root="$REPO_ROOT"

    ln -sfn "$repo_root/aliases" ~/.aliases
    if [[ -f "$repo_root/bash_aliases" ]]; then
        ln -sfn "$repo_root/bash_aliases" ~/.bash_aliases
    fi
    ln -sfn "$repo_root/gitconfig" ~/.gitconfig
    ln -sfn "$repo_root/dircolors" ~/.dircolors
    ln -sfn "$repo_root/zsh" ~/.zsh
    if [[ -d "$repo_root/local/bin" ]]; then
        ln -sfn "$repo_root/local/bin" ~/.bin
    fi

    # Link repo-managed desktop entry overrides.
    if [[ -d "$repo_root/local/share/applications" ]]; then
        mkdir -p ~/.local/share/applications
        local desktop_entry
        for desktop_entry in "$repo_root"/local/share/applications/*.desktop; do
            [[ -e "$desktop_entry" ]] || continue
            ln -sfn "$desktop_entry" "$HOME/.local/share/applications/$(basename "$desktop_entry")"
        done
        if command -v update-desktop-database >/dev/null 2>&1; then
            update-desktop-database "$HOME/.local/share/applications" >/dev/null 2>&1 || true
        fi
    fi

    ln -sfn "$repo_root/zshrc" ~/.zshrc
    if [[ -f "$repo_root/bashrc" ]]; then
        ln -sfn "$repo_root/bashrc" ~/.bashrc
    fi
    if [[ -f "$repo_root/bash_profile" ]]; then
        ln -sfn "$repo_root/bash_profile" ~/.bash_profile
    fi
    if [[ -f "$repo_root/config/fish/config.fish" ]]; then
        mkdir -p ~/.config/fish
        ln -sfn "$repo_root/config/fish/config.fish" ~/.config/fish/config.fish
    fi
    ln -sfn "$repo_root/tmux.conf" ~/.tmux.conf
    if [[ -f "$repo_root/p10k.zsh" ]]; then
        ln -sfn "$repo_root/p10k.zsh" ~/.p10k.zsh
    fi
    if [[ -f "$repo_root/zprofile" ]]; then
        ln -sfn "$repo_root/zprofile" ~/.zprofile
    fi
    if [[ -f "$repo_root/zlogin" ]]; then
        ln -sfn "$repo_root/zlogin" ~/.zlogin
    fi

    # Keep repo-managed app config tracked in-repo while preserving standard config paths.
    if [[ -d "$repo_root/config/hypr" ]] && decide_hyprland_setup; then
        link_repo_config_path "$repo_root" "hypr"
    elif [[ -d "$repo_root/config/hypr" ]]; then
        echo "Skipping Hyprland config links."
    fi

    if [[ -d "$repo_root/config/mako" ]]; then
        link_repo_config_path "$repo_root" "mako"
    fi

    if [[ -d "$repo_root/config/kitty" ]]; then
        link_repo_config_path "$repo_root" "kitty"
    fi

    if [[ -d "$repo_root/config/fastfetch" ]]; then
        link_repo_config_path "$repo_root" "fastfetch"
    fi

    if [[ -f "$repo_root/config/starship.toml" ]]; then
        link_repo_config_path "$repo_root" "starship.toml"
    fi

    if [[ -d "$repo_root/config/wezterm" ]]; then
        link_repo_config_path "$repo_root" "wezterm"
    fi

    if should_install_kde_config; then
        echo "Detected KDE Plasma. Linking KDE config files..."
        for kde_config in \
            dolphinrc \
            kcminputrc \
            kdeglobals \
            kwinrc \
            mimeapps.list \
            plasma-org.kde.plasma.desktop-appletsrc \
            plasmanotifyrc \
            plasmarc; do
            link_repo_config_path "$repo_root" "$kde_config"
        done
    else
        echo "KDE Plasma not detected. Skipping KDE-specific config links."
    fi

}

function setup_tmux_plugins() {
    echo "Setting up tmux plugins..."

    local tpm_dir="$HOME/.tmux/plugins"
    if [[ ! -d "$tpm_dir/tpm" ]]; then
        git clone https://github.com/tmux-plugins/tpm "$tpm_dir/tpm"
    fi

    if [[ -f ~/.tmux.conf ]]; then
        tmux new-session -d 2>/dev/null || true
        ~/.tmux/plugins/tpm/scripts/install_plugins.sh 2>/dev/null || true
        tmux kill-server 2>/dev/null || true
    fi
}

function setup_p10k() {
    if ! should_use_zsh; then
        echo "Skipping powerlevel10k setup (bash shell mode)."
        return 0
    fi

    if [[ "${PROMPT_BACKEND:-starship}" != "p10k" ]]; then
        echo "Skipping powerlevel10k setup (PROMPT_BACKEND=${PROMPT_BACKEND:-starship})."
        return 0
    fi

    if [[ ! -d ~/.powerlevel10k ]]; then
        echo "Installing powerlevel10k..."
        if ! git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/.powerlevel10k; then
            echo "Warning: Failed to clone powerlevel10k. Skipping."
            return 0
        fi
    fi
    
    # Check if the source line already exists in ~/.zshrc
    if ! grep -qxF 'source ~/.powerlevel10k/powerlevel10k.zsh-theme' ~/.zshrc; then
        echo 'source ~/.powerlevel10k/powerlevel10k.zsh-theme' >>~/.zshrc
    else
        echo 'Powerlevel10k source line already exists in ~/.zshrc. Skipping.'
    fi
}

setup_starship() {
    if ! command -v starship >/dev/null 2>&1; then
        echo "starship is not installed. Skipping shell prompt setup."
        return 0
    fi

    echo "starship is installed; shell rc files already contain init hooks."
}


clear_old_dotfiles

cd "$REPO_ROOT"

# Link essential dotfiles early so shell setup is usable even if package installs fail.
run_nonfatal "Create alias directories" create_alias_directories
run_nonfatal "Create dotfiles" create_dotfiles
run_nonfatal "Sync custom desktop assets" sync_custom_desktop_assets
run_nonfatal "Setup shell" setup_shell
run_nonfatal "Setup language env stubs" setup_lang_envs

if [[ "$(uname)" == "Darwin" ]]; then
    run_nonfatal "Install Homebrew" install_homebrew
    run_nonfatal "Install Homebrew packages" install_homebrew_packages
else
    # Determine the Linux distribution and install packages accordingly
    if [[ -x "$(command -v pacman)" ]]; then
        # Arch Linux (Pacman)
        run_nonfatal "Install packages with pacman" install_with_pacman
        run_nonfatal "Install yay" install_yay
        elif [[ -x "$(command -v apt-get)" ]]; then
        # Debian/Ubuntu (APT)
        run_nonfatal "Install packages with apt" install_with_apt
        elif [[ -x "$(command -v dnf)" ]]; then
        # Fedora (DNF)
        run_nonfatal "Install packages with dnf" install_with_dnf
        elif [[ -x "$(command -v yum)" ]]; then
        # RHEL/CentOS (YUM)
        run_nonfatal "Install packages with yum" install_with_yum
        elif [[ -x "$(command -v emerge)" ]]; then
        # Gentoo (Portage)
        run_nonfatal "Install packages with emerge" install_with_emerge
    else
        echo "Unsupported Linux distribution. Please install packages manually."
        exit 1
    fi

    run_nonfatal "Install Papirus icon theme" install_papirus_icon_theme
fi

if decide_hyprland_setup; then
    run_nonfatal "Install Hyprland stack" install_hypr_stack
else
    echo "Skipping Hyprland stack installation."
fi

function install_fonts() {
    echo "Installing fonts..."

    if [[ "$(uname)" == "Darwin" ]]; then
        if command -v brew >/dev/null 2>&1; then
            # The cask-fonts tap is deprecated; try direct casks and continue on failure.
            brew install --cask font-meslo-lg-nerd-font || true
            brew install --cask font-fira-code-nerd-font || true
        fi

        mkdir -p ~/Library/Fonts
        if [[ -d "fonts/Fira_Code" ]]; then
            cp -f fonts/Fira_Code/static/*.ttf ~/Library/Fonts/ 2>/dev/null || true
        fi
        if [[ -d "fonts/MesloLGS NF" ]]; then
            cp -f fonts/MesloLGS\ NF/*.ttf ~/Library/Fonts/ 2>/dev/null || true
        fi
    else
        if [[ -d "fonts/Fira_Code" ]]; then
            mkdir -p ~/.local/share/fonts/Fira_Code
            cp -r fonts/Fira_Code/* ~/.local/share/fonts/Fira_Code/
        fi

        if [[ -d "fonts/MesloLGS NF" ]]; then
            mkdir -p ~/.local/share/fonts/MesloLGS_NF
            cp -r fonts/MesloLGS\ NF/* ~/.local/share/fonts/MesloLGS_NF/
        fi

        if [[ -d "fonts/IBMPlexMono" ]]; then
            mkdir -p ~/.local/share/fonts/IBMPlexMono
            cp -r fonts/IBMPlexMono/* ~/.local/share/fonts/IBMPlexMono/
        fi

        if [[ -x "$(command -v fc-cache)" ]]; then
            fc-cache -f -v
        fi
    fi

    echo "Fonts installed successfully."
}

function setup_terminal_colors() {
    echo "Configuring terminal default colors..."
    if [[ "$(uname)" == "Darwin" ]]; then
        # Set built-in profile as default for Apple Terminal.
        defaults write com.apple.Terminal "Default Window Settings" -string "Pro"
        defaults write com.apple.Terminal "Startup Window Settings" -string "Pro"
    fi
}

function install_browsers() {
    echo "Installing browsers (Chrome and Firefox)..."

    if [[ "$(uname)" == "Darwin" ]]; then
        if command -v brew >/dev/null 2>&1; then
            if [[ -d "/Applications/Google Chrome.app" ]] || brew list --cask google-chrome >/dev/null 2>&1; then
                echo "Google Chrome is already installed. Skipping."
            else
                brew install --cask google-chrome || true
            fi

            if [[ -d "/Applications/Firefox.app" ]] || brew list --cask firefox >/dev/null 2>&1; then
                echo "Firefox is already installed. Skipping."
            else
                brew install --cask firefox || true
            fi
        fi
        return
    fi

    if [[ -x "$(command -v pacman)" ]]; then
        # Arch official repos provide Firefox + Chromium. Google Chrome is in AUR.
        sudo pacman -S --needed firefox chromium
        install_yay
        if [[ -x "$(command -v yay)" ]]; then
            yay -S --needed google-chrome || true
        fi
    elif [[ -x "$(command -v apt-get)" ]]; then
        sudo apt-get update
        sudo apt-get install -y firefox || sudo apt-get install -y firefox-esr || true
        sudo apt-get install -y google-chrome-stable || sudo apt-get install -y chromium-browser chromium || true
    elif [[ -x "$(command -v yum)" ]]; then
        sudo yum install -y firefox || true
        sudo yum install -y google-chrome-stable || sudo yum install -y chromium || true
    elif [[ -x "$(command -v emerge)" ]]; then
        sudo emerge --noreplace www-client/firefox || true
        sudo emerge --noreplace www-client/google-chrome || sudo emerge --noreplace www-client/chromium || true
    else
        echo "Unsupported Linux distribution for browser auto-install."
    fi
}

function install_vscode() {
    echo "Installing Visual Studio Code..."

    if [[ "$(uname)" == "Darwin" ]]; then
        if command -v brew >/dev/null 2>&1; then
            if [[ -d "/Applications/Visual Studio Code.app" ]] || brew list --cask visual-studio-code >/dev/null 2>&1; then
                echo "Visual Studio Code is already installed. Skipping."
            else
                brew install --cask visual-studio-code || true
            fi
        fi
        return
    fi

    if [[ -x "$(command -v pacman)" ]]; then
        install_yay
        if [[ -x "$(command -v yay)" ]]; then
            yay -S --needed visual-studio-code-bin || true
        else
            echo "Could not install yay automatically. Install Visual Studio Code manually with: yay -S visual-studio-code-bin"
        fi
    elif [[ -x "$(command -v apt-get)" ]]; then
        sudo apt-get install -y code || {
            if [[ -x "$(command -v snap)" ]]; then
                sudo snap install code --classic || true
            else
                echo "VS Code package unavailable in APT and snap is not installed."
            fi
        }
    elif [[ -x "$(command -v yum)" ]]; then
        sudo yum install -y code || {
            if [[ -x "$(command -v snap)" ]]; then
                sudo snap install code --classic || true
            else
                echo "VS Code package unavailable in YUM and snap is not installed."
            fi
        }
    elif [[ -x "$(command -v emerge)" ]]; then
        sudo emerge --noreplace app-editors/visual-studio-code || {
            echo "VS Code package may require a configured overlay on Gentoo."
            echo "Install manually or enable an overlay that provides app-editors/visual-studio-code."
        }
    else
        echo "Unsupported Linux distribution for VS Code auto-install."
    fi
}

function install_docker() {
    echo "Installing Docker..."

    if [[ "$(uname)" == "Darwin" ]]; then
        if command -v brew >/dev/null 2>&1; then
            if [[ -d "/Applications/Docker.app" ]] || brew list --cask docker >/dev/null 2>&1; then
                echo "Docker Desktop is already installed. Skipping."
            else
                brew install --cask docker || true
            fi
        else
            echo "Homebrew not found. Install Docker Desktop manually."
        fi
        return
    fi

    if [[ -x "$(command -v pacman)" ]]; then
        sudo pacman -S --needed docker docker-compose
    elif [[ -x "$(command -v apt-get)" ]]; then
        sudo apt-get update
        sudo apt-get install -y docker.io docker-compose-plugin || sudo apt-get install -y docker.io docker-compose || true
    elif [[ -x "$(command -v yum)" ]]; then
        sudo yum install -y docker docker-compose-plugin || sudo yum install -y docker docker-compose || true
    elif [[ -x "$(command -v emerge)" ]]; then
        sudo emerge --noreplace app-containers/docker app-containers/docker-compose || true
    else
        echo "Unsupported Linux distribution for Docker auto-install."
        return
    fi

    if [[ -x "$(command -v systemctl)" ]]; then
        sudo systemctl enable --now docker || sudo systemctl enable --now docker.service || true
    elif [[ -x "$(command -v rc-update)" ]]; then
        sudo rc-update add docker default || true
        sudo rc-service docker start || true
    fi

    if [[ -x "$(command -v usermod)" ]] && [[ "$(id -u)" -ne 0 ]]; then
        sudo usermod -aG docker "$USER" || true
        echo "Added $USER to docker group. Log out and back in for group changes to take effect."
    fi
}

function install_media_tools() {
    # Optional installs so setup stays safe for shared/public use.
    # Enable with: INSTALL_MEDIA_TOOLS=1 ./setup.sh
    # Or individually: INSTALL_OPENRGB=1 INSTALL_REAPER=1 ./setup.sh
    local install_openrgb="${INSTALL_OPENRGB:-0}"
    local install_reaper="${INSTALL_REAPER:-0}"
    local has_media_flag="${INSTALL_MEDIA_TOOLS+x}"
    local has_openrgb_flag="${INSTALL_OPENRGB+x}"
    local has_reaper_flag="${INSTALL_REAPER+x}"
    local openrgb_installed="0"
    local reaper_installed="0"
    local answer

    if [[ "$(uname)" == "Darwin" ]]; then
        if [[ -d "/Applications/OpenRGB.app" ]] || command -v openrgb >/dev/null 2>&1; then
            openrgb_installed="1"
        elif command -v brew >/dev/null 2>&1 && brew list --cask openrgb >/dev/null 2>&1; then
            openrgb_installed="1"
        fi

        if [[ -d "/Applications/REAPER.app" ]] || [[ -d "/Applications/REAPER64.app" ]] || command -v reaper >/dev/null 2>&1; then
            reaper_installed="1"
        elif command -v brew >/dev/null 2>&1 && brew list --cask reaper >/dev/null 2>&1; then
            reaper_installed="1"
        fi
    else
        if command -v openrgb >/dev/null 2>&1; then
            openrgb_installed="1"
        else
            set +e
            pacman -Qi openrgb >/dev/null 2>&1 2>&1
            [[ $? -eq 0 ]] && openrgb_installed="1"
            dpkg -s openrgb >/dev/null 2>&1
            [[ $? -eq 0 ]] && openrgb_installed="1"
            rpm -q openrgb >/dev/null 2>&1
            [[ $? -eq 0 ]] && openrgb_installed="1"
            set -e
        fi

        if command -v reaper >/dev/null 2>&1; then
            reaper_installed="1"
        else
            set +e
            pacman -Qi reaper >/dev/null 2>&1
            [[ $? -eq 0 ]] && reaper_installed="1"
            set -e
        fi
    fi

    # Skip interactive prompts - use environment variables instead
    # This prevents terminal hangs/crashes in some terminal emulators
    if [[ -z "$has_media_flag" && -z "$has_openrgb_flag" && -z "$has_reaper_flag" ]]; then
        echo "Optional media tools are available (OpenRGB and REAPER)."
        echo "To install, use: INSTALL_OPENRGB=1 INSTALL_REAPER=1 ./setup.sh"
        echo "Skipping media tools (non-interactive mode)."
        return 0
    fi

    if [[ "${INSTALL_MEDIA_TOOLS:-0}" == "1" ]]; then
        install_openrgb="1"
        install_reaper="1"
    fi

    if [[ "$install_openrgb" != "1" && "$install_reaper" != "1" ]]; then
        echo "Skipping OpenRGB/REAPER install (opt-in)."
        if [[ ! -t 0 && -z "$has_media_flag" && -z "$has_openrgb_flag" && -z "$has_reaper_flag" ]]; then
            echo "Tip: run with INSTALL_MEDIA_TOOLS=1, INSTALL_OPENRGB=1, or INSTALL_REAPER=1"
        fi
        return
    fi

    echo "Installing optional media tools..."

    if [[ "$(uname)" == "Darwin" ]]; then
        if [[ "$install_openrgb" == "1" ]]; then
            if [[ -d "/Applications/OpenRGB.app" ]] || command -v openrgb >/dev/null 2>&1; then
                echo "OpenRGB is already installed. Skipping."
                install_openrgb="0"
            fi
        fi
        if [[ "$install_reaper" == "1" ]]; then
            if [[ -d "/Applications/REAPER.app" ]] || [[ -d "/Applications/REAPER64.app" ]]; then
                echo "REAPER is already installed. Skipping."
                install_reaper="0"
            fi
        fi

        if command -v brew >/dev/null 2>&1; then
            if [[ "$install_openrgb" == "1" ]]; then
                if brew list --cask openrgb >/dev/null 2>&1; then
                    echo "OpenRGB cask is already installed. Skipping."
                else
                    brew install --cask openrgb || true
                fi
            fi
            if [[ "$install_reaper" == "1" ]]; then
                if brew list --cask reaper >/dev/null 2>&1; then
                    echo "REAPER cask is already installed. Skipping."
                else
                    brew install --cask reaper || true
                fi
            fi
        elif [[ "$install_openrgb" == "1" || "$install_reaper" == "1" ]]; then
            echo "Homebrew not found. Install media tools manually."
        else
            echo "OpenRGB/REAPER already present. Nothing to install."
        fi
        return
    fi

    if [[ -x "$(command -v pacman)" ]]; then
        if [[ "$install_openrgb" == "1" ]]; then
            set +e
            pacman -Qi openrgb >/dev/null 2>&1
            if [[ $? -eq 0 ]]; then
                set -e
                echo "OpenRGB is already installed. Skipping."
            else
                set -e
                sudo pacman -S --needed openrgb || true
            fi
        fi
        if [[ "$install_reaper" == "1" ]]; then
            set +e
            pacman -Qi reaper >/dev/null 2>&1
            if [[ $? -eq 0 ]]; then
                set -e
                echo "REAPER is already installed. Skipping."
            else
                set -e
                # REAPER is usually available via AUR.
                install_yay
                if [[ -x "$(command -v yay)" ]]; then
                    yay -S --needed reaper || true
                else
                    echo "yay not found; install REAPER manually."
                fi
            fi
        fi
    elif [[ -x "$(command -v apt-get)" ]]; then
        if [[ "$install_openrgb" == "1" ]]; then
            set +e
            dpkg -s openrgb >/dev/null 2>&1
            if [[ $? -eq 0 ]]; then
                set -e
                echo "OpenRGB is already installed. Skipping."
            else
                set -e
                sudo apt-get update
                sudo apt-get install -y openrgb || true
            fi
        fi
        if [[ "$install_reaper" == "1" ]]; then
            if command -v reaper >/dev/null 2>&1; then
                echo "REAPER is already installed. Skipping."
            else
                echo "REAPER is not reliably available in APT repos. Install manually from reaper.fm."
            fi
        fi
    elif [[ -x "$(command -v yum)" ]]; then
        if [[ "$install_openrgb" == "1" ]]; then
            set +e
            rpm -q openrgb >/dev/null 2>&1
            if [[ $? -eq 0 ]]; then
                set -e
                echo "OpenRGB is already installed. Skipping."
            else
                set -e
                sudo yum install -y openrgb || true
            fi
        fi
        if [[ "$install_reaper" == "1" ]]; then
            if command -v reaper >/dev/null 2>&1; then
                echo "REAPER is already installed. Skipping."
            else
                echo "REAPER is not reliably available in YUM repos. Install manually from reaper.fm."
            fi
        fi
    elif [[ -x "$(command -v emerge)" ]]; then
        if [[ "$install_openrgb" == "1" ]]; then
            sudo emerge --noreplace app-misc/openrgb || true
        fi
        if [[ "$install_reaper" == "1" ]]; then
            if command -v reaper >/dev/null 2>&1; then
                echo "REAPER is already installed. Skipping."
            else
                sudo emerge --noreplace media-sound/reaper || echo "REAPER package may be unavailable; install manually from reaper.fm."
            fi
        fi
    else
        echo "Unsupported Linux distribution for media tool auto-install."
    fi
}

run_nonfatal "Install nvm" install_nvm
run_nonfatal "Setup tmux plugins" setup_tmux_plugins
run_nonfatal "Install Starship" install_starship
run_nonfatal "Install WezTerm" install_wezterm
run_nonfatal "Setup starship" setup_starship
run_nonfatal "Setup powerlevel10k" setup_p10k
run_nonfatal "Install fonts" install_fonts
run_nonfatal "Setup terminal colors" setup_terminal_colors
run_nonfatal "Install browsers" install_browsers
run_nonfatal "Install VS Code" install_vscode
run_nonfatal "Install Docker" install_docker
run_nonfatal "Install media tools" install_media_tools
