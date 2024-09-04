import { useEffect, useState } from 'react';
import useHookstateGetters from '../../../../interfaces/Hookstate_Interface';

export default function Score () {
  const {
    getPoppedBubbleCount,
    getCurrentStreak,
    getTotalBubbleCount
  } = useHookstateGetters();
  const popped = getPoppedBubbleCount();
  const total = getTotalBubbleCount();
  const currentStreak = getCurrentStreak();
  const [streaking, setStreaking] = useState(false);

  useEffect(() => {
    if (currentStreak >= 5) {
      setStreaking(true);
    } else {
      setStreaking(false);
    }
  }, [currentStreak])

  return (
    <div className="gameplay-ui-score-container">
      <div className={`player-score ${streaking ? 'streaking-score': 'frosted-glass'}`}>
        <span className="player-score-content">{`${popped} / ${total}`}</span>
      </div>
      <div className="angle-readout">
        Second Div
      </div>
    </div>
  )
}