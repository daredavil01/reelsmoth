import {Composition} from 'remotion';
import {Hello, helloTimeline} from './compositions/Hello';
import {totalFrames} from './lib/timeline';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Hello"
      component={Hello}
      durationInFrames={totalFrames(helloTimeline)}
      fps={helloTimeline.fps}
      width={helloTimeline.width}
      height={helloTimeline.height}
    />
  </>
);
