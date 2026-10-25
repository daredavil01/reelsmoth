---
id: masked-headline
category: intros
engine: remotion
component: src/components/MaskReveal.tsx
composition: catalog-masked-headline
duration: 1.5-3 s
params: [text, accentWords, accentColor, preroll, stagger, wordDuration]
best-for: [headline intros, section titles, hook-first cold opens]
source: https://github.com/whaleyxbt/claude-motion
licence: own code; motion numbers from claude-motion
preview: masked-headline.gif
---

# masked-headline

**Use when:** Any headline that should feel typeset rather than faded in.

Words slide up out of a clip, 0.09 s stagger, about 0.8 s each, EASE.enter. One accent word per line at most. Set `preroll` on the opening shot so frame 0 reads.

```tsx
<MaskReveal text="Content in, video out." accentWords={['video']} accentColor={BRAND.colors.accent} />
```
