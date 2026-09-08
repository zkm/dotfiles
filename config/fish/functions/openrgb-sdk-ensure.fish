function openrgb-sdk-ensure --description 'Start OpenRGB SDK server in background when needed'
    if openrgb-sdk-running
        return 0
    end

    if rgb-verbose
        echo "⚙️ OpenRGB SDK server is not running. Starting it..."
    end

    # Clean up any stale server process before relaunching.
    pkill -f 'openrgb.*--server' >/dev/null 2>&1

    if command -v openrgb >/dev/null 2>&1
        nohup openrgb --noautoconnect --server --loglevel warning </dev/null >$OPENRGB_LOG_DIR/sdk.log 2>&1 &
        disown 2>/dev/null
    else if command -v flatpak >/dev/null 2>&1; and flatpak info org.openrgb.OpenRGB >/dev/null 2>&1
        nohup flatpak run org.openrgb.OpenRGB --noautoconnect --server --loglevel warning </dev/null >$OPENRGB_LOG_DIR/sdk.log 2>&1 &
        disown 2>/dev/null
    else
        echo "❌ OpenRGB command not found (native or Flatpak)." >&2
        return 1
    end

    # Wait briefly for the SDK socket to become reachable.
    set -l tries 0
    while test $tries -lt 30
        if openrgb-sdk-running
            if rgb-verbose
                echo "✅ OpenRGB SDK server started"
            end
            return 0
        end
        sleep 0.25
        set tries (math $tries + 1)
    end

    echo "❌ Failed to start OpenRGB SDK server. Check $OPENRGB_LOG_DIR/sdk.log" >&2
    return 1
end
