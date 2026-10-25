#!/usr/bin/env python3
"""Find the music drop by band energy and line it up with the hero beat.

    python3 scripts/find-drop.py <track> [--timeline t.json] [--beat id] [--write]

The drop is the moment low-band energy (40-150 Hz: kick and bass) jumps the
most, scored as (energy in the next 2 s) / (energy in the previous 2 s),
weighted by how loud the section after it is. With --timeline, prints where
the track must start so the drop lands on the hero beat (or --beat). --write
stores it as timeline.audio.music {src, dropAt}; the Soundtrack component and
the sound-design skill read it from there.
"""
import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from audiolib import decode, load_timeline, rms_envelope, save_timeline  # noqa: E402

SR = 4000
HOP = 0.05
WIN = 2.0


def find_drop(path):
    low = rms_envelope(decode(path, SR, "highpass=f=40,lowpass=f=150"), SR, HOP)
    w = int(WIN / HOP)
    peak_after = max(e for _, e in low) or 1e-9
    best, best_t = 0.0, None
    for i in range(w, len(low) - w):
        before = sum(e for _, e in low[i - w:i]) / w
        after = sum(e for _, e in low[i:i + w]) / w
        score = (after / (before + 0.02 * peak_after)) * (after / peak_after)
        if score > best:
            best, best_t = score, low[i][0]
    if best_t is None:
        raise SystemExit("track too short to find a drop (needs > 4 s)")
    # Snap to the biggest low-band rise within 0.4 s, so we land on the transient
    # (the window score peaks a little early, while the quiet side is shortest).
    idx = [k for k in range(1, len(low)) if abs(low[k][0] - best_t) <= 0.4]
    t = max(idx, key=lambda k: low[k][1] - low[k - 1][1]) if idx else None
    t = low[t][0] if t is not None else best_t
    return round(t, 3), round(best, 2)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("track")
    ap.add_argument("--timeline")
    ap.add_argument("--beat", help="beat id to land the drop on (default: the hero beat)")
    ap.add_argument("--write", action="store_true", help="store src and dropAt in timeline.audio.music")
    a = ap.parse_args()

    drop, score = find_drop(a.track)
    print(f"drop at {drop:.3f} s in {a.track} (score {score})")
    if not a.timeline:
        return
    tl = load_timeline(a.timeline)
    beats = tl["beats"]
    target = next((b for b in beats if b["id"] == a.beat), None) if a.beat else next((b for b in beats if b.get("hero")), None)
    if not target:
        what = f'"{a.beat}"' if a.beat else "marked hero"
        raise SystemExit(f"no beat {what} in {a.timeline}")
    offset = target["start"] - drop
    if offset >= 0:
        print(f"start the track at {offset:.3f} s so the drop lands on '{target['id']}' ({target['start']} s)")
    else:
        print(f"trim the first {-offset:.3f} s of the track so the drop lands on '{target['id']}' ({target['start']} s)")
    if a.write:
        src = os.path.relpath(os.path.abspath(a.track), os.path.join(os.path.dirname(__file__), "..", "public"))
        music = tl.setdefault("audio", {}).setdefault("music", {})
        music.update({"src": src, "dropAt": drop})
        if a.beat:
            music["dropOn"] = a.beat
        save_timeline(a.timeline, tl)
        print(f"wrote audio.music to {a.timeline}")


if __name__ == "__main__":
    main()
