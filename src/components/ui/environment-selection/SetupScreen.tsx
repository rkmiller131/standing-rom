import { useState, useCallback, useRef } from 'react';
import { EnvironmentSelectionType } from '../../../hookstate-store/Types';
import { useSceneState } from '../../../hookstate-store/SceneState';
import EnvironmentCard from './EnvironmentCard';
import TitleSubtitle from '../TitleSubtitle';
import { environments } from '../../../utils/preload';

import '../../../css/SetupScreen.css';

const selectSFX = new Audio('https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/UI_ChoiceSelect.mp3?v=1722902825876');

export default function SetupScreen() {
  const sceneState = useSceneState();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelection = useCallback(
    (environment: EnvironmentSelectionType) => {
      sceneState.selectedEnvironment.set(environment);
      setSubmitted(true);
      selectSFX.play();
    },
    [sceneState],
  );

  if (submitted) return null;

  return (
    <div id="setup">
      <video ref={videoRef} className="setup-screen-bg-video" autoPlay loop muted>
        <source src="https://cdn.glitch.global/c4f540ac-7f7c-41b2-ae89-9e2617351aa6/BackgroundVid.mp4?v=1722457154866" type="video/mp4"/>
      </video>
      <TitleSubtitle
        className='select-environment-title'
        accentTitle='Choose Your'
        mainTitle='Environment'
      />
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
