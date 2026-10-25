---
id: map-route
category: data-viz
engine: remotion
component: src/components/MapRoute.tsx
composition: catalog-map-route
duration: 2-4 s
params: [stops, draw, width, height, padDeg]
best-for: [travel, events, supply chains, geography]
source: https://www.remotion.dev/docs/ai/skills
licence: own code
preview: map-route.gif
---

# map-route

**Use when:** A route between a few named places, where exact geography matters less than the journey.

Equirectangular projection onto a 1-degree graticule, no tiles, so it renders offline and deterministically. The path draws with EASE.move, a marker rides the head, each stop pops on SPRING.pop when reached. For real basemaps, terrain or 3D flyovers use the `/remotion:remotion-maps` skill instead.

```tsx
<MapRoute stops={[{label: 'Pune', lon: 73.86, lat: 18.52}, {label: 'Goa', lon: 74.12, lat: 15.3}]} />
```
