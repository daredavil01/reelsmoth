---
id: cta-end-card
category: outros
engine: remotion
component: src/components/CtaEndCard.tsx
composition: catalog-cta-end-card
duration: >= 2 s
params: [line, url]
best-for: [every video with a next step]
source: https://github.com/whaleyxbt/claude-motion
licence: own code
preview: cta-end-card.gif
---

# cta-end-card

**Use when:** The last beat when there is a URL, handle or "follow" line.

Line rises, URL pill pops on SPRING.pop, underline draws. Size the beat with `readingHold(line, true)` so it holds at least 2 s. The URL is exact text.

```tsx
<CtaEndCard line="Read the full post" url="example.com/post" />
```
