/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import useHookstateGetters from '../../../interfaces/Hookstate_Interface';
import { useGameState } from '../../../hookstate-store/GameState';

export default function PoppedScore() {
  const {
    getPoppedBubbleCount,
    getCurrentStreak
  } = useHookstateGetters();
  const gameState = useGameState();
  const popped = getPoppedBubbleCount();
  const currentStreak = getCurrentStreak();
  const [streaking, setStreaking] = useState(false);

  useEffect(() => {
    if (currentStreak >= 5) {
      setStreaking(true);
    } else {
      setStreaking(false);
    }
  }, [gameState.score.currentStreak])

  return (
    <div className="player-score">
      <video loop autoPlay muted className={`${streaking ? 'streaking-fire' : 'hide'}`}>
        <source src="https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/FireCropped.webm?v=1722715823727" type="video/webm"/>
      </video>
      <span className={streaking ? 'streak-effect score-popped' : 'score-popped'}>
          {popped}
      </span>
    </div>
  )
}