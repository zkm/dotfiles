#/bin/bash

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
    sudo rm ~/.aliases ~/.gitconfig ~/.vimrc ~/.vimrc.plugs ~/.zshrc ~/.tmux.conf
    sudo rm -rf ~/.zsh ~/.bin
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
    brew install tmux
    brew install neovim
    brew install the_silver_searcher
    brew install node
    brew install fastfetch
}

install_with_pacman() {
    echo "Installing packages with Pacman..."
    sudo pacman -S --needed curl git tmux neovim the_silver_searcher nodejs fastfetch
}

# Function to install packages using APT (Debian/Ubuntu)
install_with_apt() {
    echo "Installing packages with APT..."
    sudo apt-get update
    sudo apt-get install -y curl git tmux neovim the_silver_searcher nodejs fastfetch
}

# Function to install packages using YUM (RHEL/CentOS)
install_with_yum() {
    echo "Installing packages with YUM..."
    sudo yum install -y curl git tmux neovim the_silver_searcher nodejs fastfetch
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

function create_dotfiles() {
    echo "Creating dotfiles..."
    ln -s $(pwd)/aliases ~/.aliases
    ln -s $(pwd)/gitconfig ~/.gitconfig
    ln -s $(pwd)/vimrc ~/.vimrc
    ln -s $(pwd)/vimrc.plugs ~/.vimrc.plugs
    ln -s $(pwd)/zsh ~/.zsh
    ln -s $(pwd)/bin ~/.bin
    ln -s $(pwd)/zshrc ~/.zshrc
    ln -s $(pwd)/tmux.conf ~/.tmux.conf
    ln -s $(pwd)/p10k.zsh ~/.p10k.zsh
    ln -s $(pwd)/zprofile ~/.zprofile
}

function setup_p10k() {
    git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/.powerlevel10k
    
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
    if [[ -d ~/.config/nvim/pack/github/start/copilot.vim ]]; then
        echo "Installing Github copilot..."
        git clone https://github.com/github/copilot.vim.git ~/.config/nvim/pack/github/start/copilot.vim
        nvim +Copilot +setup
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
    
    # Example: Install Fira Code fonts
    if [[ -d "fonts/Fira_Code" ]]; then
        echo "Installing Fira Code fonts..."
        mkdir -p ~/.local/share/fonts/Fira_Code
        cp -r fonts/Fira_Code/* ~/.local/share/fonts/Fira_Code/
    fi

    # Example: Install MesloLGS NF fonts
    if [[ -d "fonts/MesloLGS NF" ]]; then
        echo "Installing MesloLGS NF fonts..."
        mkdir -p ~/.local/share/fonts/MesloLGS_NF
        cp -r fonts/MesloLGS\ NF/* ~/.local/share/fonts/MesloLGS_NF/
    fi
    
    # Add more font installations as needed
    
    # Refresh the font cache (Linux)
    if [[ -x "$(command -v fc-cache)" ]]; then
        fc-cache -f -v
    fi
    
    echo "Fonts installed successfully."
}

setup_neovim
create_dotfiles
setup_p10k
setup_vim_plug
install_copilot
install_fonts
