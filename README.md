# Reelsmith: Claude Video Studio

A toolkit for turning web content into polished videos with Claude Code: a Remotion project with motion defaults, a component catalog, prompt templates, a `video-director` skill, and lossless render presets for YouTube, Shorts, WhatsApp, LinkedIn, X and web embeds.

The design and sources are in [`docs/playbook.md`](docs/playbook.md) (corrected against [`docs/verification-2026-10.md`](docs/verification-2026-10.md)). House rules Claude reads every session are in [`CLAUDE.md`](CLAUDE.md).

## Quick start

Needs Node 20+ and FFmpeg (with libx264, libsvtav1, libvpx-vp9, libopus), plus `jq`.

```bash
npm install
npm run dev                 # Remotion Studio: live preview while Claude edits
npm run smoke               # render the Hello master, export every preset, check each file
npm run demo                # 540p draft of the Demo composition (every base component) + contact sheet
npm run validate            # check every timeline.json against the house rules
```

Install the official Remotion plugin for Claude Code once:

```bash
claude plugin marketplace add remotion-dev/claude-code-plugin
claude plugin install remotion@remotion   # then restart Claude Code
```

## Making a video

```text
/video https://example.com/post shorts whatsapp     # brief with catalog picks, then stills, draft, review
/render MyComp my-slug youtube web                   # master + exports + checks
```

Or by hand:

```bash
scripts/master.sh <CompId> <slug> --draft            # 540p review draft
scripts/contact-sheet.sh videos/<slug>/draft.mp4 videos/<slug>/timeline.json
scripts/flash-scan.sh videos/<slug>/draft.mp4 videos/<slug>/timeline.json   # pops and flashes
scripts/master.sh <CompId> <slug> [--alpha] [--scale=2]   # ProRes HQ / 4444 master, PNG frames, BT.709
scripts/audio-master.sh in.mov out.mov               # two-pass loudnorm to -14 LUFS, TP <= -1 dBTP
scripts/encode.sh <slug> youtube whatsapp web        # or: all
scripts/check.sh videos/<slug>/exports/youtube.mp4 youtube
```

## Presets (`presets/render.json`)

| Preset | Output | Target |
| --- | --- | --- |
| `youtube` | H.264 High, CRF 16, closed GOP half fps, AAC 384k | landscape; upload a `--scale=2` master for 4K |
| `shorts` | 1080x1920 H.264, CRF 18 capped 15 Mbps | portrait, <= 3 min |
| `whatsapp` | 720p H.264 Main, CRF 23 | <= 60 MB (send as Document for full quality, up to 2 GB) |
| `whatsapp-api` | 720p, two-pass if needed | <= 15 MB (Cloud API cap 16 MB) |
| `linkedin` | 1080p H.264 MP4, CRF 18 | 3 s-10 min, <= 60 fps |
| `x` | 1080p H.264 High + AAC-LC, CRF 18 | posts <= 20 min |
| `web` | AV1 WebM, VP9 WebM, H.264 MP4, poster | 1080p |
| `web-loop` | same, 720p, no audio | muted autoplay hero loops |

All deliverables are 4:2:0, BT.709 limited range, faststart. Any preset with `budgetMB` falls back to a two-pass encode if the CRF encode is too big.

## Layout

```
CLAUDE.md                        house rules
.claude/skills/                  video-director, review-loop
.claude/commands/                /video, /render, /brand
catalog/                         one .md + preview GIF per component; index.json is generated (npm run catalog)
docs/                            playbook + link verification
presets/brand.json               colours, fonts, type sizes
presets/render.json              destination presets
scripts/                         master, encode, check, contact-sheet, flash-scan, audio-master, catalog, smoke
src/lib/                         easing, springs, timeline (+ schema), captions, seeded random, brand
src/components/                  base components + catalog components (see catalog/README.md)
src/catalog/                     3 s preview composition per catalog entry
src/compositions/                Hello and Demo (smoke-test compositions; Demo renders in CI)
templates/                       prompts 01-05, per-video brief / spec / README skeletons
videos/<slug>/                   brief, spec, timeline (renders gitignored)
```

## Licence notes

Remotion is source-available: free for individuals and companies of up to 3 people; larger companies need a Company License. Check before open-sourcing with the renderer bundled.
