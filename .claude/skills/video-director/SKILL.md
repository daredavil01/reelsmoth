---
name: video-director
description: Turn a URL, post or brief into a finished video in this repo. Use whenever the user asks for a video, reel, short, explainer, intro or animation from content, or wants components suggested for one.
---

# Video director

## 0. Read first
- `CLAUDE.md` (house rules, motion defaults), `presets/brand.json`, `presets/render.json`, `catalog/README.md`.
- Engine: Remotion (default). Manim only for maths; MoviePy only for exact text on existing footage.

## 1. Classify the request
Format: explainer | launch/promo | data story | quote/essay reel | event recap | children's story.
Destination: youtube | shorts | whatsapp | linkedin | x | web | web-loop (ask if missing; it sets aspect, length, captions).
Length defaults: shorts/whatsapp 15-45 s, youtube 60-180 s, web hero 8-15 s loop.
Aspect: shorts needs a 1080x1920 composition; youtube needs landscape. Other presets take either.

## 2. Propose components (do not build yet)
For each beat pick by name from `catalog/`: intro, transitions, content blocks, outro, music mood, SFX.
Rules: one hero moment; one accent colour; captions on for shorts/whatsapp;
hook-first cold open for shorts/whatsapp; chapter cards only for youtube > 90 s.
Pull the facts from the content and flag any claim that needs a source.
Output `videos/<slug>/brief.md` (template: `templates/video/brief.md`) and wait for approval.

## 3. Spec and stills
Write `videos/<slug>/spec.md` + `videos/<slug>/timeline.json` (prompt: `templates/prompts/02-spec.md`).
Register the composition in `src/Root.tsx`, durations from `totalFrames(timeline)`.
Render one still per beat into `videos/<slug>/stills/` with `npx remotion still`; wait for approval.

## 4. Animate and self-review
Pure function of frame. `scripts/master.sh <Comp> <slug> --draft` ->
`scripts/contact-sheet.sh videos/<slug>/draft.mp4 videos/<slug>/timeline.json` ->
look at the sheet, score each beat 1-10 (hook, readability, holds, composition, polish) ->
fix anything < 8 -> repeat. Check frame 0, the safe area and 360 px readability.

## 5. Audio
Pick a track from `public/audio/` (licence logged in `videos/<slug>/README.md`).
Drop on the hero beat, SFX on measured peaks. After the master render,
`scripts/audio-master.sh` to -14 LUFS, true peak <= -1 dBTP.

## 6. Render and export
`scripts/master.sh <Comp> <slug>` (ProRes HQ, PNG frames, BT.709; `--alpha` for transparency;
`--scale=2` for youtube and web heroes). Then `scripts/encode.sh <slug> <preset...>`
and `scripts/check.sh videos/<slug>/exports/<file> <preset>` for each export. Fix any FAIL.
Write `videos/<slug>/README.md`: brief, components used, presets, file sizes, sources, licences.

## 7. Learn
If a new reusable piece was built, move it to `src/components/`, add `catalog/<category>/<id>.md`,
and add any repeated correction from the user to `CLAUDE.md`.
