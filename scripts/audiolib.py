"""Shared helpers for the audio scripts: decode with ffmpeg, measure envelopes."""
import array
import json
import math
import subprocess
from pathlib import Path


def decode(path, sr=11025, filters=None):
    """Mono float samples at `sr`, optionally through an ffmpeg -af chain."""
    cmd = ["ffmpeg", "-nostdin", "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(sr)]
    if filters:
        cmd += ["-af", filters]
    cmd += ["-f", "s16le", "-"]
    raw = subprocess.run(cmd, check=True, capture_output=True).stdout
    a = array.array("h")
    a.frombytes(raw)
    return [s / 32768 for s in a]


def rms_envelope(x, sr, hop_s=0.02):
    """RMS per hop: list of (time_s, rms)."""
    hop = max(1, int(hop_s * sr))
    out = []
    for i in range(0, len(x) - hop + 1, hop):
        seg = x[i:i + hop]
        out.append((i / sr, math.sqrt(sum(s * s for s in seg) / hop)))
    return out


def load_timeline(path):
    return json.loads(Path(path).read_text())


def save_timeline(path, data):
    Path(path).write_text(json.dumps(data, indent=2) + "\n")
