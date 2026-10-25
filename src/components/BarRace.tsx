import {useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../lib/brand';
import {EASE, prog} from '../lib/easing';

export type BarSeries = {label: string; values: number[]};

// Bar chart race: values move between snapshots with EASE.move and bars
// re-rank by sliding to their new row. One accent colour for the leader.
// Each snapshot is held for `stepSec`; the last one stays.
export const BarRace: React.FC<{
  series: BarSeries[];
  /** Label per snapshot, e.g. years. */
  steps: string[];
  stepSec?: number;
  /** Fraction of each step spent moving (the rest is a reading hold). */
  moveFraction?: number;
  rowHeight?: number;
  width?: number;
  /** Shown under the chart. Use "Example data" for illustrative numbers. */
  note?: string;
  format?: (v: number) => string;
}> = ({series, steps, stepSec = 1, moveFraction = 0.6, rowHeight = 92, width = 1400, note, format = (v) => Math.round(v).toLocaleString('en-US')}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const last = steps.length - 1;
  const t = frame / fps / stepSec;
  const i = Math.min(last, Math.floor(t));
  const j = Math.min(last, i + 1);
  const f = i === last ? 0 : prog(t - i, 0, moveFraction, EASE.move);

  const now = series.map((s) => ({label: s.label, value: s.values[i] + (s.values[j] - s.values[i]) * f}));
  const rankAt = (k: number) => {
    const order = [...series].sort((a, b) => b.values[k] - a.values[k]).map((s) => s.label);
    return (label: string) => order.indexOf(label);
  };
  const ri = rankAt(i);
  const rj = rankAt(j);
  const max = Math.max(...now.map((s) => s.value));
  const leader = [...now].sort((a, b) => b.value - a.value)[0].label;
  const labelW = 260;
  const barW = width - labelW - 220;

  return (
    <div style={{width}}>
      <div style={{position: 'relative', height: rowHeight * series.length}}>
        {now.map((s) => {
          const y = (ri(s.label) + (rj(s.label) - ri(s.label)) * f) * rowHeight;
          const isLeader = s.label === leader;
          return (
            <div key={s.label} style={{position: 'absolute', top: y, left: 0, right: 0, height: rowHeight * 0.78, display: 'flex', alignItems: 'center'}}>
              <div style={{width: labelW, fontFamily: BRAND.fonts.body, fontWeight: 600, fontSize: BRAND.type.bodyPx, color: BRAND.colors.text}}>{s.label}</div>
              <div
                style={{
                  height: '100%',
                  width: (s.value / max) * barW,
                  borderRadius: 8,
                  backgroundColor: isLeader ? BRAND.colors.accent : BRAND.colors.surface,
                  border: isLeader ? undefined : `2px solid ${BRAND.colors.line}`,
                }}
              />
              <div style={{marginLeft: 20, fontFamily: BRAND.fonts.mono, fontVariantNumeric: 'tabular-nums', fontSize: BRAND.type.bodyPx * 0.8, color: BRAND.colors.muted}}>
                {format(s.value)}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 24}}>
        <div style={{fontFamily: BRAND.fonts.mono, fontSize: BRAND.type.labelPx, letterSpacing: BRAND.type.labelTracking, textTransform: 'uppercase', color: BRAND.colors.muted}}>{note}</div>
        <div style={{fontFamily: BRAND.fonts.mono, fontSize: BRAND.type.titlePx, color: BRAND.colors.text, fontVariantNumeric: 'tabular-nums'}}>{steps[f > 0.5 ? j : i]}</div>
      </div>
    </div>
  );
};
