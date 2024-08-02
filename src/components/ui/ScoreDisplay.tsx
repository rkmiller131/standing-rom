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
  const idleAnimRef = useRef<HTMLVideoElement | null>(null);
  // const fireAnimRef = useRef<HTMLVideoElement | null>(null);
  const [streaking, setStreaking] = useState(false);
  const [idleVisibility, setIdleVisibility] = useState(true);


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
    if (!bubbleAnimation) return;
    setIdleVisibility(false);
    bubbleAnimation.play();

    const handleAnimationEnd = () => {
      setIdleVisibility(true);
    }

    bubbleAnimation.addEventListener('ended', handleAnimationEnd);

    return () => {
      if (bubbleAnimation) bubbleAnimation.removeEventListener('ended', handleAnimationEnd);
    };
  }, [gameState.score.popped])

  return (
    <div id="score-ui-bar">
      <div className="score-ui-container">
        <video ref={idleAnimRef} muted autoPlay loop className={`${idleVisibility ? 'animation' : 'animation hide'}`}>
          <source src="https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/BubbleIdle.webm?v=1722629899865" type="video/webm"/>
        </video>
        <video ref={bubbleAnimRef} muted className="animation popping-bubble">
          <source src="https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/SingleBubblePopAnim.webm?v=1722628545958" type="video/webm"/>
        </video>
        <div className="score-tracker">
          <div className="placeholder-bubble-effect" />
          <div className="player-score-container">
            <span className={streaking ? 'streak-effect score-popped' : 'score-popped'}>{popped}</span> /
            <span className="score-possible">{total} Bubbles Popped</span>
          </div>
        </div>
      </div>
    </div>
  );
}