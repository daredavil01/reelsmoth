---
id: loop-seam
category: outros
engine: remotion
component: src/components/LoopOrbit.tsx
composition: catalog-loop-seam
duration: any (loop length)
params: [dots, radius, children]
best-for: [web-loop heroes, social loops]
source: https://github.com/whaleyxbt/claude-motion
licence: own code
preview: loop-seam.gif
---

# loop-seam

**Use when:** Muted autoplay loops (web-loop preset) and social loops.

Every moving value comes from `loopPhase()` / `loopWave()` in `src/lib/loop.ts`, so the last frame flows into the first in position and velocity. Use whole-number cycles per loop; never a tween that stops.

```tsx
<LoopOrbit><div>Loops forever</div></LoopOrbit>
```
