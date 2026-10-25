#!/usr/bin/env python3
"""Measure where a sound effect peaks, so its peak (not its start) lands on the beat.

    python3 scripts/measure-peak.py <file> [<file> ...]
    python3 scripts/measure-peak.py --timeline t.json      # fill in "peak" for every timeline.audio.sfx cue

A riser peaks at its end, a whoosh around 60%, a click at once. The Soundtrack
component starts each cue at beat start + offset - peak.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from audiolib import decode, load_timeline, rms_envelope, save_timeline  # noqa: E402

SR = 16000
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")


def peak_time(path):
    env = rms_envelope(decode(path, SR), SR, 0.005)
    t, _ = max(env, key=lambda te: te[1])
    return round(t + 0.0025, 3)


def main():
    args = sys.argv[1:]
    if not args:
        raise SystemExit(__doc__)
    if args[0] == "--timeline":
        path = args[1]
        tl = load_timeline(path)
        cues = tl.get("audio", {}).get("sfx", [])
        cache = {}
        for c in cues:
            f = os.path.join(ROOT, "public", c["src"])
            cache.setdefault(f, peak_time(f))
            c["peak"] = cache[f]
            print(f"{c['beat']:>12} {c['src']:<28} peak {c['peak']:.3f} s")
        save_timeline(path, tl)
        print(f"wrote {len(cues)} peaks to {path}")
        return
    for f in args:
        print(f"{peak_time(f):.3f}  {f}")


if __name__ == "__main__":
    main()
