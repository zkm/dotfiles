function raid6check --description 'Friendly wrapper: bare raid6check (no args) points at our RAID-5 array'
    if not command -v raid6check >/dev/null 2>&1
        echo "❌ raid6check is not installed." >&2
        return 1
    end

    if test (count $argv) -eq 0
        echo "ℹ️  raid6check only supports RAID-6; /dev/md127 is RAID-5."
        echo "   Running raid5-parity-check instead..."
        raid5-parity-check
        return
    end

    command raid6check $argv
end
