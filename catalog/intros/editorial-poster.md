---
id: editorial-poster
category: intros
engine: remotion
component: src/components/EditorialPoster.tsx
composition: catalog-editorial-poster
duration: 2-3 s
params: [figure, lines, kicker, footnote]
best-for: [data stories, essays, one big number]
source: https://open-design.ai/plugins/templates/hyperframes/
licence: own code; idea from HyperFrames Bold Poster template (Apache 2.0)
preview: editorial-poster.gif
---

# editorial-poster

**Use when:** Data stories and essays that open on one big figure with a two or three line headline.

A rule draws across (0.7 s), the figure drops on SPRING.heavy and tilts -8 degrees, headline lines rise with a 0.22 s stagger in the serif. Use `footnote` for the source or "Example data".

```tsx
<EditorialPoster figure="73%" lines={['of readers never', 'scroll past the', 'first screen.']} footnote="Example data" />
```
