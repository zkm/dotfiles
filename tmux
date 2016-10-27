# use zsh
set-option -g default-shell /bin/zsh

# improve colors
set -g default-terminal 'screen-256color'

# set Ctrl+S as prefix
set -g prefix2 C-s

# start window numbers at 1 to match keyboard order with tmux window order
set -g base-index 1
set-window-option -g pane-base-index 1

# navigation using vim-tmux-navigator
is_vim='echo "#{pane_current_command}" | grep -iqE "(^|\/)g?(view|n?vim?)(diff)?$"'
bind -n C-h if-shell "$is_vim" "send-keys C-h" "select-pane -L"
bind -n C-j if-shell "$is_vim" "send-keys C-j" "select-pane -D"
bind -n C-k if-shell "$is_vim" "send-keys C-k" "select-pane -U"
bind -n C-l if-shell "$is_vim" "send-keys C-l" "select-pane -R"
bind -n C-\ if-shell "$is_vim" "send-keys C-\\" "select-pane -l"

# commands for new splits, fixed so they make sense
bind | split-window -h -c '#{pane_current_path}'
bind - split-window -v -c '#{pane_current_path}'

# use vim keybindings in copy mode
setw -g mode-keys vi

# resizing splits
bind -n S-Left resize-pane -L 2
bind -n S-Right resize-pane -R 2
bind -n S-Down resize-pane -D 1
bind -n S-Up resize-pane -U 2
