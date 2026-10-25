import {useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../lib/brand';
import {EASE, prog} from '../lib/easing';
import {SPRING, springAt, TIMING} from '../lib/springs';

// Prompt -> type -> submit -> generate, for AI and product demos.
// Typing at 0.035 s/char, caret blinks at 2.4 Hz while idle, the submit
// button snaps on a notch spring, then the result rises in.
export const PromptType: React.FC<{
  prompt: string;
  /** What appears after submit. */
  children?: React.ReactNode;
  /** Seconds before typing starts. */
  delay?: number;
  /** Seconds between the last character and the submit press. */
  pause?: number;
  /** Characters already typed at frame 0 (for a thumbnail that reads). */
  pretyped?: number;
  width?: number;
}> = ({prompt, children, delay = 0.2, pause = 0.35, pretyped = 0, width = 1200}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const typedChars = Math.min(prompt.length, pretyped + Math.max(0, Math.floor((t - delay) / TIMING.typePerChar)));
  const typingEnd = delay + (prompt.length - pretyped) * TIMING.typePerChar;
  const submitAt = typingEnd + pause;
  const typing = typedChars < prompt.length && t >= delay;
  // Solid while typing, blinking when idle.
  const caretOn = typing || Math.floor(t * TIMING.caretBlinkHz * 2) % 2 === 0;
  const press = springAt(frame, fps, submitAt, SPRING.notch);
  const pressed = t >= submitAt;
  const result = springAt(frame, fps, submitAt + 0.25, SPRING.default);
  const sent = prog(frame, submitAt * fps, (submitAt + 0.3) * fps, EASE.exit);

  return (
    <div style={{width, display: 'flex', flexDirection: 'column', gap: 40}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: '28px 28px 28px 40px',
          borderRadius: 28,
          backgroundColor: BRAND.colors.surface,
          border: `2px solid ${pressed ? BRAND.colors.accent : BRAND.colors.line}`,
        }}
      >
        <div
          style={{
            flex: 1,
            fontFamily: BRAND.fonts.mono,
            fontSize: BRAND.type.bodyPx,
            color: BRAND.colors.text,
            whiteSpace: 'pre-wrap',
            opacity: 1 - 0.5 * sent,
          }}
        >
          {prompt.slice(0, typedChars)}
          <span style={{color: BRAND.colors.accent, opacity: caretOn && !pressed ? 1 : 0}}>▍</span>
        </div>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            flexShrink: 0,
            backgroundColor: typedChars === prompt.length ? BRAND.colors.accent : BRAND.colors.line,
            transform: `scale(${pressed ? 1 - 0.15 * Math.sin(Math.PI * Math.min(1, press)) : 1})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: BRAND.colors.bg,
            fontFamily: BRAND.fonts.body,
            fontWeight: 800,
            fontSize: BRAND.type.bodyPx,
          }}
        >
          ↑
        </div>
      </div>
      {children ? (
        <div style={{opacity: result, transform: `translateY(${(1 - result) * 40}px)`}}>{children}</div>
      ) : null}
    </div>
  );
};
