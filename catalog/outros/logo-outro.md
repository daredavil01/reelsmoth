---
id: logo-outro
category: outros
engine: remotion
component: src/components/LogoOutro.tsx
composition: catalog-logo-outro
duration: 2-3 s
params: [logoSrc, wordmark, tagline, logoHeight]
best-for: [brand videos, launch outros]
source: https://open-design.ai/plugins/templates/hyperframes/
licence: own code
preview: logo-outro.gif
---

# logo-outro

**Use when:** Brand videos: the logo resolves and holds.

Resolves out of a 24 px blur with scale 0.92 to 1, an accent glow blooms then settles, tagline fades in after. Hold 1.5-2 s after it lands. Falls back to `BRAND.wordmark` while `presets/brand.json` has no logo.

```tsx
<LogoOutro logoSrc={staticFile('logo.svg')} tagline="Content in, video out" />
```
