/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import useHookstateGetters from '../../../interfaces/Hookstate_Interface';
import { scoreDisplay } from '../../../utils/cdn-links/motionGraphics';

export default function PoppedScore() {
  const {
    getPoppedBubbleCount,
    getCurrentStreak
  } = useHookstateGetters();
  const popped = getPoppedBubbleCount();
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
    <div className="player-score">
      <video loop autoPlay muted className={`${streaking ? 'streaking-fire' : 'hide'}`}>
        <source src={scoreDisplay['fire']} type="video/webm"/>
      </video>
      <span className={streaking ? 'streak-effect score-popped' : 'score-popped'}>
        {popped}
      </span>
    </div>
  )
}