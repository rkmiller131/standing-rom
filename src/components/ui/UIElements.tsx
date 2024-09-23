import { lazy, Suspense, useCallback, useState } from 'react';
import { VRM } from '@pixiv/three-vrm';
import useHookstateGetters from '../../interfaces/Hookstate_Interface';
import LoadingScreen from './LoadingScreen';
import ResultsScreen from './results/ResultsScreen';
import CountdownScreen from './CountdownScreen';
import SlidingInfo from './SlidingInfo';
import GameInstructions from './how-to-play/GameInstructions';
import RoomCode from './RoomCode';
import GameSetupScreen from './game-setup/GameSetupScreen';
import { getSessionInformation } from '../../utils/http/httpStoreCode';

const GameplayUI = lazy(() => import('./gameplay-ui/GameplayUI'));

interface UIProps {
  avatar: React.RefObject<VRM>;
}

export default function UIElements({ avatar }: UIProps) {
  const {
    environmentLoaded,
    environmentSelected,
    sceneLoaded,
    gameOver,
    setGameID,
    setRoomCode,
  } = useHookstateGetters();
  const [codeSuccess, setCodeSuccess] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  // future optimizations: put these fn inside a useCallback
  const submitCode = useCallback(
    async (code: number) => {
      // be sure to add some validation logic here if necessary when backend is established
      // add a new helper function to utils > http and verify against database
      try {
        const results = await getSessionInformation({ code: code });

        console.log('Retrieved info: ', code, results);

        if (results.code !== code || !results || !results._id) {
          console.error('Invalid code or no game found');
          setCodeSuccess(false);
          return;
        }

        setRoomCode(results.code);
        setGameID(results._id);
        setCodeSuccess(true);
      } catch (error) {
        console.error('Error submitting code:', error);
      }
    },
    [setGameID, setRoomCode],
  ) as (code: number) => void;

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
