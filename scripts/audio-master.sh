#!/usr/bin/env bash
# Two-pass EBU R128 loudness normalisation to -14 LUFS, true peak <= -1 dBTP.
# The ceiling defaults to -1.5 dBTP: lossy encodes (AAC 96-128k, Opus)
# overshoot by a few tenths, and every export must still measure <= -1.
# Video is stream-copied, so picture quality is untouched.
#
#   scripts/audio-master.sh <in> <out> [target_lufs] [true_peak]
source "$(dirname "$0")/lib.sh"
need ffmpeg; need jq

[[ $# -ge 2 ]] || die "usage: scripts/audio-master.sh <in> <out> [lufs=-14] [tp=-1.5]"
IN="$1"; OUT="$2"; I="${3:--14}"; TP="${4:--1.5}"; LRA=11
has_audio "$IN" || die "$IN has no audio stream"

m=$(ffmpeg -nostdin -hide_banner -i "$IN" -map 0:a:0 -af "loudnorm=I=$I:TP=$TP:LRA=$LRA:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
mi=$(jq -r .input_i <<<"$m"); mtp=$(jq -r .input_tp <<<"$m"); mlra=$(jq -r .input_lra <<<"$m")
mth=$(jq -r .input_thresh <<<"$m"); off=$(jq -r .target_offset <<<"$m")
echo "Measured ${mi} LUFS, true peak ${mtp} dBTP; normalising to ${I} LUFS / ${TP} dBTP"

# pcm for .mov masters, AAC 384k otherwise.
acodec=(-c:a aac -b:a 384k); [[ "$OUT" == *.mov ]] && acodec=(-c:a pcm_s16le)
ffmpeg -nostdin -v error -y -i "$IN" -map 0:v? -map 0:a:0 -c:v copy \
  -af "loudnorm=I=$I:TP=$TP:LRA=$LRA:measured_I=$mi:measured_TP=$mtp:measured_LRA=$mlra:measured_thresh=$mth:offset=$off:linear=true" \
  -ar 48000 "${acodec[@]}" "$OUT"
echo "Done: $OUT"
