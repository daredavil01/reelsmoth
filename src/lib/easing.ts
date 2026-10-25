import {Easing} from 'remotion';

// Motion defaults from whaleyxbt/claude-motion (motion-design SKILL.md).
export const EASE = {
  /** Entrances: fast out, long settle. */
  enter: Easing.bezier(0.16, 1, 0.3, 1),
  /** Exits: about half the length of the entrance. */
  exit: Easing.bezier(0.6, 0, 0.9, 0.35),
  /** Moves between two on-screen states. */
  move: Easing.bezier(0.65, 0, 0.35, 1),
  /** Values that "land" with a small overshoot. */
  land: Easing.bezier(0.55, 0, 0.2, 1.12),
  /** Continuous motion only: rotation, drift, grain. */
  linear: Easing.linear,
} as const;
