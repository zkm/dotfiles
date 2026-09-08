function fd --description 'Some distros expose fd as fdfind'
    if command -v fd >/dev/null 2>&1
        command fd $argv
    else if command -v fdfind >/dev/null 2>&1
        command fdfind $argv
    else
        echo "❌ fd is not installed." >&2
        return 1
    end
end
