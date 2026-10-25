import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../lib/brand';
import {EASE, prog} from '../lib/easing';
import {SPRING, springAt, TIMING} from '../lib/springs';

// Editorial poster frame for data stories and essays: a rule draws across,
// a big tilted figure drops in, the headline rises line by line.
export const EditorialPoster: React.FC<{
  figure: string;
  lines: string[];
  kicker?: string;
  /** Source or "Example data" line, set small under the headline. */
  footnote?: string;
}> = ({figure, lines, kicker, footnote}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rule = prog(frame, 0, 0.7 * fps);
  const drop = springAt(frame, fps, 0.2, SPRING.heavy);
  const label: React.CSSProperties = {
    fontFamily: BRAND.fonts.mono,
    fontSize: BRAND.type.labelPx,
    letterSpacing: BRAND.type.labelTracking,
    textTransform: 'uppercase',
    color: BRAND.colors.muted,
  };
  return (
    <AbsoluteFill style={{padding: 140, flexDirection: 'row', alignItems: 'center', gap: 80}}>
      <div
        style={{
          fontFamily: BRAND.fonts.display,
          fontWeight: 900,
          fontSize: BRAND.type.statPx * 1.6,
          letterSpacing: '-0.05em',
          lineHeight: 0.9,
          color: BRAND.colors.accent,
          // Visible from frame 0, already mid-drop: never an empty first frame.
          opacity: 0.25 + 0.75 * Math.min(1, drop),
          transform: `translateY(${(1 - drop) * -160}px) rotate(${-8 * drop}deg)`,
        }}
      >
        {figure}
      </div>
      <div style={{flex: 1}}>
        {kicker ? <div style={{...label, color: BRAND.colors.accent, marginBottom: 20}}>{kicker}</div> : null}
        <div style={{height: 4, backgroundColor: BRAND.colors.text, transform: `scaleX(${rule})`, transformOrigin: 'left', marginBottom: 36}} />
        {lines.map((line, i) => {
          const p = prog(frame, (0.45 + i * TIMING.staggerItem) * fps, (1.15 + i * TIMING.staggerItem) * fps, EASE.enter);
          return (
            <div key={i} style={{overflow: 'hidden'}}>
              <div
                style={{
                  fontFamily: BRAND.fonts.serif,
                  fontSize: BRAND.type.titlePx,
                  lineHeight: 1.1,
                  color: BRAND.colors.text,
                  transform: `translateY(${(1 - p) * 110}%)`,
                }}
              >
                {line}
              </div>
            </div>
          );
        })}
        {footnote ? <div style={{...label, marginTop: 32, opacity: prog(frame, 1.2 * fps, 1.7 * fps)}}>{footnote}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
