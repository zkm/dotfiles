# Fish port of ~/.dotfiles/aliases (bash/zsh only — fish can't source that
# file directly). Keep both in sync by hand when adding/removing aliases;
# the more involved logic (docker-*, raidview, navidrome-*, etc.) lives in
# ../functions/ instead of here. `unalias`/`unset -f` guards from the
# original (there to dodge Oh My Zsh/distro-default collisions) are omitted
# since fish ships no such conflicting defaults.

# ==============================
# Basic Commands / eza (modern ls replacement)
# ==============================
if command -v eza >/dev/null 2>&1
    alias l 'eza --icons=always --group-directories-first --all'
    alias ll 'eza -lh --icons=always --group-directories-first'
    alias la 'eza -la --icons=always --group-directories-first'
    alias lt 'eza -la --icons=always --group-directories-first --sort=modified'
    alias lat 'eza -la --icons=always --group-directories-first --sort=modified'
    alias tree 'eza --tree --icons=always --group-directories-first'
    # ls itself needs the "-s/--sort passthrough" logic; see functions/ls.fish.
else
    alias ls 'ls --color=auto'
    alias ll 'ls --color=auto -l'
    alias la 'ls --color=auto -la'
    alias lt 'ls --sort=time'
    alias lat 'ls --color=auto -la --sort=time'
end
alias c 'clear'

# ==============================
# Directory Shortcuts
# ==============================
alias work 'cd ~/Documents/work/'
alias dev 'cd ~/Developer/'
# ".." / "..." are already fish defaults (cd .. / cd ../..); no alias needed.

if command -v zoxide >/dev/null 2>&1
    zoxide init fish --cmd j | source
end

# ==============================
# Editor Preferences
# ==============================
alias v 'nvim'

# ==============================
# Modern CLI Shortcuts
# ==============================
if command -v bat >/dev/null 2>&1
    alias catp 'bat --style=plain --paging=never'
    alias preview 'bat --style=numbers --color=always --paging=never'
else
    alias catp 'cat'
    alias preview 'cat -n'
end

if command -v rg >/dev/null 2>&1
    alias search 'rg --smart-case --hidden --glob "!.git"'
end

if command -v jq >/dev/null 2>&1
    alias json 'jq .'
end

if command -v btop >/dev/null 2>&1
    alias bt 'btop'
end

if command -v fd >/dev/null 2>&1
    alias ff 'fd --hidden --follow --exclude .git'
end

alias img 'imgcat'

# ==============================
# System Info & Utilities
# ==============================
alias meminfo 'zramctl && free -h'

# ==============================
# OpenRGB configuration defaults
# ==============================
# (override in ~/.config/fish/aliases.local.fish before this file loads, or
# export them as universal variables — conf.d files load in alpha order, so
# a file named e.g. 00-openrgb-overrides.fish would load first)
if not set -q OPENRGB_HOME
    set -gx OPENRGB_HOME (test -n "$XDG_CONFIG_HOME"; and echo $XDG_CONFIG_HOME/OpenRGB; or echo $HOME/.config/OpenRGB)
end
if not set -q OPENRGB_LOG_DIR
    set -gx OPENRGB_LOG_DIR (test -n "$XDG_STATE_HOME"; and echo $XDG_STATE_HOME/openrgb; or echo $HOME/.local/state/openrgb)
end
if not set -q OPENRGB_SDK_HOST
    set -gx OPENRGB_SDK_HOST 127.0.0.1
end
if not set -q OPENRGB_SDK_PORT
    set -gx OPENRGB_SDK_PORT 6742
end
mkdir -p "$OPENRGB_LOG_DIR" >/dev/null 2>&1

alias rgb-blizzard 'rgb-effect blizzard'
alias rgb-matrix 'rgb-effect matrix'
alias rgb-rainbow 'rgb-effect rainbow'
alias rgb-off 'rgb-effect off'

# System Python for yay (Arch Linux) — see functions/yay.fish. Unlike fish's
# `alias` builtin, that's a real function so $PATH is re-read on every call
# instead of being frozen to its value when this file was sourced.

# ==============================
# TMUX Management
# ==============================
alias tl 'tmux list-sessions'
alias tk 'tmux kill-session -t'
alias ta 'tmux attach -t'
alias tn 'tmux new-session -s'
alias t5 "$HOME/.bin/tmux-5pane.sh"

# ==============================
# Git Shortcuts
# ==============================
alias g 'git'
alias gco 'git checkout'
alias gb 'git branch'
alias gc 'git commit'
alias gca 'git commit -a'
alias gcm 'git commit -m'
alias gst 'git status'
alias gp 'git pull'
alias gps 'git push'
alias gl 'git log --oneline --graph'
alias gd 'git diff'

# ==============================
# Music Library Management
# ==============================
alias sync-local-music 'rsync -avh --progress ~/Music/ /mnt/mars/navidrome/Music/ | tee ~/syncmusic.log'
alias naviscan 'docker restart navidrome && sleep 5 && docker exec navidrome /app/navidrome scan'
alias naviscan-server "ssh do-navipi 'docker restart navidrome && sleep 5 && docker exec navidrome /app/navidrome scan'"
alias naviscan-full-server "ssh do-navipi 'docker exec navidrome /app/navidrome scan --full'"

alias navi-cleanup 'navidrome-cleanup-duplicates'
alias navi-cleanup-force 'navidrome-cleanup-duplicates --force'
alias navi-cleanup-server 'navidrome-cleanup-duplicates "do-navipi:/media/zkm/NapsterX/Music"'
alias navi-cleanup-server-force 'navidrome-cleanup-duplicates "do-navipi:/media/zkm/NapsterX/Music" --force'
# navi-logs / navi-logs-latest are functions (need the same $XDG_STATE_HOME
# default-fallback logic as the navidrome-* functions) — see functions/.

alias navi-playlists-rebuild 'navidrome-rebuild-playlists'
alias navi-playlists-rebuild-force 'navidrome-rebuild-playlists --force'
alias navi-playlists-rebuild-server 'navidrome-rebuild-playlists "do-navipi:/media/zkm/NapsterX/Music"'
alias navi-playlists-rebuild-server-force 'navidrome-rebuild-playlists "do-navipi:/media/zkm/NapsterX/Music" --force'

alias navi-mp3-only-server 'navi-mp3-only "do-navipi:/media/zkm/NapsterX/Music"'

alias syncipod 'rsync -avh --progress --ignore-existing --delete /mnt/mars/navidrome/Music_iPod/ /run/media/$USER/IPOD/Music/'

alias dryrun-music 'rsync -avh --progress --delete --dry-run /mnt/mars/NapsterX/Music/ do-navipi:/media/zkm/NapsterX/Music/'
alias sync-music 'rsync -avh --progress --delete /mnt/mars/NapsterX/Music/ do-navipi:/media/zkm/NapsterX/Music/'

# ==============================
# Docker
# ==============================
alias docker-clean 'docker system prune -af --volumes'
alias docker-list 'docker ps -a'
alias docker-images 'docker images -a'
alias docker-rmi 'docker rmi'
alias docker-rm 'docker rm'
alias docker-stopall 'docker stop (docker ps -q)'
alias docker-rmall 'docker rm (docker ps -a -q)'
alias docker-build 'docker build -t'
alias docker-compose-up 'docker-compose up -d'
alias docker-compose-down 'docker-compose down'
alias docker-compose-log 'docker-compose logs -f --tail=100'
alias docker-compose-restart 'docker-compose down && docker-compose up -d'
alias docker-inspect 'docker inspect'

# ==============================
# Web Server Management
# ==============================
alias nginx-start 'sudo systemctl start nginx'
alias nginx-stop 'sudo systemctl stop nginx'
alias nginx-restart 'sudo systemctl restart nginx'
alias nginx-status 'sudo systemctl status nginx'
alias nginx-test 'sudo nginx -t'
alias nginx-reload 'sudo systemctl reload nginx'

alias php-start 'sudo systemctl start php-fpm'
alias php-stop 'sudo systemctl stop php-fpm'
alias php-restart 'sudo systemctl restart php-fpm'
alias php-status 'sudo systemctl status php-fpm'
alias php-reload 'sudo systemctl reload php-fpm'

alias mariadb-start 'sudo systemctl start mariadb'
alias mariadb-stop 'sudo systemctl stop mariadb'
alias mariadb-restart 'sudo systemctl restart mariadb'
alias mariadb-status 'sudo systemctl status mariadb'
alias mysql-root 'mariadb -u root -p'

alias web-start 'sudo systemctl start nginx php-fpm mariadb'
alias web-stop 'sudo systemctl stop nginx php-fpm mariadb'
alias web-restart 'sudo systemctl restart nginx php-fpm mariadb'
alias web-status 'sudo systemctl status nginx php-fpm mariadb'

alias mysql-dump 'mysqldump -u root -p --all-databases > ~/mariadb_backup_(date +%Y%m%d_%H%M%S).sql'
alias mysql-restore 'mariadb -u root -p < ~/mariadb_backup.sql'

# ==============================
# CakePHP Development (Docker)
# ==============================
alias fpm 'docker-compose exec -u (id -u):(id -g) php-fpm'
alias cake 'docker-compose exec -u (id -u):(id -g) php-fpm bin/cake'
alias composer-fpm 'docker-compose exec -u (id -u):(id -g) php-fpm composer'

# ==============================
# OLLAMA aliases (GPU + CPU)
# ==============================
# `nocorrect` is a zsh-ism (autocorrect prefix) with no fish equivalent —
# fish has no command autocorrection to suppress, so it's omitted.
alias ollama-list 'ollama list'
alias ollama-remove 'ollama rm'
alias ollama-clean-safe 'ollama list | awk "NR>1 {print \$1}" | fzf --multi | xargs -r -n1 ollama rm'

alias ai 'env OLLAMA_NUM_GPU=0 ollama run llama3'
alias chat 'env OLLAMA_NUM_GPU=0 ollama run llama3'
alias code-ai 'env OLLAMA_NUM_GPU=0 ollama run codellama'
alias fast-ai 'env OLLAMA_NUM_GPU=0 ollama run mistral'
alias chill-ai 'env OLLAMA_NUM_GPU=0 ollama run gemma3'

alias llama3 'env OLLAMA_NUM_GPU=0 ollama run llama3'
alias codellama 'env OLLAMA_NUM_GPU=0 ollama run codellama'
alias mistral 'env OLLAMA_NUM_GPU=0 ollama run mistral'
alias gemma 'env OLLAMA_NUM_GPU=0 ollama run gemma3'

alias llama3-stream 'env OLLAMA_NUM_GPU=0 ollama run --stream llama3'
alias codellama-stream 'env OLLAMA_NUM_GPU=0 ollama run --stream codellama'
alias mistral-stream 'env OLLAMA_NUM_GPU=0 ollama run --stream mistral'
alias gemma-stream 'env OLLAMA_NUM_GPU=0 ollama run --stream gemma3'

alias llama3-info 'ollama show llama3'
alias codellama-info 'ollama show codellama'
alias mistral-info 'ollama show mistral'
alias gemma-info 'ollama show gemma3'

alias ollama-gpu 'ollama ps && rocm-smi --showuse --showmemuse'
