/* eslint-disable react-hooks/exhaustive-deps */
import {
  Suspense,
  lazy,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { VRM } from '@pixiv/three-vrm';
import { useSceneState } from './hookstate-store/SceneState';
import useHookstateGetters from './interfaces/Hookstate_Interface';
import checkUserDevice from './utils/general/checkUserDevice';
import Mocap from './components/Mocap';
import Avatar from './components/Avatar';
import CameraAnimations from './components/CameraAnimations';
import { Physics } from '@react-three/cannon';
import GameLogic from './ecs/systems/GameLogic';
import SetupScreen from './components/ui/environment-selection/SetupScreen';
import LoadingScreen from './components/ui/LoadingScreen';
import CountdownScreen from './components/ui/CountdownScreen';
import ScoreDisplay from './components/ui/ScoreDisplay';
import ResultsScreen from './components/ui/ResultsScreen';
import Environment from './components/environment/Environment';

import './css/App.css';
import AvatarHandColliders from './components/physics/AvatarHandColliders';
import { Bubbles } from './ecs/entities/Bubbles';

const Renderer = lazy(() => import('./canvas/Renderer'));

export default function App() {
  const sceneState = useSceneState();
  const {
    environmentLoaded,
    environmentSelected,
    sceneLoaded,
    gameOver
  } = useHookstateGetters();
  sceneState.device.set(checkUserDevice());

  const [holisticLoaded, setHolisticLoaded] = useState(false);
  const avatar = useRef<VRM | null>(null);

  const setAvatarModel = (vrm: VRM) => {
    avatar.current = vrm;
  };

  useLayoutEffect(() => {
    if (
      avatar.current &&
      holisticLoaded &&
      environmentLoaded()
    ) {
      const transitionDelay = setTimeout(() => {
        sceneState.sceneLoaded.set(true);
      }, 2000) // delay to see avatar in calibration before camera spins around and countdown starts.

      return () => clearTimeout(transitionDelay)
    }
  }, [holisticLoaded, sceneState.environmentLoaded]);

  return (
    <>
      { !environmentSelected() && <SetupScreen /> }
      { environmentLoaded() &&
        <Mocap avatar={avatar} setHolisticLoaded={setHolisticLoaded} />
      }
      <LoadingScreen />
      { sceneLoaded() && <CountdownScreen /> }
      <ScoreDisplay />
      { gameOver() && <ResultsScreen /> }

      <Suspense fallback={null}>
        <Renderer>
          { environmentSelected() && <Environment /> }
          <Avatar setAvatarModel={setAvatarModel} avatar={avatar} />
          <CameraAnimations />

          { sceneLoaded() && (
            <>
              <Physics gravity={[0, 0, 0]}>
                <AvatarHandColliders avatar={avatar} />
                <Bubbles />
              </Physics>
              {!gameOver() && <GameLogic avatar={avatar} />}
            </>
          )}
        </Renderer>
      </Suspense>
    </>
  );
}
