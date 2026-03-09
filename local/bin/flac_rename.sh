#!/usr/bin/env bash

SOURCE_DIR=~/Rip_Art
DEST_DIR=~/Music_Backup

shopt -s globstar nullglob

for album_dir in "$SOURCE_DIR"/*/*; do
  [ -d "$album_dir" ] || continue

  artist=$(basename "$(dirname "$album_dir")")
  album=$(basename "$album_dir")
  cleaned_album="${album//:/_}"   # Replace ':' with '_'

  dest_album_dir="$DEST_DIR/$artist/$cleaned_album"
  mkdir -p "$dest_album_dir"

  echo "Processing: $artist - $cleaned_album"

  find "$album_dir" -type f \( -iname "*.flac" -o -iname "*.mp3" \) | while read -r track; do
    filename=$(basename "$track")
    newname=$(echo "$filename" | sed -E 's/^[0-9]+-([0-9]+) - (.+)\.flac$/\1 \2.flac/')
    cp -n "$track" "$dest_album_dir/$newname"
  done

  # Delete non-audio junk
  find "$album_dir" -type f \( -iname "*.cue" -o -iname "*.log" -o -iname "*.m3u" -o -iname "*.toc" \) -delete
done

