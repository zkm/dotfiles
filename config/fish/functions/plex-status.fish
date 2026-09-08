function plex-status
    if systemctl is-active --quiet plexmediaserver
        echo "🟢 Plex Media Server is running"
    else
        echo "🔴 Plex Media Server is stopped"
    end
end
