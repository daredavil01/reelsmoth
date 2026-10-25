---
name: review-loop
description: Visual self-review for a video in this repo: render a draft, build contact sheets at every beat, score each beat 1-10, scan for pops and flashes, fix anything under 8, repeat. Use after any change to a video's visuals or timing, and always before calling a video done or showing it to the user.
---

# Review loop

You can't watch the video, but you can look at frames. Never report a video as done without
looking at contact sheets of the current render.

## Loop

1. **Draft:** `scripts/master.sh <Comp> <slug> --draft` -> `videos/<slug>/draft.mp4` (540p, fast).
2. **Beat sheet:** `scripts/contact-sheet.sh videos/<slug>/draft.mp4 videos/<slug>/timeline.json`
   -> one frame per beat at 70% of its duration, labelled. Open it (Read the PNG).
3. **Frame 0:** `npx remotion still <Comp> videos/<slug>/stills/f0.png --frame=0` and look at it.
   It is the feed thumbnail: the hook must already read.
4. **Pop / flash scan:** `scripts/flash-scan.sh videos/<slug>/draft.mp4 videos/<slug>/timeline.json`.
   Every `CHECK` line is a jump not on a beat start: an element with no entrance, a one-frame
   flash, or a gap between scenes. Scrub it (step 5) and fix it.
5. **Zoom in** on anything suspicious:
   - `scripts/contact-sheet.sh <video> --from 3 --to 5 --every 0.1` to scrub a transition,
   - `scripts/contact-sheet.sh <video> --at 3.7,3.75,3.8` for exact moments,
   - `npx remotion still <Comp> out.png --frame=<n>` for one full-resolution frame.
6. **Score** each beat 1-10 on the five axes below and write the table in your reply.
7. Fix everything under 8, re-render, go back to 1. Stop when a full pass scores 8+ everywhere
   and the flash scan is clean.

## Score each beat (1-10)

| Axis | 10 looks like | Typical fixes |
| --- | --- | --- |
| Hook | The point reads on frame 0 / in the first second | `preroll`, open on the claim, cut the logo |
| Readability | Readable on the tile shrunk to 360 px wide; contrast against the background | bigger type, fewer words, `BRAND.type.*` |
| Holds | Text has settled for `readingHold()` before it moves again; nothing moves while being read | lengthen the beat in timeline.json, shorter entrances |
| Composition | One focal point; nothing within 60 px of an edge; Reels zones respected; no collisions | stagger competing elements, `SafeArea social` in Studio |
| Polish | Grain + drift (nothing dead-still); exits ~half the entrance; scenes overlap; one accent | house easings and springs, overlap beats |

## Checklist

- Frame 0 is real content, not black or a bare background (`scripts/check.sh` also fails it).
- Nothing clipped by a mask, container or the frame when it shouldn't be.
- Exiting and entering elements don't share space mid-transition (scrub every transition).
- Only brand colours; the accent marks the point of the frame and nothing else.
- Same element looks the same in every scene it appears in.
- Illustrative numbers carry "Example data" on screen; exact text (names, prices, URLs) is typeset in code.
- Captions on for shorts/whatsapp, inside the safe zone.
- After audio (sound-design skill): `scripts/check.sh` shows -14 LUFS +/-1 and true peak <= -1 dBTP.

## Report

Say what you checked, the score table, what you fixed, and which sheet shows it.
Don't claim a fix you haven't re-rendered and looked at.
