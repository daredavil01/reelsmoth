import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../lib/brand';
import {loopPhase, loopWave} from '../lib/loop';

// Seamless loop: every value is periodic in the composition length, so the
// last frame flows into the first with matching position and velocity.
// Use as a web-loop hero background or a social loop behind a short line.
export const LoopOrbit: React.FC<{
  dots?: number;
  radius?: number;
  children?: React.ReactNode;
}> = ({dots = 12, radius = 300, children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const phase = loopPhase(frame, durationInFrames);
  const breathe = loopWave(frame, durationInFrames, 1);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      {Array.from({length: dots}, (_, i) => {
        // One full turn per loop, each dot offset; size pulses twice per loop.
        const a = 2 * Math.PI * (phase + i / dots);
        const r = radius * (1 + 0.06 * breathe);
        const s = 14 + 8 * loopWave(frame, durationInFrames, 2, i / dots);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: s,
              height: s,
              borderRadius: s,
              backgroundColor: i === 0 ? BRAND.colors.accent : BRAND.colors.muted,
              transform: `translate(${Math.cos(a) * r}px, ${Math.sin(a) * r}px)`,
            }}
          />
        );
      })}
      <div style={{transform: `scale(${1 + 0.02 * breathe})`}}>{children}</div>
    </AbsoluteFill>
  );
};
