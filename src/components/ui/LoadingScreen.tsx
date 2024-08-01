import { useEffect, useState } from 'react';
import { useSceneState } from '../../hookstate-store/SceneState';
import useHookstateGetters from '../../interfaces/Hookstate_Interface';
import TitleSubtitle from './TitleSubtitle';
import { splash } from '../../utils/preload';

import '../../css/LoadingScreen.css';

let unmountComponent = false;

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
      <div className="splash-text">
        <TitleSubtitle
          accentTitle='Loading...'
          mainTitle={selection}
        />
        <img
          className="uvx-logo loading-logo"
          alt="UVX Logo"
          src="https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/uvxLogoColor.png?v=1722519813838"
        />
      </div>
      <video autoPlay loop muted>
        <source src="https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/loadingSplashAnimation.webm?v=1722475788192" type="video/mp4"/>
      </video>
    </div>
  );
}
