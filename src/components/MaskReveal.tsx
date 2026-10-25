import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE} from '../lib/easing';
import {TIMING} from '../lib/springs';

// Words slide up out of a clipping mask, one after another.
export const MaskReveal: React.FC<{
  text: string;
  style?: React.CSSProperties;
  /** Words to colour with the accent (one per line at most). */
  accentWords?: string[];
  accentColor?: string;
  stagger?: number;
  wordDuration?: number;
  /** Seconds of the reveal already elapsed at local frame 0. Use it on the
   *  opening shot so frame 0 (the feed thumbnail) already reads. */
  preroll?: number;
}> = ({
  text,
  style,
  accentWords = [],
  accentColor,
  stagger = TIMING.staggerWord,
  wordDuration = TIMING.wordReveal,
  preroll = 0,
}) => {
  const frame = useCurrentFrame() + preroll * useVideoConfig().fps;
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', columnGap: '0.25em', ...style}}>
      {words.map((w, i) => {
        const start = i * stagger * fps;
        const p = interpolate(frame, [start, start + wordDuration * fps], [0, 1], {
          easing: EASE.enter,
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const isAccent = accentWords.includes(w.replace(/[^\p{L}\p{N}]/gu, ''));
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: '0.08em'}}>
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - p) * 110}%)`,
                color: isAccent ? accentColor : undefined,
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};
