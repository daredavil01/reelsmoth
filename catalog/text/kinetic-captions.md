---
id: kinetic-captions
category: text
engine: remotion
component: src/components/Captions.tsx
composition: catalog-kinetic-captions
duration: whole video
params: [captions, combineWithinMs, anchor, maxWidth, fontSize]
best-for: [shorts, whatsapp, anything watched muted]
source: https://www.remotion.dev/docs/captions/
licence: own code on @remotion/captions
preview: kinetic-captions.gif
---

# kinetic-captions

**Use when:** Every video that will be watched muted: Shorts, Reels, WhatsApp, LinkedIn feed.

Takes @remotion/captions `Caption[]` (a Whisper transcript via `/remotion:remotion-captions`, or `captionsFromText()` from on-screen copy). Words are paged with `createTikTokStyleCaptions`; the active word takes the accent and pops on SPRING.pop. Keep `anchor` at 0.65 or above the bottom 35% on Reels/Shorts.

```tsx
<Captions captions={captionsFromText(COPY.line, 0)} anchor={0.62} />
```
