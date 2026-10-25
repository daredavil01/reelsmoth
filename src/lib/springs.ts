import {spring, type SpringConfig} from 'remotion';

// Spring presets (damping / stiffness / mass) from claude-motion.
export const SPRING = {
  default: {damping: 14, stiffness: 140, mass: 0.8},
  heavy: {damping: 18, stiffness: 120, mass: 1.2},
  /** A control snapping to a step (knob, slider notch, toggle). */
  notch: {damping: 12, stiffness: 190, mass: 0.75},
  pop: {damping: 10, stiffness: 215, mass: 0.7},
  /** Use at most once per video. */
  elastic: {damping: 8, stiffness: 200, mass: 0.8},
} satisfies Record<string, Partial<SpringConfig>>;

// Timing constants in seconds.
export const TIMING = {
  staggerWord: 0.09,
  staggerItem: 0.22,
  staggerDot: 0.06,
  wordReveal: 0.8,
  typePerChar: 0.035,
  /** Idle caret blink rate in Hz. */
  caretBlinkHz: 2.4,
  minHold: 1,
  holdPerExtraWord: 0.25,
  finalHookHold: 2,
} as const;

/** Spring progress (0 -> ~1) that starts `startSec` after local frame 0. */
export const springAt = (
  frame: number,
  fps: number,
  startSec: number,
  config: Partial<SpringConfig> = SPRING.default,
): number => spring({frame: frame - startSec * fps, fps, config});

/** Minimum reading hold in seconds for a phrase. */
export const readingHold = (text: string, isFinalHook = false): number => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const hold = TIMING.minHold + Math.max(0, words - 3) * TIMING.holdPerExtraWord;
  return isFinalHook ? Math.max(hold, TIMING.finalHookHold) : hold;
};
