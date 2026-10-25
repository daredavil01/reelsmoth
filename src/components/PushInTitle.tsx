import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../lib/brand';
import {EASE, prog} from '../lib/easing';

// Premium / minimal title card: dark canvas, kicker line, one warm accent,
// and a slow camera push from 1.0 to 1.06 over the card's length.
export const PushInTitle: React.FC<{
  title: string;
  kicker?: string;
  /** One word of the title to colour with the accent. */
  accentWord?: string;
  /** Seconds the push takes (default 3). */
  push?: number;
}> = ({title, kicker, accentWord, push = 3}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = 1 + 0.06 * prog(frame, 0, push * fps, EASE.enter);
  const kick = prog(frame, 0, 0.8 * fps);
  const rise = prog(frame, 0.15 * fps, 1.1 * fps);
  const words = title.split(' ');
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', transform: `scale(${scale})`}}>
      {kicker ? (
        <div
          style={{
            fontFamily: BRAND.fonts.mono,
            fontSize: BRAND.type.labelPx,
            letterSpacing: BRAND.type.labelTracking,
            textTransform: 'uppercase',
            color: BRAND.colors.muted,
            opacity: 0.35 + 0.65 * kick,
            marginBottom: 32,
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: BRAND.fonts.display,
          fontWeight: 700,
          fontSize: BRAND.type.displayPx,
          letterSpacing: BRAND.type.displayTracking,
          lineHeight: 1.04,
          color: BRAND.colors.text,
          textAlign: 'center',
          opacity: 0.4 + 0.6 * rise,
          transform: `translateY(${(1 - rise) * 30}px)`,
        }}
      >
        {words.map((w, i) => (
          <span key={i} style={{color: w.replace(/[^\p{L}\p{N}]/gu, '') === accentWord ? BRAND.colors.accent : undefined}}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
