# Claude Video Playbook

Oct 25, 2026 · @Sanket

> **Status:** corrected against [verification-2026-10.md](verification-2026-10.md) (WhatsApp and X limits, Remotion plugin commands and skill names, HyperFrames skill count, HTML-in-canvas caveat, unsupported sources). What is built so far is tracked in the Development plan checkboxes and in the repo README.

## Purpose and how to use this playbook

One repo holds everything Claude needs to turn a piece of content (a web page, blog post, data story) into a finished video: a component catalog, prompt templates, render presets, and a skill that picks components for a given brief. Every video is rendered into the same repo and stored there, so it can later be embedded on a page or shared.

Workflow for each new video:

1. Share the content (URL or text) plus the destination (YouTube, WhatsApp, website, Shorts).
2. The skill reads the content, picks a format (explainer, launch, data story, quote reel), and proposes components from the catalog: intro, transitions, text motion, data viz, outro, music, SFX.
3. Claude writes a short storyboard and still frames for approval, then animates.
4. Render once as a high-quality master, then derive destination presets from it.

Proposed repo layout (to be built once this doc settles):

```
claude-video-studio/
  CLAUDE.md                 # house rules Claude reads every session
  .claude/skills/video-director/SKILL.md
  catalog/                  # intros, transitions, text, data-viz, outros, audio (one .md per component + demo)
  templates/prompts/        # brief, storyboard, revision prompts
  presets/render.json       # youtube, whatsapp, web, shorts
  scripts/encode.sh         # master -> destination ffmpeg presets
  src/                      # Remotion project (compositions, shared components, brand tokens)
  videos/<slug>/            # brief.md, storyboard.md, master.mov, exports/
  public/                   # audio library, fonts, logos
```

## Toolchain choice: pick one engine and pin it

Recommendation: make Remotion the default engine and write that into CLAUDE.md, so Claude stops switching between Remotion and Python run to run. Keep Python for two narrow jobs only: Manim for maths/formal diagrams, and MoviePy for burning exact text onto existing footage. HyperFrames is the strongest alternative, and worth a trial before open-sourcing.

| Engine | Authoring | Best for | License | Agent support |
| --- | --- | --- | --- | --- |
| [Remotion](https://www.remotion.dev/docs/ai/skills) (default) | React/TSX, frame = pure function | Explainers, launch videos, data stories, brand templates, batch renders | Source-available; free for individuals and companies up to 3 people, commercial use allowed ([license](https://remotion.dev/license)) | Official skills: best-practices, create, markup, render, captions, maps, docs, upgrade and more |
| [HyperFrames](https://github.com/heygen-com/hyperframes) (alternative) | Plain HTML + CSS + GSAP/Lottie/Three.js, no build step | Website-to-video, PDF/docs-to-video, kinetic captions, \~450 catalog blocks | Apache 2.0, no render fees | Claude Code plugin (`claude plugin marketplace add heygen-com/hyperframes`, then `claude plugin install hyperframes@hyperframes`); 7 skills: core /hyperframes, /hyperframes-cli, /hyperframes-registry, /media-use, plus on-demand /figma, /slideshow, /remotion-to-hyperframes. Needs Node 22+ |
| Manim (Python) | Python scenes | Equations, geometry, formal diagrams | MIT | No official skill; Claude writes it well |
| MoviePy (Python) | Python, single build.py | Exact text overlays on AI or recorded footage, short one-offs | MIT | Community skill in [claude-code-video-toolkit](https://www.skills.sh/digitalsamba/claude-code-video-toolkit/moviepy) |

Why Remotion as default for you: you already write React and NextJS, Studio gives a live preview while Claude edits, and you qualify for the free license as an individual. Why keep HyperFrames in view: it is fully open source, has a ready block catalog (transitions, titles, charts, maps), and its frame.md idea maps a web design system onto video. Both render the same way under the hood (headless Chrome + FFmpeg), so quality settings in the next sections apply to both.

The [video-use](https://github.com/browser-use/video-use) project shows a middle path: one overlay contract, with Remotion, HyperFrames, Manim or PIL chosen per animation slot. Worth copying later if the catalog grows across engines.

## General instructions that work best for Claude

The pattern every strong example shares: brief first, stills before motion, numbers instead of adjectives, and a self-review loop on rendered frames. These rules go into CLAUDE.md.

**Setup (once)**

- Install the official Remotion Claude Code plugin: `claude plugin marketplace add remotion-dev/claude-code-plugin && claude plugin install remotion@remotion`, then restart Claude Code ([plugin docs](https://www.remotion.dev/docs/ai/claude-code-plugin)). Plugin skills are namespaced, e.g. `/remotion:remotion-create`. Alternative, per project: `npx skills add remotion-dev/skills` ([skills docs](https://www.remotion.dev/docs/ai/skills)). Keep them current with `/remotion-upgrade`; use `/remotion-docs` to look up APIs instead of guessing. The hosted Remotion MCP is likely deprecated in favour of skills (secondary source).
- Layer a taste skill on top of the API skill. [claude-motion](https://github.com/whaleyxbt/claude-motion) ships motion-design, review-loop and sound-design skills that sit on the official Remotion skills.
- Run Remotion Studio (`npm run dev`) in one terminal and Claude in another, so you watch changes live.

**Process per video**

1. Architecture before creativity: first prompt sets up the project and engine, not the ad (attributed to Giuliano Franca; *unsourced* until the post URL is found).
2. Describe the outcome, not the execution: audience, message, tone, the feeling you want, the one takeaway.
3. Director's brief before code: named reference style, timed beats, layer list, sound plan ([claude-motion-design](https://github.com/howseen-ai/claude-motion-design)).
4. Beats live in one `timeline.json`; scenes, audio and review all read it, so retiming moves sound with picture.
5. Ask for stills first: brand token file plus one still per beat as static components. Reviewing 4 PNGs takes a minute; a render takes twenty.
6. Draft render at 540p, then the master.
7. Self-review loop: Claude renders a contact sheet (one timestamped frame per beat) and checks collisions, clipping, reading holds, safe area and phone readability before calling it done.
8. Give honest notes on v1 ("no hook", "opening takes 4 s, make it 1", "icons fly in from nowhere"). Ask Claude to apply the 12 principles of animation on a rebuild.

**Hard rules for Claude**

- Everything is a pure function of frame: no CSS transitions, no `Math.random()` (seeded random only), no `Date`, no timers. Otherwise renders flicker or drift.
- Never hardcode start times in components; offsets from named beats only.
- Frame 0 is never empty or black: it is the thumbnail on autoplay feeds.
- Text that must be exact (names, prices, sources) is typeset in code, never AI-generated pixels.
- Illustrative data is labelled "Example data" on screen.
- Use free/licensed assets only (Mixkit, Pexels, Unsplash, svgl, simple-icons) and log each asset's licence in the video folder.

**Effort levels** (Claude Code `/effort`; attributed to claude-motion but *not found* in its motion-design SKILL.md, so treat as house guidance): low for storyboard and hook, medium for building scenes, high for the review loop and polish, max only for unattended end-to-end runs.

**Parallel variants**: use git worktrees to have Claude build 2-3 intro variants at once, then pick one (house practice; the earlier cited source did not mention worktrees).

## Component catalog

Each row becomes one file in `catalog/` with a short demo render, so the skill can match a brief to components by name. Start with these; add a row each time a video produces something reusable.

### Intros and title cards (first 1-3 s)

| Component | Use when | Build with | Source |
| --- | --- | --- | --- |
| Hook-first cold open | Social, WhatsApp, Shorts: the claim or number in frame 0, no logo | Remotion scene, display type 130-140 px on 1080 canvas | [claude-motion](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md) |
| Masked word-by-word reveal | Headline intros; words slide up out of a clip, 0.09 s stagger, \~0.8 s per word | Remotion `Mask` + spring | claude-motion |
| Slow push-in title card | Premium/minimal: dark canvas, one warm accent, kicker line | Remotion scale 1.0 to 1.06 over 3 s, easeOut | [HyperFrames templates](https://open-design.ai/plugins/templates/hyperframes/) |
| Editorial poster frame | Data stories, essays: rule draws across, big tilted figure drops, headline rises line by line | HyperFrames block or Remotion port | HyperFrames templates (Bold Poster) |
| Cinematic chapter card | Long-form chapters: light leaks, grain, 16:9 letterbox, large serif | Grain + vignette overlay | HyperFrames templates |
| Glitch title | Tech/cyber tone only | Chromatic offset, 4-6 frames | HyperFrames templates |
| Prompt-type-submit-generate | AI/product demos: text typed into a prompt bar, submit, result appears | Typing 0.035 s/char, caret blink 2.4 Hz | [hyperframes-animation](https://kortix.com/marketplace/heygen-com--hyperframes/hyperframes-animation), claude-motion |

### Scene transitions

Rule: every transition is motivated by an object on screen; prefer a persistent element that travels between scenes over a generic wipe. Overlap scenes so the next starts before the last fully leaves.

| Transition | Feel | Remotion | Notes |
| --- | --- | --- | --- |
| fade | Calm, documentary | `fade()` | Default for essays |
| slide / wipe | Directional, step-by-step | `slide()`, `wipe()` | Match reading direction |
| pushCut | Punchy cut with brief flash | `pushCut()` | Beat drops, launches |
| iris / clockWipe | Reveal from a focal point | `iris()`, `clockWipe()` | Pair with a circle already on screen |
| zoomBlur / crossZoom | Energy, speed | HTML-in-canvas presentations | Use once or twice per video. Preview needs Chrome 149+ with `chrome://flags/#canvas-draw-element`; rendering needs no setup |
| filmBurn / dissolve | Nostalgic, editorial | HTML-in-canvas presentations | Chapter changes |
| bookFlip | Story, timeline | HTML-in-canvas | Children's story / history |
| Shared-element handoff | Most "designed" feel | Custom: one element persists and changes role | [claude-motion-design](https://github.com/howseen-ai/claude-motion-design) |

Remotion's full list is in [Presentations](https://www.remotion.dev/docs/transitions/presentations), including `blurSlide()` and `none()`; `cube()` is paid. The HTML-in-canvas set (zoomBlur, filmBurn, bookFlip and others) only previews in Chrome 149+ with the `canvas-draw-element` flag, not in Firefox or Safari ([HTML-in-canvas](https://www.remotion.dev/docs/html-in-canvas)). HyperFrames groups \~14 transition families (3D, blur, cover, dissolve, distortion, grid, light, mechanical, push, radial, scale) with shader transitions such as `flash-through-white`.

### Motion defaults (copy into CLAUDE.md)

| Thing | Default | Source |
| --- | --- | --- |
| Entrance easing | `bezier(0.16, 1, 0.3, 1)` | claude-motion |
| Exit easing | `bezier(0.6, 0, 0.9, 0.35)`, exits \~half entrance length (0.35-0.55 s) | claude-motion |
| State-to-state move | `bezier(0.65, 0, 0.35, 1)` | claude-motion |
| Spring, general UI | damping 14, stiffness 140, mass 0.8 | claude-motion |
| Spring, pop/badge | damping 9-11, stiffness 200-230, mass 0.7 | claude-motion |
| Elastic accent | damping 8, stiffness 200; once per video | claude-motion |
| Stagger | words 0.09 s, list items 0.2-0.25 s, dots 0.06 s | claude-motion |
| Reading hold | ≥1 s short phrase, +0.25 s per word beyond 3, ≥2 s final hook | claude-motion |
| Safe area | Nothing within 60 px of edge | claude-motion |
| Type | Max 3 families; one accent word per line; one accent colour that means something | claude-motion |
| Texture | Grain \~0.09 opacity, vignette, slow drifting grid; nothing dead-still | claude-motion |
| Motion blur | Subframes on a 180° shutter, never blended across a hard cut | claude-motion-design |

### Content blocks

| Component | Use when | Build with |
| --- | --- | --- |
| Rolling number / count-up | Stats, data stories | Remotion interpolate, tabular mono digits |
| Animated chart (bar, line, race) | Data journalism | Remotion + D3 scales, or HyperFrames `data-chart` |
| Map route / flyover | Geography, travel, events | `/remotion-maps` skill (MapLibre, Mapbox, CesiumJS) |
| Lower-third / callout | Names, sources, labels | Spring pop in, easeIn out |
| Kinetic captions | Any video watched muted (WhatsApp, Shorts) | `/remotion-captions`; word-level highlight |
| UI screen showcase / 3D reveal | Product/site demos | Playwright screenshots + perspective tilt |
| Quote card | Essays, Substack posts | Serif display, single accent word |

### Outros

| Component | Use when |
| --- | --- |
| Logo bloom / logo outro | Brand videos; logo resolves with glow, 1.5-2 s hold |
| CTA end card | URL or "follow" line held ≥2 s |
| Loop seam | Social loops: last frame matches first in position and velocity |

### Audio

| Element | Default | Source |
| --- | --- | --- |
| Music library | Pixabay Music and Mixkit (free, commercial, no attribution required); YouTube Audio Library for YouTube-only | [Soundstripe overview](https://www.soundstripe.com/blogs/youtube-audio-library-alternative) |
| SFX library | Mixkit, Pixabay, Freesound (check each clip's CC licence) | [Newcastle SFX guide](https://www.newcastle.edu.au/__data/assets/pdf_file/0007/875995/Suggested-sound-effects-sites.pdf) |
| Synthesised SFX | whoosh, pop, click, typing, riser, chime, impact, pad from code: no licences | claude-motion sound-design |
| Voiceover | ElevenLabs (MCP) or local Kokoro TTS | claude-motion, awesome-claude-video |
| Sync | Find the real drop by band energy; start the song so the drop lands on the hero frame; place each SFX by its measured peak | claude-motion-design |
| Loudness | Master to −14 LUFS, true peak ≤ −1 dBTP (claude-motion uses −2), two-pass loudnorm | claude-motion, claude-motion-design |

## Prompt templates

Five prompts, one per stage, run in order. Each lives in `templates/prompts/` with placeholders in angle brackets. The stage split (plan, then spec, then build) comes from the [Zero Future Tech guide](https://zerofuturetech.substack.com/p/generate-videos-with-claude-code); the director's brief fields and stills-first gate come from [claude-motion-design](https://github.com/howseen-ai/claude-motion-design) and [Giuliano Franca](https://br.linkedin.com/in/giulianofranca); the scoring pass comes from the Pip case in [awesome-claude-video](https://github.com/opusvideo/awesome-claude-video/blob/main/IMPLEMENTATION_GUIDES.md).

**1. Brief from content** (plan mode, effort low)

```markdown
Use the video-director skill. Read <URL or file> and draft videos/<slug>/brief.md.

Goal: what the viewer should understand or feel after <N> seconds.
Audience: <who>, what they already know.
Destination: <youtube | whatsapp | web | shorts> (sets aspect, length, captions).
Tone and reference style: <e.g. Apple keynote, editorial data story, playful line-art>.
Assets: <logo, screenshots, photos>; no live footage unless supplied.
Brand: use presets/brand.json tokens.

Return: one-line message, hook for the first 2 s, beat list with timestamps,
proposed components from catalog/ for each beat (by name), music mood, SFX plan.
Flag any claim that needs a source.
```

**2. Storyboard to spec**

```markdown
Turn the approved brief into videos/<slug>/spec.md and timeline.json.
Include: scene list with start frame and duration at <fps>; per-element entry/exit,
easing and spring from the motion defaults; asset checklist; all on-screen copy
as constants; transition between each scene and the object that motivates it.
Tables for the timeline. No hardcoded colours or sizes outside brand tokens.
```

**3. Stills before motion** (approval gate)

```markdown
Build each beat as a static still (no animation yet) and render one PNG per beat
into videos/<slug>/stills/. Check safe area, phone readability at 360 px wide,
and one focal point per frame. Show me the contact sheet and wait.
```

**4. Animate, draft, self-review** (effort medium, review high)

```markdown
Animate the approved stills per spec.md. Everything is a pure function of frame.
Render a 540p draft, then a contact sheet with one frame per beat.
Score each beat 1-10 on: hook, readability, timing/holds, composition, polish.
Fix anything under 8, re-render, repeat. Then lock picture and build audio:
music drop on the hero beat, SFX on measured peaks, master to -14 LUFS.
```

**5. Revision notes** (how to give feedback)

```markdown
Notes on v<n>:
- <timestamp>: <what is wrong> -> <what I want> (e.g. 0:00-0:04 opening drags; get to the claim by 1 s)
- <timestamp>: <element> enters from nowhere; motivate it from <object>
- Global: feels stop-and-go; measure dead time and remove gaps over 0.3 s.
Keep everything else unchanged.
```

## Rendering without pixel loss

Render once to a near-lossless master, then make every destination file from that master with a single FFmpeg encode. Never re-encode an already-compressed export: each lossy generation softens text and adds banding.

**Where quality is usually lost** (and the fix)

| Cause | Symptom | Fix |
| --- | --- | --- |
| Remotion captures frames as JPEG at quality 80 by default | Soft edges, blocky gradients | `--image-format=png` for the master ([Remotion quality guide](https://www.remotion.dev/docs/quality)) |
| Video rendered at 1x but viewed on HiDPI screens | Unsharp text on laptops/phones | `--scale=2` (renders 1080p comp at 4K) for YouTube and web hero videos |
| Colour space mismatch (RGB to YUV with wrong matrix) | Washed-out or shifted colours, especially brand reds/blues | `--color-space=bt709`; tag BT.709 in FFmpeg; YouTube recommends BT.709 for SDR ([YouTube encoding settings](https://support.google.com/youtube/answer/1722171)) |
| 4:2:0 chroma subsampling on thin coloured text | Fringed red/blue text | Use thicker weights or white/near-white text on colour; keep 4:4:4 only in the master |
| High CRF / low bitrate | Smearing on gradients, grain and fast motion | Master at CRF ≤ 12 or ProRes; tune per destination below |
| Repeated re-encoding (MoviePy write, then FFmpeg, then platform) | Generational blur | One master, one encode per destination |
| Hardware encoder | Cannot set CRF in Remotion; quality varies | Use software x264 for masters; HW only for drafts |

**Master render (Remotion)**

```bash
# Edit-grade master, no visible loss (scripts/master.sh <CompId> <slug>)
npx remotion render <CompId> videos/<slug>/master.mov \
  --codec=prores --prores-profile=hq \
  --image-format=png --color-space=bt709

# With transparency (scripts/master.sh <CompId> <slug> --alpha)
npx remotion render <CompId> videos/<slug>/master.mov \
  --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le \
  --image-format=png --color-space=bt709

# Lighter master if disk matters: visually lossless H.264
npx remotion render <CompId> videos/<slug>/master.mp4 \
  --codec=h264 --crf=12 --x264-preset=slow \
  --image-format=png --color-space=bt709

# Fast draft for review
npx remotion render <CompId> videos/<slug>/draft.mp4 --scale=0.5 --crf=28
```

CRF ranges differ per codec, so a number is not portable between them ([Remotion encoding guide](https://www.remotion.dev/docs/encoding)):

| Codec | Best quality | Best compression | Remotion default | Browser support |
| --- | --- | --- | --- | --- |
| H.264 | 1 | 51 | 18 | Very good |
| H.265 | 0 | 51 | 23 | Very poor |
| VP8 | 4 | 63 | 9 | Okay |
| VP9 | 0 | 63 | 28 | Okay |
| AV1 | 0 | 63 | 30 | Okay |
| ProRes | profile-based |  |  | None (master only) |

**Python path (when Manim/MoviePy is used)**

- Manim: render final with `-qk` (4K) or `-qh` (1080p60), never the `-ql` preview, then treat that file as the master.
- MoviePy: pass `codec="libx264"`, `ffmpeg_params=["-crf","12","-pix_fmt","yuv420p","-colorspace","bt709"]` and `preset="slow"`; or write PNG frames and let `scripts/encode.sh` make the master.
- Keep canvas sizes even (H.264 needs even width and height).

**Extra polish from the HTML-to-video skills**: 60 fps with subframe motion blur (4 subframes on a 180° shutter, FFmpeg `tmix`, never across a hard cut), BT.709 TV-range encode, and an automated scan for one-frame pops and flashes before export ([claude-motion-design](https://github.com/howseen-ai/claude-motion-design)).

## Output presets by destination

Four presets cover your cases, all derived from the master by `scripts/encode.sh <slug> <preset>`. Quality goes down and compression goes up from left to right: YouTube, Shorts/Reels, WhatsApp, web embed.

| Preset | Size / aspect | fps | Codec | Quality target | Audio | Typical size, 60 s | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `youtube` | 1920×1080 16:9 (or 3840×2160 from `--scale=2`) | 30 or 60, same as master | H.264 High, 4:2:0, BT.709, closed GOP of half the fps, 2 B-frames | CRF 16 (above YouTube's 8 Mbps / 12 Mbps floor for 1080p30 / 60) | AAC-LC 48 kHz stereo, 384 kbps | 60-120 MB | [YouTube](https://support.google.com/youtube/answer/1722171) |
| `shorts` (Shorts, Reels, TikTok) | 1080×1920 9:16, ≤ 3 min | 30 | H.264 + AAC | CRF 18, capped at 15 Mbps | AAC, −14 LUFS | 60-110 MB | [YouTube Help 15424877](https://support.google.com/youtube/answer/15424877), [Sprout Social safe zones](https://sproutsocial.com/insights/social-media-video-specs-guide/) |
| `whatsapp` | 1280×720 (or 720×1280 vertical) | 30 | H.264 Main, CRF 23; two-pass only if over budget | ≤ 60 MB (chat accepts 64 MB at 480p on slow links, 100 MB at 720p on fast) | AAC 128 kbps | 5-20 MB | [WhatsApp FAQ](https://faq.whatsapp.com/453914586839706) |
| `whatsapp-api` | 720p | 30 | H.264 + AAC, two-pass to budget | ≤ 15 MB (Cloud API cap is 16 MB) | AAC 96 kbps | ≤ 15 MB | [WhatsApp Cloud API media](https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/media) |
| `linkedin` | up to 4096×2304; 1080p here | ≤ 60 | H.264 MP4 (no MOV) | CRF 18; 75 KB-5 GB; 3 s-10 min | AAC 192 kbps | 10-40 MB | [LinkedIn Help a527229](https://www.linkedin.com/help/lms/answer/a527229) |
| `x` | 1080p | ≤ 60 | H.264 High + AAC-LC | CRF 18; posts 20 min / 8 GB (DMs 140 s / 512 MB) | AAC 192 kbps | 10-40 MB | [X media best practices](https://docs.x.com/x-api/media/quickstart/best-practices) |
| `web` | 1280×720 or 1920×1080; hero loops 720p | 24-30 | AV1 WebM, VP9 WebM, H.264 MP4 fallback | AV1 CRF \~35, VP9 CRF \~33, H.264 CRF \~26 | Opus/AAC, or none for muted loops | 3-12 MB | [BlazingCDN](https://blog.blazingcdn.com/en-us/mp4-vs-webm-best-video-format-for-web-playback), [web.dev](https://web.dev/learn/performance/video-performance?hl=en) |

**Destination notes**

- **YouTube**: MP4 with the moov atom at the front (faststart), progressive, 48 kHz audio. YouTube recommends 35-45 Mbps for 4K at standard frame rates against 8 Mbps for 1080p, so a 4K upload of a 1080p comp (via `--scale=2`) keeps text crisper after YouTube's own re-encode.
- **WhatsApp**: chat videos can be 100 MB at 720p on fast connections and 64 MB at 480p on slow ones ([WhatsApp FAQ](https://faq.whatsapp.com/453914586839706)); HD has no published cap. Pre-encode to 720p CRF 23 under 60 MB so your encode, not theirs, sets the quality, or send the file as a Document (up to 2 GB, no recompression) for full quality. Status videos: 90 s, MP4 or 3GP, no HD ([WhatsApp FAQ](https://faq.whatsapp.com/454876960047011)). The 16 MB limit applies only to the Cloud API (`whatsapp-api` preset). Put the key content in the first seconds.
- **X**: posts allow 20 min / 8 GB without Premium (125 min / 16 GB with); the 140 s / 512 MB cap applies to DMs only ([X docs](https://docs.x.com/x-api/media/introduction)).
- **LinkedIn**: MP4 only, 3 s to 10 min (15 min on desktop), 10-60 fps.
- **Shorts/Reels**: one 1080×1920 master covers YouTube Shorts, Reels and TikTok; keep text inside the centre safe zone, master audio to about −14 LUFS so Instagram's normalisation does not pull it down.
- **Web embed**: list sources AV1, then VP9, then H.264 MP4; add `+faststart`; serve a poster image; for hero loops use `muted autoplay loop playsinline`, strip audio (`-an`), and fall back to the poster when `prefers-reduced-motion` is set. VP9 is typically 30-50% smaller than H.264 at equal quality, AV1 another 20-30% smaller.

**encode.sh core commands** (starting points; tune CRF on your own footage)

```bash
# youtube (30 fps master; use -g 30 for 60 fps)
ffmpeg -i master.mov -c:v libx264 -preset slow -crf 16 -profile:v high \
  -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -g 15 -bf 2 -c:a aac -b:a 384k -ar 48000 -movflags +faststart youtube.mp4

# whatsapp: 720p CRF 23; encode.sh falls back to two-pass if the result exceeds budgetMB
ffmpeg -i master.mov -vf scale=-2:720 -c:v libx264 -preset slow -crf 23 -profile:v main \
  -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 128k -movflags +faststart whatsapp.mp4

# two-pass to a size budget: video kbps = budget_MB * 8192 * 0.95 / duration_s - audio_kbps

# web: AV1 + VP9 + H.264 fallback (add -an for muted loops)
ffmpeg -i master.mov -vf scale=-2:1080 -c:v libsvtav1 -crf 35 -preset 6 -c:a libopus -b:a 96k web.av1.webm
ffmpeg -i master.mov -vf scale=-2:1080 -c:v libvpx-vp9 -crf 33 -b:v 0 -row-mt 1 -c:a libopus -b:a 96k web.vp9.webm
ffmpeg -i master.mov -vf scale=-2:1080 -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart web.mp4
ffmpeg -i master.mov -frames:v 1 -q:v 3 poster.jpg
```

The two-pass budget formula and CRF starting values above are my own defaults built from these sources, not platform figures; check the first few exports' sizes and quality and adjust `presets/render.json`.

## Draft skill file

This is the first version of `.claude/skills/video-director/SKILL.md`. It routes a brief to catalog components and render presets, and stays under \~200 lines by pointing to `catalog/` and `presets/` instead of inlining them (a pattern from [cc-design](https://github.com/ZeroZ-lab/cc-design)).

```markdown
---
name: video-director
description: Turn a URL, post or brief into a finished video in this repo. Use whenever the user asks for a video, reel, explainer, intro or animation from content, or wants components suggested for one.
---

# Video director

## 0. Read first
- CLAUDE.md (house rules, motion defaults), presets/brand.json, presets/render.json.
- Engine: Remotion (default). Manim only for maths; MoviePy only for exact text on existing footage.

## 1. Classify the request
Format: explainer | launch/promo | data story | quote/essay reel | event recap | children's story.
Destination: youtube | shorts | whatsapp | web (ask if missing; it sets aspect, length, captions).
Length defaults: shorts/whatsapp 15-45 s, youtube 60-180 s, web hero 8-15 s loop.

## 2. Propose components (do not build yet)
For each beat pick by name from catalog/: intro, transitions, content blocks, outro, music mood, SFX.
Rules: one hero moment; one accent colour; captions on for shorts/whatsapp;
hook-first cold open for shorts/whatsapp; chapter cards only for youtube > 90 s.
Output videos/<slug>/brief.md and wait for approval.

## 3. Spec and stills
Write spec.md + timeline.json (templates/prompts/02). Render one still per beat; wait for approval.

## 4. Animate and self-review
Pure function of frame. 540p draft -> contact sheet -> score each beat 1-10
(hook, readability, holds, composition, polish) -> fix anything < 8 -> repeat.

## 5. Audio
Pick track from public/audio (licence logged in videos/<slug>/assets.md).
Drop on hero beat, SFX on peaks, master -14 LUFS, true peak <= -1 dBTP.

## 6. Render and export
Master: scripts/master.sh (ProRes HQ, PNG frames, BT.709; --alpha for ProRes 4444).
Then scripts/encode.sh <slug> <preset> for each requested destination.
Write videos/<slug>/README.md: brief, components used, presets, file sizes, sources.

## 7. Learn
If a new reusable piece was built, add it to catalog/ with a 3 s demo render.
```

## Development plan

Build the repo in seven phases over about four weeks of evenings. Each phase ends with something that renders, so you can stop at any point and still have a working studio. Phases 0-2 are the critical path; the catalog, skills and audio phases can overlap once the render pipeline works.

| Phase | Goal | Effort | Done when |
| --- | --- | --- | --- |
| 0. Foundations | Repo, Remotion project, house rules | 1-2 days | Studio opens and a hello composition renders |
| 1. Render pipeline | Master + destination presets | 2-3 days | One test video exports to every preset within its size budget |
| 2. Motion library | Shared easing, springs, timeline, base components | 3-4 days | A demo composition uses every base component |
| 3. Component catalog | 15 documented, previewable components | 4-5 days | `catalog/index.json` lists all with preview GIFs |
| 4. Skills and prompts | Director skill, review loop, commands, templates | 2-3 days | `/video <url>` produces a brief with catalog picks |
| 5. Audio | Licensed library, loudness, SFX placement | 2 days | Final mix measures −14 LUFS, true peak ≤ −1 dBTP |
| 6. Pilot videos | 3 real videos end to end | 1 week | Three published videos, lessons folded back into rules |
| 7. Storage and later | Manifest, cloud storage, second engine, open-source prep | Ongoing | Masters live outside git; manifest is the index |

### Phase 0: Foundations

- [x] `README.md`: what the repo is, quick start, folder map
- [x] `.gitignore`: `node_modules/`, `out/`, `videos/*/master.*`, `videos/*/frames/`, `.env`
- [x] `.gitattributes`: Git LFS only for small preview GIFs and golden test clips
- [x] `package.json` + `src/Root.tsx` from `npx create-video --yes --blank`; pin all `@remotion/*` packages to one exact version
- [x] Install the official plugin: `claude plugin marketplace add remotion-dev/claude-code-plugin`, then `claude plugin install remotion@remotion`
- [x] `CLAUDE.md`: engine choice, pure-function-of-frame rule, frame 0 never empty, exact text in code, "Example data" label, motion defaults table, phone-readability check
- [x] `.claude/settings.json`: deny `Read(./.env)` so API keys never enter context
- [x] `presets/brand.json`: colours, fonts, logo paths (seed from your brand kit)

### Phase 1: Render pipeline

- [x] `presets/render.json`: one entry per destination (youtube, shorts, whatsapp, web, linkedin, x) with size, fps, codec, CRF or bitrate, audio, size budget
- [x] `scripts/master.sh <comp> <slug>`: PNG frames, BT.709, ProRes HQ (4444 when alpha is needed), optional `--scale=2`
- [x] `scripts/encode.sh <slug> <preset>`: reads `render.json`, one FFmpeg encode from the master, writes `videos/<slug>/exports/`
- [x] `scripts/check.sh <file>`: ffprobe for resolution, fps, colour tags, file size vs budget; ebur128 for loudness
- [x] `scripts/contact-sheet.sh <file> <timeline>`: one labelled frame per beat, for Claude's self-review
- [x] Update WhatsApp preset to current limits: chat video 100 MB at 720p, so target \~720p CRF 23 under 60 MB; offer the document route for full quality

### Phase 2: Motion library

- [x] `src/lib/easing.ts`: entrance, exit, move, overshoot curves
- [x] `src/lib/springs.ts`: default, heavy, notch, pop, elastic presets + timing constants + `springAt()`
- [x] `src/lib/timeline.ts` + `src/lib/timeline.schema.json`: load beats by name, validate, no hardcoded times (`npm run validate`)
- [x] `src/lib/rand.ts`: seeded random only
- [x] `src/components/`: `Background` (grid + vignette), `Grain`, `MaskReveal`, `RollingNumber`, `LowerThird`, `Captions`, `SafeArea` (debug overlay)
- [x] `src/compositions/Demo.tsx`: exercises every component; rendered in CI as a smoke test (`.github/workflows/smoke.yml`)

### Phase 3: Component catalog

- [x] `catalog/<category>/<id>.md` with frontmatter: id, category, engine, duration, params, best-for, source URL, licence
- [x] One Remotion composition per entry under `src/catalog/`, rendered to `catalog/<category>/<id>.gif` (3 s, 480 px) by `scripts/catalog-previews.sh`
- [x] `scripts/build-catalog.ts` → `catalog/index.json` (what the director skill reads; `npm run catalog`, `--check` in CI)
- [x] First 15 (plus lower-third, scene-transitions, grid-background, film-grain, safe-area = 20 entries): hook cold open, masked headline, push-in title, editorial poster, chapter card, prompt-type demo, count-up stat, bar race, map route, quote card, UI showcase, kinetic captions, logo outro, CTA end card, loop seam

### Phase 4: Skills, commands and prompts

- [x] `.claude/skills/video-director/SKILL.md` (draft above), under 200 lines, pointing to `catalog/` and `presets/`
- [ ] `.claude/skills/review-loop/SKILL.md`: contact sheet, score each beat 1-10, fix under 8, pop/flash scan
- [ ] `.claude/skills/sound-design/SKILL.md`: music drop on hero beat, SFX on peaks, loudness targets
- [ ] `.claude/commands/video.md` (`/video <url> <destination>`), `render.md` (`/render <slug> <presets>`), `brand.md` (_video and render done; brand to do_)
- [x] `templates/prompts/01-brief.md` to `05-revision.md` (from the Prompt templates section)
- [ ] `templates/video/brief.md`, `spec.md`, `README.md` skeletons for each new video folder (_brief.md done_)

### Phase 5: Audio

- [ ] `public/audio/music/` and `public/audio/sfx/` with `LICENCES.md` (source URL, licence, attribution text per file)
- [x] `scripts/audio-master.sh`: two-pass loudnorm to −14 LUFS, true peak ≤ −1 dBTP
- [ ] `scripts/find-drop.py`: locate the music drop by band energy and align it to the hero beat
- [ ] Optional voiceover: Kokoro (free, local) or ElevenLabs MCP (paid); keys only in `.env`

### Phase 6: Pilot videos

- [ ] Pilot 1: blog or Substack post → 45 s Shorts + WhatsApp versions
- [ ] Pilot 2: data story → 90 s YouTube video with charts and captions
- [ ] Pilot 3: event or project promo → 15 s web hero loop (muted, AV1 + VP9 + H.264)
- [ ] After each: add new reusable pieces to the catalog, add any repeated correction to `CLAUDE.md`

### Phase 7: Storage and later

- [ ] `videos/manifest.json`: slug, title, destinations, file URLs, poster, size, hash, date
- [ ] `scripts/upload.sh`: push masters and exports to R2 or S3; keep only manifests and briefs in git
- [ ] Trial HyperFrames on one website-to-video job; add it as a second engine if it beats Remotion there
- [ ] Optional gallery page that reads the manifest and offers embed snippets
- [ ] Before open-sourcing: pick a licence, strip third-party audio and brand assets, check every catalog entry's licence

## Open questions for Sanket

- [ ] Engine: lock Remotion as default, or trial HyperFrames on one video first (Apache 2.0 matters if you open-source with the renderer bundled)?
- [ ] Brand: one personal brand (reuse your brand-kit tokens) or a brand profile per project/client?
- [ ] Voiceover: do videos need narration (ElevenLabs paid vs local Kokoro TTS), or music + captions only?
- [ ] Languages: English only, or Marathi/Hindi captions too (affects font choice and caption component)?
- [ ] Storage: keep masters in git (Git LFS) or only exports, with masters in S3/R2? ProRes masters run to GBs per video.
- [ ] Gallery: should the repo also build a small site listing every video with embed snippets, or stay files-only for now?
- [ ] Which of your earlier Claude videos worked best? Their prompts are the best seed for the catalog.

## References

Every source used in this playbook and what was taken from it. Pages marked "opened" were read in full; the rest were used from search results only and should be re-checked before relying on them.

| Source | Read | What was imported |
| --- | --- | --- |
| [Remotion Agent Skills](https://www.remotion.dev/docs/ai/skills) | Opened | Install commands; skill list (best-practices, create, markup, studio, render, maps, captions, docs, upgrade, multimedia) |
| [Remotion Quality Guide](https://www.remotion.dev/docs/quality) | Opened | JPEG q80 default, PNG frames, `--scale` for HiDPI, BT.709, CRF vs bitrate, x264 preset, no CRF with HW accel |
| [Remotion Encoding Guide](https://www.remotion.dev/docs/encoding) | Opened | Codec table, CRF ranges and defaults per codec, ProRes profiles |
| [Remotion Presentations](https://www.remotion.dev/docs/transitions/presentations) | Search | Transition list (fade, pushCut, slide, wipe, flip, clockWipe, iris, HTML-in-canvas set, paid cube) |
| [Remotion License](https://remotion.dev/license) and [pricing](https://www.remotion.dev/docs/license/pricing) | Search | Free for individuals and companies up to 3 people; company license above |
| [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | Opened | HTML-native engine, Apache 2.0, Claude Code plugin, 7 skills (4 core + 3 on demand), \~450 catalog blocks, frame.md, Remotion comparison |
| [HyperFrames templates (Open Design)](https://open-design.ai/plugins/templates/hyperframes/) | Search | Intro/title patterns: push-in reveal, sizzle reel, SaaS promo, bold poster, glitch, cinematic chapter card |
| [hyperframes-animation skill](https://kortix.com/marketplace/heygen-com--hyperframes/hyperframes-animation) | Search | Transition families; kinetic-type and prompt-submit-generate blueprints |
| [whaleyxbt/claude-motion](https://github.com/whaleyxbt/claude-motion) | Opened | Self-review contact-sheet loop, timeline.json, synthesised SFX engine, −14 LUFS, effort levels |
| [claude-motion motion-design SKILL.md](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md) | Opened | All motion defaults: easing curves, spring presets, stagger, holds, typography, colour, texture, transitions, anti-patterns |
| [howseen-ai/claude-motion-design](https://github.com/howseen-ai/claude-motion-design) | Opened | Director's brief, 4 stills before render, 540p draft, subframe motion blur, pop scan, beat/drop audio sync, free asset sources, honesty rules |
| [opusvideo/awesome-claude-video](https://github.com/opusvideo/awesome-claude-video) and [implementation guides](https://github.com/opusvideo/awesome-claude-video/blob/main/IMPLEMENTATION_GUIDES.md) | Opened | Case patterns; per-beat scoring ≥8/10; Remotion 1080p30 CRF \~14 example; keep secrets out via `.claude/settings.json` deny |
| [digitalsamba/claude-code-video-toolkit](https://www.skills.sh/digitalsamba/claude-code-video-toolkit/moviepy) | Opened | MoviePy vs Remotion split; exact-text overlay principle; brand profiles; /video command idea |
| [browser-use/video-use (Instagit summary)](https://instagit.com/browser-use/video-use/animation-engine-comparison-hyperframes-remotion-manim-pil/) | Search | Engine-per-slot idea across Remotion, HyperFrames, Manim, PIL |
| [Zero Future Tech: Generate Videos with Claude Code](https://zerofuturetech.substack.com/p/generate-videos-with-claude-code) | Opened | Plan-mode brief fields, storyboard to video\_prompt.md tech spec, build prompt |
| [Giuliano Franca (LinkedIn)](https://br.linkedin.com/in/giulianofranca) | Unsourced (profile only, post not found) | Architecture first; outcome not execution; stills before motion; honest v1 notes; 12 principles rebuild; measure dead time |
| [ZeroZ-lab/cc-design](https://github.com/ZeroZ-lab/cc-design) | Search | Keep SKILL.md under 200 lines, push detail to references/; SFX + BGM dual track |
| [OpenReplay: Making videos with Claude Code and Remotion](https://blog.openreplay.com/making-videos-claude-code-remotion/) | Search | Frame-as-pure-function framing; verify install command against official docs |
| [Tella: Remotion skills with Claude Code](https://www.tella.com/blog/how-to-use-remotion-agent-skills-with-claude-code) | Search | Studio in one terminal, Claude in another; `npx skills list --agent claude-code` check |
| [Hora de Codar](https://horadecodar.com.br/?p=44180) | Search | Remotion Claude Code plugin; Remotion MCP deprecated in favour of skills |
| [Videohighlight: Hyperframes in Claude Code](https://videohighlight.com/v/Xwa5x0jJI0Y) | Search | ~~Parallel variants with git worktrees~~: not in the source; removed as citation |
| [YouTube recommended upload settings](https://support.google.com/youtube/answer/1722171) | Opened | Container, AAC 48 kHz, H.264 High, closed GOP half fps, 2 B-frames, bitrate table, BT.709 |
| [Hopper HQ: Shorts dimensions](https://www.hopperhq.com/blog/youtube-shorts-dimensions/?amp=1) | Search | 1080×1920, 9:16, \~8 Mbps for 1080p |
| [Argil: Instagram Reel size](https://argil.ai/blog/instagram-reel-size-e350f) | Search | 8-15 Mbps H.264 30 fps export; −14 LUFS; centre safe zone |
| [NowTo Tools: WhatsApp large videos](https://tools.now.to/en/blog/how-to-send-large-videos-whatsapp) | Search | **Outdated**: 16 MB cap is wrong for chats; replaced by WhatsApp FAQ |
| [Fast.io: WhatsApp file size limit](https://fast.io/resources/whatsapp-file-size-limit/) | Search | Document route up to 2 GB; Status 16 MB / 30 s / 720p |
| [BlazingCDN: MP4 vs WebM](https://blog.blazingcdn.com/en-us/mp4-vs-webm-best-video-format-for-web-playback) | Search | Source order AV1, VP9, H.264; VP9 30-50% and AV1 further 20-30% smaller; faststart |
| [web.dev: Video performance](https://web.dev/learn/performance/video-performance?hl=en) | Search | WebM + MP4 fallback; lazy-load embeds; autoplay for background loops |
| [Soundstripe: YouTube Audio Library alternatives](https://www.soundstripe.com/blogs/youtube-audio-library-alternative) | Search | Mixkit and Pixabay free, no attribution; YouTube Audio Library is YouTube-only |
| [University of Newcastle: SFX sites](https://www.newcastle.edu.au/__data/assets/pdf_file/0007/875995/Suggested-sound-effects-sites.pdf) | Search | SFX sources and attribution requirements per site |
