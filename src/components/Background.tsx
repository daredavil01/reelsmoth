import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../lib/brand';

// Dark canvas, slow drifting grid and a vignette, so nothing is dead-still.
export const Background: React.FC<{gridPx?: number; driftPxPerSec?: number}> = ({
  gridPx = 72,
  driftPxPerSec = 6,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const offset = ((frame / fps) * driftPxPerSec) % gridPx;
  const line = 'rgba(255,255,255,0.045)';
  return (
    <AbsoluteFill style={{backgroundColor: BRAND.colors.bg}}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
          backgroundSize: `${gridPx}px ${gridPx}px`,
          backgroundPosition: `${offset}px ${offset}px`,
        }}
      />
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)'}}
      />
    </AbsoluteFill>
  );
};
