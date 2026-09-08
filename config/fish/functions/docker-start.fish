function docker-start
    if docker info >/dev/null 2>&1
        echo "✅ Docker daemon is already running"
        return 0
    end

    echo "🐳 Starting Docker daemon..."

    if systemctl list-unit-files docker.service >/dev/null 2>&1
        set -l status_output (systemctl status docker.service 2>&1)
        if string match -q "*masked*" -- "$status_output"
            echo "🔓 Unmasking docker.service..."
            if sudo systemctl unmask docker.service
                echo "✅ Docker service unmasked"
                echo "🔧 Enabling docker.service..."
                sudo systemctl enable docker.service
                echo "Starting docker.service..."
                if sudo systemctl start docker.service
                    sleep 3
                    if docker info >/dev/null 2>&1
                        echo "✅ Docker daemon started successfully via systemctl"
                        return 0
                    end
                end
            end
        else
            echo "🚀 Attempting to start docker.service..."
            if sudo systemctl start docker.service
                sleep 3
                if docker info >/dev/null 2>&1
                    echo "✅ Docker daemon started successfully via systemctl"
                    return 0
                end
            end
        end
    end

    echo "⚠️  Systemctl approach failed, trying manual start..."
    echo "🔧 Starting dockerd manually..."

    if not command -v dockerd >/dev/null 2>&1
        echo "❌ dockerd not found in PATH"
        return 1
    end

    sudo dockerd >/tmp/docker.log 2>&1 &
    set -l dockerd_pid $last_pid

    echo "⏳ Waiting for Docker daemon to start (PID: $dockerd_pid)..."

    set -l count 0
    while test $count -lt 10
        if docker info >/dev/null 2>&1
            echo "✅ Docker daemon started successfully (manual)"
            echo "📋 Docker daemon running with PID: $dockerd_pid"
            echo "📝 Logs available at: /tmp/docker.log"
            return 0
        end
        sleep 1
        set count (math $count + 1)
    end

    echo "❌ Docker daemon failed to start within 10 seconds"
    echo "📝 Check logs at: /tmp/docker.log"
    kill $dockerd_pid 2>/dev/null
    return 1
end
