function imgcat --description 'Kitty image viewer helper (requires kitty + kitten icat)'
    set -l icat_cmd
    if command -v kitten >/dev/null 2>&1
        set icat_cmd kitten icat
    else if command -v kitty >/dev/null 2>&1
        set icat_cmd kitty +kitten icat
    else
        echo "❌ kitty/kitten is not installed." >&2
        return 1
    end

    if test (count $argv) -eq 0
        echo "Usage: imgcat <image-file> [more-image-files...]" >&2
        return 1
    end

    $icat_cmd $argv
end
