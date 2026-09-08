function rgb-stop-current-effect --description 'Stop any running RGB effect scripts before starting another one'
    if pgrep -f "$OPENRGB_HOME/.*_openrgb.py" >/dev/null 2>&1
        pkill -f "$OPENRGB_HOME/.*_openrgb.py" >/dev/null 2>&1
        sleep 0.2
        if rgb-verbose
            echo "🧹 Stopped active RGB effect before starting a new one"
        end
    end
end
