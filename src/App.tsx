import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { VRM } from "@pixiv/three-vrm";
import Mocap from "./mocap/Mocap";
import Avatar from "./avatar/Avatar";
import UbiquitySVG from "./assets/ubiquity.svg";
import { IncandescentBulb, SpotlightWithTarget } from "./environment/lighting";
// import * as THREE from "three";
import { Office } from "./environment/Office2";

import "./css/App.css";
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
  // const gameState = useGameState();

  const setAvatarModel = (vrm: VRM) => {
    avatar.current = vrm;
  };

  // useLayoutEffect(() => {
  //   gameState.startGame();
  // }, [])

  return (
    <main id="app-container">
      {/* UI */}
      <img src={UbiquitySVG} alt="Ubiquity Logo" className="uvx-logo" />
      <Mocap avatar={avatar} />

      <div className="canvas-container">
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
          {/* Lighting */}
          <SpotlightWithTarget
            position={[-0.2, 2.32, -3.7]}
            lock={[0, -30, 0]}
          />
          <SpotlightWithTarget
            position={[-1.08, 2.32, -2.8]}
            lock={[0, -30, 0]}
          />
          <SpotlightWithTarget
            position={[1.1, 2.32, -1.5]}
            lock={[0, -30, 0]}
          />
          <SpotlightWithTarget
            position={[-1.09, 2.32, 0.67]}
            lock={[0, -30, 0]}
          />
          <IncandescentBulb position={[-1, 1.8, -2]} bulbPower="25W" />
          <IncandescentBulb position={[0, 1.8, 1]} bulbPower="25W" />

          {/* Environment */}
          <Office />

          {/* Avatar */}
          <Avatar setAvatarModel={setAvatarModel} avatar={avatar} />

          <gridHelper args={[10, 10]} />
        </Canvas>
      </div>
    </main>
  );
}
