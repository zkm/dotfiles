function plex-stop
    sudo systemctl stop plexmediaserver
    if systemctl is-active --quiet plexmediaserver
        echo "🚫 Failed to stop Plex Media Server"
        return 1
    else
        echo "⏹️  Plex Media Server stopped"
    end
end
