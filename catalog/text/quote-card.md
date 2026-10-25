---
id: quote-card
category: text
engine: remotion
component: src/components/QuoteCard.tsx
composition: catalog-quote-card
duration: 3-6 s
params: [quote, accentWord, attribution, preroll, fontSize]
best-for: [essays, substack posts, testimonials]
source: https://github.com/whaleyxbt/claude-motion
licence: own code
preview: quote-card.gif
---

# quote-card

**Use when:** Essays and posts with a line worth quoting.

Serif display revealed word by word (0.06 s stagger), one accent word, attribution in mono once the quote has landed. Quotes are exact text: typeset in code. Hold with `readingHold(quote)`.

```tsx
<QuoteCard quote="Hold longer and animate less." accentWord="less" attribution="House rule" />
```
