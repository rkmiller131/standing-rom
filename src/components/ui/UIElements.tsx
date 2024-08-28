import { lazy, Suspense, useState } from 'react';
import { VRM } from '@pixiv/three-vrm';
import useHookstateGetters from '../../interfaces/Hookstate_Interface';
import SetupScreen from './environment-selection/SetupScreen';
import LoadingScreen from './LoadingScreen';
import ResultsScreen from './results/ResultsScreen';
import UVXBrandWatermark from './UVXBrandWatermark';
import ViewControls from './ViewControls';
import CountdownScreen from './CountdownScreen';
import SlidingInfo from './SlidingInfo';
import GameInstructions from './how-to-play/GameInstructions';

const ScoreDisplay = lazy(() => import('./player-score/ScoreDisplay'));
const LiveSocials = lazy(() => import('./socials/LiveSocials'));

interface UIProps {
  avatar: React.RefObject<VRM>;
}

export default function UIElements({ avatar }: UIProps) {
  const {
    environmentLoaded,
    environmentSelected,
    sceneLoaded,
    gameOver
  } = useHookstateGetters();
  const [consentGiven, setConsentGiven] = useState(false);

  const clientGrantsConsent = () => {
    setConsentGiven(true)
  }
  return (
    <>
      { !consentGiven ?
        <GameInstructions clickHandler={clientGrantsConsent}/> :
        <SetupScreen />
      }
      <UVXBrandWatermark />
      {environmentSelected() && <LoadingScreen />}
      {gameOver() && <ResultsScreen />}
      {environmentLoaded() && <SlidingInfo />}
      <Suspense fallback={null}>
        {environmentLoaded() && (
          <>
            <LiveSocials />
            <ViewControls avatar={avatar} />
          </>
        )}
        {sceneLoaded() && <CountdownScreen />}
        <ScoreDisplay />
      </Suspense>
    </>
  );
}
