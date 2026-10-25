---
id: count-up-stat
category: data-viz
engine: remotion
component: src/components/RollingNumber.tsx
composition: catalog-count-up-stat
duration: 1.5-2.5 s
params: [to, from, duration, preroll, decimals, prefix, suffix, separator, style]
best-for: [stats, data stories, hero numbers]
source: https://github.com/whaleyxbt/claude-motion
licence: own code
preview: count-up-stat.gif
---

# count-up-stat

**Use when:** One number the viewer must remember.

Odometer digits in tabular mono: the last digit spins, higher digits roll over as the digit below passes 9, and the count lands exactly on `to` with EASE.enter. Non-negative values only. Label illustrative numbers "Example data".

```tsx
<RollingNumber to={2480} prefix="$" style={{fontSize: BRAND.type.statPx}} />
```
