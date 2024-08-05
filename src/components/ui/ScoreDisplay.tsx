import { useEffect, useRef, useState } from 'react';
import useHookstateGetters from '../../interfaces/Hookstate_Interface';
import { useGameState } from '../../hookstate-store/GameState';
import Stats from 'stats.js'; // Import stats.js

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
  const [streaking, setStreaking] = useState(false);
  const [idleVisibility, setIdleVisibility] = useState(true);
  const [stats] = useState(() => new Stats()); // Initialize stats.js

  const popped = getPoppedBubbleCount();
  const total = getTotalBubbleCount();
  const currentStreak = getCurrentStreak();

  useEffect(() => {
    if (currentStreak >= 5) {
      setStreaking(true);
    } else {
      setStreaking(false);
    }
  }, [currentStreak]);

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
  }, [popped]);

  useEffect(() => {
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    const animate = () => {
      stats.begin();

      stats.end();
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      document.body.removeChild(stats.dom);
    };
  }, [stats]);

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
