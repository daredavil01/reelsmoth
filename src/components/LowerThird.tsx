import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../lib/brand';
import {EASE} from '../lib/easing';
import {SPRING, springAt} from '../lib/springs';

// Name / source / label callout. Accent bar pops in on a spring, the text
// follows; exits with EASE.exit at about half the entrance length.
// Put it in a <Sequence> sized to the beat: it exits at the sequence's end.
export const LowerThird: React.FC<{
  title: string;
  subtitle?: string;
  /** Exit length in seconds (default 0.4). 0 = no exit. */
  exit?: number;
  align?: 'left' | 'right';
  style?: React.CSSProperties;
}> = ({title, subtitle, exit = 0.4, align = 'left', style}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const bar = springAt(frame, fps, 0, SPRING.pop);
  const text = springAt(frame, fps, 0.12, SPRING.default);
  const sub = springAt(frame, fps, 0.24, SPRING.default);
  const out =
    exit > 0
      ? interpolate(frame, [durationInFrames - exit * fps, durationInFrames], [0, 1], {
          easing: EASE.exit,
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;
  const dir = align === 'left' ? -1 : 1;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: align === 'left' ? 'row' : 'row-reverse',
        alignItems: 'stretch',
        gap: 24,
        opacity: 1 - out,
        transform: `translateX(${dir * out * 40}px)`,
        ...style,
      }}
    >
      <div
        style={{
          width: 8,
          borderRadius: 4,
          backgroundColor: BRAND.colors.accent,
          transform: `scaleY(${bar})`,
          transformOrigin: 'top',
        }}
      />
      <div style={{display: 'flex', flexDirection: 'column', gap: 8, textAlign: align}}>
        <div style={{overflow: 'hidden'}}>
          <div
            style={{
              fontFamily: BRAND.fonts.body,
              fontWeight: 700,
              fontSize: BRAND.type.lowerThirdPx,
              color: BRAND.colors.text,
              transform: `translateY(${(1 - text) * 110}%)`,
            }}
          >
            {title}
          </div>
        </div>
        {subtitle ? (
          <div
            style={{
              fontFamily: BRAND.fonts.mono,
              fontSize: BRAND.type.labelPx,
              letterSpacing: BRAND.type.labelTracking,
              textTransform: 'uppercase',
              color: BRAND.colors.muted,
              opacity: sub,
              transform: `translateX(${dir * (1 - sub) * 16}px)`,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
};
