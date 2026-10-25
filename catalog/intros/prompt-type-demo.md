---
id: prompt-type-demo
category: intros
engine: remotion
component: src/components/PromptType.tsx
composition: catalog-prompt-type-demo
duration: 2.5-4 s
params: [prompt, children, delay, pause, pretyped, width]
best-for: [AI demos, product demos, tool walkthroughs]
source: https://kortix.com/marketplace/heygen-com--hyperframes/hyperframes-animation
licence: own code; timings from claude-motion and hyperframes-animation
preview: prompt-type-demo.gif
---

# prompt-type-demo

**Use when:** AI and product demos: a prompt is typed, submitted, and a result appears.

Typing at 0.035 s per character, caret blinks at 2.4 Hz when idle, the submit button snaps on SPRING.notch, the result rises on SPRING.default 0.25 s after submit. Set `pretyped` so frame 0 already shows a few characters. Pair with typing SFX (`mix.typing` in the sound-design skill).

```tsx
<PromptType prompt="Turn this post into a 30 s Short">{result}</PromptType>
```
