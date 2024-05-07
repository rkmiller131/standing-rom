import { useLayoutEffect, useRef, useState, lazy, Suspense } from 'react'
import Renderer from './renderer/Renderer'
import Mocap from './mocap/Mocap'
import Avatar from './avatar/Avatar'
import UbiquitySVG from './assets/ubiquity.svg'
import Office from './environment/Office'
import LoadingScreen from './ui/LoadingScreen'
import GameLogic from './ecs/systems/GameLogic'
import { useGameState } from './ecs/store/GameState'
import { GLTF, VRM } from './THREE_Interface'
import checkUserDevice from './ecs/helpers/checkUserDevice'
import GameInfo from './ui/GameInfo'

import './css/App.css'
import { Vector3 } from 'three'

const Sky = lazy(() => import('./environment/Sky'));
const Sound = lazy(() => import('./environment/sound/Sound'));
const Lighting = lazy(() => import('./environment/Lighting'));
const DemoBubble = lazy(() => import('./DEMO/demoBubble'));

// LEARNING RESOURCES -------------------------------------------------------------------
// https://developers.google.com/mediapipe/solutions/vision/pose_landmarker/web_js#video
// https://github.com/google/mediapipe/blob/master/docs/solutions/holistic.md
// https://glitch.com/edit/#!/kalidokit?path=script.js%3A334%3A0
// https://codesandbox.io/s/react-three-fiber-vrm-9ryxq?file=/src/index.tsx:2398-2461
// https://github.com/pixiv/three-vrm/blob/dev/docs/migration-guide-1.0.md
// https://github.com/superdav42/kalidokit-react/blob/master/src/components/Model.jsx
// --------------------------------------------------------------------------------------

export default function App() {
  const avatar = useRef<VRM | null>(null);
  const environment = useRef<GLTF | null>(null);
  const [holisticLoaded, setHolisticLoaded] = useState(false);
  const gameState = useGameState();
  gameState.device.set(checkUserDevice());

  const setAvatarModel = (vrm: VRM) => {
    avatar.current = vrm;
  };

  const setEnvironmentModel = (gltf: GLTF) => {
    environment.current = gltf;
  }

  useLayoutEffect(() => {
    if (avatar.current && holisticLoaded) {
      gameState.sceneLoaded.set(true);
    }
  }, [holisticLoaded, gameState.sceneLoaded]);

  return (
    <main id="app-container">
      {/* UI */}
      <img src={UbiquitySVG} alt="Ubiquity Logo" className="uvx-logo" />
      <Mocap avatar={avatar} setHolisticLoaded={setHolisticLoaded}/>

      <LoadingScreen />
      <div className="canvas-container">

        <Renderer>
          <Suspense fallback={null}>
            <Lighting />
            <Sound />
            <Sky />
            <DemoBubble position={new Vector3(0.5,1.2,0)} avatar={avatar}/>
          </Suspense>

          <GameInfo />
          <Office setEnvironmentModel={setEnvironmentModel} environment={environment}/>
          <Avatar setAvatarModel={setAvatarModel} avatar={avatar} />
          <GameLogic avatar={avatar}/>

        </Renderer>
      </div>
    </main>
  );
}
