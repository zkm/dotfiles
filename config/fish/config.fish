set -gx PATH /usr/local/sbin /usr/local/bin /usr/bin /bin /usr/sbin /sbin $PATH

# Disable fish's default startup greeting.
set -g fish_greeting

if status is-interactive
    if command -sq fastfetch
        fastfetch
    end
end

if set -q PROMPT_BACKEND
    set -gx PROMPT_BACKEND $PROMPT_BACKEND
else
    set -gx PROMPT_BACKEND starship
end
set -gx PYENV_ROOT $HOME/.pyenv
set -gx RBENV_ROOT $HOME/.rbenv
set -gx BUN_INSTALL $HOME/.bun
set -gx NVM_DIR $HOME/.nvm
set -gx EDITOR nvim
set -gx VISUAL nvim
set -gx SYSTEMD_EDITOR nvim
set -gx PATH $HOME/.opencode/bin $PATH

if command -sq fish_add_path
    fish_add_path -g $HOME/.local/bin $HOME/scripts $HOME/.config/composer/vendor/bin $RBENV_ROOT/bin $PYENV_ROOT/bin $BUN_INSTALL/bin
else
    set -gx PATH $HOME/.local/bin $HOME/scripts $HOME/.config/composer/vendor/bin $RBENV_ROOT/bin $PYENV_ROOT/bin $BUN_INSTALL/bin $PATH
end

if command -sq dircolors; and test -f "$HOME/.dotfiles/dircolors"
    set -l ls_colors (dircolors -b "$HOME/.dotfiles/dircolors" | string match -r --groups-only "LS_COLORS='([^']*)'")
    if test -n "$ls_colors"
        set -gx LS_COLORS "$ls_colors"
    end
end

if command -sq zoxide
    zoxide init fish --cmd j | source
end

if command -sq pyenv
    pyenv init - fish | source
end

if command -sq rbenv
    rbenv init - fish | source
end

# nvm is a bash script; this wrapper keeps fish env in sync after nvm commands.
if test -s "$NVM_DIR/nvm.sh"; and not functions -q nvm
    function nvm --description 'Node Version Manager wrapper for fish'
        set -l __nvm_state_file (mktemp)
        set -l __nvm_args (string join ' ' -- (string escape -- $argv))

        bash -lc "export NVM_DIR=\"$NVM_DIR\"; . \"$NVM_DIR/nvm.sh\"; nvm $__nvm_args; __nvm_rc=\$?; { printf 'PATH=%s\n' \"\$PATH\"; printf 'NVM_BIN=%s\n' \"\${NVM_BIN:-}\"; printf 'NVM_INC=%s\n' \"\${NVM_INC:-}\"; printf 'RC=%s\n' \"\$__nvm_rc\"; } > \"$__nvm_state_file\"; exit \$__nvm_rc"

        set -l __nvm_cmd_rc $status

        if test -r "$__nvm_state_file"
            for __nvm_line in (cat "$__nvm_state_file")
                set -l __nvm_pair (string split -m 1 '=' -- "$__nvm_line")
                set -l __nvm_key $__nvm_pair[1]
                set -l __nvm_value $__nvm_pair[2]

                switch "$__nvm_key"
                    case PATH
                        if test -n "$__nvm_value"
                            set -gx PATH (string split ':' -- "$__nvm_value")
                        end
                    case NVM_BIN
                        if test -n "$__nvm_value"
                            set -gx NVM_BIN "$__nvm_value"
                        else
                            set -e NVM_BIN
                        end
                    case NVM_INC
                        if test -n "$__nvm_value"
                            set -gx NVM_INC "$__nvm_value"
                        else
                            set -e NVM_INC
                        end
                end
            end
            rm -f "$__nvm_state_file"
        end

        return $__nvm_cmd_rc
    end
end

if test "$PROMPT_BACKEND" = "starship"; and command -sq starship
    starship init fish | source
end

if command -sq eza
    alias l='eza --icons --group-directories-first --all'
    alias ll='eza -lh --icons --group-directories-first'
    alias la='eza -la --icons --group-directories-first'
    alias lt='eza -la --icons --group-directories-first --sort=modified'
    alias tree='eza --tree --icons --group-directories-first'
else
    alias l='ls -la'
    alias ll='ls -l'
    alias la='ls -A'
    alias lt='ls -lt'
end

alias c='clear'
alias work='cd ~/Documents/work/'
alias dev='cd ~/Developer/'
alias reload='exec fish'
alias v='nvim'

if command -sq rg
    alias search='rg --smart-case --hidden --glob !.git'
end

if command -sq fd
    alias ff='fd --hidden --follow --exclude .git'
else if command -sq fdfind
    alias ff='fdfind --hidden --follow --exclude .git'
end

if command -sq jq
    alias json='jq .'
end

if command -sq btop
    alias bt='btop'
end

if command -sq git
    alias g='git'
    alias gst='git status -sb'
    alias ga='git add'
    alias gaa='git add --all'
    alias gc='git commit'
    alias gcm='git commit -m'
    alias gca='git commit --amend'
    alias gd='git diff'
    alias gds='git diff --staged'
    alias gl='git pull'
    alias gp='git push'
    alias gps='git push'
    alias gco='git checkout'
    alias gb='git branch'
    alias glog='git log --oneline --graph --decorate --all'
end
