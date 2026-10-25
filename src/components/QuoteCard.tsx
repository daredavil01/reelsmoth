import {useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../lib/brand';
import {prog} from '../lib/easing';
import {MaskReveal} from './MaskReveal';

// Quote card for essays and Substack posts: serif display, one accent word,
// attribution set in mono after the quote has landed. Quote text is exact
// copy: typeset it here, never in generated pixels.
export const QuoteCard: React.FC<{
  quote: string;
  accentWord?: string;
  attribution: string;
  preroll?: number;
  fontSize?: number;
}> = ({quote, accentWord, attribution, preroll = 0, fontSize = BRAND.type.titlePx * 1.15}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = quote.split(' ').length;
  const quoteDone = preroll > 0 ? 0 : (words * 0.06 + 0.6) * fps;
  const mark = prog(frame, 0, 0.6 * fps);
  const attr = prog(frame, quoteDone, quoteDone + 0.6 * fps);
  return (
    <div style={{maxWidth: 1400, position: 'relative'}}>
      <div
        style={{
          position: 'absolute',
          left: -20,
          top: -fontSize * 1.3,
          fontFamily: BRAND.fonts.serif,
          fontSize: fontSize * 3,
          lineHeight: 1,
          color: BRAND.colors.accent,
          opacity: 0.3 + 0.7 * mark,
          transform: `translateY(${(1 - mark) * 30}px)`,
        }}
      >
        “
      </div>
      <MaskReveal
        text={quote}
        accentWords={accentWord ? [accentWord] : []}
        accentColor={BRAND.colors.accent}
        stagger={0.06}
        preroll={preroll}
        style={{fontFamily: BRAND.fonts.serif, fontSize, lineHeight: 1.15, color: BRAND.colors.text}}
      />
      <div
        style={{
          marginTop: 48,
          fontFamily: BRAND.fonts.mono,
          fontSize: BRAND.type.labelPx,
          letterSpacing: BRAND.type.labelTracking,
          textTransform: 'uppercase',
          color: BRAND.colors.muted,
          opacity: attr,
          transform: `translateX(${(1 - attr) * -20}px)`,
        }}
      >
        — {attribution}
      </div>
    </div>
  );
};
