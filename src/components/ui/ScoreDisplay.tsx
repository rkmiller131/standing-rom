import { useEffect, useState } from 'react';
import UbiquitySVG from '../../assets/ubiquity.svg';
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

  return (
    <div className="score-ui-container">
      <img src={UbiquitySVG} alt="Ubiquity Logo" className="uvx-logo" />
      <div className="score-tracker">
        <div className="placeholder-bubble-effect" />
        <span className={streaking ? 'streak-effect score-popped' : 'score-popped'}>{popped}</span> /
        <span className="score-possible">{total} Bubbles Popped</span>
      </div>
    </div>
  );
}