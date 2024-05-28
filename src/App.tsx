import { Suspense, lazy, useLayoutEffect, useRef, useState } from 'react';
import Mocap from './mocap/Mocap';
import Avatar from './avatar/Avatar';
import UbiquitySVG from './assets/ubiquity.svg';
import LoadingScreen from './ui/LoadingScreen';
import GameLogic from './ecs/systems/GameLogic';
import { useSceneState } from './ecs/store/SceneState';
import { VRM } from '../interfaces/THREE_Interface';
import checkUserDevice from './ecs/helpers/checkUserDevice';
import GameInfo from './ui/GameInfo';
import SetupScreen from './ui/SetupScreen';
import Environment from './environment/Environment';
import { Physics } from '../interfaces/CANNON_Interface';
import Bubble from './DEMO/Bubble';
import RightHandCollider from './DEMO/rightHandCollider';

import './css/App.css';

const Renderer = lazy(() => import('./renderer/Renderer'));

// LEARNING RESOURCES -------------------------------------------------------------------
// https://developers.google.com/mediapipe/solutions/vision/pose_landmarker/web_js#video
// https://github.com/google/mediapipe/blob/master/docs/solutions/holistic.md
// https://glitch.com/edit/#!/kalidokit?path=script.js%3A334%3A0
// https://codesandbox.io/s/react-three-fiber-vrm-9ryxq?file=/src/index.tsx:2398-2461
// https://github.com/pixiv/three-vrm/blob/dev/docs/migration-guide-1.0.md
// https://github.com/superdav42/kalidokit-react/blob/master/src/components/Model.jsx
// --------------------------------------------------------------------------------------

export default function App() {
  const [holisticLoaded, setHolisticLoaded] = useState(false);
  const avatar = useRef<VRM | null>(null);
  const sceneState = useSceneState();
  sceneState.device.set(checkUserDevice());

  const setAvatarModel = (vrm: VRM) => {
    avatar.current = vrm;
  };

  useLayoutEffect(() => {
    if (
      avatar.current &&
      holisticLoaded &&
      sceneState.environmentLoaded.get({ noproxy: true })
    ) {
      sceneState.sceneLoaded.set(true);
    }
  }, [holisticLoaded, sceneState.sceneLoaded, sceneState.environmentLoaded]);

  return (
    <main id="app-container">
      {/* UI */}
      <img src={UbiquitySVG} alt="Ubiquity Logo" className="uvx-logo" />
      <SetupScreen />
      {sceneState.selectedEnvironment.get({ noproxy: true }) && (
        <Mocap avatar={avatar} setHolisticLoaded={setHolisticLoaded} />
      )}
      <LoadingScreen />

      {/* 3D Canvas */}
      <Suspense fallback={null}>
        <div className="canvas-container">
          <Renderer>
            <Environment/>
            <GameInfo />
            <Avatar setAvatarModel={setAvatarModel} avatar={avatar} />

            <Physics gravity={[0, 0, 0]}>
                <Bubble position={[0.5, 1.2, 0.3]} />
                <RightHandCollider avatar={avatar} />
            </Physics>

            <GameLogic avatar={avatar} />
          </Renderer>
        </div>
      </Suspense>
    </main>
  );
}
