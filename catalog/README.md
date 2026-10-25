# Component catalog

One Markdown file per component at `catalog/<category>/<id>.md`, so the video-director skill can match a brief to components by id. The skill reads the generated [`index.json`](index.json), not this page.

Categories: `intros`, `transitions`, `text`, `data-viz`, `content`, `outros`, `texture`, `debug` (and `audio` once the sound library has entries worth picking by name).

## Adding an entry

1. Build the component in `src/components/` (brand tokens only, offsets from beats, pure function of frame).
2. Add a 3 s preview composition to `src/catalog/demos.tsx` (registered as `catalog-<id>`).
3. Write `catalog/<category>/<id>.md` with the frontmatter below and a **Use when:** line.
4. `scripts/catalog-previews.sh <id>` renders `<id>.gif` (480 px, 15 fps, Git LFS).
5. `npm run catalog` rebuilds `index.json` and the table below; `npm run catalog -- --check` runs in CI.

```yaml
---
id: masked-headline
category: intros
engine: remotion            # remotion | hyperframes | manim | moviepy
component: src/components/MaskReveal.tsx
composition: catalog-masked-headline
duration: 1.5-3 s
params: [text, accentWords, preroll, stagger, wordDuration]
best-for: [headline intros, hook-first cold opens]
source: https://github.com/whaleyxbt/claude-motion
licence: own code; motion numbers from claude-motion
preview: masked-headline.gif   # 3 s, 480 px, Git LFS
---
```

## Index

<!-- INDEX:START -->
| id | Category | Component | Use when | Preview |
| --- | --- | --- | --- | --- |
| [ui-showcase](content/ui-showcase.md) | content | `src/components/UIShowcase.tsx` | Product and site demos: a real screen rises out of a perspective tilt. | ![ui-showcase](content/ui-showcase.gif) |
| [bar-race](data-viz/bar-race.md) | data-viz | `src/components/BarRace.tsx` | Rankings that change over time (years, rounds, months). | ![bar-race](data-viz/bar-race.gif) |
| [count-up-stat](data-viz/count-up-stat.md) | data-viz | `src/components/RollingNumber.tsx` | One number the viewer must remember. | ![count-up-stat](data-viz/count-up-stat.gif) |
| [map-route](data-viz/map-route.md) | data-viz | `src/components/MapRoute.tsx` | A route between a few named places, where exact geography matters less than the journey. | ![map-route](data-viz/map-route.gif) |
| [safe-area](debug/safe-area.md) | debug | `src/components/SafeArea.tsx` | In Studio while laying out a scene. | ![safe-area](debug/safe-area.gif) |
| [chapter-card](intros/chapter-card.md) | intros | `src/components/ChapterCard.tsx` | Long-form YouTube only (over 90 s): marks a chapter change. | ![chapter-card](intros/chapter-card.gif) |
| [editorial-poster](intros/editorial-poster.md) | intros | `src/components/EditorialPoster.tsx` | Data stories and essays that open on one big figure with a two or three line headline. | ![editorial-poster](intros/editorial-poster.gif) |
| [hook-cold-open](intros/hook-cold-open.md) | intros | `src/components/HookOpen.tsx` | Social and chat destinations, where the first frame is the thumbnail and viewers decide in under a second. Put the claim or the number on frame 0. No logo. | ![hook-cold-open](intros/hook-cold-open.gif) |
| [masked-headline](intros/masked-headline.md) | intros | `src/components/MaskReveal.tsx` | Any headline that should feel typeset rather than faded in. | ![masked-headline](intros/masked-headline.gif) |
| [prompt-type-demo](intros/prompt-type-demo.md) | intros | `src/components/PromptType.tsx` | AI and product demos: a prompt is typed, submitted, and a result appears. | ![prompt-type-demo](intros/prompt-type-demo.gif) |
| [push-in-title](intros/push-in-title.md) | intros | `src/components/PushInTitle.tsx` | Premium or minimal tone: dark canvas, one warm accent, a kicker line over a short title. | ![push-in-title](intros/push-in-title.gif) |
| [cta-end-card](outros/cta-end-card.md) | outros | `src/components/CtaEndCard.tsx` | The last beat when there is a URL, handle or "follow" line. | ![cta-end-card](outros/cta-end-card.gif) |
| [logo-outro](outros/logo-outro.md) | outros | `src/components/LogoOutro.tsx` | Brand videos: the logo resolves and holds. | ![logo-outro](outros/logo-outro.gif) |
| [loop-seam](outros/loop-seam.md) | outros | `src/components/LoopOrbit.tsx` | Muted autoplay loops (web-loop preset) and social loops. | ![loop-seam](outros/loop-seam.gif) |
| [kinetic-captions](text/kinetic-captions.md) | text | `src/components/Captions.tsx` | Every video that will be watched muted: Shorts, Reels, WhatsApp, LinkedIn feed. | ![kinetic-captions](text/kinetic-captions.gif) |
| [lower-third](text/lower-third.md) | text | `src/components/LowerThird.tsx` | Names, sources and labels over a shot. | ![lower-third](text/lower-third.gif) |
| [quote-card](text/quote-card.md) | text | `src/components/QuoteCard.tsx` | Essays and posts with a line worth quoting. | ![quote-card](text/quote-card.gif) |
| [film-grain](texture/film-grain.md) | texture | `src/components/Grain.tsx` | Over everything, at about 0.09 opacity. | ![film-grain](texture/film-grain.gif) |
| [grid-background](texture/grid-background.md) | texture | `src/components/Background.tsx` | Under everything, so nothing is dead-still. | ![grid-background](texture/grid-background.gif) |
| [scene-transitions](transitions/scene-transitions.md) | transitions | `@remotion/transitions` | Between scenes, when the change is motivated by an object on screen. | ![scene-transitions](transitions/scene-transitions.gif) |
<!-- INDEX:END -->

See `docs/playbook.md` "Component catalog" for the background on each.
