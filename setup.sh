#!/bin/bash

set -e

function set_zsh() {
    echo "Setting shell to zsh..."
    chsh -s $(which zsh);
}

function setup_shell() {
    case $SHELL in
        */bash)
            set_zsh
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
    brew install tmux neovim the_silver_searcher node fastfetch pyenv rbenv ruby-build
}

install_with_pacman() {
    echo "Installing packages with Pacman..."
    sudo pacman -S --needed curl git tmux neovim the_silver_searcher nodejs fastfetch pyenv rbenv ruby-build
}

# Function to install packages using APT (Debian/Ubuntu)
install_with_apt() {
    echo "Installing packages with APT..."
    sudo apt-get update
    sudo apt-get install -y curl git tmux neovim silversearcher-ag nodejs fastfetch pyenv rbenv
}

# Function to install packages using YUM (RHEL/CentOS)
install_with_yum() {
    echo "Installing packages with YUM..."
    sudo yum install -y curl git tmux neovim the_silver_searcher nodejs fastfetch pyenv rbenv
}

function setup_lang_envs() {
    echo "Configuring pyenv and rbenv for zsh..."

    if ! grep -qxF 'export PYENV_ROOT="$HOME/.pyenv"' ~/.zshrc; then
        echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
    fi
    if ! grep -qxF '[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"' ~/.zshrc; then
        echo '[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
    fi
    if ! grep -qxF 'eval "$(pyenv init - zsh)"' ~/.zshrc; then
        echo 'eval "$(pyenv init - zsh)"' >> ~/.zshrc
    fi

    if ! grep -qxF 'export RBENV_ROOT="$HOME/.rbenv"' ~/.zshrc; then
        echo 'export RBENV_ROOT="$HOME/.rbenv"' >> ~/.zshrc
    fi
    if ! grep -qxF '[[ -d $RBENV_ROOT/bin ]] && export PATH="$RBENV_ROOT/bin:$PATH"' ~/.zshrc; then
        echo '[[ -d $RBENV_ROOT/bin ]] && export PATH="$RBENV_ROOT/bin:$PATH"' >> ~/.zshrc
    fi
    if ! grep -qxF 'eval "$(rbenv init - zsh)"' ~/.zshrc; then
        echo 'eval "$(rbenv init - zsh)"' >> ~/.zshrc
    fi
}

function install_nvm() {
    echo "Installing nvm..."

    if [[ ! -d "$HOME/.nvm" ]]; then
        curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
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
}

function setup_p10k() {
    if [[ ! -d ~/.powerlevel10k ]]; then
        git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/.powerlevel10k
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
    curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
    nvim --headless +PlugInstall +qall
}

function install_copilot() {
    if [[ ! -d ~/.config/nvim/pack/github/start/copilot.vim ]]; then
        echo "Installing Github copilot..."
        git clone https://github.com/github/copilot.vim.git ~/.config/nvim/pack/github/start/copilot.vim
    fi
}

setup_shell
clear_old_dotfiles

if [[ "$(uname)" == "Darwin" ]]; then
    install_homebrew
    install_homebrew_packages
else
    # Determine the Linux distribution and install packages accordingly
    if [[ -x "$(command -v pacman)" ]]; then
        # Arch Linux (Pacman)
        install_with_pacman
        elif [[ -x "$(command -v apt-get)" ]]; then
        # Debian/Ubuntu (APT)
        install_with_apt
        elif [[ -x "$(command -v yum)" ]]; then
        # RHEL/CentOS (YUM)
        install_with_yum
    else
        echo "Unsupported Linux distribution. Please install packages manually."
        exit 1
    fi
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
        sudo pacman -S --needed code || {
            if [[ -x "$(command -v yay)" ]]; then
                yay -S --needed visual-studio-code-bin || true
            else
                echo "VS Code not found in pacman repos and yay is not installed."
            fi
        }
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

function install_media_tools() {
    # Optional installs so setup stays safe for shared/public use.
    # Enable with: INSTALL_MEDIA_TOOLS=1 ./setup.sh
    # Or individually: INSTALL_OPENRGB=1 INSTALL_REAPER=1 ./setup.sh
    local install_openrgb="${INSTALL_OPENRGB:-0}"
    local install_reaper="${INSTALL_REAPER:-0}"
    local has_media_flag="${INSTALL_MEDIA_TOOLS+x}"
    local has_openrgb_flag="${INSTALL_OPENRGB+x}"
    local has_reaper_flag="${INSTALL_REAPER+x}"
    local answer

    # Interactive prompt only when no explicit media flags were provided.
    if [[ -z "$has_media_flag" && -z "$has_openrgb_flag" && -z "$has_reaper_flag" && -t 0 ]]; then
        echo "Optional media tools are available (OpenRGB and REAPER)."

        read -r -p "Install OpenRGB? [y/N] " answer
        case "$answer" in
            [yY]|[yY][eE][sS]) install_openrgb="1" ;;
        esac

        read -r -p "Install REAPER? [y/N] " answer
        case "$answer" in
            [yY]|[yY][eE][sS]) install_reaper="1" ;;
        esac
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
        if command -v brew >/dev/null 2>&1; then
            if [[ "$install_openrgb" == "1" ]]; then
                brew install --cask openrgb || true
            fi
            if [[ "$install_reaper" == "1" ]]; then
                brew install --cask reaper || true
            fi
        else
            echo "Homebrew not found. Install media tools manually."
        fi
        return
    fi

    if [[ -x "$(command -v pacman)" ]]; then
        if [[ "$install_openrgb" == "1" ]]; then
            sudo pacman -S --needed openrgb || true
        fi
        if [[ "$install_reaper" == "1" ]]; then
            # REAPER is usually available via AUR.
            if [[ -x "$(command -v yay)" ]]; then
                yay -S --needed reaper || true
            else
                echo "yay not found; install REAPER manually."
            fi
        fi
    elif [[ -x "$(command -v apt-get)" ]]; then
        if [[ "$install_openrgb" == "1" ]]; then
            sudo apt-get update
            sudo apt-get install -y openrgb || true
        fi
        if [[ "$install_reaper" == "1" ]]; then
            echo "REAPER is not reliably available in APT repos. Install manually from reaper.fm."
        fi
    elif [[ -x "$(command -v yum)" ]]; then
        if [[ "$install_openrgb" == "1" ]]; then
            sudo yum install -y openrgb || true
        fi
        if [[ "$install_reaper" == "1" ]]; then
            echo "REAPER is not reliably available in YUM repos. Install manually from reaper.fm."
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
install_media_tools
