---
id: push-in-title
category: intros
engine: remotion
component: src/components/PushInTitle.tsx
composition: catalog-push-in-title
duration: 2-4 s
params: [title, kicker, accentWord, push]
best-for: [premium launches, minimal title cards, essay intros]
source: https://open-design.ai/plugins/templates/hyperframes/
licence: own code; idea from HyperFrames templates (Apache 2.0)
preview: push-in-title.gif
---

# push-in-title

**Use when:** Premium or minimal tone: dark canvas, one warm accent, a kicker line over a short title.

Slow camera push from scale 1.0 to 1.06 over `push` seconds with EASE.enter; title rises 30 px. Nothing else moves, so it reads as calm.

```tsx
<PushInTitle kicker="A field guide" title="The quiet launch" accentWord="quiet" />
```
