#!/usr/bin/env bash
# Make destination files from a video's master: one FFmpeg encode per output.
#
#   scripts/encode.sh <slug> <preset> [<preset> ...]
#   scripts/encode.sh <slug> all
#
# Presets live in presets/render.json. Output: videos/<slug>/exports/.
source "$(dirname "$0")/lib.sh"
need ffmpeg; need ffprobe; need jq

[[ $# -ge 2 ]] || die "usage: scripts/encode.sh <slug> <preset...|all>  (presets: $(jq -r '.presets|keys|join(", ")' "$PRESETS"))"
SLUG="$1"; shift
MASTER="$(master_for "$SLUG")"
EXPORTS="$ROOT/videos/$SLUG/exports"
mkdir -p "$EXPORTS"

if [[ "$1" == all ]]; then mapfile -t PRESET_LIST < <(jq -r '.presets|keys[]' "$PRESETS"); else PRESET_LIST=("$@"); fi

W=$(probe "$MASTER" v:0 stream=width); H=$(probe "$MASTER" v:0 stream=height)
FPS=$(fps_of "$MASTER"); DUR=$(duration_s "$MASTER")
echo "Master: ${MASTER#"$ROOT"/} ${W}x${H} @ ${FPS} fps, ${DUR}s"

# BT.709 limited range, 4:2:0, tagged so players and platforms don't guess.
COLOR=(-pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv)

encode_preset() {
  local name="$1" p
  p=$(jq -c --arg n "$name" '.presets[$n] // empty' "$PRESETS")
  [[ -n "$p" ]] || die "no preset \"$name\" in presets/render.json"

  local aspect shortSide maxFps budget
  aspect=$(jq -r '.aspect // "any"' <<<"$p")
  shortSide=$(jq -r '.shortSide // empty' <<<"$p")
  maxFps=$(jq -r '.maxFps // empty' <<<"$p")
  budget=$(jq -r '.budgetMB // empty' <<<"$p")

  if [[ "$aspect" == landscape && $W -lt $H ]] || [[ "$aspect" == portrait && $W -gt $H ]]; then
    echo "skip $name: preset is $aspect but master is ${W}x${H} (render a $aspect composition for it)" >&2
    return 0
  fi

  # Scale so the short edge is shortSide (never upscale); cap frame rate.
  local vf=() short=$(( W < H ? W : H ))
  if [[ -n "$shortSide" && $short -gt $shortSide ]]; then
    if (( W <= H )); then vf+=("scale=${shortSide}:-2:flags=lanczos"); else vf+=("scale=-2:${shortSide}:flags=lanczos"); fi
  fi
  local outFps="$FPS"
  if [[ -n "$maxFps" ]] && awk -v a="$FPS" -v b="$maxFps" 'BEGIN{exit !(a>b)}'; then
    vf+=("fps=$maxFps"); outFps="$maxFps"
  fi
  local gop; gop=$(awk -v f="$outFps" 'BEGIN { g=int(f/2+0.5); print (g<1?1:g) }')
  local vfArg=(); [[ ${#vf[@]} -gt 0 ]] && vfArg=(-vf "$(IFS=,; echo "${vf[*]}")")

  local n i
  n=$(jq '.outputs|length' <<<"$p")
  for ((i = 0; i < n; i++)); do
    local o file out
    o=$(jq -c ".outputs[$i]" <<<"$p")
    file=$(jq -r '.file' <<<"$o"); out="$EXPORTS/$file"

    if [[ $(jq -r '.poster // false' <<<"$o") == true ]]; then
      # Poster = frame 0, which the house rules guarantee is never empty.
      ffmpeg -v error -y -i "$MASTER" "${vfArg[@]}" -frames:v 1 -q:v 2 "$out"
      echo "  $name -> exports/$file ($(size_mb "$out") MB)"
      continue
    fi

    local args=()
    mapfile -t args < <(jq -r '.args[]' <<<"$o" | sed "s/{GOP_HALF}/$gop/g")
    ffmpeg -v error -y -i "$MASTER" -map 0:v:0 -map '0:a:0?' "${vfArg[@]}" "${args[@]}" "${COLOR[@]}" "$out"

    if [[ -n "$budget" ]] && awk -v s="$(size_mb "$out")" -v b="$budget" 'BEGIN{exit !(s>b)}'; then
      # Over budget: two-pass to 95% of it. video kbps = budget*8192*0.95/dur - audio kbps
      local akbps vkbps passlog
      akbps=$(printf '%s\n' "${args[@]}" | grep -A1 -x -- '-b:a' | tail -1 | tr -dc 0-9); akbps=${akbps:-128}
      vkbps=$(awk -v b="$budget" -v d="$DUR" -v a="$akbps" 'BEGIN { printf "%d", b*8192*0.95/d - a }')
      echo "  $name: $(size_mb "$out") MB > ${budget} MB budget, two-pass at ${vkbps}k" >&2
      local twoPass=()
      mapfile -t twoPass < <(printf '%s\n' "${args[@]}" | awk 'skip { skip=0; next } $0=="-crf" { skip=1; next } { print }')
      passlog="$(mktemp -d)/pass"
      ffmpeg -v error -y -i "$MASTER" -map 0:v:0 "${vfArg[@]}" "${twoPass[@]}" -b:v "${vkbps}k" -pass 1 -passlogfile "$passlog" -an "${COLOR[@]}" -f mp4 /dev/null
      ffmpeg -v error -y -i "$MASTER" -map 0:v:0 -map '0:a:0?' "${vfArg[@]}" "${twoPass[@]}" -b:v "${vkbps}k" -pass 2 -passlogfile "$passlog" "${COLOR[@]}" "$out"
      rm -rf "$(dirname "$passlog")"
    fi
    echo "  $name -> exports/$file ($(size_mb "$out") MB)"
  done
}

for preset in "${PRESET_LIST[@]}"; do encode_preset "$preset"; done
