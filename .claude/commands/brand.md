---
description: Set up or update the brand tokens (presets/brand.json) from a brand kit, site or description
argument-hint: <url | path to brand kit | description>
---
Source: $ARGUMENTS

1. Read `presets/brand.json` and the source. From a URL, take colours and fonts from the page's CSS
   (custom properties, `body`, headings); from a file, from the kit itself. Never invent a logo.
2. Propose new values as a diff of `presets/brand.json`, keeping every existing key
   (components read them): `colors.bg/surface/line/text/muted/accent/black`, `fonts.display/body/serif/mono`
   (max 3 families in use), `type.*` sizes, `wordmark`, `logo` (a path under `public/`, or null).
3. Check before proposing: text on bg and accent on bg contrast >= 4.5:1 (WCAG AA); one accent colour only;
   fonts are free to embed (Google Fonts or the kit's licence) and noted with their licence.
4. Wait for approval. Then write the file, put font files under `public/fonts/` with their licence,
   and run `npm run typecheck`.
5. Show the result: `npx remotion still Demo out/brand-check.png --frame=150` and
   `scripts/catalog-previews.sh hook-cold-open count-up-stat` (don't commit regenerated GIFs unless asked).
