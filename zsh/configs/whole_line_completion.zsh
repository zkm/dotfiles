# Taken from gist by Claytron at:
# https://gist.githubusercontent.com/claytron/911043/raw/
# d0c81807d830f99a609df2ae71491ce0be7111bb/.zshrc

# Set up a sane modern history
setopt HIST_SAVE_NO_DUPS
setopt HIST_IGNORE_ALL_DUPS
setopt EXTENDED_HISTORY
HISTSIZE=50000
SAVEHIST=50000
HISTFILE=~/.zsh_history
export HISTFILE HISTSIZE SAVEHIST

# Look for a command that started like the one starting on the command line.
# taken from: http://www.xsteve.at/prg/zsh/.zshrc (not sure of original source)
function history-search-end {
    integer ocursor=$CURSOR

    if [[ $LASTWIDGET = history-beginning-search-*-end ]]; then
      # Last widget called set $hbs_pos.
      CURSOR=$hbs_pos
    else
      hbs_pos=$CURSOR
    fi

    if zle .${WIDGET%-end}; then
      # success, go to end of line
      zle .end-of-line
    else
      # failure, restore position
      CURSOR=$ocursor
      return 1
    fi
}

zle -N history-beginning-search-backward-end history-search-end
zle -N history-beginning-search-forward-end history-search-end

# bind this to ctrl+n and ctrl+p
bindkey "^N" history-beginning-search-backward-end
bindkey "^P" history-beginning-search-forward-end

# if you are using vi mode (bindkey -v), the following is for insert mode
bindkey -M viins "^N" history-beginning-search-backward-end
bindkey -M viins "^P" history-beginning-search-forward-end
