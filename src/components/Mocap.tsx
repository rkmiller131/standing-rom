/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect } from 'react';

import { VRM } from '../interfaces/THREE_Interface';
import { Holistic } from '@mediapipe/holistic';
import { Camera } from '@mediapipe/camera_utils';
import { drawLandmarkGuides } from '../mocap/landmarkGuides';
import { animateVRM } from '../mocap/avatarAnimation/avatarAnimator';

import '../css/Mocap.css';
import useHookstateGetters from '../interfaces/Hookstate_Interface';
import SlidingInfo from './ui/SlidingInfo';

interface MocapProps {
  avatar: React.RefObject<VRM>;
  setHolisticLoaded: (loaded: boolean) => void;
}

let holistic: Holistic | null = null;
let holisticLoaded = false;

export default function Mocap({ avatar, setHolisticLoaded }: MocapProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const landmarkCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const { getUserDevice } = useHookstateGetters();

  // The event listener for Mediapipe - gets called once per frame
  function onResults(results: any) {
    if (results.poseLandmarks && results.poseLandmarks.length > 0) {
      drawLandmarkGuides(results, videoRef, landmarkCanvasRef);

      if (avatar && avatar.current) {
        animateVRM(avatar, results);
      }

      // Small delay allowing landmarks to draw before saying we've officially loaded
      // Note, this causes a slight stutter. Could refactor later to perform a scope closure
      // check inside the drawLandmarks function itself
      if (!holisticLoaded) {
        setTimeout(() => {
          setHolisticLoaded(true);
        }, 2000);
        holisticLoaded = true;
      }
    }
  }

  useEffect(() => {
    if (holistic) return;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => console.error('getUserMedia error: ', error));
    }

    async function initializeMediapipe() {
      // use mediapipe/holistic to track pose and hand landmarks from video stream
      holistic = new Holistic({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1675471629/${file}`,
      });

      holistic.setOptions({
        modelComplexity: getUserDevice() !== 'Desktop' ? 0 : 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
        selfieMode: true,
      });

      // Pass holistic a callback function to handle streamed video data
      holistic.onResults(onResults);

      // start webcam video stream playback
      if (videoRef.current) {
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef
            .current!.play()
            .catch((error) => console.error('Video playback error: ', error));
        });
        // use mediapipe camera utils to start the onResults function
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (!holistic || !videoRef.current) return;
            await holistic.send({ image: videoRef.current });
          },
          width: 450,
          height: 300,
        });
        camera.start();
      }
    }

    initializeMediapipe();

    return () => {
      // clean up mediapipe when Mocap unmounts.
      if (holistic) holistic.close();
    };
  }, [getUserDevice]);

  return (
    <div className="post-setup-screen">
      <SlidingInfo />
      <div id="mocap-container" className={getUserDevice()}>
        <video
          id="webcam-stream"
          ref={videoRef}
          width="100%"
          height="100%"
          muted
          playsInline
        ></video>
        <canvas id="landmark-guides" ref={landmarkCanvasRef} />
      </div>
    </div>
  );
}
