function docker-log
    for service in docker docker.service containerd
        if systemctl list-unit-files "$service" >/dev/null 2>&1
            echo "📋 Showing logs for $service..."
            sudo journalctl -u "$service" -f --no-pager
            return $status
        end
    end
    echo "❌ No Docker service found for logging"
end
