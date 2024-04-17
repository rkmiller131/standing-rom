import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { VRM } from '@pixiv/three-vrm'
import Mocap from './mocap/Mocap'
import Avatar from './avatar/Avatar'

import './css/App.css'

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

  const setAvatarModel = (vrm: VRM) => {
    avatar.current = vrm;
  }

  return (
    <main id="app-container">
      <Mocap avatar={avatar}/>
      <div className="canvas-container">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 1, 2], fov: 50, near: 1, far: 20, rotation: [0, 0, 0] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />

          <Avatar setAvatarModel={setAvatarModel} avatar={avatar}/>

          <axesHelper args={[5]} />
          <gridHelper args={[10, 10]} />
        </Canvas>
      </div>
    </main>
  );
}
