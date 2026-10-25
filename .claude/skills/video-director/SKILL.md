---
name: video-director
description: Turn a URL, post or brief into a finished video in this repo. Use whenever the user asks for a video, reel, short, explainer, intro or animation from content, or wants components suggested for one.
---

# Video director

## 0. Read first
- `CLAUDE.md` (house rules, motion defaults), `presets/brand.json`, `presets/render.json`.
- `catalog/index.json`: every component with `id`, `category`, `useWhen`, `bestFor`, `params`, `duration`,
  `preview` (a GIF you can open). Pick components from here by id; read the entry's `doc` for usage.
  If it is missing or stale, run `npm run catalog`.
- Engine: Remotion (default). Manim only for maths; MoviePy only for exact text on existing footage.

## 1. Classify the request
Format: explainer | launch/promo | data story | quote/essay reel | event recap | children's story.
Destination: youtube | shorts | whatsapp | linkedin | x | web | web-loop (ask if missing; it sets aspect, length, captions).
Length defaults: shorts/whatsapp 15-45 s, youtube 60-180 s, web hero 8-15 s loop.
Aspect: shorts needs a 1080x1920 composition; youtube needs landscape. Other presets take either.

## 2. Propose components (do not build yet)
For each beat pick a catalog id from `catalog/index.json` (match the beat to `useWhen` / `bestFor`):
intro, transitions, content blocks, outro, plus music mood and SFX. If nothing fits, say so and
describe the new component; it becomes a catalog entry in step 7.
Rules: one hero moment; one accent colour; captions on for shorts/whatsapp;
hook-first cold open for shorts/whatsapp; chapter cards only for youtube > 90 s.
Pull the facts from the content and flag any claim that needs a source.
Output `videos/<slug>/brief.md` (template: `templates/video/brief.md`) and wait for approval.

## 3. Spec and stills
Write `videos/<slug>/spec.md` (template: `templates/video/spec.md`) + `videos/<slug>/timeline.json`
(`"$schema": "../../src/lib/timeline.schema.json"`, mark the hero beat `"hero": true`; prompt: `templates/prompts/02-spec.md`).
`npm run validate` must pass.
Register the composition in `src/Root.tsx`, durations from `totalFrames(timeline)`.
Render one still per beat into `videos/<slug>/stills/` with `npx remotion still`; wait for approval.

## 4. Animate and self-review
Pure function of frame. Then run the **review-loop** skill: 540p draft, beat contact sheet,
frame 0, `scripts/flash-scan.sh`, score each beat 1-10 (hook, readability, holds, composition,
polish), fix anything < 8, repeat until clean.

## 5. Audio
Once picture timing is locked, run the **sound-design** skill: track from `public/audio/music/`
(licence in `public/audio/LICENCES.md`, copied to the video README), drop on the hero beat,
SFX on measured peaks, all placed from `timeline.json`. After the master render,
`scripts/audio-master.sh` to -14 LUFS, true peak <= -1 dBTP.

## 6. Render and export
`scripts/master.sh <Comp> <slug>` (ProRes HQ, PNG frames, BT.709; `--alpha` for transparency;
`--scale=2` for youtube and web heroes). Then `scripts/encode.sh <slug> <preset...>`
and `scripts/check.sh videos/<slug>/exports/<file> <preset>` for each export. Fix any FAIL.
Write `videos/<slug>/README.md` (template: `templates/video/README.md`): brief, components used,
presets, file sizes, sources, licences.

## 7. Learn
If a new reusable piece was built, move it to `src/components/` and follow "Adding an entry" in
`catalog/README.md` (doc, preview composition, GIF, `npm run catalog`).
Add any repeated correction from the user to `CLAUDE.md`.
