function docker-stop
    echo "🛑 Stopping Docker daemon..."

    for service in docker docker.service containerd
        if systemctl is-active "$service" >/dev/null 2>&1
            echo "🛑 Stopping $service via systemctl..."
            if sudo systemctl stop "$service"
                echo "✅ $service stopped successfully"
                return 0
            end
        end
    end

    # If no systemctl service was active, look for manual dockerd processes.
    set -l dockerd_pids (ps aux | grep '[d]ockerd' | awk '{print $2}')

    if test -n "$dockerd_pids"
        echo "🔧 Found manual dockerd processes: $dockerd_pids"
        echo "🛑 Stopping dockerd processes..."

        for pid in $dockerd_pids
            echo "🛑 Stopping dockerd (PID: $pid)..."
            sudo kill -TERM "$pid" 2>/dev/null
        end

        sleep 3

        set -l remaining_pids (ps aux | grep '[d]ockerd' | awk '{print $2}')
        if test -n "$remaining_pids"
            echo "⚠️  Some dockerd processes still running, force killing..."
            for pid in $remaining_pids
                sudo kill -KILL "$pid" 2>/dev/null
            end
        end

        echo "✅ Docker daemon processes stopped"
        return 0
    end

    echo "ℹ️  No active Docker services or processes found"
    return 0
end
