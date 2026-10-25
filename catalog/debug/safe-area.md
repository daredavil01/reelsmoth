---
id: safe-area
category: debug
engine: remotion
component: src/components/SafeArea.tsx
composition: catalog-safe-area
duration: whole video
params: [marginPx, social, force]
best-for: [layout checks]
source: https://github.com/whaleyxbt/claude-motion
licence: own code
preview: safe-area.gif
---

# safe-area

**Use when:** In Studio while laying out a scene.

Shows the 60 px margin and, with `social`, the Reels/Shorts zones (14% top, 35% bottom, 6% sides). Studio only; `force` renders it (catalog preview only).

```tsx
<SafeArea social />
```
