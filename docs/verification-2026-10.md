# Claude Video Playbook: Link Verification, Similar Projects to Learn From, and Rendering Presets (as of October 2026)

Most links in the playbook still load, and the core Remotion claims are correct. Four claims need fixing now:

- **WhatsApp limits are outdated.** [mynameiskalam](https://mynameiskalam.com/sizes/whatsapp/) WhatsApp's own help center says chat videos can be 100 MB at 720p on fast connections and 64 MB at 480p on slow ones, documents can be 2 GB, and Status videos can be 90 seconds. [whatsapp](https://faq.whatsapp.com/453914586839706/?locale=tl_PH&cms_platform=iphone) The 16 MB figure now applies only to WhatsApp's Cloud API (automated business messages). [facebook](https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/media)
- **The Remotion Claude Code plugin is real, but the playbook lists the wrong install commands.** [remotion](https://www.remotion.dev/docs/ai/claude-code-plugin)
- **HyperFrames ships 7 skills**, not just the 4 core ones the playbook names. [github](https://github.com/heygen-com/hyperframes)
- **Some Remotion transitions need a special Chrome flag** to preview (the "HTML-in-canvas" ones). [remotion](https://www.remotion.dev/docs/html-in-canvas)

**Recommendation:** keep Remotion as the default engine, with Claude Code plus Remotion's official plugin. Add HyperFrames (Apache 2.0) as a second engine for HTML-native and website-to-video work. Use a Playwright + FFmpeg route, as in claude-motion-design, when you want no licence questions at all. Masters should be PNG frames encoded to ProRes or H.264 at a low CRF, tagged BT.709. Make every destination file from that master with FFmpeg.

## TL;DR
- **Links:** Every listed link loads except two problems. The GitHub repos and Remotion docs check out. The LinkedIn profile link has no specific post behind it, the open-design and kortix pages are third-party mirrors (use the HyperFrames repo instead), and most blog sources should give way to official pages. The biggest factual fixes are WhatsApp limits (the 16 MB / 30 s figures are out of date), X limits (the 140 s / 512 MB cap now applies only to DMs), [x](https://docs.x.com/x-api/media/introduction) and the Remotion plugin install commands.
- **What to borrow from other projects:**
  - From claude-motion: the numeric "taste" rules and keeping all timing in one `timeline.json` file. [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)
  - From claude-motion-design: the director's brief, a 4-still approval step, motion blur by blending subframes, and −14 LUFS loudness. [github](https://github.com/howseen-ai/claude-motion-design)
  - From video-use: its hard rules for FFmpeg editing and per-animation engine choice. [github](https://github.com/browser-use/video-use/blob/main/SKILL.md)
  - From HyperFrames: its catalog of about 450 blocks and `frame.md` design tokens. [github](https://github.com/heygen-com/hyperframes)
  - From claude-code-video-toolkit: the repo layout, the `/video` and `/brand` commands, and an open-source audio stack.
- **Rendering:** Render masters from PNG frames with `--color-space=bt709`. Use `--scale=2` when the video will be embedded on HiDPI web pages. Use ProRes 4444 when you need transparency, otherwise ProRes HQ or H.264 at CRF 12–16. Make YouTube, social, WhatsApp and web versions from that one master. Keep masters out of git and store them in S3 or R2.

## Key Findings

### 1. Link verification

| URL | Status | Correction / note |
|---|---|---|
| remotion.dev/docs/ai/skills | OK, but one command is unconfirmed | The page lists `npx skills add remotion-dev/skills` and `gh skill install remotion-dev/skills`, and offers skills during `bun create video`. [remotion](https://www.remotion.dev/docs/ai/skills) **`npx remotion skills add` is not on this page**; secondary sources say it installs into `.agents/skills`. The page names the skills with prefixes: `/remotion-best-practices`, `/remotion-create`, `/remotion-markup`, `/remotion-studio`, `/remotion-render`, `/remotion-maps`, `/remotion-captions`, `/remotion-saas`, `/remotion-interactivity`, `/remotion-docs`, `/remotion-upgrade`, `/remotion-multimedia`. [remotion](https://www.remotion.dev/docs/ai/skills) Use these full names. |
| remotion.dev/docs/quality | OK | JPEG quality defaults to 80; `--image-format=png` is available; Output Scaling (`--scale`) is recommended for HiDPI. Use `bt709` for accurate colour ("will become the default in Remotion 5.0"). You can't set CRF with hardware acceleration, and `--video-bitrate` can't be combined with `--crf`. There is an `--x264-preset` flag. **New:** with shared-memory capture, frames skip JPEG compression entirely. [remotion](https://www.remotion.dev/docs/quality) |
| remotion.dev/docs/encoding | OK | All CRF ranges and defaults match the playbook. AV1 isn't available on Lambda or Linux ARM64 GNU. ProRes has no CRF and uses a profile instead. Since v4, ProRes defaults to pcm-16 audio. [remotion](https://www.remotion.dev/docs/encoding) |
| remotion.dev/docs/transitions/presentations | OK, add a caveat | The full list is confirmed, plus `blurSlide()`, `none()` and the paid `cube()`. [remotion](https://www.remotion.dev/docs/transitions/presentations/zoom-blur) The HTML-in-canvas transitions (zoomBlur etc.) need Chrome 149+ with `chrome://flags/#canvas-draw-element` turned on to **preview**. They don't work in Firefox or Safari, and rendering needs no extra setup. [remotion](https://www.remotion.dev/docs/transitions/presentations/book-flip) [remotion](https://www.remotion.dev/docs/html-in-canvas) Several are ports of MIT-licensed shaders from gl-transitions.com. [alphasignal](https://alphasignal.ai/news/remotion-now-lets-developers-write-gpu-shaders-as-react-video-transitions) |
| remotion.dev/license → GitHub LICENSE.md | Redirects; claim OK | Free for individuals, for-profit companies with up to 3 employees, non-profits, and evaluation. A Company License is needed above that. The license will change "slightly" in Remotion 5.0. [remotion](https://remotion.dev/license) |
| remotion.dev/docs/license/pricing | OK | The prices are rendered by a script, so I couldn't read them. The page says Remotion is "free… for any individual or small company". [remotion](https://www.remotion.dev/docs/license/pricing) |
| github.com/heygen-com/hyperframes | OK; skill count outdated | Apache 2.0, about 71k stars. It ships **7 skills**: 4 core (`/hyperframes`, `/hyperframes-cli`, `/hyperframes-registry`, `/media-use`) plus 3 installed on demand (`/figma`, `/slideshow`, `/remotion-to-hyperframes`). Plugin install: `claude plugin marketplace add heygen-com/hyperframes` then `claude plugin install hyperframes@hyperframes`. "About 450 ready-made blocks", frame.md and a Remotion comparison are all confirmed. It needs Node 22+. [github](https://github.com/heygen-com/hyperframes) |
| open-design.ai/plugins/templates/hyperframes/ | OK, third-party | A template gallery from nexu-io/OpenDesign. Some templates come from HyperFrames and some don't. Treat it as inspiration only. [open-design](https://open-design.ai/plugins/templates/hyperframes/) |
| kortix.com/marketplace/…/hyperframes-animation | OK, third-party mirror | Lists 24 named text effects, about 20 scene blueprints, and animation rules. Cite the HyperFrames repo as the primary source. [kortix](https://kortix.com/marketplace/heygen-com--hyperframes/hyperframes-animation) |
| whaleyxbt/claude-motion SKILL.md | OK | All numbers confirmed (see the catalog section). The safe area is "~60 px" and listed as an anti-pattern. [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md) **I did not see −14 LUFS or the effort-levels table in this file.** They may be in the sound-design skill or the README; flag them as unverified. |
| howseen-ai/claude-motion-design | OK | MIT licence. Director's brief, 4 stills, 540p draft, subframe blur with tmix on a 180° shutter, BT.709 TV range, pop scan, beat/drop sync and two-pass −14 LUFS loudnorm are all confirmed. [github](https://github.com/howseen-ai/claude-motion-design) |
| opusvideo/awesome-claude-video (+ IMPLEMENTATION_GUIDES.md) | OK | A curated list of videos made with Claude Opus 5.5, with prompts. [github](https://github.com/opusvideo/awesome-claude-video) The guides page loaded but its body was cut off, so I couldn't check its contents. |
| skills.sh/…/moviepy and digitalsamba/claude-code-video-toolkit | OK | MIT licence, about 2.3k stars. [github](https://github.com/digitalsamba) Includes the moviepy-vs-Remotion decision table. [skills](https://www.skills.sh/digitalsamba/claude-code-video-toolkit/moviepy) |
| instagit.com (video-use engine comparison) and browser-use/video-use | OK; instagit is secondary | The instagit page is an AI-written summary. Quote video-use's SKILL.md directly: "Pick the engine per animation slot. Do not default to Remotion." [instagit](https://instagit.com/browser-use/video-use/animation-engine-comparison-hyperframes-remotion-manim-pil/) |
| zerofuturetech.substack.com | OK | Gives the plan → `video_prompt.md` → implement workflow. Its links point to the older `docs/ai/claude-code` page. [Substack](https://zerofuturetech.substack.com/p/generate-videos-with-claude-code) |
| br.linkedin.com/in/giulianofranca | Claim not supported | This is a profile page, and I couldn't find the specific post. Mark the attributed principles as "unsourced" until you have the post URL. |
| github.com/ZeroZ-lab/cc-design/wiki | Moved | It now loads the repo homepage (a design and prototype skill for HTML). Cite the repo instead. |
| blog.openreplay.com | OK, partly outdated | It still tells readers to verify install commands. [openreplay](https://blog.openreplay.com/making-videos-claude-code-remotion/) Point readers to the plugin docs instead. |
| tella.com blog | OK (updated Oct 12, 2026) | A good secondary source for the plugin commands and the namespaced form `/remotion:remotion-create`. [tella](https://www.tella.com/blog/how-to-use-remotion-agent-skills-with-claude-code) |
| horadecodar.com.br/?p=44180 | Moved; claim OK | Redirects to /remotion-claude/. The plugin is confirmed by official docs (remotion.dev/docs/ai/claude-code-plugin). [remotion](https://www.remotion.dev/docs/ai/claude-code-plugin) The MCP deprecation (hosted server shut down "not before 31 Aug 2026") comes from a sister article; treat it as likely deprecated. [horadecodar](https://horadecodar.com.br/exemplos-remotion/) |
| videohighlight.com/v/Xwa5x0jJI0Y | Claim not supported | An AI summary of a HyperFrames video. **Git worktrees are not mentioned.** Remove it as the source for that claim. [videohighlight](https://videohighlight.com/v/Xwa5x0jJI0Y) |
| support.google.com/youtube/answer/1722171 | OK | MP4 with the moov atom at the front (fast start); AAC-LC 48 kHz; H.264 High profile, closed GOP of half the frame rate, 4:2:0. 1080p: 8 / 12 Mbps; 4K: 35–45 / 53–68 Mbps. BT.709 is recommended, and YouTube **converts full range to limited range**. [google](https://support.google.com/youtube/answer/1722171?hl=en) |
| hopperhq Shorts (?amp=1) | OK; replace | Use YouTube Help answer/15424877 instead: square or vertical videos up to 3 minutes, uploaded on or after 15 Oct 2024, count as Shorts. [google](https://support.google.com/youtube/answer/15424877?hl=en) |
| argil.ai reel size | OK; secondary | Says "up to 3 minutes", which conflicts with other sources [argil](https://argil.ai/blog/instagram-reel-size-e350f) (up to 20 minutes, but reach to new audiences is limited after 3). [postfa](https://postfa.st/sizes/instagram/reels) Replace with Meta's own spec pages; I couldn't fetch them. |
| tools.now.to WhatsApp | **Outdated** | Its 16 MB claim is wrong. [now +2](https://tools.now.to/en/blog/how-to-send-large-videos-whatsapp) See the WhatsApp row in the presets table. |
| fast.io WhatsApp | **Partly outdated** | 2 GB for documents is correct. "Status 16 MB / 30 s" is outdated; [fast](https://fast.io/resources/whatsapp-file-size-limit/) official Status length is 90 s. [mynameiskalam +3](https://mynameiskalam.com/sizes/whatsapp/) |
| blog.blazingcdn.com MP4 vs WebM | OK; secondary | Replace with web.dev. [blazingcdn](https://blog.blazingcdn.com/en-us/mp4-vs-webm-best-video-format-for-web-playback) |
| web.dev video-performance | OK | Covers WebM-before-MP4 source order, `poster`, `-an` for muted loops, CRF, and LCP. [web](https://web.dev/learn/performance/video-performance?authuser=2) |
| soundstripe.com alternatives | OK; vendor bias | Useful fact: the YouTube Audio Library licence covers YouTube only. [soundstripe](https://www.soundstripe.com/blogs/youtube-audio-library-alternative) |
| newcastle.edu.au SFX PDF | OK (last updated Aug 2022) | Lists Free SFX, Videvo, Pixabay, Mixkit, Zapsplat (attribution required), Freesound (per-file Creative Commons licences) and the YouTube Audio Library (YouTube only). [newcastle](https://www.newcastle.edu.au/__data/assets/pdf_file/0007/875995/Suggested-sound-effects-sites.pdf) Check each licence again before use. |

### 2. Similar projects

| Name | URL | License | What to import |
|---|---|---|---|
| Remotion Claude Code plugin | github.com/remotion-dev/claude-code-plugin | Remotion License | Install command in the toolchain section. Skills are namespaced, e.g. `/remotion:remotion-create`. [tella +2](https://www.tella.com/blog/how-to-use-remotion-agent-skills-with-claude-code) |
| Remotion Agent Skills | github.com/remotion-dev/skills | Remotion | A third-party test (zhuyansen list) found "reliable rendering in 4.5 minutes", but the output looked default. Pair it with your own design rules. [github](https://github.com/zhuyansen/awesome-claude-video-skills) |
| HyperFrames | github.com/heygen-com/hyperframes | Apache 2.0 | `npx hyperframes add <block>` catalog; `frame.md` brand tokens; lint → preview → render loop; deterministic rendering; a `<hyperframes-player>` web component for embeds; Git LFS used only for golden test videos. [github](https://github.com/heygen-com/hyperframes) |
| claude-motion | github.com/whaleyxbt/claude-motion | not checked | `timeline.json` as the single source of timing; easing, spring and stagger numbers; anti-patterns; a review-loop skill and a sound-design skill. [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md) |
| claude-motion-design | github.com/howseen-ai/claude-motion-design | MIT | Brief, 4-still approval, draft, master; `seek(t)` engine; subframe blur; pop and flash detection; loop-seam check; prompt library; "Example data" honesty rule; free-asset fetch scripts. [github](https://github.com/howseen-ai/claude-motion-design) |
| video-use | github.com/browser-use/video-use | MIT | 12 hard rules (subtitles applied last, `-c copy` concat, 30 ms audio fades, never cut inside a word, cut padding of 30–200 ms); choose the engine per slot; self-review at every cut; `project.md` as session memory. [instagit +2](https://instagit.com/browser-use/video-use/animation-engine-comparison-hyperframes-remotion-manim-pil/) |
| claude-code-video-toolkit | github.com/digitalsamba/claude-code-video-toolkit | MIT | `.claude/skills` + `commands` + `lib/` + `templates/` + a gitignored `projects/` folder; `/video`, `/brand`, `/setup` commands; open-source voice (Qwen3-TTS), music (ACE-Step) and images (FLUX.2); R2 storage; a `toolkit-registry.json` catalog. [github +3](https://github.com/digitalsamba/claude-code-video-toolkit/blob/main/README.md) |
| Motion-graphics-skill (motion-video-director) | github.com/Miftahul-Islam-Efaz/Motion-graphics-skill | **Restrictive ("All rights reserved")** | Install: `npx skills add Miftahul-Islam-Efaz/Motion-graphics-skill`. [github](https://github.com/eyadhussain00-hub/Videoediting) A third party reports the original URL 404'd and that the licence restricts redistribution. [github](https://github.com/elijahmunzai-rgb/elijah-video-source-acquisition/issues/1) Study the ideas only; don't copy code. |
| motion-graphics-skills (charlie947) | github.com/charlie947/motion-graphics-skills | not checked | `brand.md` + `MOTION.md`, plus a CLAUDE.md rule that Claude reads both before animating. [github](https://github.com/charlie947/motion-graphics-skills) |
| awesome-claude-video-skills | github.com/zhuyansen/awesome-claude-video-skills | listed | Tested 16 skills on 2026-10-11. All passed; time ranged from 2.0 to 23.5 minutes. Plain Claude Code with no skill made a passing film in 4.4 minutes. Skills earn their place through look and workflow. [github](https://github.com/zhuyansen/awesome-claude-video-skills) |
| Motion Canvas / Revideo | motion-canvas, redotvideo/revideo | MIT | Animation written as generator functions; Revideo adds headless `renderVideo()`. [snapcn](https://snapcn.dev/remotion-vs-revideo) Only useful if Remotion's licence becomes a problem. |
| generative-manim / Math-To-Manim | marcelo-earth/generative-manim; HarleyCoops/Math-To-Manim | open source (licences not checked) | Install Math-To-Manim with `claude --plugin-dir ./Math-To-Manim/skill`. [x](https://x.com/christiancooper/status/2016630572538614147) Use Manim for math and diagram scenes; manim-voiceover handles voice-synced timing. [github](https://github.com/topics/manim) |
| ElevenLabs MCP / skills | github.com/elevenlabs/elevenlabs-mcp; elevenlabs/skills | MIT (PyPI) | Tools: `text_to_speech`, `text_to_sound_effects`, `compose_music`, `speech_to_text`. [docker](https://hub.docker.com/r/mcp/elevenlabs) Install the skill with `npx skills add https://github.com/elevenlabs/skills --skill sound-effects`. [mcpservers](https://mcpservers.org/agent-skills/elevenlabs/sound-effects) |
| Kokoro-82M | huggingface.co/hexgrad/Kokoro-82M | Apache 2.0 (weights); depends on espeak-ng, which is GPLv3 | Free local voiceover [github](https://github.com/zboyles/Kokoro-82M) with 54 voices in 8 languages. No voice cloning. [qwe](https://www.qwe.edu.pl/tutorial/kokoro-tts-local-cpu-tutorial/) |
| Remotion-controls-skill | github.com/beimeibeile/Remotion-controls-skill | not checked | Claims Remotion's direct WebM/MOV output loses transparency, and uses a PNG sequence → `prores_ks -profile:v 4 yuva444p12le` pipeline instead. [github](https://github.com/beimeibeile/Remotion-controls-skill) Unverified, because Remotion's docs say direct ProRes 4444 works. [remotion](https://www.remotion.dev/docs/transparent-videos) |
| remotion-superpowers | github.com/DojoCodingLabs/remotion-superpowers | open source | A plugin bundling 5 MCP servers and 13 commands, including an AI review loop. [github](https://github.com/dojocodinglabs/remotion-superpowers) |

## Details: additions and corrections by playbook section

**Toolchain choice.**
- **Default:** Remotion, if you are an individual or a company of 3 people or fewer. Install the plugin with `claude plugin marketplace add remotion-dev/claude-code-plugin && claude plugin install remotion@remotion`, then restart Claude Code. [remotion](https://www.remotion.dev/docs/ai/claude-code-plugin) [remotion](https://remotion.dev/license) You can instead install the skills inside the project with `npx skills add remotion-dev/skills`. [Substack](https://zerofuturetech.substack.com/p/generate-videos-with-claude-code) [remotion](https://www.remotion.dev/docs/ai/skills)
- **Second engine:** HyperFrames, for website-to-video, GSAP, Lottie or Three.js, and transparent WebM overlays. [github](https://github.com/browser-use/video-use/blob/main/SKILL.md)
- **Python:** MoviePy for text overlays on generated footage or short `build.py` projects; Manim for math.
- **Rule from video-use:** pick the engine per scene, not per repo.

**General instructions for Claude (CLAUDE.md).**
- Every frame must be a pure function of the frame number or time. No CSS transitions, `Math.random()` or `Date` (claude-motion). [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)
- Write a brief before writing code (howseen): a named reference style, timed states, a list of layers, and a sound plan. [github](https://github.com/howseen-ai/claude-motion-design)
- Get 4 stills approved, then render a 540p draft, then the master. [github](https://github.com/howseen-ai/claude-motion-design)
- Ask, confirm, execute, then review your own output before showing it (video-use). [github](https://github.com/browser-use/video-use/blob/main/SKILL.md)
- Label illustrative data "Example data" on screen. [github](https://github.com/howseen-ai/claude-motion-design)
- Never put a blank or black frame 0. Feeds autoplay muted and use frame 0 as the thumbnail. [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)
- Do a phone check: the key message must read at 360 px wide. [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)

**Component catalog defaults (claude-motion SKILL.md).**

*Easing:*
- Entrances: `bezier(0.16,1,0.3,1)` [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)
- Exits: `bezier(0.6,0,0.9,0.35)` [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)
- Moves between states: `bezier(0.65,0,0.35,1)` [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)
- Values that "land": `bezier(0.55,0,0.2,1.12)` [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)
- Linear only for continuous motion (rotation, drift, grain). [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)

*Springs (damping / stiffness / mass):*
- Default: 14 / 140 / 0.8 [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)
- Pop: 9–11 / 200–230 / 0.7 [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)
- Elastic accent: 8 / 200, used once per video at most. [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)

*Timing:*
- Stagger words by 0.09 s, chips by 0.2–0.25 s. [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)
- Word reveal about 0.8 s. Exits about half the length of entrances. [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)
- Typing about 0.035 s per character. [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)
- Reading holds: at least 1 s, plus 0.25 s per word beyond three, and at least 2 s for the final hook. [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)
- Overlap scenes; don't leave hard gaps between them. [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)

*Typography and colour:*
- At most 3 font families. Display type about 138 px on a 1080 canvas with −0.02em tracking. [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)
- One accent colour, and it should mean something. [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)

*Texture and focus:*
- Film grain at about 0.09 opacity. [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)
- One hero moment per video, and one focal point per frame. [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)
- Keep content at least 60 px from the edges. [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)

*Transitions:*
- Use Remotion's presentations. For HTML-in-canvas shaders, make sure renders run in Chrome. [remotion](https://www.remotion.dev/docs/transitions/presentations/custom-html-in-canvas)
- Prefer transitions motivated by an object on screen. [github](https://github.com/whaleyxbt/claude-motion/blob/main/.claude/skills/motion-design/SKILL.md)
- HyperFrames blueprints to borrow as named intros, outros and CTAs: `titlecard-reveal`, `logo-assemble-lockup`, `kinetic-type-beats`, `dataviz-countup`, `cta-morph-press`, `cursor-ui-demo`, `zoom-out-workspace-reveal` (via the kortix mirror).

*Audio:*
- Place each sound effect at its measured peak, find the real music drop from band energy, and loudness-normalize in two passes to −14 LUFS (howseen). [github](https://github.com/howseen-ai/claude-motion-design)
- Add 30 ms fades at every cut (video-use). [github](https://github.com/browser-use/video-use/blob/main/SKILL.md)

*Sources:*
- Music and SFX: Mixkit, Pixabay, Freesound (CC0 preferred); see the Newcastle table. [github](https://github.com/howseen-ai/claude-motion-design)
- YouTube Audio Library is for YouTube uploads only.
- Voice: ElevenLabs (paid) or Kokoro (free).

**Prompt templates.**
- **Planning prompt** (zerofuturetech): goal, audience, duration with frame math (60 s × 30 fps = 1800 frames), assets, style. Ask for a storyboard, copy and technical hints. [Substack](https://zerofuturetech.substack.com/p/generate-videos-with-claude-code) Then: "convert into `video_prompt.md` with a timeline table, animation specs, and constants extracted".
- **Plugin one-liner** (Remotion docs): `/remotion:remotion-create Make a promo video for a record store`. [remotion](https://www.remotion.dev/docs/ai/claude-code-plugin)
- **HyperFrames:** "Using `/hyperframes`, create a 10-second product intro with a fade-in title, a background video, and subtle background music." [github](https://github.com/heygen-com/hyperframes)

**Rendering without pixel loss.**
- Remotion master: `npx remotion render Comp out/master.mov --codec=prores --prores-profile=hq --image-format=png --color-space=bt709`.
- With transparency: `--prores-profile=4444 --pixel-format=yuva444p10le`. [remotion](https://www.remotion.dev/docs/prores)
- H.264 master: `--image-format=png --crf=12 --color-space=bt709 --x264-preset=slow`.
- HiDPI web: add `--scale=2`. [remotion](https://www.remotion.dev/docs/cli/render)
- Chroma: for UI or text-heavy archival copies use `--pixel-format=yuv444p`, but deliver in 4:2:0 because YouTube requires it. [google](https://support.google.com/youtube/answer/1722171?hl=en)
- Range: deliver limited (TV) range, BT.709. YouTube converts full range anyway. [google](https://support.google.com/youtube/answer/1722171?hl=en)
- Motion blur: `@remotion/motion-blur` (`<HtmlInCanvasMotionBlur>`), or howseen's approach of N subframes blended with `tmix`, never across a hard cut. [github](https://github.com/howseen-ai/claude-motion-design) [remotion](https://www.remotion.dev/docs/api)
- Frame rate: keep the source frame rate. [google](https://support.google.com/youtube/answer/1722171?hl=en) 60 fps for UI motion, otherwise 30.

**Output presets by destination.**

| Destination | Spec | Command / notes |
|---|---|---|
| YouTube landscape | 1080p: 8 Mbps (30 fps), 12 Mbps (60 fps); 4K: 35–45 / 53–68 Mbps | Uploading 4K gets you VP9 playback ("To view new 4K uploads in 4K, use a browser… that supports VP9"). [google](https://support.google.com/youtube/answer/1722171?hl=en) `ffmpeg -i master.mov -c:v libx264 -profile:v high -crf 16 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -g 15 -bf 2 -c:a aac -b:a 384k -ar 48000 -movflags +faststart yt.mp4` (`-g` = half the frame rate). |
| Shorts / Reels / TikTok | 1080×1920, 9:16; a Short is 3 min or less [hopperhq](https://www.hopperhq.com/blog/youtube-shorts-dimensions/) | Meta safe zones as reported by Sprout Social: keep 14% at the top, 35% at the bottom and 6% at each side free of text. [sproutsocial](https://sproutsocial.com/insights/social-media-video-specs-guide/) |
| WhatsApp chat | 100 MB / 720p (fast connection), 64 MB / 480p (slow); HD has no published cap | faq.whatsapp.com/453914586839706. For full quality, send as a **document, up to 2 GB**. Status: 90 s, MP4 or 3GP, no HD (faq.whatsapp.com/454876960047011). [whatsapp +4](https://faq.whatsapp.com/454876960047011) Cloud API: 16 MB, H.264 + AAC. [facebook](https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/media) Target about 720p at CRF 23 to stay well under 64 MB. |
| LinkedIn | 75 KB–5 GB; 3 s–15 min (desktop) or 10 min (mobile and Pages); up to 4096×2304; 10–60 fps; no MOV | linkedin.com/help answers a527229 and a1311816. [linkedin](https://www.linkedin.com/help/lms/answer/a527229) [linkedin](https://www.linkedin.com/help/linkedin/answer/a1311816) |
| X | Posts: 20 min / 8 GB without Premium, 125 min / 16 GB with Premium; DMs: 140 s / 512 MB; up to 60 fps; H.264 High + AAC-LC | docs.x.com media best practices. The docs list a 1280×1024 dimension limit but also say subscribers get 1080p, which conflicts. [x](https://docs.x.com/x-api/media/quickstart/best-practices) |
| Web embed | AV1 or VP9 WebM first, then H.264 MP4; `poster`; `-an` for muted loops; faststart [web](https://web.dev/learn/performance/video-performance?authuser=2) | `ffmpeg -i m.mov -c:v libsvtav1 -crf 35 -an hero.webm`; `ffmpeg -i m.mov -c:v libx264 -crf 23 -an -movflags +faststart hero.mp4`; `‹video autoplay muted loop playsinline poster>`. For a target file size (e.g. under 2–5 MB for a hero loop), use your own judgement; I found no official figure. |

**Draft SKILL.md (outline).**
- Frontmatter: `name: video-director`, plus a description that tells Claude to use it when given site content or a video request.
- Steps:
  1. Pull out facts, brand tokens and a `frame.md`.
  2. Classify the job (promo, explainer, data, social cut).
  3. Pick an engine per scene using the decision table.
  4. Pick components from `catalog/*.md` by ID: intro, title, transitions, data viz, outro/CTA, audio bed.
  5. Write the brief and `timeline.json`, then wait for approval.
  6. Render 4 stills, then a 540p draft.
  7. Self-review checklist: pops, frame 0, safe area, reading holds, LUFS.
  8. Render the master, then all presets.
  9. Write `manifest.json` and upload to storage.

**Repo structure.**
- `.claude/skills/{video-director,motion-design,review-loop,sound-design}`
- `.claude/commands/{video,brand,render}`
- `catalog/` with one Markdown file per component, each with: id, engine, duration, params, preview GIF, source URL, licence
- `templates/`, `prompts/`, `brands/<name>/{brand.md,frame.md}`
- `presets/*.sh`
- `projects/` (gitignored)
- `videos/manifest.json` recording URL, poster, sizes and hash
- Store masters and renders in S3 or R2, not git. Use Git LFS only for small preview or golden-test files, as HyperFrames does with about 240 MB. [github](https://github.com/heygen-com/hyperframes)

## Caveats
- Some figures come from search-result snippets rather than full pages: Remotion's ProRes, transparency and CLI pages, the plugin page, LinkedIn help (its pages block automated access), and some WhatsApp FAQ pages (some open with non-English locale parameters). Open those in a browser before publishing.
- I couldn't verify the claude-motion "effort levels" table or −14 LUFS in the file the playbook cites, Instagram's maximum length, or the licences of some community repos.
- Star counts and third-party test results change quickly.

## References
- remotion.dev/docs/ai/skills: skill names, install commands
- remotion.dev/docs/ai/claude-code-plugin: plugin commands
- remotion.dev/docs/quality and /encoding: quality settings, CRF table
- remotion.dev/docs/transitions/presentations (+ /zoom-blur, /book-flip, /html-in-canvas, /custom-html-in-canvas): transition list, Chrome flag
- remotion.dev/docs/prores, /transparent-videos, /options/prores-profile, /cli/render, /config: ProRes profiles, scale, pixel formats
- github.com/remotion-dev/remotion LICENSE.md and remotion.dev/docs/license/pricing: licence tiers
- github.com/heygen-com/hyperframes: skills, catalog, plugin, comparison, LFS
- kortix.com HyperFrames mirror: blueprint names
- open-design.ai HyperFrames templates: template gallery
- whaleyxbt/claude-motion SKILL.md: motion numbers
- howseen-ai/claude-motion-design: pipeline, mux command, audio
- browser-use/video-use SKILL.md: hard rules
- instagit.com: engine comparison summary
- digitalsamba/claude-code-video-toolkit README and skills.sh moviepy page: skills, layout, moviepy table
- zhuyansen/awesome-claude-video-skills: end-to-end test results
- opusvideo/awesome-claude-video: curated video list
- Miftahul-Islam-Efaz Motion-graphics-skill (via GitHub search results): install command, licence warning
- charlie947/motion-graphics-skills: brand.md / MOTION.md
- marcelo-earth/generative-manim and HarleyCoops/Math-To-Manim: Manim workflows
- Revideo and Motion Canvas comparisons (snapcn.dev): MIT licensing
- Kokoro-82M model card: licence
- ElevenLabs MCP (PyPI, Docker Hub): tool names
- beimeibeile/Remotion-controls-skill: ProRes alpha pipeline claim
- support.google.com/youtube/answer/1722171 and /15424877: encoding settings, Shorts rules
- faq.whatsapp.com and developers.facebook.com (via subagent): WhatsApp limits
- linkedin.com/help a527229, a548372, a1311816: LinkedIn specs
- docs.x.com media best practices: X limits
- web.dev video performance: web embed guidance
- Sprout Social: Reels safe zones
- zerofuturetech substack: prompt templates
- tella.com, horadecodar.com.br, openreplay: plugin and MCP context
- soundstripe.com: YouTube Audio Library licence
- newcastle.edu.au PDF: SFX site licences
- tools.now.to, fast.io: outdated WhatsApp claims
- videohighlight.com: worktrees claim not found