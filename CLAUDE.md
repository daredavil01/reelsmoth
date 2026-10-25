# Reelsmith house rules

Read this every session. Full background and sources: `docs/playbook.md`.

## Engine
- **Remotion is the default engine** (pinned to one exact version in `package.json`; bump all `@remotion/*` together). Don't switch to Python or another engine on your own.
- Manim only for maths and formal diagrams. MoviePy only for burning exact text onto existing footage. HyperFrames is a candidate second engine; ask before using it.
- Pick the engine per scene, not per repo, when a scene genuinely needs it.
- Use the Remotion skills (`/remotion:remotion-best-practices`, `/remotion:remotion-docs`) to look up APIs instead of guessing.

## Process for every video
1. Brief first (`templates/prompts/01-brief.md`): goal, audience, destination, reference style, beats, components from `catalog/`, music mood, SFX plan. Wait for approval.
2. Spec + `videos/<slug>/timeline.json`. Beats live only there; scenes, audio and review all read it.
3. Stills before motion: one PNG per beat (`npx remotion still`), contact sheet, wait for approval.
4. 540p draft (`scripts/master.sh <Comp> <slug> --draft`), then `scripts/contact-sheet.sh`, score each beat 1-10 on hook, readability, holds, composition, polish. Fix anything under 8 and repeat.
5. Audio: drop on the hero beat, SFX on measured peaks, `scripts/audio-master.sh` to -14 LUFS, true peak <= -1 dBTP.
6. Master (`scripts/master.sh`), then `scripts/encode.sh <slug> <presets>`, then `scripts/check.sh` on every export.
7. Review your own output before showing it. Write `videos/<slug>/README.md`: brief, components, presets, sizes, sources, asset licences.

## Hard rules
- Every frame is a pure function of the frame number. No CSS transitions or animations, no `Math.random()` (use `src/lib/rand.ts`), no `Date`, no timers.
- Never hardcode start times in components. Use offsets from named beats (`src/lib/timeline.ts`).
- No hardcoded colours, fonts or type sizes: use `presets/brand.json` via `src/lib/brand.ts`.
- Frame 0 is never empty or black: it is the thumbnail on autoplay feeds. Open on the hook.
- Text that must be exact (names, prices, sources) is typeset in code, never AI-generated pixels.
- Illustrative data is labelled "Example data" on screen.
- Free or licensed assets only (Mixkit, Pixabay, Pexels, Unsplash, svgl, simple-icons, Freesound CC0). Log every asset's source and licence in `videos/<slug>/README.md`. YouTube Audio Library tracks are for YouTube uploads only.
- Phone check: the key message must read at 360 px wide.
- Never re-encode an export. Every destination file comes from the master.
- Canvas width and height are even numbers.

## Motion defaults (src/lib/easing.ts, src/lib/springs.ts)
| Thing | Default |
| --- | --- |
| Entrance easing | `EASE.enter` = bezier(0.16, 1, 0.3, 1) |
| Exit easing | `EASE.exit` = bezier(0.6, 0, 0.9, 0.35); exits ~half the entrance length |
| State-to-state move | `EASE.move` = bezier(0.65, 0, 0.35, 1) |
| Landing value | `EASE.land` = bezier(0.55, 0, 0.2, 1.12) |
| Linear | only for continuous motion (rotation, drift, grain) |
| Spring, general | damping 14, stiffness 140, mass 0.8 |
| Spring, pop | damping 9-11, stiffness 200-230, mass 0.7 |
| Elastic accent | damping 8, stiffness 200; once per video at most |
| Stagger | words 0.09 s, list items 0.2-0.25 s, dots 0.06 s |
| Typing | 0.035 s per character |
| Reading hold | >= 1 s, +0.25 s per word beyond 3, >= 2 s for the final hook (`readingHold()`) |
| Safe area | nothing within 60 px of an edge; Reels/Shorts: keep text out of top 14%, bottom 35%, 6% sides |
| Type | max 3 families; display ~138 px on a 1080 canvas, -0.02em tracking; one accent colour that means something |
| Texture | grain ~0.09 opacity, vignette, slow drifting grid; nothing dead-still |
| Focus | one hero moment per video, one focal point per frame |
| Transitions | motivated by an object on screen; overlap scenes, no hard gaps |

## Rendering
- Masters: PNG frames, BT.709, ProRes HQ (`--alpha` for ProRes 4444), `--scale=2` for YouTube and HiDPI web. Defaults are in `remotion.config.ts`.
- Deliverables: 4:2:0, BT.709 limited range, faststart. Presets in `presets/render.json`.
- HTML-in-canvas transitions (zoomBlur, filmBurn, bookFlip...) preview only in Chrome 149+ with `chrome://flags/#canvas-draw-element`; renders need nothing extra.
- Masters and exports stay out of git (see `.gitignore`).
