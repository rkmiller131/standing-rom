import { useEffect, useState } from 'react';
import { useSceneState } from '../ecs/store/SceneState';

import '../css/LoadingScreen.css';

let unmountComponent = false;

export default function LoadingScreen() {
  const sceneState = useSceneState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sceneState.sceneLoaded.get({ noproxy: true })) {
      setIsLoading(false);
      setTimeout(() => {
        console.log('Closing Loading Screen...');
        unmountComponent = true;
      }, 1000);
    }
  }, [sceneState.sceneLoaded]);

  if (unmountComponent) return null;

  return (
    <div id="loading-screen" className={!isLoading ? 'fade-out' : ''}>
      <div className="loading-spinner">
        Loading
        <span></span>
      </div>
    </div>
  );
}
