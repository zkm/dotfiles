function rgb-effect --description 'Run OpenRGB effect scripts from this config directory'
    set -l script_name $argv[1]
    set -e argv[1]
    set -l run_mode bg

    if test "$argv[1]" = "--fg"
        set run_mode fg
        set -e argv[1]
    end

    if test -z "$script_name"
        echo "Usage: rgb-effect <blizzard|matrix|rainbow|off> [--fg] [args...]"
        return 1
    end

    if not openrgb-sdk-ensure
        return 1
    end

    # Prevent multiple effects from fighting each other.
    rgb-stop-current-effect

    set -l script "$OPENRGB_HOME/$script_name""_openrgb.py"
    if not test -f "$script"
        echo "❌ Effect script not found: $script" >&2
        return 1
    end

    set -l py_exec ""
    if command -v python3 >/dev/null 2>&1
        set py_exec python3
    else if command -v python >/dev/null 2>&1
        set py_exec python
    end

    if test -z "$py_exec"
        echo "❌ Python is not installed." >&2
        return 1
    end

    if test "$run_mode" = "fg"
        command $py_exec $script $argv
        return $status
    end

    set -l log_file "$OPENRGB_LOG_DIR/$script_name.log"
    true >$log_file
    nohup $py_exec $script $argv </dev/null >$log_file 2>&1 &
    set -l pid $last_pid
    disown 2>/dev/null

    switch $script_name
        case matrix
            echo "🐇  The Matrix has you... Follow the white rabbit."
        case blizzard
            echo "🐺 Winter is coming... and your LEDs know it."
        case rainbow
            echo "🌈 Follow the yellow brick glow."
    end

    if rgb-verbose
        echo "✅ Started rgb-$script_name in background (PID: $pid)"
        echo "📄 Log: $log_file"
    end
end
