---
id: chapter-card
category: intros
engine: remotion
component: src/components/ChapterCard.tsx
composition: catalog-chapter-card
duration: 2-3 s
params: [label, title]
best-for: [youtube chapters over 90 s, documentary tone]
source: https://open-design.ai/plugins/templates/hyperframes/
licence: own code; idea from HyperFrames templates (Apache 2.0)
preview: chapter-card.gif
---

# chapter-card

**Use when:** Long-form YouTube only (over 90 s): marks a chapter change.

2.39:1 letterbox bars slide in, a warm light leak drifts linearly across, grain at 0.16, large serif title tracking in from +0.06em. Pair with a fade or filmBurn transition.

```tsx
<ChapterCard label="Chapter 02" title="The long way round" />
```
