import {Html5Audio, interpolate, Sequence, staticFile, useVideoConfig} from 'remotion';
import {CLAMP, EASE} from '../lib/easing';
import {beat, heroBeat, type SfxCue, type Timeline} from '../lib/timeline';

// All sound for a video, placed from timeline.audio: the music starts so its
// drop lands on the hero beat (or dropOn), and every SFX cue starts so its
// measured peak lands on its beat. Retime a beat and the sound follows.
export const Soundtrack: React.FC<{timeline: Timeline}> = ({timeline: t}) => {
  const {durationInFrames} = useVideoConfig();
  const music = t.audio?.music;
  const sfx = t.audio?.sfx ?? [];
  return (
    <>
      {music ? <Music timeline={t} durationInFrames={durationInFrames} /> : null}
      {sfx.map((c, i) => (
        <SfxSequence key={`${c.beat}-${i}`} timeline={t} cue={c} />
      ))}
    </>
  );
};

const Music: React.FC<{timeline: Timeline; durationInFrames: number}> = ({timeline: t, durationInFrames}) => {
  const m = t.audio!.music!;
  const target = m.dropOn ? beat(t, m.dropOn) : heroBeat(t)!;
  const startFrame = Math.round((target.start - m.dropAt) * t.fps);
  const from = Math.max(0, startFrame);
  const trimBefore = Math.max(0, -startFrame);
  const base = m.volume ?? 0.7;
  const fadeIn = (m.fadeIn ?? 0.3) * t.fps;
  const fadeOut = (m.fadeOut ?? 1) * t.fps;
  const ducks = (m.duck ?? []).map((d) => ({b: beat(t, d.beat), amount: d.amount ?? 0.65}));

  const volume = (f: number) => {
    const frame = f + from; // video frame
    let v = base * interpolate(frame, [from, from + fadeIn], [0, 1], CLAMP);
    v *= interpolate(frame, [durationInFrames - fadeOut, durationInFrames], [1, 0], CLAMP);
    for (const {b, amount} of ducks) {
      const s = b.start * t.fps;
      const e = (b.start + b.duration) * t.fps;
      const down = interpolate(frame, [s - 0.15 * t.fps, s], [0, 1], {easing: EASE.move, ...CLAMP});
      const up = interpolate(frame, [e, e + 0.6 * t.fps], [1, 0], {easing: EASE.move, ...CLAMP});
      v *= 1 - amount * Math.min(down, up);
    }
    return v;
  };
  return (
    <Sequence from={from} layout="none" name="music">
      <Html5Audio src={staticFile(m.src)} trimBefore={trimBefore} volume={volume} />
    </Sequence>
  );
};

const SfxSequence: React.FC<{timeline: Timeline; cue: SfxCue}> = ({timeline: t, cue}) => {
  const b = beat(t, cue.beat);
  const anchor = cue.anchor === 'end' ? b.start + b.duration : b.start;
  const startFrame = Math.round((anchor + (cue.offset ?? 0) - (cue.peak ?? 0)) * t.fps);
  return (
    <Sequence from={Math.max(0, startFrame)} layout="none" name={`sfx ${cue.beat}`}>
      <Html5Audio src={staticFile(cue.src)} trimBefore={Math.max(0, -startFrame)} volume={cue.gain ?? 0.2} />
    </Sequence>
  );
};
