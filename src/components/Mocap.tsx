/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from 'react';
import { useSceneState } from '../hookstate-store/SceneState';
import { VRM } from '../interfaces/THREE_Interface';
import { Holistic, Results } from '@mediapipe/holistic';
import { Camera } from '@mediapipe/camera_utils';
import { drawLandmarkGuides } from '../mocap/landmarkGuides';
import { animateVRM } from '../mocap/avatarAnimation/avatarAnimator';
import { calibrationIcons } from '../utils/cdn-links/images';
import { announcer } from '../utils/cdn-links/sounds';

import '../css/Mocap.css';

interface MocapProps {
  avatar: React.RefObject<VRM>;
  setHolisticLoaded: (loaded: boolean) => void;
}

let holistic: Holistic | null = null;
let holisticLoaded = false;

export default function Mocap({ avatar, setHolisticLoaded }: MocapProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const landmarkCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneState = useSceneState();
  const device = sceneState.device.get({ noproxy: true });

  // The event listener for Mediapipe - gets called once per frame
  function onResults(results: Results) {
    if (results.poseLandmarks && results.poseLandmarks.length > 0) {
      drawLandmarkGuides(results, videoRef, landmarkCanvasRef);

      if (avatar && avatar.current) {
        animateVRM(avatar, results);
      }

      // Small delay allowing landmarks to draw before saying we've officially loaded
      if (!holisticLoaded) {
        setTimeout(() => {
          const audio = new Audio(announcer['getReady']);
          audio.volume = 0.75;

          if (sceneState.sceneSettings.announcer.get()) {
            audio.play();
          } else if (sceneState.sceneSettings.announcer.get() === false) {
            audio.pause();
          } else {
            audio.play();
          }
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
        modelComplexity: device !== 'Desktop' ? 0 : 1,
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
  }, [device]);

  return (
    <div id="mocap-screen">
      <div
        id="mocap-container"
        className={device}
        style={
          holistic
            ? { boxShadow: '0 0 21px 0px #48abe0' }
            : { boxShadow: '0 0 21px 0px #FCE187' }
        }
      >
        <img
          src={
            holistic
              ? calibrationIcons.calibrated
              : calibrationIcons.calibrating
          }
          alt="Calibration Icon"
          className="calibration-icon"
        />
        <span
          className="calibration-text"
          style={
            holistic ? { background: '#3560F9' } : { background: '#F9CC35' }
          }
        >
          {holistic ? 'Calibrated' : 'Calibrating...'}
        </span>
        <video
          id="webcam-stream"
          ref={videoRef}
          width="100%"
          height="100%"
          muted
          playsInline
          style={
            holistic
              ? { border: '3px solid #8FE4FF' }
              : { border: '3px solid #f3d162' }
          }
        />
        <canvas id="landmark-guides" ref={landmarkCanvasRef} />
      </div>
    </div>
  );
}
