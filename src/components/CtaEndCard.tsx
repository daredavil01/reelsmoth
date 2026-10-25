import {useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../lib/brand';
import {EASE, prog} from '../lib/easing';
import {SPRING, springAt} from '../lib/springs';

// End card: one line plus the URL or handle, held still for reading.
// Size its beat with readingHold(line, true) so it stays >= 2 s.
export const CtaEndCard: React.FC<{
  line: string;
  url: string;
}> = ({line, url}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lineIn = prog(frame, 0, 0.7 * fps);
  const pill = springAt(frame, fps, 0.3, SPRING.pop);
  const underline = prog(frame, 0.6 * fps, 1.2 * fps, EASE.enter);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 56}}>
      <div
        style={{
          fontFamily: BRAND.fonts.display,
          fontWeight: 700,
          fontSize: BRAND.type.titlePx,
          letterSpacing: BRAND.type.displayTracking,
          color: BRAND.colors.text,
          textAlign: 'center',
          opacity: 0.3 + 0.7 * lineIn,
          transform: `translateY(${(1 - lineIn) * 24}px)`,
        }}
      >
        {line}
      </div>
      <div
        style={{
          padding: '22px 44px',
          borderRadius: 999,
          border: `3px solid ${BRAND.colors.accent}`,
          transform: `scale(${pill})`,
          position: 'relative',
        }}
      >
        <span style={{fontFamily: BRAND.fonts.mono, fontSize: BRAND.type.bodyPx, color: BRAND.colors.accent}}>{url}</span>
        <div
          style={{
            position: 'absolute',
            left: 44,
            right: 44,
            bottom: 14,
            height: 3,
            backgroundColor: BRAND.colors.accent,
            transform: `scaleX(${underline})`,
            transformOrigin: 'left',
          }}
        />
      </div>
    </div>
  );
};
