# List album directories that contain MP3s but no FLAC files (upgrade candidates)
# Usage: navi-mp3-only [path]
function navi-mp3-only
    set -l music_dir $argv[1]
    test -z "$music_dir"; and set music_dir /mnt/mars/navidrome/Music

    if string match -q '*:*' -- $music_dir
        set -l parts (string split -m1 ':' $music_dir)
        set -l remote_host $parts[1]
        set -l remote_path $parts[2]
        echo -e "🔍 MP3-only albums on '$remote_host' (no FLAC present):\n"
        ssh "$remote_host" "
      find '$remote_path' -mindepth 1 -maxdepth 3 -type d | while read -r dir; do
        mp3_count=\$(find \"\$dir\" -maxdepth 1 -type f -iname '*.mp3' | wc -l)
        flac_count=\$(find \"\$dir\" -maxdepth 1 -type f -iname '*.flac' | wc -l)
        if [ \"\$mp3_count\" -gt 0 ] && [ \"\$flac_count\" -eq 0 ]; then
          echo \"\${dir#$remote_path/} (\$mp3_count tracks)\"
        fi
      done | sort
    "
    else
        if not test -d "$music_dir"
            echo "❌ Music directory not found: $music_dir"
            return 1
        end
        echo -e "🔍 MP3-only albums (no FLAC present):\n"
        find "$music_dir" -mindepth 1 -maxdepth 3 -type d | while read dir
            set -l mp3_count (find "$dir" -maxdepth 1 -type f -iname "*.mp3" | wc -l)
            set -l flac_count (find "$dir" -maxdepth 1 -type f -iname "*.flac" | wc -l)
            if test "$mp3_count" -gt 0; and test "$flac_count" -eq 0
                echo (string replace -- "$music_dir/" '' $dir)" ($mp3_count tracks)"
            end
        end | sort
    end
end
