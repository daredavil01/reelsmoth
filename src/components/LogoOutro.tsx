import {Img, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../lib/brand';
import {EASE, prog} from '../lib/easing';

// Logo bloom: the mark resolves out of a blur with an accent glow that
// blooms then settles, followed by an optional tagline. Hold 1.5-2 s after.
export const LogoOutro: React.FC<{
  /** staticFile() path of the logo. Falls back to the brand wordmark. */
  logoSrc?: string;
  wordmark?: string;
  tagline?: string;
  logoHeight?: number;
}> = ({logoSrc, wordmark = BRAND.wordmark, tagline, logoHeight = 180}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const resolve = prog(frame, 0, 1 * fps, EASE.enter);
  // Glow rises with the resolve, then settles to a soft rest.
  const bloom = prog(frame, 0.3 * fps, 0.9 * fps, EASE.enter) - 0.6 * prog(frame, 0.9 * fps, 1.8 * fps, EASE.move);
  const tag = prog(frame, 0.9 * fps, 1.5 * fps);
  const glow = `drop-shadow(0 0 ${40 * bloom}px ${BRAND.colors.accent})`;
  const style: React.CSSProperties = {
    filter: `blur(${(1 - resolve) * 24}px) ${glow}`,
    transform: `scale(${0.92 + 0.08 * resolve})`,
    opacity: 0.2 + 0.8 * resolve,
  };
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36}}>
      {logoSrc ? (
        <Img src={logoSrc} style={{height: logoHeight, ...style}} />
      ) : (
        <div
          style={{
            fontFamily: BRAND.fonts.display,
            fontWeight: 900,
            fontSize: logoHeight * 0.75,
            letterSpacing: '0.08em',
            color: BRAND.colors.text,
            ...style,
          }}
        >
          {wordmark}
        </div>
      )}
      {tagline ? (
        <div
          style={{
            fontFamily: BRAND.fonts.mono,
            fontSize: BRAND.type.labelPx,
            letterSpacing: BRAND.type.labelTracking,
            textTransform: 'uppercase',
            color: BRAND.colors.muted,
            opacity: tag,
          }}
        >
          {tagline}
        </div>
      ) : null}
    </div>
  );
};
