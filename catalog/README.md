# Component catalog

One Markdown file per component at `catalog/<category>/<id>.md`, so the video-director skill can match a brief to components by id. Categories: `intros`, `transitions`, `text`, `data-viz`, `outros`, `audio`.

Frontmatter for each entry:

```yaml
---
id: masked-headline
category: intros
engine: remotion            # remotion | hyperframes | manim | moviepy
component: src/components/MaskReveal.tsx
duration: 1.5-3 s
params: [text, accentWords, preroll, stagger, wordDuration]
best-for: [headline intros, hook-first cold opens]
source: https://github.com/whaleyxbt/claude-motion
licence: own code; motion numbers from claude-motion
preview: masked-headline.gif   # 3 s, 480 px, Git LFS
---
```

## Built so far

| id | Category | Component | Notes |
| --- | --- | --- | --- |
| masked-headline | intros | `src/components/MaskReveal.tsx` | Words rise out of a mask, 0.09 s stagger, ~0.8 s each. `preroll` makes frame 0 read. |
| grid-background | texture | `src/components/Background.tsx` | Dark canvas, drifting grid, vignette. |
| film-grain | texture | `src/components/Grain.tsx` | Seeded per-frame grain at ~0.09 opacity. |
| count-up-stat | data-viz | `src/components/RollingNumber.tsx` | Odometer digits, tabular mono, lands exactly on the value. |
| lower-third | text | `src/components/LowerThird.tsx` | Accent bar pops (SPRING.pop), text follows; exits at the end of its Sequence. |
| kinetic-captions | text | `src/components/Captions.tsx` | @remotion/captions pages, active word in accent. `captionsFromText()` when there is no transcript. |
| safe-area | debug | `src/components/SafeArea.tsx` | Studio-only overlay: 60 px margin, optional Reels zones. |

## Planned first 15 (Phase 3)

hook cold open, masked headline, push-in title, editorial poster, chapter card, prompt-type demo, count-up stat, bar race, map route, quote card, UI showcase, kinetic captions, logo outro, CTA end card, loop seam. See `docs/playbook.md` "Component catalog" for the use-when and build notes of each.
