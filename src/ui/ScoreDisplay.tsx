import { useEffect, useState } from 'react';
import { useGameState } from '../ecs/store/GameState';
import UbiquitySVG from '../assets/ubiquity.svg';

import '../css/ScoreDisplay.css';

export default function ScoreDisplay() {
  const gameState = useGameState();
  const [streaking, setStreaking] = useState(false);
  const popped = gameState.score.popped.get({ noproxy: true });
  const total = gameState.score.totalBubbles.get({noproxy: true});
  const currentStreak = gameState.score.currentStreak.get({ noproxy: true });

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