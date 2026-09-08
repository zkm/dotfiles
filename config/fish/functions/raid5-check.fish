function raid5-check --description 'RAID5 health check (read-only)'
    if not command -v mdadm >/dev/null 2>&1
        echo "❌ mdadm is not installed." >&2
        return 1
    end

    if not test -e /dev/md127
        echo "❌ No RAID device found at /dev/md127" >&2
        return 1
    end

    echo "🔍 === RAID5 Health Check (/dev/md127) ==="
    sudo mdadm --detail /dev/md127 | head -20
end
