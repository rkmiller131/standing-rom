/* eslint-disable react-hooks/exhaustive-deps */
import { Suspense, lazy, useLayoutEffect, useRef, useState } from 'react';
import Mocap from './mocap/Mocap';
import Avatar from './avatar/Avatar';
import LoadingScreen from './ui/LoadingScreen';
import GameLogic from './ecs/systems/GameLogic';
import { useSceneState } from './ecs/store/SceneState';
import { useGameState } from './ecs/store/GameState';
import { VRM } from '../interfaces/THREE_Interface';
import checkUserDevice from './ecs/helpers/checkUserDevice';
import SetupScreen from './ui/SetupScreen';
import Environment from './environment/Environment';
import { Physics } from '../interfaces/CANNON_Interface';
import AvatarHandColliders from './DEMO/AvatarHandColliders';
import { Bubbles } from './ecs/entities/Bubbles';
import CameraAnimations from './DEMO/CameraAnimations';
import CountdownScreen from './ui/CountdownScreen';
import ScoreDisplay from './ui/ScoreDisplay';
import ResultsScreen from './ui/ResultsScreen';

import './css/App.css';

const Renderer = lazy(() => import('./renderer/Renderer'));

// LEARNING RESOURCES -------------------------------------------------------------------
// https://developers.google.com/mediapipe/solutions/vision/pose_landmarker/web_js#video
// https://github.com/google/mediapipe/blob/master/docs/solutions/holistic.md
// https://glitch.com/edit/#!/kalidokit?path=script.js%3A334%3A0
// https://codesandbox.io/s/react-three-fiber-vrm-9ryxq?file=/src/index.tsx:2398-2461
// https://github.com/pixiv/three-vrm/blob/dev/docs/migration-guide-1.0.md
// https://github.com/superdav42/kalidokit-react/blob/master/src/components/Model.jsx
// https://github.com/rechenberger/neoverse-firestarter/blob/main/src/components/3d/startGame.ts
// https://codesandbox.io/p/devbox/github/hmans/particulous/tree/main/?file=%2Fsrc%2FTestParticles.tsx
// https://codesandbox.io/p/devbox/react-three-update-demo-evk4zu?file=%2Fsrc%2Fapp.tsx%3A12%2C7
// --------------------------------------------------------------------------------------

export default function App() {
  const sceneState = useSceneState();
  const gameState = useGameState();
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
      sceneState.environmentLoaded.get({ noproxy: true })
    ) {
      const transitionDelay = setTimeout(() => {
        sceneState.sceneLoaded.set(true);
      }, 3000) // delay to see avatar in calibration before game officially starts

      return () => clearTimeout(transitionDelay)
    }
  }, [holisticLoaded, sceneState.environmentLoaded]);

  return (
    <>
      {!sceneState.selectedEnvironment.get({ noproxy: true }) && <SetupScreen />}
      {/* Once the environment has been selected from setup screen, start rendering the mocap */}
      {sceneState.environmentLoaded.get({ noproxy: true }) && (
        <Mocap avatar={avatar} setHolisticLoaded={setHolisticLoaded} />
      )}
      {/* Loading screen is always up (underneath) until scene has fully loaded */}
      <LoadingScreen />

      {sceneState.sceneLoaded.get({ noproxy: true }) && <CountdownScreen/>}
      <ScoreDisplay />

      {gameState.gameOver.get({ noproxy: true }) && <ResultsScreen />}

      {/* 3D Canvas */}
      <Suspense fallback={null}>
        <Renderer>
          {sceneState.selectedEnvironment.get({ noproxy: true }) && <Environment/>}
          <Avatar setAvatarModel={setAvatarModel} avatar={avatar} />
          <CameraAnimations />

          {sceneState.sceneLoaded.get({ noproxy: true }) && (
            <>
              <Physics gravity={[0, 0, 0]}>
                <AvatarHandColliders avatar={avatar} />
                <Bubbles />
              </Physics>
              {/* All logic, including side effects and the animation frame loop system */}
              <GameLogic avatar={avatar} />
            </>
          )}
        </Renderer>
      </Suspense>
    </>
  );
}
