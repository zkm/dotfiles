function matrix
    if command -v cmatrix >/dev/null 2>&1
        command cmatrix $argv
    else
        echo "❌ cmatrix is not installed." >&2
        return 1
    end
end
