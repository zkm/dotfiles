#!/bin/bash

set -e

function set_zsh() {
    echo "Setting shell to zsh..."
    local zsh_path

    zsh_path="$(command -v zsh 2>/dev/null || true)"
    if [[ -z "$zsh_path" ]]; then
        echo "zsh is not installed or not in PATH. Skipping shell change."
        return 0
    fi

    if ! chsh -s "$zsh_path"; then
        echo "Could not change shell automatically."
        echo "Run this manually after setup: chsh -s $zsh_path"
    fi
}

function setup_shell() {
    case "$SHELL" in
        */zsh)
            echo "Default shell already zsh. Skipping shell change."
        ;;
        */bash|*/sh)
            set_zsh
        ;;
        *)
            echo "Current shell is $SHELL. Skipping automatic shell change."
        ;;
    esac
}

function clear_old_dotfiles() {
    echo "Removing previous dotfiles..."
    rm -f ~/.aliases ~/.gitconfig ~/.vimrc ~/.vimrc.plugs ~/.zshrc ~/.tmux.conf ~/.p10k.zsh ~/.zprofile ~/.dircolors
    rm -rf ~/.zsh ~/.bin
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
    brew install zsh tmux neovim ripgrep node fastfetch pyenv rbenv ruby-build
}

install_with_pacman() {
    echo "Installing packages with Pacman..."
    sudo pacman -S --needed curl git zsh tmux neovim ripgrep nodejs fastfetch pyenv rbenv ruby-build
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
    sudo apt-get install -y curl git zsh tmux neovim ripgrep nodejs fastfetch pyenv rbenv
}

# Function to install packages using DNF (Fedora)
install_with_dnf() {
    echo "Installing packages with DNF..."
    sudo dnf install -y curl git zsh tmux neovim ripgrep nodejs fastfetch

    # Required for building CPython versions via pyenv.
    if ! sudo dnf groupinstall -y "Development Tools"; then
        echo "Warning: Could not install DNF group 'Development Tools'. Continuing."
    fi
    sudo dnf install -y \
      openssl-devel bzip2-devel libffi-devel zlib-devel \
      readline-devel sqlite-devel tk-devel xz-devel \
      ncurses-devel gdbm-devel libuuid-devel

    # Some Fedora derivatives do not ship pyenv/rbenv in enabled repos.
    if ! sudo dnf install -y --skip-unavailable pyenv rbenv; then
        echo "Skipping unavailable optional packages: pyenv and/or rbenv"
    fi

    install_pyenv_from_upstream
}

# Function to install packages using YUM (RHEL/CentOS)
install_with_yum() {
    echo "Installing packages with YUM..."
    sudo yum install -y curl git zsh tmux neovim ripgrep nodejs fastfetch

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

install_hypr_stack() {
    # Hyprland stack is Linux-only.
    if [[ "$(uname)" == "Darwin" ]]; then
        return 0
    fi

    echo "Installing Hyprland stack packages..."

    if [[ -x "$(command -v pacman)" ]]; then
        local pacman_packages=(
            hyprland hyprpaper waybar mako rofi-wayland kitty
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
            hyprland hyprpaper waybar mako-notifier rofi-wayland kitty
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
            hyprland hyprpaper waybar mako rofi-wayland kitty
            wl-clipboard grim slurp swappy brightnessctl playerctl pavucontrol
            network-manager-applet
        )
        local pkg
        for pkg in "${dnf_packages[@]}"; do
            sudo dnf install -y "$pkg" || echo "Skipping unavailable package: $pkg"
        done
    elif [[ -x "$(command -v yum)" ]]; then
        local yum_packages=(
            hyprland hyprpaper waybar mako rofi-wayland kitty
            wl-clipboard grim slurp swappy brightnessctl playerctl pavucontrol
            network-manager-applet
        )
        local pkg
        for pkg in "${yum_packages[@]}"; do
            sudo yum install -y "$pkg" || echo "Skipping unavailable package: $pkg"
        done
    else
        echo "Unsupported Linux distribution for Hyprland auto-install."
    fi
}

function setup_lang_envs() {
    echo "Configuring pyenv and rbenv for zsh..."

    if ! grep -qxF 'export PYENV_ROOT="$HOME/.pyenv"' ~/.zshrc; then
        echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
    fi
    if ! grep -qxF '[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"' ~/.zshrc; then
        echo '[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
    fi
    if ! grep -qxF 'if command -v pyenv >/dev/null 2>&1; then eval "$(pyenv init - zsh)"; fi' ~/.zshrc; then
        echo 'if command -v pyenv >/dev/null 2>&1; then eval "$(pyenv init - zsh)"; fi' >> ~/.zshrc
    fi

    if ! grep -qxF 'export RBENV_ROOT="$HOME/.rbenv"' ~/.zshrc; then
        echo 'export RBENV_ROOT="$HOME/.rbenv"' >> ~/.zshrc
    fi
    if ! grep -qxF '[[ -d $RBENV_ROOT/bin ]] && export PATH="$RBENV_ROOT/bin:$PATH"' ~/.zshrc; then
        echo '[[ -d $RBENV_ROOT/bin ]] && export PATH="$RBENV_ROOT/bin:$PATH"' >> ~/.zshrc
    fi
    if ! grep -qxF 'if command -v rbenv >/dev/null 2>&1; then eval "$(rbenv init - zsh)"; fi' ~/.zshrc; then
        echo 'if command -v rbenv >/dev/null 2>&1; then eval "$(rbenv init - zsh)"; fi' >> ~/.zshrc
    fi
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

    if ! grep -qxF 'export NVM_DIR="$HOME/.nvm"' ~/.zshrc; then
        echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
    fi
    if ! grep -qxF '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' ~/.zshrc; then
        echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc
    fi
    if ! grep -qxF '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' ~/.zshrc; then
        echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.zshrc
    fi
}

function setup_neovim() {
    echo "Initializing the config for neovim..."
    mkdir -p ~/.config
    mkdir -p ~/.config/nvim
    touch ~/.config/nvim/init.vim
    
    echo "set runtimepath^=~/.vim runtimepath+=~/.vim/after" > ~/.config/nvim/init.vim
    echo "let &packpath = &runtimepath" >> ~/.config/nvim/init.vim
    echo "source ~/.vimrc" >> ~/.config/nvim/init.vim
    # echo "lua require('config')" >> ~/.config/nvim/init.vim
}

function create_alias_directories() {
    echo "Creating directories used by aliases..."

    mkdir -p "$HOME/Documents/work"
    mkdir -p "$HOME/Developer"
    mkdir -p "${XDG_CONFIG_HOME:-$HOME/.config}/OpenRGB"
    mkdir -p "${XDG_STATE_HOME:-$HOME/.local/state}/openrgb"
}

function create_dotfiles() {
    echo "Creating dotfiles..."
    local repo_root
    repo_root="$(pwd)"

    ln -sfn "$repo_root/aliases" ~/.aliases
    ln -sfn "$repo_root/gitconfig" ~/.gitconfig
    ln -sfn "$repo_root/dircolors" ~/.dircolors
    ln -sfn "$repo_root/vimrc" ~/.vimrc
    ln -sfn "$repo_root/vimrc.plugs" ~/.vimrc.plugs
    ln -sfn "$repo_root/zsh" ~/.zsh
    if [[ -d "$repo_root/local/bin" ]]; then
        ln -sfn "$repo_root/local/bin" ~/.bin
    fi
    ln -sfn "$repo_root/zshrc" ~/.zshrc
    ln -sfn "$repo_root/tmux.conf" ~/.tmux.conf
    ln -sfn "$repo_root/p10k.zsh" ~/.p10k.zsh
    if [[ -f "$repo_root/zprofile" ]]; then
        ln -sfn "$repo_root/zprofile" ~/.zprofile
    fi

    # Keep Hyprland config tracked in repo while preserving the standard config path.
    if [[ -d "$repo_root/config/hypr" ]]; then
        mkdir -p ~/.config
        ln -sfn "$repo_root/config/hypr" ~/.config/hypr
    fi
}

function setup_p10k() {
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


function setup_vim_plug() {
    echo "Installing neovim-plug..."
    if ! curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim; then
        echo "Warning: Failed to download vim-plug. Skipping."
        return 0
    fi
    
    # Install plugins with timeout to prevent hanging
    timeout 30 nvim --headless -u ~/.vimrc +PlugInstall +qall 2>/dev/null || true
}

function install_copilot() {
    if [[ ! -d ~/.config/nvim/pack/github/start/copilot.vim ]]; then
        echo "Installing Github copilot..."
        if ! git clone https://github.com/github/copilot.vim.git ~/.config/nvim/pack/github/start/copilot.vim 2>/dev/null; then
            echo "Warning: Failed to clone copilot.vim. Skipping."
            return 0
        fi
    fi
}

clear_old_dotfiles

if [[ "$(uname)" == "Darwin" ]]; then
    install_homebrew
    install_homebrew_packages
else
    # Determine the Linux distribution and install packages accordingly
    if [[ -x "$(command -v pacman)" ]]; then
        # Arch Linux (Pacman)
        install_with_pacman
        install_yay
        elif [[ -x "$(command -v apt-get)" ]]; then
        # Debian/Ubuntu (APT)
        install_with_apt
        elif [[ -x "$(command -v dnf)" ]]; then
        # Fedora (DNF)
        install_with_dnf
        elif [[ -x "$(command -v yum)" ]]; then
        # RHEL/CentOS (YUM)
        install_with_yum
    else
        echo "Unsupported Linux distribution. Please install packages manually."
        exit 1
    fi
fi

install_hypr_stack

setup_shell

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
    else
        echo "Unsupported Linux distribution for Docker auto-install."
        return
    fi

    if [[ -x "$(command -v systemctl)" ]]; then
        sudo systemctl enable --now docker || sudo systemctl enable --now docker.service || true
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
    else
        echo "Unsupported Linux distribution for media tool auto-install."
    fi
}

setup_neovim
create_alias_directories
create_dotfiles
setup_lang_envs
install_nvm
setup_p10k
setup_vim_plug
install_copilot
install_fonts
setup_terminal_colors
install_browsers
install_vscode
install_docker
install_media_tools
