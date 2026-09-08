function fvim
    if not command -v fd >/dev/null 2>&1; or not command -v fzf >/dev/null 2>&1
        echo "❌ fvim requires both fd and fzf." >&2
        return 1
    end

    set -l search_dir $argv[1]
    test -z "$search_dir"; and set search_dir .

    # fzf --multi output is already one path per line, so this is naturally
    # a fish list — no need for bash's read-loop-into-array dance.
    set -l selection (fd --type f --hidden --follow --exclude .git . $search_dir | fzf --multi --height=50% --reverse)
    test (count $selection) -eq 0; and return

    vim $selection
end
