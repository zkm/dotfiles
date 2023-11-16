source .p10k.zsh

eval "$(/opt/homebrew/bin/brew shellenv)"
typeset -g POWERLEVEL10K_INSTANT_PROMPT=off
neofetch
# fortune | cowsay -f tux

export PATH="$HOME/.composer/vendor/bin:$PATH"
export PATH="/opt/homebrew/bin:$PATH"
export PATH="/Applications/XAMPP/bin:$PATH"
export PATH="/opt/homebrew/opt/php@8.1/bin:$PATH"
