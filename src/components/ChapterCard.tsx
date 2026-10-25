import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../lib/brand';
import {EASE, prog} from '../lib/easing';
import {loopWave} from '../lib/loop';
import {Grain} from './Grain';

// Cinematic chapter card for long-form YouTube: 2.39:1 letterbox bars slide
// in, a warm light leak drifts across, large serif title over heavy grain.
export const ChapterCard: React.FC<{
  label: string;
  title: string;
}> = ({label, title}) => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();
  const bars = prog(frame, 0, 0.6 * fps, EASE.enter);
  const barH = ((height - width / 2.39) / 2) * (0.6 + 0.4 * bars);
  const leakX = 20 + 60 * prog(frame, 0, durationInFrames, EASE.linear);
  const leakA = 0.22 + 0.06 * loopWave(frame, durationInFrames, 2);
  const titleIn = prog(frame, 0.2 * fps, 1.3 * fps, EASE.enter);
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${leakX}% 40%, ${BRAND.colors.accent} 0%, transparent 45%)`,
          opacity: leakA,
          mixBlendMode: 'screen',
        }}
      />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            fontFamily: BRAND.fonts.mono,
            fontSize: BRAND.type.labelPx,
            letterSpacing: BRAND.type.labelTracking,
            textTransform: 'uppercase',
            color: BRAND.colors.accent,
            marginBottom: 24,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: BRAND.fonts.serif,
            fontSize: BRAND.type.displayPx * 1.1,
            lineHeight: 1,
            color: BRAND.colors.text,
            opacity: 0.3 + 0.7 * titleIn,
            letterSpacing: `${(1 - titleIn) * 0.06}em`,
          }}
        >
          {title}
        </div>
      </AbsoluteFill>
      <Grain opacity={0.16} />
      <AbsoluteFill style={{justifyContent: 'space-between'}}>
        <div style={{height: barH, backgroundColor: BRAND.colors.black}} />
        <div style={{height: barH, backgroundColor: BRAND.colors.black}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
