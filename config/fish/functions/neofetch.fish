function neofetch --description 'fastfetch if available, else real neofetch'
    if command -v fastfetch >/dev/null 2>&1
        fastfetch $argv
    else if command -v neofetch >/dev/null 2>&1
        command neofetch $argv
    else
        echo "❌ Neither fastfetch nor neofetch is installed." >&2
        return 1
    end
end
