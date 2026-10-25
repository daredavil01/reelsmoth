import {AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Grain} from '../components/Grain';
import {MaskReveal} from '../components/MaskReveal';
import {SafeArea} from '../components/SafeArea';
import {BRAND} from '../lib/brand';
import {EASE} from '../lib/easing';
import {beatFrames, validateTimeline, type Timeline} from '../lib/timeline';
import timelineJson from './hello.timeline.json';

export const helloTimeline = validateTimeline(timelineJson as Timeline);

const COPY = {
  kicker: 'REELSMITH',
  headline: 'Content in, video out.',
  cta: 'Rendered once. Exported everywhere.',
} as const;

const Kicker: React.FC = () => (
  <div
    style={{
      fontFamily: BRAND.fonts.mono,
      fontSize: 28,
      letterSpacing: '0.3em',
      color: BRAND.colors.accent,
      marginBottom: 36,
    }}
  >
    {COPY.kicker}
  </div>
);

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = interpolate(frame, [0, 0.6 * fps], [0, 1], {
    easing: EASE.enter,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        fontFamily: BRAND.fonts.body,
        fontSize: BRAND.type.bodyPx,
        color: BRAND.colors.muted,
        marginTop: 40,
        opacity: p,
        transform: `translateY(${(1 - p) * 24}px)`,
      }}
    >
      {COPY.cta}
    </div>
  );
};

export const Hello: React.FC = () => {
  const hook = beatFrames(helloTimeline, 'hook');
  const cta = beatFrames(helloTimeline, 'cta');
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{justifyContent: 'center', padding: 160}}>
        {/* Kicker is on screen from frame 0, so the thumbnail is never empty. */}
        <Kicker />
        <Sequence from={hook.from} layout="none">
          <MaskReveal
            text={COPY.headline}
            accentWords={['video']}
            preroll={0.9}
            accentColor={BRAND.colors.accent}
            style={{
              fontFamily: BRAND.fonts.display,
              fontWeight: 700,
              fontSize: BRAND.type.displayPx,
              letterSpacing: BRAND.type.displayTracking,
              lineHeight: 1.05,
              color: BRAND.colors.text,
            }}
          />
        </Sequence>
        <Sequence from={cta.from} layout="none">
          <Cta />
        </Sequence>
      </AbsoluteFill>
      <Grain />
      <SafeArea />
    </AbsoluteFill>
  );
};
