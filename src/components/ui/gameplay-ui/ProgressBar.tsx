/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import useHookstateGetters from '../../../interfaces/Hookstate_Interface';

import '../../../css/ProgressBar.css';

export default function ProgressBar() {
  const { getTotalBubbleCount, getPoppedBubbleCount } = useHookstateGetters();
  const total = getTotalBubbleCount();
  const popped = getPoppedBubbleCount();
  const chunks = Array.from({ length: 10 }, (_, i) => i + 1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(Math.floor((popped / total) * 100));
  }, [popped])

  return (
    <div id="score-progress-bar" className="frosted-glass">
      <div className="colored-bar" style={{width: `${progress}%`}}/>
      {chunks.map((chunk) =>
        <div className="chunk" key={chunk}/>
      )}
    </div>
  );
}