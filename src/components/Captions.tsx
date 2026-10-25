import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../lib/brand';
import {EASE} from '../lib/easing';
import {SPRING, springAt} from '../lib/springs';

// Kinetic captions for videos watched muted (Shorts, WhatsApp). Words are
// grouped into pages; the active word takes the accent colour and pops.
// Times in `captions` are relative to the parent Sequence's frame 0.
export const Captions: React.FC<{
  captions: Caption[];
  /** Words closer together than this (ms) share a page. */
  combineWithinMs?: number;
  /** Vertical anchor as a fraction of height. Reels/Shorts: keep <= 0.65 (bottom 35% is UI). */
  anchor?: number;
  maxWidth?: number;
  fontSize?: number;
}> = ({captions, combineWithinMs = 1200, anchor = 0.62, maxWidth = 0.84, fontSize = BRAND.type.captionPx}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const {pages} = useMemo(
    () => createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: combineWithinMs}),
    [captions, combineWithinMs],
  );

  // The page on screen: the last one that has started. It stays until the next
  // page starts (or its own end, for the last page), so text never flashes.
  let idx = -1;
  for (let i = 0; i < pages.length; i++) if (pages[i].startMs <= ms) idx = i;
  if (idx < 0) return null;
  const page = pages[idx];
  const lastEnd = page.tokens[page.tokens.length - 1].toMs;
  const nextStart = pages[idx + 1]?.startMs ?? lastEnd + 400;
  if (ms >= nextStart) return null;

  const enter = springAt(frame, fps, page.startMs / 1000, SPRING.default);
  const exit = interpolate(ms, [nextStart - 160, nextStart], [0, 1], {
    easing: EASE.exit,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: (width * (1 - maxWidth)) / 2,
          width: width * maxWidth,
          top: height * anchor,
          transform: `translateY(-50%) translateY(${(1 - enter) * 24}px)`,
          opacity: Math.min(enter, 1 - exit),
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          columnGap: '0.28em',
          fontFamily: BRAND.fonts.body,
          fontWeight: 800,
          fontSize,
          lineHeight: 1.15,
          textAlign: 'center',
          color: BRAND.colors.text,
          // Legible over any footage without a box.
          textShadow: '0 4px 18px rgba(0,0,0,0.55)',
        }}
      >
        {page.tokens.map((t, i) => {
          const active = t.fromMs <= ms && ms < t.toMs;
          // Pops up on its word, eases back down after it.
          const pop = springAt(frame, fps, t.fromMs / 1000, SPRING.pop);
          const settle = interpolate(ms, [t.toMs, t.toMs + 140], [1, 0], {
            easing: EASE.exit,
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const scale = 1 + 0.07 * pop * settle;
          return (
            <span
              key={`${page.startMs}-${i}`}
              style={{
                display: 'inline-block',
                color: active ? BRAND.colors.accent : undefined,
                transform: `scale(${scale})`,
              }}
            >
              {t.text.trim()}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
