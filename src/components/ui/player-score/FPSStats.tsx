import { useEffect, useRef } from 'react';
import Stats from 'stats.js';

const FPSStats = () => {
  const stats = useRef(new Stats());

  useEffect(() => {
    stats.current.showPanel(0); // 0: fps, 1: ms, 2: memory
    document.body.appendChild(stats.current.dom);
    const animate = () => {
      stats.current.begin();
      stats.current.end();
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    return () => {
      document.body.removeChild(stats.current.dom);
    };
  }, []);

  return null;
};

export default FPSStats;
