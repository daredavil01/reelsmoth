import {useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../lib/brand';
import {EASE, prog} from '../lib/easing';
import {SPRING, springAt} from '../lib/springs';

const GRID_DEG = 1;

export type RouteStop = {label: string; lon: number; lat: number};

// Stylised route between stops: equirectangular projection onto a 1-degree graticule,
// the path draws on with EASE.move, a marker rides its head and each stop
// pops as it is reached. No map tiles, so renders are offline and exact.
// For real basemaps or 3D flyovers use the /remotion:remotion-maps skill.
export const MapRoute: React.FC<{
  stops: RouteStop[];
  /** Seconds the route takes to draw. */
  draw?: number;
  width?: number;
  height?: number;
  /** Degrees of padding around the stops. */
  padDeg?: number;
}> = ({stops, draw = 2, width = 1500, height = 760, padDeg = 1.5}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lons = stops.map((s) => s.lon);
  const lats = stops.map((s) => s.lat);
  const [minLon, maxLon] = [Math.min(...lons) - padDeg, Math.max(...lons) + padDeg];
  const [minLat, maxLat] = [Math.min(...lats) - padDeg, Math.max(...lats) + padDeg];
  // Keep degrees square so shapes don't stretch.
  const k = Math.min(width / (maxLon - minLon), height / (maxLat - minLat));
  const ox = (width - (maxLon - minLon) * k) / 2;
  const oy = (height - (maxLat - minLat) * k) / 2;
  const xy = (s: {lon: number; lat: number}) => [ox + (s.lon - minLon) * k, oy + (maxLat - s.lat) * k] as const;
  const pts = stops.map(xy);

  const segs = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  const done = prog(frame, 0.2 * fps, (0.2 + draw) * fps, EASE.move) * total;
  // Marker position along the polyline.
  let acc = 0;
  let head: readonly [number, number] = pts[0];
  const reachedAt: number[] = [0];
  for (let i = 0; i < segs.length; i++) {
    if (done >= acc) {
      const f = Math.min(1, (done - acc) / segs[i]);
      head = [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
    }
    acc += segs[i];
    reachedAt.push(acc);
  }
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const grid: React.ReactNode[] = [];
  for (let lon = Math.ceil(minLon / GRID_DEG) * GRID_DEG; lon <= maxLon; lon += GRID_DEG) {
    const [x] = xy({lon, lat: 0});
    grid.push(<line key={`lo${lon}`} x1={x} x2={x} y1={0} y2={height} />);
  }
  for (let lat = Math.ceil(minLat / GRID_DEG) * GRID_DEG; lat <= maxLat; lat += GRID_DEG) {
    const [, y] = xy({lon: 0, lat});
    grid.push(<line key={`la${lat}`} x1={0} x2={width} y1={y} y2={y} />);
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible'}}>
      <g stroke={BRAND.colors.line} strokeWidth={2}>{grid}</g>
      <path d={path} fill="none" stroke={BRAND.colors.muted} strokeWidth={4} strokeDasharray="4 14" strokeLinecap="round" opacity={0.5} />
      <path d={path} fill="none" stroke={BRAND.colors.accent} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${done} ${total + 1}`} />
      {stops.map((s, i) => {
        // A stop pops when the head reaches it (the first is on from frame 0).
        const reachSec = i === 0 ? -1 : 0.2 + draw * (reachedAt[i] / total);
        const reached = done >= reachedAt[i] - 0.5;
        const pop = i === 0 ? 1 : reached ? springAt(frame, fps, reachSec, SPRING.pop) : 0;
        const [x, y] = pts[i];
        return (
          <g key={s.label} transform={`translate(${x},${y})`}>
            <circle r={16 * pop} fill={BRAND.colors.bg} stroke={BRAND.colors.accent} strokeWidth={6} />
            <text
              y={-34}
              textAnchor="middle"
              fontFamily={BRAND.fonts.body}
              fontWeight={700}
              fontSize={BRAND.type.labelPx * 1.4}
              fill={BRAND.colors.text}
              opacity={Math.min(1, pop)}
            >
              {s.label}
            </text>
          </g>
        );
      })}
      <circle cx={head[0]} cy={head[1]} r={12} fill={BRAND.colors.accent} />
    </svg>
  );
};
