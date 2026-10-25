import {AbsoluteFill, getRemotionEnvironment} from 'remotion';

// Debug overlay: shows the 60 px safe margin (and optional social safe zones)
// in Studio only. Never appears in renders unless `force` is set (catalog
// preview only).
export const SafeArea: React.FC<{marginPx?: number; social?: boolean; force?: boolean}> = ({
  marginPx = 60,
  social = false,
  force = false,
}) => {
  if (!force && !getRemotionEnvironment().isStudio) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{inset: marginPx, border: '2px dashed rgba(0,255,170,0.6)'}} />
      {social ? (
        // Meta Reels zones as reported by Sprout Social: 14% top, 35% bottom, 6% sides.
        <AbsoluteFill
          style={{top: '14%', bottom: '35%', left: '6%', right: '6%', border: '2px dashed rgba(255,80,80,0.7)'}}
        />
      ) : null}
    </AbsoluteFill>
  );
};
