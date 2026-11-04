# Fall back to fish's $hostname only where no hostname binary exists (e.g. a
# minimal Arch install without inetutils), so flags like -f still work normally.
function hostname --wraps hostname
    if command -q hostname
        command hostname $argv
    else
        echo $hostname
    end
end
