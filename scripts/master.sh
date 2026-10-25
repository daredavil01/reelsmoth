#!/usr/bin/env bash
# Render a Remotion composition to a near-lossless master in videos/<slug>/.
#
#   scripts/master.sh <CompId> <slug> [--alpha] [--h264] [--scale=N] [--draft] [-- extra remotion flags]
#
# Default: ProRes HQ, PNG frames, BT.709 -> videos/<slug>/master.mov
#   --alpha   ProRes 4444 with alpha (yuva444p10le)
#   --h264    lighter master: H.264 CRF 12, x264 slow -> master.mp4
#   --scale=2 render a 1080p comp at 4K (YouTube, HiDPI web)
#   --draft   540p review draft (scale 0.5, CRF 28, JPEG frames) -> draft.mp4
source "$(dirname "$0")/lib.sh"

[[ $# -ge 2 ]] || die "usage: scripts/master.sh <CompId> <slug> [--alpha|--h264|--draft] [--scale=N]"
COMP="$1"; SLUG="$2"; shift 2

mode=prores-hq; scale=""; extra=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --alpha) mode=prores-4444 ;;
    --h264) mode=h264 ;;
    --draft) mode=draft ;;
    --scale=*) scale="$1" ;;
    --) shift; extra=("$@"); break ;;
    *) die "unknown flag $1" ;;
  esac
  shift
done

OUT="$ROOT/videos/$SLUG"
mkdir -p "$OUT"
cd "$ROOT"

common=(--image-format=png --color-space=bt709)
case "$mode" in
  prores-hq)   file="$OUT/master.mov"; flags=(--codec=prores --prores-profile=hq "${common[@]}") ;;
  prores-4444) file="$OUT/master.mov"; flags=(--codec=prores --prores-profile=4444 --pixel-format=yuva444p10le "${common[@]}") ;;
  h264)        file="$OUT/master.mp4"; flags=(--codec=h264 --crf=12 --x264-preset=slow "${common[@]}") ;;
  draft)       file="$OUT/draft.mp4";  flags=(--codec=h264 --crf=28 --scale=0.5 --image-format=jpeg --color-space=bt709) ;;
esac
[[ -n "$scale" && "$mode" != draft ]] && flags+=("$scale")

# Only one master per video: drop the other container so encode.sh can't pick a stale one.
if [[ "$mode" != draft ]]; then rm -f "$OUT/master.mov" "$OUT/master.mp4"; fi

echo "Rendering $COMP -> ${file#"$ROOT"/} ($mode${scale:+, $scale})"
npx remotion render "$COMP" "$file" "${flags[@]}" --log=error "${extra[@]}"
echo "Done: ${file#"$ROOT"/} ($(size_mb "$file") MB)"
