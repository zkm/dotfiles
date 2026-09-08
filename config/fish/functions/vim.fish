function vim
    if command -v nvim >/dev/null 2>&1
        command nvim $argv
    else if command -v vim >/dev/null 2>&1
        command vim $argv
    else
        echo "❌ No 'nvim' or 'vim' installed." >&2
        return 1
    end
end
