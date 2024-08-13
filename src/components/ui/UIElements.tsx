import { lazy, Suspense } from 'react';
import useHookstateGetters from '../../interfaces/Hookstate_Interface';
import SetupScreen from './environment-selection/SetupScreen';
import LoadingScreen from './LoadingScreen';
import ResultsScreen from './results/ResultsScreen';
import UVXBrandWatermark from './UVXBrandWatermark';
import ViewControls from './ViewControls';
import CountdownScreen from './CountdownScreen';
import { VRM } from '@pixiv/three-vrm';

const SlidingInfo = lazy(() => import('./SlidingInfo'));
const ScoreDisplay = lazy(() => import('./player-score/ScoreDisplay'));
const LiveSocials = lazy(() => import('./socials/LiveSocials'));

interface UIProps {
  avatar: React.RefObject<VRM>;
}

export default function UIElements({ avatar }: UIProps) {
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
            <ViewControls avatar={avatar} />
          </>
        )}
        {sceneLoaded() && <CountdownScreen />}
        <ScoreDisplay />
      </Suspense>
    </>
  );
}
