function rgb-stop --description 'Emergency stop for all OpenRGB effect scripts'
    pkill -f "$OPENRGB_HOME/.*_openrgb.py" >/dev/null 2>&1
    sleep 0.2
    if command -v python3 >/dev/null 2>&1
        command python3 "$OPENRGB_HOME/off_openrgb.py" >/dev/null 2>&1
    else if command -v python >/dev/null 2>&1
        command python "$OPENRGB_HOME/off_openrgb.py" >/dev/null 2>&1
    end
    echo "🛑 RGB effects stopped and lights turned off"
end
