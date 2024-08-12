import { lazy, Suspense } from 'react';
import useHookstateGetters from '../../interfaces/Hookstate_Interface';
import SetupScreen from './environment-selection/SetupScreen';
import LoadingScreen from './LoadingScreen';
import ResultsScreen from './ResultsScreen';
import UVXBrandWatermark from './UVXBrandWatermark';
import ViewControls from './ViewControls';
import CountdownScreen from './CountdownScreen';

const SlidingInfo = lazy(() => import('./SlidingInfo'));
const ScoreDisplay = lazy(() => import('./player-score/ScoreDisplay'));
const LiveSocials = lazy(() => import('./socials/LiveSocials'));

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
        {environmentLoaded() && (
          <>
            <SlidingInfo />
            <LiveSocials />
            <ViewControls />
          </>
        )}
        {sceneLoaded() && <CountdownScreen />}
        <ScoreDisplay />
      </Suspense>
    </>
  );
}
