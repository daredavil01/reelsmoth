import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../lib/brand';
import {EASE} from '../lib/easing';

// Odometer-style count-up. Each digit is a 0-9 strip in a clipped window:
// the last digit spins continuously, higher digits roll over only as the
// digit below passes 9, so the value always lands exactly on `to`.
// Tabular mono digits keep the width still while it counts.
export const RollingNumber: React.FC<{
  to: number;
  from?: number;
  /** Seconds the count takes, from local frame 0. */
  duration?: number;
  /** Seconds of the count already elapsed at local frame 0 (for frame-0 shots). */
  preroll?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Thousands separator; '' for none. */
  separator?: string;
  style?: React.CSSProperties;
}> = ({to, from = 0, duration = 1.6, preroll = 0, decimals = 0, prefix = '', suffix = '', separator = ',', style}) => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame() + preroll * fps;
  if (to < 0 || from < 0) throw new Error('RollingNumber: negative values are not supported');

  const value = interpolate(frame, [0, duration * fps], [from, to], {
    easing: EASE.enter,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Work in integer units of the last decimal place.
  const unit = 10 ** decimals;
  // Round off float noise so the final frame lands exactly on `to`.
  const n = Math.round(value * unit * 1e6) / 1e6;
  const slots = Math.max(String(Math.round(Math.max(to, from) * unit)).length, decimals + 1);

  const digits: React.ReactNode[] = [];
  for (let k = slots - 1; k >= 0; k--) {
    const place = 10 ** k;
    let pos: number;
    if (k === 0) {
      pos = n;
    } else {
      // Roll over during the last tenth of the digit below.
      const rem = (n % place) / place;
      pos = Math.floor(n / place) + Math.max(0, (rem - 0.9) * 10);
    }
    const leading = k >= decimals + 1 && n < place;
    const leadOpacity = leading ? interpolate(n, [place * 0.9, place], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
    digits.push(<Digit key={`d${k}`} pos={pos} opacity={leadOpacity} />);
    if (k === decimals && decimals > 0) digits.push(<span key="dot">.</span>);
    const intK = k - decimals;
    if (separator && intK > 0 && intK % 3 === 0) {
      digits.push(
        <span key={`s${k}`} style={{opacity: leadOpacity}}>
          {separator}
        </span>,
      );
    }
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontFamily: BRAND.fonts.mono,
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1,
        ...style,
      }}
    >
      {prefix ? <span>{prefix}</span> : null}
      {digits}
      {suffix ? <span>{suffix}</span> : null}
    </div>
  );
};

const Digit: React.FC<{pos: number; opacity: number}> = ({pos, opacity}) => {
  const d = ((pos % 10) + 10) % 10;
  return (
    <span style={{display: 'inline-block', height: '1em', overflow: 'hidden', opacity, position: 'relative'}}>
      {/* Strip 0..9 then 0 again, so 9 -> 0 rolls instead of jumping back. */}
      <span style={{display: 'flex', flexDirection: 'column', transform: `translateY(${-d}em)`}}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((x, i) => (
          <span key={i} style={{height: '1em', lineHeight: 1}}>
            {x}
          </span>
        ))}
      </span>
    </span>
  );
};
