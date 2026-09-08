function raid5-parity-check --description 'Start RAID parity consistency check (read-only kernel scrub, runs in background)'
    set -l sync_action_file /sys/block/md127/md/sync_action
    set -l mismatch_file /sys/block/md127/md/mismatch_cnt

    if not test -e /dev/md127
        echo "❌ No RAID device found at /dev/md127" >&2
        return 1
    end

    if not test -e "$sync_action_file"
        echo "❌ $sync_action_file not found." >&2
        return 1
    end

    set -l current_action (cat "$sync_action_file" 2>/dev/null)
    if test "$current_action" != idle
        echo "⚠️  RAID is already busy (sync_action: $current_action). Aborting." >&2
        return 1
    end

    echo "🔎 === Starting RAID Parity Check (/dev/md127, full array, read-only) ==="
    echo check | sudo tee "$sync_action_file" >/dev/null

    echo "✅ Check started in the background."
    echo "   Monitor progress: raid5-sync  (or cat /proc/mdstat)"
    echo "   Mismatch count when finished: cat $mismatch_file"
end
