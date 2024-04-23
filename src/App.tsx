import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { VRM } from '@pixiv/three-vrm'
import Mocap from './mocap/Mocap'
import Avatar from './avatar/Avatar'
import UbiquitySVG from './assets/ubiquity.svg'
import Lighting from './environment/Lighting'
import { Office } from './environment/Office2'
import LoadingScreen from './loading/LoadingScreen'
import GameLogic from './ecs/systems/GameLogic'

import './css/App.css'


// import { useGameState } from "./ecs/store/GameState";
// import { ECS } from "./ecs/World";

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
  const [allLoaded, setAllLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  // const gameState = useGameState();

  const setAvatarModel = (vrm: VRM) => {
    avatar.current = vrm;
  };

  // useLayoutEffect(() => {
  //   gameState.startGame();
  // }, [])

  useEffect(() => {
    if (allLoaded) {
      setTimeout(() => setShowLoading(false), 1000);
    }
  }, [allLoaded]);

  return (
    <main id="app-container">
      {/* UI */}
      <img src={UbiquitySVG} alt="Ubiquity Logo" className="uvx-logo" />
      <Mocap avatar={avatar} setAllLoaded={setAllLoaded}/>

      <div className="canvas-container">
        {showLoading && <LoadingScreen allLoaded={allLoaded}/>}
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{
            position: [0, 1, 2],
            fov: 50,
            near: 1,
            far: 20,
            rotation: [0, 0, 0],
          }}
        >

          <Lighting />
          <Office />
          <Avatar setAvatarModel={setAvatarModel} avatar={avatar} />
          <GameLogic />

        </Canvas>
      </div>
    </main>
  );
}
