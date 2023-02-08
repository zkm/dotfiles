echo "Setting shell to zsh..."
chsh -s $(which zsh);

echo "Removing previous dotfiles..."
rm ~/.aliases ~/.gitconfig ~/.vimrc ~/.vimrc.plugs ~/.zshrc ~/.tmux.conf
rm -rf ~/.zsh ~/.bin

echo "Installing Homebrew... So sorry..."
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
eval "$(/opt/homebrew/bin/brew shellenv)"

echo "Using Homebrew to install tmux and neovim..."
brew update
brew install tmux
brew install neovim

echo "set runtimepath^=~/.vim runtimepath+=~/.vim/after" > ~/.config/init.vim
echo "let &packpath = &runtimepath" >> ~/.config/init.vim
echo "source ~/.vimrc" >> ~/.config/init.vim

echo "Creating symlinks to dotfiles in this directory..."
ln -s $(pwd)/aliases ~/.aliases
ln -s $(pwd)/bin ~/.bin
ln -s $(pwd)/gitconfig ~/.gitconfig
ln -s $(pwd)/tmux.conf ~/.tmux.conf
ln -s $(pwd)/zsh ~/.zsh
ln -s $(pwd)/zshrc ~/.zshrc
ln -s $(pwd)/zprofile ~/.zprofile
ln -s $(pwd)/vimrc ~/.vimrc
ln -s $(pwd)/vimrc.plugs ~/.vimrc.plugs

echo "Installing vim-plug and plugins for neovim..."
sh -c 'curl -fLo "${XDG_DATA_HOME:-$HOME/.local/share}"/nvim/site/autoload/plug.vim --create-dirs \
       https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'
nvim +PluginInstall +qall;
