import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {randRange} from '../lib/rand';

// Film grain at ~0.09 opacity. The noise tile shifts per frame from a seeded
// offset, so renders are deterministic.
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.09}) => {
  const frame = useCurrentFrame();
  const x = Math.round(randRange(`grain-x-${frame}`, 0, 200));
  const y = Math.round(randRange(`grain-y-${frame}`, 0, 200));
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
  );
  return (
    <AbsoluteFill
      style={{
        opacity,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,${svg}")`,
        backgroundPosition: `${x}px ${y}px`,
      }}
    />
  );
};
