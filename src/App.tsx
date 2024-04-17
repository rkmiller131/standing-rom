import { useRef, useLayoutEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { VRM, VRMLoaderPlugin } from '@pixiv/three-vrm'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Mocap from './mocap/Mocap'
import Avatar from './avatar/Avatar'

// https://developers.google.com/mediapipe/solutions/vision/pose_landmarker/web_js#video
// https://github.com/google/mediapipe/blob/master/docs/solutions/holistic.md
// https://glitch.com/edit/#!/kalidokit?path=script.js%3A334%3A0
// https://codesandbox.io/s/react-three-fiber-vrm-9ryxq?file=/src/index.tsx:2398-2461
// https://github.com/pixiv/three-vrm/blob/dev/docs/migration-guide-1.0.md

export default function App() {
  const avatar = useRef<VRM | null>(null);

  const setAvatarModel = (vrm: VRM) => {
    avatar.current = vrm;
    console.log('AVATAR MODEL WAS SET')
  }

  // useLayoutEffect(() => {
  //   const loader = new GLTFLoader();
  //   loader.register((parser) => {
  //     return new VRMLoaderPlugin(parser);
  //   });
  //   loader.load(
  //     'https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981',
  //     // '/man.gltf',
  //     (gltf) => {
  //       const vrm = gltf.userData.vrm;
  //       avatar.current = vrm;
  //       console.log('~~current avatar is ', avatar.current)
  //     },
  //     (progress) => console.log( 'Loading model...', 100.0 * ( progress.loaded / progress.total ), '%' ),
  //     (error) => console.error('Error Loading Avatar: ', error)
  //   )
  // }, []);

  return (
    <main id="app-container">
      <Mocap avatar={avatar}/>
      <div style={{ width: '100vw', height: '100vh', zIndex: 1 }}>
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 1, 2], fov: 50, near: 1, far: 20, rotation: [0, 0, 0] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {/* <Suspense fallback={null}>
            {avatar.current && (
              <primitive object={avatar.current.scene} scale={[1, 1, 1]} />
            )}
          </Suspense> */}
          {/* <Suspense fallback={null}>
            <Avatar setAvatarModel={setAvatarModel} avatar={avatar}/>
          </Suspense> */}

          <Avatar setAvatarModel={setAvatarModel} avatar={avatar}/>

          <axesHelper args={[5]} />
          <gridHelper args={[10, 10]} />
        </Canvas>
      </div>
    </main>
  );
}
