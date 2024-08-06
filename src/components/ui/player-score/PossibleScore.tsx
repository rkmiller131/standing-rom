/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import useHookstateGetters from '../../../interfaces/Hookstate_Interface';
import { baseBGAnimation } from '../../../utils/cdn-links/motionGraphics';

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
        <source src={baseBGAnimation} type="video/mp4"/>
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