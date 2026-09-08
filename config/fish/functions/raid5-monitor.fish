function raid5-monitor --description 'Monitor RAID health in real-time (detailed)'
    if not command -v mdadm >/dev/null 2>&1
        echo "❌ mdadm is not installed." >&2
        return 1
    end

    if not test -e /dev/md127
        echo "❌ No RAID device found at /dev/md127" >&2
        return 1
    end

    echo "📈 === Real-Time RAID Monitor (Ctrl+C to exit) ==="
    sudo mdadm --monitor --delay=60 /dev/md127
end
