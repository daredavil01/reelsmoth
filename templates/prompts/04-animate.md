<!-- Effort medium for building, high for the review loop -->
Animate the approved stills per spec.md. Everything is a pure function of frame.
Render a 540p draft (scripts/master.sh <Comp> <slug> --draft), then a contact sheet
(scripts/contact-sheet.sh) with one frame per beat.
Score each beat 1-10 on: hook, readability, timing/holds, composition, polish.
Fix anything under 8, re-render, repeat. Then lock picture and build audio:
music drop on the hero beat, SFX on measured peaks, master to -14 LUFS (scripts/audio-master.sh).
