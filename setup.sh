# Set shell to ZSH by default
brew install zsh;
chsh -s $(which zsh);

# Install asdf
brew install asdf;

# Remove existing files that might clash with symlinks
rm ~/.aliases ~/.gitconfig ~/.vimrc ~/.vimrc.plugs ~/.zshrc ~/.tmux.conf
rm -rf ~/.zsh ~/.bin

# Create symlinks
ln -s $(pwd)/aliases ~/.aliases
ln -s $(pwd)/gitconfig ~/.gitconfig
ln -s $(pwd)/vimrc ~/.vimrc
ln -s $(pwd)/vimrc.plugs ~/.vimrc.plugs
ln -s $(pwd)/zsh ~/.zsh
ln -s $(pwd)/bin ~/.bin
ln -s $(pwd)/zshrc ~/.zshrc
ln -s $(pwd)/tmux.conf ~/.tmux.conf

# Install vim-plug
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
      https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim;
vim +PluginInstall +qall;
