/* eslint-disable react-hooks/exhaustive-deps */
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
  }, [gameState.score.currentStreak])

  useEffect(() => {
    const popAnimation = bubbleAnimRef.current;
    const idleAnimation = idleAnimRef.current;
    if (!popAnimation || !idleAnimation || popped === 0) return;
    setIdleVisibility(false);
    popAnimation.play();

    const handleAnimationEnd = () => {
      setIdleVisibility(true);
    }

    popAnimation.addEventListener('ended', handleAnimationEnd);

    return () => {
      if (popAnimation) popAnimation.removeEventListener('ended', handleAnimationEnd);
    };
  }, [gameState.score.popped])

  return (
    <div id="score-ui-bar">
      <div className="bubble-animations">
        <video ref={idleAnimRef} muted autoPlay loop className={`${idleVisibility ? 'animation' : 'animation hide'}`}>
          <source src="https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/BubbleIdle.webm?v=1722629899865" type="video/webm"/>
        </video>
        <video ref={bubbleAnimRef} muted className="animation popping-bubble" onCanPlay={() => bubbleAnimRef.current!.playbackRate = 5.0}>
          <source src="https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/SingleBubblePopAnim.webm?v=1722628545958" type="video/webm"/>
        </video>
      </div>
      <div className="score-ui-container">
        <div className="score-tracker">
          <div className="player-score-container">
            <span className={streaking ? 'streak-effect score-popped' : 'score-popped'}>{popped}</span>
            <span style={{color: 'white', fontSize: '1.5rem'}}>/</span>
            <span className="score-possible">{total} Bubbles Popped</span>
          </div>
        </div>
      </div>
    </div>
  );
}