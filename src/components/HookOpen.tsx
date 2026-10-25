import {useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../lib/brand';
import {EASE, prog} from '../lib/easing';
import {MaskReveal} from './MaskReveal';

// Hook-first cold open: the claim or number is already readable on frame 0
// (it is the feed thumbnail), then settles with a slight punch-in and an
// accent underline. No logo. Put it at the very top of the video.
export const HookOpen: React.FC<{
  claim: string;
  accentWords?: string[];
  kicker?: string;
  /** Seconds of the reveal already done at frame 0. 0.9 reads fully. */
  preroll?: number;
  fontSize?: number;
}> = ({claim, accentWords = [], kicker, preroll = 0.9, fontSize = BRAND.type.displayPx}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const punch = prog(frame, 0, 1.2 * fps, EASE.enter);
  const underline = prog(frame, 0.35 * fps, 1.1 * fps, EASE.enter);
  return (
    <div style={{transform: `scale(${1.04 - 0.04 * punch})`, transformOrigin: 'left center'}}>
      {kicker ? (
        <div
          style={{
            fontFamily: BRAND.fonts.mono,
            fontSize: BRAND.type.labelPx,
            letterSpacing: BRAND.type.labelTracking,
            textTransform: 'uppercase',
            color: BRAND.colors.accent,
            marginBottom: 28,
          }}
        >
          {kicker}
        </div>
      ) : null}
      <MaskReveal
        text={claim}
        accentWords={accentWords}
        accentColor={BRAND.colors.accent}
        preroll={preroll}
        style={{
          fontFamily: BRAND.fonts.display,
          fontWeight: 800,
          fontSize,
          letterSpacing: BRAND.type.displayTracking,
          lineHeight: 1.02,
          color: BRAND.colors.text,
        }}
      />
      <div
        style={{
          height: 10,
          width: '38%',
          marginTop: 28,
          borderRadius: 5,
          backgroundColor: BRAND.colors.accent,
          transform: `scaleX(${underline})`,
          transformOrigin: 'left',
        }}
      />
    </div>
  );
};
