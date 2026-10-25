# <Title>: spec

- **Slug:** <slug>
- **Composition:** <CompId> (registered in `src/Root.tsx`, size and length from `timeline.json`)
- **Canvas:** <1920x1080 | 1080x1920> @ <30> fps, <N> s = <frames> frames
- **Brief:** [brief.md](brief.md) (approved <date>)

## Timeline
Beats live in `timeline.json` only; this table mirrors it for review.

| # | Beat id | Start (s) | Frame | Duration (s) | Hold check (`readingHold`) | Hero |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | hook | 0.0 | 0 | 2.0 | | |

## Scenes
| Beat id | Elements (catalog id) | Entry (easing / spring, length) | Exit | Transition out + motivating object |
| --- | --- | --- | --- | --- |
| hook | | `EASE.enter`, 0.8 s | `EASE.exit`, 0.4 s | |

## On-screen copy
All copy is a constant in the composition (`COPY`). Exact text (names, prices, URLs, quotes) checked against the source.

| Key | Text | Source |
| --- | --- | --- |

## Audio plan
| Beat id | Sound | Offset from beat (s) | Gain |
| --- | --- | --- | --- |
| <hero beat> | music drop | 0 | |

## Asset checklist
| Asset | Path | Source URL | Licence |
| --- | --- | --- | --- |

## Presets
<youtube | shorts | whatsapp | ...> and the master flags (`--scale=2`, `--alpha`).
