import { lazy, Suspense, useState } from 'react';
import { VRM } from '@pixiv/three-vrm';
import useHookstateGetters from '../../interfaces/Hookstate_Interface';
import LoadingScreen from './LoadingScreen';
import ResultsScreen from './results/ResultsScreen';
import CountdownScreen from './CountdownScreen';
import SlidingInfo from './SlidingInfo';
import GameInstructions from './how-to-play/GameInstructions';
import RoomCode from './RoomCode';
import GameSetupScreen from './game-setup/GameSetupScreen';

const GameplayUI = lazy(() => import('./gameplay-ui/GameplayUI'));

interface UIProps {
  avatar: React.RefObject<VRM>;
}

export default function UIElements({ avatar }: UIProps) {
  const { environmentLoaded, environmentSelected, sceneLoaded, gameOver } =
    useHookstateGetters();
  const [codeSuccess, setCodeSuccess] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  // future optimizations: put these fn inside a useCallback
  const submitCode = (code: number) => {
    // be sure to add some validation logic here if necessary when backend is established
    // add a new helper function to utils > http and verify against database
    console.log('Code submitted: ', code);
    setCodeSuccess(true);
  };

  const clientGrantsConsent = () => {
    setConsentGiven(true);
  };

  return (
    <>
      {!codeSuccess && (
        <>
          <RoomCode submitCode={submitCode} />
        </>
      )}
      {codeSuccess && !consentGiven ? (
        <GameInstructions clickHandler={clientGrantsConsent} />
      ) : (
        <GameSetupScreen />
      )}
      {environmentSelected() && <LoadingScreen />}
      {gameOver() && <ResultsScreen />}
      {environmentLoaded() && <SlidingInfo />}
      <Suspense fallback={null}>
        {environmentLoaded() && <GameplayUI avatar={avatar} />}
        {sceneLoaded() && <CountdownScreen />}
      </Suspense>
    </>
  );
}
