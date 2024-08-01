import { useEffect, useState } from 'react';
import { useSceneState } from '../../hookstate-store/SceneState';
import useHookstateGetters from '../../interfaces/Hookstate_Interface';

import '../../css/LoadingScreen.css';
import { EnvironmentSelectionType } from '../../hookstate-store/Types';

let unmountComponent = false;
type SplashType = {
  [key in EnvironmentSelectionType]: string
}
const splash: SplashType = {
  'Indoor Office': 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/OfficeSplash.JPG?v=1722474761627',
  'Outdoors': 'https://cdn.glitch.global/c4f540ac-7f7c-41b2-ae89-9e2617351aa6/OutdoorSplash.png?v=1722473814520',
  '': 'https://cdn.glitch.global/c4f540ac-7f7c-41b2-ae89-9e2617351aa6/loadingStill.JPG?v=1722473502361'
}

export default function LoadingScreen() {
  const sceneState = useSceneState();
  const {
    environmentLoaded,
    environmentSelected
  } = useHookstateGetters();
  const [isLoading, setIsLoading] = useState(true);
  const selection = environmentSelected();

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
    <div
      id="loading-screen"
      className={!isLoading ? 'fade-out' : ''}
      style={{ backgroundImage: `url(${splash[selection]})`}}
    >
      <div className="splash-video-overlay">
        <video autoPlay loop muted>
          <source src="https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/loadingSplashAnimation.webm?v=1722475788192" type="video/mp4"/>
        </video>
      </div>
    </div>
  );
}
