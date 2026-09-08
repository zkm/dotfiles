function navi-logs-latest
    set -l state_dir $XDG_STATE_HOME
    test -z "$state_dir"; and set state_dir ~/.local/state
    cat (ls -t $state_dir/navidrome/cleanup-*.log 2>/dev/null | head -1)
end
