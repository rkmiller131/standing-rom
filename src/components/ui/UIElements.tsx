import { lazy, Suspense } from 'react';
import useHookstateGetters from '../../interfaces/Hookstate_Interface';
import SetupScreen from './environment-selection/SetupScreen';
import LoadingScreen from './LoadingScreen';
import ResultsScreen from './ResultsScreen';
import UVXBrandWatermark from './UVXBrandWatermark';

const SlidingInfo = lazy(() => import('./SlidingInfo'));
const CountdownScreen = lazy(() => import('./CountdownScreen'));
const ScoreDisplay = lazy(() => import('./player-score/ScoreDisplay'));

export default function UIElements() {
  const { environmentLoaded, environmentSelected, sceneLoaded, gameOver } =
    useHookstateGetters();
  return (
    <>
      <SetupScreen />
      <UVXBrandWatermark />
      {environmentSelected() && <LoadingScreen />}
      {gameOver() && <ResultsScreen />}
      <Suspense fallback={null}>
        {environmentLoaded() && <SlidingInfo />}
        {sceneLoaded() && <CountdownScreen />}
        <ScoreDisplay />
      </Suspense>
    </>
  );
}
