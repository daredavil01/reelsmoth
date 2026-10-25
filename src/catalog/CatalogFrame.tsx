import {AbsoluteFill} from 'remotion';
import {Background} from '../components/Background';
import {Grain} from '../components/Grain';
import {BRAND} from '../lib/brand';

// Shared frame for catalog previews: house background and grain, plus the
// entry id top-left so frame 0 always carries content and the GIF names itself.
export const CatalogFrame: React.FC<{
  id: string;
  children: React.ReactNode;
  center?: boolean;
  background?: boolean;
}> = ({id, children, center = true, background = true}) => (
  <AbsoluteFill>
    {background ? <Background /> : null}
    <AbsoluteFill style={center ? {justifyContent: 'center', alignItems: 'center'} : undefined}>{children}</AbsoluteFill>
    <div
      style={{
        position: 'absolute',
        top: 72,
        left: 80,
        fontFamily: BRAND.fonts.mono,
        fontSize: BRAND.type.labelPx,
        letterSpacing: BRAND.type.labelTracking,
        textTransform: 'uppercase',
        color: BRAND.colors.muted,
      }}
    >
      {id}
    </div>
    <Grain />
  </AbsoluteFill>
);
