#!/usr/bin/env bash
# Pop / flash scan: find frames where the picture jumps instead of moving.
#
#   scripts/flash-scan.sh <video> [timeline.json] [threshold=12]
#
# Measures the mean luma change from the previous frame (signalstats YDIF).
# A frame is flagged when its change is above the threshold AND at least 4x
# the median of its neighbours: an element popping in with no entrance, a
# one-frame flash, or a cut with a gap. Flags within one frame of a beat start
# are marked "beat" (likely an intended cut); the rest need a look.
# Exits 1 if any unexplained jump is found.
source "$(dirname "$0")/lib.sh"
need ffmpeg; need jq

[[ $# -ge 1 ]] || die "usage: scripts/flash-scan.sh <video> [timeline.json] [threshold=12]"
VIDEO="$1"; TL="${2:-}"; THRESH="${3:-12}"
FPS=$(fps_of "$VIDEO")

starts=""
[[ -n "$TL" ]] && starts=$(jq -r '[.beats[] | "\(.id)=\(.start)"] | join(" ")' "$TL")

ffmpeg -nostdin -v error -i "$VIDEO" -vf "signalstats,metadata=print:key=lavfi.signalstats.YDIF:file=-" -f null - 2>/dev/null |
  awk '/pts_time:/ { sub(/.*pts_time:/, ""); t = $1 } /YDIF=/ { sub(/.*YDIF=/, ""); print t, $1 }' |
  awk -v th="$THRESH" -v fps="$FPS" -v starts="$starts" '
    { t[NR] = $1; d[NR] = $2 }
    END {
      n = split(starts, s, " ")
      for (k = 1; k <= n; k++) { split(s[k], kv, "="); bid[k] = kv[1]; bt[k] = kv[2] }
      flagged = 0; unexplained = 0
      for (i = 2; i <= NR; i++) {
        # Median of up to 6 neighbours (excluding this frame).
        m = 0; delete nb
        for (j = i - 3; j <= i + 3; j++) if (j != i && j >= 2 && j <= NR) nb[++m] = d[j]
        for (a = 2; a <= m; a++) { v = nb[a]; for (b = a - 1; b >= 1 && nb[b] > v; b--) nb[b + 1] = nb[b]; nb[b + 1] = v }
        med = (m % 2) ? nb[(m + 1) / 2] : (nb[m / 2] + nb[m / 2 + 1]) / 2
        if (d[i] > th && d[i] > 4 * (med + 0.5)) {
          why = ""
          for (k = 1; k <= n; k++) if (t[i] - bt[k] >= -1.5 / fps && t[i] - bt[k] <= 1.5 / fps) why = "beat " bid[k]
          printf "  %-6s %7.3fs  frame %-5d  change %6.2f (neighbours %.2f)\n", (why ? "beat" : "CHECK"), t[i], int(t[i] * fps + 0.5), d[i], med
          flagged++; if (!why) unexplained++
        }
      }
      printf "%d jumps, %d unexplained\n", flagged, unexplained
      exit (unexplained > 0)
    }'
