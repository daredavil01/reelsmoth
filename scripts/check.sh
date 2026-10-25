#!/usr/bin/env bash
# Inspect an export and check it against a preset.
#
#   scripts/check.sh <file> [preset]
#
# Prints resolution, fps, codec, pixel format, colour tags, size, duration and,
# when there is audio, integrated loudness and true peak (EBU R128).
# Exits 1 if any check against the preset or house rules fails.
source "$(dirname "$0")/lib.sh"
need ffprobe; need jq

[[ $# -ge 1 ]] || die "usage: scripts/check.sh <file> [preset]"
FILE="$1"; PRESET="${2:-}"
[[ -f "$FILE" ]] || die "no such file: $FILE"

fail=0
ok()   { printf '  ok    %s\n' "$*"; }
bad()  { printf '  FAIL  %s\n' "$*"; fail=1; }
info() { printf '  ..    %s\n' "$*"; }

W=$(probe "$FILE" v:0 stream=width); H=$(probe "$FILE" v:0 stream=height)
CODEC=$(probe "$FILE" v:0 stream=codec_name); PIX=$(probe "$FILE" v:0 stream=pix_fmt)
FPS=$(fps_of "$FILE"); DUR=$(duration_s "$FILE"); SIZE=$(size_mb "$FILE")
MATRIX=$(probe "$FILE" v:0 stream=color_space); RANGE=$(probe "$FILE" v:0 stream=color_range)

echo "$(basename "$FILE")"
info "${W}x${H} @ ${FPS} fps, ${CODEC} ${PIX}, $(printf '%.2f' "$DUR") s, ${SIZE} MB"

(( W % 2 == 0 && H % 2 == 0 )) && ok "even dimensions" || bad "odd dimensions ${W}x${H}"
[[ "$MATRIX" == bt709 ]] && ok "tagged BT.709" || bad "colour matrix is '${MATRIX}', expected bt709"
case "$CODEC" in
  prores) info "ProRes master (range ${RANGE})" ;;
  *) [[ "$PIX" == yuv420p ]] && ok "4:2:0 8-bit" || bad "pixel format $PIX, deliverables should be yuv420p"
     [[ "$RANGE" == tv ]] && ok "limited (TV) range" || bad "colour range '${RANGE}', expected tv" ;;
esac

if [[ "$FILE" == *.mp4 ]]; then
  # faststart: the moov atom must come before mdat.
  if head -c 1048576 "$FILE" | grep -aob 'moov' >/dev/null && \
     [[ $(head -c 1048576 "$FILE" | grep -aob 'moov' | head -1 | cut -d: -f1) -lt $(grep -aob 'mdat' "$FILE" | head -1 | cut -d: -f1) ]]; then
    ok "faststart (moov before mdat)"
  else
    bad "not faststart: add -movflags +faststart"
  fi
fi

if has_audio "$FILE"; then
  stats=$(ffmpeg -nostats -hide_banner -i "$FILE" -map 0:a:0 -filter:a ebur128=peak=true -f null - 2>&1 | sed -n '/Summary:/,$p')
  I=$(awk '/I:/ {print $2; exit}' <<<"$stats"); TP=$(awk '/Peak:/ {print $2; exit}' <<<"$stats")
  info "loudness ${I} LUFS, true peak ${TP} dBTP"
  awk -v i="$I" 'BEGIN{exit !(i>=-15 && i<=-13)}' && ok "loudness near -14 LUFS" || bad "loudness ${I} LUFS, target -14 (+/-1)"
  awk -v p="$TP" 'BEGIN{exit !(p<=-1)}' && ok "true peak <= -1 dBTP" || bad "true peak ${TP} dBTP > -1"
else
  info "no audio stream"
fi

if [[ -n "$PRESET" ]]; then
  p=$(jq -c --arg n "$PRESET" '.presets[$n] // empty' "$PRESETS")
  [[ -n "$p" ]] || die "no preset \"$PRESET\""
  budget=$(jq -r '.budgetMB // empty' <<<"$p"); maxD=$(jq -r '.maxDurationS // empty' <<<"$p")
  minD=$(jq -r '.minDurationS // empty' <<<"$p"); maxFps=$(jq -r '.maxFps // empty' <<<"$p")
  short=$(jq -r '.shortSide // empty' <<<"$p"); aspect=$(jq -r '.aspect // "any"' <<<"$p")
  echo " against preset '$PRESET':"
  [[ -z "$budget" ]] || { awk -v s="$SIZE" -v b="$budget" 'BEGIN{exit !(s<=b)}' && ok "size ${SIZE} <= ${budget} MB" || bad "size ${SIZE} MB > budget ${budget} MB"; }
  [[ -z "$maxD" ]] || { awk -v d="$DUR" -v m="$maxD" 'BEGIN{exit !(d<=m)}' && ok "duration <= ${maxD} s" || bad "duration $(printf '%.1f' "$DUR") s > ${maxD} s"; }
  [[ -z "$minD" ]] || { awk -v d="$DUR" -v m="$minD" 'BEGIN{exit !(d>=m)}' && ok "duration >= ${minD} s" || bad "duration $(printf '%.1f' "$DUR") s < ${minD} s"; }
  [[ -z "$maxFps" ]] || { awk -v f="$FPS" -v m="$maxFps" 'BEGIN{exit !(f<=m)}' && ok "fps <= ${maxFps}" || bad "fps ${FPS} > ${maxFps}"; }
  s=$(( W < H ? W : H ))
  [[ -z "$short" ]] || { (( s <= short )) && ok "short side ${s} <= ${short}" || bad "short side ${s} > ${short}"; }
  case "$aspect" in
    landscape) (( W >= H )) && ok "landscape" || bad "expected landscape" ;;
    portrait)  (( H >= W )) && ok "portrait" || bad "expected portrait" ;;
  esac
fi

exit $fail
