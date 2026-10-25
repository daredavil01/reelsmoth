import {Composition, Folder} from 'remotion';
import {Demo, demoTimeline} from './compositions/Demo';
import {Hello, helloTimeline} from './compositions/Hello';
import {totalFrames, type Timeline} from './lib/timeline';

const fromTimeline = (t: Timeline) => ({
  durationInFrames: totalFrames(t),
  fps: t.fps,
  width: t.width,
  height: t.height,
});

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="smoke">
      <Composition id="Hello" component={Hello} {...fromTimeline(helloTimeline)} />
      <Composition id="Demo" component={Demo} {...fromTimeline(demoTimeline)} />
    </Folder>
  </>
);
