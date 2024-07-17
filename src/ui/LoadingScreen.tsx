import { useEffect, useState } from 'react';
import { useSceneState } from '../ecs/store/SceneState';

import '../css/LoadingScreen.css';
import SectionTitle from '../components/SectionTitle';

let unmountComponent = false;

export default function LoadingScreen() {
  const sceneState = useSceneState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sceneState.environmentLoaded.get({ noproxy: true })) {
      setIsLoading(false);
      setTimeout(() => {
        console.log('Closing Loading Screen...');
        unmountComponent = true;
      }, 1000);
    }
  }, [sceneState.environmentLoaded]);

  if (unmountComponent) return null;

  return (
    <div id="loading-screen" className={!isLoading ? 'fade-out' : ''}>
      <div className="fullscreen-image">
        <img src="/EnviormentImages/OutdoorEnviorment/Loading.png" alt="Full Screen Background" />
      </div>
      <div className="bottom-video">
        <video autoPlay loop muted>
          <source src="/LoadingScreen.webm" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="overlay">
          <SectionTitle
            title="Choose your"
            subtitle="Environment"
            useDefaultStyle={false}
            className="section-title"
          />
          <div className="loading-info">
            <p className="loading-text">Loading...</p>
            <img className="logo" src="/UVX-Logo.png" alt="UVX Logo" />
          </div>
        </div>
      </div>
    </div>
  );
}
