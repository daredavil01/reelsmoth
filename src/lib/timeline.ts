// Beats live in one timeline.json per video. Scenes, audio and review all
// read it, so retiming a beat moves sound with picture. Components take
// offsets from named beats, never hardcoded start times.
//
// The JSON shape is described by timeline.schema.json (editor completion and
// scripts/validate-timeline.ts); validateTimeline() enforces the same rules.

export type Beat = {
  id: string;
  /** Start in seconds from the top of the video. */
  start: number;
  /** Duration in seconds. */
  duration: number;
  label?: string;
  /** The one hero moment; the music drop lands on its start. */
  hero?: boolean;
};

export type MusicCue = {
  /** Path under public/. */
  src: string;
  /** Seconds into the track where the drop is (scripts/find-drop.py). */
  dropAt: number;
  /** Beat the drop lands on; default the hero beat. */
  dropOn?: string;
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
  duck?: {beat: string; amount?: number}[];
};

export type SfxCue = {
  beat: string;
  /** Path under public/. */
  src: string;
  anchor?: 'start' | 'end';
  /** Seconds after the anchor where the sound's peak lands. */
  offset?: number;
  /** Seconds into the file where it peaks (scripts/measure-peak.py). */
  peak?: number;
  gain?: number;
};

export type Timeline = {
  $schema?: string;
  fps: number;
  width: number;
  height: number;
  beats: Beat[];
  audio?: {music?: MusicCue; sfx?: SfxCue[]};
};

const BEAT_ID = /^[a-z][a-z0-9-]*$/;

export const validateTimeline = <T extends Timeline>(t: T): T => {
  if (!Number.isInteger(t.fps) || t.fps <= 0) throw new Error(`timeline: bad fps ${t.fps}`);
  if (!Number.isInteger(t.width) || !Number.isInteger(t.height) || t.width % 2 || t.height % 2) {
    throw new Error('timeline: width and height must be even integers (H.264)');
  }
  if (!Array.isArray(t.beats) || t.beats.length === 0) throw new Error('timeline: no beats');
  const ids = new Set<string>();
  let heroes = 0;
  for (const b of t.beats) {
    if (!BEAT_ID.test(b.id)) throw new Error(`timeline: beat id "${b.id}" must be kebab-case`);
    if (ids.has(b.id)) throw new Error(`timeline: duplicate beat id "${b.id}"`);
    ids.add(b.id);
    if (!(b.start >= 0) || !(b.duration > 0)) throw new Error(`timeline: beat "${b.id}" has bad timing`);
    if (b.hero) heroes++;
  }
  if (heroes > 1) throw new Error('timeline: more than one hero beat (one hero moment per video)');
  const known = (id: string, what: string) => {
    if (!ids.has(id)) throw new Error(`timeline: ${what} refers to unknown beat "${id}"`);
  };
  const music = t.audio?.music;
  if (music) {
    if (music.dropOn) known(music.dropOn, 'audio.music.dropOn');
    else if (!heroes) throw new Error('timeline: audio.music needs a hero beat or dropOn');
    for (const d of music.duck ?? []) known(d.beat, 'audio.music.duck');
  }
  for (const c of t.audio?.sfx ?? []) known(c.beat, `sfx cue ${c.src}`);
  return t;
};

export const beat = (t: Timeline, id: string): Beat => {
  const b = t.beats.find((x) => x.id === id);
  if (!b) throw new Error(`timeline: no beat "${id}"`);
  return b;
};

export const secToFrames = (t: Timeline, seconds: number): number => Math.round(seconds * t.fps);

/** Frame range of a beat, for <Sequence from durationInFrames>. */
export const beatFrames = (t: Timeline, id: string) => {
  const b = beat(t, id);
  return {from: secToFrames(t, b.start), durationInFrames: secToFrames(t, b.duration)};
};

/** Absolute frame of a beat's start plus an offset in seconds (may be negative). */
export const beatStart = (t: Timeline, id: string, offsetSec = 0): number =>
  secToFrames(t, beat(t, id).start + offsetSec);

/** Absolute frame of a beat's end plus an offset in seconds (may be negative). */
export const beatEnd = (t: Timeline, id: string, offsetSec = 0): number => {
  const b = beat(t, id);
  return secToFrames(t, b.start + b.duration + offsetSec);
};

/** The hero beat, if the timeline marks one. */
export const heroBeat = (t: Timeline): Beat | undefined => t.beats.find((b) => b.hero);

/** Total length in frames: end of the last beat. */
export const totalFrames = (t: Timeline): number =>
  Math.max(...t.beats.map((b) => Math.round((b.start + b.duration) * t.fps)));
