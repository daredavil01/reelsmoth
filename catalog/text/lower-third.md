---
id: lower-third
category: text
engine: remotion
component: src/components/LowerThird.tsx
composition: catalog-lower-third
duration: 2-4 s
params: [title, subtitle, exit, align, style]
best-for: [names, sources, labels]
source: https://github.com/whaleyxbt/claude-motion
licence: own code
preview: lower-third.gif
---

# lower-third

**Use when:** Names, sources and labels over a shot.

Accent bar pops on SPRING.pop, title rises out of a mask, subtitle in mono follows 0.24 s later; exits with EASE.exit in the last 0.4 s of its Sequence.

```tsx
<Sequence {...beatFrames(tl, 'credit')}><LowerThird title="Jane Example" subtitle="Source" /></Sequence>
```
