function ls --description 'eza-backed ls, falling back to real ls for -s/--sort flags eza handles differently'
    for arg in $argv
        if string match -rq -- '^-[a-z]*s[a-z]*$' $arg; or string match -q -- '*--sort*' $arg
            command ls --color=auto $argv
            return
        end
    end
    eza --icons=always --group-directories-first $argv
end
