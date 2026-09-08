function raid5-sync --description 'RAID synchronization status (real-time)'
    if not command -v mdadm >/dev/null 2>&1
        echo "❌ mdadm is not installed." >&2
        return 1
    end

    if not test -e /dev/md127
        echo "❌ No RAID device found at /dev/md127" >&2
        return 1
    end

    if not command -v watch >/dev/null 2>&1
        echo "❌ watch command is not installed." >&2
        return 1
    end

    echo "📊 === Watching RAID Sync Status (Ctrl+C to exit) ==="
    watch -n 1 'cat /proc/mdstat'
end
