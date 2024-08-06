import { useEffect, useRef } from 'react';
import useHookstateGetters from '../../interfaces/Hookstate_Interface';
import { useSceneState } from '../../hookstate-store/SceneState';
import { countdownScreen } from '../../utils/cdn-links/motionGraphics';
import { announcer } from '../../utils/cdn-links/sounds';

import '../../css/CountdownScreen.css';

export default function CountdownScreen() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { gameRunning } = useHookstateGetters();
  const sceneState = useSceneState();

  useEffect(() => {
    const videoElement = videoRef.current;
    const audio = new Audio(announcer['countdown']);
    audio.volume = 0.75;
    audio.play();
    videoElement!.play();

    const timer = setTimeout(() => {
      sceneState.gameRunning.set(true);
    }, 4500); // the video duration

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (gameRunning()) return null;

  return (
    <div className="countdown-container">
      <video ref={videoRef} muted>
        <source src={countdownScreen} type="video/mp4" />
      </video>
    </div>
  );
}