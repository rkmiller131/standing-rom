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
import { getSessionInformation } from '../../utils/http/httpSessionInfo';

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

  const submitCode = useCallback(async (code: number) => {
    try {
      const results = await getSessionInformation(code);

      // no need to do this, getSessionInformation already checks if the code is a valid session
      // const checkCode = parseInt(results.code); // has to be a number to pass the check

      // if (checkCode !== code) {
      //   console.error('Invalid code or no game found');
      //   setCodeSuccess(false);
      //   return;
      // }

      if (results && results.status === 'Completed') {
        window.alert('This session has already been completed');
        setCodeSuccess(false);
      } else {
        const workouts = results.workouts;
        setRoomCode(results.code as number);

        workouts.forEach((workout: any) => {
          if (workout.name === 'Shoulder ROM, Standing') {
            setGameID(workout._id as string);
          }
        });

        setCodeSuccess(true);
      }

    } catch (error) {
      console.error('Error submitting code:', error);
    }
  }, []) as (code: number) => void;

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
