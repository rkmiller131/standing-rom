import { useEffect, useRef, useState } from 'react';
import useHookstateGetters from '../../interfaces/Hookstate_Interface';
import { useGameState } from '../../hookstate-store/GameState';

import '../../css/ScoreDisplay.css';

export default function ScoreDisplay() {
  const {
    getPoppedBubbleCount,
    getTotalBubbleCount,
    getCurrentStreak
  } = useHookstateGetters();
  const gameState = useGameState();
  const bubbleAnimRef = useRef<HTMLVideoElement | null>(null);
  // const fireAnimRef = useRef<HTMLVideoElement | null>(null);
  const [streaking, setStreaking] = useState(false);

  const popped = getPoppedBubbleCount();
  const total = getTotalBubbleCount();
  const currentStreak = getCurrentStreak();

  useEffect(() => {
    if (currentStreak >= 5) {
      setStreaking(true);
    } else {
      setStreaking(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.score.currentStreak])

  useEffect(() => {
    const bubbleAnimation = bubbleAnimRef.current;
    if (bubbleAnimation) bubbleAnimation.play();
  }, [gameState.score.popped])

  return (
    <div id="score-ui-bar">
      <div className="score-ui-container">
        <video ref={bubbleAnimRef} muted>
          <source src="https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/bubblesPopping.mp4?v=1722621583923" type="video/mp4"/>
        </video>
        <div className="score-tracker">
          <div className="placeholder-bubble-effect" />
          <span className={streaking ? 'streak-effect score-popped' : 'score-popped'}>{popped}</span> /
          <span className="score-possible">{total} Bubbles Popped</span>
        </div>
      </div>
    </div>
  );
}