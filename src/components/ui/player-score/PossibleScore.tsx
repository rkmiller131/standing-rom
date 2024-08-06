/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import useHookstateGetters from '../../../interfaces/Hookstate_Interface';

export default function PossibleScore() {
  const { getTotalBubbleCount, getPoppedBubbleCount } = useHookstateGetters();
  const total = getTotalBubbleCount();
  const popped = getPoppedBubbleCount();
  const chunks = Array.from({ length: 5 }, (_, i) => i + 1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(Math.floor((popped / total) * 100));
  }, [popped])

  return (
    <div className="score-ui-container">
      <video autoPlay muted loop className="score-bg-video">
        <source src="https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/ScoreBGAnimation.mp4?v=1722725388497" type="video/mp4"/>
      </video>
      <div className="score-content">
        <div className="score-possible-container">
          <span className="score-divider">/</span>
          <span className="score-possible">{total} Bubbles Popped</span>
        </div>
        <div className="score-progress-bar">
          <div className="colored-bar" style={{width: `${progress}%`}}/>
          {chunks.map((chunk) =>
            <div className="chunk" key={chunk}/>
          )}
        </div>
      </div>
    </div>
  )
}