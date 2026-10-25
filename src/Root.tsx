import {Composition, Folder} from 'remotion';
import {CATALOG_DEMOS, PREVIEW} from './catalog/demos';
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
    <Folder name="catalog">
      {CATALOG_DEMOS.map((d) => (
        <Composition
          key={d.id}
          id={`catalog-${d.id}`}
          component={d.component}
          durationInFrames={PREVIEW.fps * PREVIEW.seconds}
          fps={PREVIEW.fps}
          width={d.width ?? 1920}
          height={d.height ?? 1080}
        />
      ))}
    </Folder>
  </>
);
