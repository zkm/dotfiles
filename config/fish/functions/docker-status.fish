function docker-status
    echo "=== Docker Daemon Status ==="
    if docker info >/dev/null 2>&1
        echo "✅ Docker daemon is running"
        docker version --format 'Client: {{.Client.Version}}, Server: {{.Server.Version}}' 2>/dev/null; or echo "Version info unavailable"
    else
        echo "❌ Docker daemon is not accessible"
    end

    echo -e "\n=== Systemctl Services ==="
    for service in docker.service containerd.service
        if systemctl list-unit-files "$service" >/dev/null 2>&1
            set -l service_status (systemctl is-active "$service" 2>/dev/null)
            test -z "$service_status"; and set service_status inactive

            set -l masked_info ""
            if systemctl status "$service" 2>&1 | grep -q "masked"
                set masked_info " (masked)"
            end

            echo "  $service: $service_status$masked_info"
        end
    end
end
