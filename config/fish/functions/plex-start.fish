function plex-start
    sudo systemctl start plexmediaserver
    if systemctl is-active --quiet plexmediaserver
        echo "▶️  Plex Media Server started"
    else
        echo "🚫 Failed to start Plex Media Server"
        return 1
    end
end
