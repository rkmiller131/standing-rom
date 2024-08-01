import { lazy, Suspense } from 'react';
import useHookstateGetters from '../../interfaces/Hookstate_Interface';
import SetupScreen from './environment-selection/SetupScreen';
import LoadingScreen from './LoadingScreen';

const SlidingInfo = lazy(() => import('./SlidingInfo'));
const CountdownScreen = lazy(() => import('./CountdownScreen'));
const ResultsScreen = lazy(() => import('./ResultsScreen'));
const ScoreDisplay = lazy(() => import('./ScoreDisplay'));

export default function UIElements() {
  const { environmentLoaded, sceneLoaded, gameOver } = useHookstateGetters();

  return (
    <>
      <SetupScreen />
      <LoadingScreen />
      <Suspense fallback={null}>
        {environmentLoaded() && <SlidingInfo />}
        {sceneLoaded() && <CountdownScreen />}
        {gameOver() && <ResultsScreen />}
        <ScoreDisplay />
      </Suspense>
    </>
  );
}
