function fcd
    if not command -v fd >/dev/null 2>&1; or not command -v fzf >/dev/null 2>&1
        echo "❌ fcd requires both fd and fzf." >&2
        return 1
    end

    set -l search_dir $argv[1]
    test -z "$search_dir"; and set search_dir .

    set -l dir (fd --type d --hidden --follow --exclude .git . $search_dir | fzf --height=40% --reverse)
    test -n "$dir"; and cd $dir
end
