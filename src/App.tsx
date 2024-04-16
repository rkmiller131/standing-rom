import { useState, useEffect, useRef, useLayoutEffect, Suspense } from 'react'
import { Holistic } from '@mediapipe/holistic'
import { animateVRM } from './mocap/avatarAnimator'
import { drawLandmarkGuides } from './mocap/landmarkGuides'
import { Canvas, useFrame } from '@react-three/fiber'
import { VRM, VRMLoaderPlugin } from '@pixiv/three-vrm'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Camera } from '@mediapipe/camera_utils'

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
  // const [poseData, setPoseData] = useState(null);
  const landmarkCanvasRef = useRef<HTMLCanvasElement | null>(null)

  function onResults(results) {
    // console.log('~~ RESULTS FROM HOLISTIC ARE ', results)
    if (results.poseLandmarks && results.poseLandmarks.length > 0) {
      // setPoseData(results.poseLandmarks);
      drawLandmarkGuides(results, videoRef, landmarkCanvasRef)
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
      // '/man.gltf',
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

    // Pass holistic a callback function to handle streamed images
    holistic.onResults(onResults);

    // start webcam video stream playback
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', () => {
        videoRef.current!.play().catch(error => console.error('Video playback error: ', error));
      });
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (!videoRef.current) return;
          await holistic.send({ image: videoRef.current})
        },
        width: 300,
        height: 400
      });
      camera.start();
    }


    return () => {
      // clean up mediapipe
      holistic.close();
    };
  }, []);

  // useFrame((_state, delta) => {
  //   // if (avatar.current) {
  //   //   avatar.current.update(delta)
  //   // }

  // })

  
  return (
    <div>
      <div id="mocap-container" style={{width: 300, height: 400, position: 'absolute', zIndex: 2, bottom: '3%', left: '2%'}}>
        <video id="webcam-stream" ref={videoRef} width="100%" height="100%" muted playsInline style={{objectFit: 'cover', borderRadius: '1rem', transform: 'scaleX(-1)'}}></video>
        <canvas id="landmark-guides" ref={landmarkCanvasRef} style={{width: '100%', height: '100%', position: 'absolute', bottom: 0, left: 0}}/>
      </div>
      <div style={{ width: '100vw', height: '100vh', zIndex: 1 }}>
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 1, 2], fov: 50, near: 1, far: 20, rotation: [0, 0, 0] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            {avatar.current && (
              <primitive object={avatar.current.scene} scale={[1, 1, 1]} />
            )}
          </Suspense>
          <axesHelper args={[5]} />
          <gridHelper args={[10, 10]} />
        </Canvas>
      </div>
    </div>
  );
}
