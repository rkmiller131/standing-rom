import { useEffect, useState } from 'react';
import { useSceneState } from '../../hookstate-store/SceneState';
import useHookstateGetters from '../../interfaces/Hookstate_Interface';

import '../../css/LoadingScreen.css';

let unmountComponent = false;

export default function LoadingScreen() {
  const sceneState = useSceneState();
  const { environmentLoaded } = useHookstateGetters();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (environmentLoaded()) {
      setIsLoading(false);
      setTimeout(() => {
        console.log('Closing Loading Screen...');
        unmountComponent = true;
      }, 1000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneState.environmentLoaded]);

  if (unmountComponent) return null;

  return (
    <div id="loading-screen" className={!isLoading ? 'fade-out' : ''}>
      <div className="loading-spinner">
        Loading
        <span className="loading-text"></span>
      </div>
    </div>
  );
}
