# Remove duplicate MP3s where FLAC versions exist (FLAC-primary with MP3 fallback)
# Logs saved to: ~/.local/state/navidrome/cleanup-*.log
# Handles different naming conventions (e.g., "01 - Title.mp3" vs "01 Title.flac")
# Usage: navidrome-cleanup-duplicates [path] [--force]
function navidrome-cleanup-duplicates
    set -l music_dir $argv[1]
    test -z "$music_dir"; and set music_dir /mnt/mars/navidrome/Music
    set -l dry_run true
    set -l log_dir $XDG_STATE_HOME
    test -z "$log_dir"; and set log_dir ~/.local/state
    set log_dir "$log_dir/navidrome"
    set -l timestamp (date +%Y%m%d_%H%M%S)
    set -l log_file "$log_dir/cleanup-$timestamp.log"

    mkdir -p "$log_dir" 2>/dev/null

    if test "$argv[2]" = "--force"
        set dry_run false
    else if test "$argv[1]" = "--force"
        set dry_run false
    end

    # Helper to normalize filenames for comparison — strips leading track
    # numbers and extra dashes/spaces, then lowercases.
    function normalize_name
        set -l name $argv[1]
        set name (echo "$name" | sed -E 's/^[0-9]+[[:space:]]*[-–—]?[[:space:]]*//i')
        echo "$name" | tr '[:upper:]' '[:lower:]'
    end

    begin
        if test "$dry_run" = false
            echo "🔥 Running in FORCE mode - files will be deleted"
        else
            echo "🔍 Running in DRY-RUN mode - no files will be deleted"
            if string match -q '*:*' -- $music_dir
                echo "   Use 'navidrome-cleanup-duplicates \"$music_dir\" --force' to actually delete files"
            else
                echo "   Use 'navidrome-cleanup-duplicates --force' to actually delete files"
            end
        end

        if string match -q '*:*' -- $music_dir
            set -l parts (string split -m1 ':' $music_dir)
            set -l remote_host $parts[1]
            set -l remote_path $parts[2]

            echo -e "\n📊 Scanning remote server '$remote_host' for duplicate MP3s with FLAC versions...\n"

            # Remote payload stays bash — it runs on the remote host's shell,
            # not fish. \$ keeps remote-side expansions literal here; bare
            # $remote_path/$dry_run are expanded locally before sending, same
            # as the original bash version.
            ssh "$remote_host" "
        normalize_name() {
          local name=\"\$1\"
          name=\$(echo \"\$name\" | sed -E 's/^[0-9]+[[:space:]]*[-–—]?[[:space:]]*//i')
          echo \"\$name\" | tr '[:upper:]' '[:lower:]'
        }

        find '$remote_path' -maxdepth 3 -type f -iname '*.mp3' | while read -r mp3_file; do
          mp3_base=\"\${mp3_file%.*}\"
          mp3_name=\$(normalize_name \"\$(basename \"\$mp3_base\")\")

          mp3_dir=\"\$(dirname \"\$mp3_file\")\"

          found_flac=false
          while IFS= read -r flac_file; do
            flac_base=\"\${flac_file%.*}\"
            flac_name=\$(normalize_name \"\$(basename \"\$flac_base\")\")

            if [ \"\$mp3_name\" = \"\$flac_name\" ]; then
              found_flac=true
              break
            fi
          done < <(find \"\$mp3_dir\" -maxdepth 1 -type f -iname '*.flac')

          if [ \"\$found_flac\" = true ]; then
            size=\$(du -h \"\$mp3_file\" | cut -f1)
            rel_path=\"\${mp3_file#$remote_path/}\"
            echo \"🗑️  Would delete: \$rel_path (\$size)\"

            if [ \"$dry_run\" = false ]; then
              rm -f \"\$mp3_file\"
              echo \"   ✅ Deleted\"
            fi
          fi
        done
      "
        else
            if not test -d "$music_dir"
                echo "❌ Music directory not found: $music_dir"
                return 1
            end

            echo -e "\n📊 Scanning for duplicate MP3s with FLAC versions...\n"

            find "$music_dir" -maxdepth 3 -type f -iname "*.mp3" | while read mp3_file
                set -l mp3_base (string replace -r '\.[^.]*$' '' -- $mp3_file)
                set -l mp3_name (normalize_name (basename $mp3_base))

                set -l mp3_dir (dirname $mp3_file)
                set -l found_flac false

                # fish's `for` silently yields zero iterations on an
                # unmatched glob (unlike bash, no nullglob guard needed).
                for flac_file in "$mp3_dir"/*.flac
                    set -l flac_base (string replace -r '\.[^.]*$' '' -- $flac_file)
                    set -l flac_name (normalize_name (basename $flac_base))

                    if test "$mp3_name" = "$flac_name"
                        set found_flac true
                        break
                    end
                end

                if test "$found_flac" = true
                    set -l size (du -h $mp3_file | cut -f1)
                    set -l rel_path (string replace -- "$music_dir/" '' $mp3_file)

                    echo "🗑️  Would delete: $rel_path ($size)"

                    if test "$dry_run" = false
                        rm -f $mp3_file
                        echo "   ✅ Deleted"
                    end
                end
            end
        end

        echo -e "\n📈 Summary: Scan complete"
    end | tee "$log_file"

    echo -e "\n📝 Full report saved: $log_file"
end
