import { useState, useEffect, useRef, useLayoutEffect, Suspense } from 'react'
import { Holistic } from '@mediapipe/holistic'
import { animateVRM } from './mocap/avatarAnimator'
import { Canvas, useFrame } from '@react-three/fiber'
import { VRM, VRMLoaderPlugin } from '@pixiv/three-vrm'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Vector3 } from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

// https://developers.google.com/mediapipe/solutions/vision/pose_landmarker/web_js#video
// https://github.com/google/mediapipe/blob/master/docs/solutions/holistic.md
// https://glitch.com/edit/#!/kalidokit?path=script.js%3A334%3A0
// https://codesandbox.io/s/react-three-fiber-vrm-9ryxq?file=/src/index.tsx:2398-2461
// https://github.com/pixiv/three-vrm/blob/dev/docs/migration-guide-1.0.md

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // const [currentVrm, setCurrentVrm] = useState<VRM | null>(null);
  const avatar = useRef<VRM | null>(null);
  const [poseData, setPoseData] = useState(null);

  function onResults(results) {
    console.log('~~ RESULTS FROM HOLISTIC ARE ', results)
    if (results.poseLandmarks && results.poseLandmarks.length > 0) {
      setPoseData(results.poseLandmarks);
      // drawLandmarkGuides(results)
      // animateVRM(avatar, results, videoRef);
    }
  }

  useLayoutEffect(() => {
    const loader = new GLTFLoader();
    loader.register((parser) => {
      return new VRMLoaderPlugin(parser);
    });
    loader.load(
      'https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981',
      (gltf) => {
        const vrm = gltf.userData.vrm;
        avatar.current = vrm;
        console.log('~~current avatar is ', avatar.current)
      },
      (progress) => console.log( 'Loading model...', 100.0 * ( progress.loaded / progress.total ), '%' ),
      (error) => console.error('Error Loading Avatar: ', error)
    )
  }, []);

  useEffect(() => {
    // grab the video stream from client webcam
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }).catch(error => console.error('getUserMedia error: ', error));
    }

    // use mediapipe/holistic to track pose and hand landmarks from video stream
    const holistic = new Holistic({
      locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1675471629/${file}`
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
      refineFaceLandmarks: true,
      selfieMode: true,
    });
    // Pass holistic a callback function
    holistic.onResults(onResults);

    // start webcam video stream playback
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', () => {
        videoRef.current!.play().catch(error => console.error('Video playback error: ', error));
      });
    }

    return () => {
      // clean up mediapipe
      holistic.close();
    };
  }, []);

  // useFrame(({ clock }, delta) => {
  //   if (avatar.current) {
  //     avatar.current.update(delta)
  //   }
  // })

  return (
    <div>
      <video ref={videoRef} width="380" height="480" muted playsInline style={{position: 'fixed', display: 'flex', zIndex: 2}}></video>
      <div style={{ width: '100vw', height: '100vh' }}>
        <Canvas camera={{fov: 75, position: [0, 1, 2]}}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {/* <OrbitControls /> */}
          {/* <perspectiveCamera position={[0, 10, 5]} /> */}
          <Suspense fallback={null}>
            {avatar.current && (
              <primitive object={avatar.current.scene} scale={[2, 2, 2]} />
            )}
          </Suspense>
          <axesHelper args={[5]} />
          <gridHelper args={[10, 10]} />
        </Canvas>
      </div>
    </div>
  );
}
