import { useState, useCallback, useRef } from 'react';
import { EnvironmentSelectionType } from '../../../hookstate-store/Types';
import { useSceneState } from '../../../hookstate-store/SceneState';
import EnvironmentCard from './EnvironmentCard';

import '../../../css/SetupScreen.css';

const environments = [
  {
    id: 1,
    name: 'Outdoors',
    imgSrc: 'https://cdn.glitch.global/c4f540ac-7f7c-41b2-ae89-9e2617351aa6/outdoorEnvCard.png?v=1722462345138'
  },
  {
    id: 2,
    name: 'Indoor Office',
    imgSrc: 'https://cdn.glitch.global/c4f540ac-7f7c-41b2-ae89-9e2617351aa6/indoorEnvCard.png?v=1722462389853'
  }
]

export default function SetupScreen() {
  const sceneState = useSceneState();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelection = useCallback(
    (environment: EnvironmentSelectionType) => {
      sceneState.selectedEnvironment.set(environment);
      setSubmitted(true);
    },
    [sceneState],
  );

  if (submitted) return null;

  return (
    <div id="setup">
      <video ref={videoRef} className="setup-screen-bg-video" autoPlay loop muted>
        <source src="https://cdn.glitch.global/c4f540ac-7f7c-41b2-ae89-9e2617351aa6/BackgroundVid.mp4?v=1722457154866" type="video/mp4"/>
      </video>
      <div className="select-environment-title">
        <h3>Choose Your</h3>
        <h2>Environment</h2>
      </div>
      <div id="environment-cards-container">
        {environments.map((env) =>
          <EnvironmentCard
            name={env.name}
            imgSrc={env.imgSrc}
            handleSelection={handleSelection}
            key={env.id}
          />
        )}
      </div>
    </div>
  );
}
