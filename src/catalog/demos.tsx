import {fade} from '@remotion/transitions/fade';
import {iris} from '@remotion/transitions/iris';
import {slide} from '@remotion/transitions/slide';
import {linearTiming, springTiming, TransitionSeries} from '@remotion/transitions';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {BarRace} from '../components/BarRace';
import {Captions} from '../components/Captions';
import {ChapterCard} from '../components/ChapterCard';
import {CtaEndCard} from '../components/CtaEndCard';
import {EditorialPoster} from '../components/EditorialPoster';
import {Grain} from '../components/Grain';
import {HookOpen} from '../components/HookOpen';
import {LogoOutro} from '../components/LogoOutro';
import {LoopOrbit} from '../components/LoopOrbit';
import {LowerThird} from '../components/LowerThird';
import {MapRoute} from '../components/MapRoute';
import {MaskReveal} from '../components/MaskReveal';
import {PromptType} from '../components/PromptType';
import {PushInTitle} from '../components/PushInTitle';
import {QuoteCard} from '../components/QuoteCard';
import {RollingNumber} from '../components/RollingNumber';
import {SafeArea} from '../components/SafeArea';
import {UIShowcase} from '../components/UIShowcase';
import {BRAND} from '../lib/brand';
import {captionsFromText} from '../lib/captions';
import {SPRING} from '../lib/springs';
import {CatalogFrame} from './CatalogFrame';

// One 3 s preview composition per catalog entry, registered as
// "catalog-<id>" and rendered to catalog/<category>/<id>.gif by
// scripts/catalog-previews.sh. All copy below is demo copy.

export const PREVIEW = {fps: 30, seconds: 3} as const;

const label: React.CSSProperties = {
  fontFamily: BRAND.fonts.mono,
  fontSize: BRAND.type.labelPx,
  letterSpacing: BRAND.type.labelTracking,
  textTransform: 'uppercase',
  color: BRAND.colors.muted,
};

const display: React.CSSProperties = {
  fontFamily: BRAND.fonts.display,
  fontWeight: 700,
  fontSize: BRAND.type.displayPx,
  letterSpacing: BRAND.type.displayTracking,
  lineHeight: 1.05,
  color: BRAND.colors.text,
};

const Card: React.FC<{text: string; tone: 'bg' | 'surface' | 'accent'}> = ({text, tone}) => (
  <AbsoluteFill
    style={{
      backgroundColor: BRAND.colors[tone],
      justifyContent: 'center',
      alignItems: 'center',
      ...display,
      color: tone === 'accent' ? BRAND.colors.bg : BRAND.colors.text,
    }}
  >
    {text}
  </AbsoluteFill>
);

/** Mock dashboard for the UI showcase, built from brand tokens only. */
const MockUi: React.FC = () => (
  <div style={{display: 'flex', height: '100%', backgroundColor: BRAND.colors.bg}}>
    <div style={{width: 220, backgroundColor: BRAND.colors.surface, padding: 32, display: 'flex', flexDirection: 'column', gap: 22}}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{height: 18, borderRadius: 9, width: i === 1 ? '90%' : '70%', backgroundColor: i === 1 ? BRAND.colors.accent : BRAND.colors.line}} />
      ))}
    </div>
    <div style={{flex: 1, padding: 48, display: 'flex', flexDirection: 'column', gap: 32}}>
      <div style={{...display, fontSize: BRAND.type.bodyPx}}>Dashboard</div>
      <div style={{display: 'flex', gap: 24}}>
        {['12.4k', '3.1%', '842'].map((v) => (
          <div key={v} style={{flex: 1, padding: 28, borderRadius: 18, backgroundColor: BRAND.colors.surface, fontFamily: BRAND.fonts.mono, fontSize: BRAND.type.bodyPx, color: BRAND.colors.text}}>
            {v}
          </div>
        ))}
      </div>
      <div style={{flex: 1, borderRadius: 18, backgroundColor: BRAND.colors.surface, display: 'flex', alignItems: 'flex-end', gap: 18, padding: 28}}>
        {[40, 65, 52, 80, 70, 95, 88].map((h, i) => (
          <div key={i} style={{flex: 1, height: `${h}%`, borderRadius: 8, backgroundColor: i === 5 ? BRAND.colors.accent : BRAND.colors.line}} />
        ))}
      </div>
    </div>
  </div>
);

const CaptionsDemo: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <CatalogFrame id="kinetic-captions">
      <Sequence from={0} durationInFrames={PREVIEW.seconds * fps}>
        <Captions captions={captionsFromText('Most people watch this muted, so every word lands on screen.', 0, 0.22)} anchor={0.5} />
      </Sequence>
      <SafeArea social force />
    </CatalogFrame>
  );
};

const TransitionsDemo: React.FC = () => (
  <AbsoluteFill>
    <TransitionSeries>
      {/* 30 + 32 + 32 + 42 frames minus 46 of overlap = 90 (3 s). */}
      <TransitionSeries.Sequence durationInFrames={30}>
        <Card text="fade" tone="bg" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 12})} />
      <TransitionSeries.Sequence durationInFrames={32}>
        <Card text="slide" tone="surface" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-right'})} timing={springTiming({config: SPRING.default, durationInFrames: 18})} />
      <TransitionSeries.Sequence durationInFrames={32}>
        <Card text="iris" tone="bg" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={iris({width: 1920, height: 1080})} timing={linearTiming({durationInFrames: 16})} />
      <TransitionSeries.Sequence durationInFrames={42}>
        <Card text="Example" tone="accent" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Grain />
  </AbsoluteFill>
);

export type CatalogDemo = {
  id: string;
  component: React.FC;
  width?: number;
  height?: number;
};

export const CATALOG_DEMOS: CatalogDemo[] = [
  {
    id: 'hook-cold-open',
    width: 1080,
    height: 1920,
    component: () => (
      <CatalogFrame id="hook-cold-open" center={false}>
        {/* Reels/Shorts text zone: below the top 14%, above the bottom 35%. */}
        <div style={{position: 'absolute', left: 90, right: 90, top: '18%', bottom: '35%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <HookOpen claim="9 in 10 people watch muted." accentWords={['muted']} kicker="Shorts" />
        </div>
      </CatalogFrame>
    ),
  },
  {
    id: 'masked-headline',
    component: () => (
      <CatalogFrame id="masked-headline" center={false}>
        <AbsoluteFill style={{justifyContent: 'center', padding: 160}}>
          <MaskReveal text="Words rise out of a mask." accentWords={['mask']} accentColor={BRAND.colors.accent} preroll={0.2} style={display} />
        </AbsoluteFill>
      </CatalogFrame>
    ),
  },
  {
    id: 'push-in-title',
    component: () => (
      <CatalogFrame id="push-in-title">
        <PushInTitle kicker="A field guide" title="The quiet launch" accentWord="quiet" />
      </CatalogFrame>
    ),
  },
  {
    id: 'editorial-poster',
    component: () => (
      <CatalogFrame id="editorial-poster" center={false}>
        <EditorialPoster figure="73%" kicker="Data story" lines={['of readers never', 'scroll past the', 'first screen.']} footnote="Example data" />
      </CatalogFrame>
    ),
  },
  {
    id: 'chapter-card',
    component: () => (
      <CatalogFrame id="chapter-card">
        <ChapterCard label="Chapter 02" title="The long way round" />
      </CatalogFrame>
    ),
  },
  {
    id: 'prompt-type-demo',
    component: () => (
      <CatalogFrame id="prompt-type-demo">
        <PromptType prompt="Turn this post into a 30 s Short" pretyped={4}>
          <div style={{display: 'flex', gap: 24}}>
            {['Brief', 'Stills', 'Draft'].map((t, i) => (
              <div key={t} style={{flex: 1, padding: 32, borderRadius: 20, backgroundColor: BRAND.colors.surface, ...label, color: i === 0 ? BRAND.colors.accent : BRAND.colors.text}}>
                {t}
              </div>
            ))}
          </div>
        </PromptType>
      </CatalogFrame>
    ),
  },
  {
    id: 'count-up-stat',
    component: () => (
      <CatalogFrame id="count-up-stat">
        <RollingNumber to={2480} prefix="$" duration={1.8} preroll={0.1} style={{fontSize: BRAND.type.statPx, color: BRAND.colors.accent}} />
        <div style={{...label, marginTop: 32}}>saved per month · Example data</div>
      </CatalogFrame>
    ),
  },
  {
    id: 'bar-race',
    component: () => (
      <CatalogFrame id="bar-race">
        <BarRace
          steps={['2023', '2024', '2025']}
          stepSec={1}
          note="Example data"
          series={[
            {label: 'Shorts', values: [40, 72, 120]},
            {label: 'YouTube', values: [90, 96, 104]},
            {label: 'WhatsApp', values: [55, 88, 94]},
            {label: 'Web', values: [30, 41, 60]},
          ]}
        />
      </CatalogFrame>
    ),
  },
  {
    id: 'map-route',
    component: () => (
      <CatalogFrame id="map-route">
        <MapRoute
          stops={[
            {label: 'Pune', lon: 73.86, lat: 18.52},
            {label: 'Goa', lon: 74.12, lat: 15.3},
            {label: 'Bengaluru', lon: 77.59, lat: 12.97},
          ]}
        />
      </CatalogFrame>
    ),
  },
  {
    id: 'quote-card',
    component: () => (
      <CatalogFrame id="quote-card">
        <QuoteCard quote="Hold longer and animate less." accentWord="less" attribution="House rule" />
      </CatalogFrame>
    ),
  },
  {
    id: 'ui-showcase',
    component: () => (
      <CatalogFrame id="ui-showcase">
        <UIShowcase>
          <MockUi />
        </UIShowcase>
      </CatalogFrame>
    ),
  },
  {id: 'kinetic-captions', width: 1080, height: 1920, component: CaptionsDemo},
  {
    id: 'logo-outro',
    component: () => (
      <CatalogFrame id="logo-outro">
        <LogoOutro tagline="Content in, video out" />
      </CatalogFrame>
    ),
  },
  {
    id: 'cta-end-card',
    component: () => (
      <CatalogFrame id="cta-end-card">
        <CtaEndCard line="Read the full post" url="example.com/post" />
      </CatalogFrame>
    ),
  },
  {
    id: 'loop-seam',
    component: () => (
      <CatalogFrame id="loop-seam">
        <LoopOrbit>
          <div style={{...display, fontSize: BRAND.type.titlePx}}>Loops forever</div>
        </LoopOrbit>
      </CatalogFrame>
    ),
  },
  {
    id: 'lower-third',
    component: () => (
      <CatalogFrame id="lower-third" center={false}>
        <AbsoluteFill style={{justifyContent: 'flex-end', padding: 140}}>
          <LowerThird title="Jane Example" subtitle="Source · example.com" />
        </AbsoluteFill>
      </CatalogFrame>
    ),
  },
  {
    id: 'scene-transitions',
    component: TransitionsDemo,
  },
  {
    id: 'grid-background',
    component: () => (
      <AbsoluteFill>
        <Background driftPxPerSec={24} />
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', ...label}}>grid-background</AbsoluteFill>
      </AbsoluteFill>
    ),
  },
  {
    id: 'film-grain',
    component: () => (
      <CatalogFrame id="film-grain">
        <div style={display}>Nothing dead-still.</div>
        <Grain opacity={0.2} />
      </CatalogFrame>
    ),
  },
  {
    id: 'safe-area',
    component: () => (
      <CatalogFrame id="safe-area">
        <div style={{...label, color: BRAND.colors.text}}>60 px margin · Reels zones</div>
        <SafeArea social force />
      </CatalogFrame>
    ),
  },
];
