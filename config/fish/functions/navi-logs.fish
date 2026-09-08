function navi-logs
    set -l state_dir $XDG_STATE_HOME
    test -z "$state_dir"; and set state_dir ~/.local/state
    ls -lh $state_dir/navidrome/cleanup-*.log | tail -10
end
