export ZSH=~/.oh-my-zsh
ZSH_THEME="corvae-ruby"
plugins=(git)
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
source $ZSH/oh-my-zsh.sh

export PATH="$PATH:/usr/local/sbin:$PATH"

alias showFiles='defaults write com.apple.finder AppleShowAllFiles YES; killall Finder /System/Library/CoreServices/Finder.app'
alias hideFiles='defaults write com.apple.finder AppleShowAllFiles NO; killall Finder /System/Library/CoreServices/Finder.app'
alias killFinder='killall Finder /System/Library/CoreServices/Finder.app'
alias gx='open -a GitX .'
alias rsrd='rails server -e remote_development'
alias killRuby='pkill -9 ruby'

rubies/ruby-2.3.0/bin:~/.rvm/bin:/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/MacGPG2/bin:~/.vimpkg/bin

export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting

#PHP Shell Version
export PATH=/usr/local/php5/bin:$PATH
