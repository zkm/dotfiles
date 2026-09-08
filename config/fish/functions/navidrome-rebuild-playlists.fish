# Rebuild album .m3u playlists so imported Navidrome playlists match actual files.
# Logs saved to: ~/.local/state/navidrome/playlist-rebuild-*.log
# Usage: navidrome-rebuild-playlists [path] [--force]
function navidrome-rebuild-playlists
    set -l music_dir $argv[1]
    test -z "$music_dir"; and set music_dir /mnt/mars/navidrome/Music
    set -l dry_run true
    set -l log_dir $XDG_STATE_HOME
    test -z "$log_dir"; and set log_dir ~/.local/state
    set log_dir "$log_dir/navidrome"
    set -l timestamp (date +%Y%m%d_%H%M%S)
    set -l log_file "$log_dir/playlist-rebuild-$timestamp.log"

    mkdir -p "$log_dir" 2>/dev/null

    if test "$argv[2]" = "--force"
        set dry_run false
    else if test "$argv[1]" = "--force"
        set dry_run false
        set music_dir /mnt/mars/navidrome/Music
    end

    begin
        if test "$dry_run" = false
            echo "🔥 Running in FORCE mode - playlist files will be rewritten"
        else
            echo "🔍 Running in DRY-RUN mode - playlist files will not be changed"
            if string match -q '*:*' -- $music_dir
                echo "   Use 'navidrome-rebuild-playlists \"$music_dir\" --force' to rewrite playlists"
            else
                echo "   Use 'navidrome-rebuild-playlists --force' to rewrite playlists"
            end
        end

        if string match -q '*:*' -- $music_dir
            set -l parts (string split -m1 ':' $music_dir)
            set -l remote_host $parts[1]
            set -l remote_path $parts[2]

            echo -e "\n🎼 Scanning remote server '$remote_host' for .m3u playlists to rebuild...\n"

            # Remote payload stays bash — runs on the remote host's shell.
            # \$ keeps remote-side expansions literal; bare $remote_path/
            # $timestamp/$dry_run are expanded locally before sending, same
            # as the original bash version.
            ssh "$remote_host" "
        timestamp='$timestamp'
        dry_run='$dry_run'
        rebuilt=0
        skipped=0
        find '$remote_path' -type f -iname '*.m3u' | while read -r playlist; do
          playlist_dir=\"\$(dirname \"\$playlist\")\"
          rel_path=\"\${playlist#$remote_path/}\"
          tmp_file=\"\$playlist.tmp.\$\$\"
          track_count=\$(find \"\$playlist_dir\" -maxdepth 1 -type f \\( -iname '*.flac' -o -iname '*.mp3' -o -iname '*.m4a' -o -iname '*.ogg' -o -iname '*.opus' -o -iname '*.aac' -o -iname '*.wav' -o -iname '*.ape' \\) -printf '%f\\n' | LC_ALL=C sort | wc -l)

          if [ \"\$track_count\" -eq 0 ]; then
            echo \"⏭️  Skipping: \$rel_path (no audio files in playlist directory)\"
            skipped=\$((skipped + 1))
            continue
          fi

          if [ \"\$dry_run\" = true ]; then
            echo \"📝 Would rebuild: \$rel_path (\$track_count tracks)\"
            rebuilt=\$((rebuilt + 1))
            continue
          fi

          backup_file=\"\$playlist.bak.\$timestamp\"
          cp \"\$playlist\" \"\$backup_file\"
          find \"\$playlist_dir\" -maxdepth 1 -type f \\( -iname '*.flac' -o -iname '*.mp3' -o -iname '*.m4a' -o -iname '*.ogg' -o -iname '*.opus' -o -iname '*.aac' -o -iname '*.wav' -o -iname '*.ape' \\) -printf '%f\\n' | LC_ALL=C sort > \"\$tmp_file\"
          mv \"\$tmp_file\" \"\$playlist\"
          echo \"✅ Rebuilt: \$rel_path (\$track_count tracks, backup: \$(basename \"\$backup_file\"))\"
          rebuilt=\$((rebuilt + 1))
        done

        echo
        echo \"📈 Summary: processed \$rebuilt playlists, skipped \$skipped\"
      "
        else
            if not test -d "$music_dir"
                echo "❌ Music directory not found: $music_dir"
                return 1
            end

            echo -e "\n🎼 Scanning for .m3u playlists to rebuild...\n"

            set -l rebuilt 0
            set -l skipped 0
            # Unlike bash, fish doesn't run a piped `while` in a subshell, so
            # rebuilt/skipped correctly persist after this loop (the bash
            # original has a latent bug here: `find | while ... done` puts
            # the loop in a subshell, so its counters are always 0 in the
            # final summary line).
            find "$music_dir" -type f -iname "*.m3u" | while read playlist
                set -l playlist_dir (dirname $playlist)
                set -l rel_path (string replace -- "$music_dir/" '' $playlist)
                set -l tmp_file "$playlist.tmp.$fish_pid"
                set -l track_count (find "$playlist_dir" -maxdepth 1 -type f \( -iname "*.flac" -o -iname "*.mp3" -o -iname "*.m4a" -o -iname "*.ogg" -o -iname "*.opus" -o -iname "*.aac" -o -iname "*.wav" -o -iname "*.ape" \) -printf '%f\n' | LC_ALL=C sort | wc -l)

                if test "$track_count" -eq 0
                    echo "⏭️  Skipping: $rel_path (no audio files in playlist directory)"
                    set skipped (math $skipped + 1)
                    continue
                end

                if test "$dry_run" = true
                    echo "📝 Would rebuild: $rel_path ($track_count tracks)"
                    set rebuilt (math $rebuilt + 1)
                    continue
                end

                set -l backup_file "$playlist.bak.$timestamp"
                cp "$playlist" "$backup_file"
                find "$playlist_dir" -maxdepth 1 -type f \( -iname "*.flac" -o -iname "*.mp3" -o -iname "*.m4a" -o -iname "*.ogg" -o -iname "*.opus" -o -iname "*.aac" -o -iname "*.wav" -o -iname "*.ape" \) -printf '%f\n' | LC_ALL=C sort >"$tmp_file"
                mv "$tmp_file" "$playlist"
                echo "✅ Rebuilt: $rel_path ($track_count tracks, backup: "(basename $backup_file)")"
                set rebuilt (math $rebuilt + 1)
            end

            echo -e "\n📈 Summary: processed $rebuilt playlists, skipped $skipped"
        end
    end | tee "$log_file"

    echo -e "\n📝 Full report saved: $log_file"
end
