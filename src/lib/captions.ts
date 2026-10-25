import type {Caption} from '@remotion/captions';
import {TIMING} from './springs';

// Captions use the @remotion/captions Caption shape, so a Whisper transcript
// (/remotion:remotion-captions) drops straight in. Without a voiceover, build
// word timings from on-screen copy and a beat instead.

/** Word captions for `text`, spread evenly from `startSec`, `secPerWord` apart. */
export const captionsFromText = (text: string, startSec: number, secPerWord = 0.32): Caption[] =>
  text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word, i) => {
      const startMs = Math.round((startSec + i * secPerWord) * 1000);
      return {
        // Leading space, as Whisper emits it; createTikTokStyleCaptions relies on it.
        text: (i === 0 ? '' : ' ') + word,
        startMs,
        endMs: startMs + Math.round(secPerWord * 1000),
        timestampMs: startMs,
        confidence: null,
      };
    });

/** Seconds a caption line needs at the house reading pace. */
export const captionHold = (words: number): number =>
  TIMING.minHold + Math.max(0, words - 3) * TIMING.holdPerExtraWord;
