function vi
    if command -v nvim >/dev/null 2>&1
        command nvim $argv
    else
        vim $argv
    end
end
