# Audio licences

Every file under `public/audio/` is listed here with its source, licence and the attribution
text to use (if any). Copy the rows for the files a video uses into `videos/<slug>/README.md`.

Rules (CLAUDE.md): free or licensed assets only. Pixabay Music and Mixkit: free for commercial
use, no attribution required. Freesound: check each clip (CC0 preferred; CC BY needs the credit
below). YouTube Audio Library: YouTube uploads only, never for WhatsApp, web or other platforms.

## Synthesised in this repo (`python3 scripts/sfx.py`)

Generated from code with seeded random, so they rebuild byte-identical. Own work, released CC0;
no attribution needed.

| File | What it is for | Peak (s) | Source | Licence | Attribution |
| --- | --- | --- | --- | --- | --- |
| `sfx/whoosh.wav` | word, line or card arriving | 0.182 | `scripts/sfx.py` `whoosh()` | CC0 (own work) | none |
| `sfx/pop.wav`, `sfx/pop-high.wav` | badge, chip, callout | 0.007 | `pop()` | CC0 (own work) | none |
| `sfx/click.wav` | control snaps to a step, submit press | 0.003 | `click()` | CC0 (own work) | none |
| `sfx/tick.wav` | list rows, counters | 0.003 | `tick()` | CC0 (own work) | none |
| `sfx/key-0.wav` ... `key-3.wav` | typing, one per character | 0.003 | `key()` | CC0 (own work) | none |
| `sfx/riser.wav` | build-up; peaks at its end | 1.992 | `riser()` | CC0 (own work) | none |
| `sfx/impact.wav` | the hero hit, once per video | 0.043 | `impact()` | CC0 (own work) | none |
| `sfx/chime.wav` | success, end card | 0.013 | `chime()` | CC0 (own work) | none |
| `sfx/pad.wav` | 8 s A minor bed | - | `pad()` | CC0 (own work) | none |
| `music/pulse-bed.wav` | 24 s, 120 bpm, A minor; drop at 8.000 s | - | `pulse_bed()` | CC0 (own work) | none |

Peaks from `scripts/measure-peak.py`; the drop from `scripts/find-drop.py`.

## Downloaded

| File | Source URL | Licence | Attribution |
| --- | --- | --- | --- |
| (none yet) | | | |
