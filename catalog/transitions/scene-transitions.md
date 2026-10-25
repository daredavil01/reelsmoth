---
id: scene-transitions
category: transitions
engine: remotion
component: @remotion/transitions
composition: catalog-scene-transitions
duration: 0.4-0.6 s each
params: [presentation, timing]
best-for: [scene changes]
source: https://www.remotion.dev/docs/transitions/presentations
licence: Remotion (source-available licence)
preview: scene-transitions.gif
---

# scene-transitions

**Use when:** Between scenes, when the change is motivated by an object on screen.

Use `TransitionSeries` with `fade()` (calm), `slide()` / `wipe()` (directional), `iris()` (from a circle on screen), timed with `springTiming({config: SPRING.default})` or `linearTiming`. HTML-in-canvas ones (zoomBlur, filmBurn, bookFlip) preview only in Chrome 149+ with the canvas-draw-element flag. Prefer a persistent shared element over a generic wipe.

```tsx
<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 12})} />
```
