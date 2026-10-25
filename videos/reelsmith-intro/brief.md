# Reelsmith in 30 seconds

> Status: **draft, waiting for approval.** Made as the Phase 4 dry run of `/video docs/playbook.md shorts whatsapp`; a candidate for Pilot 1.

- **Slug:** reelsmith-intro
- **Source:** `docs/playbook.md` (this repo)
- **Destination(s):** shorts, whatsapp
- **Length:** 30 s at 30 fps (900 frames), 1080x1920
- **Format:** explainer

## One-line message
Give Claude a post, get back a finished video for every platform, made to house rules.

## Audience
Writers and builders who post on Shorts and WhatsApp, know what Claude Code is, and have never made motion graphics.

## Hook (first 2 s, on frame 0)
"Post in. Video out." Set on frame 0 with `preroll`, no logo.

## Reference style
Dark editorial with one warm accent (brand tokens), Apple-keynote pacing: one idea per beat, long holds.

## Beats
| # | Beat id | Start | Duration | On-screen copy | Component (catalog id) | Preview | Transition out (motivating object) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | hook | 0.0 | 2.6 | Post in. Video out. | hook-cold-open | `catalog/intros/hook-cold-open.gif` | The word "Video" stays and becomes the prompt text |
| 2 | prompt | 2.4 | 4.2 | "Turn this post into a 30 s Short" | prompt-type-demo | `catalog/intros/prompt-type-demo.gif` | Result cards slide into the next beat (slide) |
| 3 | steps | 6.4 | 5.0 | Brief → Stills → Draft → Review | masked-headline (one line per step, 0.22 s stagger) | `catalog/intros/masked-headline.gif` | The "Review" card grows into the stat |
| 4 | stat | 11.2 | 4.0 | 20 components in the catalog | count-up-stat (**hero**: music drop) | `catalog/data-viz/count-up-stat.gif` | Number shrinks into the first bar |
| 5 | presets | 15.0 | 5.6 | One master, 8 exports | bar-race restyled as a static list of presets (YouTube, Shorts, WhatsApp, LinkedIn, X, Web...) | `catalog/data-viz/bar-race.gif` | Bars collapse into a single line |
| 6 | loudness | 20.4 | 3.6 | -14 LUFS. Every time. | push-in-title | `catalog/intros/push-in-title.gif` | fade |
| 7 | cta | 23.8 | 6.2 | Make your first video / github.com/daredavil01/reelsmoth | cta-end-card (held >= 2 s) | `catalog/outros/cta-end-card.gif` | none (end) |

Under everything: grid-background, film-grain, and kinetic-captions (a caption line per beat, `anchor` 0.62, inside the Reels zone).

## Audio
- Music mood: minimal electronic pulse, quiet intro; drop lands on beat `stat` (11.2 s).
- SFX: hook: soft impact on frame 0; prompt: typing per character + click on submit; steps: pop per card (rising pitch); stat: riser into the drop; presets: tick per row; cta: chime.
- Voiceover: none (captions carry it).

## Claims that need a source
- "20 components in the catalog" -> `catalog/index.json` (`count`)
- "8 exports" -> `presets/render.json` (youtube, shorts, whatsapp, whatsapp-api, linkedin, x, web, web-loop)
- "-14 LUFS" -> `scripts/audio-master.sh`, `docs/playbook.md` Audio
- The GitHub URL is a placeholder until the repo is public; confirm before the CTA is final.

## Assets and licences
| Asset | Source URL | Licence |
| --- | --- | --- |
| Music bed | `public/audio/music/` (picked in step 5) | see `public/audio/LICENCES.md` |
| SFX | `public/audio/sfx/` (synthesised in code) | own work, CC0 |
