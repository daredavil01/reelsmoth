// Beats live in one timeline.json per video. Scenes, audio and review all
// read it, so retiming a beat moves sound with picture. Components take
// offsets from named beats, never hardcoded start times.

export type Beat = {
  id: string;
  /** Start in seconds from the top of the video. */
  start: number;
  /** Duration in seconds. */
  duration: number;
  label?: string;
};

export type Timeline = {
  fps: number;
  width: number;
  height: number;
  beats: Beat[];
};

export const validateTimeline = (t: Timeline): Timeline => {
  if (!Number.isInteger(t.fps) || t.fps <= 0) throw new Error(`timeline: bad fps ${t.fps}`);
  if (t.width % 2 || t.height % 2) throw new Error('timeline: width and height must be even (H.264)');
  const ids = new Set<string>();
  for (const b of t.beats) {
    if (ids.has(b.id)) throw new Error(`timeline: duplicate beat id "${b.id}"`);
    ids.add(b.id);
    if (b.start < 0 || b.duration <= 0) throw new Error(`timeline: beat "${b.id}" has bad timing`);
  }
  return t;
};

export const beat = (t: Timeline, id: string): Beat => {
  const b = t.beats.find((x) => x.id === id);
  if (!b) throw new Error(`timeline: no beat "${id}"`);
  return b;
};

/** Frame range of a beat, for <Sequence from durationInFrames>. */
export const beatFrames = (t: Timeline, id: string) => {
  const b = beat(t, id);
  return {from: Math.round(b.start * t.fps), durationInFrames: Math.round(b.duration * t.fps)};
};

/** Total length in frames: end of the last beat. */
export const totalFrames = (t: Timeline): number =>
  Math.max(...t.beats.map((b) => Math.round((b.start + b.duration) * t.fps)));
