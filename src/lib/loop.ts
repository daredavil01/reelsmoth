// Seamless loops: drive every moving value from the loop phase, so the last
// frame matches the first in position and velocity. Use periodic functions
// (sin/cos of the phase, or whole-number cycles), never a tween that stops.

/** Phase 0..1 of a loop of `durationInFrames`; frame N wraps to frame 0. */
export const loopPhase = (frame: number, durationInFrames: number): number =>
  (((frame % durationInFrames) + durationInFrames) % durationInFrames) / durationInFrames;

/** A sine wave that completes `cycles` whole cycles per loop (-1..1). */
export const loopWave = (frame: number, durationInFrames: number, cycles = 1, offset = 0): number =>
  Math.sin(2 * Math.PI * (cycles * loopPhase(frame, durationInFrames) + offset));
