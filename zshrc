# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# History in cache directory:
HISTSIZE=10000
SAVEHIST=10000
HISTFILE=~/.cache/zsh/history

# Source aliases.
[[ -f ~/.aliases ]] && source ~/.aliases

# theme/plugins
source ~/.dotfiles/powerlevel10k/powerlevel10k.zsh-theme
source ${HOMEBREW_PREFIX}/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
source ${HOMEBREW_PREFIX}/share/zsh-autosuggestions/zsh-autosuggestions.zsh

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

# Load NVM
export NVM_DIR="$HOME/.nvm"

# This loads nvm
[ -s "${HOMEBREW_PREFIX}/nvm/nvm.sh" ] && \. "${HOMEBREW_PREFIX}/nvm/nvm.sh"  

 # This loads nvm bash_completion
[ -s "${HOMEBREW_PREFIX}/nvm/etc/bash_completion.d/nvm" ] && \. "${HOMEBREW_PREFIX}/nvm/etc/bash_completion.d/nvm" 

# Makes color constants available
autoload -U colors
colors

# Enable colored output from ls, etc. on FreeBSD-based systems
export CLICOLOR=1

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
