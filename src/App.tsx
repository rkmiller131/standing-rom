/* eslint-disable react-hooks/exhaustive-deps */
import { Suspense, lazy, useLayoutEffect, useRef, useState } from 'react';
import { VRM } from '@pixiv/three-vrm';
import { Physics } from '@react-three/cannon';
import { Bubbles } from './ecs/entities/Bubbles';
import AvatarHandColliders from './components/physics/AvatarHandColliders';
import { useSceneState } from './hookstate-store/SceneState';
import useHookstateGetters from './interfaces/Hookstate_Interface';
import { checkUserDeviceType } from './utils/general/devices';
import Mocap from './components/Mocap';
import CameraAnimations from './components/CameraAnimations';
import GameLogic from './ecs/systems/GameLogic';
import UIElements from './components/ui/UIElements';

import './css/App.css';

const Renderer = lazy(() => import('./canvas/Renderer'));
const Environment = lazy(() => import('./components/environment/Environment'));
const Avatar = lazy(() => import('./components/Avatar'))

export default function App() {
  const {
    environmentLoaded,
    environmentSelected,
    sceneLoaded,
    gameOver,
    getSettingsReady
  } = useHookstateGetters();
  const sceneState = useSceneState();
  sceneState.device.set(checkUserDeviceType());

  const [holisticLoaded, setHolisticLoaded] = useState(false);
  const avatar = useRef<VRM | null>(null);

  const setAvatarModel = (vrm: VRM) => {
    avatar.current = vrm;
  };

  useLayoutEffect(() => {
    if (avatar.current && holisticLoaded && environmentLoaded()) {
      const transitionDelay = setTimeout(() => {
        sceneState.sceneLoaded.set(true);
      }, 2000); // delay to see avatar in calibration before camera spins around and countdown starts.

      return () => clearTimeout(transitionDelay);
    }
  }, [holisticLoaded, sceneState.environmentLoaded]);

  return (
    <>
      <UIElements avatar={avatar} />

      {environmentLoaded() && (
        <Mocap avatar={avatar} setHolisticLoaded={setHolisticLoaded} />
      )}
      <Suspense fallback={null}>
        <Renderer>
          {environmentSelected() && <Environment />}
          {getSettingsReady() && (
            <Avatar setAvatarModel={setAvatarModel} avatar={avatar} />
          )}
          <CameraAnimations />

          {sceneLoaded() && (
            <>
              <Physics gravity={[0, 0, 0]}>
                {sceneLoaded() && (
                  <>
                    <AvatarHandColliders avatar={avatar} />
                    <Bubbles />
                  </>
                )}
              </Physics>
              {!gameOver() && <GameLogic avatar={avatar} />}
            </>
          )}
        </Renderer>
      </Suspense>
    </>
  );
}
