import {Img, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../lib/brand';
import {EASE, prog} from '../lib/easing';

// Product / site screen reveal: the screen rises out of a steep perspective
// tilt and settles at a slight angle, then drifts so it is never dead-still.
// Pass a Playwright screenshot via `src` (staticFile(...)) or any children.
export const UIShowcase: React.FC<{
  src?: string;
  children?: React.ReactNode;
  width?: number;
  /** Width / height of the screen. */
  aspect?: number;
  /** Final tilt in degrees. */
  tilt?: number;
}> = ({src, children, width = 1280, aspect = 16 / 10, tilt = 10}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = prog(frame, 0, 1.4 * fps, EASE.enter);
  const drift = (frame / fps) * 0.6; // degrees per second, linear: continuous motion
  const rotX = 38 - (38 - tilt) * p;
  const rotY = -14 + 14 * p - drift * 0.5;
  const h = width / aspect;
  return (
    <div style={{perspective: 2400}}>
      <div
        style={{
          width,
          height: h,
          borderRadius: 24,
          overflow: 'hidden',
          backgroundColor: BRAND.colors.surface,
          border: `2px solid ${BRAND.colors.line}`,
          transform: `translateY(${(1 - p) * 220}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transformOrigin: 'center bottom',
          boxShadow: `0 ${60 * p}px ${140 * p}px rgba(0,0,0,0.6)`,
          opacity: 0.35 + 0.65 * p,
        }}
      >
        {src ? <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : children}
      </div>
    </div>
  );
};
