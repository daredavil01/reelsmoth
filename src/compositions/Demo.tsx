import {AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Captions} from '../components/Captions';
import {Grain} from '../components/Grain';
import {LowerThird} from '../components/LowerThird';
import {MaskReveal} from '../components/MaskReveal';
import {RollingNumber} from '../components/RollingNumber';
import {SafeArea} from '../components/SafeArea';
import {BRAND} from '../lib/brand';
import {captionsFromText} from '../lib/captions';
import {EASE} from '../lib/easing';
import {beatFrames, validateTimeline, type Timeline} from '../lib/timeline';
import timelineJson from './demo.timeline.json';

// Smoke-test composition: uses every base component once. Rendered in CI.
export const demoTimeline = validateTimeline(timelineJson as Timeline);

const COPY = {
  headline: 'Every frame is a function.',
  statLabel: 'frames rendered this month',
  exampleData: 'Example data',
  creditTitle: 'Reelsmith motion library',
  creditSub: 'Phase 2 demo',
  caption: 'Springs, easing and beats all come from one timeline.',
  outro: 'Rendered once. Exported everywhere.',
} as const;

const STAT = {to: 128400, duration: 1.8} as const;
/** Caption timing, relative to the credit beat. */
const CAPTION = {startSec: 0.2, secPerWord: 0.26} as const;

/** Fades a scene in over 0.5 s and out over the last 0.3 s of its Sequence. */
const Scene: React.FC<{children: React.ReactNode; fadeIn?: boolean}> = ({children, fadeIn = true}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const opts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
  const enter = fadeIn ? interpolate(frame, [0, 0.5 * fps], [0, 1], {easing: EASE.enter, ...opts}) : 1;
  const exit = interpolate(frame, [durationInFrames - 0.3 * fps, durationInFrames], [0, 1], {easing: EASE.exit, ...opts});
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: 160, opacity: Math.min(enter, 1 - exit)}}>
      {children}
    </AbsoluteFill>
  );
};

const display: React.CSSProperties = {
  fontFamily: BRAND.fonts.display,
  fontWeight: 700,
  fontSize: BRAND.type.displayPx,
  letterSpacing: BRAND.type.displayTracking,
  lineHeight: 1.05,
  color: BRAND.colors.text,
};

const label: React.CSSProperties = {
  fontFamily: BRAND.fonts.mono,
  fontSize: BRAND.type.labelPx,
  letterSpacing: BRAND.type.labelTracking,
  textTransform: 'uppercase',
  color: BRAND.colors.muted,
};

export const Demo: React.FC = () => {
  const captions = captionsFromText(COPY.caption, CAPTION.startSec, CAPTION.secPerWord);
  const seq = (id: string) => beatFrames(demoTimeline, id);
  return (
    <AbsoluteFill>
      <Background />
      <Sequence {...seq('hook')} layout="none">
        <Scene fadeIn={false}>
          <MaskReveal text={COPY.headline} accentWords={['function']} accentColor={BRAND.colors.accent} preroll={0.9} style={display} />
        </Scene>
      </Sequence>
      <Sequence {...seq('stat')} layout="none">
        <Scene>
          <RollingNumber to={STAT.to} duration={STAT.duration} style={{fontSize: BRAND.type.statPx, color: BRAND.colors.accent}} />
          <div style={{...label, marginTop: 32}}>{COPY.statLabel}</div>
          <div style={{...label, marginTop: 12, opacity: 0.7}}>{COPY.exampleData}</div>
        </Scene>
      </Sequence>
      <Sequence {...seq('credit')} layout="none">
        <AbsoluteFill style={{justifyContent: 'flex-end', padding: 160, paddingBottom: 200}}>
          <LowerThird title={COPY.creditTitle} subtitle={COPY.creditSub} />
        </AbsoluteFill>
        <Captions captions={captions} anchor={0.3} />
      </Sequence>
      <Sequence {...seq('outro')} layout="none">
        <Scene>
          <div style={{...display, fontSize: BRAND.type.titlePx}}>{COPY.outro}</div>
        </Scene>
      </Sequence>
      <Grain />
      <SafeArea />
    </AbsoluteFill>
  );
};
