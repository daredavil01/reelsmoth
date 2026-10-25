#!/usr/bin/env python3
"""Synthesised sound library: SFX and a music bed made in code, so no licences.

    python3 scripts/sfx.py            # (re)build public/audio/sfx/*.wav and public/audio/music/pulse-bed.wav
    python3 scripts/sfx.py --list     # what each sound is for

Pure Python stdlib, seeded random: the same bytes on every run and machine.
Each SFX is peak-normalised to -1 dBFS; final loudness is set on the master by
scripts/audio-master.sh. Sounds are placed from timeline.json (see the
sound-design skill), never at typed-in times.
"""
import math
import random
import struct
import sys
import wave
from pathlib import Path

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
SFX_DIR = ROOT / "public" / "audio" / "sfx"
MUSIC_DIR = ROOT / "public" / "audio" / "music"
TAU = 2 * math.pi


def _rng(name):
    return random.Random(f"reelsmith-{name}")


def silence(sec):
    return [0.0] * int(sec * SR)


def env_ad(n, attack, decay_tau):
    """Attack (s) then exponential decay with time constant decay_tau (s)."""
    a = max(1, int(attack * SR))
    return [i / a if i < a else math.exp(-(i - a) / (decay_tau * SR)) for i in range(n)]


def lowpass(x, cutoff):
    """One-pole low-pass; cutoff may be a number or a per-sample list."""
    y, out = 0.0, []
    for i, s in enumerate(x):
        c = cutoff[i] if isinstance(cutoff, list) else cutoff
        k = 1 - math.exp(-TAU * c / SR)
        y += k * (s - y)
        out.append(y)
    return out


def highpass(x, cutoff):
    lp = lowpass(x, cutoff)
    return [a - b for a, b in zip(x, lp)]


def bandnoise(n, lo, hi, rng):
    """Noise between two cutoffs (lists allowed for sweeps)."""
    noise = [rng.uniform(-1, 1) for _ in range(n)]
    return lowpass(highpass(noise, lo), hi)


def sine(freq, n, phase=0.0):
    """Sine with a constant or per-sample frequency."""
    out, ph = [], phase
    for i in range(n):
        f = freq[i] if isinstance(freq, list) else freq
        ph += TAU * f / SR
        out.append(math.sin(ph))
    return out


def mix_into(dst, src, at_sample, gain=1.0):
    end = at_sample + len(src)
    if end > len(dst):
        dst.extend([0.0] * (end - len(dst)))
    for i, s in enumerate(src):
        dst[at_sample + i] += s * gain
    return dst


def normalise(x, peak_db=-1.0):
    peak = max(1e-9, max(abs(s) for s in x))
    g = 10 ** (peak_db / 20) / peak
    return [s * g for s in x]


def fade_out(x, sec):
    n = min(len(x), int(sec * SR))
    for i in range(n):
        x[len(x) - n + i] *= 1 - i / n
    return x


# ---- generators -------------------------------------------------------------


def whoosh(dur=0.45, f0=500, f1=2600):
    """Air swoosh for a word, line or card arriving; peaks at ~40% of its length."""
    n = int(dur * SR)
    sweep = [f0 + (f1 - f0) * (i / n) ** 1.5 for i in range(n)]
    x = bandnoise(n, [f * 0.35 for f in sweep], sweep, _rng("whoosh"))
    shape = [math.sin(math.pi * (i / n) ** 0.75) ** 2 for i in range(n)]
    return fade_out([a * b for a, b in zip(x, shape)], 0.03)


def pop(freq=880):
    """Badge, chip or callout popping in. Raise freq across a sequence."""
    n = int(0.14 * SR)
    f = [freq * (1.6 - 0.6 * min(1, i / (0.025 * SR))) for i in range(n)]
    e = env_ad(n, 0.002, 0.035)
    return [s * v for s, v in zip(sine(f, n), e)]


def click():
    """UI click: a control snapping to a step, a submit press."""
    n = int(0.05 * SR)
    rng = _rng("click")
    e = env_ad(n, 0.0005, 0.006)
    body = sine(2400, n)
    return highpass([(0.6 * b + 0.5 * rng.uniform(-1, 1)) * v for b, v in zip(body, e)], 400)


def tick():
    """Soft tick for list rows and counters."""
    n = int(0.04 * SR)
    e = env_ad(n, 0.001, 0.008)
    return [s * v for s, v in zip(sine(1600, n), e)]


def key(variant=0):
    """One keystroke. Use variants 0-3 in turn for typing (0.035 s/char)."""
    rng = _rng(f"key{variant}")
    n = int(0.03 * SR)
    e = env_ad(n, 0.0005, 0.005 + 0.001 * variant)
    x = bandnoise(n, 900 + 150 * variant, 5200, rng)
    thock = sine(180 + 25 * variant, n)
    return [(a + 0.35 * b) * v for a, b, v in zip(x, thock, e)]


def riser(dur=2.0):
    """Build-up that peaks at its END: align the end to the hit. One per video."""
    n = int(dur * SR)
    rng = _rng("riser")
    sweep = [300 + 4200 * (i / n) ** 2 for i in range(n)]
    x = bandnoise(n, [f * 0.5 for f in sweep], sweep, rng)
    tone = sine([110 * 2 ** (2 * i / n) for i in range(n)], n)
    shape = [(i / n) ** 2.2 for i in range(n)]
    return [(0.8 * a + 0.4 * b) * s for a, b, s in zip(x, tone, shape)]


def impact():
    """Hero hit: sub drop plus a noise crack. One per video, on the hero beat."""
    n = int(1.4 * SR)
    f = [42 + 70 * math.exp(-i / (0.05 * SR)) for i in range(n)]
    sub = [s * v for s, v in zip(sine(f, n), env_ad(n, 0.002, 0.35))]
    crack = bandnoise(n, 200, 6000, _rng("impact"))
    ce = env_ad(n, 0.001, 0.05)
    return [a + 0.6 * b * c for a, b, c in zip(sub, crack, ce)]


def chime(root=440.0):
    """Success / arrival / end card: an A minor add9 bell chord."""
    n = int(1.8 * SR)
    out = [0.0] * n
    for k, ratio in enumerate([1, 1.189, 1.498, 2.245]):  # A C E B
        e = env_ad(n, 0.003, 0.5 - 0.08 * k)
        for partial, g in [(1, 1.0), (2.76, 0.25)]:
            s = sine(root * ratio * partial, n)
            for i in range(n):
                out[i] += s[i] * e[i] * g * (0.5 if k else 0.7)
    return out


def pad(dur=8.0, root=110.0):
    """Sustained A minor bed with slow movement; duck it under the hero hit."""
    n = int(dur * SR)
    out = [0.0] * n
    for ratio, detune in [(1, 0.0), (1.189, 0.4), (1.498, -0.3), (2, 0.2)]:
        a = sine(root * ratio + detune, n)
        b = sine(root * ratio * 1.003, n)
        for i in range(n):
            out[i] += 0.25 * (a[i] + 0.5 * b[i])
    lfo = sine(0.15, n)
    swell = [min(1, i / (1.5 * SR), (n - i) / (1.5 * SR)) for i in range(n)]
    return lowpass([s * (0.8 + 0.2 * l) * w for s, l, w in zip(out, lfo, swell)], 1800)


SFX = {
    "whoosh": whoosh,
    "pop": pop,
    "pop-high": lambda: pop(1320),
    "click": click,
    "tick": tick,
    "key-0": lambda: key(0),
    "key-1": lambda: key(1),
    "key-2": lambda: key(2),
    "key-3": lambda: key(3),
    "riser": riser,
    "impact": impact,
    "chime": chime,
    "pad": pad,
}


# ---- music bed ----------------------------------------------------------------

BED = {"bpm": 120, "seconds": 24.0, "drop": 8.0}


def kick():
    n = int(0.35 * SR)
    f = [48 + 110 * math.exp(-i / (0.03 * SR)) for i in range(n)]
    return [s * v for s, v in zip(sine(f, n), env_ad(n, 0.001, 0.12))]


def hat(rng):
    n = int(0.06 * SR)
    return [s * v for s, v in zip(highpass([rng.uniform(-1, 1) for _ in range(n)], 7000), env_ad(n, 0.001, 0.015))]


def bass_note(freq, dur):
    n = int(dur * SR)
    s = sine(freq, n)
    s2 = sine(freq * 2, n)
    e = env_ad(n, 0.005, dur * 0.6)
    return lowpass([(a + 0.3 * b) * v for a, b, v in zip(s, s2, e)], 600)


def pulse_bed():
    """24 s, 120 bpm, A minor. Quiet pad and hats to 8.0 s, then the drop: kick and bass."""
    rng = _rng("bed")
    beat = 60 / BED["bpm"]
    total = int(BED["seconds"] * SR)
    left, right = [0.0] * total, [0.0] * total
    bed = pad(BED["seconds"], 110.0)
    for i in range(total):
        left[i] += 0.35 * bed[i]
        right[i] += 0.35 * bed[i]
    k = kick()
    bassline = [55.0, 55.0, 65.41, 49.0]  # A A C G, one per bar
    t = 0.0
    step = 0
    while t < BED["seconds"] - 0.1:
        at = int(t * SR)
        after = t >= BED["drop"] - 1e-6
        # Off-beat hats throughout, louder after the drop; pan alternates.
        h = hat(rng)
        g = 0.18 if after else 0.08
        mix_into(left, h, at + int(beat / 2 * SR), g * (0.7 if step % 2 else 1.0))
        mix_into(right, h, at + int(beat / 2 * SR), g * (1.0 if step % 2 else 0.7))
        if after:
            mix_into(left, k, at, 0.9)
            mix_into(right, k, at, 0.9)
            if step % 4 == 0:
                b = bass_note(bassline[(step // 4) % 4], beat * 3.5)
                mix_into(left, b, at, 0.55)
                mix_into(right, b, at, 0.55)
        t += beat
        step += 1
    left, right = left[:total], right[:total]
    peak = max(max(abs(s) for s in left), max(abs(s) for s in right))
    g = 10 ** (-1 / 20) / peak
    return fade_out([s * g for s in left], 2.0), fade_out([s * g for s in right], 2.0)


# ---- io -----------------------------------------------------------------------


def write_wav(path, channels):
    path.parent.mkdir(parents=True, exist_ok=True)
    n = len(channels[0])
    with wave.open(str(path), "wb") as w:
        w.setnchannels(len(channels))
        w.setsampwidth(2)
        w.setframerate(SR)
        frames = bytearray()
        for i in range(n):
            for ch in channels:
                frames += struct.pack("<h", int(max(-1, min(1, ch[i])) * 32767))
        w.writeframes(bytes(frames))


def main():
    if "--list" in sys.argv:
        for name, fn in SFX.items():
            base = fn if fn.__name__ != "<lambda>" else SFX[name.split("-")[0]] if name.split("-")[0] in SFX else globals()[name.split("-")[0]]
            doc = (base.__doc__ or "").strip().split("\n")[0]
            print(f"{name:10} {doc}")
        print(f"{'pulse-bed':10} {pulse_bed.__doc__.strip()}")
        return
    for name, fn in SFX.items():
        x = normalise(fn())
        write_wav(SFX_DIR / f"{name}.wav", [x])
        print(f"sfx/{name}.wav  {len(x) / SR:.2f} s")
    left, right = pulse_bed()
    write_wav(MUSIC_DIR / "pulse-bed.wav", [left, right])
    print(f"music/pulse-bed.wav  {len(left) / SR:.2f} s, drop at {BED['drop']} s")


if __name__ == "__main__":
    main()
