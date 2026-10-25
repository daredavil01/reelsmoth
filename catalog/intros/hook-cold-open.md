---
id: hook-cold-open
category: intros
engine: remotion
component: src/components/HookOpen.tsx
composition: catalog-hook-cold-open
duration: 1.5-3 s
params: [claim, accentWords, kicker, preroll, fontSize]
best-for: [shorts, whatsapp, reels cold opens, frame-0 thumbnails]
source: https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md
licence: own code; motion numbers from claude-motion
preview: hook-cold-open.gif
---

# hook-cold-open

**Use when:** Social and chat destinations, where the first frame is the thumbnail and viewers decide in under a second. Put the claim or the number on frame 0. No logo.

Uses MaskReveal with `preroll` 0.9 so the claim is fully set on frame 0, then a 4% punch-in settles and an accent underline draws. Keep the claim to 6 words or fewer; on a 1080x1920 canvas keep it between 14% and 65% of the height.

```tsx
<HookOpen claim="9 in 10 people watch muted." accentWords={['muted']} kicker="Shorts" />
```
