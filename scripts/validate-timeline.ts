// Validate one or more timeline.json files with the same rules the
// compositions use at render time.
//
//   npx tsx scripts/validate-timeline.ts videos/<slug>/timeline.json [...]
import {readFileSync} from 'node:fs';
import {totalFrames, validateTimeline, type Timeline} from '../src/lib/timeline';

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('usage: npx tsx scripts/validate-timeline.ts <timeline.json...>');
  process.exit(2);
}

let failed = 0;
for (const file of files) {
  try {
    const t = validateTimeline(JSON.parse(readFileSync(file, 'utf8')) as Timeline);
    const frames = totalFrames(t);
    console.log(`ok    ${file}: ${t.beats.length} beats, ${frames} frames (${(frames / t.fps).toFixed(2)} s) at ${t.width}x${t.height}@${t.fps}`);
  } catch (e) {
    failed++;
    console.error(`FAIL  ${file}: ${(e as Error).message}`);
  }
}
process.exit(failed ? 1 : 0);
