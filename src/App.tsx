/* eslint-disable react-hooks/exhaustive-deps */
import { Suspense, lazy, useLayoutEffect, useRef, useState } from 'react';
import Mocap from './mocap/Mocap';
import Avatar from './avatar/Avatar';
import LoadingScreen from './ui/LoadingScreen';
import GameLogic from './ecs/systems/GameLogic';
import { useSceneState } from './ecs/store/SceneState';
import checkUserDevice from './ecs/helpers/checkUserDevice';
import SetupScreen from './ui/SetupScreen';
import Environment from './environment/Environment';
import useHookstateGetters from './interfaces/Hookstate_Interface';

import './css/App.css';
import { VRM } from '@pixiv/three-vrm';

const Renderer = lazy(() => import('./renderer/Renderer'));

export default function App() {
  const sceneState = useSceneState();
  const { environmentLoaded, environmentSelected } = useHookstateGetters();
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
      { environmentSelected() && 
        <Mocap avatar={avatar} setHolisticLoaded={setHolisticLoaded} />
      }
      <LoadingScreen />
      {/* { sceneLoaded() && <CountdownScreen /> } */}
      {/* <ScoreDisplay /> */}
      {/* { gameOver() && <ResultsScreen /> } */}

      <Suspense fallback={null}>
        <Renderer>
          { environmentSelected() && <Environment /> }
          {/* <GameInfo /> */}
          <Avatar setAvatarModel={setAvatarModel} avatar={avatar} />
          <GameLogic avatar={avatar} />
        </Renderer>
      </Suspense>
    </>
  );
}
