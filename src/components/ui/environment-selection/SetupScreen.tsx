import { useState, useCallback, useRef } from 'react';
import { EnvironmentSelectionType } from '../../../hookstate-store/Types';
import { useSceneState } from '../../../hookstate-store/SceneState';
import { uiInteractions } from '../../../utils/cdn-links/sounds';
import { environmentCards } from '../../../utils/cdn-links/images';
import EnvironmentCard from './EnvironmentCard';
import TitleSubtitle from '../TitleSubtitle';
import { setupBG } from '../../../utils/cdn-links/motionGraphics';

import '../../../css/SetupScreen.css';

const selectSFX = new Audio(uiInteractions['choiceSelect']);

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
        <source src={setupBG} type="video/mp4"/>
      </video>
      <TitleSubtitle
        className='callout-title'
        accentTitle='Choose Your'
        mainTitle='Environment'
      />
      <div id="environment-cards-container">
        {environmentCards.map((env) =>
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
