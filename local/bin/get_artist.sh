#!/bin/bash

MUSIC_DIR="$HOME/Music"
FANART_API_KEY="20baeaf016d92f3bf70d6d51b4949ad8"

# Check dependencies
for cmd in curl jq; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "❌ Missing command: $cmd"
    exit 1
  fi
done

cd "$MUSIC_DIR" || { echo "❌ Could not cd to $MUSIC_DIR"; exit 1; }

for artist_dir in */; do
  artist="${artist_dir%/}"
  target="$MUSIC_DIR/$artist/artist.jpg"

  if [[ -f "$target" ]]; then
    echo "✅ $artist already has artist.jpg — skipping"
    continue
  fi

  echo "🔍 Searching MusicBrainz for: $artist"
  mbid=$(curl -sG --data-urlencode "query=artist:$artist" \
    "https://musicbrainz.org/ws/2/artist/?fmt=json&limit=1" | jq -r '.artists[0].id')

  if [[ -z "$mbid" || "$mbid" == "null" ]]; then
    echo "⚠️  No MusicBrainz ID found for $artist"
    continue
  fi

  echo "🎨 Looking up Fanart.tv for MBID: $mbid"
  image_url=$(curl -s \
    "https://webservice.fanart.tv/v3/music/${mbid}?api_key=${FANART_API_KEY}" \
    | jq -r '.artistthumb[0].url')

  if [[ -z "$image_url" || "$image_url" == "null" ]]; then
    echo "⚠️  No artist image found on Fanart.tv for $artist"
    continue
  fi

  curl -s -o "$target" "$image_url" && echo "✅ Saved to $target"
done

echo "🎉 All done!"

