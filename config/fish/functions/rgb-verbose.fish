function rgb-verbose --description 'Set RGB_VERBOSE=1 to show detailed launcher status messages'
    set -l v $RGB_VERBOSE
    test -z "$v"; and set v 0
    test "$v" = "1"
end
