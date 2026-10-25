#!/usr/bin/env bash
# Render catalog preview GIFs: 3 s, 480 px wide, 15 fps, one per entry.
#
#   scripts/catalog-previews.sh            # every entry in catalog/
#   scripts/catalog-previews.sh <id> ...   # just these
#
# Each catalog/<category>/<id>.md names a `composition`; its GIF goes next to
# it as <id>.gif (Git LFS, see .gitattributes). Then run npm run catalog.
source "$(dirname "$0")/lib.sh"
need ffmpeg
cd "$ROOT"

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
fm() { sed -n '/^---$/,/^---$/p' "$1" | awk -v k="$2" -F': ' '$1==k { sub(/^[^:]*: /, ""); print; exit }'; }

if [[ $# -gt 0 ]]; then
  files=(); for id in "$@"; do f=$(find catalog -name "$id.md" | head -1); [[ -n "$f" ]] || die "no catalog entry $id"; files+=("$f"); done
else
  mapfile -t files < <(find catalog -mindepth 2 -name '*.md' | sort)
fi

echo "Bundling once for ${#files[@]} previews"
npx remotion bundle --out-dir="$TMP/bundle" --log=error >/dev/null

for f in "${files[@]}"; do
  id=$(fm "$f" id); comp=$(fm "$f" composition)
  [[ -n "$comp" ]] || { echo "skip $id: no composition"; continue; }
  out="$(dirname "$f")/$id.gif"
  npx remotion render "$TMP/bundle" "$comp" "$TMP/$id.mp4" --scale=0.5 --codec=h264 --crf=12 --log=error
  # Two-pass palette for clean flat colours; bayer dither keeps grain from bloating the file.
  ffmpeg -v error -y -i "$TMP/$id.mp4" \
    -vf "fps=15,scale=480:-2:flags=lanczos,split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle" \
    -loop 0 "$out"
  echo "  $id -> ${out} ($(size_mb "$out") MB)"
done
