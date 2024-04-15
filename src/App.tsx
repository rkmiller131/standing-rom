import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Holistic } from '@mediapipe/holistic'
import { animateVRM } from './mocap/avatarAnimator'
import { useLoader } from '@react-three/fiber'
import { VRM, VRMUtils } from '@pixiv/three-vrm'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'


export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVrm, setCurrentVrm] = useState<VRM | null>(null);
  const gltf = useLoader<GLTF, string, typeof GLTFLoader>(GLTFLoader, 'https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981'); // import the gltf and use relative path for old man avatar
  const [poseData, setPoseData] = useState(null);

  function onResults(results) {
    if (results.poseLandmarks && results.poseLandmarks.length > 0) {
      setPoseData(results.poseLandmarks);
      // drawLandmarkGuides(results)
      // animateVRM(currentVrm, results, videoRef);
    }
  }

  // useLayoutEffect(() => {
  //   if (gltf) {
  //     VRMUtils.removeUnnecessaryJoints(gltf.scene);

  //     VRM.from(gltf).then((vrm: VRM) => {
  //       setCurrentVrm(vrm);
  //       // vrm.scene.rotation.y = Math.PI; // To flip the avatar around
  //     });
  //   }
  // }, [gltf]);

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
    // holistic.send({ image: videoRef.current });

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


  return (
    <div>
      <video ref={videoRef} width="640" height="480" muted playsInline></video>
      {poseData && (
        <div>
          {/* Display pose data */}
        </div>
      )}
    </div>
  );
}
