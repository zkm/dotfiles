function yay --description 'System Python for yay (Arch Linux) — real function so $PATH is re-read live'
    # `command -v`/`command -s` in fish only look at real PATH executables
    # (unlike bash's, they ignore functions), so this correctly checks for
    # the actual yay binary rather than finding this function itself.
    if not command -v yay >/dev/null 2>&1
        echo "❌ yay is not installed." >&2
        return 1
    end
    env PATH="/usr/bin:"(string join ':' $PATH) command yay $argv
end
