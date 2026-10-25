#!/usr/bin/env bash
# One labelled frame per beat, tiled into a single PNG for self-review.
#
#   scripts/contact-sheet.sh <video> <timeline.json> [out.png]
#
# Grabs each beat at 70% of its duration (after entrances settle, before
# exits), labels it "<beat id> @ <time>", and tiles them 3 across at 640 px.
source "$(dirname "$0")/lib.sh"
need ffmpeg; need jq

[[ $# -ge 2 ]] || die "usage: scripts/contact-sheet.sh <video> <timeline.json> [out.png]"
VIDEO="$1"; TL="$2"; OUT="${3:-$(dirname "$VIDEO")/contact-sheet.png}"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

FONT=$(fc-match -f '%{file}' 'DejaVu Sans Mono' 2>/dev/null || true)
i=0
while IFS=$'\t' read -r id t; do
  label="${id} @ $(printf '%.2f' "$t")s"
  draw="scale=640:-2"
  if [[ -n "$FONT" ]]; then
    draw+=",drawbox=y=ih-40:w=iw:h=40:color=black@0.7:t=fill,drawtext=fontfile=${FONT}:text='${label//:/\\:}':x=12:y=h-30:fontsize=20:fontcolor=white"
  fi
  ffmpeg -nostdin -v error -y -ss "$t" -i "$VIDEO" -frames:v 1 -vf "$draw" "$TMP/$(printf '%03d' $i).png"
  i=$((i + 1))
done < <(jq -r '.beats[] | [.id, (.start + .duration * 0.7)] | @tsv' "$TL")

[[ $i -gt 0 ]] || die "timeline has no beats"
cols=$(( i < 3 ? i : 3 )); rows=$(( (i + cols - 1) / cols ))
ffmpeg -v error -y -framerate 1 -i "$TMP/%03d.png" -vf "tile=${cols}x${rows}:padding=8:color=0x222222" -frames:v 1 "$OUT"
echo "Contact sheet: $OUT ($i beats)"
