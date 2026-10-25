---
id: bar-race
category: data-viz
engine: remotion
component: src/components/BarRace.tsx
composition: catalog-bar-race
duration: 3-12 s
params: [series, steps, stepSec, moveFraction, rowHeight, width, note, format]
best-for: [rankings over time, data journalism]
source: https://www.remotion.dev/docs/
licence: own code
preview: bar-race.gif
---

# bar-race

**Use when:** Rankings that change over time (years, rounds, months).

Values tween between snapshots with EASE.move for `moveFraction` of each step, then hold so the frame can be read. Bars re-rank by sliding rows. Only the leader takes the accent. Always pass `note` with the source or "Example data".

```tsx
<BarRace steps={['2023', '2024']} series={[{label: 'Shorts', values: [40, 72]}]} note="Example data" />
```
