import {random} from 'remotion';

// Seeded random only. Math.random() makes renders differ between frames
// and machines, so it is banned in this repo.
export const rand = (seed: string | number): number => random(seed);

export const randRange = (seed: string | number, min: number, max: number): number =>
  min + rand(seed) * (max - min);
