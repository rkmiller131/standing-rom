/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect } from 'react'
import { drawLandmarkGuides } from './landmarkGuides'
import { Holistic } from '@mediapipe/holistic'
import { Camera } from '@mediapipe/camera_utils'
import { animateVRM } from '../avatar/avatarAnimator'
import { VRM } from '@pixiv/three-vrm'

import '../css/Mocap.css'
interface MocapProps {
  avatar: React.RefObject<VRM>;
  setAllLoaded: (loaded: boolean) => void;
}

export default function Mocap({ avatar, setAllLoaded }: MocapProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const landmarkCanvasRef = useRef<HTMLCanvasElement | null>(null);
    let holisticLoaded = false;

    function onResults(results: any) {
        if (results.poseLandmarks && results.poseLandmarks.length > 0) {
          drawLandmarkGuides(results, videoRef, landmarkCanvasRef)
          if (avatar && avatar.current) {
            animateVRM(avatar, results, videoRef);
          }
        }
        if (!holisticLoaded) {
          setAllLoaded(true);
          holisticLoaded = true;
        }
    }

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
          // use mediapipe camera utils to start the onResults function
          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (!videoRef.current) return;
              await holistic.send({ image: videoRef.current})
            },
            width: 450,
            height: 300
          });
          camera.start();
        }
    
        return () => {
          // clean up mediapipe
          holistic.close();
        };

      }, []);

    return (
        <div id="mocap-container">
            <video id="webcam-stream" ref={videoRef} width="100%" height="100%" muted playsInline></video>
            <canvas id="landmark-guides" ref={landmarkCanvasRef}/>
        </div>
    );
}