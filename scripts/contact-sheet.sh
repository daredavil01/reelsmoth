#!/usr/bin/env bash
# Tiled, labelled frames from a render, for Claude's self-review.
#
#   scripts/contact-sheet.sh <video> <timeline.json> [out.png]     one frame per beat
#   scripts/contact-sheet.sh <video> --from 3 --to 5 [--every 0.2] [--out f.png]   scrub a transition
#   scripts/contact-sheet.sh <video> --at 3.7,3.75,3.8 [--out f.png]              exact moments
#
# Beat mode grabs each beat at 70% of its duration (after entrances settle,
# before exits) and tiles 3 across at 640 px. Scrub modes tile 4 across.
source "$(dirname "$0")/lib.sh"
need ffmpeg; need jq

usage="usage: scripts/contact-sheet.sh <video> (<timeline.json> [out.png] | --from A --to B [--every S] | --at t1,t2,...) [--out f.png]"
[[ $# -ge 2 ]] || die "$usage"
VIDEO="$1"; shift
[[ -f "$VIDEO" ]] || die "no such file: $VIDEO"

TL=""; OUT=""; FROM=""; TO=""; EVERY="0.2"; AT=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --from) FROM="$2"; shift ;;
    --to) TO="$2"; shift ;;
    --every) EVERY="$2"; shift ;;
    --at) AT="$2"; shift ;;
    --out) OUT="$2"; shift ;;
    *.json) TL="$1" ;;
    *) OUT="$1" ;;
  esac
  shift
done

# Build "label<TAB>time" lines.
if [[ -n "$TL" ]]; then
  points=$(jq -r '.beats[] | [.id, (.start + .duration * 0.7)] | @tsv' "$TL")
  cols=3; OUT="${OUT:-$(dirname "$VIDEO")/contact-sheet.png}"
elif [[ -n "$FROM" && -n "$TO" ]]; then
  points=$(awk -v a="$FROM" -v b="$TO" -v s="$EVERY" 'BEGIN { for (t = a; t <= b + 1e-9; t += s) printf "t\t%.3f\n", t }')
  cols=4; OUT="${OUT:-$(dirname "$VIDEO")/scrub-${FROM}-${TO}.png}"
elif [[ -n "$AT" ]]; then
  points=$(tr ',' '\n' <<<"$AT" | awk '{ printf "t\t%.3f\n", $1 }')
  cols=4; OUT="${OUT:-$(dirname "$VIDEO")/at.png}"
else
  die "$usage"
fi

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
FONT=$(fc-match -f '%{file}' 'DejaVu Sans Mono' 2>/dev/null || true)
i=0
while IFS=$'\t' read -r id t; do
  [[ -n "$t" ]] || continue
  label="$( [[ "$id" == t ]] && printf '%.2fs' "$t" || printf '%s @ %.2fs' "$id" "$t")"
  draw="scale=640:-2"
  if [[ -n "$FONT" ]]; then
    draw+=",drawbox=y=ih-40:w=iw:h=40:color=black@0.7:t=fill,drawtext=fontfile=${FONT}:text='${label//:/\\:}':x=12:y=h-30:fontsize=20:fontcolor=white"
  fi
  ffmpeg -nostdin -v error -y -ss "$t" -i "$VIDEO" -frames:v 1 -vf "$draw" "$TMP/$(printf '%03d' $i).png"
  i=$((i + 1))
done <<<"$points"

[[ $i -gt 0 ]] || die "no frames to grab"
cols=$(( i < cols ? i : cols )); rows=$(( (i + cols - 1) / cols ))
ffmpeg -v error -y -framerate 1 -i "$TMP/%03d.png" -vf "tile=${cols}x${rows}:padding=8:color=0x222222" -frames:v 1 "$OUT"
echo "Contact sheet: $OUT ($i frames)"
