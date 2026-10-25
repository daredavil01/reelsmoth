---
description: Render the master for a video and export it to destination presets
argument-hint: <CompId> <slug> <preset...|all>
---
Arguments: $ARGUMENTS (composition id, slug, then presets).

1. `scripts/master.sh <CompId> <slug>` (add `--scale=2` if youtube or web is requested).
2. If the master has audio, check loudness with `scripts/check.sh`; if it's off, run `scripts/audio-master.sh` on the master.
3. `scripts/encode.sh <slug> <presets>`.
4. `scripts/check.sh` each export against its preset. Fix any FAIL and re-run.
5. Report a table: file, resolution, size, duration, check result.
