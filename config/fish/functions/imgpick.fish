function imgpick
    if not command -v fd >/dev/null 2>&1; or not command -v fzf >/dev/null 2>&1
        echo "❌ imgpick requires both fd and fzf." >&2
        return 1
    end

    set -l search_dir $argv[1]
    test -z "$search_dir"; and set search_dir .

    set -l file (fd --type f --hidden --follow --exclude .git --glob '*.{png,jpg,jpeg,gif,webp,bmp}' . $search_dir | fzf --height=50% --reverse)
    test -n "$file"; and imgcat $file
end
