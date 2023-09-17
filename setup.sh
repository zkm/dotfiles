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
    brew install neofetch
}

install_with_pacman() {
    echo "Installing packages with Pacman..."
    sudo pacman -S --needed curl git tmux neovim the_silver_searcher nodejs neofetch
}

# Function to install packages using APT (Debian/Ubuntu)
install_with_apt() {
    echo "Installing packages with APT..."
    sudo apt-get update
    sudo apt-get install -y curl git tmux neovim the_silver_searcher nodejs neofetch
}

# Function to install packages using YUM (RHEL/CentOS)
install_with_yum() {
    echo "Installing packages with YUM..."
    sudo yum install -y curl git tmux neovim the_silver_searcher nodejs neofetch
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

setup_neovim
create_dotfiles
setup_vim_plug
install_copilot
