#!/usr/bin/env bash
# Shared helpers for the render scripts. Source, don't run.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PRESETS="$ROOT/presets/render.json"
export SVT_LOG=1  # SVT-AV1 prints its config banner otherwise

die() { echo "error: $*" >&2; exit 1; }
need() { command -v "$1" >/dev/null 2>&1 || die "$1 is not installed"; }

# Find the master for a slug: master.mov, then master.mp4.
master_for() {
  local dir="$ROOT/videos/$1"
  for f in "$dir/master.mov" "$dir/master.mp4"; do
    [[ -f "$f" ]] && { echo "$f"; return; }
  done
  die "no master in videos/$1 (run scripts/master.sh first)"
}

# probe <file> <stream> <entries> -> value(s), one per line
probe() {
  ffprobe -v error -select_streams "$2" -show_entries "$3" -of default=nw=1:nk=1 "$1"
}

duration_s() { ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$1"; }

# Frame rate as a decimal, e.g. 30 or 29.97.
fps_of() { probe "$1" v:0 stream=r_frame_rate | head -1 | awk -F/ '{ printf "%g", ($2 ? $1/$2 : $1) }'; }

has_audio() { [[ -n "$(probe "$1" a stream=index | head -1)" ]]; }

size_mb() { awk -v b="$(stat -c %s "$1")" 'BEGIN { printf "%.2f", b/1048576 }'; }
