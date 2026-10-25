---
id: film-grain
category: texture
engine: remotion
component: src/components/Grain.tsx
composition: catalog-film-grain
duration: whole video
params: [opacity]
best-for: [every video]
source: https://github.com/whaleyxbt/claude-motion
licence: own code
preview: film-grain.gif
---

# film-grain

**Use when:** Over everything, at about 0.09 opacity.

Seeded SVG turbulence tile shifted per frame with `rand.ts`, so renders are deterministic.

```tsx
<Grain />
```
