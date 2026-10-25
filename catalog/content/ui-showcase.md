---
id: ui-showcase
category: content
engine: remotion
component: src/components/UIShowcase.tsx
composition: catalog-ui-showcase
duration: 2-5 s
params: [src, children, width, aspect, tilt]
best-for: [product demos, site launches, app walkthroughs]
source: https://playwright.dev/
licence: own code
preview: ui-showcase.gif
---

# ui-showcase

**Use when:** Product and site demos: a real screen rises out of a perspective tilt.

Capture the page with Playwright (pre-installed) into `public/`, pass `staticFile()` as `src`. Rises from rotateX 38 degrees to `tilt` with EASE.enter over 1.4 s, then drifts linearly so it is never dead-still.

```tsx
<UIShowcase src={staticFile('screens/home.png')} />
```
