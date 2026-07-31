#!/usr/bin/env bash
# Open (or attach to) a tmux session with a fixed 5-pane layout:
# one tall pane on the left, and 4 stacked panes on the right.
set -euo pipefail

session_name="${1:-main}"

if tmux has-session -t "$session_name" 2>/dev/null; then
  if [[ -n "${TMUX:-}" ]]; then
    tmux switch-client -t "$session_name"
  else
    tmux attach-session -t "$session_name"
  fi
  exit 0
fi

tmux new-session -d -s "$session_name"
left=$(tmux display-message -p -t "$session_name" '#{pane_id}')

# Split off the right column.
right1=$(tmux split-window -h -p 25 -t "$left" -P -F '#{pane_id}')

# Stack the right column into 4 equal panes.
right2=$(tmux split-window -v -p 75 -t "$right1" -P -F '#{pane_id}')
right3=$(tmux split-window -v -p 66 -t "$right2" -P -F '#{pane_id}')
tmux split-window -v -p 50 -t "$right3"

tmux select-pane -t "$left"

if [[ -n "${TMUX:-}" ]]; then
  tmux switch-client -t "$session_name"
else
  tmux attach-session -t "$session_name"
fi
