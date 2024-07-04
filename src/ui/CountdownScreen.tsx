import { useEffect, useRef } from 'react';
import { useSceneState } from '../ecs/store/SceneState';

import '../css/CountdownScreen.css';

export default function CountdownScreen() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sceneState = useSceneState();

  useEffect(() => {
    const videoElement = videoRef.current;
    videoElement!.play();

    const timer = setTimeout(() => {
      sceneState.gameRunning.set(true);
    }, 4500); // the video duration

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (sceneState.gameRunning.get({ noproxy: true })) return null;

  return (
    <div className="countdown-container">
      <video ref={videoRef} muted>
        <source src="https://res.cloudinary.com/dnr41r1lq/video/upload/v1720041653/placeholderCountdown_kj3fox.mp4" type="video/mp4" />
      </video>
    </div>
  );
}