---
name: sound-design
description: Music, SFX and loudness for a video in this repo: pick a licensed or synthesised track, land its drop on the hero beat, place SFX by their measured peaks from timeline.json, master to -14 LUFS / true peak <= -1 dBTP, and verify sync. Use once picture timing is locked, and whenever audio, music, SFX, voiceover or loudness is added, changed or checked.
---

# Sound design

Most AI-made motion graphics are silent. Sound is what makes a piece feel produced.
All sound is placed from `videos/<slug>/timeline.json` (`audio` section), so retiming a beat
moves its sound. Never type a time into a component.

## Pieces

| Piece | Role |
| --- | --- |
| `public/audio/sfx/`, `public/audio/music/` | the library; every file is logged in `public/audio/LICENCES.md` |
| `scripts/sfx.py` | synthesises the CC0 library (`--list` shows what each sound is for) |
| `scripts/find-drop.py` | finds a track's drop by low-band energy; `--timeline --write` stores it |
| `scripts/measure-peak.py` | measures where each SFX peaks; `--timeline` fills `peak` for every cue |
| `src/components/Soundtrack.tsx` | reads `timeline.audio`, places music and every cue |
| `scripts/audio-master.sh` | two-pass loudnorm on the master: -14 LUFS, ceiling -1.5 dBTP |
| `scripts/check.sh` | measures loudness and true peak of the master and every export |

## Steps

1. **Lock picture first.** Timing changes after this mean re-running steps 3-4.
2. **Pick music** to the brief's mood: `public/audio/music/` or a new Pixabay / Mixkit track
   (log it in `LICENCES.md`: URL, licence, attribution). No music if the brief says so.
3. **Land the drop on the hero beat:**
   `python3 scripts/find-drop.py public/audio/music/<track> --timeline videos/<slug>/timeline.json --write`
   (`--beat <id>` for a beat other than the hero). Check the printed drop by ear-proxy: scrub the
   waveform (`ffmpeg -i <track> -filter_complex showwavespic=s=1600x200 wave.png`).
4. **Write SFX cues** in `timeline.audio.sfx`: `{beat, src, offset, gain, anchor}`; `offset` is
   where the sound's *peak* lands after the beat start (or end with `"anchor": "end"`).
   Then `python3 scripts/measure-peak.py --timeline videos/<slug>/timeline.json`.
5. Render `<Soundtrack timeline={tl} />` in the composition (once, at the top level).
6. Master: `scripts/master.sh <Comp> <slug>`, then
   `scripts/audio-master.sh videos/<slug>/master.mov videos/<slug>/m.mov && mv videos/<slug>/m.mov videos/<slug>/master.mov`.
7. Encode and `scripts/check.sh` every export: -14 LUFS +/-1, true peak <= -1 dBTP. AAC and Opus
   overshoot a few tenths; that is why the master ceiling is -1.5.
8. **Verify sync:** `python3 scripts/find-drop.py videos/<slug>/exports/<file>` must print the
   hero beat's start (+/- one frame).

## Visual event -> sound

| On screen | Sound (`public/audio/sfx/`) | Gain |
| --- | --- | --- |
| Word / line reveal | `whoosh` | 0.08-0.15 |
| Badge, chip, callout pops in | `pop`, `pop-high` (rise in pitch across a sequence) | 0.1-0.2 |
| Control snaps, submit press | `click` | 0.15 |
| List rows, count-up ticks | `tick` | 0.06-0.1 |
| Typing | `key-0`..`key-3` in turn, one cue per character, 0.035 s apart | 0.06-0.1 |
| Build-up to the hero | `riser` (peaks at its end: put it on the hero beat with offset 0) | 0.15-0.2 |
| Hero transition / reveal | `impact`, once per video | 0.25-0.35 |
| Success, end card | `chime` | 0.15-0.2 |
| Under a quiet video | `pad`, or music `volume` 0.3-0.5 | |

Accent, don't narrate: not every motion needs a sound. Continuous motion (drift, grain, rotation)
stays silent. Keep tonal sounds in one key (the library is A minor). Duck music under voiceover
lines with `audio.music.duck: [{beat, amount: 0.65}]`.

## Voiceover (optional)

Default is music + captions. If the brief needs narration:
- **Kokoro-82M** (free, local, Apache 2.0 weights; depends on espeak-ng, GPLv3): generate WAVs per
  beat into `public/audio/vo/<slug>/`, add them as cues anchored to their beats, duck the music.
- **ElevenLabs** (paid, MCP): key only in `.env` (`ELEVENLABS_API_KEY`, see `.env.example`); never
  paste keys into prompts or files Claude reads.
Generate captions from the VO with `/remotion:remotion-captions` (Whisper) and feed `Captions`.

## Report

Say which track and why, where the drop landed (find-drop on the export), the cue list, and the
check.sh loudness lines for every export.
