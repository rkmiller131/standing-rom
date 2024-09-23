import { useEffect, useRef } from 'react';
import useHookstateGetters from '../../interfaces/Hookstate_Interface';
import { countdownScreen } from '../../utils/cdn-links/motionGraphics';
import { announcer } from '../../utils/cdn-links/sounds';

import '../../css/CountdownScreen.css';

export default function CountdownScreen() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { gameRunning, getAnnouncer, setGameRunning } = useHookstateGetters();

  const audio = new Audio(announcer['countdown']);
  audio.volume = 0.75;

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.play();

      if (getAnnouncer()) {
        audio.play();
      }
    }

    const timer = setTimeout(() => {
      setGameRunning(true);
    }, 3700); // the video duration

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gameRunning()) return null;

  return (
    <div className="countdown-container">
      <video ref={videoRef}>
        <source src={countdownScreen} type="video/webm" />
      </video>
    </div>
  );
}
